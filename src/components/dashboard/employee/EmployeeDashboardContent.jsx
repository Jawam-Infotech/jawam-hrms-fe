import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../../context/UserContext.jsx'
import AttendanceCard from '../../shared/AttendanceCard.jsx'
import TimeSheetCard from '../../shared/TimeSheetCard.jsx'
import AssignedTaskCard from '../../shared/AssignedTaskCard.jsx'
import LeaveBalanceCard from '../../shared/LeaveBalanceCard.jsx'
import PerformanceScoreCard from '../../shared/PerformanceScoreCard.jsx'
import LatestPayslipCard from '../../shared/LatestPayslipCard.jsx'
import AnnouncementCard from '../../shared/AnnouncementCard.jsx'
import TodaysTasksCard from '../../shared/TodaysTasksCard.jsx'
import RecentActivitiesCard from '../../shared/RecentActivitiesCard.jsx'
import useAttendance from '../../../hooks/useAttendance.js'
import useBreakTimer from '../../../hooks/useBreakTimer.js'
import ConfirmationModal from '../../shared/ConfirmationModal.jsx'
import useAttendanceCorrections from '../../../hooks/useAttendanceCorrections.js'
import AttendanceReminderBanner from '../../attendance/AttendanceReminderBanner.jsx'
import CorrectionRequestModal from '../../attendance/CorrectionRequestModal.jsx'


