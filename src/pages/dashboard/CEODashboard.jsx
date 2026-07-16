import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../context/UserContext'
import DashboardLayout from '../../layouts/DashboardLayout'
import StatCard from '../../components/ui/StatCard'
import ListSectionCard from '../../components/ui/ListSectionCard'

const departmentPerformance = [
  { name: 'HR Department', percentage: 70 },
  { name: 'LINUX', percentage: 80 },
  { name: 'Engineering', percentage: 75 },
  { name: 'Backend', percentage: 65 },
  { name: 'Others', percentage: 60 },
]

const projectStatus = [
  { name: 'IMS Software', status: 'Doing Progress' },
  { name: 'HRMS Software', status: 'Doing Progress' },
  { name: 'Website Redesigning', status: 'Doing Progress' },
]

const hiringOverview = [
  { label: 'Application Received', count: '(100)' },
  { label: 'Shortlisted', count: '(40)' },
  { label: 'Interview Scheduled', count: '(20)' },
  { label: 'Other Scheduled', count: '(10)' },
  { label: 'Joined', count: '(3)' },
  { label: 'Rejected Candidates', count: '(5)' },
]

const upcomingInterviews = [
  { name: 'Interview Scheduled', time: '8:31 AM', date: 'Tomorrow at 09:00 AM' },
  { name: 'Interview Scheduled', time: '9:30 PM', date: 'Tomorrow at 09:30 AM' },
  { name: 'Interview Scheduled', time: '10:00 AM', date: 'Tomorrow at 10:00 AM' },
]

const upcomingMeetings = [
  { name: 'Meeting Scheduled', time: '10:00 PM', status: 'Next Meeting' },
  { name: 'Meeting Scheduled', time: '12:30 PM', status: 'Next Meeting' },
  { name: 'Meeting Scheduled', time: '02:00 PM', status: 'Next Meeting' },
  { name: 'EOD Scheduled', time: '5:45 PM', status: 'EOD End of Day' },
]

const leaveRequests = [
  { name: 'Rajesh Singh', type: 'Personal Leave', days: '7 Days' },
  { name: 'Aman Dev', type: 'Medical Leave', days: '1 Day' },
  { name: 'Arpit Bhatt', type: 'Emergency Leave', days: '8 Days' },
  { name: 'Radhika Mishra', type: 'Marriage Leave', days: '1 week' },
]

