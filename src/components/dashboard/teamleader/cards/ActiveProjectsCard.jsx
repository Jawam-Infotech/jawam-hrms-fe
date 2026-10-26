import { useState, useEffect, useMemo, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardCard from '../../common/DashboardCard.jsx'
import { UserContext } from '../../../../context/UserContext.jsx'

const STORAGE_KEY = 'jawam_projects_state_v1'

function ActiveProjectsCard() {
  const navigate = useNavigate()
  const { user } = useContext(UserContext)

  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    const handleSync = () => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) setProjects(JSON.parse(saved))
      } catch (e) {
        console.error('Error syncing projects in ActiveProjectsCard', e)
      }
    }
    window.addEventListener('storage', handleSync)
    window.addEventListener('focus', handleSync)
    return () => {
      window.removeEventListener('storage', handleSync)
      window.removeEventListener('focus', handleSync)
    }
  }, [])

  const activeProjects = useMemo(() => {
    const uName = (user?.name || '').trim().toLowerCase()
    return projects.filter((p) => {
      if (p.status !== 'ACTIVE' && p.status !== undefined) return false
      if (!uName) return true
      const isLead = (p.teamLead || '').toLowerCase().includes(uName)
      const isCreator = (p.createdBy || '').toLowerCase().includes(uName)
      const isMember = (p.members || []).some((m) => (m.name || '').toLowerCase().includes(uName))
      return isLead || isCreator || isMember
    })
  }, [projects, user])

  const runningCount = activeProjects.length
  const nearDeadlineCount = useMemo(() => {
    return activeProjects.filter((p) => p.priority === 'High' || p.priority === 'Urgent').length
  }, [activeProjects])

  return (
    <DashboardCard>
      <div
        role="button"
        tabIndex={0}
        onClick={() => navigate('/projects')}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            navigate('/projects')
          }
        }}
        className="cursor-pointer"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-full bg-[#f0fdf4] flex items-center justify-center text-[24px]">
            📁
          </div>

          <div>
            <h3 className="text-[16px] font-extrabold text-[#111827]">
              Active Projects
            </h3>

            <p className="text-[14px] font-extrabold text-[#3b82f6]">
              {runningCount} {runningCount === 1 ? 'Project' : 'Projects'}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between">
            <p className="text-[12px] text-[#5f6679]">Running</p>
            <p className="text-[14px] font-semibold text-[#111827]">{runningCount}</p>
          </div>

          <div className="flex justify-between">
            <p className="text-[12px] text-[#5f6679]">High Priority</p>
            <p className="text-[14px] font-semibold text-[#111827]">{nearDeadlineCount}</p>
          </div>
        </div>
      </div>
    </DashboardCard>
  )
}

export default ActiveProjectsCard
