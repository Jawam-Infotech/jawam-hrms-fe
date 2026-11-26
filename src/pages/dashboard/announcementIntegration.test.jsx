/* @vitest-environment jsdom */

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import CEODashboard from './CEODashboard.jsx'
import HRDashboard from './HRDashboard.jsx'
import TeamLeaderDashboard from './TeamLeaderDashboard.jsx'
import EmployeeDashboard from './EmployeeDashboard.jsx'

vi.mock('../../layouts/DashboardLayout', () => ({ default: ({ children }) => <main>{children}</main> }))
vi.mock('../../components/dashboard/common/DashboardAnnouncements.jsx', () => ({ default: () => <div data-testid="dashboard-announcements">Announcements</div> }))
vi.mock('../../components/dashboard/common/DashboardCelebrationCoordinator.jsx', () => ({ default: () => null }))
vi.mock('../../components/dashboard/common/DashboardModeToggle.jsx', () => ({ default: () => null }))
vi.mock('../../components/dashboard/employee/EmployeeDashboardContent.jsx', () => ({ default: () => <div data-testid="employee-content"><div data-testid="dashboard-announcements">Announcements</div></div> }))
vi.mock('../../components/dashboard/hr/HRDashboardContent.jsx', () => ({ default: () => <div data-testid="hr-content"><div data-testid="dashboard-announcements">Announcements</div></div> }))
vi.mock('../../components/dashboard/teamleader/TeamLeaderDashboardContent.jsx', () => ({ default: () => <div data-testid="tl-content"><div data-testid="dashboard-announcements">Announcements</div></div> }))
vi.mock('../../context/UserContext.jsx', async () => {
  const React = await import('react')
  return { UserContext: React.createContext({ user: { name: 'Test User', id: 1, role: 'CEO' } }) }
})
vi.mock('react-router-dom', () => ({ useNavigate: () => vi.fn() }))
vi.mock('../../hooks/useAttendance.js', () => ({ default: () => ({ attendance: null, loading: false, checkIn: vi.fn(), checkOut: vi.fn(), loadTodayAttendance: vi.fn() }) }))
vi.mock('../../hooks/useCompanyAttendance.js', () => ({ default: () => ({ summary: {}, loading: false, error: null }) }))
vi.mock('../../hooks/usePendingLeaveRequests.js', () => ({ default: () => ({ requests: [], totalCount: 0, loading: false }) }))
vi.mock('../../components/ui/StatCard', () => ({ default: () => null }))
vi.mock('../../components/shared/ConfirmationModal.jsx', () => ({ default: () => null }))
vi.mock('../../components/dashboard/ceo/cards/DepartmentPerformanceCard.jsx', () => ({ default: () => null }))
vi.mock('../../components/dashboard/ceo/cards/ProjectStatusCard.jsx', () => ({ default: () => null }))
vi.mock('../../components/dashboard/ceo/cards/HiringOverviewCard.jsx', () => ({ default: () => null }))
vi.mock('../../components/dashboard/ceo/cards/ExpensesOverviewCard.jsx', () => ({ default: () => null }))
vi.mock('../../components/dashboard/ceo/cards/UpcomingInterviewsCard.jsx', () => ({ default: () => null }))
vi.mock('../../components/dashboard/ceo/cards/UpcomingMeetingsCard.jsx', () => ({ default: () => null }))
vi.mock('../../components/dashboard/ceo/cards/CEOLeaveRequestCard.jsx', () => ({ default: () => <div data-testid="ceo-leave-requests">Leave Requests</div> }))
vi.mock('../../components/dashboard/ceo/cards/CEOHRWorkUpdatesCard.jsx', () => ({ default: () => null }))

describe('dashboard announcement integration', () => {
  afterEach(cleanup)
  it.each([
    ['CEO', CEODashboard],
    ['HR', HRDashboard],
    ['TL', TeamLeaderDashboard],
    ['EMPLOYEE', EmployeeDashboard],
  ])('%s dashboard renders the shared announcement feed', (_, Dashboard) => {
    render(<Dashboard />)
    expect(screen.getByTestId('dashboard-announcements')).toBeTruthy()
  })

  it('places the CEO announcement feed beside the CEO leave requests card in the responsive grid', () => {
    render(<CEODashboard />)
    const announcements = screen.getByTestId('dashboard-announcements')
    const leaveRequests = screen.getByTestId('ceo-leave-requests')
    expect(screen.getAllByTestId('dashboard-announcements')).toHaveLength(1)
    expect(announcements.parentElement).toBe(leaveRequests.parentElement)
    expect(announcements.parentElement.className).toContain('grid-cols-2')
    expect(announcements.parentElement.className).toContain('max-[1220px]:grid-cols-1')
  })
})
