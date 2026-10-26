import { useContext, useEffect, useMemo, useState } from 'react'
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

const STORAGE_KEY = 'jawam_projects_state_v1'
const TL_REQUESTS_KEY = 'jawam_tl_project_requests_v1'
const TL_PERMISSION_KEY = 'jawam_tl_can_create_projects_v1'
const TL_CONSUMED_KEY = 'jawam_tl_creation_consumed_v1'

const getInitialTLRequests = () => [
  {
    id: 'tlreq-initial-shivani',
    requestedBy: 'Shivani k',
    projectName: 'Mobile Banking & Field Attendance Overhaul',
    description: 'Client-facing mobile module for geo-fenced punches, camera verification, and offline sync.',
    priority: 'High',
    staffingMode: 'TEAM',
    justification: 'High business urgency for enterprise field workers who work outside office networks.',
    status: 'PENDING_CEO_APPROVAL',
    submittedAt: new Date().toLocaleDateString(),
  },
]

function loadTLRequests() {
  try {
    const saved = localStorage.getItem(TL_REQUESTS_KEY)
    if (saved) return JSON.parse(saved)
  } catch (e) {
    console.error('Error loading TL requests from localStorage', e)
  }
  return getInitialTLRequests()
}

function loadCanTLCreate(projectsList = []) {
  try {
    const saved = localStorage.getItem(TL_PERMISSION_KEY)
    if (saved !== null) {
      const parsed = JSON.parse(saved)
      // One-time permission check: if permission was granted but a project was already created by TL, consume it
      const hasCreatedProject = (projectsList || []).some(
        (p) => p.createdBy === 'Shivani k' || (p.id && String(p.id).startsWith('proj-') && p.createdBy)
      )
      const isConsumed = localStorage.getItem(TL_CONSUMED_KEY) === 'true'
      if (parsed === true && (isConsumed || hasCreatedProject)) {
        localStorage.setItem(TL_PERMISSION_KEY, JSON.stringify(false))
        localStorage.setItem(TL_CONSUMED_KEY, 'true')
        return false
      }
      return parsed
    }
  } catch (e) {
    console.error('Error loading TL permission from localStorage', e)
  }
  return false
}

