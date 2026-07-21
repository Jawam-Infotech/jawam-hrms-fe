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
import RecentActivitiesCard from '../../shared/RecentActivitiesCard.jsx'
// import TodaysTasksCard from '../../shared/TodaysTasksCard.jsx'

function AttendanceTodayCard() {
  return (
    <div className="bg-white rounded-[16px] border border-[#e5e5e5] p-6 shadow-sm">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-[#d1fae5] flex items-center justify-center text-[24px]">⏱️</div>
        <div>
          <h3 className="text-[16px] font-extrabold text-[#111827]">Attendance Today</h3>
        </div>
      </div>
      <div className="text-center mb-6">
        <p className="text-[36px] font-black text-[#10b981]">95%</p>
      </div>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-[12px] text-[#5f6679] mb-1">Present</p>
          <p className="text-[18px] font-extrabold text-[#111827]">95</p>
        </div>
        <div>
          <p className="text-[12px] text-[#5f6679] mb-1">Absent</p>
          <p className="text-[18px] font-extrabold text-[#111827]">5</p>
        </div>
        <div>
          <p className="text-[12px] text-[#5f6679] mb-1">Late</p>
          <p className="text-[18px] font-extrabold text-[#111827]">9</p>
        </div>
      </div>
    </div>
  )
}

function PendingLeaveRequestCard() {
  return (
    <div className="bg-white rounded-[16px] border border-[#e5e5e5] p-6 shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-[#fef3c7] flex items-center justify-center text-[24px]">📋</div>
        <div>
          <h3 className="text-[16px] font-extrabold text-[#111827]">Pending Leave Request</h3>
          <p className="text-[14px] font-extrabold text-[#f59e0b]">● 5</p>
        </div>
      </div>
      <button className="text-[#3b82f6] text-[14px] font-extrabold hover:underline">Review Leaves</button>
    </div>
  )
}

function PendingWorkUpdatesCard() {
  return (
    <div className="bg-white rounded-[16px] border border-[#e5e5e5] p-6 shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-[#dbeafe] flex items-center justify-center text-[24px]">📝</div>
        <div>
          <h3 className="text-[16px] font-extrabold text-[#111827]">Pending Work Updates</h3>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <p className="text-[12px] text-[#5f6679]">Pending</p>
          <p className="text-[14px] font-semibold text-[#111827]">3</p>
        </div>
        <div className="flex justify-between">
          <p className="text-[12px] text-[#5f6679]">Submitted</p>
          <p className="text-[14px] font-semibold text-[#111827]">15</p>
        </div>
      </div>
      <button className="text-[#3b82f6] text-[14px] font-extrabold hover:underline mt-3">Review Updates</button>
    </div>
  )
}

function ActiveProjectsCard() {
  return (
    <div className="bg-white rounded-[16px] border border-[#e5e5e5] p-6 shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-[#f0fdf4] flex items-center justify-center text-[24px]">📁</div>
        <div>
          <h3 className="text-[16px] font-extrabold text-[#111827]">Active Projects</h3>
          <p className="text-[14px] font-extrabold text-[#3b82f6]">5 Project</p>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between">
          <p className="text-[12px] text-[#5f6679]">Running</p>
          <p className="text-[14px] font-semibold text-[#111827]">4</p>
        </div>
        <div className="flex justify-between">
          <p className="text-[12px] text-[#5f6679]">Near Deadline</p>
          <p className="text-[14px] font-semibold text-[#111827]">1</p>
        </div>
      </div>
    </div>
  )
}

function TeamPerformanceCard() {
  return (
    <div className="bg-white rounded-[16px] border border-[#e5e5e5] p-6 shadow-sm">
      <h3 className="text-[18px] font-extrabold text-[#111827] mb-6">Team Performance</h3>
      <div className="flex flex-col items-center">
        <div className="relative w-[140px] h-[140px] mb-4">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e5e5" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="8"
              strokeDasharray={`${(62 / 100) * 282.7} 282.7`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[36px] font-black text-[#111827]">62%</span>
          </div>
        </div>
        <p className="text-[14px] font-extrabold text-[#f59e0b] mb-2">Needs Improvement</p>
        <p className="text-[12px] text-[#5f6679] text-center">Focus on completing tasks on time and achieving goals.</p>
        <button className="text-[#3b82f6] text-[14px] font-extrabold hover:underline mt-4">View Employee Score</button>
      </div>
    </div>
  )
}

function UpcomingTeamEventsCard() {
  const events = [
    { name: 'Product Demo', date: '18 Jun 2026' },
    { name: 'Sync Review', date: '19 Jun 2026' },
    { name: 'Team Meeting', date: '18 Jun 2026' },
    { name: 'Team Meeting', date: '18 Jun 2026' },
    { name: 'Team Meeting', date: '18 Jun 2026' },
  ]

  return (
    <div className="bg-white rounded-[16px] border border-[#e5e5e5] p-6 shadow-sm">
      <h3 className="text-[18px] font-extrabold text-[#111827] mb-4">Upcoming Team Events</h3>
      <div className="space-y-3">
        {events.map((event, idx) => (
          <div key={idx} className="flex justify-between items-center pb-3 border-b border-[#e5e5e5] last:border-0">
            <p className="text-[14px] font-semibold text-[#111827]">{event.name}</p>
            <p className="text-[12px] text-[#5f6679]">{event.date}</p>
          </div>
        ))}
      </div>
      <button className="text-[#3b82f6] text-[14px] font-extrabold hover:underline mt-4">View All Events</button>
    </div>
  )
}

function UpcomingDeadlinesCard() {
  const deadlines = [
    { name: 'IMS Software', progress: '78%', dueIn: 'Due in 2 days' },
    { name: 'HRMS Software', progress: '80%', dueIn: 'Due in 5 days' },
    { name: 'Website Redesigning', progress: '70%', dueIn: 'Due in 7 days' },
  ]

  return (
    <div className="bg-white rounded-[16px] border border-[#e5e5e5] p-6 shadow-sm">
      <h3 className="text-[18px] font-extrabold text-[#111827] mb-4">Upcoming Deadlines</h3>
      <div className="space-y-4">
        {deadlines.map((deadline, idx) => (
          <div key={idx} className="pb-4 border-b border-[#e5e5e5] last:border-0">
            <div className="flex justify-between items-center mb-2">
              <p className="text-[14px] font-semibold text-[#111827]">{deadline.name}</p>
              <p className="text-[12px] text-[#5f6679]">{deadline.dueIn}</p>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex-1 h-2 bg-[#e5e5e5] rounded-full mr-2">
                <div className="h-2 bg-[#3b82f6] rounded-full" style={{ width: deadline.progress }} />
              </div>
              <p className="text-[12px] font-semibold text-[#111827]">{deadline.progress}</p>
            </div>
          </div>
        ))}
      </div>
      <button className="text-[#3b82f6] text-[14px] font-extrabold hover:underline mt-4">View All Announcement</button>
    </div>
  )
}

function TeamLeaderTodaysTasksCard() {
  const tasks = [
    { employee: 'Rajesh', active: 5, completed: 3, dueToday: 1 },
    { employee: 'Aman', active: 6, completed: 2, dueToday: 3 },
    { employee: 'Pradeep', active: 10, completed: 5, dueToday: 4 },
    { employee: 'Neha', active: 10, completed: 5, dueToday: 4 },
    { employee: 'Radhika', active: 10, completed: 5, dueToday: 4 },
  ]

  return (
    <div className="bg-white rounded-[16px] border border-[#e5e5e5] p-6 shadow-sm">
      <h3 className="text-[18px] font-extrabold text-[#111827] mb-4">Today's Tasks</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-[14px]">
          <thead>
            <tr className="border-b border-[#e5e5e5]">
              <th className="text-left font-extrabold text-[#111827] pb-3">Employee</th>
              <th className="text-left font-extrabold text-[#111827] pb-3">Active</th>
              <th className="text-left font-extrabold text-[#111827] pb-3">Completed</th>
              <th className="text-left font-extrabold text-[#111827] pb-3">Due Today</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, idx) => (
              <tr key={idx} className="border-b border-[#e5e5e5] hover:bg-[#f9fafb]">
                <td className="py-3 font-semibold text-[#111827]">{task.employee}</td>
                <td className="py-3 text-[#111827]">{task.active}</td>
                <td className="py-3 text-[#111827]">{task.completed}</td>
                <td className="py-3 text-[#111827]">{task.dueToday}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="text-[#3b82f6] text-[14px] font-extrabold hover:underline mt-4">View all Employees task</button>
    </div>
  )
}

function LeaveRequestCard() {
  const leaves = [
    { name: 'Rajesh Singh', type: 'Personal Leave', duration: '7 Days' },
    { name: 'Aman Dev', type: 'Medical Leave', duration: '1 Day' },
    { name: 'Arpit Bhatt', type: 'Emergency Leave', duration: '8 Days' },
    { name: 'Radhika Mishra', type: 'Marriage Leave', duration: '1 week' },
  ]

  return (
    <div className="bg-white rounded-[16px] border border-[#e5e5e5] p-6 shadow-sm">
      <h3 className="text-[18px] font-extrabold text-[#111827] mb-4">Leave Request</h3>
      <div className="space-y-3">
        {leaves.map((leave, idx) => (
          <div key={idx} className="flex justify-between items-start pb-3 border-b border-[#e5e5e5] last:border-0">
            <div>
              <p className="text-[14px] font-semibold text-[#111827]">{leave.name}</p>
              <p className="text-[12px] text-[#5f6679]">{leave.type}</p>
            </div>
            <p className="text-[12px] text-[#5f6679]">{leave.duration}</p>
          </div>
        ))}
      </div>
      <button className="text-[#3b82f6] text-[14px] font-extrabold hover:underline mt-4">View all Leave Request (5)</button>
    </div>
  )
}

function TeamLeaderDashboardContent() {
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

  const tlActivities = [
    { title: 'Attendance Marked', desc: 'Check in at 09:03 AM', time: '2 min ago' },
    { title: 'Attendance Marked', desc: 'Check in at 09:03 AM', time: '2 min ago' },
    { title: 'Attendance Marked', desc: 'Check in at 09:03 AM', time: '2 min ago' },
    { title: 'Attendance Marked', desc: 'Check in at 09:03 AM', time: '2 min ago' },
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-6 flex-wrap">
        <div>
          <h1 className="text-[36px] font-black text-[#111827] mb-2">
            {getGreeting()}, {user.name}
          </h1>
          <p className="text-[16px] text-[#5f6679] mb-2">Welcome back to Jawam HR</p>
          <p className="text-[14px] text-[#5f6679]">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          <button
            type="button"
            onClick={() => navigate('/projects')}
            className="px-6 py-2 rounded-full bg-white border-2 border-[#111827] text-[#111827] font-extrabold text-[14px] hover:bg-[#f9fafb] transition-all"
          >
            Assign Task
          </button>
          <button
            type="button"
            onClick={() => navigate('/projects')}
            className="px-6 py-2 rounded-full bg-white border-2 border-[#111827] text-[#111827] font-extrabold text-[14px] hover:bg-[#f9fafb] transition-all"
          >
            Create Project
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 max-[1220px]:grid-cols-2 max-[760px]:grid-cols-1">
        <AttendanceTodayCard />
        <PendingLeaveRequestCard />
        <PendingWorkUpdatesCard />
        <ActiveProjectsCard />
      </div>

      <div className="grid grid-cols-3 gap-6 max-[1220px]:grid-cols-2 max-[760px]:grid-cols-1">
        <TeamPerformanceCard />
        <UpcomingTeamEventsCard />
        <UpcomingDeadlinesCard />
      </div>

      <div className="grid grid-cols-2 gap-6 max-[760px]:grid-cols-1">
        <TeamLeaderTodaysTasksCard />
        <LeaveRequestCard />
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
        <LatestPayslipCard buttonText="View Payslip" />
        <AnnouncementCard />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <RecentActivitiesCard activities={tlActivities} />
      </div>
    </div>
  )
}

export default TeamLeaderDashboardContent
