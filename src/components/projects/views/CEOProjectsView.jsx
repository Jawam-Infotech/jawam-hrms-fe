import { useState } from 'react'
import ProjectCard from '../cards/ProjectCard.jsx'
import StatusBadge from '../../ui/StatusBadge.jsx'

function CEOProjectsView({
  projects = [],
  pendingClosures = [],
  directApprovals = [],
  tlProjectRequests = [],
  tcrReviews = [],
  onOpenCreateModal,
  onOpenApprovalModal,
  onOpenClosureModal,
  onOpenChangeReviewModal,
  onGrantTLPermission,
  onDenyTLRequest,
}) {
  const [filter, setFilter] = useState('ALL')

  const filteredProjects = projects.filter((p) => {
    if (filter === 'ALL') return true
    return p.status === filter
  })

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[30px] font-black text-[#111827]">Executive Projects Command Center</h1>
          <p className="text-[14px] text-[#5f6679] mt-1">
            Company-wide initiative governance, executive deliverable sign-offs, and project closures.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenCreateModal}
          className="inline-flex items-center gap-2 rounded-full bg-[#2563eb] px-6 py-2.5 text-[14px] font-bold text-white shadow-sm transition hover:bg-[#1d4ed8]"
        >
          + Create New Project
        </button>
      </div>

      {/* Executive KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
        <div className="rounded-[20px] border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase text-[#6b7280]">Total Active Initiatives</p>
          <p className="mt-2 text-[28px] font-black text-[#2563eb]">
            {projects.filter((p) => p.status === 'ACTIVE').length}
          </p>
          <p className="text-xs text-[#9ca3af] mt-1">Across all engineering and design teams</p>
        </div>

        <div className="rounded-[20px] border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase text-[#7c3aed]">Planned Initiatives</p>
          <p className="mt-2 text-[28px] font-black text-[#7c3aed]">
            {projects.filter((p) => p.status === 'PLANNED').length}
          </p>
          <p className="text-xs text-[#9ca3af] mt-1">Awaiting staffing activation gate</p>
        </div>

        <div className="rounded-[20px] border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase text-[#c2410c]">Pending Project Closures</p>
          <p className="mt-2 text-[28px] font-black text-[#ea580c]">{pendingClosures.length}</p>
          <p className="text-xs text-[#9ca3af] mt-1">100% completed deliverables awaiting CEO sign-off</p>
        </div>

        <div className="rounded-[20px] border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase text-[#b45309]">Executive Direct Approvals</p>
          <p className="mt-2 text-[28px] font-black text-[#f59e0b]">{directApprovals.length}</p>
          <p className="text-xs text-[#9ca3af] mt-1">Solo contributors &amp; PM self-tasks</p>
        </div>

        <div className="rounded-[20px] border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase text-[#6d28d9]">TL Creation Requests</p>
          <p className="mt-2 text-[28px] font-black text-[#7c3aed]">{tlProjectRequests.length}</p>
          <p className="text-xs text-[#9ca3af] mt-1">Team leaders requesting project creation permission</p>
        </div>

        <div className="rounded-[20px] border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase text-[#ea580c]">Task-Change Requests</p>
          <p className="mt-2 text-[28px] font-black text-[#ea580c]">{tcrReviews.length}</p>
          <p className="text-xs text-[#9ca3af] mt-1">Deletions, extensions &amp; reassignments</p>
        </div>
      </div>

      {/* CEO Executive Decision Hub */}
      {(pendingClosures.length > 0 || directApprovals.length > 0 || tlProjectRequests.length > 0 || tcrReviews.length > 0) && (
        <div className="space-y-6">
          {/* 1. Pending Project Closures */}
          {pendingClosures.length > 0 && (
            <div className="rounded-[24px] border border-[#ffedd5] bg-[#fff7ed] p-6 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#fed7aa]">
                <div>
                  <h2 className="text-[18px] font-black text-[#9a3412]">Projects Awaiting Executive Closure</h2>
                  <p className="text-xs text-[#c2410c]">All tasks are 100% approved. Official closure requires CEO verification.</p>
                </div>
                <span className="rounded-full bg-[#ffedd5] px-3 py-1 text-xs font-bold text-[#c2410c] border border-[#fed7aa]">
                  {pendingClosures.length} Action Required
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {pendingClosures.map((proj) => (
                  <div key={proj.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-4 border border-[#fed7aa]/60">
                    <div>
                      <p className="text-[16px] font-bold text-[#111827]">{proj.title}</p>
                      <p className="text-xs text-[#6b7280]">
                        Project Lead: <span className="font-semibold text-[#111827]">{proj.primaryPm || 'Executive Lead'}</span> • {proj.completedTasksCount || 0} tasks completed
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenClosureModal(proj)}
                      className="rounded-full bg-[#ea580c] px-5 py-2 text-xs font-bold text-white shadow hover:bg-[#c2410c]"
                    >
                      Review &amp; Sign-Off Closure
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Direct Approvals (Solo Contributor & PM Self-Tasks) */}
          {directApprovals.length > 0 && (
            <div className="rounded-[24px] border border-[#fef3c7] bg-[#fffbeb] p-6 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#fde68a]">
                <div>
                  <h2 className="text-[18px] font-black text-[#92400e]">Direct Approvals Queue (Solo Contributors &amp; PM Tasks)</h2>
                  <p className="text-xs text-[#b45309]">Tasks bypassing TL stage or PM self-assignments requiring executive sign-off</p>
                </div>
                <span className="rounded-full bg-[#fef3c7] px-3 py-1 text-xs font-bold text-[#b45309] border border-[#fde68a]">
                  {directApprovals.length} Pending
                </span>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-left text-[14px]">
                  <thead>
                    <tr className="border-b border-[#fde68a] text-[#92400e]">
                      <th className="py-2.5 font-bold">Task</th>
                      <th className="py-2.5 font-bold">Project</th>
                      <th className="py-2.5 font-bold">Assignee</th>
                      <th className="py-2.5 font-bold">Context</th>
                      <th className="py-2.5 font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#fef3c7]/60">
                    {directApprovals.map((t) => (
                      <tr key={t.id}>
                        <td className="py-3 font-semibold text-[#111827]">{t.name}</td>
                        <td className="py-3 text-[#4b5563]">{t.projectTitle}</td>
                        <td className="py-3 font-bold text-[#111827]">{t.assignee}</td>
                        <td className="py-3">
                          <StatusBadge status={t.status} />
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
          )}

          {/* 3. TL Project Creation Requests */}
          {tlProjectRequests.length > 0 && (
            <div className="rounded-[24px] border border-[#ede9fe] bg-[#f5f3ff] p-6 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#ddd6fe]">
                <div>
                  <h2 className="text-[18px] font-black text-[#4c1d95]">TL Project Creation Requests</h2>
                  <p className="text-xs text-[#6d28d9]">Team leaders requesting permission to initiate a new project — review justification before granting.</p>
                </div>
                <span className="rounded-full bg-[#ede9fe] px-3 py-1 text-xs font-bold text-[#6d28d9] border border-[#ddd6fe]">
                  {tlProjectRequests.length} Pending
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {tlProjectRequests.map((req) => (
                  <div key={req.id} className="rounded-2xl bg-white border border-[#ddd6fe]/60 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-[15px] font-bold text-[#111827]">{req.projectName}</p>
                        <p className="text-xs text-[#6b7280] mt-0.5">
                          Requested by: <span className="font-semibold text-[#111827]">{req.requestedBy}</span>
                          <span className="mx-1.5">•</span>
                          {req.staffingMode === 'TEAM' ? 'Standard Team' : 'Solo / Independent'}
                          <span className="mx-1.5">•</span>
                          Priority: {req.priority}
                        </p>
                        <p className="mt-1.5 text-xs text-[#374151]">
                          <span className="font-semibold text-[#4c1d95]">Justification:</span> {req.justification}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => onDenyTLRequest(req.id)}
                          className="rounded-full border border-[#fca5a5] bg-white px-4 py-1.5 text-xs font-bold text-[#dc2626] hover:bg-[#fef2f2]"
                        >
                          Deny
                        </button>
                        <button
                          type="button"
                          onClick={() => onGrantTLPermission(req)}
                          className="rounded-full bg-[#7c3aed] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#6d28d9] shadow-sm flex items-center gap-1.5"
                        >
                          <span>✓</span> Accept &amp; Create Project
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. Task-Change Requests (TCR) Queue */}
          {tcrReviews.length > 0 && (
            <div className="rounded-[24px] border border-[#ffedd5] bg-[#fff7ed] p-6 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#fed7aa]">
                <div>
                  <h2 className="text-[18px] font-black text-[#9a3412]">Task-Change Requests (TCR) Queue</h2>
                  <p className="text-xs text-[#c2410c]">
                    Task deletions, deadline extensions, or reassignment requests requiring executive oversight or PM decision.
                  </p>
                </div>
                <span className="rounded-full bg-[#ffedd5] px-3 py-1 text-xs font-bold text-[#c2410c] border border-[#fed7aa]">
                  {tcrReviews.length} Action Required
                </span>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-left text-[14px]">
                  <thead>
                    <tr className="border-b border-[#fed7aa] text-[#9a3412]">
                      <th className="py-2.5 font-bold">Task</th>
                      <th className="py-2.5 font-bold">Project</th>
                      <th className="py-2.5 font-bold">Requester</th>
                      <th className="py-2.5 font-bold">Type</th>
                      <th className="py-2.5 font-bold">Status</th>
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
                        <td className="py-3">
                          {['PENDING_PM_APPROVAL', 'PENDING_CEO_APPROVAL'].includes(t.changeRequest?.status) ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#ede9fe] border border-[#ddd6fe] px-2.5 py-0.5 text-xs font-bold text-[#6d28d9]">
                              <span>✓</span>
                              <span>Recommended to You</span>
                              {t.changeRequest?.tlRecommendedBy && (
                                <span className="text-[11px] font-medium text-[#7c3aed]">
                                  ({t.changeRequest.tlRecommendedBy})
                                </span>
                              )}
                            </span>
                          ) : t.changeRequest?.status === 'DIRECT_APPROVAL_REQUIRED' ? (
                            <span className="inline-flex items-center rounded-full bg-[#fef3c7] border border-[#fde68a] px-2.5 py-0.5 text-xs font-bold text-[#b45309]">
                              Direct Executive Decision
                            </span>
                          ) : t.changeRequest?.status === 'PENDING_TL_REVIEW' ? (
                            <span className="inline-flex items-center rounded-full bg-[#e0e7ff] border border-[#c7d2fe] px-2.5 py-0.5 text-xs font-bold text-[#4338ca]">
                              Under TL Review
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-[#ffedd5] border border-[#fed7aa] px-2.5 py-0.5 text-xs font-bold text-[#c2410c]">
                              Recommended to You
                            </span>
                          )}
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
                            Review &amp; Decide
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Global Projects Portfolio */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e5e7eb] pb-3">
          <div className="flex items-center gap-2">
            {['ALL', 'ACTIVE', 'PLANNED', 'ON_HOLD', 'COMPLETED'].map((tab) => (
              <button
                type="button"
                key={tab}
                onClick={() => setFilter(tab)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                  filter === tab
                    ? 'bg-[#111827] text-white shadow-sm'
                    : 'bg-[#f1f5f9] text-[#6b7280] hover:bg-[#e2e8f0]'
                }`}
              >
                {tab.replace('_', ' ')}
              </button>
            ))}
          </div>

          <span className="text-xs text-[#6b7280]">{filteredProjects.length} total initiatives</span>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
          {filteredProjects.length === 0 && (
            <div className="col-span-full py-12 text-center text-xs text-[#9ca3af]">
              No initiatives found matching this status filter.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CEOProjectsView
