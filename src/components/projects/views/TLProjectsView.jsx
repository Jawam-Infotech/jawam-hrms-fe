import { useState } from 'react'
import ProjectCard from '../cards/ProjectCard.jsx'
import StatusBadge from '../../ui/StatusBadge.jsx'

function TLProjectsView({
  projects = [],
  teamReviews = [],
  tcrReviews = [],
  myTasks = [],
  canCreateProject = false,
  tlProjectRequests = [],
  onOpenCreateModal,
  onOpenUpdateModal,
  onOpenApprovalModal,
  onOpenChangeReviewModal,
  onOpenRequestModal,
}) {
  const [filter, setFilter] = useState('ALL')
  const [approvedBanner, setApprovedBanner] = useState(() => {
    try {
      const saved = localStorage.getItem('jawam_tl_latest_approved_project_v1')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const pendingRequest = (tlProjectRequests || []).find(
    (r) => r.status === 'PENDING_CEO_APPROVAL'
  )

  const handleDismissApprovedBanner = () => {
    setApprovedBanner(null)
    try {
      localStorage.removeItem('jawam_tl_latest_approved_project_v1')
    } catch (e) {
      console.error(e)
    }
  }

  const filteredProjects = projects.filter((p) => {
    if (filter === 'ALL') return true
    return p.status === filter
  })

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[30px] font-black text-[#111827]">Team Projects &amp; Review Workspace</h1>
          <p className="text-[14px] text-[#5f6679] mt-1">
            Oversee team deliverables, evaluate 100% completion requests, and track sprint execution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {canCreateProject ? (
            <button
              type="button"
              onClick={onOpenCreateModal}
              className="rounded-full bg-[#2563eb] px-6 py-2.5 text-[14px] font-bold text-white shadow hover:bg-[#1d4ed8]"
            >
              + Create Project (Permitted)
            </button>
          ) : pendingRequest ? (
            <button
              type="button"
              disabled
              className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-5 py-2.5 text-[14px] font-bold text-amber-800 cursor-not-allowed shadow-xs"
              title={`Project request for "${pendingRequest.projectName}" is pending CEO approval`}
            >
              <span>⏳</span> Project Request Sent
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenRequestModal}
              className="inline-flex items-center gap-2 rounded-full border border-[#7c3aed] bg-[#f5f3ff] px-5 py-2.5 text-[14px] font-bold text-[#7c3aed] hover:bg-[#ede9fe]"
            >
              📋 Request Project Creation
            </button>
          )}
        </div>
      </div>

      {/* 1. Approved Project Alert Banner */}
      {approvedBanner && (
        <div className="flex items-center justify-between rounded-2xl border border-emerald-300 bg-emerald-50/95 p-4 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-xl flex-shrink-0">
              🎉
            </div>
            <div>
              <p className="text-[15px] font-bold text-emerald-950">
                Project Request Approved by CEO!
              </p>
              <p className="text-xs text-emerald-800 mt-0.5">
                CEO Gaurav Pandey accepted your request for <strong className="font-bold">"{approvedBanner.projectName}"</strong>. It has been created and is active in your team workspace below!
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDismissApprovedBanner}
            className="rounded-full p-1.5 text-emerald-700 hover:bg-emerald-100 transition"
            title="Dismiss notification"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Pending Request Alert Banner */}
      {pendingRequest && (
        <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50/80 p-4 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-xl flex-shrink-0">
              ⏳
            </div>
            <div>
              <p className="text-[14px] font-bold text-amber-950">
                Project Request Sent: "{pendingRequest.projectName}"
              </p>
              <p className="text-xs text-amber-800 mt-0.5">
                Your request has been submitted to CEO Gaurav Pandey for review and approval.
              </p>
            </div>
          </div>
          <span className="rounded-full bg-amber-200/80 px-3 py-1 text-xs font-bold text-amber-900 border border-amber-300">
            Pending CEO Decision
          </span>
        </div>
      )}


      {/* KPI Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[20px] border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase text-[#6b7280]">Team Projects</p>
          <p className="mt-2 text-[28px] font-black text-[#2563eb]">{projects.length}</p>
          <p className="text-xs text-[#9ca3af] mt-1">Under your leadership/contribution</p>
        </div>

        <div className="rounded-[20px] border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase text-[#b45309]">Pending Deliverables</p>
          <p className="mt-2 text-[28px] font-black text-[#f59e0b]">{teamReviews.length}</p>
          <p className="text-xs text-[#9ca3af] mt-1">100% deliverables requiring TL sign-off</p>
        </div>

        <div className="rounded-[20px] border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase text-[#c2410c]">Task-Change Requests</p>
          <p className="mt-2 text-[28px] font-black text-[#ea580c]">{tcrReviews.length}</p>
          <p className="text-xs text-[#9ca3af] mt-1">Deletion, extension, or reassignment requests</p>
        </div>

        <div className="rounded-[20px] border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase text-[#6b7280]">My Own Tasks</p>
          <p className="mt-2 text-[28px] font-black text-[#10b981]">{myTasks.length}</p>
          <p className="text-xs text-[#9ca3af] mt-1">Assigned directly to you</p>
        </div>
      </div>

      {/* Task-Change Requests (TCR) Queue */}
      {tcrReviews.length > 0 && (
        <div className="rounded-[24px] border border-[#ffedd5] bg-[#fff7ed] p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-[#fed7aa]">
            <div>
              <h2 className="text-[18px] font-black text-[#9a3412]">Task-Change Requests Awaiting TL Review</h2>
              <p className="text-xs text-[#c2410c]">Evaluate member scope changes, deadline extensions, or deletion requests before recommending to CEO for final decision.</p>
            </div>
            <span className="rounded-full bg-[#ffedd5] px-3 py-1 text-xs font-bold text-[#c2410c] border border-[#fed7aa]">
              {tcrReviews.length} Pending
            </span>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-[14px]">
              <thead>
                <tr className="border-b border-[#fed7aa] text-[#9a3412]">
                  <th className="py-2.5 font-bold">Task</th>
                  <th className="py-2.5 font-bold">Project</th>
                  <th className="py-2.5 font-bold">Requester</th>
                  <th className="py-2.5 font-bold">Request Type</th>
                  <th className="py-2.5 font-bold">Reason</th>
                  <th className="py-2.5 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#fed7aa]/60">
                {tcrReviews.map((t) => (
                  <tr key={t.id}>
                    <td className="py-3 font-semibold text-[#111827]">{t.name}</td>
                    <td className="py-3 text-[#4b5563]">{t.projectTitle}</td>
                    <td className="py-3 font-bold text-[#111827]">{t.changeRequest?.requester || t.assignee}</td>
                    <td className="py-3">
                      <span className="rounded-full bg-[#ffedd5] border border-[#fed7aa] px-2.5 py-0.5 text-xs font-bold text-[#9a3412]">
                        {t.changeRequest?.type === 'DEADLINE_EXTENSION'
                          ? 'Deadline Extension'
                          : t.changeRequest?.type === 'TASK_DELETION'
                            ? 'Task Deletion'
                            : 'Reassignment'}
                      </span>
                    </td>
                    <td className="py-3 text-xs text-[#6b7280] max-w-xs truncate">
                      {t.changeRequest?.reason || 'No reason provided'}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => onOpenChangeReviewModal(t)}
                        className="rounded-full bg-[#ea580c] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#c2410c] shadow-sm"
                      >
                        Review TCR
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Dedicated Team Review Queue */}
      {teamReviews.length > 0 ? (
        <div className="rounded-[24px] border border-[#fef3c7] bg-[#fffbeb] p-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-[#fde68a]">
            <div>
              <h2 className="text-[18px] font-black text-[#92400e]">Team Deliverables Awaiting TL Review</h2>
              <p className="text-xs text-[#b45309]">Review proof-of-work before recommending to Project Manager for final sign-off</p>
            </div>
            <span className="rounded-full bg-[#fef3c7] px-3 py-1 text-xs font-bold text-[#b45309] border border-[#fde68a]">
              {teamReviews.length} To Review
            </span>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-[14px]">
              <thead>
                <tr className="border-b border-[#fde68a] text-[#92400e]">
                  <th className="py-2.5 font-bold">Task</th>
                  <th className="py-2.5 font-bold">Project</th>
                  <th className="py-2.5 font-bold">Team Member</th>
                  <th className="py-2.5 font-bold">Deliverable Proof</th>
                  <th className="py-2.5 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#fef3c7]/60">
                {teamReviews.map((t) => (
                  <tr key={t.id}>
                    <td className="py-3 font-semibold text-[#111827]">{t.name}</td>
                    <td className="py-3 text-[#4b5563]">{t.projectTitle}</td>
                    <td className="py-3 font-bold text-[#111827]">{t.assignee}</td>
                    <td className="py-3">
                      {t.deliverable ? (
                        <span className="rounded-full bg-[#ecfdf5] px-2.5 py-0.5 text-xs font-semibold text-[#059669]">
                          ✓ {t.deliverable.type === 'LINK' ? 'URL Attached' : 'File Attached'}
                        </span>
                      ) : (
                        <span className="text-xs text-[#9ca3af]">No proof</span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        type="button"
                        onClick={() => onOpenApprovalModal(t)}
                        className="rounded-full bg-[#10b981] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#059669]"
                      >
                        Review &amp; Decide
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-[20px] border border-[#e5e7eb] bg-[#f8fafc] p-4 text-center text-xs text-[#6b7280]">
          ✓ All team deliverables are up to date. Zero reviews pending.
        </div>
      )}

      {/* Projects Grid */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e5e7eb] pb-3">
          <div className="flex items-center gap-2">
            {['ALL', 'ACTIVE', 'PLANNED', 'COMPLETED'].map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setFilter(t)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                  filter === t
                    ? 'bg-[#111827] text-white shadow-sm'
                    : 'bg-[#f1f5f9] text-[#6b7280] hover:bg-[#e2e8f0]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <span className="text-xs text-[#6b7280]">{filteredProjects.length} projects</span>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
          {filteredProjects.length === 0 && (
            <div className="col-span-full py-10 text-center text-xs text-[#9ca3af]">
              No projects found for this status.
            </div>
          )}
        </div>
      </div>

      {/* TL Personal Tasks */}
      {myTasks.length > 0 && (
        <div className="rounded-[28px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
          <h2 className="text-[18px] font-black text-[#111827] mb-3">Tasks Assigned Directly to You</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-[14px]">
              <thead>
                <tr className="border-b border-[#e5e7eb] text-[#6b7280]">
                  <th className="px-4 py-3 font-semibold">Task Name</th>
                  <th className="px-4 py-3 font-semibold">Project</th>
                  <th className="px-4 py-3 font-semibold">Progress</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {myTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-[#f8fafc]">
                    <td className="px-4 py-3 font-bold text-[#111827]">{task.name}</td>
                    <td className="px-4 py-3 text-[#4b5563]">{task.projectTitle}</td>
                    <td className="px-4 py-3 font-semibold text-[#111827]">{task.progress || 0}%</td>
                    <td className="px-4 py-3"><StatusBadge status={task.status} /></td>
                    <td className="px-4 py-3 text-right">
                      {task.status !== 'COMPLETED' ? (
                        <button
                          type="button"
                          onClick={() => onOpenUpdateModal(task)}
                          className="rounded-full bg-[#eff6ff] px-3.5 py-1 text-xs font-bold text-[#2563eb] hover:bg-[#dbeafe]"
                        >
                          Update Progress
                        </button>
                      ) : (
                        <span className="text-xs font-bold text-[#059669]">✓ Completed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default TLProjectsView
