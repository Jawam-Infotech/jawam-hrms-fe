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
  onApproveProjectRequest,
  onRejectProjectRequest,
  onReturnProjectRequest,
  onGrantTLPermission,
  onDenyTLRequest,
}) {
  const [filter, setFilter] = useState('ALL')
  const [decisionModal, setDecisionModal] = useState(null) // { reqId, type: 'RETURN' | 'REJECT', reqName }
  const [decisionReason, setDecisionReason] = useState('')
  const [decisionError, setDecisionError] = useState('')

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
                        <td className="py-3 font-bold text-[#111827]">
                          {t.assignee}
                          <div className="text-xs font-normal text-[#6b7280]">
                            Submitted by {t.requested_by_name || 'Unknown requester'}
                          </div>
                        </td>
                        <td className="py-3">
                          <StatusBadge status={t.isRejected ? 'REJECTED' : t.status} />
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
                  <p className="text-xs text-[#6d28d9]">Team leaders requesting new project approvals. Evaluate business justification and proposed timeline before deciding.</p>
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
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-[15px] font-bold text-[#111827]">{req.name || req.projectName || req.project_name}</p>
                        </div>
                        <p className="text-xs text-[#6b7280] mt-1">
                          Requested by: <span className="font-semibold text-[#111827]">{req.requested_by_name || 'Unknown requester'}</span>
                          <span className="mx-1.5">•</span>
                          Proposed Timeline: <span className="font-semibold text-[#111827]">{req.proposed_start_date || 'TBD'} to {req.proposed_end_date || req.proposed_target_end_date || 'TBD'}</span>
                        </p>
                        <p className="mt-2 text-xs text-[#374151] bg-[#f8fafc] p-2.5 rounded-xl border border-gray-100">
                          <span className="font-semibold text-[#4c1d95]">Business Justification:</span> {req.business_justification || req.justification}
                        </p>
                        {req.description && (
                          <p className="mt-1 text-xs text-[#4b5563]">
                            <span className="font-semibold">Description:</span> {req.description}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0 self-center">
                        <button
                          type="button"
                          onClick={() => {
                            setDecisionModal({
                              reqId: req.id,
                              type: 'REJECT',
                              reqName: req.name || req.projectName || 'Project Request',
                            })
                            setDecisionReason('')
                            setDecisionError('')
                          }}
                          className="rounded-full border border-[#fca5a5] bg-white px-3 py-1.5 text-xs font-bold text-[#dc2626] hover:bg-[#fef2f2] transition"
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setDecisionModal({
                              reqId: req.id,
                              type: 'RETURN',
                              reqName: req.name || req.projectName || 'Project Request',
                            })
                            setDecisionReason('')
                            setDecisionError('')
                          }}
                          className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-800 hover:bg-amber-100 transition"
                        >
                          Return for Clarification
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (onApproveProjectRequest) {
                              onApproveProjectRequest(req.id)
                            } else if (onGrantTLPermission) {
                              onGrantTLPermission(req)
                            }
                          }}
                          className="rounded-full bg-[#10b981] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#059669] shadow-sm flex items-center gap-1.5 transition"
                        >
                          <span>✓</span> Approve Request
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
                        <td className="py-3 font-bold text-[#111827]">{t.open_change_request?.requested_by_name || t.requested_by_name || 'Unknown requester'}</td>
                        <td className="py-3">
                          <span className="rounded-full bg-[#ffedd5] border border-[#fed7aa] px-2.5 py-0.5 text-xs font-bold text-[#9a3412]">
                            {t.open_change_request?.type === 'DEADLINE_EXTENSION' || t.open_change_request?.operation === 'EXTEND_DEADLINE'
                              ? 'Deadline Extension'
                              : t.open_change_request?.type === 'DELETE_TASK' || t.open_change_request?.operation === 'DELETE_TASK'
                                ? 'Task Deletion'
                                : 'Reassignment'}
                          </span>
                        </td>
                        <td className="py-3">
                          {(() => {
                            const tcrState = t.open_change_request?.state
                            if (['PENDING_PM_APPROVAL', 'PENDING_CEO_APPROVAL'].includes(tcrState)) {
                              return (
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#ede9fe] border border-[#ddd6fe] px-2.5 py-0.5 text-xs font-bold text-[#6d28d9]">
                                  <span>✓</span>
                                  <span>Recommended to You</span>
                                  {t.open_change_request?.tlRecommendedBy && (
                                    <span className="text-[11px] font-medium text-[#7c3aed]">
                                      ({t.open_change_request.tlRecommendedBy})
                                    </span>
                                  )}
                                </span>
                              )
                            }
                            if (tcrState === 'DIRECT_APPROVAL_REQUIRED') {
                              return (
                                <span className="inline-flex items-center rounded-full bg-[#fef3c7] border border-[#fde68a] px-2.5 py-0.5 text-xs font-bold text-[#b45309]">
                                  Direct Executive Decision
                                </span>
                              )
                            }
                            if (tcrState === 'PENDING_TL_REVIEW') {
                              return (
                                <span className="inline-flex items-center rounded-full bg-[#e0e7ff] border border-[#c7d2fe] px-2.5 py-0.5 text-xs font-bold text-[#4338ca]">
                                  Under TL Review
                                </span>
                              )
                            }
                            return (
                              <span className="inline-flex items-center rounded-full bg-[#ffedd5] border border-[#fed7aa] px-2.5 py-0.5 text-xs font-bold text-[#c2410c]">
                                Recommended to You
                              </span>
                            )
                          })()}
                        </td>
                        <td className="py-3 text-xs text-[#6b7280] max-w-xs truncate">
                          {t.open_change_request?.reason || 'No reason provided'}
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
      {/* Decision Modal for Return for Clarification or Rejection */}
      {decisionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[28px] bg-white p-7 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
              <div>
                <h3 className="text-[18px] font-black text-[#111827]">
                  {decisionModal.type === 'RETURN' ? 'Return for Clarification' : 'Reject Project Request'}
                </h3>
                <p className="text-xs text-[#6b7280] mt-0.5">{decisionModal.reqName}</p>
              </div>
              <button
                type="button"
                onClick={() => setDecisionModal(null)}
                className="rounded-full p-1.5 text-[#9ca3af] hover:bg-[#f1f5f9] hover:text-[#111827]"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-4">
              <p className="text-xs text-[#4b5563]">
                {decisionModal.type === 'RETURN'
                  ? 'Provide specific feedback or clarification questions for the Team Leader so they can adjust proposed dates or scope and resubmit.'
                  : 'Please state the official executive reason for declining this project proposal.'}
              </p>

              <div>
                <label className="block text-[13px] font-bold text-[#111827] mb-1">
                  {decisionModal.type === 'RETURN' ? 'Clarification Required' : 'Rejection Reason'}{' '}
                  <span className="text-[#ef4444]">*</span>
                </label>
                <textarea
                  rows={3}
                  value={decisionReason}
                  onChange={(e) => {
                    setDecisionReason(e.target.value)
                    setDecisionError('')
                  }}
                  placeholder={
                    decisionModal.type === 'RETURN'
                      ? 'e.g., Please shift proposed start date by 2 weeks and elaborate on backend engineering dependencies.'
                      : 'e.g., Priority deferred to Q3 planning cycle.'
                  }
                  className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2.5 text-[14px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
                />
                {decisionError && <p className="mt-1 text-xs text-[#ef4444]">{decisionError}</p>}
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#f1f5f9]">
                <button
                  type="button"
                  onClick={() => setDecisionModal(null)}
                  className="rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!decisionReason.trim()) {
                      setDecisionError('Reason is required.')
                      return
                    }
                    if (decisionModal.type === 'RETURN') {
                      if (onReturnProjectRequest) {
                        onReturnProjectRequest(decisionModal.reqId, { note: decisionReason.trim() })
                      }
                    } else {
                      if (onRejectProjectRequest) {
                        onRejectProjectRequest(decisionModal.reqId, decisionReason.trim())
                      } else if (onDenyTLRequest) {
                        onDenyTLRequest(decisionModal.reqId)
                      }
                    }
                    setDecisionModal(null)
                  }}
                  className={`rounded-full px-5 py-2 text-xs font-bold text-white shadow transition ${
                    decisionModal.type === 'RETURN'
                      ? 'bg-amber-600 hover:bg-amber-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {decisionModal.type === 'RETURN' ? 'Send for Clarification' : 'Confirm Rejection'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CEOProjectsView
