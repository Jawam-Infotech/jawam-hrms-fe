import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../context/UserContext.jsx'
import DashboardLayout from '../../layouts/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import useAttendance from '../../hooks/useAttendance.js'
import useCompanyAttendance from '../../hooks/useCompanyAttendance.js'
import ConfirmationModal from '../../components/shared/ConfirmationModal.jsx'
import usePendingLeaveRequests from '../../hooks/usePendingLeaveRequests.js'

import DepartmentPerformanceCard from '../../components/dashboard/ceo/cards/DepartmentPerformanceCard.jsx'
import ProjectStatusCard from '../../components/dashboard/ceo/cards/ProjectStatusCard.jsx'
import HiringOverviewCard from '../../components/dashboard/ceo/cards/HiringOverviewCard.jsx'
import ExpensesOverviewCard from '../../components/dashboard/ceo/cards/ExpensesOverviewCard.jsx'
import UpcomingInterviewsCard from '../../components/dashboard/ceo/cards/UpcomingInterviewsCard.jsx'
import UpcomingMeetingsCard from '../../components/dashboard/ceo/cards/UpcomingMeetingsCard.jsx'
import CEOLeaveRequestCard from '../../components/dashboard/ceo/cards/CEOLeaveRequestCard.jsx'
import CEOHRWorkUpdatesCard from '../../components/dashboard/ceo/cards/CEOHRWorkUpdatesCard.jsx'

