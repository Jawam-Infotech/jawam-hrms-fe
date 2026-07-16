import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../context/UserContext'
import DashboardLayout from '../../layouts/DashboardLayout'

// Row 1 cards
function AttendanceTodayCard() {
  return (
    <div className="bg-white rounded-[16px] border border-[#e5e5e5] p-6 shadow-sm">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-[#d1fae5] flex items-center justify-center text-[24px]">⏱️</div>
        <div>
          <h3 className="text-[16px] font-extrabold text-[#111827]">Attendance Today</h3>
          <p className="text-[14px] font-extrabold text-[#10b981]">● 95%</p>
        </div>
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

function InterviewTodayCard() {
  return (
    <div className="bg-white rounded-[16px] border border-[#e5e5e5] p-6 shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-[#dbeafe] flex items-center justify-center text-[24px]">☁️</div>
        <div>
          <h3 className="text-[16px] font-extrabold text-[#111827]">Interview Today</h3>
          <p className="text-[14px] font-extrabold text-[#3b82f6]">5</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-[12px] text-[#5f6679] mb-1">Remaining</p>
          <p className="text-[16px] font-extrabold text-[#111827]">3</p>
        </div>
        <div>
          <p className="text-[12px] text-[#5f6679] mb-1">Completed</p>
          <p className="text-[16px] font-extrabold text-[#111827]">2</p>
        </div>
      </div>
      <button className="text-[#3b82f6] text-[14px] font-extrabold hover:underline mt-3">Review Candidates</button>
    </div>
  )
}

function RecentJoinersCard() {
  return (
    <div className="bg-white rounded-[16px] border border-[#e5e5e5] p-6 shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-[#ede9fe] flex items-center justify-center text-[24px]">👥</div>
        <div>
          <h3 className="text-[16px] font-extrabold text-[#111827]">Recent Joiners</h3>
          <p className="text-[14px] font-extrabold text-[#3b82f6]">3 Joiners</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-[12px] text-[#5f6679] mb-1">Joined</p>
          <p className="text-[16px] font-extrabold text-[#111827]">1</p>
        </div>
        <div>
          <p className="text-[12px] text-[#5f6679] mb-1">Future joiners</p>
          <p className="text-[16px] font-extrabold text-[#111827]">2</p>
        </div>
      </div>
      <button className="text-[#3b82f6] text-[14px] font-extrabold hover:underline mt-3">View All Joiners</button>
    </div>
  )
}

// Row 2 — list cards
function RecruitmentActivityCard() {
  const stages = [
    { label: 'Application Received', count: 100 },
    { label: 'Shortlisted', count: 40 },
    { label: 'Interview Scheduled', count: 20 },
    { label: 'Offer Scheduled', count: 10 },
    { label: 'Joined', count: 5 },
    { label: 'Backoff Candidates', count: 3 },
  ]

  return (
    <div className="bg-white rounded-[16px] border border-[#e5e5e5] p-6 shadow-sm">
      <h3 className="text-[18px] font-extrabold text-[#111827] mb-4">Recruitment activity</h3>
      <div className="space-y-3">
        {stages.map((stage, idx) => (
          <div key={idx} className="flex justify-between items-center pb-3 border-b border-[#e5e5e5] last:border-0">
            <p className="text-[14px] font-semibold text-[#111827]">{stage.label}</p>
            <p className="text-[12px] text-[#5f6679]">({stage.count})</p>
          </div>
        ))}
      </div>
      <button className="text-[#3b82f6] text-[14px] font-extrabold hover:underline mt-4">View All Open Positions</button>
    </div>
  )
}

function ActivePositionsCard() {
  const positions = [
    { label: 'UI/UX Developer', count: 3 },
    { label: 'ROR Developer', count: 1 },
    { label: 'Full Stack Developer', count: 3 },
    { label: 'HR Executive', count: 2 },
    { label: 'Front End Developer', count: 8 },
    { label: 'Project Manager', count: 3 },
  ]

  return (
    <div className="bg-white rounded-[16px] border border-[#e5e5e5] p-6 shadow-sm">
      <h3 className="text-[18px] font-extrabold text-[#111827] mb-4">Active Positions</h3>
      <div className="space-y-3">
        {positions.map((position, idx) => (
          <div key={idx} className="flex justify-between items-center pb-3 border-b border-[#e5e5e5] last:border-0">
            <p className="text-[14px] font-semibold text-[#111827]">{position.label}</p>
            <p className="text-[12px] text-[#5f6679]">({position.count})</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function PendingAssetRequestCard() {
  const requests = [
    { name: 'Rajesh P', asset: 'Laptop', time: '1 day ago' },
    { name: 'Aman Bhatt', asset: 'Mouse And Keyboard', time: '2 day ago' },
    { name: 'Shubham Joshi', asset: 'Headphones', time: '3 days ago' },
  ]

  return (
    <div className="bg-white rounded-[16px] border border-[#e5e5e5] p-6 shadow-sm">
      <h3 className="text-[18px] font-extrabold text-[#111827] mb-4">Pending Asset Request</h3>
      <div className="space-y-3">
        {requests.map((req, idx) => (
          <div key={idx} className="flex justify-between items-start pb-3 border-b border-[#e5e5e5] last:border-0">
            <div>
              <p className="text-[14px] font-semibold text-[#111827]">{req.name}</p>
              <p className="text-[12px] text-[#5f6679]">{req.asset}</p>
            </div>
            <p className="text-[12px] text-[#5f6679]">{req.time}</p>
          </div>
        ))}
      </div>
      <button className="text-[#3b82f6] text-[14px] font-extrabold hover:underline mt-4">View All Request</button>
    </div>
  )
}

// Row 3 cards
function UpcomingActivitiesCard() {
  const activities = [
    { title: 'Interview Scheduled', desc: 'Rajesh K (Full Stack Developer)', time: '11:30 AM' },
    { title: 'Interview Scheduled', desc: 'Ronit (ROR Developer)', time: '12:30 PM' },
    { title: 'Fun Friday', desc: 'Organize games or events of the employees', time: 'This Friday' },
    { title: 'Meeting with Director', desc: 'Clock in at 09:05 AM', time: '16/05/2026' },
  ]

  return (
    <div className="bg-white rounded-[16px] border border-[#e5e5e5] p-6 shadow-sm">
      <h3 className="text-[18px] font-extrabold text-[#111827] mb-4">Upcoming Activities</h3>
      <div className="space-y-3">
        {activities.map((activity, idx) => (
          <div key={idx} className="flex justify-between items-start pb-3 border-b border-[#e5e5e5] last:border-0">
            <div>
              <p className="text-[14px] font-semibold text-[#111827]">{activity.title}</p>
              <p className="text-[12px] text-[#5f6679]">{activity.desc}</p>
            </div>
            <p className="text-[12px] text-[#5f6679]">{activity.time}</p>
          </div>
        ))}
      </div>
      <button className="text-[#3b82f6] text-[14px] font-extrabold hover:underline mt-4">View All Activities</button>
    </div>
  )
}

function LeaveRequestCard() {
  const leaves = [
    { name: 'Rajesh Singh', type: 'Personal Leave', duration: '2 Days' },
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

function HRDashboard() {
  const navigate = useNavigate()
  const { user } = useContext(UserContext)

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-6 flex-wrap">
          <div>
            <h1 className="text-[36px] font-black text-[#111827] mb-2">{getGreeting()}, {user.name}</h1>
            <p className="text-[16px] text-[#5f6679] mb-2">Welcome back to Jawam HR</p>
            <p className="text-[14px] text-[#5f6679]">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => navigate('/employees/new')}
              className="px-6 py-2 rounded-full bg-white border-2 border-[#111827] text-[#111827] font-extrabold text-[14px] hover:bg-[#f9fafb] transition-all"
            >
              Add Emloyee
            </button>
            <button
              type="button"
              onClick={() => navigate('/recruitment/new-job')}
              className="px-6 py-2 rounded-full bg-white border-2 border-[#111827] text-[#111827] font-extrabold text-[14px] hover:bg-[#f9fafb] transition-all"
            >
              Create Job
            </button>
            <button
              type="button"
              onClick={() => navigate('/helpdesk')}
              className="px-6 py-2 rounded-full bg-white border-2 border-[#111827] text-[#111827] font-extrabold text-[14px] hover:bg-[#f9fafb] transition-all"
            >
              Review Tickets
            </button>
          </div>
        </div>

        {/* Row 1 */}
        <div className="grid grid-cols-4 gap-6 max-[1220px]:grid-cols-2 max-[760px]:grid-cols-1">
          <AttendanceTodayCard />
          <PendingLeaveRequestCard />
          <InterviewTodayCard />
          <RecentJoinersCard />
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-3 gap-6 max-[1220px]:grid-cols-2 max-[760px]:grid-cols-1">
          <RecruitmentActivityCard />
          <ActivePositionsCard />
          <PendingAssetRequestCard />
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-2 gap-6 max-[760px]:grid-cols-1">
          <UpcomingActivitiesCard />
          <LeaveRequestCard />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default HRDashboard