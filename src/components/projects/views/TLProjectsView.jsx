import { useState } from 'react'
import ProjectCard from '../cards/ProjectCard.jsx'
import StatusBadge from '../../ui/StatusBadge.jsx'

function TLProjectsView({
  projects = [],
  teamReviews = [],
  tcrReviews = [],
  myTasks = [],
  tlProjectRequests = [],
  onOpenUpdateModal,
  onOpenDetailModal,
  onOpenApprovalModal,
  onOpenChangeReviewModal,
  onOpenRequestModal,
  onWithdrawRequest,
}) {
  const [filter, setFilter] = useState('ALL')
  const pendingRequests = (tlProjectRequests || []).filter(
    (r) => ['PENDING', 'PENDING_CEO_APPROVAL', 'SUBMITTED'].includes(String(r.status || '').toUpperCase())
  )
  const returnedRequests = (tlProjectRequests || []).filter(
    (r) => ['RETURNED', 'CHANGES_REQUESTED', 'NEEDS_CLARIFICATION'].includes(String(r.status || '').toUpperCase())
  )
  const approvedRequests = (tlProjectRequests || []).filter(
    (r) => String(r.status || '').toUpperCase() === 'APPROVED'
  )

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
          <button
            type="button"
            onClick={() => onOpenRequestModal()}
            className="inline-flex items-center gap-2 rounded-full border border-[#7c3aed] bg-[#f5f3ff] px-5 py-2.5 text-[14px] font-bold text-[#7c3aed] hover:bg-[#ede9fe] transition shadow-xs"
          >
            📋 Request Project Creation
          </button>
        </div>
      </div>

      {/* 1. Returned for Clarification Alert Banners */}
      {returnedRequests.map((req) => (
        <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-amber-300 bg-amber-50 p-4 shadow-sm">
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-xl flex-shrink-0">
              ⚠️
            </div>
            <div>
              <p className="text-[15px] font-bold text-amber-950">
                Project Request Returned for Clarification: &ldquo;{req.name || req.projectName}&rdquo;
              </p>
              <p className="text-xs text-amber-800 mt-0.5">
                CEO Note: {req.decision_reason || 'Please review proposed dates and scope details before resubmitting.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center">
            {onWithdrawRequest && (
              <button
                type="button"
                onClick={() => onWithdrawRequest(req.id)}
                className="rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
              >
                Withdraw
              </button>
            )}
            <button
              type="button"
              onClick={() => onOpenRequestModal(req)}
              className="rounded-full bg-amber-600 px-4 py-1.5 text-xs font-bold text-white shadow hover:bg-amber-700 transition"
            >
              Edit &amp; Resubmit
            </button>
          </div>
        </div>
      ))}

      {/* 2. Pending Requests Alert Banners */}
      {pendingRequests.map((req) => (
        <div key={req.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-blue-200 bg-blue-50/80 p-4 shadow-sm">
          <div className="flex items-start gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-xl flex-shrink-0">
              ⏳
            </div>
            <div>
              <p className="text-[14px] font-bold text-blue-950">
                Project Request Submitted: &ldquo;{req.name || req.projectName}&rdquo;
              </p>
              <p className="text-xs text-blue-800 mt-0.5">
                Proposed Timeline: {req.proposed_start_date || 'TBD'} to {req.proposed_end_date || req.proposed_target_end_date || 'TBD'} • Awaiting CEO decision.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end sm:self-center">
            <span className="rounded-full bg-blue-200 px-3 py-1 text-xs font-bold text-blue-900 border border-blue-300">
              Pending CEO Decision
            </span>
            {onWithdrawRequest && (
              <button
                type="button"
                onClick={() => onWithdrawRequest(req.id)}
                className="rounded-full border border-gray-300 bg-white px-3 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-100 transition"
              >
                Withdraw
              </button>
            )}
          </div>
        </div>
      ))}

      {/* 3. Approved Project Requests Banners */}
      {approvedRequests.slice(0, 1).map((req) => (
        <div key={req.id} className="flex items-center justify-between rounded-2xl border border-emerald-300 bg-emerald-50/95 p-4 shadow-sm">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-xl flex-shrink-0">
              🎉
            </div>
            <div>
              <p className="text-[15px] font-bold text-emerald-950">
                Project Request Approved by CEO!
              </p>
              <p className="text-xs text-emerald-800 mt-0.5">
                CEO approved your request for <strong className="font-bold">&ldquo;{req.name || req.projectName}&rdquo;</strong>.
              </p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-200 px-3 py-1 text-xs font-bold text-emerald-900 border border-emerald-300">
            Approved
          </span>
        </div>
      ))}


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
                    <td className="py-3 text-xs text-[#6b7280] max-w-xs truncate">
                      {t.open_change_request?.reason || 'No reason provided'}
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
              <h2 className="text-[18px] font-black text-[#92400e]">Deliverables Awaiting Your Review</h2>
              <p className="text-xs text-[#b45309]">Review team member proof-of-work and deliverable submissions requiring your sign-off</p>
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
                    <td className="py-3 font-bold text-[#111827]">
                      {t.assignee}
                      <div className="text-xs font-normal text-[#6b7280]">
                        Submitted by {t.requested_by_name || 'Unknown requester'}
                      </div>
                    </td>
                    <td className="py-3">
                      {(t.deliverable || t.open_completion_submission?.deliverable_urls?.length || t.open_completion_submission?.deliverable_files?.length || t.deliverable_urls?.length || t.deliverable_files?.length) ? (
                        <span className="rounded-full bg-[#ecfdf5] px-2.5 py-0.5 text-xs font-semibold text-[#059669]">
                          ✓ Deliverable Attached
                        </span>
                      ) : (
                        <span className="rounded-full bg-[#fffbeb] border border-[#fde68a] px-2.5 py-0.5 text-xs font-semibold text-[#92400e]">
                          Pending Review
                        </span>
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
                    <td className="px-4 py-3">
                      <p
                        onClick={() => onOpenDetailModal?.(task)}
                        className={`font-bold text-[#111827] ${onOpenDetailModal ? 'cursor-pointer hover:text-[#2563eb] transition' : ''}`}
                        title="Click to view full details"
                      >
                        {task.name}
                      </p>
                      {task.isRejected && (
                        <p className="mt-1 text-xs text-[#dc2626] font-semibold">
                          ❌ Rejected ({task.reworkCount || 1}×)
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[#4b5563]">{task.projectTitle}</td>
                    <td className="px-4 py-3 font-semibold text-[#111827]">{task.progress || 0}%</td>
                    <td className="px-4 py-3"><StatusBadge status={task.isRejected ? 'REJECTED' : task.status} /></td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {onOpenDetailModal && (
                          <button
                            type="button"
                            onClick={() => onOpenDetailModal(task)}
                            className="rounded-full border border-gray-200 bg-white p-1.5 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition shadow-xs"
                            title="View Task Details"
                          >
                            👁️
                          </button>
                        )}
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
                      </div>
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
