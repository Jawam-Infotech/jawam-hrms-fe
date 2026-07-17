import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../context/UserContext'
import DashboardLayout from '../../layouts/DashboardLayout'
import AttendanceCard from '../../components/shared/AttendanceCard'
import TimeSheetCard from '../../components/shared/TimeSheetCard'
import AssignedTaskCard from '../../components/shared/AssignedTaskCard'
import LeaveBalanceCard from '../../components/shared/LeaveBalanceCard'
import PerformanceScoreCard from '../../components/shared/PerformanceScoreCard'
import LatestPayslipCard from '../../components/shared/LatestPayslipCard'
import AnnouncementCard from '../../components/shared/AnnouncementCard'
import RecentActivitiesCard from '../../components/shared/RecentActivitiesCard'

// Team Leader View Cards
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
                <div className="h-2 bg-[#3b82f6] rounded-full" style={{ width: deadline.progress }}></div>
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

function TodaysTasksCard() {
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

function TeamLeaderDashboard() {
  const navigate = useNavigate()
  const { user } = useContext(UserContext)
  const [dashboardMode, setDashboardMode] = useState('tlEmployee')
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

  if (dashboardMode === 'tlTeams') {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          {/* Header with Toggle */}
          <div className="flex items-center justify-between gap-6 flex-wrap">
            <div>
              <h1 className="text-[36px] font-black text-[#111827] mb-2">{getGreeting()}, {user.name}</h1>
              <p className="text-[16px] text-[#5f6679] mb-2">Welcome back to Jawam HR</p>
              <p className="text-[14px] text-[#5f6679]">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Toggle */}
              <div className="rounded-full border border-[#e5e7eb] bg-white p-1 flex">
                <button
                  type="button"
                  onClick={() => setDashboardMode('tlEmployee')}
                  className={`px-4 py-2 rounded-full text-[14px] font-semibold transition-all ${
                    dashboardMode === 'tlEmployee'
                      ? 'bg-[#3b82f6] text-white'
                      : 'text-[#6b7280] hover:bg-[#f3f4f6]'
                  }`}
                >
                  Employee
                </button>
                <button
                  type="button"
                  onClick={() => setDashboardMode('tlTeams')}
                  className={`px-4 py-2 rounded-full text-[14px] font-semibold transition-all ${
                    dashboardMode === 'tlTeams'
                      ? 'bg-[#3b82f6] text-white'
                      : 'text-[#6b7280] hover:bg-[#f3f4f6]'
                  }`}
                >
                  Team Leader
                </button>
              </div>

              {/* Action Buttons */}
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

          {/* Cards Grid */}
          <div className="grid grid-cols-4 gap-6 max-[1220px]:grid-cols-2 max-[760px]:grid-cols-1">
            <AttendanceTodayCard />
            <PendingLeaveRequestCard />
            <PendingWorkUpdatesCard />
            <ActiveProjectsCard />
          </div>

          {/* Performance and Events */}
          <div className="grid grid-cols-3 gap-6 max-[1220px]:grid-cols-2 max-[760px]:grid-cols-1">
            <TeamPerformanceCard />
            <UpcomingTeamEventsCard />
            <UpcomingDeadlinesCard />
          </div>

          {/* Tasks and Leave */}
          <div className="grid grid-cols-2 gap-6 max-[760px]:grid-cols-1">
            <TodaysTasksCard />
            <LeaveRequestCard />
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // TL Employee view
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between gap-6 flex-wrap">
          <div>
            <h1 className="text-[36px] font-black text-[#111827] mb-2">{getGreeting()}, {user.name}</h1>
            <p className="text-[16px] text-[#5f6679]">Welcome back to Jawam HR</p>
            <p className="text-[14px] text-[#5f6679] mt-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {/* Toggle */}
            <div className="rounded-full border border-[#e5e7eb] bg-white p-1 flex">
              <button
                type="button"
                onClick={() => setDashboardMode('tlEmployee')}
                className={`px-4 py-2 rounded-full text-[14px] font-semibold transition-all ${
                  dashboardMode === 'tlEmployee'
                    ? 'bg-[#3b82f6] text-white'
                    : 'text-[#6b7280] hover:bg-[#f3f4f6]'
                }`}
              >
                Employee
              </button>
              <button
                type="button"
                onClick={() => setDashboardMode('tlTeams')}
                className={`px-4 py-2 rounded-full text-[14px] font-semibold transition-all ${
                  dashboardMode === 'tlTeams'
                    ? 'bg-[#3b82f6] text-white'
                    : 'text-[#6b7280] hover:bg-[#f3f4f6]'
                }`}
              >
                Team Leader
              </button>
            </div>

            {/* Action Buttons */}
            <button
              onClick={isCheckedIn ? handleCheckOut : handleCheckIn}
              disabled={hasCheckedOut}
              className={`px-6 py-2 rounded-full font-extrabold text-[14px] transition-all ${
                hasCheckedOut
                  ? 'bg-[#e5e7eb] text-[#9ca3af] cursor-not-allowed'
                  : 'bg-[#3b82f6] text-white hover:bg-[#2563eb]'
              }`}
            >
              {isCheckedIn ? 'Check out' : 'Check in'}
            </button>

            <button
              disabled={!isCheckedIn}
              onClick={isOnBreak ? handleResumeWork : handleBreak}
              className={`px-6 py-2 rounded-full font-extrabold text-[14px] transition-all ${
                isCheckedIn
                  ? 'bg-[#fbbf24] text-[#111827] hover:bg-[#fcd34d]'
                  : 'bg-[#e5e7eb] text-[#9ca3af] cursor-not-allowed'
              }`}
            >
              {isOnBreak ? 'Resume Work' : 'Apply Break'}
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

        {/* Cards Grid */}
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

        {/* Bottom Section */}
        <div className="grid grid-cols-3 gap-6 max-[1220px]:grid-cols-2 max-[760px]:grid-cols-1">
          <PerformanceScoreCard />
          <LatestPayslipCard buttonText="View Payslip" />
          <AnnouncementCard />
        </div>

        {/* Recent Activities */}
        <div className="grid grid-cols-1 gap-6">
          <RecentActivitiesCard activities={tlActivities} />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default TeamLeaderDashboard