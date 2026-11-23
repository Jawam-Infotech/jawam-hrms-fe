import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { UserContext } from '../../context/UserContext.jsx'
import StatusBadge from '../../components/ui/StatusBadge.jsx'
import ProjectProgressBar from '../../components/projects/ui/ProjectProgressBar.jsx'
import ProjectTaskTable from '../../components/projects/tables/ProjectTaskTable.jsx'
import ProjectMembersTable from '../../components/projects/tables/ProjectMembersTable.jsx'
import ProjectAuditTimeline from '../../components/projects/ui/ProjectAuditTimeline.jsx'
import AccessRestricted from '../../components/employees/AccessRestricted.jsx'

// Modals
import ProjectActivationModal from '../../components/projects/modals/ProjectActivationModal.jsx'
import ProjectEditModal from '../../components/projects/modals/ProjectEditModal.jsx'
import ProjectMemberModal from '../../components/projects/modals/ProjectMemberModal.jsx'
import MemberActionModal from '../../components/projects/modals/MemberActionModal.jsx'
import ReplacePmModal from '../../components/projects/modals/ReplacePmModal.jsx'
import StaffingModeConvertModal from '../../components/projects/modals/StaffingModeConvertModal.jsx'
import TaskCreateModal from '../../components/projects/modals/TaskCreateModal.jsx'
import TaskWorkUpdateModal from '../../components/projects/modals/TaskWorkUpdateModal.jsx'
import TaskApprovalModal from '../../components/projects/modals/TaskApprovalModal.jsx'
import TaskChangeRequestModal from '../../components/projects/modals/TaskChangeRequestModal.jsx'
import TaskChangeReviewModal from '../../components/projects/modals/TaskChangeReviewModal.jsx'
import TaskCancelModal from '../../components/projects/modals/TaskCancelModal.jsx'
import ProjectHoldModal from '../../components/projects/modals/ProjectHoldModal.jsx'
import ProjectCancelModal from '../../components/projects/modals/ProjectCancelModal.jsx'
import ProjectClosureModal from '../../components/projects/modals/ProjectClosureModal.jsx'
import TaskDetailModal from '../../components/projects/modals/TaskDetailModal.jsx'

// API & Utilities
import { projectsApi } from '../../services/api/projects.api.js'
import { formatApiError } from '../../utils/formatApiError.js'
import { downloadDeliverable } from '../../utils/downloadDeliverable.js'
import { getTaskRejection, recordTaskRejection, clearTaskRejection } from '../../utils/taskRejectionStorage.js'
import { dispatchProjectNotification } from '../../utils/projectNotificationService.js'
import { getRemovedMembers, recordRemovedMember, clearRemovedMember } from '../../utils/projectMemberStorage.js'

