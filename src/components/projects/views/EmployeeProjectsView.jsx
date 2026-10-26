import { useState } from 'react'
import ProjectCard from '../cards/ProjectCard.jsx'
import StatusBadge from '../../ui/StatusBadge.jsx'

function EmployeeProjectsView({
  projects = [],
  myTasks = [],
  onOpenUpdateModal,
}) {
  const [dismissedWarnings, setDismissedWarnings] = useState(() => {
    try {
      const saved = localStorage.getItem('jawam_dismissed_risk_warnings')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Only trigger popup when task is CURRENTLY in rejected rework state (IN_PROGRESS),
  // has >= 3 rejections, and hasn't already been dismissed.
  const activeQualityRiskTask = myTasks.find(
    (t) =>
      t.status === 'IN_PROGRESS' &&
      (t.reworkCount || 0) >= 3 &&
      !dismissedWarnings.includes(`${t.id}_${t.reworkCount}`),
  )

  const handleDismissRisk = (task) => {
    const key = `${task.id}_${task.reworkCount}`
    const updated = [...dismissedWarnings, key]
    setDismissedWarnings(updated)
    try {
      localStorage.setItem('jawam_dismissed_risk_warnings', JSON.stringify(updated))
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="space-y-8">
      {/* Quality Risk Notification Pop-up Modal (>= 3 Rejections) */}
      {activeQualityRiskTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-[28px] bg-white p-6 shadow-2xl border-2 border-[#fca5a5]">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fee2e2] text-2xl text-[#dc2626]">
                ⚠
              </span>
              <div>
                <h3 className="text-lg font-black text-[#991b1b]">Quality Risk Warning</h3>
                <p className="text-xs text-[#6b7280]">Task: {activeQualityRiskTask.name}</p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-[#fed7aa] bg-[#fffbeb] p-4 text-xs text-[#9a3412]">
              <p className="font-bold text-[13px] text-[#b45309]">
                Task has undergone {activeQualityRiskTask.reworkCount} rejections. Schedule a sync meeting with the assignee before resubmission.
              </p>
              {activeQualityRiskTask.rejectionFeedback && (
                <p className="mt-2 text-xs text-[#78350f]">
                  <strong>Latest Reviewer Feedback:</strong> "{activeQualityRiskTask.rejectionFeedback}"
                </p>
              )}
            </div>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => handleDismissRisk(activeQualityRiskTask)}
                className="rounded-full bg-[#dc2626] px-5 py-2 text-xs font-bold text-white hover:bg-[#b91c1c] shadow"
              >
                I Understand, Will Schedule Sync
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Banner / Metrics */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-[20px] border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase text-[#6b7280]">My Joined Projects</p>
          <p className="mt-2 text-[28px] font-black text-[#2563eb]">{projects.length}</p>
          <p className="text-xs text-[#9ca3af] mt-1">Initiatives you are contributing to</p>
        </div>

        <div className="rounded-[20px] border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase text-[#6b7280]">My Active Tasks</p>
          <p className="mt-2 text-[28px] font-black text-[#10b981]">
            {myTasks.filter((t) => t.status !== 'COMPLETED' && t.status !== 'CANCELLED').length}
          </p>
          <p className="text-xs text-[#9ca3af] mt-1">In progress or awaiting approval</p>
        </div>

        <div className="rounded-[20px] border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase text-[#6b7280]">Completed Tasks</p>
          <p className="mt-2 text-[28px] font-black text-[#059669]">
            {myTasks.filter((t) => t.status === 'COMPLETED').length}
          </p>
          <p className="text-xs text-[#9ca3af] mt-1">Verified and signed off</p>
        </div>
      </div>

      {/* My Joined Projects */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[20px] font-black text-[#111827]">Your Active Projects</h2>
          <span className="text-xs text-[#6b7280]">{projects.length} accessible projects</span>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
          {projects.length === 0 && (
            <div className="col-span-full rounded-[24px] border border-dashed border-[#d1d5db] bg-white py-12 text-center">
              <p className="text-[15px] font-bold text-[#111827]">No projects assigned yet</p>
              <p className="mt-1 text-xs text-[#6b7280]">
                You will see projects here once your Team Leader or Project Manager adds you to a project team.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* My Assigned Tasks Workspace */}
      <div className="rounded-[28px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-[20px] font-black text-[#111827]">My Assigned Tasks</h2>
            <p className="text-xs text-[#6b7280] mt-0.5">Submit daily progress updates and proof-of-work deliverables</p>
          </div>
          <span className="rounded-full bg-[#f1f5f9] px-3 py-1 text-xs font-bold text-[#475569]">
            {myTasks.length} Total Tasks
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-[14px]">
            <thead>
              <tr className="border-b border-[#e5e7eb] text-[#6b7280]">
                <th className="px-4 py-3 font-semibold">Task Name</th>
                <th className="px-4 py-3 font-semibold">Project</th>
                <th className="px-4 py-3 font-semibold">Progress</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Due Date</th>
                <th className="px-4 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {myTasks.map((task) => {
                const isOverdue = (() => {
                  if (!task.dueDate || task.status === 'COMPLETED' || task.status === 'CANCELLED') return false
                  let due
                  if (task.dueDate.includes('/')) {
                    const parts = task.dueDate.split('/')
                    if (parts.length === 3) {
                      due = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]), 23, 59, 59)
                    }
                  } else if (task.dueDate.includes('-')) {
                    due = new Date(task.dueDate)
                    due.setHours(23, 59, 59, 999)
                  }
                  return due && !isNaN(due.getTime()) && due.getTime() < Date.now()
                })()

                return (
                <tr key={task.id} className="hover:bg-[#f8fafc] transition-colors">
                  <td className="px-4 py-3.5">
                    <p className="font-bold text-[#111827]">{task.name}</p>
                    {task.description && (
                      <p className="text-xs text-[#6b7280] truncate max-w-xs">{task.description}</p>
                    )}
                    {isOverdue && (
                      <div className="mt-1.5 inline-flex items-center gap-1 rounded-lg border border-[#fca5a5] bg-[#fff1f2] px-2 py-0.5 text-[11px] font-semibold text-[#991b1b]">
                        <span>⏰ Overdue:</span>
                        <span>Due date passed ({task.dueDate}). Please update progress.</span>
                      </div>
                    )}
                    {task.status === 'BLOCKED' && (
                      <div className="mt-1 rounded border border-[#fca5a5] bg-[#fff1f2] px-2 py-0.5 text-[10px] text-[#991b1b]">
                        <span className="font-bold">🛑 Blocked ({task.blocker?.category || 'Blocker'}):</span>{' '}
                        <span>{task.blocker?.reason || task.description || 'Blocker reported'}</span>
                      </div>
                    )}
                    {/* Active Rework Required (Only shown while currently in rework/IN_PROGRESS) */}
                    {task.status === 'IN_PROGRESS' && task.reworkCount > 0 && task.reworkCount < 3 && (
                      <div className="mt-1.5 rounded-lg border border-[#fed7aa] bg-[#fffbeb] p-2 text-xs text-[#9a3412]">
                        <span className="font-bold">❌ Rejected by TL ({task.reworkCount} {task.reworkCount === 1 ? 'time' : 'times'}):</span>{' '}
                        <span>{task.rejectionFeedback || 'Deliverable was rejected by reviewer. Progress set to 85%.'}</span>
                      </div>
                    )}
                    {task.status === 'IN_PROGRESS' && task.reworkCount >= 3 && (
                      <div className="mt-1.5 rounded-lg border border-[#fca5a5] bg-[#fff1f2] p-2 text-xs text-[#991b1b]">
                        <div className="flex items-center gap-1.5">
                          <span className="rounded bg-[#e11d48] px-2 py-0.5 text-[10px] font-bold text-white">
                            QUALITY RISK: {task.reworkCount} Rejections
                          </span>
                        </div>
                        <p className="mt-1 font-semibold text-[#be123c]">
                          Task has undergone {task.reworkCount} rejections. Schedule a sync meeting with the assignee before resubmission.
                        </p>
                        {task.rejectionFeedback && (
                          <p className="mt-0.5 text-[11px] text-[#7f1d1d]">
                            Latest feedback: "{task.rejectionFeedback}"
                          </p>
                        )}
                      </div>
                    )}

                    {/* Stage 1 Passed: TL Approved, Moving to PM */}
                    {task.status === 'PENDING_PM_APPROVAL' && (
                      <div className="mt-1.5 rounded-lg border border-[#bfdbfe] bg-[#eff6ff] p-2 text-xs text-[#1e40af]">
                        <span className="font-bold">✓ Stage 1 Passed:</span> Approved by TL (Shivani k). Waiting for PM final sign-off.
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-[#4b5563]">{task.projectTitle}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-16 rounded-full bg-[#f1f5f9] overflow-hidden">
                        <div
                          className={`h-full ${task.progress === 100 ? 'bg-[#10b981]' : 'bg-[#2563eb]'}`}
                          style={{ width: `${task.progress || 0}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-[#111827]">{task.progress || 0}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusBadge status={task.status} />
                  </td>
                  <td className="px-4 py-3.5 text-[#6b7280]">
                    <div className="flex items-center gap-1.5">
                      <span className={isOverdue ? 'font-bold text-[#dc2626]' : ''}>
                        {task.dueDate || 'No date'}
                      </span>
                      {isOverdue && (
                        <span className="rounded-full border border-[#fca5a5] bg-[#fff1f2] px-2 py-0.5 text-[10px] font-bold text-[#dc2626]">
                          OVERDUE
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-right">
                    {task.status !== 'COMPLETED' ? (
                      <button
                        type="button"
                        onClick={() => onOpenUpdateModal(task)}
                        className="rounded-full bg-[#eff6ff] px-4 py-1.5 text-xs font-bold text-[#2563eb] hover:bg-[#dbeafe]"
                      >
                        Update Progress
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-[#059669]">✓ Completed</span>
                    )}
                  </td>
                </tr>
              )
              })}
              {myTasks.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-xs text-[#9ca3af]">
                    You currently have no tasks assigned to you.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default EmployeeProjectsView
