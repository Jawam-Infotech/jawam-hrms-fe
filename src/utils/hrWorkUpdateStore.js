// Shared store for HR tasks and daily work update submissions
// Connects HR (Rohit Bhatt) directly with CEO (Gaurav Pandey)

export const HR_TASKS_KEY = 'jawam_hr_tasks_v1'
export const HR_UPDATES_KEY = 'jawam_hr_work_updates_v1'
export const CUSTOM_NOTIFICATIONS_KEY = 'jawam_custom_notifications_v1'

export const DEFAULT_HR_TASKS = [
  {
    id: 'hr-task-1',
    name: 'Employee Onboarding & Document Verification',
    department: 'HR Operations',
    assignedBy: 'CEO Gaurav Pandey',
    assignedDate: '2026-10-15',
    priority: 'High',
    progress: 80,
    status: 'In Progress',
    updated: false,
    lastUpdated: '2026-10-22T08:30:00.000Z',
  },
  {
    id: 'hr-task-2',
    name: 'Monthly Attendance & Leave Audit',
    department: 'HR Operations',
    assignedBy: 'CEO Gaurav Pandey',
    assignedDate: '2026-10-18',
    priority: 'Medium',
    progress: 60,
    status: 'In Progress',
    updated: false,
    lastUpdated: '2026-10-21T11:00:00.000Z',
  },
  {
    id: 'hr-task-3',
    name: 'HR Policy Handbook Review & Compliance',
    department: 'HR Governance',
    assignedBy: 'CEO Gaurav Pandey',
    assignedDate: '2026-10-10',
    priority: 'Medium',
    progress: 100,
    status: 'Completed',
    updated: true,
    lastUpdated: '2026-10-20T16:00:00.000Z',
  },
  {
    id: 'hr-task-4',
    name: 'Q3 Talent Acquisition & Senior Sourcing',
    department: 'Recruitment',
    assignedBy: 'CEO Gaurav Pandey',
    assignedDate: '2026-10-20',
    priority: 'High',
    progress: 40,
    status: 'Blocked',
    updated: false,
    lastUpdated: '2026-10-22T09:15:00.000Z',
  },
]

export const DEFAULT_HR_UPDATES = [
  {
    id: 'update-seed-1',
    taskId: 'hr-task-4',
    taskName: 'Q3 Talent Acquisition & Senior Sourcing',
    department: 'Recruitment',
    submittedBy: 'Rohit Bhatt (HR)',
    submittedAt: '2026-10-22T09:15:00.000Z',
    progress: 40,
    status: 'Blocked',
    todayContribution: 'Screened 14 senior resumes, scheduled 3 technical rounds with PM.',
    todayWork: 'Processed engineering pipeline candidates and prepared preliminary offer summaries.',
    blockers: 'Awaiting CEO salary budget sign-off for Lead Frontend Engineer position.',
    tomorrowPlan: 'Follow up on pending compensation approvals and initiate background checks.',
  },
  {
    id: 'update-seed-2',
    taskId: 'hr-task-1',
    taskName: 'Employee Onboarding & Document Verification',
    department: 'HR Operations',
    submittedBy: 'Rohit Bhatt (HR)',
    submittedAt: '2026-10-22T08:30:00.000Z',
    progress: 80,
    status: 'In Progress',
    todayContribution: 'Collected tax declarations and signed NDAs from 5 new hires.',
    todayWork: 'Verified background credentials and provisioned HR portal credentials.',
    blockers: '',
    tomorrowPlan: 'Conduct day-2 orientation and assign mentors for engineering cohort.',
  },
]

