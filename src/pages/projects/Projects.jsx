import { useContext, useEffect, useMemo, useState, useCallback } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { UserContext } from '../../context/UserContext.jsx'

import EmployeeProjectsView from '../../components/projects/views/EmployeeProjectsView.jsx'
import TLProjectsView from '../../components/projects/views/TLProjectsView.jsx'
import HRProjectsView from '../../components/projects/views/HRProjectsView.jsx'
import CEOProjectsView from '../../components/projects/views/CEOProjectsView.jsx'

import ProjectCreateModal from '../../components/projects/modals/ProjectCreateModal.jsx'
import TLProjectRequestModal from '../../components/projects/modals/TLProjectRequestModal.jsx'
import TaskWorkUpdateModal from '../../components/projects/modals/TaskWorkUpdateModal.jsx'
import TaskApprovalModal from '../../components/projects/modals/TaskApprovalModal.jsx'
import ProjectClosureModal from '../../components/projects/modals/ProjectClosureModal.jsx'
import TaskChangeReviewModal from '../../components/projects/modals/TaskChangeReviewModal.jsx'
import TaskDetailModal from '../../components/projects/modals/TaskDetailModal.jsx'

import { projectsApi } from '../../services/api/index.js'
import formatApiError from '../../utils/formatApiError.js'
import downloadDeliverable from '../../utils/downloadDeliverable.js'
import { dispatchProjectNotification } from '../../utils/projectNotificationService.js'

// Maps one backend approval-queue CHANGE item to the review object TaskChangeReviewModal reads.
// Authorization: the approval queue returns only items the backend's may_decide_stage allows this viewer to decide, so
// can_decide is set here and only here. An item without an item_id or a project_id cannot be acted on, so it is shown as
// not decidable. Task rows keep the per-row can_decide the backend sends.
function toChangeReview(item) {
  const projectId = item.project_id ?? item.projectId ?? null
  const changeId = item.item_id ?? null
  return {
    ...item,
    project_id: projectId,
    projectId,
    open_change_request: {
      id: changeId,
      item_id: changeId,
      operation: item.operation ?? null,
      stage: item.stage ?? null,
      state: 'PENDING',
      requested_by_id: item.requested_by_id ?? null,
      requested_by_name: item.requested_by_name ?? null,
      requested_at: item.requested_at ?? null,
      can_decide: changeId !== null && projectId !== null,
    },
  }
}