// Dynamic initial enterprise projects seed
const getInitialProjects = () => [
  {
    id: 'hrms',
    title: 'HRMS NextGen Suite',
    description: 'Enterprise HRMS overhaul with modular dashboards, role governance, and attendance.',
    status: 'ACTIVE',
    priority: 'High',
    staffingMode: 'TEAM',
    primaryPm: 'Rajesh Singh',
    teamLead: 'Shivani k',
    dueDate: '30/12/2026',
    membersCount: 4,
    members: [
      { id: 'emp-kp', name: 'Kanishk Prashad', role: 'UI/UX Developer', isIndependent: false },
      { id: 'emp-sk', name: 'Shivani k', role: 'Team Leader', isIndependent: false },
      { id: 'emp-2', name: 'Rajesh Singh', role: 'Project Manager', isPm: true },
      { id: 'emp-4', name: 'Brijesh Bisht', role: 'Backend Engineer', isIndependent: false },
    ],
    tasks: [
      { id: 't-1', name: 'Dashboard UI Architecture', assignee: 'Kanishk Prashad', assigneeId: 'emp-kp', progress: 100, status: 'COMPLETED', reworkCount: 0, dueDate: '30/12/2026' },
      { id: 't-2', name: 'Attendance Geolocation Punch', assignee: 'Kanishk Prashad', assigneeId: 'emp-kp', progress: 80, status: 'IN_PROGRESS', reworkCount: 0, dueDate: '30/12/2026' },
      { id: 't-3', name: 'Leave Workflow Validation', assignee: 'Kanishk Prashad', assigneeId: 'emp-kp', progress: 100, status: 'PENDING_TL_REVIEW', reworkCount: 1, dueDate: '30/12/2026', deliverable: { type: 'LINK', value: 'https://github.com/Jawam-Infotech/jawam-hrms-fe/pull/15' } },
      { id: 't-4', name: 'Biometric API Gateway', assignee: 'Brijesh Bisht', assigneeId: 'emp-4', progress: 40, status: 'BLOCKED', reworkCount: 0, dueDate: '30/12/2026' },
    ],
  },
  {
    id: 'ai-screen',
    title: 'AI Resume Screening Tool',
    description: 'Autonomous LLM-assisted candidate screening pipeline for recruitment.',
    status: 'ACTIVE',
    priority: 'Medium',
    staffingMode: 'SOLO',
    primaryPm: 'CEO Oversight',
    dueDate: '15/11/2026',
    membersCount: 1,
    members: [
      { id: 'emp-5', name: 'Priya Verma', role: 'Full Stack Engineer', isIndependent: true },
    ],
    tasks: [
      { id: 't-5', name: 'Resume Parser Core', assignee: 'Priya Verma', assigneeId: 'emp-5', progress: 100, status: 'DIRECT_APPROVAL_REQUIRED', reworkCount: 0, deliverable: { type: 'LINK', value: 'https://figma.com/file/ai-screen-prototype' }, isIndependent: true, dueDate: '20/12/2026' },
      { id: 't-6', name: 'Candidate Scoring Algorithm', assignee: 'Priya Verma', assigneeId: 'emp-5', progress: 50, status: 'IN_PROGRESS', reworkCount: 0, isIndependent: true, dueDate: '20/12/2026' },
    ],
  },
  {
    id: 'mobile-app',
    title: 'Employee Mobile Self-Service',
    description: 'React Native companion app for clocking attendance and leave balance.',
    status: 'PENDING_CEO_CLOSURE',
    priority: 'High',
    staffingMode: 'TEAM',
    primaryPm: 'Rajesh Singh',
    teamLead: 'Shivani k',
    dueDate: '10/10/2026',
    membersCount: 2,
    members: [
      { id: 'emp-2', name: 'Rajesh Singh', role: 'Project Manager', isPm: true },
      { id: 'emp-sk', name: 'Shivani k', role: 'Team Leader', isIndependent: false },
      { id: 'emp-kp', name: 'Kanishk Prashad', role: 'Frontend Engineer', isIndependent: false },
    ],
    tasks: [
      { id: 't-7', name: 'Push Notifications Hook', assignee: 'Kanishk Prashad', assigneeId: 'emp-kp', progress: 100, status: 'COMPLETED', reworkCount: 0, dueDate: '10/10/2026' },
      { id: 't-8', name: 'App Store Submission Package', assignee: 'Rajesh Singh', assigneeId: 'emp-2', progress: 100, status: 'COMPLETED', reworkCount: 0, dueDate: '10/10/2026' },
    ],
  },
  {
    id: 'infra-cloud',
    title: 'AWS Cloud Cost Optimization',
    description: 'DevOps audit and spot instance automated scheduling.',
    status: 'PLANNED',
    priority: 'Low',
    staffingMode: 'TEAM',
    primaryPm: null,
    dueDate: '20/01/2027',
    membersCount: 1,
    members: [
      { id: 'emp-6', name: 'Karan Mehra', role: 'DevOps Specialist', isIndependent: false },
    ],
    tasks: [],
  },
]

function sanitizeProjectsList(list) {
  if (!Array.isArray(list)) return []
  return list.map((p) => {
    const cleanedMembers = (p.members || []).filter(
      (m) => m && m.role !== 'CEO' && m.id !== 'emp-gp' && m.name !== 'Gaurav Pandey',
    )
    return {
      ...p,
      members: cleanedMembers,
      membersCount: cleanedMembers.length,
    }
  })
}