export function getHRTasks() {
  try {
    const raw = localStorage.getItem(HR_TASKS_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (e) {
    console.error('Error reading HR tasks from localStorage', e)
  }
  // Initialize default if empty
  try {
    localStorage.setItem(HR_TASKS_KEY, JSON.stringify(DEFAULT_HR_TASKS))
  } catch (e) {
    console.error(e)
  }
  return DEFAULT_HR_TASKS
}

export function saveHRTasks(tasks) {
  try {
    localStorage.setItem(HR_TASKS_KEY, JSON.stringify(tasks))
  } catch (e) {
    console.error('Error saving HR tasks to localStorage', e)
  }
}

export function addHRTask(taskData) {
  const current = getHRTasks()
  const newTask = {
    id: `hr-task-${Date.now()}`,
    assignedDate: new Date().toISOString().split('T')[0],
    assignedBy: 'CEO Gaurav Pandey',
    priority: 'Medium',
    progress: 0,
    status: 'In Progress',
    updated: false,
    lastUpdated: null,
    ...taskData,
  }
  const updated = [newTask, ...current]
  saveHRTasks(updated)

  // Notify HR
  try {
    const existingNotifs = JSON.parse(localStorage.getItem(CUSTOM_NOTIFICATIONS_KEY) || '[]')
    const notif = {
      id: `notif-${Date.now()}`,
      title: '📋 New Directive from CEO',
      message: `CEO Gaurav Pandey assigned you a new initiative: "${newTask.name}" (${newTask.department}).`,
      created_at: new Date().toISOString(),
      is_read: false,
      targetRole: 'HR',
    }
    localStorage.setItem(CUSTOM_NOTIFICATIONS_KEY, JSON.stringify([notif, ...existingNotifs]))
  } catch (e) {
    console.error('Error dispatching HR notification', e)
  }

  return newTask
}

export function getHRUpdates() {
  try {
    const raw = localStorage.getItem(HR_UPDATES_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (e) {
    console.error('Error reading HR updates from localStorage', e)
  }
  // Initialize default seed
  try {
    localStorage.setItem(HR_UPDATES_KEY, JSON.stringify(DEFAULT_HR_UPDATES))
  } catch (e) {
    console.error(e)
  }
  return DEFAULT_HR_UPDATES
}

export function recordHRUpdate(updateData) {
  const current = getHRUpdates()
  const newEntry = {
    id: `update-${Date.now()}`,
    submittedBy: 'Rohit Bhatt (HR)',
    submittedAt: new Date().toISOString(),
    ...updateData,
  }
  const updatedList = [newEntry, ...current]
  try {
    localStorage.setItem(HR_UPDATES_KEY, JSON.stringify(updatedList))
  } catch (e) {
    console.error('Error saving HR update', e)
  }

  // Update corresponding task progress & status
  if (updateData.taskId) {
    const allTasks = getHRTasks()
    const taskIndex = allTasks.findIndex((t) => t.id === updateData.taskId)
    if (taskIndex >= 0) {
      allTasks[taskIndex] = {
        ...allTasks[taskIndex],
        progress: updateData.progress ?? allTasks[taskIndex].progress,
        status: updateData.status || allTasks[taskIndex].status,
        updated: true,
        lastUpdated: newEntry.submittedAt,
      }
      saveHRTasks(allTasks)
    }
  }

  // Dispatch notification for CEO
  try {
    const existingNotifs = JSON.parse(localStorage.getItem(CUSTOM_NOTIFICATIONS_KEY) || '[]')
    const isBlocked = updateData.status === 'Blocked'
    const notif = {
      id: `notif-${Date.now()}`,
      title: isBlocked ? '⚠️ HR Blocker Alert' : '📝 HR Daily Work Update',
      message: isBlocked
        ? `HR Rohit Bhatt flagged a blocker on "${updateData.taskName}": ${updateData.blockers || 'Executive attention required'}`
        : `HR Rohit Bhatt submitted an update on "${updateData.taskName}" (${updateData.progress}% - ${updateData.status}).`,
      created_at: new Date().toISOString(),
      is_read: false,
      targetRole: 'CEO',
    }
    localStorage.setItem(CUSTOM_NOTIFICATIONS_KEY, JSON.stringify([notif, ...existingNotifs]))
  } catch (e) {
    console.error('Error notifying CEO of HR update', e)
  }

  return newEntry
}