function CEODashboard() {
  const { user } = useContext(UserContext)
  const navigate = useNavigate()
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [hasCheckedOut, setHasCheckedOut] = useState(false)
  const [checkInTime, setCheckInTime] = useState(null)
  const [checkOutTime, setCheckOutTime] = useState(null)

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
    setCheckOutTime(null)
    setHasCheckedOut(false)
    setIsCheckedIn(true)
  }

  const handleCheckOut = () => {
    const now = new Date()
    const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    setCheckOutTime(timeString)
    setIsCheckedIn(false)
    setHasCheckedOut(true)
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[36px] font-black text-[#111827] mb-2">{getGreeting()}, {user.name || 'CEO'}</h1>
            <p className="text-[16px] text-[#5f6679]">Welcome back to Jawam HR</p>
            <p className="text-[14px] text-[#5f6679] mt-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/employees')}
              className="px-6 py-2 rounded-full bg-[#3b82f6] text-white font-extrabold text-[14px] hover:bg-[#2563eb] transition-all"
            >
              Add Employee
            </button>
            <button
              type="button"
              onClick={isCheckedIn ? handleCheckOut : handleCheckIn}
              disabled={hasCheckedOut}
              title={
                hasCheckedOut
                  ? `Checked out at ${checkOutTime}`
                  : isCheckedIn
                  ? `Checked in at ${checkInTime}`
                  : 'Mark attendance'
              }
              className={`px-6 py-2 rounded-full font-extrabold text-[14px] transition-all ${
                hasCheckedOut
                  ? 'bg-[#e5e7eb] text-[#9ca3af] cursor-not-allowed'
                  : 'bg-[#3b82f6] text-white hover:bg-[#2563eb]'
              }`}
            >
              {hasCheckedOut ? 'Checked Out' : isCheckedIn ? 'Check Out' : 'Check In'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/projects')}
              className="px-6 py-2 rounded-full bg-white border-2 border-[#111827] text-[#111827] font-extrabold text-[14px] hover:bg-[#f9fafb] transition-all"
            >
              Create Invoice
            </button>
            <button
              type="button"
              onClick={() => navigate('/reports')}
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
            value="95%"
            valueColor="#10b981"
            rows={[
              { label: 'Present', value: '95' },
              { label: 'Absent', value: '5' },
              { label: 'Late', value: '2' },
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
          <ListSectionCard title="Department Performance" footerText="View Employee Score">
            <div className="space-y-4">
              {departmentPerformance.map((dept) => (
                <div key={dept.name}>
                  <div className="flex justify-between mb-2">
                    <p className="text-[14px] font-semibold text-[#111827]">{dept.name}</p>
                    <p className="text-[14px] font-semibold text-[#111827]">{dept.percentage}%</p>
                  </div>
                  <div className="w-full h-3 bg-[#e5e7eb] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#3b82f6] to-[#10b981]"
                      style={{ width: `${dept.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ListSectionCard>

          <ListSectionCard title="Project Status" footerText="View All Announcement">
            <div className="space-y-4">
              {projectStatus.map((project) => (
                <div key={project.name} className="pb-4 border-b border-[#e5e7eb] last:border-0">
                  <p className="text-[14px] font-semibold text-[#111827]">{project.name}</p>
                  <p className="text-[12px] text-[#6b7280] mt-1">{project.status}</p>
                </div>
              ))}
            </div>
          </ListSectionCard>
        </div>

        {/* Hiring Overview & Expenses Overview */}
        <div className="grid grid-cols-2 gap-6 max-[1220px]:grid-cols-1">
          <ListSectionCard title="Hiring Overview" footerText="View Expenses Report">
            <div className="space-y-3">
              {hiringOverview.map((item) => (
                <div key={item.label} className="flex justify-between items-center pb-3 border-b border-[#e5e7eb] last:border-0">
                  <p className="text-[14px] text-[#111827]">{item.label}</p>
                  <p className="text-[14px] font-semibold text-[#6b7280]">{item.count}</p>
                </div>
              ))}
            </div>
          </ListSectionCard>

          <ListSectionCard title="Expenses Overview" footerText="View Expenses Report">
            <div className="flex items-center justify-center">
              <div className="relative w-[200px] h-[200px]">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#f59e0b" strokeWidth="8" strokeDasharray="94.25 282.7" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#ef4444" strokeWidth="8" strokeDasharray="47.12 282.7" strokeDashoffset="-94.25" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#3b82f6" strokeWidth="8" strokeDasharray="47.12 282.7" strokeDashoffset="-141.37" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#10b981" strokeWidth="8" strokeDasharray="94.25 282.7" strokeDashoffset="-188.49" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <p className="text-[24px] font-black text-[#111827]">100%</p>
                </div>
              </div>
            </div>
            <div className="mt-6 space-y-2 text-[12px]">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#f59e0b]"></span><span>Electricity</span><span className="text-[#6b7280]">₹10,00,00</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#ef4444]"></span><span>Rent</span><span className="text-[#6b7280]">₹7,50,00</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#3b82f6]"></span><span>Internet</span><span className="text-[#6b7280]">₹4,00,00</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#10b981]"></span><span>Water</span><span className="text-[#6b7280]">₹1,50,00</span></div>
            </div>
          </ListSectionCard>
        </div>

        {/* Upcoming Interviews & Upcoming Meetings */}
        <div className="grid grid-cols-2 gap-6 max-[1220px]:grid-cols-1">
          <ListSectionCard title="Upcoming Interviews" footerText="View All Interviews">
            <div className="space-y-3">
              {upcomingInterviews.map((interview, idx) => (
                <div key={idx} className="pb-3 border-b border-[#e5e7eb] last:border-0">
                  <p className="text-[14px] font-semibold text-[#111827]">{interview.name}</p>
                  <p className="text-[12px] text-[#6b7280] mt-1">{interview.date}</p>
                </div>
              ))}
            </div>
          </ListSectionCard>

          <ListSectionCard title="Upcoming Meetings" footerText="Check Calendar">
            <div className="space-y-3">
              {upcomingMeetings.map((meeting, idx) => (
                <div key={idx} className="flex justify-between items-start pb-3 border-b border-[#e5e7eb] last:border-0">
                  <div>
                    <p className="text-[14px] font-semibold text-[#111827]">{meeting.name}</p>
                    <p className="text-[12px] text-[#6b7280] mt-1">{meeting.time}</p>
                  </div>
                  <p className="text-[12px] text-[#6b7280]">{meeting.status}</p>
                </div>
              ))}
            </div>
          </ListSectionCard>
        </div>

        {/* Leave Request */}
        <ListSectionCard title="Leave Request" footerText="View all Leave Request (5)">
          <div className="space-y-3">
            {leaveRequests.map((leave, idx) => (
              <div key={idx} className="flex justify-between items-start pb-3 border-b border-[#e5e7eb] last:border-0">
                <div>
                  <p className="text-[14px] font-semibold text-[#111827]">{leave.name}</p>
                  <p className="text-[12px] text-[#6b7280]">{leave.type}</p>
                </div>
                <p className="text-[12px] text-[#6b7280]">{leave.days}</p>
              </div>
            ))}
          </div>
        </ListSectionCard>
      </div>
    </DashboardLayout>
  )
}

export default CEODashboard