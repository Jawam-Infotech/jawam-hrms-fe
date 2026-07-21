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

function EmployeeDashboardContent() {
  const navigate = useNavigate()
  const { user } = useContext(UserContext)
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [isOnBreak, setIsOnBreak] = useState(false)
  const [checkInTime, setCheckInTime] = useState(null)
  const [checkOutTime, setCheckOutTime] = useState(null)
  const [checkInDate, setCheckInDate] = useState(null)
  const [hasCheckedOut, setHasCheckedOut] = useState(false)
  const [workingHours, setWorkingHours] = useState(null)
  const [breakStartTime, setBreakStartTime] = useState(null)
  const [totalBreakDuration, setTotalBreakDuration] = useState(0)
  const [attendanceStatus, setAttendanceStatus] = useState('Awaiting')

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const handleCheckIn = () => {
    const now = new Date()
    const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    setCheckInTime(timeString)
    setCheckInDate(now)
    setHasCheckedOut(false)
    setWorkingHours(null)
    setIsCheckedIn(true)
    setAttendanceStatus('Working')
  }

  const handleCheckOut = () => {
    const now = new Date()
    const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    setCheckOutTime(timeString)
    setIsCheckedIn(false)
    setAttendanceStatus('Checked Out')
    setHasCheckedOut(true)

    let workedMinutes = 0
    if (checkInDate) {
      workedMinutes = Math.floor((now - checkInDate) / 60000) - (totalBreakDuration || 0)
      if (workedMinutes < 0) workedMinutes = 0
    }

    const hours = Math.floor(workedMinutes / 60)
    const minutes = workedMinutes % 60
    const workingString = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
    setWorkingHours(workingString)
  }

  const handleBreak = () => {
    if (!isOnBreak) {
      setBreakStartTime(new Date())
      setIsOnBreak(true)
    }
  }

  const handleResumeWork = () => {
    if (breakStartTime && isOnBreak) {
      const breakEnd = new Date()
      const breakDuration = Math.floor((breakEnd - breakStartTime) / 60000)
      setTotalBreakDuration(breakDuration)
      setIsOnBreak(false)
      setBreakStartTime(null)
    }
  }

  const breakDurationString =
    totalBreakDuration > 0 ? `${Math.floor(totalBreakDuration / 60)}h ${totalBreakDuration % 60}m` : null

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[36px] font-black text-[#111827] mb-2">
            {getGreeting()}, {user.name}
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

        <div className="flex gap-3 flex-wrap">
          <button
            onClick={isCheckedIn ? handleCheckOut : handleCheckIn}
            disabled={hasCheckedOut}
            className={`px-6 py-2 rounded-full font-extrabold text-[14px] transition-all ${
              hasCheckedOut
                ? 'bg-[#e5e7eb] text-[#9ca3af] cursor-not-allowed'
                : 'bg-[#3b82f6] text-white hover:bg-[#2563eb]'
            }`}
          >
            {hasCheckedOut ? 'Checked Out' : isCheckedIn ? 'Check Out' : 'Check In'}
          </button>

          <button
            disabled={!isCheckedIn || hasCheckedOut}
            onClick={isOnBreak ? handleResumeWork : handleBreak}
            className={`px-6 py-2 rounded-full font-extrabold text-[14px] transition-all ${
              isCheckedIn && !hasCheckedOut
                ? 'bg-[#fbbf24] text-[#111827] hover:bg-[#fcd34d]'
                : 'bg-[#e5e7eb] text-[#9ca3af] cursor-not-allowed'
            }`}
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

      <div className="grid grid-cols-4 gap-6 max-[1220px]:grid-cols-2 max-[760px]:grid-cols-1">
        <AttendanceCard
          checkInTime={checkInTime}
          checkOutTime={checkOutTime}
          breakDuration={breakDurationString}
          status={attendanceStatus}
          hasCheckedOut={hasCheckedOut}
          workingHours={workingHours}
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
    </div>
  )
}

export default EmployeeDashboardContent
