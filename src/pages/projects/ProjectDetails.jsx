import { useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { UserContext } from '../../context/UserContext.jsx'
import StatusBadge from '../../components/ui/StatusBadge.jsx'
import ProjectProgressBar from '../../components/projects/ui/ProjectProgressBar.jsx'
import ProjectTaskTable from '../../components/projects/tables/ProjectTaskTable.jsx'
import ProjectMembersTable from '../../components/projects/tables/ProjectMembersTable.jsx'
import ProjectAuditTimeline from '../../components/projects/ui/ProjectAuditTimeline.jsx'
import AccessRestricted from '../../components/employees/AccessRestricted.jsx'

import ProjectActivationModal from '../../components/projects/modals/ProjectActivationModal.jsx'
import ProjectMemberModal from '../../components/projects/modals/ProjectMemberModal.jsx'
import TaskCreateModal from '../../components/projects/modals/TaskCreateModal.jsx'
import TaskWorkUpdateModal from '../../components/projects/modals/TaskWorkUpdateModal.jsx'
import TaskApprovalModal from '../../components/projects/modals/TaskApprovalModal.jsx'
import TaskChangeRequestModal from '../../components/projects/modals/TaskChangeRequestModal.jsx'
import TaskChangeReviewModal from '../../components/projects/modals/TaskChangeReviewModal.jsx'
import ProjectClosureModal from '../../components/projects/modals/ProjectClosureModal.jsx'
import ReplacePmModal from '../../components/projects/modals/ReplacePmModal.jsx'
import ProjectHoldModal from '../../components/projects/modals/ProjectHoldModal.jsx'
import ProjectCancelModal from '../../components/projects/modals/ProjectCancelModal.jsx'
import TaskReopenModal from '../../components/projects/modals/TaskReopenModal.jsx'
import TaskCancelModal from '../../components/projects/modals/TaskCancelModal.jsx'

// Mock repository seed aligned with v2.0
const PROJECT_DETAILS_STORE = {
  hrms: {
    id: 'hrms',
    title: 'HRMS NextGen Suite',
    description: 'Enterprise HRMS overhaul with modular dashboards, role governance, and attendance.',
    status: 'ACTIVE',
    priority: 'High',
    staffingMode: 'TEAM',
    primaryPm: 'Rajesh Singh',
    teamLead: 'Shivani k',
    startDate: '2026-06-01',
    targetEndDate: '2026-12-30',
    dueDate: '30/12/2026',
    members: [
      { id: 'emp-kp', name: 'Kanishk Prashad', role: 'Software Engineer', projectRole: 'Frontend Developer', activeTasks: 2, projectCount: 1, isIndependent: false },
      { id: 'emp-sk', name: 'Shivani k', role: 'Team Leader', projectRole: 'Team Leader', activeTasks: 1, projectCount: 2, isIndependent: false },
      { id: 'emp-2', name: 'Rajesh Singh', role: 'Project Manager', projectRole: 'Project Manager', activeTasks: 2, projectCount: 2, isPm: true },
      { id: 'emp-4', name: 'Brijesh Bisht', role: 'Backend Engineer', projectRole: 'Backend Engineer', activeTasks: 3, projectCount: 1, isIndependent: false },
    ],
    tasks: [
      { id: 't-1', name: 'Dashboard UI Architecture', assignee: 'Kanishk Prashad', assigneeId: 'emp-kp', progress: 100, status: 'COMPLETED', reworkCount: 0, dueDate: '2026-06-15', description: 'Complete React components for dashboard overview' },
      { id: 't-2', name: 'Attendance Punch Endpoint', assignee: 'Kanishk Prashad', assigneeId: 'emp-kp', progress: 80, status: 'IN_PROGRESS', reworkCount: 0, dueDate: '2026-07-01', description: 'Integrate punch in/out with geolocation checking' },
      { id: 't-3', name: 'Leave Workflow Validation', assignee: 'Kanishk Prashad', assigneeId: 'emp-kp', progress: 100, status: 'PENDING_TL_REVIEW', reworkCount: 1, dueDate: '2026-06-25', description: 'Validate balance calculation and multi-tier approval', deliverable: { type: 'LINK', value: 'https://github.com/Jawam-Infotech/jawam-hrms-fe/pull/15' } },
      { id: 't-4', name: 'Biometric API Gateway', assignee: 'Brijesh Bisht', assigneeId: 'emp-4', progress: 40, status: 'BLOCKED', reworkCount: 0, dueDate: '2026-07-10', description: 'Pending network gateway credentials' },
    ],
    auditEvents: [
      { id: 'a-1', action: 'Project Initialized', actor: 'Gaurav Pandey', description: 'Project created in PLANNED status.', timestamp: '01 Jun 2026, 09:30 AM' },
      { id: 'a-2', action: 'Staffing Gate Validated', actor: 'Gaurav Pandey', description: 'Assigned Rajesh Singh as PM + Shivani k (TL) and Kanishk Prashad. Project transitioned to ACTIVE.', timestamp: '01 Jun 2026, 11:00 AM' },
      { id: 'a-3', action: 'Task Approved (COMPLETED)', actor: 'Rajesh Singh', description: 'Approved Dashboard UI Architecture after verification.', timestamp: '15 Jun 2026, 04:15 PM' },
      { id: 'a-4', action: 'Progress Regression Reported', actor: 'Brijesh Bisht', description: 'Updated Biometric API Gateway progress from 70% to 40%.', decreaseReason: 'Firewall ports on physical biometric reader are blocked by client IT.', timestamp: '18 Jun 2026, 02:00 PM' },
    ],
    pmHistory: [
      { previousPm: null, newPm: 'Rajesh Singh', reason: 'Initial PM designated during project setup', replacedBy: 'Gaurav Pandey', timestamp: '01 Jun 2026, 11:00 AM' },
    ],
  },
}

const STORAGE_KEY = 'jawam_projects_state_v1'

function sanitizeProject(p) {
  if (!p) return p
  const cleanedMembers = (p.members || []).filter(
    (m) => m && m.role !== 'CEO' && m.id !== 'emp-gp' && m.name !== 'Gaurav Pandey',
  )
  return {
    ...p,
    members: cleanedMembers,
    membersCount: cleanedMembers.length,
  }
}

function getSavedProject(projectId) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const list = JSON.parse(raw)
      const found = list.find((p) => p.id === (projectId || 'hrms'))
      if (found) {
        if (!PROJECT_DETAILS_STORE[projectId]) {
          return sanitizeProject({
            id: found.id,
            title: found.title || found.name,
            description: found.description || '',
            status: found.status || 'PLANNED',
            priority: found.priority || 'Medium',
            staffingMode: found.staffingMode || 'TEAM',
            primaryPm: found.primaryPm || (found.staffingMode === 'SOLO' ? 'CEO Oversight' : null),
            teamLead: found.teamLead || null,
            startDate: found.startDate || '',
            targetEndDate: found.targetEndDate || found.dueDate || '',
            dueDate: found.dueDate || found.targetEndDate || '',
            members: found.members || [],
            tasks: found.tasks || [],
            auditEvents: found.auditEvents || [
              {
                id: `audit-${Date.now()}`,
                action: 'Project Initialized',
                actor: found.createdBy || 'CEO',
                description: `Project created in PLANNED status (${found.staffingMode || 'TEAM'}).`,
                timestamp: new Date().toLocaleString(),
              },
            ],
            pmHistory: found.pmHistory || [],
            ...found,
          })
        }
        const defaultSeed = PROJECT_DETAILS_STORE[projectId]
        return sanitizeProject({ ...defaultSeed, ...found })
      }
    }
  } catch (e) {
    console.error(e)
  }
  return sanitizeProject(PROJECT_DETAILS_STORE[projectId] || PROJECT_DETAILS_STORE.hrms)
}

