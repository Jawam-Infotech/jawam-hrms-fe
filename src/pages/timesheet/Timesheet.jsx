import { useState, useMemo, useContext, useEffect, useCallback, useRef } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import DatePicker from '../../components/ui/DatePicker.jsx'
import { UserContext } from '../../context/UserContext.jsx'
import { getEmployees } from '../../services/employeeService.js'
import { ChevronDown, Search, Clock, RefreshCw, Trash2 } from 'lucide-react'

const PROJECTS_STORAGE_KEY = 'jawam_projects_state_v1'
const TIMESHEET_STORAGE_KEY = 'jawam_timesheet_entries_v1'

function formatDateISO(date) {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function addDays(date, days) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function getWeekDates(centerDate) {
  const d = new Date(centerDate)
  const day = d.getDay() // 0 Sun - 6 Sat
  // Start from Monday (1)
  const monday = addDays(d, (day === 0 ? -6 : 1 - day))
  return Array.from({ length: 7 }).map((_, i) => formatDateISO(addDays(monday, i)))
}

function formatHourHeader(hour) {
  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour} ${period}`
}

function formatTimeRange(startHour, duration) {
  const startH = Math.floor(startHour)
  const startM = Math.round((startHour - startH) * 60)
  const endHTotal = startHour + duration
  const endH = Math.floor(endHTotal)
  const endM = Math.round((endHTotal - endH) * 60)

  const endPeriod = endH >= 12 ? 'PM' : 'AM'
  const displayEndH = endH % 12 || 12

  const startPeriod = startH >= 12 ? 'PM' : 'AM'
  const displayStartH = startH % 12 || 12

  const startStr = `${displayStartH}:${String(startM).padStart(2, '0')}`
  const endStr = `${displayEndH}:${String(endM).padStart(2, '0')}`

  if (startPeriod === endPeriod) {
    return `${startStr} - ${endStr} ${endPeriod}`
  }
  return `${startStr} ${startPeriod} - ${endStr} ${endPeriod}`
}

function formatDayLabel(dateStr) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

function getDayHeaderDetails(dateStr) {
  try {
    const date = new Date(`${dateStr}T00:00:00`)
    if (isNaN(date.getTime())) {
      return { dayName: 'MON', dayNum: 19 }
    }
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
    const dayNum = date.getDate()
    return { dayName, dayNum }
  } catch {
    return { dayName: 'MON', dayNum: 19 }
  }
}

// Timeline starts at 10 AM (Office hours 10:00 AM to 7:00 PM)
const TIMELINE_START = 10
const TIMELINE_HOURS = 10 // 10:00 AM to 7:00 PM (10, 11, 12, 13, 14, 15, 16, 17, 18, 19)

// Company-wide employees covering all roles: Employee, TL/PM, HR, CEO
const DEFAULT_COMPANY_EMPLOYEES = [
  { id: 'emp-kp', name: 'Kanishk Prashad', role: 'EMPLOYEE', designation: 'UI/UX Designer', department: 'Design' },
  { id: 'emp-101', name: 'Aman', role: 'EMPLOYEE', designation: 'Frontend Developer', department: 'Engineering' },
  { id: 'emp-102', name: 'Pradeep', role: 'EMPLOYEE', designation: 'Frontend Developer', department: 'Engineering' },
  { id: 'emp-103', name: 'Radhika', role: 'EMPLOYEE', designation: 'Frontend Developer', department: 'Engineering' },
  { id: 'emp-104', name: 'Neha', role: 'EMPLOYEE', designation: 'Frontend Developer', department: 'Engineering' },
  { id: 'emp-105', name: 'Hemant', role: 'EMPLOYEE', designation: 'Frontend Developer', department: 'Engineering' },
  { id: 'emp-pv', name: 'Priya Verma', role: 'EMPLOYEE', designation: 'Full Stack Engineer', department: 'Engineering' },
  { id: 'emp-km', name: 'Karan Mehra', role: 'EMPLOYEE', designation: 'DevOps Specialist', department: 'DevOps' },
  { id: 'emp-sk', name: 'Shivani k', role: 'TL', designation: 'Team Leader', department: 'Engineering' },
  { id: 'emp-rs', name: 'Rajesh Singh', role: 'TL', designation: 'Project Manager', department: 'Management' },
  { id: 'emp-hr1', name: 'Neha Sharma', role: 'HR', designation: 'HR Specialist', department: 'Human Resources' },
  { id: 'emp-hr2', name: 'Pooja Sharma', role: 'HR', designation: 'HR Manager', department: 'Human Resources' },
  { id: 'emp-ceo', name: 'Gaurav Pandey', role: 'CEO', designation: 'Chief Executive Officer', department: 'Executive' },
]

// Fallback initial projects if storage is unpopulated
const getFallbackProjects = () => [
  {
    id: 'website-redesign',
    title: 'Website Redesign',
    status: 'ACTIVE',
    members: [
      { id: 'emp-kp', name: 'Kanishk Prashad' },
      { id: 'emp-101', name: 'Aman' },
    ],
    tasks: [
      { id: 't-wr-1', name: 'Landing page design', assignee: 'Kanishk Prashad' },
      { id: 't-wr-2', name: 'Frontend Hero & Component Layouts', assignee: 'Aman' },
    ],
  },
  {
    id: 'hrms',
    title: 'HRMS NextGen Suite',
    status: 'ACTIVE',
    members: [
      { id: 'emp-kp', name: 'Kanishk Prashad' },
      { id: 'emp-sk', name: 'Shivani k' },
    ],
    tasks: [
      { id: 't-1', name: 'Dashboard UI Architecture', assignee: 'Kanishk Prashad' },
      { id: 't-2', name: 'Attendance Geolocation Punch', assignee: 'Kanishk Prashad' },
      { id: 't-3', name: 'Sprint Planning & Architecture Sync', assignee: 'Shivani k' },
    ],
  },
  {
    id: 'mobile-app',
    title: 'Employee Mobile Self-Service',
    status: 'ACTIVE',
    members: [
      { id: 'emp-kp', name: 'Kanishk Prashad' },
      { id: 'emp-sk', name: 'Shivani k' },
      { id: 'emp-pv', name: 'Priya Verma' },
    ],
    tasks: [
      { id: 't-7', name: 'Push Notifications Hook', assignee: 'Priya Verma' },
      { id: 't-8', name: 'Code Review & PR Approvals', assignee: 'Shivani k' },
    ],
  },
  {
    id: 'design-system',
    title: 'Design System & UI Library',
    status: 'ACTIVE',
    members: [
      { id: 'emp-kp', name: 'Kanishk Prashad' },
      { id: 'emp-101', name: 'Aman' },
    ],
    tasks: [
      { id: 't-ds-1', name: 'Figma Design Tokens', assignee: 'Kanishk Prashad' },
      { id: 't-ds-2', name: 'Tailwind UI Consistency', assignee: 'Aman' },
    ],
  },
]

function loadProjects() {
  try {
    const saved = localStorage.getItem(PROJECTS_STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch (e) {
    console.error('Error loading projects in Timesheet', e)
  }
  return getFallbackProjects()
}

// Loads ONLY user-filled entries from localStorage (strictly no default/dummy entries)
function loadInitialEntries() {
  try {
    const saved = localStorage.getItem(TIMESHEET_STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed)) {
        // Strip out any previous demo, seeded, or placeholder entries
        const userFilledOnly = parsed.filter((e) => {
          if (!e || typeof e !== 'object') return false
          const idStr = String(e.id || '')
          if (idStr.startsWith('demo-') || idStr.startsWith('seed-')) return false
          if (e.id === 1729580400001 || e.id === 1729580400002) return false
          if (e.task === 'Emailed' || e.description === 'Emailed') return false
          if (e.project === 'HR Operations' && (!e.userRole || e.userRole !== 'HR')) return false
          if (e.task === 'Break' || e.project === 'Break') return false
          return true
        })
        try {
          localStorage.setItem(TIMESHEET_STORAGE_KEY, JSON.stringify(userFilledOnly))
        } catch (e) {
          console.error('Failed to sync cleaned timesheet entries', e)
        }
        return userFilledOnly
      }
    }
  } catch (e) {
    console.error('Error loading timesheet entries', e)
  }
  return [] // Nothing by default!
}

export default function Timesheet() {
  const { user } = useContext(UserContext)
  const currentUser = useMemo(() => {
    return (user && user.name) ? user : {
      name: 'Kanishk Prashad',
      role: 'EMPLOYEE',
    }
  }, [user])

  const isCEO = useMemo(() => {
    return String(currentUser?.role || '').trim().toUpperCase() === 'CEO'
  }, [currentUser])

  const isHR = useMemo(() => {
    return String(currentUser?.role || '').trim().toUpperCase() === 'HR'
  }, [currentUser])

  // CEO View Modes: 'inspector' (Image 2) or 'personal' (log personal hours)
  const [ceoMode, setCeoMode] = useState('inspector')

  // Available employees list across company
  const [employeeList, setEmployeeList] = useState(DEFAULT_COMPANY_EMPLOYEES)
  const [selectedEmployee, setSelectedEmployee] = useState(DEFAULT_COMPANY_EMPLOYEES[0])
  const [employeeSearchQuery, setEmployeeSearchQuery] = useState('')
  const [isEmployeeDropdownOpen, setIsEmployeeDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Calendar State
  const [view, setView] = useState('day') // 'day' or 'week'
  const [selectedDate, setSelectedDate] = useState(formatDateISO(new Date()))
  const [entries, setEntries] = useState(loadInitialEntries)
  const [projects, setProjects] = useState(loadProjects)

  // Fetch company employees dynamically from API if available
  useEffect(() => {
    let isMounted = true
    getEmployees()
      .then((res) => {
        if (!isMounted || !res?.employees?.length) return
        const normalized = res.employees.map((e) => ({
          id: e.id || e.user_id,
          name: e.name || `${e.firstName || ''} ${e.lastName || ''}`.trim() || 'Employee',
          role: e.role || 'EMPLOYEE',
          designation: e.designation || e.role || 'Staff',
          department: e.department || 'Operations',
        }))

        setEmployeeList((prev) => {
          const map = new Map()
          prev.forEach((emp) => map.set(emp.name.toLowerCase(), emp))
          normalized.forEach((emp) => map.set(emp.name.toLowerCase(), emp))
          return Array.from(map.values())
        })
      })
      .catch(() => {
        // Fallback pre-seeded
      })
    return () => {
      isMounted = false
    }
  }, [])

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsEmployeeDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Re-sync projects dynamically
  const syncProjectsFromStorage = useCallback(() => {
    setProjects(loadProjects())
  }, [])

  useEffect(() => {
    window.addEventListener('focus', syncProjectsFromStorage)
    window.addEventListener('storage', syncProjectsFromStorage)
    return () => {
      window.removeEventListener('focus', syncProjectsFromStorage)
      window.removeEventListener('storage', syncProjectsFromStorage)
    }
  }, [syncProjectsFromStorage])

  // Sync entries to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(TIMESHEET_STORAGE_KEY, JSON.stringify(entries))
    } catch (e) {
      console.error('Error saving timesheet entries to localStorage', e)
    }
  }, [entries])

  // Filter projects for the logged-in employee
  const userProjects = useMemo(() => {
    const currentUserName = currentUser?.name?.trim().toLowerCase()
    const currentUserId = currentUser?.id

    return projects.filter((p) => {
      if (p.status === 'ARCHIVED' || p.status === 'CANCELLED') return false
      if (isCEO || isHR) return true
      return (p.members || []).some(
        (m) =>
          (m.name && m.name.trim().toLowerCase() === currentUserName) ||
          (m.id && m.id === currentUserId) ||
          (currentUserName && m.name && currentUserName.includes(m.name.trim().toLowerCase())) ||
          (currentUserName && m.name && m.name.trim().toLowerCase().includes(currentUserName)),
      )
    })
  }, [projects, currentUser, isCEO, isHR])

  // Form state for Personal Entry
  const [formDate, setFormDate] = useState(selectedDate)
  const [formProject, setFormProject] = useState('')
  const [formTask, setFormTask] = useState('')
  const [formHours, setFormHours] = useState('')
  const [formMinutes, setFormMinutes] = useState('0')
  const [formDescription, setFormDescription] = useState('')

  // Currently selected project object
  const selectedProjectObj = useMemo(() => {
    return userProjects.find((p) => (p.title || p.name) === formProject)
  }, [userProjects, formProject])

  // Tasks assigned across projects
  const allUserAssignedTasks = useMemo(() => {
    const currentUserName = currentUser?.name?.trim().toLowerCase()
    const currentUserId = currentUser?.id

    const list = []
    userProjects.forEach((proj) => {
      const projName = proj.title || proj.name || 'Project'
      const isSolo = proj.staffingMode === 'SOLO' || proj.isSoloProject
      const tasks = (proj.tasks || []).filter((t) => t.status !== 'CANCELLED')

      tasks.forEach((t) => {
        const matchesName =
          t.assignee &&
          (t.assignee.trim().toLowerCase() === currentUserName ||
            (currentUserName && t.assignee.trim().toLowerCase().includes(currentUserName)) ||
            (currentUserName && currentUserName.includes(t.assignee.trim().toLowerCase())))
        const matchesId = t.assigneeId && t.assigneeId === currentUserId

        if (isCEO || matchesName || matchesId || isSolo) {
          list.push({
            taskName: t.name,
            projectName: projName,
          })
        }
      })
    })
    return list
  }, [userProjects, currentUser, isCEO])

  const availableProjectTasks = useMemo(() => {
    if (!selectedProjectObj) return []
    const currentUserName = currentUser?.name?.trim().toLowerCase()
    const currentUserId = currentUser?.id
    const isSolo = selectedProjectObj.staffingMode === 'SOLO' || selectedProjectObj.isSoloProject

    const allTasksInProject = (selectedProjectObj.tasks || []).filter(
      (t) => t.status !== 'CANCELLED',
    )

    const userAssigned = allTasksInProject.filter((t) => {
      if (isCEO || isSolo) return true
      const matchesName =
        t.assignee &&
        (t.assignee.trim().toLowerCase() === currentUserName ||
          (currentUserName && t.assignee.trim().toLowerCase().includes(currentUserName)) ||
          (currentUserName && currentUserName.includes(t.assignee.trim().toLowerCase())))
      const matchesId = t.assigneeId && t.assigneeId === currentUserId
      return matchesName || matchesId
    })

    const finalTasks = userAssigned.length > 0 ? userAssigned : allTasksInProject
    return finalTasks.map((t) => t.name)
  }, [selectedProjectObj, currentUser, isCEO])

  const weekDates = useMemo(() => getWeekDates(selectedDate), [selectedDate])

  const handleProjectChange = (e) => {
    const newProject = e.target.value
    setFormProject(newProject)
    setFormTask('')
  }

  const handleTaskChange = (e) => {
    const taskName = e.target.value
    setFormTask(taskName)
    if (!formProject && taskName) {
      const match = allUserAssignedTasks.find((t) => t.taskName === taskName)
      if (match && match.projectName) {
        setFormProject(match.projectName)
      }
    }
  }

  const handleReset = () => {
    setFormDate(selectedDate)
    setFormProject('')
    setFormTask('')
    setFormHours('')
    setFormMinutes('0')
    setFormDescription('')
  }

  const handleSave = () => {
    const hourValue = parseInt(formHours, 10) || 0
    const minuteValue = parseInt(formMinutes, 10) || 0
    if (!formDate || (hourValue === 0 && minuteValue === 0)) return

    if (!isHR && !isCEO) {
      if (!formProject) return
      if (!formTask) return
    }

    const duration = hourValue + minuteValue / 60
    const entryProject = formProject || (isHR ? 'Human Resources' : 'General Project')
    const entryTask = formTask || (formDescription.trim() || 'General Task')

    // Calculate start time based on existing entries on that date for this user
    const userEntriesOnDate = entries
      .filter((e) => e.date === formDate && (e.userName === currentUser.name || !e.userName))
      .sort((a, b) => (Number(a.id) || 0) - (Number(b.id) || 0))

    let nextStartHour = TIMELINE_START
    userEntriesOnDate.forEach((e) => {
      const eStart = e.startHour !== undefined && e.startHour !== null && e.startHour >= nextStartHour
        ? e.startHour
        : nextStartHour
      nextStartHour = eStart + (Number(e.duration) || 1)
    })

    const newEntry = {
      id: Date.now(),
      date: formDate,
      userName: currentUser?.name || 'User',
      userRole: currentUser?.role || 'EMPLOYEE',
      userId: currentUser?.id || null,
      project: entryProject,
      task: entryTask,
      duration,
      description: formDescription,
      startHour: nextStartHour,
    }
    setEntries((s) => [...s, newEntry])
    handleReset()
  }

  const handleDeleteEntry = (entryId) => {
    setEntries((s) => s.filter((e) => e.id !== entryId))
  }

  // Target employee whose timesheet is being inspected
  const targetEmployee = isCEO ? selectedEmployee : currentUser

  // Filter entries to only show what has actually been logged for this person
  const filteredEntries = useMemo(() => {
    const empName = targetEmployee?.name?.trim().toLowerCase()
    const empId = targetEmployee?.id
    const isTargetHR = String(targetEmployee?.role || '').toUpperCase() === 'HR'

    return entries.filter((e) => {
      if (!e) return false

      // Prevent any leaked "HR Operations" from showing up for non-HR
      if ((e.project === 'HR Operations' || e.task === 'HR Operations') && !isTargetHR) {
        return false
      }

      // Match by explicit userName
      if (e.userName) {
        const uName = e.userName.trim().toLowerCase()
        if (empName && (uName === empName || uName.includes(empName) || empName.includes(uName))) {
          return true
        }
        return false
      }

      // Match by explicit userId
      if (e.userId && empId) {
        return e.userId === empId
      }

      // If legacy entry without user tag, only show if currentUser matches and user is non-CEO
      if (!isCEO && e.project !== 'HR Operations' && e.task !== 'Emailed') {
        return true
      }
      return false
    })
  }, [entries, targetEmployee, isCEO])

  const scheduleEntries = (dayEntries) => {
    let currentStart = TIMELINE_START
    const sorted = [...dayEntries].sort((a, b) => (Number(a.id) || 0) - (Number(b.id) || 0))
    return sorted.map((entry) => {
      let start = entry.startHour !== undefined && entry.startHour !== null ? entry.startHour : null
      // Shift any previous 8 AM entries to office timing 10 AM
      if (start !== null && start < TIMELINE_START) {
        start = TIMELINE_START
      }
      if (start === null || start < currentStart) {
        start = currentStart
        currentStart += entry.duration || 1
      } else {
        currentStart = Math.max(currentStart, start + (entry.duration || 1))
      }
      return {
        ...entry,
        computedStart: start,
      }
    })
  }

  const entriesForDay = useMemo(() => {
    return filteredEntries.filter((e) => e.date === selectedDate)
  }, [filteredEntries, selectedDate])

  const scheduledDayEntries = useMemo(() => {
    return scheduleEntries(entriesForDay)
  }, [entriesForDay])

  const entriesByDate = useMemo(() => {
    const map = {}
    weekDates.forEach((d) => {
      map[d] = []
    })
    filteredEntries.forEach((e) => {
      if (map[e.date]) map[e.date].push(e)
    })
    Object.keys(map).forEach((date) => {
      map[date] = scheduleEntries(map[date])
    })
    return map
  }, [filteredEntries, weekDates])

  const moveDate = (amount) => {
    if (view === 'week') {
      setSelectedDate(formatDateISO(addDays(new Date(selectedDate), amount * 7)))
    } else {
      setSelectedDate(formatDateISO(addDays(new Date(selectedDate), amount)))
    }
  }

  const goToToday = () => setSelectedDate(formatDateISO(new Date()))

  // Filtered employees for dropdown search
  const filteredEmployeeOptions = useMemo(() => {
    const q = employeeSearchQuery.trim().toLowerCase()
    if (!q) return employeeList
    return employeeList.filter(
      (emp) =>
        emp.name.toLowerCase().includes(q) ||
        emp.role.toLowerCase().includes(q) ||
        (emp.designation && emp.designation.toLowerCase().includes(q)) ||
        (emp.department && emp.department.toLowerCase().includes(q)),
    )
  }, [employeeList, employeeSearchQuery])

  // Grouped options for employee select
  const groupedEmployees = useMemo(() => {
    const groups = {
      EMPLOYEE: [],
      TL: [],
      HR: [],
      CEO: [],
    }
    filteredEmployeeOptions.forEach((emp) => {
      const roleKey = String(emp.role || 'EMPLOYEE').toUpperCase()
      if (groups[roleKey]) {
        groups[roleKey].push(emp)
      } else {
        groups.EMPLOYEE.push(emp)
      }
    })
    return groups
  }, [filteredEmployeeOptions])

  const handleSelectEmployee = (emp) => {
    setSelectedEmployee(emp)
    setIsEmployeeDropdownOpen(false)
    setEmployeeSearchQuery('')
  }

  const { dayName: currentDayName, dayNum: currentDayNum } = getDayHeaderDetails(selectedDate)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[28px] md:text-[32px] font-black text-[#111827] tracking-tight">Timesheet</h1>
            <p className="text-[15px] md:text-[16px] text-[#5f6679] mt-1">
              Log and manage project hours worked during a selected period.
            </p>
          </div>

          {isCEO && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setCeoMode((m) => (m === 'inspector' ? 'personal' : 'inspector'))}
                className="hidden lg:inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                {ceoMode === 'inspector' ? 'Switch to My Timesheet' : 'Employee Timesheets'}
              </button>
            </div>
          )}
        </div>

        {/* ============================================================== */}
        {/* CEO VIEW: Search Employee Card (Image 2 Figma) */}
        {/* ============================================================== */}
        {isCEO && ceoMode === 'inspector' && (
          <div className="rounded-[20px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-[18px] font-bold text-[#111827]">Search Employee</h2>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Employee Name Selector */}
              <div className="relative" ref={dropdownRef}>
                <label className="block text-[13px] font-medium text-[#4b5563] mb-2">
                  Employee Name
                </label>

                {/* Combobox Button */}
                <button
                  type="button"
                  onClick={() => setIsEmployeeDropdownOpen((prev) => !prev)}
                  className="flex h-[46px] w-full items-center justify-between rounded-xl border border-[#d1d5db] bg-white px-4 text-left text-[14px] text-[#111827] shadow-sm outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10 hover:border-slate-400"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-700">
                      {selectedEmployee?.name?.charAt(0) || 'E'}
                    </div>
                    <span className="font-medium text-[#111827] truncate">
                      {selectedEmployee ? selectedEmployee.name : 'Search Employee By name'}
                    </span>
                    {selectedEmployee?.role && (
                      <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        selectedEmployee.role === 'TL'
                          ? 'bg-amber-100 text-amber-800'
                          : selectedEmployee.role === 'HR'
                          ? 'bg-purple-100 text-purple-800'
                          : selectedEmployee.role === 'CEO'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {selectedEmployee.role === 'TL' ? 'TL / PM' : selectedEmployee.role}
                      </span>
                    )}
                  </div>
                  <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${isEmployeeDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu */}
                {isEmployeeDropdownOpen && (
                  <div className="absolute left-0 top-[calc(100%+6px)] z-50 w-full rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
                    {/* Search Input inside Dropdown */}
                    <div className="relative mb-2">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        autoFocus
                        value={employeeSearchQuery}
                        onChange={(e) => setEmployeeSearchQuery(e.target.value)}
                        placeholder="Search by name, role (Employee, TL, HR)..."
                        className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-[#2563eb] focus:bg-white"
                      />
                    </div>

                    <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
                      {/* TL / PM Group */}
                      {groupedEmployees.TL.length > 0 && (
                        <div>
                          <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-amber-700">
                            Team Leaders & Project Managers
                          </div>
                          {groupedEmployees.TL.map((emp) => (
                            <button
                              key={emp.id}
                              type="button"
                              onClick={() => handleSelectEmployee(emp)}
                              className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition ${
                                selectedEmployee?.id === emp.id
                                  ? 'bg-amber-50 text-amber-900 font-semibold'
                                  : 'text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <div>
                                <p className="font-medium text-slate-900">{emp.name}</p>
                                <p className="text-[11px] text-slate-500">{emp.designation || 'Team Leader'}</p>
                              </div>
                              <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
                                TL
                              </span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* HR Group */}
                      {groupedEmployees.HR.length > 0 && (
                        <div>
                          <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-purple-700">
                            Human Resources
                          </div>
                          {groupedEmployees.HR.map((emp) => (
                            <button
                              key={emp.id}
                              type="button"
                              onClick={() => handleSelectEmployee(emp)}
                              className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition ${
                                selectedEmployee?.id === emp.id
                                  ? 'bg-purple-50 text-purple-900 font-semibold'
                                  : 'text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <div>
                                <p className="font-medium text-slate-900">{emp.name}</p>
                                <p className="text-[11px] text-slate-500">{emp.designation || 'HR Specialist'}</p>
                              </div>
                              <span className="rounded bg-purple-100 px-1.5 py-0.5 text-[10px] font-bold text-purple-800">
                                HR
                              </span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Employee Group */}
                      {groupedEmployees.EMPLOYEE.length > 0 && (
                        <div>
                          <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                            Employees
                          </div>
                          {groupedEmployees.EMPLOYEE.map((emp) => (
                            <button
                              key={emp.id}
                              type="button"
                              onClick={() => handleSelectEmployee(emp)}
                              className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition ${
                                selectedEmployee?.id === emp.id
                                  ? 'bg-emerald-50 text-emerald-900 font-semibold'
                                  : 'text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <div>
                                <p className="font-medium text-slate-900">{emp.name}</p>
                                <p className="text-[11px] text-slate-500">{emp.designation || 'Developer'}</p>
                              </div>
                              <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
                                EMPLOYEE
                              </span>
                            </button>
                          ))}
                        </div>
                      )}

                      {/* CEO Group */}
                      {groupedEmployees.CEO.length > 0 && (
                        <div>
                          <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-rose-700">
                            Executive
                          </div>
                          {groupedEmployees.CEO.map((emp) => (
                            <button
                              key={emp.id}
                              type="button"
                              onClick={() => handleSelectEmployee(emp)}
                              className={`flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-left text-xs transition ${
                                selectedEmployee?.id === emp.id
                                  ? 'bg-rose-50 text-rose-900 font-semibold'
                                  : 'text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <div>
                                <p className="font-medium text-slate-900">{emp.name}</p>
                                <p className="text-[11px] text-slate-500">{emp.designation || 'CEO'}</p>
                              </div>
                              <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-800">
                                CEO
                              </span>
                            </button>
                          ))}
                        </div>
                      )}

                      {filteredEmployeeOptions.length === 0 && (
                        <div className="py-6 text-center text-xs text-slate-400">
                          No matching employees found.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Date Selector */}
              <div>
                <label className="block text-[13px] font-medium text-[#4b5563] mb-2">
                  Date
                </label>
                <DatePicker
                  value={selectedDate}
                  onChange={setSelectedDate}
                  placeholder="DD/MM/YYYY"
                  className="h-[46px] w-full rounded-xl border border-[#d1d5db] px-4 text-[14px] text-[#111827] shadow-sm hover:border-slate-400 focus:border-[#2563eb]"
                />
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* NON-CEO (OR CEO PERSONAL MODE): Add Entry Form */}
        {/* ============================================================== */}
        {(!isCEO || ceoMode === 'personal') && (
          <div className="rounded-[18px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[18px] font-bold text-[#111827]">
                {isCEO ? 'Add My Personal Entry' : 'Add Entry'}
              </h2>
              {isCEO && (
                <button
                  type="button"
                  onClick={() => setCeoMode('inspector')}
                  className="text-xs font-semibold text-[#2563eb] hover:underline"
                >
                  ← Back to Employee Inspector
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
              <div>
                <label className="block text-[13px] font-semibold text-[#6b7280] mb-2">Date</label>
                <DatePicker value={formDate} onChange={setFormDate} className="w-full rounded-[10px] border border-[#e5e7eb] px-3 py-2" />
              </div>

              {/* Dynamic Project Dropdown */}
              <div>
                <label className="block text-[13px] font-semibold text-[#6b7280] mb-2">
                  Project {isHR && <span className="text-xs font-normal text-[#9ca3af]">(Optional)</span>}
                </label>
                <select
                  value={formProject}
                  onChange={handleProjectChange}
                  className="w-full rounded-[10px] border border-[#e5e7eb] px-3 py-2 text-[14px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
                >
                  <option value="">{isHR ? 'Select Project (Optional)' : 'Select Project'}</option>
                  {userProjects.map((p) => {
                    const pName = p.title || p.name
                    return (
                      <option key={p.id || pName} value={pName}>
                        {pName}
                      </option>
                    )
                  })}
                </select>
              </div>

              {/* Dynamic Task Dropdown with Break & Assigned Tasks */}
              <div>
                <label className="block text-[13px] font-semibold text-[#6b7280] mb-2">
                  Task {isHR && <span className="text-xs font-normal text-[#9ca3af]">(Optional)</span>}
                </label>
                <select
                  value={formTask}
                  onChange={handleTaskChange}
                  className="w-full rounded-[10px] border border-[#e5e7eb] px-3 py-2 text-[14px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
                >
                  <option value="">{isHR ? 'Select Task (Optional)' : 'Select Task'}</option>

                  {formProject ? (
                    availableProjectTasks.map((taskName, idx) => (
                      <option key={`${taskName}-${idx}`} value={taskName}>
                        {taskName}
                      </option>
                    ))
                  ) : (
                    allUserAssignedTasks.map((item, idx) => (
                      <option key={`${item.projectName}-${item.taskName}-${idx}`} value={item.taskName}>
                        {item.taskName} ({item.projectName})
                      </option>
                    ))
                  )}

                  {isHR && (
                    <optgroup label="HR Activities">
                      <option value="Recruitment & Interviews">Recruitment & Interviews</option>
                      <option value="Employee Onboarding / Offboarding">Employee Onboarding / Offboarding</option>
                      <option value="Payroll & Attendance Admin">Payroll & Attendance Admin</option>
                      <option value="Employee Relations & Grievances">Employee Relations & Grievances</option>
                      <option value="Policy & Compliance">Policy & Compliance</option>
                      <option value="General Administration">General Administration</option>
                    </optgroup>
                  )}
                </select>
              </div>

              <div className="md:col-span-2 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[13px] font-semibold text-[#6b7280] mb-2">Hours</label>
                  <input
                    type="number"
                    min="0"
                    value={formHours}
                    onChange={(e) => setFormHours(e.target.value)}
                    placeholder="0"
                    className="w-full rounded-[10px] border border-[#e5e7eb] px-3 py-2 text-[14px]"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-[#6b7280] mb-2">Minutes</label>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={formMinutes}
                    onChange={(e) => setFormMinutes(e.target.value)}
                    placeholder="0"
                    className="w-full rounded-[10px] border border-[#e5e7eb] px-3 py-2 text-[14px]"
                  />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-[13px] font-semibold text-[#6b7280] mb-2">Description</label>
              <input
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Enter Description"
                className="w-full rounded-[10px] border border-[#e5e7eb] px-3 py-2 text-[14px]"
              />
            </div>

            <div className="mt-4 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="rounded-full bg-[#fee2e2] px-4 py-2 text-[#dc2626] font-semibold hover:bg-[#fecaca] transition"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="rounded-full bg-[#10b981] px-5 py-2 text-white font-semibold hover:bg-[#059669] shadow-sm transition"
              >
                Save Entry
              </button>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* SCHEDULE / TIMELINE CARD (Image 2 Figma) */}
        {/* ============================================================== */}
        <div className="rounded-[24px] border border-[#eef2f7] bg-white p-4 shadow-[0_10px_40px_rgba(15,23,42,0.04)] sm:p-6">
          {/* Centered Day / Week Toggle (Figma Image 2) */}
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="inline-flex items-center rounded-full bg-[#f1f5f9] p-1 border border-slate-200/60 shadow-inner">
              <button
                type="button"
                onClick={() => setView('day')}
                className={`rounded-full px-7 py-1.5 text-sm font-semibold transition ${
                  view === 'day'
                    ? 'bg-white text-[#111827] shadow-sm'
                    : 'text-[#64748b] hover:text-[#111827]'
                }`}
              >
                Day
              </button>
              <button
                type="button"
                onClick={() => setView('week')}
                className={`rounded-full px-7 py-1.5 text-sm font-semibold transition ${
                  view === 'week'
                    ? 'bg-white text-[#111827] shadow-sm'
                    : 'text-[#64748b] hover:text-[#111827]'
                }`}
              >
                Week
              </button>
            </div>

            {/* Sub-label for navigation */}
            <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
              <button
                type="button"
                onClick={() => moveDate(-1)}
                className="rounded-md border border-slate-200 px-2 py-0.5 hover:bg-slate-100"
              >
                ‹ Prev
              </button>
              <span className="font-semibold text-slate-700">
                {view === 'day' ? formatDayLabel(selectedDate) : `Week of ${formatDayLabel(weekDates[0])}`}
              </span>
              <button
                type="button"
                onClick={() => moveDate(1)}
                className="rounded-md border border-slate-200 px-2 py-0.5 hover:bg-slate-100"
              >
                Next ›
              </button>
              <button
                type="button"
                onClick={goToToday}
                className="rounded-md bg-slate-100 px-2 py-0.5 font-medium text-slate-600 hover:bg-slate-200"
              >
                Today
              </button>
            </div>
          </div>

          {/* Schedule Body */}
          <div className="mt-4">
            {view === 'day' ? (
              <DayCalendar
                entries={scheduledDayEntries}
                dayName={currentDayName}
                dayNum={currentDayNum}
                isCEO={isCEO}
                selectedEmployee={selectedEmployee}
                onDeleteEntry={handleDeleteEntry}
              />
            ) : (
              <WeekCalendar
                weekDates={weekDates}
                entriesByDate={entriesByDate}
                selectedDate={selectedDate}
                onDeleteEntry={handleDeleteEntry}
              />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

function computeDayLayoutCards(entries, hourHeight) {
  let lastBottom = 0
  const GAP = 8
  const list = []
  for (let i = 0; i < entries.length; i += 1) {
    const entry = entries[i]
    const isBreak = entry.task === 'Break' || entry.project === 'Break'
    const dur = Number(entry.duration) || 1
    const isShort = dur < 1.0 || isBreak
    const desiredTop = Math.max(0, (entry.computedStart - TIMELINE_START) * hourHeight + 4)
    const naturalHeight = dur * hourHeight - GAP
    const height = isShort ? Math.max(50, naturalHeight) : Math.max(76, naturalHeight)

    const actualTop = Math.max(desiredTop, lastBottom > 0 ? lastBottom + GAP : 4)
    lastBottom = actualTop + height

    list.push({
      ...entry,
      isBreak,
      isShort,
      renderedTop: actualTop,
      renderedHeight: height,
    })
  }
  return list
}

function DayCalendar({
  entries,
  dayName,
  dayNum,
  isCEO,
  selectedEmployee,
  onDeleteEntry,
}) {
  const hourHeight = 76

  const computedCards = useMemo(() => {
    return computeDayLayoutCards(entries, hourHeight)
  }, [entries, hourHeight])

  const totalPixelHeight = useMemo(() => {
    const highestCardBottom = computedCards.length > 0
      ? computedCards[computedCards.length - 1].renderedTop + computedCards[computedCards.length - 1].renderedHeight + 60
      : TIMELINE_HOURS * hourHeight
    return Math.max(TIMELINE_HOURS * hourHeight, highestCardBottom)
  }, [computedCards, hourHeight])

  const rows = useMemo(() => {
    const neededHours = Math.ceil(totalPixelHeight / hourHeight)
    return Array.from({ length: Math.max(TIMELINE_HOURS, neededHours) }, (_, i) => TIMELINE_START + i)
  }, [totalPixelHeight, hourHeight])

  return (
    <div className="overflow-hidden rounded-xl border border-[#e5e7eb] bg-white">
      {/* Header Row matching Figma: MON and red date badge */}
      <div className="grid grid-cols-[88px_minmax(0,1fr)] border-b border-[#e5e7eb] bg-[#fcfcfd]">
        <div className="flex flex-col items-center justify-center py-2.5 border-r border-[#eef2f7]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#94a3b8]">
            {dayName}
          </span>
          <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-[#ef4444] text-[11px] font-bold text-white shadow-sm">
            {dayNum}
          </div>
        </div>
        <div className="flex items-center justify-between px-5 py-2.5 text-xs font-semibold text-[#64748b]">
          <span>Schedule & Logged Tasks</span>
          {isCEO && (
            <span className="text-[11px] font-medium text-slate-400">
              Showing logs for <strong className="text-slate-700">{selectedEmployee?.name}</strong>
            </span>
          )}
        </div>
      </div>

      <div className="relative">
        <div className="grid grid-cols-[88px_minmax(0,1fr)]">
          {/* Time axis column starting at 8 AM GMT+1 as in Figma */}
          <div>
            {rows.map((hour) => (
              <div
                key={hour}
                className="border-r border-t border-[#f1f5f9] px-3 pt-2 text-[11px] font-medium text-[#94a3b8]"
                style={{ height: hourHeight }}
              >
                {formatHourHeader(hour)}
              </div>
            ))}
          </div>

          {/* Grid lines & Task Cards */}
          <div className="relative" style={{ minHeight: `${totalPixelHeight}px` }}>
            {rows.map((hour) => (
              <div
                key={hour}
                className="border-t border-[#f1f5f9]"
                style={{ height: hourHeight }}
              />
            ))}

            <div className="absolute inset-0 p-1">
              {computedCards.map((card) => {
                return (
                  <div
                    key={card.id}
                    style={{
                      top: `${card.renderedTop}px`,
                      height: `${card.renderedHeight}px`,
                      left: '8px',
                      right: '8px',
                    }}
                    className={`absolute overflow-hidden rounded-xl border-2 transition-all shadow-sm hover:shadow-md ${
                      card.isBreak
                        ? 'border-amber-400 bg-amber-50/80'
                        : 'border-[#10b981] bg-white'
                    }`}
                  >
                    {card.isShort ? (
                      <div className="flex h-full items-center justify-between px-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <h4 className="text-[14px] font-bold text-[#111827] truncate">
                            {card.isBreak ? '☕ Break' : (card.project || 'Project')}
                          </h4>
                          {card.task && card.task !== 'Break' && card.task !== card.project && (
                            <span className="text-[12px] font-medium text-[#64748b] truncate max-w-[220px]">
                              · {card.task}
                            </span>
                          )}
                          <span className="text-[11px] font-semibold text-[#10b981] whitespace-nowrap bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                            {formatTimeRange(card.computedStart, card.duration)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            card.isBreak ? 'bg-amber-100 text-amber-800' : 'bg-emerald-50 text-emerald-700'
                          }`}>
                            {Number(card.duration).toFixed(1)} hrs
                          </span>
                          {onDeleteEntry && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation()
                                onDeleteEntry(card.id)
                              }}
                              className="rounded p-1 text-slate-300 hover:bg-red-50 hover:text-red-500 transition"
                              title="Delete entry"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="flex h-full flex-col justify-between p-3.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h4 className="text-[15px] font-bold text-[#111827] truncate leading-tight">
                              {card.project || 'Project'}
                            </h4>
                            <p className="text-[12px] font-normal text-[#64748b] truncate mt-0.5">
                              {card.task || card.description || 'Task details'}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                              {Number(card.duration).toFixed(1)} hrs
                            </span>
                            {onDeleteEntry && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onDeleteEntry(card.id)
                                }}
                                className="rounded p-1 text-slate-300 hover:bg-red-50 hover:text-red-500 transition"
                                title="Delete entry"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                        <p className="text-[11px] font-semibold text-[#10b981] mt-1">
                          {formatTimeRange(card.computedStart, card.duration)}
                        </p>
                      </div>
                    )}
                  </div>
                )
              })}

              {computedCards.length === 0 && (
                <div className="flex h-full min-h-[300px] flex-col items-center justify-center text-center p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400 mb-3">
                    <Clock className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-semibold text-[#111827]">
                    No timesheet entries recorded for this day
                  </p>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm">
                    {isCEO
                      ? `No timesheet logged for ${selectedEmployee?.name || 'this employee'} on this date.`
                      : 'You haven’t logged any timesheet entries for this date.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function computeWeekDaysLayout(weekDates, entriesByDate, hourHeight) {
  const result = {}
  let maxDayBottom = hourHeight * 8

  for (let w = 0; w < weekDates.length; w += 1) {
    const d = weekDates[w]
    const dayEntries = entriesByDate[d] || []
    let lastBottom = 0
    const GAP = 6
    const cards = []

    for (let i = 0; i < dayEntries.length; i += 1) {
      const entry = dayEntries[i]
      const isBreak = entry.task === 'Break' || entry.project === 'Break'
      const dur = Number(entry.duration) || 1
      const isShort = dur < 1.0 || isBreak
      const desiredTop = Math.max(0, (entry.computedStart - TIMELINE_START) * hourHeight + 4)
      const naturalHeight = dur * hourHeight - GAP
      // Minimum heights ensure text (including Break Time and hours) is completely visible without clipping
      const height = isShort ? Math.max(52, naturalHeight) : Math.max(72, naturalHeight)

      const actualTop = Math.max(desiredTop, lastBottom > 0 ? lastBottom + GAP : 4)
      lastBottom = actualTop + height

      cards.push({
        ...entry,
        isBreak,
        isShort,
        renderedTop: actualTop,
        renderedHeight: height,
      })
    }

    result[d] = cards
    if (lastBottom > maxDayBottom) {
      maxDayBottom = lastBottom
    }
  }

  return { entriesMap: result, containerHeight: maxDayBottom + 60 }
}

function WeekCalendar({
  weekDates,
  entriesByDate,
  selectedDate,
  onDeleteEntry,
}) {
  const weekDayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const hourHeight = 52

  const computedDays = useMemo(() => {
    return computeWeekDaysLayout(weekDates, entriesByDate, hourHeight)
  }, [weekDates, entriesByDate, hourHeight])

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[960px] overflow-hidden rounded-xl border border-[#e5e7eb] bg-white">
        {/* Header Days */}
        <div className="grid grid-cols-7 border-b border-[#e5e7eb]">
          {weekDates.map((d, i) => {
            const isSelected = d === selectedDate
            const dateObj = new Date(`${d}T00:00:00`)
            const dayNum = dateObj.getDate()

            return (
              <div
                key={d}
                className={`border-l border-[#e5e7eb] px-3 py-2.5 first:border-l-0 text-center ${
                  isSelected ? 'bg-emerald-50/50' : 'bg-[#fcfcfd]'
                }`}
              >
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#94a3b8]">
                  {weekDayLabels[i]}
                </p>
                <div className="flex justify-center mt-1">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                      isSelected
                        ? 'bg-[#ef4444] text-white shadow-sm'
                        : 'text-[#111827]'
                    }`}
                  >
                    {dayNum}
                  </span>
                </div>
              </div>
            )
          })}
        </div>

        {/* Week Days Schedule Content */}
        <div className="grid grid-cols-7 relative" style={{ minHeight: `${computedDays.containerHeight}px` }}>
          {weekDates.map((d) => {
            const dayEntries = computedDays.entriesMap[d] || []
            const isSelected = d === selectedDate

            return (
              <div
                key={d}
                className={`relative border-l border-[#e5e7eb] p-1.5 first:border-l-0 ${
                  isSelected ? 'bg-emerald-50/20' : ''
                }`}
              >
                {dayEntries.map((card) => {
                  return (
                    <div
                      key={card.id}
                      style={{
                        top: `${card.renderedTop}px`,
                        height: `${card.renderedHeight}px`,
                        left: '4px',
                        right: '4px',
                      }}
                      className={`absolute overflow-hidden rounded-lg border-2 text-[11px] transition shadow-xs ${
                        card.isBreak
                          ? 'border-amber-400 bg-amber-50 text-amber-900'
                          : 'border-[#10b981] bg-white text-slate-800'
                      }`}
                    >
                      {card.isBreak ? (
                        <div className="flex h-full flex-col justify-between p-1.5">
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-amber-950 text-[11px] truncate flex items-center gap-1">
                              ☕ Break
                            </span>
                            {onDeleteEntry && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onDeleteEntry(card.id)
                                }}
                                className="text-amber-400 hover:text-red-500 transition shrink-0 p-0.5"
                                title="Delete entry"
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>
                            )}
                          </div>
                          <div className="flex items-center justify-between text-[9px] font-semibold text-amber-900 mt-1">
                            <span>{formatTimeRange(card.computedStart, card.duration)}</span>
                            <span className="rounded bg-amber-200/80 px-1 py-0.2 text-[8px] font-bold">
                              {Number(card.duration).toFixed(1)}h
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex h-full flex-col justify-between p-1.5">
                          <div>
                            <div className="flex items-start justify-between gap-1">
                              <p className="font-bold text-slate-900 text-[11px] leading-tight truncate" title={card.project}>
                                {card.project}
                              </p>
                              {onDeleteEntry && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    onDeleteEntry(card.id)
                                  }}
                                  className="text-slate-300 hover:text-red-500 transition shrink-0 p-0.5"
                                  title="Delete entry"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              )}
                            </div>
                            {card.task && card.task !== card.project && (
                              <p className="text-[9px] text-slate-500 leading-tight mt-0.5 truncate" title={card.task}>
                                {card.task}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center justify-between text-[9px] font-semibold text-[#10b981] mt-1 pt-0.5 border-t border-emerald-50">
                            <span>{formatTimeRange(card.computedStart, card.duration)}</span>
                            <span className="text-[8px] font-bold text-emerald-700">
                              {Number(card.duration).toFixed(1)}h
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}

                {dayEntries.length === 0 && (
                  <div className="h-full min-h-[160px] flex items-center justify-center text-[10px] text-slate-300">
                    No logs
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