function Projects() {
  const { user, refreshUser } = useContext(UserContext)

  const currentUser = useMemo(() => user || {
    id: null,
    name: '',
    role: 'EMPLOYEE',
    can_create_projects: false,
    canCreateProjects: false,
  }, [user])

  // Real backend projects state
  const [projects, setProjects] = useState([])
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(20)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  // Real approval queue items from E35
  const [approvalQueue, setApprovalQueue] = useState([])

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isCreatingProject, setIsCreatingProject] = useState(false)
  const [createError, setCreateError] = useState(null)

  const [isTLRequestModalOpen, setIsTLRequestModalOpen] = useState(false)
  const [editingRequest, setEditingRequest] = useState(null)
  const [projectRequests, setProjectRequests] = useState([])

  const [activeUpdateTask, setActiveUpdateTask] = useState(null)
  const [activeDetailTask, setActiveDetailTask] = useState(null)
  const [activeApprovalTask, setActiveApprovalTask] = useState(null)
  const [activeClosureProject, setActiveClosureProject] = useState(null)
  const [activeChangeReviewTask, setActiveChangeReviewTask] = useState(null)
  const [isModalSubmitting, setIsModalSubmitting] = useState(false)
  const [modalActionError, setModalActionError] = useState(null)

  // Fetch projects list (E01 GET), approval queue (E35 GET), and project requests
  const fetchProjectsData = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    // Helper to fetch all pages for listing endpoints
    const fetchAllPages = async (fetcher, initialParams = {}) => {
      let page = 1
      let results = []
      while (true) {
        const res = await fetcher({ ...initialParams, page, page_size: 100 })
        const data = res?.data ?? res
        if (Array.isArray(data)) return data
        const items = data?.results || []
        results = results.concat(items)
        if (!data?.next || results.length >= (data?.count || 0) || items.length === 0) break
        page += 1
      }
      return results
    }

    try {
      const [projectsRes, queueRes, requestsRes] = await Promise.allSettled([
        projectsApi.getProjects({ page: currentPage, page_size: pageSize }),
        fetchAllPages((params) => projectsApi.getApprovalQueue(params)),
        fetchAllPages((params) => projectsApi.getProjectRequests(params)),
      ])

      if (projectsRes.status === 'fulfilled') {
        const data = projectsRes.value.data
        const rawList = Array.isArray(data) ? data : (data?.results || [])

        // Concurrently fetch tasks and members for each project so task metrics and PM roles are populated
        const [tasksResults, membersResults] = await Promise.all([
          Promise.allSettled(rawList.map((p) => fetchAllPages((params) => projectsApi.getTasks(p.id, params)))),
          Promise.allSettled(rawList.map((p) => fetchAllPages((params) => projectsApi.getMembers(p.id, { ...params, include_inactive: false })))),
        ])

        const projectsWithDetails = rawList.map((p, idx) => {
          const tRes = tasksResults[idx]
          const taskList = tRes?.status === 'fulfilled' ? tRes.value : []

          const mRes = membersResults[idx]
          const memberList = mRes?.status === 'fulfilled' ? mRes.value : []

          const primaryPmMember = memberList.find((m) => m.is_current_pm || m.isPm)

          return {
            ...p,
            tasks: taskList,
            members: memberList,
            primaryPm: primaryPmMember ? (primaryPmMember.name || primaryPmMember.full_name) : p.primaryPm,
            primaryPmId: primaryPmMember ? (primaryPmMember.user_id || primaryPmMember.id) : (p.primary_pm_id || p.primaryPmId),
          }
        })

        setProjects(projectsWithDetails)
        setTotalCount(data?.count || rawList.length)
      } else {
        const errMsg = formatApiError(projectsRes.reason, 'Failed to fetch projects list')
        setError(errMsg)
      }

      if (queueRes.status === 'fulfilled') {
        const qItems = Array.isArray(queueRes.value) ? queueRes.value : (queueRes.value?.results || [])
        const normalizedQueue = qItems.map((item) => ({
          ...item,
          id: item.task_id || item.id,
          task_id: item.task_id || item.id,
          submissionId: item.item_id || item.submission_id,
          item_id: item.item_id,
          projectId: item.project_id || item.projectId,
          project_id: item.project_id || item.projectId,
          name: item.task_name || item.name || item.title || `Task #${item.task_id || item.id}`,
          title: item.task_name || item.name || item.title || `Task #${item.task_id || item.id}`,
          projectTitle: item.project_name || item.projectName || (item.project_id ? `Project #${item.project_id}` : ''),
          assignee: item.assignee_name || item.assignee || 'Unknown assignee',
          requested_by_name: item.requested_by_name || 'Unknown requester',
          assignee_id: item.assignee_id,
        }))
        setApprovalQueue(normalizedQueue)
      } else {
        console.warn('Could not load approvals queue:', queueRes.reason)
        setApprovalQueue([])
        const queueErrMsg = formatApiError(queueRes.reason, 'Failed to fetch approval queue')
        setError(queueErrMsg)
      }

      if (requestsRes.status === 'fulfilled') {
        const rItems = Array.isArray(requestsRes.value) ? requestsRes.value : (requestsRes.value?.results || [])
        setProjectRequests(rItems)
      } else {
        console.warn('Could not load project creation requests:', requestsRes.reason)
        setProjectRequests([])
      }
    } catch (err) {
      setError(formatApiError(err, 'Failed to load projects workspace'))
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, pageSize])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchProjectsData()
    if (typeof refreshUser === 'function') {
      void refreshUser()
    }
  }, [fetchProjectsData, refreshUser])

  // Enriched projects adapting real backend serializer fields with safe fallbacks
  const enrichedProjects = useMemo(() => {
    return (projects || []).map((p) => {
      const activeTasks = (p.tasks || []).filter((t) => t.status !== 'CANCELLED')
      const completedTasks = activeTasks.filter((t) => t.status === 'COMPLETED')
      const mathProgress = activeTasks.length > 0
        ? Math.round((completedTasks.length / activeTasks.length) * 100)
        : (p.progress || 0)

      return {
        ...p,
        title: p.name || p.title || 'Untitled Project',
        name: p.name || p.title || 'Untitled Project',
        dueDate: p.target_end_date || p.dueDate || 'TBD',
        target_end_date: p.target_end_date || p.dueDate,
        membersCount: p.active_member_count ?? p.membersCount ?? (p.members?.length || 0),
        active_member_count: p.active_member_count ?? p.membersCount ?? (p.members?.length || 0),
        staffingMode: p.staffing_mode || p.staffingMode || 'TEAM',
        staffing_mode: p.staffing_mode || p.staffingMode || 'TEAM',
        activeTasksCount: activeTasks.length,
        completedTasksCount: completedTasks.length,
        openTasksCount: activeTasks.filter((t) => t.status !== 'COMPLETED').length,
        progress: mathProgress,
      }
    })
  }, [projects])

  // Flattened tasks across loaded projects
  const allTasks = useMemo(() => {
    const list = []
    enrichedProjects.forEach((p) => {
      (p.tasks || []).forEach((t) => {
        const assigneeName = typeof t.assignee === 'string'
          ? t.assignee
          : (t.assignee?.name || t.assignee_name || 'Unassigned')
        const assigneeId = t.assignee_id || t.assigneeId || (typeof t.assignee === 'object' ? t.assignee?.id : (typeof t.assignee === 'number' ? t.assignee : undefined))

        const reworkCount = Number(t.rejection_count ?? t.rework_count ?? t.reworkCount ?? 0)
        const rawFeedback = t.rejection_feedback || t.latest_rejection_reason || t.rejection_reason || t.rework_reason || ''
        const isQualityRisk = Boolean(t.quality_risk || reworkCount >= 3)
        const isRejected = (t.status === 'IN_PROGRESS' || t.status === 'REJECTED') && (reworkCount > 0 || Boolean(rawFeedback))
        const rejectionFeedback = rawFeedback || (isRejected ? 'Deliverable was rejected by reviewer. Please make the requested updates and resubmit.' : '')

        list.push({
          ...t,
          title: t.title || t.name,
          name: t.name || t.title,
          assignee: assigneeName,
          assigneeId: assigneeId,
          assignee_id: assigneeId,
          dueDate: t.due_date || t.dueDate || 'TBD',
          projectTitle: p.title || p.name,
          projectId: p.id,
          project_id: p.id,
          primaryPm: p.primaryPm,
          primaryPmId: p.primaryPmId,
          teamLead: p.teamLead,
          teamLeadId: p.team_lead_id || p.teamLeadId,
          members: p.members,
          isIndependent: p.staffingMode === 'SOLO',
          reworkCount,
          rework_count: reworkCount,
          rejection_count: reworkCount,
          isQualityRisk,
          quality_risk: isQualityRisk,
          rejectionFeedback,
          rejection_feedback: rejectionFeedback,
          isRejected,
          displayStatus: isRejected ? 'REJECTED' : t.status,
          rejectedBy: t.latest_rejected_by || t.rejected_by || 'Reviewer',
        })
      })
    })
    return list
  }, [enrichedProjects])

  // Team Leader TCR reviews queue (Stage 1) - Exclusive source: approvalQueue
  const tlTcrReviews = useMemo(() => {
    return approvalQueue
      .filter((item) => item.type === 'CHANGE' && item.stage === 'TL')
      .map(toChangeReview)
  }, [approvalQueue])

  // Executive / PM TCR reviews queue - Exclusive source: approvalQueue
  const executiveTcrReviews = useMemo(() => {
    return approvalQueue
      .filter((item) => item.type === 'CHANGE' && (item.stage === 'PM' || item.stage === 'DIRECT'))
      .map(toChangeReview)
  }, [approvalQueue])

  // Role-scoped data filters
  const employeeProjects = useMemo(() => {
    const curId = currentUser?.id ? String(currentUser.id) : ''
    return enrichedProjects.filter((p) => {
      if (!p.members || p.members.length === 0) return true
      return p.members.some((m) => curId && String(m.id || m.user_id) === curId)
    })
  }, [enrichedProjects, currentUser])

  const myTasks = useMemo(() => {
    const curId = currentUser?.id ? String(currentUser.id) : ''
    if (!curId) return []

    return allTasks.filter((t) => {
      return String(t.assignee_id || t.assigneeId || '') === curId
    })
  }, [allTasks, currentUser])

  const teamReviews = useMemo(() => {
    const queueCompletions = approvalQueue.filter(
      (item) => item.type === 'COMPLETION' && (item.stage === 'TL' || item.stage === 'PM' || item.stage === 'DIRECT')
    )
    if (queueCompletions.length > 0) return queueCompletions

    const pendingReviewStatuses = [
      'PENDING_TL_REVIEW',
      'PENDING_PM_APPROVAL',
      'DIRECT_APPROVAL_REQUIRED',
      'PENDING_CEO_APPROVAL',
    ]

    const curId = String(currentUser?.id || '')

    return allTasks.filter((t) => {
      const statusUpper = String(t.status || '').trim().toUpperCase()
      // Must be in one of the pending review statuses
      if (!pendingReviewStatuses.includes(statusUpper)) return false

      // Enforce zero self-approval: cannot review own tasks
      const isAssignee = Boolean(curId && String(t.assignee_id || t.assigneeId || '') === curId)
      if (isAssignee) return false

      return true
    })
  }, [approvalQueue, allTasks, currentUser])

  const pendingClosures = useMemo(() => {
    return enrichedProjects.filter((p) => {
      const s = String(p.status || '').trim().toUpperCase()
      return s === 'PENDING_CEO_CLOSURE'
    })
  }, [enrichedProjects])

  const directApprovals = useMemo(() => {
    const queueCompletions = approvalQueue.filter(
      (item) => item.type === 'COMPLETION' && (item.stage === 'PM' || item.stage === 'DIRECT')
    )
    if (queueCompletions.length > 0) return queueCompletions
    return allTasks.filter((t) => {
      const statusUpper = String(t.status || '').trim().toUpperCase()
      return ['DIRECT_APPROVAL_REQUIRED', 'PENDING_CEO_APPROVAL', 'PENDING_PM_APPROVAL'].includes(statusUpper)
    })
  }, [approvalQueue, allTasks])

  // E01 POST: Real Project Creation via API
  const handleCreateProject = async (formData) => {
    setIsCreatingProject(true)
    setCreateError(null)

    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        start_date: formData.start_date || formData.startDate,
        target_end_date: formData.target_end_date || formData.targetEndDate,
        staffing_mode: currentUser.role === 'CEO' ? (formData.staffing_mode || 'TEAM') : 'TEAM',
      }

      const res = await projectsApi.createProject(payload)
      const createdProject = res.data

      // If designated initial PM on creation (CEO only)
      let pmAssignmentWarning = null
      if (formData.assignedPmId && currentUser.role === 'CEO' && createdProject?.id) {
        try {
          const pmUserId = parseInt(formData.assignedPmId, 10)
          if (!isNaN(pmUserId)) {
            await projectsApi.addMember(createdProject.id, { user_id: pmUserId })
            if (payload.staffing_mode === 'TEAM') {
              await projectsApi.assignPrimaryPM(createdProject.id, {
                user_id: pmUserId,
                reason: 'Designated primary PM during project creation',
              })
            }
          }
        } catch (assignErr) {
          console.warn('Initial PM assignment note:', assignErr)
          pmAssignmentWarning = formatApiError(assignErr, 'Failed to assign designated initial PM')
        }
      }

      setIsCreateModalOpen(false)
      dispatchProjectNotification({
        title: '📁 New Project Created',
        message: `Project "${payload.name}" was successfully created.${pmAssignmentWarning ? ' Note: PM assignment requires attention.' : ''}`,
        type: pmAssignmentWarning ? 'warning' : 'success',
        targetRole: 'ALL',
        link: `/projects/${createdProject.id}`,
      })

      if (pmAssignmentWarning) {
        alert(`Project "${payload.name}" was created successfully, but initial PM assignment could not be completed automatically: ${pmAssignmentWarning}. Please assign the PM via the Project Details workspace.`)
      }

      await fetchProjectsData()
    } catch (err) {
      const formatted = formatApiError(err, 'Failed to create project')
      setCreateError(formatted)
    } finally {
      setIsCreatingProject(false)
    }
  }

  // TL submits or resubmits a project creation request via real backend API
  const handleTLSubmitRequest = async (requestData) => {
    setIsCreatingProject(true)
    setCreateError(null)

    try {
      const payload = {
        name: requestData.name,
        project_name: requestData.name,
        description: requestData.description,
        proposed_start_date: requestData.proposed_start_date,
        proposed_end_date: requestData.proposed_end_date || requestData.proposed_target_end_date,
        business_justification: requestData.business_justification || requestData.justification,
      }

      if (requestData.requestId) {
        // Resubmit returned request via dedicated POST /project-requests/:id/resubmit/
        await projectsApi.resubmitProjectRequest(requestData.requestId, payload)
        dispatchProjectNotification({
          title: '📋 Project Request Resubmitted',
          message: `Your updated proposal for "${requestData.name}" has been resubmitted for CEO review.`,
          type: 'info',
          targetRole: 'CEO',
          link: '/projects',
        })
      } else {
        // New project creation request
        await projectsApi.createProjectRequest(payload)
        dispatchProjectNotification({
          title: '📋 New Project Request',
          message: `Team Leader ${currentUser.name || 'TL'} submitted a project creation request for "${requestData.name}".`,
          type: 'info',
          targetRole: 'CEO',
          link: '/projects',
        })
      }

      setIsTLRequestModalOpen(false)
      setEditingRequest(null)
      await fetchProjectsData()
    } catch (err) {
      setCreateError(formatApiError(err, 'Failed to submit project creation request.'))
    } finally {
      setIsCreatingProject(false)
    }
  }

  // CEO approves TL project request via real backend API (/project-requests/:id/approve/)
  const handleApproveProjectRequest = async (requestId) => {
    try {
      await projectsApi.approveProjectRequest(requestId)
      dispatchProjectNotification({
        title: '🎉 Project Request Approved',
        message: 'The project request was approved by CEO and initialized in the workspace.',
        type: 'success',
        targetRole: 'ALL',
        link: '/projects',
      })
      await fetchProjectsData()
    } catch (err) {
      alert(formatApiError(err, 'Failed to approve project creation request.'))
    }
  }

  // CEO rejects TL project request via real backend API (/project-requests/:id/reject/)
  const handleRejectProjectRequest = async (requestId, reason) => {
    try {
      await projectsApi.rejectProjectRequest(requestId, reason)
      dispatchProjectNotification({
        title: '❌ Project Request Declined',
        message: `Project proposal was declined by CEO: "${reason}".`,
        type: 'warning',
        targetRole: 'TL',
        link: '/projects',
      })
      await fetchProjectsData()
    } catch (err) {
      alert(formatApiError(err, 'Failed to reject project creation request.'))
    }
  }

  // CEO returns request for clarification (/project-requests/:id/return/)
  const handleReturnProjectRequest = async (requestId, reasonOrPayload) => {
    try {
      const note = typeof reasonOrPayload === 'string'
        ? reasonOrPayload
        : (reasonOrPayload?.note || reasonOrPayload?.reason || '')
      await projectsApi.returnProjectRequest(requestId, { note })
      dispatchProjectNotification({
        title: '⚠️ Project Request Clarification Required',
        message: `CEO returned your proposal for clarification: "${note}".`,
        type: 'info',
        targetRole: 'TL',
        link: '/projects',
      })
      await fetchProjectsData()
    } catch (err) {
      alert(formatApiError(err, 'Failed to return project creation request for clarification.'))
    }
  }

  // TL withdraws their own request (/project-requests/:id/withdraw/)
  const handleWithdrawRequest = async (requestId, reason = 'Withdrawn by requester') => {
    try {
      await projectsApi.withdrawProjectRequest(requestId, reason)
      await fetchProjectsData()
    } catch (err) {
      alert(formatApiError(err, 'Failed to withdraw project creation request.'))
    }
  }

  // Modals action handlers
  const handleWorkUpdate = async ({ taskId, payload, isMultipart } = {}) => {
    const projId = activeUpdateTask?.projectId || activeUpdateTask?.project_id || activeUpdateTask?.project
    const targetTaskId = taskId || activeUpdateTask?.id
    if (!projId || !targetTaskId) {
      console.error('Missing projectId or taskId for work update', { activeUpdateTask, taskId })
      return
    }
    setIsModalSubmitting(true)
    setModalActionError(null)
    try {
      await projectsApi.recordWorkUpdate(projId, targetTaskId, payload, isMultipart)

      const rawProgress = isMultipart && typeof payload?.get === 'function'
        ? payload.get('progress')
        : (payload?.progress ?? activeUpdateTask?.progress ?? 0)
      const progressNum = Number(rawProgress)
      const isComplete = progressNum >= 100
      const employeeName = currentUser?.name || 'Assignee'
      const taskName = activeUpdateTask?.name || activeUpdateTask?.title || 'Task'
      const projectName = activeUpdateTask?.projectTitle || activeUpdateTask?.projectName || 'Project'

      // 1. Real-time alert to TL and PM leadership
      dispatchProjectNotification({
        title: isComplete ? '🎯 100% Deliverable Submitted' : '📈 Work Progress Updated',
        message: isComplete
          ? `"${employeeName}" submitted final 100% completion deliverables for task "${taskName}" in project "${projectName}". Review required.`
          : `"${employeeName}" updated work progress to ${progressNum}% on task "${taskName}" in project "${projectName}".`,
        type: isComplete ? 'warning' : 'info',
        targetRole: 'TL_PM',
        link: `/projects/${projId}`,
      })

      // 2. Direct confirmation for the employee submitter
      if (currentUser?.role === 'EMPLOYEE') {
        dispatchProjectNotification({
          title: '✅ Progress Update Sent',
          message: `Your update (${progressNum}%) for task "${taskName}" has been submitted to your Team Leader / PM.`,
          type: 'success',
          targetRole: 'EMPLOYEE',
          targetUserId: currentUser.id,
          targetUserName: currentUser.name,
          link: `/projects/${projId}`,
        })
      }
      setActiveUpdateTask(null)
      await fetchProjectsData()
    } catch (err) {
      const errMsg = formatApiError(err, 'Failed to record work update.')
      setModalActionError(errMsg)
    } finally {
      setIsModalSubmitting(false)
    }
  }

  const handleApproveTask = async ({ taskId, submissionId, reason } = {}) => {
    const projId = activeApprovalTask?.projectId || activeApprovalTask?.project_id || activeApprovalTask?.project
    const targetTaskId = taskId || activeApprovalTask?.id
    const targetSubId =
      submissionId ||
      activeApprovalTask?.submissionId ||
      activeApprovalTask?.item_id ||
      activeApprovalTask?.submission_id ||
      activeApprovalTask?.open_completion_submission?.id

    if (!projId || !targetTaskId) return
    if (!targetSubId) {
      setModalActionError('Cannot process decision: Active completion submission ID is missing. Task ID fallback is prohibited by backend contract.')
      return
    }

    setIsModalSubmitting(true)
    setModalActionError(null)
    try {
      await projectsApi.decideCompletion(projId, targetTaskId, targetSubId, {
        decision: 'APPROVE',
        reason: reason || undefined,
      })
      dispatchProjectNotification({
        title: '✅ Deliverable Approved',
        message: `Deliverable for task "${activeApprovalTask?.name || activeApprovalTask?.title || 'Task'}" was approved by ${currentUser?.name || 'Reviewer'}.`,
        type: 'success',
        targetRole: 'EMPLOYEE',
        targetUserId: activeApprovalTask?.assigneeId || activeApprovalTask?.assignee_id,
        targetUserName: activeApprovalTask?.assignee,
        link: `/projects/${projId}`,
      })
      setActiveApprovalTask(null)
      await fetchProjectsData()
    } catch (err) {
      const errMsg = formatApiError(err, 'Failed to approve task completion.')
      setModalActionError(errMsg)
    } finally {
      setIsModalSubmitting(false)
    }
  }

  const handleRejectTask = async ({ taskId, submissionId, reason } = {}) => {
    const projId = activeApprovalTask?.projectId || activeApprovalTask?.project_id || activeApprovalTask?.project
    const targetTaskId = taskId || activeApprovalTask?.id
    const targetSubId =
      submissionId ||
      activeApprovalTask?.submissionId ||
      activeApprovalTask?.item_id ||
      activeApprovalTask?.submission_id ||
      activeApprovalTask?.open_completion_submission?.id

    if (!projId || !targetTaskId) return
    if (!targetSubId) {
      setModalActionError('Cannot process decision: Active completion submission ID is missing. Task ID fallback is prohibited by backend contract.')
      return
    }

    setIsModalSubmitting(true)
    setModalActionError(null)
    try {
      await projectsApi.decideCompletion(projId, targetTaskId, targetSubId, {
        decision: 'REJECT',
        reason,
      })
      dispatchProjectNotification({
        title: '❌ Deliverable Rejected (Rework Required)',
        message: `Deliverable for task "${activeApprovalTask?.name || activeApprovalTask?.title || 'Task'}" was rejected: "${reason || 'Needs revisions'}".`,
        type: 'error',
        targetRole: 'EMPLOYEE',
        targetUserId: activeApprovalTask?.assigneeId || activeApprovalTask?.assignee_id,
        targetUserName: activeApprovalTask?.assignee,
        link: `/projects/${projId}`,
      })
      setActiveApprovalTask(null)
      await fetchProjectsData()
    } catch (err) {
      const errMsg = formatApiError(err, 'Failed to reject task completion.')
      setModalActionError(errMsg)
    } finally {
      setIsModalSubmitting(false)
    }
  }

  const handleDownloadDeliverableFile = async (submissionId, fileId, originalName) => {
    const projId = activeApprovalTask?.projectId || activeApprovalTask?.project_id || activeApprovalTask?.project
    const targetTaskId = activeApprovalTask?.id
    if (!projId || !targetTaskId) return
    try {
      await downloadDeliverable(projId, targetTaskId, submissionId, fileId, originalName)
    } catch (err) {
      setModalActionError(formatApiError(err, 'Failed to download deliverable file.'))
    }
  }

  const handleApproveClosure = async (projId) => {
    const targetId = projId || activeClosureProject?.id
    if (!targetId) return
    setIsModalSubmitting(true)
    setModalActionError(null)
    try {
      await projectsApi.approveClosure(targetId)
      dispatchProjectNotification({
        title: '🏁 Project Closed',
        message: `Project closure was approved by CEO. Project is now marked COMPLETED.`,
        type: 'success',
        targetRole: 'ALL',
        link: `/projects/${targetId}`,
      })
      setActiveClosureProject(null)
      await fetchProjectsData()
    } catch (err) {
      const errMsg = formatApiError(err, 'Failed to approve project closure.')
      setModalActionError(errMsg)
    } finally {
      setIsModalSubmitting(false)
    }
  }

  const handleRejectClosure = async (projId, reason) => {
    const targetId = projId || activeClosureProject?.id
    if (!targetId) return
    setIsModalSubmitting(true)
    setModalActionError(null)
    try {
      await projectsApi.rejectClosure(targetId, reason)
      dispatchProjectNotification({
        title: '⚠️ Project Closure Rejected',
        message: `CEO rejected project closure: "${reason || 'Blockers must be resolved first'}".`,
        type: 'warning',
        targetRole: 'PM',
        link: `/projects/${targetId}`,
      })
      setActiveClosureProject(null)
      await fetchProjectsData()
    } catch (err) {
      const errMsg = formatApiError(err, 'Failed to reject project closure.')
      setModalActionError(errMsg)
    } finally {
      setIsModalSubmitting(false)
    }
  }

  const handleApproveTaskChange = async ({ requestId, reason } = {}) => {
    const projId = activeChangeReviewTask?.projectId || activeChangeReviewTask?.project_id || activeChangeReviewTask?.project
    const reqId = requestId || activeChangeReviewTask?.open_change_request?.id
    // Strict review-object authorization: act only when this review object says the viewer may decide it.
    if (activeChangeReviewTask?.open_change_request?.can_decide !== true) return
    if (!projId || !reqId) return
    setIsModalSubmitting(true)
    setModalActionError(null)
    try {
      await projectsApi.decideChangeRequest(projId, reqId, {
        decision: 'APPROVE',
        reason: reason || undefined,
      })
      dispatchProjectNotification({
        title: '✅ Task Change Approved',
        message: `Change request for task "${activeChangeReviewTask?.name || activeChangeReviewTask?.title || 'Task'}" has been approved.`,
        type: 'success',
        targetRole: 'EMPLOYEE',
        targetUserName: activeChangeReviewTask?.open_change_request?.requested_by_name || 'Unknown requester',
        link: `/projects/${projId}`,
      })
      setActiveChangeReviewTask(null)
      await fetchProjectsData()
    } catch (err) {
      const errMsg = formatApiError(err, 'Failed to approve task change request.')
      setModalActionError(errMsg)
    } finally {
      setIsModalSubmitting(false)
    }
  }

  const handleRejectTaskChange = async ({ requestId, reason } = {}) => {
    const projId = activeChangeReviewTask?.projectId || activeChangeReviewTask?.project_id || activeChangeReviewTask?.project
    const reqId = requestId || activeChangeReviewTask?.open_change_request?.id
    // Strict review-object authorization: act only when this review object says the viewer may decide it.
    if (activeChangeReviewTask?.open_change_request?.can_decide !== true) return
    if (!projId || !reqId) return
    setIsModalSubmitting(true)
    setModalActionError(null)
    try {
      await projectsApi.decideChangeRequest(projId, reqId, {
        decision: 'REJECT',
        reason,
      })
      dispatchProjectNotification({
        title: '❌ Task Change Rejected',
        message: `Change request for task "${activeChangeReviewTask?.name || activeChangeReviewTask?.title || 'Task'}" was rejected: "${reason || 'No reason provided'}".`,
        type: 'warning',
        targetRole: 'EMPLOYEE',
        targetUserName: activeChangeReviewTask?.open_change_request?.requested_by_name || 'Unknown requester',
        link: `/projects/${projId}`,
      })
      setActiveChangeReviewTask(null)
      await fetchProjectsData()
    } catch (err) {
      const errMsg = formatApiError(err, 'Failed to reject task change request.')
      setModalActionError(errMsg)
    } finally {
      setIsModalSubmitting(false)
    }
  }

  return (
    <DashboardLayout>
      {/* Loading Skeleton */}
      {isLoading && projects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#2563eb] border-t-transparent" />
          <p className="text-sm font-semibold text-[#6b7280]">Loading project workspace...</p>
        </div>
      )}

      {/* Global Error State */}
      {error && (
        <div className="my-8 rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-base font-bold text-red-800">Workspace Error</p>
          <p className="mt-1 text-sm text-red-600">{error}</p>
          <button
            type="button"
            onClick={fetchProjectsData}
            className="mt-4 rounded-full bg-red-600 px-6 py-2 text-xs font-bold text-white hover:bg-red-700"
          >
            Retry Loading
          </button>
        </div>
      )}

      {/* 1. EMPLOYEE DASHBOARD VIEW */}
      {!isLoading && currentUser.role === 'EMPLOYEE' && (
        <EmployeeProjectsView
          projects={employeeProjects}
          myTasks={myTasks}
          onOpenUpdateModal={(t) => setActiveUpdateTask(t)}
          onOpenDetailModal={(t) => setActiveDetailTask(t)}
        />
      )}

      {/* 2. TEAM LEADER (TL) DASHBOARD VIEW */}
      {!isLoading && currentUser.role === 'TL' && (
        <TLProjectsView
          projects={enrichedProjects}
          teamReviews={teamReviews}
          tcrReviews={tlTcrReviews}
          myTasks={myTasks}
          tlProjectRequests={projectRequests}
          onOpenUpdateModal={(t) => setActiveUpdateTask(t)}
          onOpenDetailModal={(t) => setActiveDetailTask(t)}
          onOpenApprovalModal={(t) => setActiveApprovalTask(t)}
          onOpenChangeReviewModal={(t) => setActiveChangeReviewTask(t)}
          onOpenRequestModal={(req) => {
            setEditingRequest(req || null)
            setCreateError(null)
            setIsTLRequestModalOpen(true)
          }}
          onWithdrawRequest={handleWithdrawRequest}
        />
      )}

      {/* 3. HR DASHBOARD VIEW */}
      {!isLoading && currentUser.role === 'HR' && (
        <HRProjectsView projects={enrichedProjects} />
      )}

      {/* 4. CEO DASHBOARD VIEW */}
      {!isLoading && currentUser.role === 'CEO' && (
        <CEOProjectsView
          projects={enrichedProjects}
          pendingClosures={pendingClosures}
          directApprovals={directApprovals}
          tlProjectRequests={projectRequests}
          tcrReviews={executiveTcrReviews}
          onOpenCreateModal={() => {
            setCreateError(null)
            setIsCreateModalOpen(true)
          }}
          onOpenApprovalModal={(t) => setActiveApprovalTask(t)}
          onOpenClosureModal={(p) => setActiveClosureProject(p)}
          onOpenChangeReviewModal={(t) => setActiveChangeReviewTask(t)}
          onApproveProjectRequest={handleApproveProjectRequest}
          onRejectProjectRequest={handleRejectProjectRequest}
          onReturnProjectRequest={handleReturnProjectRequest}
        />
      )}

      {/* Pagination Controls */}
      {!isLoading && totalCount > pageSize && (
        <div className="mt-8 flex items-center justify-between border-t border-[#f1f5f9] pt-4">
          <p className="text-xs text-[#6b7280]">
            Showing page <span className="font-bold text-[#111827]">{currentPage}</span> of{' '}
            <span className="font-bold text-[#111827]">{Math.ceil(totalCount / pageSize)}</span> ({totalCount} total)
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="rounded-full border border-gray-200 px-4 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={currentPage >= Math.ceil(totalCount / pageSize)}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="rounded-full border border-gray-200 px-4 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Shared Modals */}
      <ProjectCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          if (!isCreatingProject) {
            setIsCreateModalOpen(false)
            setCreateError(null)
          }
        }}
        onCreateProject={handleCreateProject}
        userRole={currentUser.role}
        showPmAssignment={currentUser.role === 'CEO'}
        isSubmitting={isCreatingProject}
        apiError={createError}
      />

      {/* TL Project Creation Request Modal (TL only) */}
      <TLProjectRequestModal
        isOpen={isTLRequestModalOpen}
        onClose={() => {
          setIsTLRequestModalOpen(false)
          setEditingRequest(null)
          setCreateError(null)
        }}
        initialData={editingRequest}
        onSubmitRequest={handleTLSubmitRequest}
        isSubmitting={isCreatingProject}
        apiError={createError}
      />

      <TaskWorkUpdateModal
        isOpen={Boolean(activeUpdateTask)}
        onClose={() => {
          setActiveUpdateTask(null)
          setModalActionError(null)
        }}
        task={activeUpdateTask}
        onSubmitUpdate={handleWorkUpdate}
        isSubmitting={isModalSubmitting}
        apiError={modalActionError}
      />

      <TaskApprovalModal
        isOpen={Boolean(activeApprovalTask)}
        onClose={() => {
          setActiveApprovalTask(null)
          setModalActionError(null)
        }}
        task={activeApprovalTask}
        projectId={activeApprovalTask?.projectId || activeApprovalTask?.project_id}
        currentUser={currentUser}
        isSolo={Boolean(activeApprovalTask?.isIndependent)}
        onApprove={handleApproveTask}
        onReject={handleRejectTask}
        onDownloadFile={handleDownloadDeliverableFile}
        isSubmitting={isModalSubmitting}
        apiError={modalActionError}
      />

      <ProjectClosureModal
        isOpen={Boolean(activeClosureProject)}
        onClose={() => {
          setActiveClosureProject(null)
          setModalActionError(null)
        }}
        project={activeClosureProject}
        onApproveClosure={handleApproveClosure}
        onRejectClosure={handleRejectClosure}
        isSubmitting={isModalSubmitting}
        apiError={modalActionError}
      />

      <TaskChangeReviewModal
        isOpen={Boolean(activeChangeReviewTask)}
        onClose={() => {
          setActiveChangeReviewTask(null)
          setModalActionError(null)
        }}
        task={activeChangeReviewTask}
        currentUser={currentUser}
        onApprove={handleApproveTaskChange}
        onReject={handleRejectTaskChange}
        isSubmitting={isModalSubmitting}
        apiError={modalActionError}
      />

      {/* Task Full Detail View Modal */}
      <TaskDetailModal
        isOpen={Boolean(activeDetailTask)}
        onClose={() => setActiveDetailTask(null)}
        task={activeDetailTask}
        onOpenUpdateModal={(t) => {
          setActiveDetailTask(null)
          setActiveUpdateTask(t)
        }}
      />
    </DashboardLayout>
  )
}

export default Projects