function ProjectDetails() {
  const navigate = useNavigate()
  const { projectId } = useParams()
  const { user } = useContext(UserContext)

  // Primary workspace state
  const [project, setProject] = useState(null)
  const [members, setMembers] = useState([])
  const [tasks, setTasks] = useState([])
  const [cancellationRequest, setCancellationRequest] = useState(null)
  const [closureBlockers, setClosureBlockers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [actionError, setActionError] = useState(null)
  const [isActionSubmitting, setIsActionSubmitting] = useState(false)

  // Filter & tab controls
  const [activeTab, setActiveTab] = useState('TASKS') // 'TASKS', 'MEMBERS', 'AUDIT'
  const [showInactiveMembers, setShowInactiveMembers] = useState(true)
  const [taskStatusFilter, setTaskStatusFilter] = useState('')
  const [taskAssigneeFilter, setTaskAssigneeFilter] = useState('')

  // Modals state
  const [isActivationModalOpen, setIsActivationModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false)
  const [isReplacePmModalOpen, setIsReplacePmModalOpen] = useState(false)
  const [selectedPmCandidateId, setSelectedPmCandidateId] = useState(null)
  const [isConvertModalOpen, setIsConvertModalOpen] = useState(false)
  const [isHoldModalOpen, setIsHoldModalOpen] = useState(false)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [cancelModalMode, setCancelModalMode] = useState('SOLO_CANCEL') // 'SOLO_CANCEL' | 'TEAM_REQUEST' | 'TEAM_REJECT'
  const [isClosureModalOpen, setIsClosureModalOpen] = useState(false)
  const [activeMemberAction, setActiveMemberAction] = useState(null) // { member, actionType: 'REMOVE' | 'DEACTIVATE' }
  const [isTaskCreateModalOpen, setIsTaskCreateModalOpen] = useState(false)
  const [activeUpdateTask, setActiveUpdateTask] = useState(null)
  const [activeDetailTask, setActiveDetailTask] = useState(null)
  const [activeApprovalTask, setActiveApprovalTask] = useState(null)
  const [activeChangeTask, setActiveChangeTask] = useState(null)
  const [activeChangeReviewTask, setActiveChangeReviewTask] = useState(null)
  const [activeCancelTask, setActiveCancelTask] = useState(null)
  const [qualityRiskAlert, setQualityRiskAlert] = useState(null)

  // Current user role evaluation
  const currentUser = useMemo(() => user || { role: 'EMPLOYEE' }, [user])
  const isCEO = currentUser.role === 'CEO'
  const isHR = currentUser.role === 'HR'
  const isTL = currentUser.role === 'TL'

  const isSolo = project?.staffing_mode === 'SOLO' || project?.staffingMode === 'SOLO'
  const isCurrentPM = useMemo(() => {
    if (isCEO) return true
    if (isHR) return false
    if (!project) return false
    if (project.current_pm_id && String(currentUser.id) === String(project.current_pm_id)) return true
    if (project.primaryPm && (
      currentUser.name?.toLowerCase() === project.primaryPm?.toLowerCase() ||
      String(currentUser.id) === String(project.primaryPmId)
    )) return true
    return false
  }, [project, currentUser, isCEO, isHR])

  // Centralized data loader
  const loadProjectWorkspace = useCallback(async (opts = {}) => {
    if (!projectId) return
    if (opts.initial) setIsLoading(true)
    setError(null)

    try {
      const projPromise = projectsApi.getProjectDetail(projectId)
      const membersPromise = projectsApi.getMembers(projectId, {
        include_inactive: showInactiveMembers,
        page_size: 100,
      })
      const tasksPromise = projectsApi
        .getTasks(projectId, {
          status: taskStatusFilter || undefined,
          assignee_id: taskAssigneeFilter || undefined,
          page_size: 100,
        })
        .catch(async (tErr) => {
          if (taskStatusFilter || taskAssigneeFilter) {
            setTaskStatusFilter('')
            setTaskAssigneeFilter('')
            return projectsApi.getTasks(projectId, { page_size: 100 })
          }
          throw tErr
        })

      const [projRes, membersRes, tasksRes] = await Promise.all([
        projPromise,
        membersPromise,
        tasksPromise,
      ])

      const projData = projRes?.data || projRes
      const rawMembers = membersRes?.data ?? membersRes
      const rawMembersList = Array.isArray(rawMembers)
        ? rawMembers
        : (rawMembers?.results || [])

      // Filter out permanently removed/deleted members for this project
      const removedIds = new Set(
        getRemovedMembers(projectId).map((id) => String(id).toLowerCase().trim())
      )

      // Deduplicate members per user: prioritize active status and Primary PM designation
      const uniqueMemberMap = new Map()
      rawMembersList.forEach((m) => {
        const uid = String(m.user_id || m.id || m.name || '').toLowerCase().trim()
        const rawUserId = String(m.user_id || '').toLowerCase().trim()
        const rawId = String(m.id || '').toLowerCase().trim()
        const rawName = String(m.name || '').toLowerCase().trim()

        // Exclude permanently removed members
        if (
          removedIds.has(uid) ||
          (rawUserId && removedIds.has(rawUserId)) ||
          (rawId && removedIds.has(rawId)) ||
          (rawName && removedIds.has(rawName)) ||
          m.is_removed ||
          m.status === 'REMOVED'
        ) {
          return
        }

        if (!uniqueMemberMap.has(uid)) {
          uniqueMemberMap.set(uid, m)
        } else {
          const existing = uniqueMemberMap.get(uid)
          if (existing.is_active === false && m.is_active !== false) {
            uniqueMemberMap.set(uid, m)
          } else if (!existing.is_current_pm && m.is_current_pm) {
            uniqueMemberMap.set(uid, m)
          }
        }
      })
      const membersData = Array.from(uniqueMemberMap.values())

      const rawTasks = tasksRes?.data ?? tasksRes
      const tasksData = Array.isArray(rawTasks)
        ? rawTasks
        : (rawTasks?.results || [])

      setProject(projData)
      setMembers(membersData)
      setTasks(tasksData)

      // E27 GET: Read pending cancellation request (readable by CEO and current PM)
      try {
        const cancelRes = await projectsApi.getCancellationRequest(projectId)
        const cData = cancelRes?.data || cancelRes
        setCancellationRequest(cData || null)
      } catch {
        setCancellationRequest(null)
      }

      // E16 GET: Closure blockers preview
      if (projData?.status === 'ACTIVE' || projData?.status === 'PENDING_CEO_CLOSURE') {
        try {
          const blockersRes = await projectsApi.getClosureBlockers(projectId)
          const bData = blockersRes?.data || blockersRes
          setClosureBlockers(bData?.blockers || [])
        } catch {
          setClosureBlockers([])
        }
      } else {
        setClosureBlockers([])
      }
    } catch (err) {
      console.error('Failed to load project workspace:', err)
      setError(formatApiError(err, 'Failed to load project details.'))
    } finally {
      setIsLoading(false)
    }
  }, [projectId, showInactiveMembers, taskStatusFilter, taskAssigneeFilter])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadProjectWorkspace({ initial: true })
  }, [loadProjectWorkspace])

  // Enrich tasks with assignee member names
  const enrichedTasks = useMemo(() => {
    const memberMap = new Map()
    const memberList = Array.isArray(members) ? members : []
    memberList.forEach((m) => {
      memberMap.set(String(m.user_id || m.id), m)
    })
    const taskList = Array.isArray(tasks) ? tasks : []
    return taskList.map((t) => {
      const m = memberMap.get(String(t.assignee_id || t.assigneeId))
      const localRej = getTaskRejection(t.id)
      const reworkCount = Number(t.rejection_count ?? t.rework_count ?? t.reworkCount ?? (localRej ? (localRej.count || 1) : 0))
      const rawFeedback = t.rejection_feedback || t.rejection_reason || t.latest_rejection_reason || t.rework_reason || localRej?.reason || ''
      const isQualityRisk = Boolean(t.quality_risk || reworkCount >= 3)
      const isRejected = (t.status === 'IN_PROGRESS' || t.status === 'REJECTED') && (reworkCount > 0 || Boolean(rawFeedback) || Boolean(localRej))
      const rejectionFeedback = rawFeedback || (isRejected ? 'Deliverable was rejected by reviewer. Please make the requested updates and resubmit.' : '')

      return {
        ...t,
        name: t.title || t.name,
        assignee: t.assignee || m?.name || (t.assignee_id ? `User #${t.assignee_id}` : 'Unassigned'),
        assigneeId: t.assignee_id || t.assigneeId,
        dueDate: t.due_date || t.dueDate,
        isIndependent: isSolo,
        reworkCount,
        rework_count: reworkCount,
        rejection_count: reworkCount,
        isQualityRisk,
        quality_risk: isQualityRisk,
        rejectionFeedback,
        rejection_feedback: rejectionFeedback,
        isRejected,
        displayStatus: isRejected ? 'REJECTED' : t.status,
        rejectedBy: localRej?.rejectedBy || 'Reviewer',
      }
    })
  }, [tasks, members, isSolo])

  // Progress metrics
  const mathStats = useMemo(() => {
    const activeTasks = enrichedTasks.filter((t) => t.status !== 'CANCELLED')
    const completedTasks = activeTasks.filter((t) => t.status === 'COMPLETED')
    const inProgressTasks = activeTasks.filter((t) => t.status === 'IN_PROGRESS')
    const blockedTasks = activeTasks.filter((t) => t.status === 'BLOCKED')

    const progress = activeTasks.length > 0
      ? Math.round((completedTasks.length / activeTasks.length) * 100)
      : 0

    return {
      totalActive: activeTasks.length,
      completed: completedTasks.length,
      inProgress: inProgressTasks.length,
      blocked: blockedTasks.length,
      progress,
    }
  }, [enrichedTasks])

  // Permission: verify membership / project access
  const isMember = useMemo(() => {
    if (isCEO || isHR) return true
    if (!members || members.length === 0) return true
    return members.some((m) =>
      String(m.user_id || m.id) === String(currentUser.id) ||
      m.name?.trim().toLowerCase() === currentUser.name?.trim().toLowerCase()
    )
  }, [isCEO, isHR, members, currentUser])

  // Cancellation request helper
  const pendingCancelReq = useMemo(() => {
    if (!cancellationRequest) return null
    if (cancellationRequest.pending) return cancellationRequest.pending
    if (cancellationRequest.id && cancellationRequest.status === 'PENDING') return cancellationRequest
    return null
  }, [cancellationRequest])

  // ==========================================
  // ACTION HANDLERS
  // ==========================================

  // E03 PATCH: Metadata update
  const handleSaveMetadata = async (payload) => {
    setIsActionSubmitting(true)
    setActionError(null)
    try {
      await projectsApi.updateProject(projectId, payload)
      setIsEditModalOpen(false)
      await loadProjectWorkspace()
    } catch (err) {
      setActionError(formatApiError(err, 'Failed to update project metadata.'))
    } finally {
      setIsActionSubmitting(false)
    }
  }

  // E09 / E11: Activation / Resume
  const handleActivateProject = async () => {
    setIsActionSubmitting(true)
    setActionError(null)
    try {
      if (project?.status === 'ON_HOLD') {
        await projectsApi.resumeProject(projectId)
      } else {
        await projectsApi.activateProject(projectId)
      }
      setIsActivationModalOpen(false)
      dispatchProjectNotification({
        title: '🚀 Project Activated',
        message: `Project "${project?.name || project?.title || 'Project'}" has been activated.`,
        type: 'success',
        targetRole: 'ALL',
        link: `/projects/${projectId}`,
      })
      await loadProjectWorkspace()
    } catch (err) {
      setActionError(formatApiError(err, 'Failed to activate or resume project.'))
    } finally {
      setIsActionSubmitting(false)
    }
  }

  // E10 POST: Hold project
  const handleHoldProject = async (reason) => {
    setIsActionSubmitting(true)
    setActionError(null)
    try {
      await projectsApi.holdProject(projectId, reason)
      setIsHoldModalOpen(false)
      dispatchProjectNotification({
        title: '⏸️ Project Put On Hold',
        message: `Project "${project?.name || project?.title || 'Project'}" placed on hold: "${reason}".`,
        type: 'warning',
        targetRole: 'ALL',
        link: `/projects/${projectId}`,
      })
      await loadProjectWorkspace()
    } catch (err) {
      setActionError(formatApiError(err, 'Failed to put project on hold.'))
    } finally {
      setIsActionSubmitting(false)
    }
  }

  // E12 / E27 / E29: Project cancellation actions
  const handleCancelConfirm = async (reason) => {
    setIsActionSubmitting(true)
    setActionError(null)
    try {
      if (cancelModalMode === 'SOLO_CANCEL') {
        await projectsApi.cancelSoloProject(projectId, reason)
      } else if (cancelModalMode === 'TEAM_REQUEST') {
        await projectsApi.requestCancellation(projectId, reason)
      } else if (cancelModalMode === 'TEAM_REJECT') {
        const reqId = pendingCancelReq?.id
        if (!reqId) throw new Error('Missing cancellation request ID to reject.')
        await projectsApi.rejectCancellation(projectId, reqId, reason)
      }
      setIsCancelModalOpen(false)
      await loadProjectWorkspace()
    } catch (err) {
      setActionError(formatApiError(err, 'Failed to process project cancellation.'))
    } finally {
      setIsActionSubmitting(false)
    }
  }

  // E28 POST: Approve team cancellation (CEO)
  const handleApproveCancellation = async () => {
    const reqId = pendingCancelReq?.id
    if (!reqId) return
    setIsActionSubmitting(true)
    setActionError(null)
    try {
      await projectsApi.approveCancellation(projectId, reqId)
      await loadProjectWorkspace()
    } catch (err) {
      setActionError(formatApiError(err, 'Failed to approve cancellation request.'))
    } finally {
      setIsActionSubmitting(false)
    }
  }

  // E13 POST: Archive project (CEO, COMPLETED only per OD-1 / X3)
  const handleArchiveProject = async () => {
    setIsActionSubmitting(true)
    setActionError(null)
    try {
      await projectsApi.archiveProject(projectId)
      await loadProjectWorkspace()
    } catch (err) {
      setActionError(formatApiError(err, 'Failed to archive project.'))
    } finally {
      setIsActionSubmitting(false)
    }
  }

  // E14 POST: Reactivate completed project back to PLANNED (CEO)
  const handleReactivateProject = async () => {
    setIsActionSubmitting(true)
    setActionError(null)
    try {
      await projectsApi.reactivateProject(projectId)
      await loadProjectWorkspace()
    } catch (err) {
      setActionError(formatApiError(err, 'Failed to reactivate project.'))
    } finally {
      setIsActionSubmitting(false)
    }
  }

  // E08 POST: Solo to Team conversion (CEO)
  const handleConvertSoloToTeam = async (memberId) => {
    setIsActionSubmitting(true)
    setActionError(null)
    try {
      await projectsApi.setStaffingMode(projectId, {
        staffing_mode: 'TEAM',
        member_id: memberId,
      })
      setIsConvertModalOpen(false)
      await loadProjectWorkspace()
    } catch (err) {
      setActionError(formatApiError(err, 'Failed to convert project to TEAM mode.'))
    } finally {
      setIsActionSubmitting(false)
    }
  }

  // E15 POST: Request project closure (PM)
  const handleRequestClosure = async () => {
    setIsActionSubmitting(true)
    setActionError(null)
    try {
      await projectsApi.requestClosure(projectId)
      setIsClosureModalOpen(false)
      dispatchProjectNotification({
        title: '🏁 Project Closure Requested',
        message: `Closure requested for "${project?.name || project?.title}". CEO review required.`,
        type: 'info',
        targetRole: 'CEO',
        link: `/projects/${projectId}`,
      })
      await loadProjectWorkspace()
    } catch (err) {
      setActionError(formatApiError(err, 'Failed to request project closure.'))
    } finally {
      setIsActionSubmitting(false)
    }
  }

  // E17 POST: Approve project closure (CEO)
  const handleApproveClosure = async () => {
    setIsActionSubmitting(true)
    setActionError(null)
    try {
      await projectsApi.approveClosure(projectId)
      setIsClosureModalOpen(false)
      dispatchProjectNotification({
        title: '🎉 Project Officially Closed',
        message: `CEO approved closure for "${project?.name || project?.title}".`,
        type: 'success',
        targetRole: 'ALL',
        link: `/projects/${projectId}`,
      })
      await loadProjectWorkspace()
    } catch (err) {
      setActionError(formatApiError(err, 'Failed to approve project closure.'))
    } finally {
      setIsActionSubmitting(false)
    }
  }

  // E18 POST: Reject project closure (CEO)
  const handleRejectClosure = async (_projId, reason) => {
    setIsActionSubmitting(true)
    setActionError(null)
    try {
      await projectsApi.rejectClosure(projectId, reason)
      setIsClosureModalOpen(false)
      dispatchProjectNotification({
        title: '⚠️ Project Closure Rejected',
        message: `Closure rejected for "${project?.name || project?.title}": "${reason}".`,
        type: 'warning',
        targetRole: 'PM',
        link: `/projects/${projectId}`,
      })
      await loadProjectWorkspace()
    } catch (err) {
      setActionError(formatApiError(err, 'Failed to reject project closure.'))
    } finally {
      setIsActionSubmitting(false)
    }
  }

  // E05 POST: Add member
  const handleAddMember = async (memberData) => {
    if (typeof memberData === 'object') {
      const roleUpper = String(memberData.role || memberData.designation || '').toUpperCase()
      if (roleUpper === 'CEO' || roleUpper === 'HR' || roleUpper.includes('CEO') || roleUpper.includes('HUMAN RESOURCE')) {
        setActionError('Executive leadership (CEO) and HR personnel cannot be added as project members.')
        return
      }
    }
    setIsActionSubmitting(true)
    setActionError(null)
    try {
      const rawId = typeof memberData === 'object' ? (memberData.user_id || memberData.userId || memberData.id) : memberData
      const userId = Number(String(rawId).replace(/[^0-9]/g, '')) || rawId
      await projectsApi.addMember(projectId, { user_id: userId })
      clearRemovedMember(projectId, userId)
      if (typeof memberData === 'object' && memberData.name) {
        clearRemovedMember(projectId, memberData.name)
      }
      setIsMemberModalOpen(false)
      const memberName = typeof memberData === 'object' ? (memberData.name || `Member #${userId}`) : `Member #${userId}`
      dispatchProjectNotification({
        title: '👥 Project Member Added',
        message: `${memberName} was added to project "${project?.name || project?.title}".`,
        type: 'info',
        targetRole: 'ALL',
        targetUserId: userId,
        link: `/projects/${projectId}`,
      })
      await loadProjectWorkspace()
    } catch (err) {
      setActionError(formatApiError(err, 'Failed to add project member.'))
    } finally {
      setIsActionSubmitting(false)
    }
  }

  // E05 POST: Reactivate member
  const handleActivateMember = async (member) => {
    const roleUpper = String(member?.role || '').toUpperCase()
    if (roleUpper === 'CEO' || roleUpper === 'HR') {
      setActionError('Executive leadership (CEO) and HR personnel cannot be activated as project members.')
      return
    }
    const userId = member.user_id || member.id
    setIsActionSubmitting(true)
    setActionError(null)
    try {
      await projectsApi.addMember(projectId, { user_id: userId })
      clearRemovedMember(projectId, userId)
      if (member.name) clearRemovedMember(projectId, member.name)
      dispatchProjectNotification({
        title: '👤 Member Activated',
        message: `${member?.name || 'Member'} was activated in project "${project?.name || project?.title}".`,
        type: 'info',
        targetRole: 'ALL',
        link: `/projects/${projectId}`,
      })
      await loadProjectWorkspace()
    } catch (err) {
      setActionError(formatApiError(err, 'Failed to activate member.'))
    } finally {
      setIsActionSubmitting(false)
    }
  }

  // E04 POST: Assign Primary PM (CEO)
  const handleConfirmReplacePm = async ({ userId, reason }) => {
    setIsActionSubmitting(true)
    setActionError(null)
    try {
      await projectsApi.assignPrimaryPM(projectId, { user_id: userId, reason })
      setIsReplacePmModalOpen(false)
      dispatchProjectNotification({
        title: '👑 Primary PM Assigned',
        message: `Primary PM was designated for project "${project?.name || project?.title}".`,
        type: 'info',
        targetRole: 'ALL',
        link: `/projects/${projectId}`,
      })
      await loadProjectWorkspace()
    } catch (err) {
      setActionError(formatApiError(err, 'Failed to assign Primary PM.'))
    } finally {
      setIsActionSubmitting(false)
    }
  }

  // E06 POST / E07 POST: Member removal / deactivation
  const handleMemberActionConfirm = async ({ userId, payload, actionType }) => {
    setIsActionSubmitting(true)
    setActionError(null)
    try {
      if (actionType === 'REMOVE') {
        const removePayload = {
          ...payload,
          reason: payload?.reason?.trim() || 'Permanently removed from project',
          decisions: payload?.decisions || [],
        }
        await projectsApi.removeMember(projectId, userId, removePayload)

        // Permanently record removal so the member immediately disappears from the roster
        recordRemovedMember(projectId, userId)
        if (activeMemberAction?.member?.name) {
          recordRemovedMember(projectId, activeMemberAction.member.name)
        }
        if (activeMemberAction?.member?.id) {
          recordRemovedMember(projectId, activeMemberAction.member.id)
        }

        // Update local state immediately so row disappears right away
        setMembers((prev) =>
          prev.filter(
            (m) =>
              String(m.user_id || m.id) !== String(userId) &&
              String(m.name || '').toLowerCase() !== String(activeMemberAction?.member?.name || '').toLowerCase()
          )
        )

        dispatchProjectNotification({
          title: '🗑️ Member Deleted',
          message: `${activeMemberAction?.member?.name || 'Member'} was permanently deleted from project "${project?.name || project?.title}".`,
          type: 'warning',
          targetRole: 'ALL',
          link: `/projects/${projectId}`,
        })
      } else {
        await projectsApi.deactivateMember(projectId, userId, payload)
        dispatchProjectNotification({
          title: '⏸️ Member Deactivated',
          message: `${activeMemberAction?.member?.name || 'Member'} was deactivated in project "${project?.name || project?.title}".`,
          type: 'info',
          targetRole: 'ALL',
          link: `/projects/${projectId}`,
        })
      }
      setActiveMemberAction(null)
      await loadProjectWorkspace()
    } catch (err) {
      setActionError(formatApiError(err, `Failed to ${actionType === 'REMOVE' ? 'delete' : 'deactivate'} member.`))
    } finally {
      setIsActionSubmitting(false)
    }
  }

  // E30 POST: Create task
  const handleCreateTask = async (taskPayload) => {
    setIsActionSubmitting(true)
    setActionError(null)
    try {
      await projectsApi.createTask(projectId, taskPayload)
      setIsTaskCreateModalOpen(false)
      const targetMember = (members || []).find(
        (m) => String(m.user_id || m.id) === String(taskPayload.assignee_id || taskPayload.assigneeId)
      )
      const assigneeName = targetMember?.name || taskPayload.assignee_name || 'Assignee'
      const taskTitle = taskPayload.title || taskPayload.name || 'New Task'
      const projectName = project?.name || project?.title || 'Project'

      // 1. Personalized notification directly targeting the assigned employee
      dispatchProjectNotification({
        title: '📌 New Task Assigned',
        message: `You have been assigned a new task: "${taskTitle}" in project "${projectName}".`,
        type: 'info',
        targetRole: 'EMPLOYEE',
        targetUserId: taskPayload.assignee_id || taskPayload.assigneeId,
        targetUserName: assigneeName,
        link: `/projects/${projectId}`,
      })

      // 2. Assigner confirmation notification (for CEO / TL / PM)
      if (currentUser?.role && currentUser.role !== 'EMPLOYEE') {
        dispatchProjectNotification({
          title: '✅ Task Created & Assigned',
          message: `Task "${taskTitle}" was created and assigned to ${assigneeName}.`,
          type: 'success',
          targetRole: currentUser.role,
          targetUserId: currentUser.id,
          targetUserName: currentUser.name,
          link: `/projects/${projectId}`,
        })
      }
      await loadProjectWorkspace()
    } catch (err) {
      setActionError(formatApiError(err, 'Failed to create task.'))
    } finally {
      setIsActionSubmitting(false)
    }
  }

  // E33 POST: Task status toggle (TODO <-> IN_PROGRESS)
  const handleSetTaskStatus = async (taskId, newStatus) => {
    setIsActionSubmitting(true)
    setActionError(null)
    try {
      await projectsApi.setTaskStatus(projectId, taskId, newStatus)
      await loadProjectWorkspace()
    } catch (err) {
      setActionError(formatApiError(err, `Failed to update task status to ${newStatus}.`))
    } finally {
      setIsActionSubmitting(false)
    }
  }

  // E19 POST: Work update (with optional multipart files or deliverable URLs)
  const handleWorkUpdate = async ({ taskId, payload, isMultipart }) => {
    setIsActionSubmitting(true)
    setActionError(null)
    try {
      await projectsApi.recordWorkUpdate(projectId, taskId, payload, isMultipart)
      clearTaskRejection(taskId)

      const rawProgress = isMultipart && typeof payload?.get === 'function'
        ? payload.get('progress')
        : (payload?.progress ?? activeUpdateTask?.progress ?? 0)
      const progressNum = Number(rawProgress)
      const isComplete = progressNum >= 100
      const employeeName = currentUser?.name || 'Assignee'
      const taskName = activeUpdateTask?.name || activeUpdateTask?.title || 'Task'
      const projectName = project?.name || project?.title || 'Project'

      // 1. Real-time alert to leadership (CEO for Solo, PM for Team)
      dispatchProjectNotification({
        title: isComplete
          ? (isSolo ? '🎯 Direct Deliverable Submitted' : '🎯 100% Deliverable Submitted (PM Review)')
          : '📈 Work Progress Updated',
        message: isComplete
          ? (isSolo
              ? `"${employeeName}" submitted final 100% deliverables for solo initiative "${projectName}". Direct review required.`
              : `"${employeeName}" submitted 100% completion deliverables for task "${taskName}". Awaiting PM review and sign-off.`)
          : `"${employeeName}" updated work progress to ${progressNum}% on task "${taskName}" in project "${projectName}".`,
        type: isComplete ? 'warning' : 'info',
        targetRole: isSolo ? 'CEO' : 'PM',
        targetUserId: isSolo ? undefined : (project?.current_pm_id || project?.primaryPmId),
        link: `/projects/${projectId}`,
      })

      // 2. Direct confirmation for the employee submitter
      if (currentUser?.role === 'EMPLOYEE') {
        dispatchProjectNotification({
          title: '✅ Progress Update Sent',
          message: isComplete
            ? (isSolo
                ? `Your deliverable for "${taskName}" was submitted for Direct PM Approval.`
                : `Your deliverable for "${taskName}" was submitted and is Awaiting PM Approval.`)
            : `Your update (${progressNum}%) for task "${taskName}" has been submitted.`,
          type: 'success',
          targetRole: 'EMPLOYEE',
          targetUserId: currentUser.id,
          targetUserName: currentUser.name,
          link: `/projects/${projectId}`,
        })
      }
      setActiveUpdateTask(null)
      await loadProjectWorkspace()
    } catch (err) {
      setActionError(formatApiError(err, 'Failed to record work update.'))
    } finally {
      setIsActionSubmitting(false)
    }
  }

  // E21 POST: Approve completion
  const handleApproveTask = async ({ taskId, submissionId, reason }) => {
    setIsActionSubmitting(true)
    setActionError(null)
    try {
      await projectsApi.decideCompletion(projectId, taskId, submissionId, {
        decision: 'APPROVE',
        reason: reason || undefined,
      })
      clearTaskRejection(taskId)
      dispatchProjectNotification({
        title: '✅ Deliverable Approved',
        message: `Deliverable for task "${activeApprovalTask?.name || activeApprovalTask?.title || 'Task'}" was approved by ${currentUser?.name || 'Reviewer'}.`,
        type: 'success',
        targetRole: 'EMPLOYEE',
        targetUserId: activeApprovalTask?.assigneeId || activeApprovalTask?.assignee_id,
        targetUserName: activeApprovalTask?.assignee,
        link: `/projects/${projectId}`,
      })
      setActiveApprovalTask(null)
      await loadProjectWorkspace()
    } catch (err) {
      setActionError(formatApiError(err, 'Failed to approve task completion.'))
    } finally {
      setIsActionSubmitting(false)
    }
  }

  // E21 POST: Reject completion
  const handleRejectTask = async ({ taskId, submissionId, reason }) => {
    setIsActionSubmitting(true)
    setActionError(null)
    try {
      await projectsApi.decideCompletion(projectId, taskId, submissionId, {
        decision: 'REJECT',
        reason,
      })
      const rec = recordTaskRejection(taskId, {
        reason,
        rejectedBy: currentUser?.name || 'Reviewer',
      })
      if (rec && rec.count >= 3) {
        setQualityRiskAlert({
          taskName: activeApprovalTask?.name || activeApprovalTask?.title || `Task #${taskId}`,
          reworkCount: rec.count,
        })
      }
      dispatchProjectNotification({
        title: '❌ Deliverable Rejected (Rework Required)',
        message: `Deliverable for task "${activeApprovalTask?.name || activeApprovalTask?.title || 'Task'}" was rejected: "${reason || 'Needs revisions'}".`,
        type: 'error',
        targetRole: 'EMPLOYEE',
        targetUserId: activeApprovalTask?.assigneeId || activeApprovalTask?.assignee_id,
        targetUserName: activeApprovalTask?.assignee,
        link: `/projects/${projectId}`,
      })
      setActiveApprovalTask(null)
      await loadProjectWorkspace()
    } catch (err) {
      setActionError(formatApiError(err, 'Failed to reject task completion.'))
    } finally {
      setIsActionSubmitting(false)
    }
  }

  // E24 GET: Download deliverable attachment
  const handleDownloadDeliverableFile = async (submissionId, fileId, originalName) => {
    try {
      await downloadDeliverable(projectId, activeApprovalTask?.id, submissionId, fileId, originalName)
    } catch (err) {
      setActionError(formatApiError(err, 'Failed to download deliverable file.'))
    }
  }

  // E22 POST: Create Task-Change Request
  const handleSubmitTaskChange = async ({ taskId, payload }) => {
    setIsActionSubmitting(true)
    setActionError(null)
    try {
      await projectsApi.createChangeRequest(projectId, taskId, payload)
      dispatchProjectNotification({
        title: '🔄 Task Change Requested',
        message: `${currentUser?.name || 'Assignee'} submitted a change request for task "${activeChangeTask?.name || activeChangeTask?.title || 'Task'}".`,
        type: 'info',
        targetRole: 'PM',
        targetUserName: project?.primaryPm,
        link: `/projects/${projectId}`,
      })
      setActiveChangeTask(null)
      await loadProjectWorkspace()
    } catch (err) {
      setActionError(formatApiError(err, 'Failed to submit Task-Change Request.'))
    } finally {
      setIsActionSubmitting(false)
    }
  }

  // E23 POST: Approve Task-Change Request
  const handleApproveTaskChange = async ({ requestId, reason }) => {
    setIsActionSubmitting(true)
    setActionError(null)
    try {
      await projectsApi.decideChangeRequest(projectId, requestId, {
        decision: 'APPROVE',
        reason: reason || undefined,
      })
      dispatchProjectNotification({
        title: '✅ Task Change Approved',
        message: `Change request for task "${activeChangeReviewTask?.name || activeChangeReviewTask?.title || 'Task'}" was approved.`,
        type: 'success',
        targetRole: 'EMPLOYEE',
        targetUserName: activeChangeReviewTask?.changeRequest?.requester,
        link: `/projects/${projectId}`,
      })
      setActiveChangeReviewTask(null)
      await loadProjectWorkspace()
    } catch (err) {
      setActionError(formatApiError(err, 'Failed to approve change request.'))
    } finally {
      setIsActionSubmitting(false)
    }
  }

  // E23 POST: Reject Task-Change Request
  const handleRejectTaskChange = async ({ requestId, reason }) => {
    setIsActionSubmitting(true)
    setActionError(null)
    try {
      await projectsApi.decideChangeRequest(projectId, requestId, {
        decision: 'REJECT',
        reason: reason || undefined,
      })
      dispatchProjectNotification({
        title: '❌ Task Change Rejected',
        message: `Change request for task "${activeChangeReviewTask?.name || activeChangeReviewTask?.title || 'Task'}" was rejected: "${reason || 'No reason provided'}".`,
        type: 'warning',
        targetRole: 'EMPLOYEE',
        targetUserName: activeChangeReviewTask?.changeRequest?.requester,
        link: `/projects/${projectId}`,
      })
      setActiveChangeReviewTask(null)
      await loadProjectWorkspace()
    } catch (err) {
      setActionError(formatApiError(err, 'Failed to reject change request.'))
    } finally {
      setIsActionSubmitting(false)
    }
  }

  // E34 POST: Cancel task
  const handleCancelTask = async (taskId, reason) => {
    setIsActionSubmitting(true)
    setActionError(null)
    try {
      await projectsApi.cancelTask(projectId, taskId, reason)
      dispatchProjectNotification({
        title: '⛔ Task Cancelled',
        message: `Task #${taskId} was cancelled: "${reason || 'Cancelled by manager'}".`,
        type: 'warning',
        targetRole: 'EMPLOYEE',
        link: `/projects/${projectId}`,
      })
      setActiveCancelTask(null)
      await loadProjectWorkspace()
    } catch (err) {
      setActionError(formatApiError(err, 'Failed to cancel task.'))
    } finally {
      setIsActionSubmitting(false)
    }
  }

  // ==========================================
  // RENDER CONDITIONAL STATES
  // ==========================================

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="space-y-6 animate-pulse">
          <div className="h-9 w-48 rounded-full bg-gray-200" />
          <div className="h-24 rounded-[28px] bg-gray-100" />
          <div className="grid gap-6 xl:grid-cols-3">
            <div className="h-36 rounded-[24px] bg-gray-100" />
            <div className="h-36 rounded-[24px] bg-gray-100" />
            <div className="h-36 rounded-[24px] bg-gray-100" />
          </div>
          <div className="h-80 rounded-[28px] bg-gray-100" />
        </div>
      </DashboardLayout>
    )
  }

  if (error || !project) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-xl py-16">
          <div className="rounded-[28px] border border-red-200 bg-red-50 p-8 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 text-xl font-bold">
              ✕
            </div>
            <h2 className="mt-4 text-lg font-black text-red-900">Unable to Load Project Workspace</h2>
            <p className="mt-2 text-xs text-red-700 leading-relaxed">{error || 'Project not found.'}</p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => navigate('/projects')}
                className="rounded-full border border-gray-300 bg-white px-5 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
              >
                ← Back to Projects
              </button>
              <button
                type="button"
                onClick={() => loadProjectWorkspace({ initial: true })}
                className="rounded-full bg-red-600 px-5 py-2 text-xs font-bold text-white hover:bg-red-700"
              >
                Retry Loading
              </button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!isMember) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-xl py-16">
          <AccessRestricted
            title="Project Access Restricted"
            message="You are not an assigned member of this project. Per enterprise governance rules, employees can only access projects they actively participate in."
            buttonText="← Back to Your Projects"
            onBack={() => navigate('/projects')}
          />
        </div>
      </DashboardLayout>
    )
  }

  const isClosedProject = ['CANCELLED', 'ARCHIVED'].includes(project.status)
  const projectName = project.name || project.title || `Project #${project.id}`
  const projectDescription = project.description || 'No description provided.'
  const projectStartDate = project.start_date || project.startDate || ''
  const projectTargetEndDate = project.target_end_date || project.targetEndDate || project.dueDate || 'No target date'

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Back Link & Header */}
        <div>
          <button
            type="button"
            onClick={() => navigate('/projects')}
            className="inline-flex items-center gap-2 rounded-full border border-[#e5e7eb] bg-white px-4 py-2 text-[14px] font-semibold text-[#111827] shadow-sm hover:bg-[#f8fafc]"
          >
            ← Back to Projects Directory
          </button>

          {/* Inline Action Error Alert */}
          {actionError && (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-800 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-base">⚠️</span>
                <span>{actionError}</span>
              </div>
              <button
                type="button"
                onClick={() => setActionError(null)}
                className="rounded-full p-1 text-red-600 hover:bg-red-100"
              >
                ✕
              </button>
            </div>
          )}

          {/* Pending Cancellation Request Banner */}
          {pendingCancelReq && (
            <div className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-amber-900 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg">⚠️</span>
                  <p className="font-bold text-sm">
                    {project.status === 'ARCHIVED'
                      ? 'Stale Cancellation Request Pending on Archived Project'
                      : 'Team Cancellation Request Pending CEO Review'}
                  </p>
                </div>
                <p className="text-xs text-amber-800 mt-1">
                  Requested by: <strong>{pendingCancelReq.requested_by_name || `User #${pendingCancelReq.requested_by}`}</strong> • Reason: &quot;{pendingCancelReq.reason}&quot;
                </p>
              </div>
              <div className="flex items-center gap-2">
                {isCEO && project.status !== 'ARCHIVED' && (
                  <>
                    <button
                      type="button"
                      onClick={handleApproveCancellation}
                      disabled={isActionSubmitting}
                      className="rounded-full bg-red-600 px-4 py-1.5 text-xs font-bold text-white shadow hover:bg-red-700 disabled:opacity-50"
                    >
                      Approve Cancellation
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setCancelModalMode('TEAM_REJECT')
                        setIsCancelModalOpen(true)
                      }}
                      disabled={isActionSubmitting}
                      className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                    >
                      Reject Request
                    </button>
                  </>
                )}
                {isCEO && project.status === 'ARCHIVED' && (
                  <button
                    type="button"
                    onClick={() => {
                      setCancelModalMode('TEAM_REJECT')
                      setIsCancelModalOpen(true)
                    }}
                    disabled={isActionSubmitting}
                    className="rounded-full bg-amber-700 px-4 py-1.5 text-xs font-bold text-white shadow hover:bg-amber-800 disabled:opacity-50"
                    title="Section 9.1: Stale requests on archived projects offer Reject only"
                  >
                    Reject Stale Request
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Title Bar & Status */}
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-[30px] font-black text-[#111827]">{projectName}</h1>
                <StatusBadge status={project.status} />
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                  isSolo ? 'bg-[#ede9fe] text-[#7c3aed]' : 'bg-[#e0f2fe] text-[#0369a1]'
                }`}>
                  {isSolo ? 'Solo / Independent' : 'Standard Team'}
                </span>

                {/* Edit Metadata Button (E03 PATCH) */}
                {!isClosedProject && (isCEO || isCurrentPM) && (
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(true)}
                    className="rounded-full border border-[#cbd5e1] bg-white px-3 py-1 text-xs font-bold text-[#475569] hover:bg-[#f8fafc] transition shadow-sm"
                    title="E03 PATCH: Edit project name, description, start date, target end date"
                  >
                    ✎ Edit Details
                  </button>
                )}

                {/* Convert Solo to Team Button (E08 POST) */}
                {isSolo && isCEO && !isClosedProject && (
                  <button
                    type="button"
                    onClick={() => setIsConvertModalOpen(true)}
                    className="rounded-full border border-[#7c3aed] bg-[#f5f3ff] px-3 py-1 text-xs font-bold text-[#7c3aed] hover:bg-[#ede9fe] transition shadow-sm"
                    title="E08 POST: Expand solo initiative to collaborative team"
                  >
                    ⚡ Convert to Team
                  </button>
                )}
              </div>
              <p className="mt-1 text-[15px] text-[#5f6679] max-w-2xl">{projectDescription}</p>
            </div>

            {/* Lifecycle Action Buttons */}
            <div className="flex flex-wrap items-center gap-3">
              {/* PLANNED: Activate & Cancel */}
              {project.status === 'PLANNED' && (isCurrentPM || isCEO || isTL) && (
                <>
                  <button
                    type="button"
                    onClick={() => setIsActivationModalOpen(true)}
                    disabled={isActionSubmitting}
                    className="rounded-full bg-[#10b981] px-5 py-2 text-[14px] font-bold text-white shadow hover:bg-[#059669] disabled:opacity-50"
                  >
                    🚀 Activate Project
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCancelModalMode(isSolo ? 'SOLO_CANCEL' : 'TEAM_REQUEST')
                      setIsCancelModalOpen(true)
                    }}
                    disabled={isActionSubmitting}
                    className="rounded-full border border-[#fca5a5] bg-white px-4 py-2 text-[14px] font-bold text-[#dc2626] hover:bg-[#fef2f2] disabled:opacity-50"
                  >
                    ✕ Cancel Project
                  </button>
                </>
              )}

              {/* ACTIVE: Hold, Closure Request, Cancel */}
              {project.status === 'ACTIVE' && (isCurrentPM || isCEO) && (
                <>
                  {isCurrentPM && !isCEO && (
                    <button
                      type="button"
                      onClick={() => setIsClosureModalOpen(true)}
                      disabled={isActionSubmitting}
                      className="rounded-full bg-[#f59e0b] px-5 py-2 text-[14px] font-bold text-white shadow hover:bg-[#d97706] disabled:opacity-50"
                    >
                      Request Project Closure
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsHoldModalOpen(true)}
                    disabled={isActionSubmitting}
                    className="rounded-full border border-[#f59e0b] bg-[#fffbeb] px-4 py-2 text-[14px] font-bold text-[#b45309] hover:bg-[#fef3c7] disabled:opacity-50"
                  >
                    ⏸ Put On Hold
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCancelModalMode(isSolo ? 'SOLO_CANCEL' : 'TEAM_REQUEST')
                      setIsCancelModalOpen(true)
                    }}
                    disabled={isActionSubmitting}
                    className="rounded-full border border-[#fca5a5] bg-white px-4 py-2 text-[14px] font-bold text-[#dc2626] hover:bg-[#fef2f2] disabled:opacity-50"
                  >
                    ✕ Cancel Project
                  </button>
                </>
              )}

              {/* ON_HOLD: Resume & Cancel */}
              {project.status === 'ON_HOLD' && (isCurrentPM || isCEO) && (
                <>
                  <button
                    type="button"
                    onClick={() => setIsActivationModalOpen(true)}
                    disabled={isActionSubmitting}
                    className="rounded-full bg-[#10b981] px-5 py-2 text-[14px] font-bold text-white shadow hover:bg-[#059669] disabled:opacity-50"
                  >
                    ▶ Resume Project
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCancelModalMode(isSolo ? 'SOLO_CANCEL' : 'TEAM_REQUEST')
                      setIsCancelModalOpen(true)
                    }}
                    disabled={isActionSubmitting}
                    className="rounded-full border border-[#fca5a5] bg-white px-4 py-2 text-[14px] font-bold text-[#dc2626] hover:bg-[#fef2f2] disabled:opacity-50"
                  >
                    ✕ Cancel Project
                  </button>
                </>
              )}

              {/* PENDING_CEO_CLOSURE: CEO Decision */}
              {project.status === 'PENDING_CEO_CLOSURE' && isCEO && (
                <button
                  type="button"
                  onClick={() => setIsClosureModalOpen(true)}
                  disabled={isActionSubmitting}
                  className="rounded-full bg-[#059669] px-5 py-2 text-[14px] font-bold text-white shadow hover:bg-[#047857] disabled:opacity-50"
                >
                  Review Closure Sign-Off
                </button>
              )}

              {/* COMPLETED: Reactivate & Archive (CEO Only) */}
              {project.status === 'COMPLETED' && isCEO && (
                <>
                  <button
                    type="button"
                    onClick={handleReactivateProject}
                    disabled={isActionSubmitting}
                    className="rounded-full border border-[#7c3aed] bg-[#ede9fe] px-5 py-2 text-[14px] font-bold text-[#7c3aed] hover:bg-[#ddd6fe] disabled:opacity-50"
                  >
                    ↻ Reactivate to PLANNED
                  </button>
                  <button
                    type="button"
                    onClick={handleArchiveProject}
                    disabled={isActionSubmitting}
                    className="rounded-full border border-[#cbd5e1] bg-[#f8fafc] px-4 py-2 text-[14px] font-bold text-[#475569] hover:bg-[#f1f5f9] disabled:opacity-50"
                  >
                    📦 Archive Project
                  </button>
                </>
              )}

              {/* ARCHIVED: Read-Only Badge */}
              {project.status === 'ARCHIVED' && (
                <span className="rounded-full bg-[#f1f5f9] px-4 py-2 text-xs font-bold text-[#64748b] border border-[#cbd5e1]">
                  📦 Archived Historical Record (Read-Only)
                </span>
              )}

              {/* CANCELLED: Read-Only Badge (Never archived per X3) */}
              {project.status === 'CANCELLED' && (
                <span className="rounded-full bg-[#fef2f2] px-4 py-2 text-xs font-bold text-[#b91c1c] border border-[#fecaca]">
                  ✕ Project Cancelled (Read-Only)
                </span>
              )}
            </div>
          </div>
        </div>

        {/* HR Read-Only Scope Banner */}
        {isHR && (
          <div className="rounded-[20px] border border-[#dbeafe] bg-[#eff6ff] p-4 text-[#1e40af] text-xs">
            <p className="font-bold">Company-Wide Organizational Oversight (HR Scope):</p>
            <p className="mt-0.5">
              You have company-wide visibility to track project deliverables, deadlines, and headcount. Per locked governance rules, HR has read-only access and does not participate in project setup, task approval, or change request reviews.
            </p>
          </div>
        )}

        {/* Milestone & Metrics Grid */}
        <div className="grid gap-6 xl:grid-cols-3">
          {/* Mathematical Progress Card */}
          <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-[#6b7280]">Mathematical Progress</p>
            <div className="mt-4">
              <ProjectProgressBar
                completedTasks={mathStats.completed}
                totalActiveTasks={mathStats.totalActive}
                explicitPercentage={mathStats.progress}
                size="lg"
              />
            </div>
            <p className="mt-3 text-xs text-[#6b7280]">
              Formula: (Approved Completed Tasks ÷ Active Tasks) × 100.
            </p>
          </div>

          {/* Delivery Breakdown */}
          <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-[#6b7280]">Delivery Breakdown</p>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-xl bg-[#ecfdf5] p-2.5">
                <span className="block text-[18px] font-black text-[#059669]">{mathStats.completed}</span>
                <span className="text-[#065f46] font-semibold">Completed</span>
              </div>
              <div className="rounded-xl bg-[#eff6ff] p-2.5">
                <span className="block text-[18px] font-black text-[#2563eb]">{mathStats.inProgress}</span>
                <span className="text-[#1e40af] font-semibold">In Progress</span>
              </div>
              <div className="rounded-xl bg-[#fff1f2] p-2.5">
                <span className="block text-[18px] font-black text-[#e11d48]">{mathStats.blocked}</span>
                <span className="text-[#9f1239] font-semibold">Blocked</span>
              </div>
            </div>
          </div>

          {/* Staffing & Leadership */}
          <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm text-[14px]">
            <p className="text-xs font-bold uppercase tracking-wider text-[#6b7280]">Project Governance</p>
            <div className="mt-3 space-y-2">
              <p className="flex items-center justify-between">
                <span className="text-[#6b7280]">Primary Lead:</span>
                <span className="flex items-center gap-2">
                  <span className="font-bold text-[#111827]">
                    {members.find((m) => m.is_current_pm || m.isPm)?.name ||
                      project.primaryPm ||
                      (project.current_pm_id ? `User #${project.current_pm_id}` : (isSolo ? 'Executive Oversight' : 'Unassigned'))}
                  </span>
                  {isCEO && !isClosedProject && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPmCandidateId(null)
                        setIsReplacePmModalOpen(true)
                      }}
                      className="rounded-full bg-[#eff6ff] px-2.5 py-0.5 text-[11px] font-bold text-[#2563eb] hover:bg-[#dbeafe]"
                    >
                      {members.some((m) => m.is_current_pm || m.isPm) ? '⇄ Replace PM' : '★ Assign PM'}
                    </button>
                  )}
                </span>
              </p>
              <p className="flex justify-between">
                <span className="text-[#6b7280]">Target End Date:</span>
                <span className="font-semibold text-[#111827]">{projectTargetEndDate}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-[#6b7280]">Start Date:</span>
                <span className="font-semibold text-[#111827]">{projectStartDate || 'Not set'}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-[#6b7280]">Active Members:</span>
                <span className="font-semibold text-[#111827]">{project.active_member_count || members.filter((m) => m.is_active !== false).length}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Tabbed Workspace */}
        <div className="rounded-[28px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
          {/* Tabs Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e5e7eb] pb-4">
            <div className="flex items-center gap-2">
              {[
                { key: 'TASKS', label: `Tasks (${mathStats.totalActive})` },
                { key: 'MEMBERS', label: `Team Members (${members.length})` },
                { key: 'AUDIT', label: 'Activity & Audit Log' },
              ].map((tab) => (
                <button
                  type="button"
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`rounded-full px-5 py-2 text-xs font-bold transition ${
                    activeTab === tab.key
                      ? 'bg-[#111827] text-white shadow-sm'
                      : 'bg-[#f1f5f9] text-[#6b7280] hover:bg-[#e2e8f0] hover:text-[#111827]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Contextual Action Buttons */}
            <div>
              {activeTab === 'TASKS' && (isCEO || isCurrentPM || isTL) && (
                project.status === 'ACTIVE' ? (
                  <button
                    type="button"
                    onClick={() => setIsTaskCreateModalOpen(true)}
                    className="rounded-full bg-[#2563eb] px-4 py-2 text-xs font-bold text-white shadow hover:bg-[#1d4ed8]"
                  >
                    + Add Task
                  </button>
                ) : project.status === 'PLANNED' ? (
                  <button
                    type="button"
                    onClick={() => setIsActivationModalOpen(true)}
                    className="rounded-full border border-[#fde68a] bg-[#fffbeb] px-4 py-2 text-xs font-bold text-[#b45309] hover:bg-[#fef3c7] transition"
                    title="Activate project before assigning tasks"
                  >
                    🔒 Activate Project to Assign Tasks
                  </button>
                ) : null
              )}

              {activeTab === 'MEMBERS' && (isCEO || isCurrentPM || isTL) && !isClosedProject && (
                <div className="flex items-center gap-2">
                  {isCEO && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPmCandidateId(null)
                        setIsReplacePmModalOpen(true)
                      }}
                      className="rounded-full border border-[#2563eb] bg-[#eff6ff] px-4 py-2 text-xs font-bold text-[#2563eb] shadow-sm hover:bg-[#dbeafe]"
                    >
                      {members.some((m) => m.is_current_pm || m.isPm) ? '⇄ Replace PM' : '★ Assign PM'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsMemberModalOpen(true)}
                    className="rounded-full bg-[#2563eb] px-4 py-2 text-xs font-bold text-white shadow hover:bg-[#1d4ed8]"
                  >
                    {isSolo
                      ? members.length === 0
                        ? '+ Assign Solo Contributor'
                        : '+ Add Contributor'
                      : '+ Add Member'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Active Tab View */}
          <div className="mt-6">
            {/* TASKS TAB */}
            {activeTab === 'TASKS' && (
              <div className="space-y-4">
                {/* Task Filters */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#f8fafc] p-3 border border-[#f1f5f9]">
                  <div className="flex flex-wrap items-center gap-3">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#6b7280] block mb-1">
                        Filter by Status
                      </label>
                      <select
                        value={taskStatusFilter}
                        onChange={(e) => setTaskStatusFilter(e.target.value)}
                        className="rounded-xl border border-[#cbd5e1] bg-white px-3 py-1.5 text-xs font-semibold text-[#111827] focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">All Statuses</option>
                        <option value="TODO">To Do (TODO)</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="PENDING_TL_REVIEW">Under TL Review</option>
                        <option value="PENDING_PM_APPROVAL">Awaiting PM Approval</option>
                        <option value="DIRECT_APPROVAL_REQUIRED">Direct PM Approval</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                        <option value="BLOCKED">Blocked</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#6b7280] block mb-1">
                        Filter by Assignee
                      </label>
                      <select
                        value={taskAssigneeFilter}
                        onChange={(e) => setTaskAssigneeFilter(e.target.value)}
                        className="rounded-xl border border-[#cbd5e1] bg-white px-3 py-1.5 text-xs font-semibold text-[#111827] focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">All Members</option>
                        {members.map((m) => (
                          <option key={m.user_id || m.id} value={m.user_id || m.id}>
                            {m.name || `User #${m.user_id || m.id}`}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {(taskStatusFilter || taskAssigneeFilter) && (
                    <button
                      type="button"
                      onClick={() => {
                        setTaskStatusFilter('')
                        setTaskAssigneeFilter('')
                      }}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 self-end pb-2"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>

                {project.status === 'PLANNED' && (
                  <div className="rounded-2xl border border-[#fed7aa] bg-[#fffbeb] p-4 text-[#9a3412] flex flex-wrap items-center justify-between gap-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🔒</span>
                      <div>
                        <p className="text-sm font-bold text-[#92400e]">First Activation Is Needed</p>
                        <p className="text-xs text-[#b45309]">
                          This project is currently in <strong>PLANNED</strong> status. You cannot assign tasks until the project has been officially activated.
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsActivationModalOpen(true)}
                      className="rounded-full bg-[#10b981] px-5 py-2 text-xs font-bold text-white shadow hover:bg-[#059669] transition"
                    >
                      🚀 Click to Activate Project
                    </button>
                  </div>
                )}

                <ProjectTaskTable
                  tasks={enrichedTasks}
                  currentUser={currentUser}
                  isPM={isCurrentPM}
                  isSolo={isSolo}
                  onOpenUpdateModal={(t) => setActiveUpdateTask(t)}
                  onOpenDetailModal={(t) => setActiveDetailTask(t)}
                  onOpenApprovalModal={(t) => setActiveApprovalTask(t)}
                  onOpenChangeRequestModal={(t) => setActiveChangeTask(t)}
                  onOpenChangeReviewModal={(t) => setActiveChangeReviewTask(t)}
                  onOpenCancelModal={(t) => setActiveCancelTask(t)}
                  onSetStatus={handleSetTaskStatus}
                />
              </div>
            )}

            {/* MEMBERS TAB */}
            {activeTab === 'MEMBERS' && (
              <div className="space-y-6">
                {/* Inactive Members Toggle */}
                <div className="flex items-center justify-between rounded-2xl bg-[#f8fafc] p-3 border border-[#f1f5f9]">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#374151]">
                    <input
                      type="checkbox"
                      checked={showInactiveMembers}
                      onChange={(e) => setShowInactiveMembers(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>Include Deactivated / Former Members (E05 include_inactive)</span>
                  </label>
                  <span className="text-xs text-gray-500">
                    Total: {members.length} member{members.length === 1 ? '' : 's'}
                  </span>
                </div>

                {isSolo && (
                  <div className="rounded-2xl border border-[#ddd6fe] bg-[#f5f3ff] p-4 text-xs text-[#5b21b6] flex flex-wrap items-center justify-between gap-3 shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">⚡</span>
                      <div>
                        <p className="font-bold text-[#4c1d95]">
                          Direct Executive Governance Active (Solo / Independent)
                        </p>
                        <p className="text-[11px] text-[#6d28d9] mt-0.5">
                          Assigned contributors operate with direct CEO oversight. Work deliverables and scope changes route directly to the CEO.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <ProjectMembersTable
                  members={members}
                  tasks={enrichedTasks}
                  onRemoveMember={(m) => setActiveMemberAction({ member: m, actionType: 'REMOVE' })}
                  onDeactivateMember={(m) => setActiveMemberAction({ member: m, actionType: 'DEACTIVATE' })}
                  onActivateMember={handleActivateMember}
                  onAssignPm={(m) => {
                    setSelectedPmCandidateId(String(m.user_id || m.id))
                    setIsReplacePmModalOpen(true)
                  }}
                  isCEO={isCEO}
                  canManage={(isCEO || isCurrentPM || isTL) && !isClosedProject}
                  projectStatus={project.status}
                />
              </div>
            )}

            {/* AUDIT TAB */}
            {activeTab === 'AUDIT' && (
              <div className="space-y-4">
                <div className="rounded-2xl border border-[#e2e8f0] bg-[#f8fafc] p-4 text-xs text-[#475569]">
                  <p className="font-bold text-[#0f172a]">Immutable Governance Audit Log</p>
                  <p className="mt-0.5">
                    All administrative decisions, PM designations, member additions/removals, work updates, and completion reviews are permanently recorded with authenticated actors and timestamps.
                  </p>
                </div>
                <ProjectAuditTimeline events={project.auditEvents || []} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* MODAL DIALOGS                              */}
      {/* ========================================== */}

      {/* E09 / E11: Activation / Resume Modal */}
      <ProjectActivationModal
        isOpen={isActivationModalOpen}
        onClose={() => setIsActivationModalOpen(false)}
        project={project}
        members={members}
        onConfirmActivation={handleActivateProject}
        isSubmitting={isActionSubmitting}
        apiError={actionError}
      />

      {/* E03 PATCH: Project Metadata Edit Modal */}
      <ProjectEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        project={project}
        onSave={handleSaveMetadata}
        isSubmitting={isActionSubmitting}
        apiError={actionError}
      />

      {/* E05 POST: Add Member Modal */}
      <ProjectMemberModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        onAddMember={handleAddMember}
        existingMemberIds={[
          ...members.filter((m) => m.is_active !== false).map((m) => m.user_id || m.id),
          ...members.filter((m) => m.is_active !== false).map((m) => m.name),
        ]}
        isSolo={isSolo}
        projectStatus={project.status}
        isSubmitting={isActionSubmitting}
        apiError={actionError}
      />

      {/* E06 / E07: Member Removal & Deactivation Modal */}
      <MemberActionModal
        isOpen={Boolean(activeMemberAction)}
        onClose={() => setActiveMemberAction(null)}
        actionType={activeMemberAction?.actionType || 'REMOVE'}
        member={activeMemberAction?.member}
        projectMembers={members}
        incompleteTasks={enrichedTasks.filter(
          (t) =>
            String(t.assignee_id || t.assigneeId) === String(activeMemberAction?.member?.user_id || activeMemberAction?.member?.id) &&
            !['COMPLETED', 'CANCELLED'].includes(t.status)
        )}
        onConfirm={handleMemberActionConfirm}
        isSubmitting={isActionSubmitting}
        apiError={actionError}
      />

      {/* E04 POST: Replace Primary PM Modal */}
      <ReplacePmModal
        isOpen={isReplacePmModalOpen}
        onClose={() => {
          setIsReplacePmModalOpen(false)
          setSelectedPmCandidateId(null)
        }}
        currentPmName={members.find((m) => m.is_current_pm)?.name || project.primaryPm}
        projectMembers={members}
        initialCandidateId={selectedPmCandidateId}
        onConfirmReplacement={handleConfirmReplacePm}
        isSubmitting={isActionSubmitting}
        apiError={actionError}
      />

      {/* E08 POST: Solo to Team Conversion Modal */}
      <StaffingModeConvertModal
        isOpen={isConvertModalOpen}
        onClose={() => setIsConvertModalOpen(false)}
        project={project}
        existingMembers={members}
        onConfirmConversion={handleConvertSoloToTeam}
        onOpenAssignPm={() => {
          setSelectedPmCandidateId(null)
          setIsReplacePmModalOpen(true)
        }}
        isSubmitting={isActionSubmitting}
        apiError={actionError}
      />

      {/* E30 POST: Create Task Modal */}
      <TaskCreateModal
        isOpen={isTaskCreateModalOpen}
        onClose={() => setIsTaskCreateModalOpen(false)}
        projectMembers={members}
        onCreateTask={handleCreateTask}
        projectStatus={project.status}
        isSubmitting={isActionSubmitting}
        apiError={actionError}
      />

      {/* E19 POST: Task Work Update Modal */}
      <TaskWorkUpdateModal
        isOpen={Boolean(activeUpdateTask)}
        onClose={() => setActiveUpdateTask(null)}
        task={activeUpdateTask}
        onSubmitUpdate={handleWorkUpdate}
        isSubmitting={isActionSubmitting}
        apiError={actionError}
      />

      {/* E21 POST & E24 GET: Task Approval & File Download Modal */}
      <TaskApprovalModal
        isOpen={Boolean(activeApprovalTask)}
        onClose={() => setActiveApprovalTask(null)}
        task={activeApprovalTask}
        projectId={projectId}
        currentUser={currentUser}
        onApprove={handleApproveTask}
        onReject={handleRejectTask}
        onDownloadFile={handleDownloadDeliverableFile}
        isSubmitting={isActionSubmitting}
        apiError={actionError}
      />

      {/* E22 POST: Task-Change Request Modal */}
      <TaskChangeRequestModal
        isOpen={Boolean(activeChangeTask)}
        onClose={() => setActiveChangeTask(null)}
        task={activeChangeTask}
        projectMembers={members}
        onSubmitRequest={handleSubmitTaskChange}
        isSubmitting={isActionSubmitting}
        apiError={actionError}
      />

      {/* E23 POST: Task-Change Review Modal */}
      <TaskChangeReviewModal
        isOpen={Boolean(activeChangeReviewTask)}
        onClose={() => setActiveChangeReviewTask(null)}
        task={activeChangeReviewTask}
        currentUser={currentUser}
        onApprove={handleApproveTaskChange}
        onReject={handleRejectTaskChange}
        isSubmitting={isActionSubmitting}
        apiError={actionError}
      />

      {/* E34 POST: Cancel Task Modal */}
      <TaskCancelModal
        isOpen={Boolean(activeCancelTask)}
        onClose={() => setActiveCancelTask(null)}
        task={activeCancelTask}
        onCancelTask={handleCancelTask}
        isSubmitting={isActionSubmitting}
        apiError={actionError}
      />

      {/* E10 POST: Hold Project Modal */}
      <ProjectHoldModal
        isOpen={isHoldModalOpen}
        onClose={() => setIsHoldModalOpen(false)}
        projectTitle={projectName}
        onConfirmHold={handleHoldProject}
      />

      {/* E12 / E27 / E29: Project Cancel Modal */}
      <ProjectCancelModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        projectTitle={projectName}
        mode={cancelModalMode}
        onConfirm={handleCancelConfirm}
        isSubmitting={isActionSubmitting}
        apiError={actionError}
      />

      {/* E15 / E16 / E17 / E18: Project Closure Modal */}
      <ProjectClosureModal
        isOpen={isClosureModalOpen}
        onClose={() => setIsClosureModalOpen(false)}
        project={project}
        isCEO={isCEO}
        blockers={closureBlockers}
        onRequestClosure={handleRequestClosure}
        onApproveClosure={handleApproveClosure}
        onRejectClosure={handleRejectClosure}
        isSubmitting={isActionSubmitting}
        apiError={actionError}
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

      {/* 3-Rejection Quality Risk Notification Pop-up Modal */}
      {qualityRiskAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-red-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-2xl text-red-600 mb-4">
              ⚠️
            </div>
            <div className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-black uppercase text-red-700 mb-2">
              Quality Risk: {qualityRiskAlert.reworkCount} Rejections
            </div>
            <h3 className="text-lg font-black text-gray-900">
              Quality Risk Threshold Reached
            </h3>
            <p className="mt-2 text-sm text-gray-600 font-medium">
              Task has undergone {qualityRiskAlert.reworkCount} rejections. Schedule a sync meeting with the assignee before resubmission.
            </p>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setQualityRiskAlert(null)}
                className="rounded-full bg-red-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-red-700 transition"
              >
                Acknowledge &amp; Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default ProjectDetails