function EmployeeDashboardContent() {
  const navigate = useNavigate()
  const { user } = useContext(UserContext)
  const { attendance, loading: attendanceLoading, checkIn, checkOut, startBreak, endBreak, loadTodayAttendance } = useAttendance()
  const liveBreakTimer = useBreakTimer(attendance)
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  const [showCorrectionModal, setShowCorrectionModal] = useState(false)
  const [selectedAttendanceId, setSelectedAttendanceId] = useState(null)
  const {
    missedCheckouts,
    refreshMissedCheckouts,
  } = useAttendanceCorrections()
  const [showReminder, setShowReminder] = useState(true)
  const [submittedCorrectionDates, setSubmittedCorrectionDates] = useState([])

  const todayStatus = attendance?.todayStatus || 'NOT_CHECKED_IN'
  const isCheckedIn = ['PRESENT', 'LATE', 'HALF_DAY'].includes(todayStatus)
  const hasCheckedOut = Boolean(attendance?.checkOut && attendance.checkOut !== '-')

  const lastBreak = attendance?.breakSessions?.[attendance.breakSessions.length - 1]
  const isOnBreak =
    attendance?.uiStatus === 'ON_BREAK' ||
    Boolean(lastBreak && !lastBreak.end && !lastBreak.breakEnd)

  const attendanceStatus = todayStatus === 'NOT_CHECKED_IN'
    ? 'Awaiting Check In'
    : todayStatus.replaceAll('_', ' ')

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const handleCheckIn = async () => {
    try {
      await checkIn()
      await loadTodayAttendance()
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to check in.')
    }
  }

  const handleCheckOut = async () => {
    try {
      await checkOut()
      await loadTodayAttendance()
      setShowCheckoutModal(false)
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to check out.')
    }
  }

  const handleBreak = async () => {
    try {
      await startBreak()
      await loadTodayAttendance()
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to start break.')
      await loadTodayAttendance()
    }
  }

  const handleResumeWork = async () => {
    try {
      await endBreak()
      await loadTodayAttendance()
    } catch (error) {
      alert(error.response?.data?.detail || 'Failed to end break.')
      await loadTodayAttendance()
    }
  }

  const handleCorrectionRequest = (attendanceRecord) => {
    const attendanceId = attendanceRecord?.id ?? attendanceRecord?.attendance_id ?? null

    console.log('Selected correction attendance record:', attendanceRecord)
    setSelectedAttendanceId(attendanceId)
    setShowCorrectionModal(true)
  }

  const handleDismissReminder = () => {
    setShowReminder(false)
  }

const handleCorrectionSubmitSuccess = (correctionDate) => {
  if (correctionDate) {
    setSubmittedCorrectionDates((currentDates) => [
      ...currentDates,
      correctionDate,
    ])
  }

  setShowCorrectionModal(false)
  setSelectedAttendanceId(null)

  // Refresh both source datasets so the server-side PENDING request keeps this
  // date hidden after the temporary submission state is no longer needed.
  refreshMissedCheckouts()
}

const visibleMissedCheckouts = missedCheckouts.filter((attendance) => {
  const attendanceDate = String(attendance?.date || '').slice(0, 10)

  return !submittedCorrectionDates.includes(attendanceDate)
})
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[36px] font-black text-[#111827] mb-2">{getGreeting()}, {user.name}</h1>
          <p className="text-[16px] text-[#5f6679]">Welcome back to Jawam HR</p>
          <p className="text-[14px] text-[#5f6679] mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={isCheckedIn && !hasCheckedOut ? () => setShowCheckoutModal(true) : handleCheckIn}
            disabled={hasCheckedOut || attendanceLoading}
            className={`px-6 py-2 rounded-full font-extrabold text-[14px] transition-all ${hasCheckedOut ? 'bg-[#e5e7eb] text-[#9ca3af] cursor-not-allowed' : 'bg-[#3b82f6] text-white hover:bg-[#2563eb]'}`}
          >
            {hasCheckedOut ? 'Checked Out' : isCheckedIn ? 'Check Out' : 'Check In'}
          </button>

          <button
            disabled={!isCheckedIn || hasCheckedOut || attendanceLoading}
            onClick={isOnBreak ? handleResumeWork : handleBreak}
            className={`px-6 py-2 rounded-full font-extrabold text-[14px] transition-all ${isCheckedIn && !hasCheckedOut ? 'bg-[#fbbf24] text-[#111827] hover:bg-[#fcd34d]' : 'bg-[#e5e7eb] text-[#9ca3af] cursor-not-allowed'}`}
          >
            {isOnBreak ? 'Resume Work' : 'Apply Break'}
          </button>

          <button
            type="button"
            onClick={() => navigate('/workupdate')}
            className="px-6 py-2 rounded-full bg-white border-2 border-[#111827] text-[#111827] font-extrabold text-[14px] hover:bg-[#f9fafb] transition-all"
          >
            Submit Update
          </button>

          <button
            type="button"
            onClick={() => navigate('/leave')}
            className="px-6 py-2 rounded-full bg-white border-2 border-[#111827] text-[#111827] font-extrabold text-[14px] hover:bg-[#f9fafb] transition-all"
          >
            Apply Leave
          </button>
        </div>
      </div>

{showReminder && visibleMissedCheckouts.length > 0 && (
  <AttendanceReminderBanner
    missedCheckouts={visibleMissedCheckouts}
    onSubmit={handleCorrectionRequest}
    onDismiss={handleDismissReminder}
  />
)}

      <div className="grid grid-cols-4 gap-6 max-[1220px]:grid-cols-2 max-[760px]:grid-cols-1">
        <AttendanceCard
          checkInTime={attendance?.checkIn}
          checkOutTime={attendance?.checkOut}
          breakDuration={liveBreakTimer || attendance?.breakDuration}
          status={attendanceStatus}
          hasCheckedOut={hasCheckedOut}
          workingHours={attendance?.effectiveWorkingDuration}
        />
        <TimeSheetCard />
        <AssignedTaskCard />
        <LeaveBalanceCard />
      </div>

      <div className="grid grid-cols-3 gap-6 max-[1220px]:grid-cols-2 max-[760px]:grid-cols-1">
        <PerformanceScoreCard />
        <LatestPayslipCard />
        <AnnouncementCard />
      </div>

      <div className="grid grid-cols-2 gap-6 max-[760px]:grid-cols-1">
        <TodaysTasksCard />
        <RecentActivitiesCard />
      </div>

      <ConfirmationModal
        isOpen={showCheckoutModal}
        title="Confirm Check Out"
        message={isOnBreak ? 'You are currently on a break. Checking out will automatically end your break and finalize your attendance for today.' : 'Are you sure you want to check out for today? Once you check out, your working hours and attendance status will be finalized.'}
        confirmText="Check Out"
        cancelText="Cancel"
        loading={attendanceLoading}
        onCancel={() => setShowCheckoutModal(false)}
        onConfirm={handleCheckOut}
      />

      <CorrectionRequestModal
        isOpen={showCorrectionModal}
        attendanceId={selectedAttendanceId}
        onSubmitSuccess={handleCorrectionSubmitSuccess}
        onClose={() => {
          setShowCorrectionModal(false)
          setSelectedAttendanceId(null)
        }}
      />
    </div>
  )
}

export default EmployeeDashboardContent