function CEODashboard() {
  const { user } = useContext(UserContext)
  const navigate = useNavigate()
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  const [actionError, setActionError] = useState(null)

  const {
    summary: companyAttendanceSummary,
    loading: companyAttendanceLoading,
    error: companyAttendanceError,
  } = useCompanyAttendance()

  const {
    attendance,
    loading: attendanceLoading,
    checkIn,
    checkOut,
    loadTodayAttendance,
  } = useAttendance()

  const {
    requests: pendingLeaveRequests,
    totalCount: pendingLeaveCount,
    loading: pendingLeaveLoading,
  } = usePendingLeaveRequests()

  const totalEmployees = Number(companyAttendanceSummary.totalEmployees) || 0
  const presentToday = Number(companyAttendanceSummary.presentToday) || 0
  const absentToday = Number(companyAttendanceSummary.absent) || 0
  const lateToday = Number(companyAttendanceSummary.late) || 0
  const workforceAttendancePercentage = totalEmployees > 0
    ? Math.round((presentToday / totalEmployees) * 100)
    : 0
  const workforceAttendanceUnavailable = Boolean(companyAttendanceError)

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const handleCheckIn = async () => {
    try {
      setActionError(null)
      await checkIn()
      await loadTodayAttendance()
    } catch (error) {
      setActionError(error.response?.data?.detail || 'Failed to check in.')
    }
  }

  const handleCheckOut = async () => {
    try {
      setActionError(null)
      await checkOut()
      await loadTodayAttendance()
      setShowCheckoutModal(false)
    } catch (error) {
      setActionError(error.response?.data?.detail || 'Failed to check out.')
    }
  }

  const todayStatus = attendance?.todayStatus || 'NOT_CHECKED_IN'
  const isCheckedIn = ['PRESENT', 'LATE', 'HALF_DAY'].includes(todayStatus)
  const hasCheckedOut = Boolean(
    attendance?.checkOut && attendance.checkOut !== '-'
  )

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Error Banner */}
        {actionError && (
          <div className="flex items-center justify-between rounded-[12px] border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-[#b91c1c]">
            <p className="text-[14px] font-medium">{actionError}</p>
            <button
              type="button"
              onClick={() => setActionError(null)}
              className="text-[14px] font-bold text-[#b91c1c] hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[36px] font-black text-[#111827] mb-2">
              {getGreeting()}, {user?.name || 'CEO'}
            </h1>
            <p className="text-[16px] text-[#5f6679]">Welcome back to Jawam HR</p>
            <p className="text-[14px] text-[#5f6679] mt-1">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={
                isCheckedIn && !hasCheckedOut
                  ? () => setShowCheckoutModal(true)
                  : handleCheckIn
              }
              disabled={hasCheckedOut || attendanceLoading}
              className={`px-6 py-2 rounded-full font-extrabold text-[14px] transition-all ${
                hasCheckedOut
                  ? 'bg-[#e5e7eb] text-[#9ca3af] cursor-not-allowed'
                  : 'bg-[#3b82f6] text-white hover:bg-[#2563eb]'
              }`}
            >
              {hasCheckedOut
                ? 'Checked Out'
                : isCheckedIn
                  ? 'Check Out'
                  : 'Check In'}
            </button>

            <button
              type="button"
              onClick={() => navigate('/invoice')}
              className="px-6 py-2 rounded-full bg-white border-2 border-[#111827] text-[#111827] font-extrabold text-[14px] hover:bg-[#f9fafb] transition-all"
            >
              Create Invoice
            </button>
            <button
              type="button"
              onClick={() => navigate('/helpdesk')}
              className="px-6 py-2 rounded-full bg-white border-2 border-[#111827] text-[#111827] font-extrabold text-[14px] hover:bg-[#f9fafb] transition-all"
            >
              Open Issues
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-6 max-[1220px]:grid-cols-2 max-[760px]:grid-cols-1">
          <StatCard
            icon="⏱️"
            iconBg="#d1fae5"
            label="Workforce Attendance"
            value={
              companyAttendanceLoading
                ? '...'
                : workforceAttendanceUnavailable
                  ? '—'
                  : `${workforceAttendancePercentage}%`
            }
            valueColor="#10b981"
            rows={[
              {
                label: 'Present',
                value:
                  companyAttendanceLoading || workforceAttendanceUnavailable
                    ? '—'
                    : String(presentToday),
              },
              {
                label: 'Absent',
                value:
                  companyAttendanceLoading || workforceAttendanceUnavailable
                    ? '—'
                    : String(absentToday),
              },
              {
                label: 'Late',
                value:
                  companyAttendanceLoading || workforceAttendanceUnavailable
                    ? '—'
                    : String(lateToday),
              },
            ]}
          />
          <StatCard
            icon="📅"
            iconBg="#fef3c7"
            label="Meetings & Scheduled"
            value="15"
            valueColor="#f59e0b"
            rows={[
              { label: 'Meetings', value: '10' },
              { label: 'Interviews', value: '5' },
            ]}
          />
          <StatCard
            icon="👥"
            iconBg="#dbeafe"
            label="Active Client"
            value="5"
            valueColor="#3b82f6"
            rows={[
              { label: 'Proposal', value: '~' },
              { label: 'Interviews', value: '~' },
            ]}
          />
          <StatCard
            icon="💰"
            iconBg="#fee2e2"
            label="Payroll Cost"
            value="4%"
            valueColor="#ef4444"
            rows={[
              { label: 'This month', value: '~' },
              { label: 'Paycheck', value: '1' },
            ]}
          />
        </div>

        {/* Department Performance & Project Status */}
        <div className="grid grid-cols-2 gap-6 max-[1220px]:grid-cols-1">
          <DepartmentPerformanceCard
            onFooterClick={() => navigate('/performance')}
          />
          <ProjectStatusCard
            onFooterClick={() => navigate('/projects')}
          />
        </div>

        {/* Hiring Overview & Expenses Overview */}
        <div className="grid grid-cols-2 gap-6 max-[1220px]:grid-cols-1">
          <HiringOverviewCard
            onFooterClick={() => navigate('/recruitment')}
          />
          <ExpensesOverviewCard
            onFooterClick={() => navigate('/expenses')}
          />
        </div>

        {/* Upcoming Interviews & Upcoming Meetings */}
        <div className="grid grid-cols-2 gap-6 max-[1220px]:grid-cols-1">
          <UpcomingInterviewsCard
            onFooterClick={() => navigate('/learning/ai-interviews')}
          />
          <UpcomingMeetingsCard
            onFooterClick={() => navigate('/learning/calendar')}
          />
        </div>

        {/* HR Operations & Work Updates */}
        <CEOHRWorkUpdatesCard />

        {/* Leave Request */}
        <CEOLeaveRequestCard
          requests={pendingLeaveRequests}
          totalCount={pendingLeaveCount}
          loading={pendingLeaveLoading}
          onFooterClick={() => navigate('/leave/review')}
        />
      </div>

      <ConfirmationModal
        isOpen={showCheckoutModal}
        title="Confirm Check Out"
        message="Are you sure you want to check out for today? Once you check out, your working hours and attendance status will be finalized."
        confirmText="Check Out"
        cancelText="Cancel"
        loading={attendanceLoading}
        onCancel={() => setShowCheckoutModal(false)}
        onConfirm={handleCheckOut}
      />
    </DashboardLayout>
  )
}

export default CEODashboard