function ProjectDetails() {
  const navigate = useNavigate()
  const { projectId } = useParams()
  const { user } = useContext(UserContext)

  const [project, setProject] = useState(() => getSavedProject(projectId))

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      let list = raw ? JSON.parse(raw) : []
      const idx = list.findIndex((p) => p.id === project.id)
      if (idx >= 0) {
        list[idx] = { ...list[idx], ...project }
      } else {
        list.push(project)
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    } catch (e) {
      console.error(e)
    }
  }, [project])
  const [activeTab, setActiveTab] = useState('TASKS') // 'TASKS', 'MEMBERS', 'AUDIT'

  // Modal triggers
  const [isActivationModalOpen, setIsActivationModalOpen] = useState(false)
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false)
  const [isTaskCreateModalOpen, setIsTaskCreateModalOpen] = useState(false)
  const [isClosureModalOpen, setIsClosureModalOpen] = useState(false)
  const [isReplacePmModalOpen, setIsReplacePmModalOpen] = useState(false)
  const [isHoldModalOpen, setIsHoldModalOpen] = useState(false)
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false)
  const [activeUpdateTask, setActiveUpdateTask] = useState(null)
  const [activeApprovalTask, setActiveApprovalTask] = useState(null)
  const [activeChangeTask, setActiveChangeTask] = useState(null)
  const [activeChangeReviewTask, setActiveChangeReviewTask] = useState(null)
  const [activeReopenTask, setActiveReopenTask] = useState(null)
  const [activeCancelTask, setActiveCancelTask] = useState(null)

  // Current user context
  const currentUser = useMemo(() => user || {
    name: 'Kanishk Bairagi',
    role: 'CEO',
  }, [user])

  const isCEO = currentUser.role === 'CEO'
  const isHR = currentUser.role === 'HR'
  const isPM = !isHR && (project.primaryPm === currentUser.name || isCEO)
  const isSolo = project.staffingMode === 'SOLO' || project.isSoloProject

  // Mathematical progress calculations per approved rule
  const mathStats = useMemo(() => {
    const activeTasks = (project.tasks || []).filter((t) => t.status !== 'CANCELLED')
    const completedTasks = activeTasks.filter((t) => t.status === 'COMPLETED')
    const inProgressTasks = activeTasks.filter((t) => t.status === 'IN_PROGRESS')
    const blockedTasks = activeTasks.filter((t) => t.status === 'BLOCKED')
    const pendingTasks = activeTasks.filter((t) =>
      ['PENDING_TL_REVIEW', 'PENDING_PM_APPROVAL', 'DIRECT_APPROVAL_REQUIRED', 'PENDING_CEO_APPROVAL'].includes(t.status),
    )

    const mathProgress = activeTasks.length > 0
      ? Math.round((completedTasks.length / activeTasks.length) * 100)
      : 0

    return {
      totalActive: activeTasks.length,
      completed: completedTasks.length,
      inProgress: inProgressTasks.length,
      blocked: blockedTasks.length,
      pendingReview: pendingTasks.length,
      progress: mathProgress,
    }
  }, [project.tasks])

  // Lifecycle & Management actions (Workflow B)
  const handleActivateProject = () => {
    setProject((prev) => {
      const isResuming = prev.status === 'ON_HOLD'
      const auditAction = isResuming
        ? 'Project Resumed to ACTIVE (Workflow B)'
        : 'Staffing Gate Validated & Activated'
      const auditDesc = isResuming
        ? 'Rechecked staffing and member guards. Project work resumed to ACTIVE.'
        : 'Project staffing requirements satisfied. Transitioned to ACTIVE.'

      return {
        ...prev,
        status: 'ACTIVE',
        auditEvents: [
          {
            id: `audit-${Date.now()}`,
            action: auditAction,
            actor: currentUser.name,
            description: auditDesc,
            old_status: prev.status,
            new_status: 'ACTIVE',
            timestamp: new Date().toLocaleString(),
          },
          ...prev.auditEvents,
        ],
      }
    })
  }

  const handleHoldProject = (reason) => {
    setProject((prev) => ({
      ...prev,
      status: 'ON_HOLD',
      auditEvents: [
        {
          id: `audit-${Date.now()}`,
          action: 'Project Placed On Hold (Workflow B)',
          actor: currentUser.name,
          description: `Work temporarily paused. Mandatory Reason: "${reason}"`,
          old_status: prev.status,
          new_status: 'ON_HOLD',
          reason,
          timestamp: new Date().toLocaleString(),
        },
        ...prev.auditEvents,
      ],
    }))
  }

  const handleCancelProject = (reason) => {
    setProject((prev) => ({
      ...prev,
      status: 'CANCELLED',
      auditEvents: [
        {
          id: `audit-${Date.now()}`,
          action: 'Project Cancelled (Workflow B)',
          actor: currentUser.name,
          description: `Project cancelled. Mandatory Reason: "${reason}"`,
          old_status: prev.status,
          new_status: 'CANCELLED',
          reason,
          timestamp: new Date().toLocaleString(),
        },
        ...prev.auditEvents,
      ],
    }))
  }

  const handleArchiveProject = () => {
    setProject((prev) => ({
      ...prev,
      status: 'ARCHIVED',
      auditEvents: [
        {
          id: `audit-${Date.now()}`,
          action: 'Project Archived (Workflow B)',
          actor: currentUser.name,
          description: 'Historical read-only record preserved. Normal work transitions disabled.',
          old_status: prev.status,
          new_status: 'ARCHIVED',
          timestamp: new Date().toLocaleString(),
        },
        ...prev.auditEvents,
      ],
    }))
  }

  const handleAddMember = (newMember) => {
    if (project.status !== 'ACTIVE') {
      alert('First Activation is needed! Please activate the project before adding members.')
      return
    }

    const memberToAdd = {
      ...newMember,
      isIndependent: isSolo ? true : Boolean(newMember.isIndependent),
      projectRole: isSolo
        ? 'Independent Contributor'
        : (newMember.isPm ? 'Project Manager' : (newMember.projectRole || newMember.role || 'Team Member')),
      isPm: isSolo ? false : Boolean(newMember.isPm),
    }

    setProject((prev) => ({
      ...prev,
      members: [...(prev.members || []), memberToAdd],
      membersCount: ((prev.members || []).length + 1),
      primaryPm: isSolo ? 'CEO Oversight' : (memberToAdd.isPm ? memberToAdd.name : prev.primaryPm),
      auditEvents: [
        {
          id: `audit-${Date.now()}`,
          action: isSolo ? 'Independent Contributor Added' : 'Member Added',
          actor: currentUser.name,
          description: `Added ${memberToAdd.name} as ${memberToAdd.projectRole} (${memberToAdd.isIndependent ? 'Independent (Direct CEO Oversight)' : 'Team'}).`,
          timestamp: new Date().toLocaleString(),
        },
        ...prev.auditEvents,
      ],
    }))
  }

  const handleRemoveMember = (memberIdentifier) => {
    setProject((prev) => ({
      ...prev,
      members: prev.members.filter((m) => (m.id || m.name) !== memberIdentifier),
      auditEvents: [
        {
          id: `audit-${Date.now()}`,
          action: 'Member Removed',
          actor: currentUser.name,
          description: `Removed member ${memberIdentifier} from project roster.`,
          timestamp: new Date().toLocaleString(),
        },
        ...prev.auditEvents,
      ],
    }))
  }

  const handleReplacePm = ({ candidateId, candidateName, previousPm, reason }) => {
    setProject((prev) => {
      const updatedMembers = (prev.members || []).map((m) => {
        if (m.name === previousPm || m.isPm) {
          return { ...m, isPm: false, projectRole: m.role || 'Team Member' }
        }
        if (m.id === candidateId || m.name === candidateName) {
          return { ...m, isPm: true, projectRole: 'Project Manager' }
        }
        return m
      })

      const newHistoryEntry = {
        previousPm,
        newPm: candidateName,
        reason,
        replacedBy: currentUser.name,
        timestamp: new Date().toLocaleString(),
      }

      const newAudit = {
        id: `audit-${Date.now()}`,
        action: 'Primary PM Replaced (Workflow C)',
        actor: currentUser.name,
        description: `Replaced ${previousPm} with ${candidateName} as Primary PM. Reason: ${reason}`,
        timestamp: new Date().toLocaleString(),
      }

      return {
        ...prev,
        primaryPm: candidateName,
        members: updatedMembers,
        pmHistory: [newHistoryEntry, ...(prev.pmHistory || [])],
        auditEvents: [newAudit, ...prev.auditEvents],
      }
    })
  }

  const handleCreateTask = (newTask) => {
    if (project.status !== 'ACTIVE') {
      alert('First Activation is needed! Please activate the project before assigning tasks.')
      return
    }

    const taskToAdd = {
      ...newTask,
      isIndependent: isSolo ? true : Boolean(newTask.isIndependent),
    }

    setProject((prev) => ({
      ...prev,
      tasks: [...prev.tasks, taskToAdd],
      auditEvents: [
        {
          id: `audit-${Date.now()}`,
          action: 'Task Assigned',
          actor: currentUser.name,
          description: `Created task "${taskToAdd.name}" assigned to ${taskToAdd.assignee}${isSolo ? ' (Direct Executive Approval)' : ''}.`,
          timestamp: new Date().toLocaleString(),
        },
        ...prev.auditEvents,
      ],
    }))
  }

  const handleWorkUpdate = ({
    taskId,
    newProgress,
    note,
    decreaseReason,
    deliverable,
    isCompletion,
    isIndependent: taskIndependent,
    isBlocked,
    blockerCategory,
    blockerReason,
  }) => {
    setProject((prev) => {
      let updatedTaskName = ''
      const updatedTasks = prev.tasks.map((task) => {
        if (task.id !== taskId) return task
        updatedTaskName = task.name

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
              task.assignee === prev.primaryPm ||
              (prev.members || []).find((m) => (m.id === task.assigneeId || m.name === task.assignee))?.isPm
            )

            if (isAssigneePm) {
              // Section 7.5: Zero Self-Approval Rule: PM tasks route directly to CEO
              newStatus = 'PENDING_CEO_APPROVAL'
            } else if (taskIndependent || isSolo || task.isIndependent) {
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
          deliverable: deliverable || task.deliverable,
        }
      })

      let auditAction = isCompletion ? 'Deliverable Submitted for Review (100%)' : 'Work Progress Updated'
      let auditDesc = `Updated "${updatedTaskName}" progress to ${newProgress}%. Note: ${note}`

      if (isBlocked) {
        auditAction = 'Task Blocked Reported (Section 6)'
        auditDesc = `Reported "${updatedTaskName}" as BLOCKED (${blockerCategory}): ${blockerReason}`
      }

      const newAudit = {
        id: `audit-${Date.now()}`,
        action: auditAction,
        actor: currentUser.name,
        description: auditDesc,
        decreaseReason,
        deliverable,
        timestamp: new Date().toLocaleString(),
      }

      return {
        ...prev,
        tasks: updatedTasks,
        auditEvents: [newAudit, ...prev.auditEvents],
      }
    })
  }

  const handleReopenTask = (taskId, reason) => {
    setProject((prev) => {
      let reopenedTaskName = ''
      const updatedTasks = prev.tasks.map((task) => {
        if (task.id !== taskId) return task
        reopenedTaskName = task.name
        return {
          ...task,
          status: 'TODO',
          progress: 0,
          deliverable: null,
          reopenedReason: reason,
        }
      })

      const newAudit = {
        id: `audit-${Date.now()}`,
        action: 'Completed Task Reopened (Section 6)',
        actor: currentUser.name,
        description: `Reopened "${reopenedTaskName}" back to TODO. Reason: "${reason}"`,
        reason,
        old_status: 'COMPLETED',
        new_status: 'TODO',
        timestamp: new Date().toLocaleString(),
      }

      return {
        ...prev,
        tasks: updatedTasks,
        auditEvents: [newAudit, ...prev.auditEvents],
      }
    })
  }

  const handleCancelTask = (taskId, reason) => {
    setProject((prev) => {
      let cancelledTaskName = ''
      let oldStatus = 'TODO'
      const updatedTasks = prev.tasks.map((task) => {
        if (task.id !== taskId) return task
        cancelledTaskName = task.name
        oldStatus = task.status
        return {
          ...task,
          status: 'CANCELLED',
          cancellationReason: reason,
        }
      })

      const newAudit = {
        id: `audit-${Date.now()}`,
        action: 'Task Cancelled (Section 6)',
        actor: currentUser.name,
        description: `Cancelled task "${cancelledTaskName}" (excluded from progress denominator). Reason: "${reason}"`,
        reason,
        old_status: oldStatus,
        new_status: 'CANCELLED',
        timestamp: new Date().toLocaleString(),
      }

      return {
        ...prev,
        tasks: updatedTasks,
        auditEvents: [newAudit, ...prev.auditEvents],
      }
    })
  }

  const handleApproveTask = (taskId) => {
    setProject((prev) => {
      let approvedTaskName = ''
      const updatedTasks = prev.tasks.map((task) => {
        if (task.id !== taskId) return task
        approvedTaskName = task.name

        // If in TL review, passes to PM approval; otherwise (or if PM/CEO approves) becomes COMPLETED
        const isPmOrCeoApprover = isPM || isCEO
        const nextStatus =
          task.status === 'PENDING_TL_REVIEW' && !isPmOrCeoApprover
            ? 'PENDING_PM_APPROVAL'
            : 'COMPLETED'
        return { ...task, status: nextStatus, rejectionFeedback: null }
      })

      const newAudit = {
        id: `audit-${Date.now()}`,
        action: 'Task Deliverable Approved',
        actor: currentUser.name,
        description: `Signed off on deliverable for "${approvedTaskName}".`,
        timestamp: new Date().toLocaleString(),
      }

      return {
        ...prev,
        tasks: updatedTasks,
        auditEvents: [newAudit, ...prev.auditEvents],
      }
    })
  }

  const handleRejectTask = (taskId, rejectionReason) => {
    setProject((prev) => {
      let rejectedTaskName = ''
      const updatedTasks = prev.tasks.map((task) => {
        if (task.id !== taskId) return task
        rejectedTaskName = task.name
        return {
          ...task,
          progress: 85,
          status: 'IN_PROGRESS',
          reworkCount: (task.reworkCount || 0) + 1,
          rejectionFeedback: rejectionReason,
        }
      })

      const newAudit = {
        id: `audit-${Date.now()}`,
        action: 'Task Deliverable Rejected (Rework Requested)',
        actor: currentUser.name,
        description: `Requested rework for "${rejectedTaskName}".`,
        rejectionReason,
        timestamp: new Date().toLocaleString(),
      }

      return {
        ...prev,
        tasks: updatedTasks,
        auditEvents: [newAudit, ...prev.auditEvents],
      }
    })
  }

  const handleTaskChangeRequest = ({
    taskId,
    taskName,
    requestType,
    requestedChange,
    reason,
    requester,
  }) => {
    setProject((prev) => {
      let isDuplicate = false
      const updatedTasks = prev.tasks.map((task) => {
        if (task.id !== taskId) return task
        if (task.changeRequest) {
          isDuplicate = true
          return task
        }

        const initialStatus = (task.isIndependent || isSolo) ? 'DIRECT_APPROVAL_REQUIRED' : 'PENDING_TL_REVIEW'

        return {
          ...task,
          changeRequest: {
            id: `tcr-${Date.now()}`,
            type: requestType,
            requestedChange,
            reason,
            requester: requester || currentUser.name,
            requesterId: currentUser.id,
            status: initialStatus,
            submittedAt: new Date().toLocaleString(),
          },
        }
      })

      if (isDuplicate) return prev

      const newAudit = {
        id: `audit-${Date.now()}`,
        action: `Task-Change Request Submitted (${requestType})`,
        actor: requester || currentUser.name,
        description: `Submitted ${requestType} for "${taskName}": ${reason}`,
        reason,
        timestamp: new Date().toLocaleString(),
      }

      return {
        ...prev,
        tasks: updatedTasks,
        auditEvents: [newAudit, ...prev.auditEvents],
      }
    })
  }

  const handleApproveTaskChange = (taskId, changeRequest) => {
    setProject((prev) => {
      let taskName = ''
      let isIntermediate = false
      const updatedTasks = prev.tasks.map((task) => {
        if (task.id !== taskId) return task
        taskName = task.name

        // Concurrency Protection
        if (!task.changeRequest || task.changeRequest.id !== changeRequest.id) {
          return task
        }

        // Two-stage review for team members: TL recommends -> PM decides
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

        // Atomic Execution of Approved Change
        const updated = {
          ...task,
          changeRequest: null, // marked resolved
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
        ...prev,
        tasks: updatedTasks,
        auditEvents: [newAudit, ...prev.auditEvents],
      }
    })
  }

  const handleRejectTaskChange = (taskId, changeRequest, decisionReason) => {
    setProject((prev) => {
      let taskName = ''
      const updatedTasks = prev.tasks.map((task) => {
        if (task.id !== taskId) return task
        taskName = task.name

        // Concurrency Protection
        if (!task.changeRequest || task.changeRequest.id !== changeRequest.id) {
          return task
        }

        // Rejection: No change applied, mark request resolved
        return {
          ...task,
          changeRequest: null,
        }
      })

      const newAudit = {
        id: `audit-${Date.now()}`,
        action: `Task-Change Request Rejected (${changeRequest.type})`,
        actor: currentUser.name,
        description: `Rejected ${changeRequest.type} for "${taskName}". Mandatory Reason: "${decisionReason}"`,
        reason: decisionReason,
        timestamp: new Date().toLocaleString(),
      }

      return {
        ...prev,
        tasks: updatedTasks,
        auditEvents: [newAudit, ...prev.auditEvents],
      }
    })
  }

  const handleApproveClosure = () => {
    setProject((prev) => ({
      ...prev,
      status: 'COMPLETED',
      auditEvents: [
        {
          id: `audit-${Date.now()}`,
          action: 'Project Closure Approved',
          actor: currentUser.name,
          description: 'CEO officially verified deliverables and closed the project.',
          timestamp: new Date().toLocaleString(),
        },
        ...prev.auditEvents,
      ],
    }))
  }

  const handleReactivateProject = () => {
    setProject((prev) => {
      const isArchived = prev.status === 'ARCHIVED'
      const auditAction = isArchived
        ? 'Project Unarchived & Reactivated to PLANNED'
        : 'Project Reactivated to PLANNED'
      const auditDesc = isArchived
        ? 'CEO unarchived historical project back to PLANNED for continued operations.'
        : 'CEO reactivated completed project back to PLANNED for new phase/fixes.'

      return {
        ...prev,
        status: 'PLANNED',
        auditEvents: [
          {
            id: `audit-${Date.now()}`,
            action: auditAction,
            actor: currentUser.name,
            description: auditDesc,
            old_status: prev.status,
            new_status: 'PLANNED',
            timestamp: new Date().toLocaleString(),
          },
          ...prev.auditEvents,
        ],
      }
    })
  }

  const isMember = useMemo(() => {
    if (['CEO', 'HR', 'TL'].includes(currentUser.role)) return true
    return (project.members || []).some(
      (m) =>
        m.name?.toLowerCase() === currentUser.name?.toLowerCase() ||
        m.id === currentUser.id,
    )
  }, [project.members, currentUser])

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

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-[30px] font-black text-[#111827]">{project.title}</h1>
                <StatusBadge status={project.status} />
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                  isSolo ? 'bg-[#ede9fe] text-[#7c3aed]' : 'bg-[#e0f2fe] text-[#0369a1]'
                }`}>
                  {isSolo
                    ? (project.members || []).length > 1
                      ? 'Independent Squad (CEO Direct)'
                      : 'Solo / Independent'
                    : 'Standard Team'}
                </span>
              </div>
              <p className="mt-1 text-[15px] text-[#5f6679] max-w-2xl">{project.description}</p>
            </div>

            {/* Lifecycle Action Buttons (Workflow B) */}
            <div className="flex flex-wrap items-center gap-3">
              {/* PLANNED: Activate & Cancel */}
              {project.status === 'PLANNED' && (isPM || isCEO || currentUser.role === 'TL') && (
                <>
                  <button
                    type="button"
                    onClick={() => setIsActivationModalOpen(true)}
                    className="rounded-full bg-[#10b981] px-5 py-2 text-[14px] font-bold text-white shadow hover:bg-[#059669]"
                  >
                    🚀 Activate Project
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCancelModalOpen(true)}
                    className="rounded-full border border-[#fca5a5] bg-white px-4 py-2 text-[14px] font-bold text-[#dc2626] hover:bg-[#fef2f2]"
                  >
                    ✕ Cancel Project
                  </button>
                </>
              )}

              {/* ACTIVE: Hold, Closure Request, Cancel */}
              {project.status === 'ACTIVE' && (isPM || isCEO) && (
                <>
                  <button
                    type="button"
                    onClick={() => setIsClosureModalOpen(true)}
                    className="rounded-full bg-[#f59e0b] px-5 py-2 text-[14px] font-bold text-white shadow hover:bg-[#d97706]"
                  >
                    Request Project Closure
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsHoldModalOpen(true)}
                    className="rounded-full border border-[#f59e0b] bg-[#fffbeb] px-4 py-2 text-[14px] font-bold text-[#b45309] hover:bg-[#fef3c7]"
                  >
                    ⏸ Put On Hold
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCancelModalOpen(true)}
                    className="rounded-full border border-[#fca5a5] bg-white px-4 py-2 text-[14px] font-bold text-[#dc2626] hover:bg-[#fef2f2]"
                  >
                    ✕ Cancel Project
                  </button>
                </>
              )}

              {/* ON_HOLD: Resume (Re-checking guards) & Cancel */}
              {project.status === 'ON_HOLD' && isPM && (
                <>
                  <button
                    type="button"
                    onClick={() => setIsActivationModalOpen(true)}
                    className="rounded-full bg-[#10b981] px-5 py-2 text-[14px] font-bold text-white shadow hover:bg-[#059669]"
                  >
                    ▶ Resume Project (Recheck Guards)
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCancelModalOpen(true)}
                    className="rounded-full border border-[#fca5a5] bg-white px-4 py-2 text-[14px] font-bold text-[#dc2626] hover:bg-[#fef2f2]"
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
                  className="rounded-full bg-[#059669] px-5 py-2 text-[14px] font-bold text-white shadow hover:bg-[#047857]"
                >
                  Review Closure Sign-Off
                </button>
              )}

              {/* COMPLETED: Reactivate & Archive */}
              {project.status === 'COMPLETED' && isCEO && (
                <>
                  <button
                    type="button"
                    onClick={handleReactivateProject}
                    className="rounded-full border border-[#7c3aed] bg-[#ede9fe] px-5 py-2 text-[14px] font-bold text-[#7c3aed] hover:bg-[#ddd6fe]"
                  >
                    ↻ Reactivate to PLANNED
                  </button>
                  <button
                    type="button"
                    onClick={handleArchiveProject}
                    className="rounded-full border border-[#cbd5e1] bg-[#f8fafc] px-4 py-2 text-[14px] font-bold text-[#475569] hover:bg-[#f1f5f9]"
                  >
                    📦 Archive Project
                  </button>
                </>
              )}

              {/* CANCELLED: Archive */}
              {project.status === 'CANCELLED' && isCEO && (
                <button
                  type="button"
                  onClick={handleArchiveProject}
                  className="rounded-full border border-[#cbd5e1] bg-[#f8fafc] px-4 py-2 text-[14px] font-bold text-[#475569] hover:bg-[#f1f5f9]"
                >
                  📦 Archive Project
                </button>
              )}

              {/* ARCHIVED: CEO Unarchive & Reactivate Option */}
              {project.status === 'ARCHIVED' && (
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-[#f1f5f9] px-4 py-2 text-xs font-bold text-[#64748b] border border-[#cbd5e1]">
                    📦 Archived Historical Record (Read-Only)
                  </span>
                  {isCEO && (
                    <button
                      type="button"
                      onClick={handleReactivateProject}
                      className="rounded-full border border-[#7c3aed] bg-[#ede9fe] px-5 py-2 text-[14px] font-bold text-[#7c3aed] shadow-sm hover:bg-[#ddd6fe] transition"
                      title="Unarchive project and reactivate to PLANNED status for continued operations"
                    >
                      ↻ Unarchive &amp; Reactivate to PLANNED
                    </button>
                  )}
                </div>
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

          {/* Delivery Health */}
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
                  <span className="font-bold text-[#111827]">{isSolo ? 'Executive Oversight' : (project.primaryPm || 'Unassigned')}</span>
                  {isCEO && !isSolo && !['COMPLETED', 'CANCELLED', 'ARCHIVED'].includes(project.status) && (
                    <button
                      type="button"
                      onClick={() => setIsReplacePmModalOpen(true)}
                      className="rounded-full bg-[#eff6ff] px-2.5 py-0.5 text-[11px] font-bold text-[#2563eb] hover:bg-[#dbeafe]"
                    >
                      ⇄ Replace PM
                    </button>
                  )}
                </span>
              </p>
              <p className="flex justify-between">
                <span className="text-[#6b7280]">Target End Date:</span>
                <span className="font-semibold text-[#111827]">{project.dueDate || project.targetEndDate}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-[#6b7280]">Active Members:</span>
                <span className="font-semibold text-[#111827]">{project.members?.length || 0}</span>
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
                { key: 'MEMBERS', label: `Team Members (${project.members?.length || 0})` },
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

            {/* Contextual Action Button */}
            <div>
              {activeTab === 'TASKS' && (isCEO || isPM || currentUser.role === 'TL') && (
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
                    title="First Activation is needed! Click to activate project before assigning tasks."
                  >
                    🔒 Activate Project to Assign Tasks
                  </button>
                ) : null
              )}

              {activeTab === 'MEMBERS' && (isCEO || isPM || currentUser.role === 'TL') && !['COMPLETED', 'CANCELLED', 'ARCHIVED'].includes(project.status) && (
                project.status === 'ACTIVE' ? (
                  <div className="flex items-center gap-2">
                    {isCEO && !isSolo && (
                      <button
                        type="button"
                        onClick={() => setIsReplacePmModalOpen(true)}
                        className="rounded-full border border-[#2563eb] bg-[#eff6ff] px-4 py-2 text-xs font-bold text-[#2563eb] shadow-sm hover:bg-[#dbeafe]"
                      >
                        ⇄ Replace PM
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsMemberModalOpen(true)}
                      className="rounded-full bg-[#2563eb] px-4 py-2 text-xs font-bold text-white shadow hover:bg-[#1d4ed8]"
                    >
                      {isSolo
                        ? (project.members || []).length === 0
                          ? '+ Assign Solo Contributor'
                          : '+ Add Independent Contributor'
                        : '+ Add Member'}
                    </button>
                  </div>
                ) : project.status === 'PLANNED' ? (
                  <button
                    type="button"
                    onClick={() => setIsActivationModalOpen(true)}
                    className="rounded-full border border-[#fde68a] bg-[#fffbeb] px-4 py-2 text-xs font-bold text-[#b45309] hover:bg-[#fef3c7] transition"
                    title="First Activation is needed! Click to activate project before adding members."
                  >
                    🔒 Activate Project to Add Members
                  </button>
                ) : null
              )}
            </div>
          </div>

          {/* Active Tab View */}
          <div className="mt-6">
            {activeTab === 'TASKS' && (
              <div className="space-y-4">
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
                  tasks={project.tasks || []}
                  currentUser={currentUser}
                  isPM={isPM}
                  onOpenUpdateModal={(t) => setActiveUpdateTask(t)}
                  onOpenApprovalModal={(t) => setActiveApprovalTask(t)}
                  onOpenChangeRequestModal={(t) => setActiveChangeTask(t)}
                  onOpenChangeReviewModal={(t) => setActiveChangeReviewTask(t)}
                  onOpenReopenModal={(t) => setActiveReopenTask(t)}
                  onOpenCancelModal={(t) => setActiveCancelTask(t)}
                />
              </div>
            )}

            {activeTab === 'MEMBERS' && (
              <div className="space-y-6">
                {project.status === 'PLANNED' && (
                  <div className="rounded-2xl border border-[#fed7aa] bg-[#fffbeb] p-4 text-[#9a3412] flex flex-wrap items-center justify-between gap-4 shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🔒</span>
                      <div>
                        <p className="text-sm font-bold text-[#92400e]">First Activation Is Needed</p>
                        <p className="text-xs text-[#b45309]">
                          This project is currently in <strong>PLANNED</strong> status. You cannot add team members until the project has been officially activated.
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
                {isSolo && (
                  <div className="rounded-2xl border border-[#ddd6fe] bg-[#f5f3ff] p-4 text-xs text-[#5b21b6] flex flex-wrap items-center justify-between gap-3 shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">⚡</span>
                      <div>
                        <p className="font-bold text-[#4c1d95]">
                          Direct Executive Governance Active (CEO Oversight)
                        </p>
                        <p className="text-[11px] text-[#6d28d9] mt-0.5">
                          All assigned contributors operate independently with zero PM or TL intermediate stages. Work deliverables and scope changes route directly to the CEO for sign-off.
                        </p>
                      </div>
                    </div>
                    <span className="rounded-full bg-white border border-[#ddd6fe] px-3 py-1 text-[11px] font-bold text-[#6d28d9]">
                      {(project.members || []).length > 1
                        ? `${(project.members || []).length} Independent Contributors`
                        : 'Single Contributor'}
                    </span>
                  </div>
                )}
                <ProjectMembersTable
                  members={project.members || []}
                  tasks={project.tasks || []}
                  onRemoveMember={handleRemoveMember}
                  canManage={(isCEO || isPM || currentUser.role === 'TL') && project.status === 'ACTIVE'}
                  projectStatus={project.status}
                  isSolo={isSolo}
                />

                {/* Permanent PM Leadership Assignment History (Non-Negotiable Rule 2.1) */}
                {project.pmHistory && project.pmHistory.length > 0 && (
                  <div className="rounded-[20px] border border-[#e5e7eb] bg-[#f8fafc] p-5">
                    <div className="flex items-center justify-between pb-3 border-b border-[#e5e7eb]">
                      <h4 className="text-[14px] font-black text-[#111827]">
                        📜 Primary PM Leadership History (Retained Permanently)
                      </h4>
                      <span className="text-[11px] font-bold text-[#6b7280]">
                        Exactly 1 Active PM: <span className="text-[#2563eb]">{project.primaryPm || 'Unassigned'}</span>
                      </span>
                    </div>
                    <div className="mt-3 divide-y divide-[#e5e7eb]/70">
                      {project.pmHistory.map((h, i) => (
                        <div key={i} className="py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div>
                            <span className="font-bold text-[#111827]">{h.newPm}</span>
                            {h.previousPm ? (
                              <span className="text-[#4b5563]"> (succeeded <span className="font-medium">{h.previousPm}</span>)</span>
                            ) : (
                              <span className="text-[#059669] font-medium"> (Initial Assignment)</span>
                            )}
                            {h.reason && (
                              <p className="text-[#6b7280] mt-0.5 italic">Reason: &quot;{h.reason}&quot;</p>
                            )}
                          </div>
                          <div className="text-right text-[#9ca3af]">
                            <p>{h.timestamp}</p>
                            <p className="text-[10px]">Authorized by: {h.replacedBy || 'CEO'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'AUDIT' && (
              <ProjectAuditTimeline events={project.auditEvents || []} />
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ProjectActivationModal
        isOpen={isActivationModalOpen}
        onClose={() => setIsActivationModalOpen(false)}
        project={project}
        onConfirmActivation={handleActivateProject}
      />

      <ProjectMemberModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        onAddMember={handleAddMember}
        existingMemberIds={(project.members || []).map((m) => m.id || m.name)}
        isSolo={isSolo}
        projectStatus={project.status}
      />

      <TaskCreateModal
        isOpen={isTaskCreateModalOpen}
        onClose={() => setIsTaskCreateModalOpen(false)}
        projectMembers={project.members || []}
        onCreateTask={handleCreateTask}
        projectStatus={project.status}
        isSolo={isSolo}
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

      <TaskChangeRequestModal
        isOpen={Boolean(activeChangeTask)}
        onClose={() => setActiveChangeTask(null)}
        task={activeChangeTask}
        currentUser={currentUser}
        projectMembers={project.members || []}
        onSubmitRequest={handleTaskChangeRequest}
      />

      {/* Workflow E: Task-Change Review Modal */}
      <TaskChangeReviewModal
        isOpen={Boolean(activeChangeReviewTask)}
        onClose={() => setActiveChangeReviewTask(null)}
        task={activeChangeReviewTask}
        currentUser={currentUser}
        onApprove={handleApproveTaskChange}
        onReject={handleRejectTaskChange}
      />

      <ProjectClosureModal
        isOpen={isClosureModalOpen}
        onClose={() => setIsClosureModalOpen(false)}
        project={project}
        isCEO={isCEO}
        onRequestClosure={() => {
          setProject((prev) => ({
            ...prev,
            status: 'PENDING_CEO_CLOSURE',
            auditEvents: [
              {
                id: `audit-${Date.now()}`,
                action: 'Project Closure Requested',
                actor: currentUser.name,
                description: 'Project closure requested and submitted to CEO for sign-off',
                timestamp: new Date().toLocaleString(),
              },
              ...prev.auditEvents,
            ],
          }))
        }}
        onApproveClosure={handleApproveClosure}
        onRejectClosure={(projId, reason) => {
          setProject((prev) => ({
            ...prev,
            status: 'ACTIVE',
            auditEvents: [
              {
                id: `audit-${Date.now()}`,
                action: 'Project Closure Rejected',
                actor: currentUser.name,
                description: `Closure rejected and reopened: ${reason}`,
                timestamp: new Date().toLocaleString(),
              },
              ...prev.auditEvents,
            ],
          }))
        }}
      />

      {/* Workflow C: Replace Primary PM Modal (CEO Only) */}
      <ReplacePmModal
        isOpen={isReplacePmModalOpen}
        onClose={() => setIsReplacePmModalOpen(false)}
        currentPmName={project.primaryPm}
        projectMembers={project.members || []}
        onConfirmReplacement={handleReplacePm}
      />

      {/* Workflow B: Hold Project Modal */}
      <ProjectHoldModal
        isOpen={isHoldModalOpen}
        onClose={() => setIsHoldModalOpen(false)}
        projectTitle={project.title}
        onConfirmHold={handleHoldProject}
      />

      {/* Workflow B: Cancel Project Modal */}
      <ProjectCancelModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        projectTitle={project.title}
        onConfirmCancel={handleCancelProject}
      />

      {/* Section 6: Reopen Completed Task Modal (Authorized CEO/PM only) */}
      <TaskReopenModal
        isOpen={Boolean(activeReopenTask)}
        onClose={() => setActiveReopenTask(null)}
        task={activeReopenTask}
        onReopen={handleReopenTask}
      />

      {/* Section 6: Cancel Task Modal (Authorized CEO/PM only) */}
      <TaskCancelModal
        isOpen={Boolean(activeCancelTask)}
        onClose={() => setActiveCancelTask(null)}
        task={activeCancelTask}
        onCancelTask={handleCancelTask}
      />
    </DashboardLayout>
  )
}

export default ProjectDetails
