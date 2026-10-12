import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../../../context/UserContext.jsx'
import usePendingLeaveRequests from '../../../hooks/usePendingLeaveRequests.js'
import AttendanceTodayCard from './cards/AttendanceTodayCard.jsx'
import PendingLeaveRequestCard from './cards/PendingLeaveRequestCard.jsx'
import PendingWorkUpdatesCard from './cards/PendingWorkUpdatesCard.jsx'
import ActiveProjectsCard from './cards/ActiveProjectsCard.jsx'
import TeamPerformanceCard from './cards/TeamPerformanceCard.jsx'
import UpcomingTeamEventsCard from './cards/UpcomingTeamEventsCard.jsx'
import UpcomingDeadlinesCard from './cards/UpcomingDeadlinesCard.jsx'
import TeamLeaderTodaysTasksCard from './cards/TeamLeaderTodaysTasksCard.jsx'
import LeaveRequestCard from './cards/LeaveRequestCard.jsx'

function TeamLeaderDashboardContent() {
  const navigate = useNavigate()
  const { user } = useContext(UserContext)
  const { requests, totalCount, loading } = usePendingLeaveRequests()

  const getGreeting = () => {
    const hour = new Date().getHours()

    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'

    return 'Good evening'
  }

  return (
    <div className="space-y-8">
      {/* Team Leader Header */}
      <div className="flex items-center justify-between gap-6 flex-wrap">
        <div>
          <h1 className="text-[36px] font-black text-[#111827] mb-2">
            {getGreeting()}, {user?.name || 'User'}
          </h1>

          <p className="text-[16px] text-[#5f6679] mb-2">
            Welcome back to Jawam HR
          </p>

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

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-6 max-[1220px]:grid-cols-2 max-[760px]:grid-cols-1">
        <AttendanceTodayCard />
        <PendingLeaveRequestCard totalCount={totalCount} loading={loading} />
        <PendingWorkUpdatesCard />
        <ActiveProjectsCard />
      </div>

      {/* Team Overview */}
      <div className="grid grid-cols-3 gap-6 max-[1220px]:grid-cols-2 max-[760px]:grid-cols-1">
        <TeamPerformanceCard />
        <UpcomingTeamEventsCard />
        <UpcomingDeadlinesCard />
      </div>

      {/* Team Tasks & Leave */}
      <div className="grid grid-cols-2 gap-6 max-[760px]:grid-cols-1">
        <TeamLeaderTodaysTasksCard />
        <LeaveRequestCard
          requests={requests}
          totalCount={totalCount}
          loading={loading}
        />
      </div>
    </div>
  )
}

export default TeamLeaderDashboardContent