function loadProjects() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed)) {
        const sanitized = sanitizeProjectsList(parsed)
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized))
        } catch (err) {
          console.error(err)
        }
        return sanitized
      }
    }
  } catch (e) {
    console.error('Error loading projects from localStorage', e)
  }
  return sanitizeProjectsList(getInitialProjects())
}

function Projects() {
  const { user } = useContext(UserContext)

  const currentUser = useMemo(() => user || {
    name: 'Kanishk Prashad',
    role: 'EMPLOYEE',
    canCreateProjects: false,
  }, [user])

  const [projects, setProjects] = useState(loadProjects)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(projects))
    } catch (e) {
      console.error('Error saving projects to localStorage', e)
    }
  }, [projects])

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isTLRequestModalOpen, setIsTLRequestModalOpen] = useState(false)
  const [activeUpdateTask, setActiveUpdateTask] = useState(null)
  const [activeApprovalTask, setActiveApprovalTask] = useState(null)
  const [activeClosureProject, setActiveClosureProject] = useState(null)
  const [activeChangeReviewTask, setActiveChangeReviewTask] = useState(null)

  // TL project creation permission — toggled by CEO via Grant/Deny (persisted across accounts)
  const [tlProjectRequests, setTLProjectRequests] = useState(loadTLRequests)
  const [canTLCreate, setCanTLCreate] = useState(() => {
    const currentProjs = loadProjects()
    return loadCanTLCreate(currentProjs)
  })

  useEffect(() => {
    try {
      localStorage.setItem(TL_REQUESTS_KEY, JSON.stringify(tlProjectRequests))
    } catch (e) {
      console.error('Error saving TL requests to localStorage', e)
    }
  }, [tlProjectRequests])

  useEffect(() => {
    try {
      localStorage.setItem(TL_PERMISSION_KEY, JSON.stringify(canTLCreate))
    } catch (e) {
      console.error('Error saving TL permission to localStorage', e)
    }
  }, [canTLCreate])

  // Sync projects and TL requests in real-time across tabs / role switching
  useEffect(() => {
    const handleSync = () => {
      setProjects(loadProjects())
      setTLProjectRequests(loadTLRequests())
      setCanTLCreate(loadCanTLCreate(loadProjects()))
    }
    window.addEventListener('storage', handleSync)
    window.addEventListener('focus', handleSync)
    return () => {
      window.removeEventListener('storage', handleSync)
      window.removeEventListener('focus', handleSync)
    }
  }, [])

  // Enriched projects with mathematical progress
  const enrichedProjects = useMemo(() => {
    return projects.map((p) => {
      const activeTasks = (p.tasks || []).filter((t) => t.status !== 'CANCELLED')
      const completedTasks = activeTasks.filter((t) => t.status === 'COMPLETED')
      const mathProgress = activeTasks.length > 0
        ? Math.round((completedTasks.length / activeTasks.length) * 100)
        : 0

      return {
        ...p,
        activeTasksCount: activeTasks.length,
        completedTasksCount: completedTasks.length,
        openTasksCount: activeTasks.filter((t) => t.status !== 'COMPLETED').length,
        progress: mathProgress,
      }
    })
  }, [projects])

  // All tasks flattened
  const allTasks = useMemo(() => {
    const list = []
    enrichedProjects.forEach((p) => {
      (p.tasks || []).forEach((t) => {
        list.push({
          ...t,
          projectTitle: p.title,
          projectId: p.id,
          primaryPm: p.primaryPm,
          teamLead: p.teamLead,
          members: p.members,
        })
      })
    })
    return list
  }, [enrichedProjects])

  // All active task-change requests (TCR) across projects
  const allTCRs = useMemo(() => {
    return allTasks.filter(
      (t) =>
        t.changeRequest &&
        t.changeRequest.status &&
        !['APPROVED', 'REJECTED'].includes(t.changeRequest.status),
    )
  }, [allTasks])

  // Team Leader TCR reviews queue (Stage 1)
  const tlTcrReviews = useMemo(() => {
    return allTCRs.filter((t) => {
      const status = t.changeRequest?.status
      if (status !== 'PENDING_TL_REVIEW') return false
      if (t.changeRequest?.requester === currentUser.name) return false
      // If currentUser is TL, show requests under their projects
      if (currentUser.role === 'TL') {
        return !t.teamLead || t.teamLead === currentUser.name || (t.members || []).some((m) => m.name === currentUser.name)
      }
      return true
    })
  }, [allTCRs, currentUser])

  // Executive / PM TCR reviews queue (Stage 2 or Solo/PM requests or Executive Oversight)
  const executiveTcrReviews = useMemo(() => {
    return allTCRs.filter((t) => {
      const status = t.changeRequest?.status
      if (!status) return false
      // CEO has company-wide executive visibility over all pending change requests
      if (currentUser.role === 'CEO') return true
      // If user is project primary PM, show TCRs awaiting PM approval
      if (t.primaryPm === currentUser.name) {
        return ['PENDING_PM_APPROVAL', 'DIRECT_APPROVAL_REQUIRED', 'PENDING_CEO_APPROVAL'].includes(status)
      }
      return false
    })
  }, [allTCRs, currentUser])

  // Role-scoped data filters
  // 1. Employee: only projects where they are a member, only their tasks
  const employeeProjects = useMemo(() => {
    return enrichedProjects.filter((p) =>
      (p.members || []).some((m) => m.name === currentUser.name || m.id === currentUser.id),
    )
  }, [enrichedProjects, currentUser])

  const myTasks = useMemo(() => {
    return allTasks.filter((t) =>
      t.assignee === currentUser.name || t.assigneeId === currentUser.id,
    )
  }, [allTasks, currentUser])

  // 2. Team Leader: Team reviews queue (only PENDING_TL_REVIEW tasks from team)
  const teamReviews = useMemo(() => {
    return allTasks.filter((t) => t.status === 'PENDING_TL_REVIEW')
  }, [allTasks])

  // 3. CEO: Pending closures and direct approvals
  const pendingClosures = useMemo(() => {
    return enrichedProjects.filter((p) => p.status === 'PENDING_CEO_CLOSURE')
  }, [enrichedProjects])

  const directApprovals = useMemo(() => {
    return allTasks.filter((t) =>
      ['DIRECT_APPROVAL_REQUIRED', 'PENDING_CEO_APPROVAL', 'PENDING_PM_APPROVAL'].includes(t.status),
    )
  }, [allTasks])

  // Mutation Handlers
  const handleCreateProject = (newProjectData) => {
    // Non-Negotiable Rule 2.1: The project creator is not automatically its PM
    // and is not automatically an assigned member.
    const created = {
      ...newProjectData,
      id: `proj-${Date.now()}`,
      createdBy: currentUser.name,
      members: newProjectData.members || [],
      pmHistory: newProjectData.primaryPm
        ? [{ previousPm: null, newPm: newProjectData.primaryPm, reason: 'Initial PM designated upon project creation', replacedBy: currentUser.name, timestamp: new Date().toLocaleString() }]
        : [],
      tasks: [],
    }
    setProjects((prev) => [created, ...prev])

    // TL project creation permission is strictly single-use: consumed upon creating 1 project
    if (currentUser.role === 'TL') {
      setCanTLCreate(false)
      try {
        localStorage.setItem(TL_PERMISSION_KEY, JSON.stringify(false))
        localStorage.setItem(TL_CONSUMED_KEY, 'true')
      } catch (e) {
        console.error('Error updating TL permission after project creation', e)
      }
    }
  }

  // TL submits a project creation request → goes to CEO queue
  const handleTLRequest = (requestData) => {
    setTLProjectRequests((prev) => [requestData, ...prev])
  }

  // CEO grants permission → TL project is created immediately, notification dispatched
  const handleGrantTLPermission = (req) => {
    // 1. Remove from pending TL requests queue
    const updatedRequests = tlProjectRequests.filter((r) => r.id !== req.id)
    setTLProjectRequests(updatedRequests)
    try {
      localStorage.setItem(TL_REQUESTS_KEY, JSON.stringify(updatedRequests))
    } catch (e) {
      console.error('Error saving updated TL requests', e)
    }

    // 2. Automatically instantiate and activate the project requested by the TL!
    const newProjectId = `proj-${Date.now()}`
    const tlName = req.requestedBy || 'Shivani k'
    const newProject = {
      id: newProjectId,
      title: req.projectName,
      description: req.description || 'Project initiated upon CEO approval.',
      priority: req.priority || 'Medium',
      staffingMode: req.staffingMode || 'TEAM',
      status: 'ACTIVE',
      teamLead: tlName,
      createdBy: tlName,
      primaryPm: null,
      dueDate: '30/12/2026',
      membersCount: 1,
      members: [
        { id: 'emp-sk', name: tlName, role: 'Team Leader', isIndependent: false },
      ],
      pmHistory: [],
      tasks: [],
      justification: req.justification || '',
      approvedBy: 'Gaurav Pandey (CEO)',
      approvedAt: new Date().toLocaleString(),
    }

    setProjects((prev) => [newProject, ...prev])
    try {
      const currentProjects = loadProjects()
      localStorage.setItem(STORAGE_KEY, JSON.stringify([newProject, ...currentProjects]))
    } catch (e) {
      console.error('Error saving new project to localStorage', e)
    }

    // 3. Consume creation permission
    setCanTLCreate(false)
    try {
      localStorage.setItem(TL_PERMISSION_KEY, JSON.stringify(false))
      localStorage.setItem(TL_CONSUMED_KEY, 'true')
    } catch (e) {
      console.error('Error updating TL permission key in localStorage', e)
    }

    // 4. Create and dispatch persistent Notification for TL
    const newNotification = {
      id: `notif-${Date.now()}`,
      recipientName: tlName,
      recipientRole: 'TL',
      title: 'Project Request Approved',
      message: `CEO Gaurav Pandey accepted your project request for "${req.projectName}". The project is now live in your workspace!`,
      projectName: req.projectName,
      projectId: newProjectId,
      created_at: new Date().toISOString(),
      is_read: false,
    }

    try {
      const savedNotifs = JSON.parse(localStorage.getItem('jawam_custom_notifications_v1') || '[]')
      localStorage.setItem('jawam_custom_notifications_v1', JSON.stringify([newNotification, ...savedNotifs]))

      // Store alert banner payload for TL dashboard and projects view
      localStorage.setItem('jawam_tl_latest_approved_project_v1', JSON.stringify({
        projectName: req.projectName,
        projectId: newProjectId,
        approvedAt: new Date().toLocaleString(),
      }))
    } catch (e) {
      console.error('Error saving notification to localStorage', e)
    }
  }

  // CEO denies the TL request → remove from queue, notify TL
  const handleDenyTLRequest = (reqId) => {
    const req = tlProjectRequests.find((r) => r.id === reqId)
    const updatedRequests = tlProjectRequests.filter((r) => r.id !== reqId)
    setTLProjectRequests(updatedRequests)
    try {
      localStorage.setItem(TL_REQUESTS_KEY, JSON.stringify(updatedRequests))
    } catch (e) {
      console.error('Error updating TL requests', e)
    }

    if (req) {
      const denyNotification = {
        id: `notif-${Date.now()}`,
        recipientName: req.requestedBy || 'Shivani k',
        recipientRole: 'TL',
        title: 'Project Request Denied',
        message: `CEO Gaurav Pandey declined your project request for "${req.projectName}".`,
        projectName: req.projectName,
        created_at: new Date().toISOString(),
        is_read: false,
      }
      try {
        const savedNotifs = JSON.parse(localStorage.getItem('jawam_custom_notifications_v1') || '[]')
        localStorage.setItem('jawam_custom_notifications_v1', JSON.stringify([denyNotification, ...savedNotifs]))
      } catch (e) {
        console.error('Error saving deny notification', e)
      }
    }
  }

  const handleWorkUpdate = ({
    taskId,
    newProgress,
    note,
    decreaseReason,
    deliverable,
    isCompletion,
    isIndependent,
    isBlocked,
    blockerCategory,
    blockerReason,
  }) => {
    setProjects((prev) =>
      prev.map((proj) => ({
        ...proj,
        tasks: (proj.tasks || []).map((task) => {
          if (task.id !== taskId) return task

          let newStatus
          let blockerData

          if (isBlocked) {
            newStatus = 'BLOCKED'
            blockerData = {
              category: blockerCategory || 'General Blocker',
              reason: blockerReason || 'Work is blocked',
              reportedAt: new Date().toISOString(),
            }
          } else {
            blockerData = null
            if (isCompletion) {
              const isAssigneePm = Boolean(
                task.isPm ||
                task.assignee === proj.primaryPm ||
                (proj.members || []).find((m) => (m.id === task.assigneeId || m.name === task.assignee))?.isPm
              )

              if (isAssigneePm) {
                // Section 7.5: Zero Self-Approval Rule: PM tasks route directly to CEO
                newStatus = 'PENDING_CEO_APPROVAL'
              } else if (isIndependent || task.isIndependent || proj.staffingMode === 'SOLO' || proj.isSoloProject) {
                // Section 7.3: Independent Contributor -> Direct PM/CEO Approval
                newStatus = 'DIRECT_APPROVAL_REQUIRED'
              } else {
                // Section 7.3: Team Member under TL -> TL Review
                newStatus = 'PENDING_TL_REVIEW'
              }
            } else if (newProgress > 0) {
              newStatus = 'IN_PROGRESS'
            } else {
              newStatus = 'TODO'
            }
          }

          return {
            ...task,
            progress: newProgress,
            status: newStatus,
            blocker: blockerData,
            lastNote: note,
            lastDecreaseReason: decreaseReason,
            deliverable: deliverable || task.deliverable,
          }
        }),
      })),
    )
  }

  const handleApproveTask = (taskId) => {
    setProjects((prev) =>
      prev.map((proj) => ({
        ...proj,
        tasks: (proj.tasks || []).map((task) => {
          if (task.id !== taskId) return task

          // TL approves -> passes to PM. PM/CEO approves -> COMPLETED
          const isPmOrCeoApprover = currentUser.name === proj.primaryPm || currentUser.role === 'CEO'
          const nextStatus =
            task.status === 'PENDING_TL_REVIEW' && !isPmOrCeoApprover
              ? 'PENDING_PM_APPROVAL'
              : 'COMPLETED'
          return { ...task, status: nextStatus, rejectionFeedback: null }
        }),
      })),
    )
  }

  const handleRejectTask = (taskId, rejectionReason) => {
    setProjects((prev) =>
      prev.map((proj) => ({
        ...proj,
        tasks: (proj.tasks || []).map((task) => {
          if (task.id !== taskId) return task
          return {
            ...task,
            progress: 85,
            status: 'IN_PROGRESS',
            reworkCount: (task.reworkCount || 0) + 1,
            rejectionFeedback: rejectionReason,
          }
        }),
      })),
    )
  }

  const handleApproveClosure = (projId) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projId
          ? {
              ...p,
              status: 'COMPLETED',
              auditEvents: [
                {
                  id: `audit-${Date.now()}`,
                  action: 'Project Closure Approved',
                  actor: currentUser.name,
                  description: 'CEO officially verified deliverables and approved closure.',
                  timestamp: new Date().toLocaleString(),
                },
                ...(p.auditEvents || []),
              ],
            }
          : p,
      ),
    )
  }

  const handleRejectClosure = (projId, rejectionReason) => {
    setProjects((prev) =>
      prev.map((p) =>
        p.id === projId
          ? {
              ...p,
              status: 'ACTIVE',
              closureRejectionReason: rejectionReason,
              auditEvents: [
                {
                  id: `audit-${Date.now()}`,
                  action: 'Project Closure Rejected',
                  actor: currentUser.name,
                  description: `Closure rejected and retained ACTIVE: ${rejectionReason}`,
                  reason: rejectionReason,
                  timestamp: new Date().toLocaleString(),
                },
                ...(p.auditEvents || []),
              ],
            }
          : p,
      ),
    )
  }

  const handleApproveTaskChange = (taskId, changeRequest) => {
    setProjects((prev) =>
      prev.map((proj) => {
        const hasTask = (proj.tasks || []).some((t) => t.id === taskId)
        if (!hasTask) return proj

        let isIntermediate = false
        const updatedTasks = proj.tasks.map((task) => {
          if (task.id !== taskId) return task

          if (!task.changeRequest || task.changeRequest.id !== changeRequest.id) {
            return task
          }

          // Two-stage review: TL recommends -> PM/CEO decides
          if (task.changeRequest.status === 'PENDING_TL_REVIEW' && currentUser.role === 'TL') {
            isIntermediate = true
            return {
              ...task,
              changeRequest: {
                ...task.changeRequest,
                status: 'PENDING_PM_APPROVAL',
                tlRecommendedBy: currentUser.name,
                tlRecommendedAt: new Date().toLocaleString(),
              },
            }
          }

          // Atomic Execution of Approved Change (PM or CEO sign-off)
          const updated = {
            ...task,
            changeRequest: null,
          }

          if (changeRequest.type === 'DEADLINE_EXTENSION') {
            updated.dueDate = changeRequest.requestedChange?.dueDate || task.dueDate
          } else if (changeRequest.type === 'REASSIGNMENT') {
            updated.assignee = changeRequest.requestedChange?.newAssignee || task.assignee
          } else if (changeRequest.type === 'TASK_DELETION') {
            updated.status = 'CANCELLED'
            updated.cancellationReason = changeRequest.reason
          }

          return updated
        })

        const taskName = proj.tasks.find((t) => t.id === taskId)?.name || 'Task'
        const newAudit = isIntermediate
          ? {
              id: `audit-${Date.now()}`,
              action: 'Task-Change Request Recommended by TL (Stage 1 of 2)',
              actor: currentUser.name,
              description: `TL recommended ${changeRequest.type} for "${taskName}". Routed to CEO for final decision.`,
              timestamp: new Date().toLocaleString(),
            }
          : {
              id: `audit-${Date.now()}`,
              action: `Task-Change Request Approved (${changeRequest.type})`,
              actor: currentUser.name,
              description: `Approved ${changeRequest.type} for "${taskName}". Applied changes atomically.`,
              timestamp: new Date().toLocaleString(),
            }

        return {
          ...proj,
          tasks: updatedTasks,
          auditEvents: [newAudit, ...(proj.auditEvents || [])],
        }
      }),
    )
  }

  const handleRejectTaskChange = (taskId, changeRequest, decisionReason) => {
    setProjects((prev) =>
      prev.map((proj) => {
        const hasTask = (proj.tasks || []).some((t) => t.id === taskId)
        if (!hasTask) return proj

        const updatedTasks = proj.tasks.map((task) => {
          if (task.id !== taskId) return task

          if (!task.changeRequest || task.changeRequest.id !== changeRequest.id) {
            return task
          }

          return {
            ...task,
            changeRequest: null,
          }
        })

        const taskName = proj.tasks.find((t) => t.id === taskId)?.name || 'Task'
        const newAudit = {
          id: `audit-${Date.now()}`,
          action: `Task-Change Request Rejected (${changeRequest.type})`,
          actor: currentUser.name,
          description: `Rejected ${changeRequest.type} for "${taskName}". Mandatory Reason: "${decisionReason}"`,
          reason: decisionReason,
          timestamp: new Date().toLocaleString(),
        }

        return {
          ...proj,
          tasks: updatedTasks,
          auditEvents: [newAudit, ...(proj.auditEvents || [])],
        }
      }),
    )
  }

  return (
    <DashboardLayout>
      {/* 1. EMPLOYEE DASHBOARD VIEW */}
      {currentUser.role === 'EMPLOYEE' && (
        <EmployeeProjectsView
          projects={employeeProjects}
          myTasks={myTasks}
          onOpenUpdateModal={(t) => setActiveUpdateTask(t)}
        />
      )}

      {/* 2. TEAM LEADER (TL) DASHBOARD VIEW */}
      {currentUser.role === 'TL' && (
        <TLProjectsView
          projects={enrichedProjects}
          teamReviews={teamReviews}
          tcrReviews={tlTcrReviews}
          myTasks={myTasks}
          canCreateProject={canTLCreate}
          tlProjectRequests={tlProjectRequests}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
          onOpenUpdateModal={(t) => setActiveUpdateTask(t)}
          onOpenApprovalModal={(t) => setActiveApprovalTask(t)}
          onOpenChangeReviewModal={(t) => setActiveChangeReviewTask(t)}
          onOpenRequestModal={() => setIsTLRequestModalOpen(true)}
        />
      )}

      {/* 3. HR DASHBOARD VIEW */}
      {currentUser.role === 'HR' && (
        <HRProjectsView projects={enrichedProjects} />
      )}

      {/* 4. CEO DASHBOARD VIEW */}
      {currentUser.role === 'CEO' && (
        <CEOProjectsView
          projects={enrichedProjects}
          pendingClosures={pendingClosures}
          directApprovals={directApprovals}
          tlProjectRequests={tlProjectRequests}
          tcrReviews={executiveTcrReviews}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
          onOpenApprovalModal={(t) => setActiveApprovalTask(t)}
          onOpenClosureModal={(p) => setActiveClosureProject(p)}
          onOpenChangeReviewModal={(t) => setActiveChangeReviewTask(t)}
          onGrantTLPermission={handleGrantTLPermission}
          onDenyTLRequest={handleDenyTLRequest}
        />
      )}

      {/* Shared Modals */}
      <ProjectCreateModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateProject={handleCreateProject}
        showPmAssignment={currentUser.role === 'CEO'}
      />

      {/* TL Project Creation Request Modal (TL only) */}
      <TLProjectRequestModal
        isOpen={isTLRequestModalOpen}
        onClose={() => setIsTLRequestModalOpen(false)}
        onSubmitRequest={handleTLRequest}
        tlName={currentUser.name}
      />

      <TaskWorkUpdateModal
        isOpen={Boolean(activeUpdateTask)}
        onClose={() => setActiveUpdateTask(null)}
        task={activeUpdateTask}
        onSubmitUpdate={handleWorkUpdate}
      />

      <TaskApprovalModal
        isOpen={Boolean(activeApprovalTask)}
        onClose={() => setActiveApprovalTask(null)}
        task={activeApprovalTask}
        currentUser={currentUser}
        onApprove={handleApproveTask}
        onReject={handleRejectTask}
      />

      <ProjectClosureModal
        isOpen={Boolean(activeClosureProject)}
        onClose={() => setActiveClosureProject(null)}
        project={activeClosureProject}
        onApproveClosure={handleApproveClosure}
        onRejectClosure={handleRejectClosure}
      />

      <TaskChangeReviewModal
        isOpen={Boolean(activeChangeReviewTask)}
        onClose={() => setActiveChangeReviewTask(null)}
        task={activeChangeReviewTask}
        currentUser={currentUser}
        onApprove={handleApproveTaskChange}
        onReject={handleRejectTaskChange}
      />
    </DashboardLayout>
  )
}

export default Projects
