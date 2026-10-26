import { useNavigate } from 'react-router-dom'
import StatusBadge from '../../ui/StatusBadge.jsx'
import ProjectProgressBar from '../ui/ProjectProgressBar.jsx'

function ProjectCard({ project }) {
  const navigate = useNavigate()

  const priorityColor = {
    high: 'bg-[#fee2e2] text-[#b91c1c]',
    medium: 'bg-[#fef3c7] text-[#b45309]',
    low: 'bg-[#d1fae5] text-[#059669]',
  }[String(project.priority || '').toLowerCase()] || 'bg-[#f3f4f6] text-[#374151]'

  const isSolo = project.staffingMode === 'SOLO' || project.isSoloProject

  return (
    <div className="flex flex-col justify-between rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm transition hover:shadow-md">
      <div>
        {/* Top Header: Title & Priority */}
        <div className="flex items-start justify-between gap-3 pb-3">
          <div>
            <h3 className="text-[18px] font-black text-[#111827]">{project.title}</h3>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <StatusBadge status={project.status || 'PLANNED'} />
              <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                isSolo ? 'bg-[#ede9fe] text-[#7c3aed]' : 'bg-[#e0f2fe] text-[#0369a1]'
              }`}>
                {isSolo
                  ? (project.members?.length > 1 || project.membersCount > 1)
                    ? 'Independent Squad'
                    : 'Solo Project'
                  : 'Team Project'}
              </span>
            </div>
          </div>
          <span className={`rounded-full px-3 py-1 text-[12px] font-semibold ${priorityColor}`}>
            {project.priority || 'Medium'}
          </span>
        </div>

        <div className="border-t border-[#f1f5f9] my-3" />

        {/* Project Meta Information */}
        <div className="space-y-2 text-[14px] text-[#6b7280]">
          <p className="flex items-center justify-between">
            <span className="font-semibold text-[#374151]">Project Lead / PM:</span>
            <span className="font-medium text-[#111827]">
              {isSolo ? 'CEO Oversight' : (project.primaryPm || project.teamLead || 'Unassigned')}
            </span>
          </p>
          <p className="flex items-center justify-between">
            <span className="font-semibold text-[#374151]">Target End Date:</span>
            <span className="text-[#111827]">{project.dueDate || project.targetEndDate || 'TBD'}</span>
          </p>
          <p className="flex items-center justify-between">
            <span className="font-semibold text-[#374151]">Total Members:</span>
            <span className="text-[#111827]">{project.membersCount || project.members?.length || 1}</span>
          </p>
        </div>

        {/* Mathematical Progress Bar (Excluding CANCELLED from denominator) */}
        <div className="mt-5">
          {(() => {
            const nonCancelledTasks = project.tasks
              ? project.tasks.filter((t) => t.status !== 'CANCELLED')
              : null
            const completedCount = nonCancelledTasks
              ? nonCancelledTasks.filter((t) => t.status === 'COMPLETED').length
              : (project.completedTasksCount || 0)
            const activeCount = nonCancelledTasks
              ? nonCancelledTasks.length
              : (project.activeTasksCount || (project.tasks ? project.tasks.length : 0))

            return (
              <ProjectProgressBar
                completedTasks={completedCount}
                totalActiveTasks={activeCount}
                explicitPercentage={project.progress}
                size="md"
              />
            )
          })()}
        </div>
      </div>

      {/* Footer Action */}
      <div className="mt-6 border-t border-[#f1f5f9] pt-4 flex items-center justify-between">
        <span className="text-xs text-[#9ca3af]">
          {project.openTasksCount ?? 0} active tasks remaining
        </span>
        <button
          type="button"
          onClick={() => navigate(`/projects/${project.id}`)}
          className="inline-flex items-center gap-1 text-[14px] font-bold text-[#2563eb] transition hover:text-[#1d4ed8] hover:underline"
        >
          View Workspace →
        </button>
      </div>
    </div>
  )
}

export default ProjectCard
