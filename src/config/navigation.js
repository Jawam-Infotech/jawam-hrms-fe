// Keyed by the app's internal role vocabulary (see services/authService.js's
// ROLE_MAP), not the backend's raw CEO/HR/TL/EMPLOYEE strings — that's what
// ProtectedRoute, DashboardLayout, and roleToDashboard maps already use
// throughout the app, so this stays consistent with the rest of the codebase.
//
// Only includes items with a matching route in routes/AppRoutes.jsx. Add the
// route first, then add the nav entry here.
export const NAV_CONFIG = {
  employee: [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/dashboard' },
    { id: 'employees', label: 'Employees', icon: '👥', path: '/employees' },
    { id: 'attendance', label: 'Attendance', icon: '⏰', path: '/attendance' },
    { id: 'timesheet', label: 'Timesheet', icon: '📋', path: '/timesheet' },
    { id: 'workupdate', label: 'Work Update', icon: '📝', path: '/workupdate' },
    { id: 'leave', label: 'Leave', icon: '🏖️', path: '/leave' },
    { id: 'projects', label: 'Projects', icon: '📁', path: '/projects' },
    { id: 'learning', label: 'Learning and Training', icon: '🎓', path: '/learning' },
    { id: 'performance', label: 'Performance', icon: '⭐', path: '/performance' },
    { id: 'payroll', label: 'Payroll', icon: '💰', path: '/payroll' },
    { id: 'assets', label: 'Assets', icon: '🔧', path: '/assets' },
  ],
  manager: [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/dashboard/team-leader' },
    { id: 'employees', label: 'Employees', icon: '👥', path: '/employees' },
    { id: 'attendance', label: 'Attendance', icon: '⏰', path: '/attendance' },
    { id: 'timesheet', label: 'Timesheet', icon: '📋', path: '/timesheet' },
    { id: 'workupdate', label: 'Work Update', icon: '📝', path: '/workupdate' },
    { id: 'leave', label: 'Leave', icon: '🏖️', path: '/leave' },
    { id: 'projects', label: 'Projects', icon: '📁', path: '/projects' },
    { id: 'learning', label: 'Learning and Training', icon: '🎓', path: '/learning' },
    { id: 'performance', label: 'Performance', icon: '⭐', path: '/performance' },
    { id: 'payroll', label: 'Payroll', icon: '💰', path: '/payroll' },
    { id: 'assets', label: 'Assets', icon: '🖥️', path: '/assets' },
  ],
  hr: [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/dashboard/hr' },
    { id: 'employees', label: 'Employees', icon: '👥', path: '/employees' },
    { id: 'leave', label: 'Leave', icon: '🏖️', path: '/leave' },
    { id: 'payroll', label: 'Payroll', icon: '💰', path: '/payroll' },
    { id: 'performance', label: 'Performance', icon: '⭐', path: '/performance' },
  ],
  admin: [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/dashboard/ceo' },
    { id: 'employees', label: 'Employees', icon: '👥', path: '/employees' },
    { id: 'attendance', label: 'Attendance', icon: '⏰', path: '/attendance' },
    { id: 'timesheet', label: 'Timesheet', icon: '📋', path: '/timesheet' },
    { id: 'workupdate', label: 'Work Update', icon: '📝', path: '/workupdate' },
    { id: 'leave', label: 'Leave', icon: '🏖️', path: '/leave' },
    { id: 'projects', label: 'Projects', icon: '📁', path: '/projects' },
    { id: 'learning', label: 'Learning and Training', icon: '🎓', path: '/learning' },
    { id: 'performance', label: 'Performance', icon: '⭐', path: '/performance' },
    { id: 'payroll', label: 'Payroll', icon: '💰', path: '/payroll' },
    { id: 'assets', label: 'Assets', icon: '🔧', path: '/assets' },
  ],
}
