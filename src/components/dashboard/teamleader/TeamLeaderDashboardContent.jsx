import { useContext, useState, useEffect, useMemo } from 'react'
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

const PROJECTS_STORAGE_KEY = 'jawam_projects_state_v1'
const TL_REQUESTS_KEY = 'jawam_tl_project_requests_v1'
const TL_APPROVED_ALERT_KEY = 'jawam_tl_latest_approved_project_v1'

function TeamLeaderDashboardContent() {
  const navigate = useNavigate()
  const { user } = useContext(UserContext)
  const { requests, totalCount, loading } = usePendingLeaveRequests()

  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem(PROJECTS_STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [hasPendingRequest, setHasPendingRequest] = useState(() => {
    try {
      const saved = localStorage.getItem(TL_REQUESTS_KEY)
      if (saved) {
        const list = JSON.parse(saved)
        return Array.isArray(list) && list.some((r) => r.status === 'PENDING_CEO_APPROVAL')
      }
    } catch {
      return false
    }
    return false
  })

  const [approvedAlert, setApprovedAlert] = useState(() => {
    try {
      const saved = localStorage.getItem(TL_APPROVED_ALERT_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  // Synchronize on storage / window focus
  useEffect(() => {
    const handleSync = () => {
      try {
        const savedProjs = localStorage.getItem(PROJECTS_STORAGE_KEY)
        if (savedProjs) setProjects(JSON.parse(savedProjs))

        const savedReqs = localStorage.getItem(TL_REQUESTS_KEY)
        if (savedReqs) {
          const list = JSON.parse(savedReqs)
          setHasPendingRequest(Array.isArray(list) && list.some((r) => r.status === 'PENDING_CEO_APPROVAL'))
        } else {
          setHasPendingRequest(false)
        }

        const savedAlert = localStorage.getItem(TL_APPROVED_ALERT_KEY)
        setApprovedAlert(savedAlert ? JSON.parse(savedAlert) : null)
      } catch (e) {
        console.error('Error syncing TL dashboard', e)
      }
    }

    window.addEventListener('storage', handleSync)
    window.addEventListener('focus', handleSync)
    return () => {
      window.removeEventListener('storage', handleSync)
      window.removeEventListener('focus', handleSync)
    }
  }, [])

  const myTeamProjects = useMemo(() => {
    const uName = (user?.name || '').trim().toLowerCase()
    return projects.filter((p) => {
      if (p.status === 'ARCHIVED' || p.status === 'CANCELLED') return false
      if (!uName) return true
      const isLead = (p.teamLead || '').toLowerCase().includes(uName)
      const isCreator = (p.createdBy || '').toLowerCase().includes(uName)
      const isMember = (p.members || []).some((m) => (m.name || '').toLowerCase().includes(uName))
      return isLead || isCreator || isMember
    })
  }, [projects, user])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const handleDismissApprovedAlert = () => {
    setApprovedAlert(null)
    try {
      localStorage.removeItem(TL_APPROVED_ALERT_KEY)
    } catch (e) {
      console.error(e)
    }
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
            className="px-6 py-2 rounded-full bg-white border-2 border-[#111827] text-[#111827] font-extrabold text-[14px] hover:bg-[#f9fafb] transition-all shadow-xs"
          >
            Assign Task
          </button>

          {hasPendingRequest ? (
            <button
              type="button"
              onClick={() => navigate('/projects')}
              className="px-5 py-2 rounded-full bg-amber-50 border-2 border-amber-400 text-amber-800 font-extrabold text-[14px] hover:bg-amber-100 transition-all flex items-center gap-2 shadow-xs"
              title="Your project request has been sent to the CEO for approval"
            >
              <span>⏳</span> Project Request Sent
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/projects')}
              className="px-6 py-2 rounded-full bg-white border-2 border-[#111827] text-[#111827] font-extrabold text-[14px] hover:bg-[#f9fafb] transition-all shadow-xs"
            >
              Create Project
            </button>
          )}
        </div>
      </div>

      {/* CEO Approved Project Announcement Banner */}
      {approvedAlert && (
        <div className="flex items-center justify-between rounded-2xl border border-emerald-300 bg-emerald-50 px-6 py-4 text-emerald-950 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-2xl flex-shrink-0">
              🎉
            </div>
            <div>
              <p className="text-[16px] font-bold text-emerald-950">
                Project Approved by CEO!
              </p>
              <p className="text-xs text-emerald-800 mt-0.5">
                CEO Gaurav Pandey accepted your request for <strong className="font-bold">"{approvedAlert.projectName}"</strong>. It is now active on your dashboard and ready in your workspace!
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/projects')}
              className="rounded-full bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition shadow-sm"
            >
              Open in Projects Workspace →
            </button>
            <button
              type="button"
              onClick={handleDismissApprovedAlert}
              className="rounded-full p-1.5 text-emerald-700 hover:bg-emerald-100 transition"
              title="Dismiss"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-6 max-[1220px]:grid-cols-2 max-[760px]:grid-cols-1">
        <AttendanceTodayCard />
        <PendingLeaveRequestCard totalCount={totalCount} loading={loading} />
        <PendingWorkUpdatesCard />
        <ActiveProjectsCard />
      </div>

      {/* Active Team Projects Section */}
      <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-[#f1f5f9]">
          <div>
            <h2 className="text-[18px] font-black text-[#111827]">My Team Projects &amp; Initiatives</h2>
            <p className="text-xs text-[#6b7280] mt-0.5">Projects under your leadership or active assignment</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/projects')}
            className="text-xs font-bold text-[#2563eb] hover:underline"
          >
            View All in Workspace →
          </button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {myTeamProjects.map((p) => {
            const activeTasks = (p.tasks || []).filter((t) => t.status !== 'CANCELLED')
            const completed = activeTasks.filter((t) => t.status === 'COMPLETED').length
            const pct = activeTasks.length > 0 ? Math.round((completed / activeTasks.length) * 100) : 0

            return (
              <div
                key={p.id}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/projects/${p.id}`)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    navigate(`/projects/${p.id}`)
                  }
                }}
                className="rounded-2xl border border-[#e5e7eb] p-5 hover:border-[#2563eb] hover:shadow-md transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-[15px] text-[#111827] line-clamp-1">{p.title}</h3>
                    <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200 shrink-0">
                      {p.status || 'ACTIVE'}
                    </span>
                  </div>

                  <p className="text-xs text-[#64748b] mt-1 line-clamp-2 leading-relaxed">
                    {p.description || 'Enterprise team initiative.'}
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-xs text-[#6b7280]">
                    <span className="rounded bg-slate-100 px-2 py-0.5 font-semibold text-slate-700 text-[10px]">
                      {p.staffingMode === 'SOLO' ? 'Solo Contributor' : 'Standard Team'}
                    </span>
                    <span>•</span>
                    <span className="text-[11px]">Due: {p.dueDate || '30/12/2026'}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#f1f5f9]">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-medium text-[#64748b]">Sprint Progress</span>
                    <span className="font-bold text-[#111827]">{pct}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#10b981] transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}

          {myTeamProjects.length === 0 && (
            <div className="col-span-full py-8 text-center text-xs text-slate-400">
              No active team projects currently found.
            </div>
          )}
        </div>
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
