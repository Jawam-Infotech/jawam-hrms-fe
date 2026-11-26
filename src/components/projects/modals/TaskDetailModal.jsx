import StatusBadge from '../../ui/StatusBadge.jsx'
import TcrRejectionReasons from '../ui/TcrRejectionReasons.jsx'

function TaskDetailModal({
  isOpen,
  onClose,
  task,
  onOpenUpdateModal,
}) {
  if (!isOpen || !task) return null

  const taskTitle = task.name || task.title || `Task #${task.id}`
  const taskId = task.id
  const reworkCount = Number(task.rework_count ?? task.rejection_count ?? task.reworkCount ?? 0)
  const isQualityRisk = Boolean(task.quality_risk || reworkCount >= 3)
  // A completion-review rejection is shown generically. The reviewer's reason is never read from the task row. A TCR
  // rejection reason comes only from TcrRejectionReasons, which uses the authorized change-request endpoint.
  const isRejected = (task.status === 'IN_PROGRESS' || task.status === 'REJECTED') && reworkCount > 0
  const projectId = task.project ?? task.project_id ?? task.projectId ?? null
  const isBlocked = Boolean(task.is_blocked || task.isBlocked || task.status === 'BLOCKED')
  const progress = Number(task.progress || 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[28px] bg-white p-7 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#f1f5f9] pb-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-[20px] font-black text-[#111827]">
                {taskTitle}
              </h2>
              <span className="rounded-lg bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-600">
                Task #{taskId}
              </span>
            </div>
            <p className="text-xs text-[#6b7280] mt-1">
              {task.projectTitle || task.projectName ? `Project: ${task.projectTitle || task.projectName}` : 'Task Details & Progress Overview'}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#9ca3af] hover:bg-[#f1f5f9] hover:text-[#111827] transition"
            title="Close"
          >
            ✕
          </button>
        </div>

        <div className="mt-5 space-y-4">
          {/* Status Row */}
          <div className="flex items-center justify-between rounded-2xl bg-[#f8fafc] border border-[#e5e7eb] p-3.5 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500">Status:</span>
              <StatusBadge status={isRejected ? 'REJECTED' : task.status} />
            </div>
          </div>

          {/* Change-request rejection reason, from the authorized endpoint only */}
          <TcrRejectionReasons projectId={projectId} taskId={taskId} />

          {/* Completion-review rejection callout: generic, the reason is not shown */}
          {isRejected && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 space-y-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  TL / Reviewer Feedback {reworkCount > 0 ? `(${reworkCount} Rejection${reworkCount > 1 ? 's' : ''})` : ''}:
                </p>
                <span className="text-[10px] font-bold rounded bg-amber-200/80 px-2 py-0.5 text-amber-900">
                  Review Notice
                </span>
              </div>
              <p className="text-sm font-semibold text-amber-950 mt-1">
                The deliverable was rejected by the reviewer. Please make the requested updates and resubmit.
              </p>
            </div>
          )}

          {/* Quality Risk Banner (When >= 3 Rejections) */}
          {isQualityRisk && (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-rose-600 px-2.5 py-0.5 text-[10px] font-black uppercase text-white tracking-wider">
                  Quality Risk: {reworkCount} Rejections
                </span>
                <span className="text-xs font-bold text-rose-800">Quality Risk Threshold Exceeded</span>
              </div>
              <p className="text-xs font-semibold text-rose-700">
                Task has undergone {reworkCount} rejections. Schedule a sync meeting with the assignee before resubmission.
              </p>
            </div>
          )}

          {/* Work Blocked Callout */}
          {isBlocked && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-3.5 flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <p className="text-xs font-bold text-red-800">Work is Blocked</p>
                <p className="text-xs text-red-600 mt-0.5">
                  {task.blocker_reason || task.blockers || 'This task is flagged as blocked.'}
                </p>
              </div>
            </div>
          )}

          {/* Progress Bar */}
          <div className="rounded-2xl border border-[#e5e7eb] p-4 bg-white space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-600">Completion Progress</span>
              <span className="text-sm font-black text-[#2563eb]">{progress}%</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  progress >= 100 ? 'bg-emerald-500' : progress >= 50 ? 'bg-blue-600' : 'bg-amber-500'
                }`}
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
          </div>

          {/* Scope & Description */}
          <div className="rounded-2xl border border-[#e5e7eb] p-4 bg-white space-y-1">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Task Scope &amp; Instructions</p>
            <p className="text-xs text-[#374151] leading-relaxed whitespace-pre-line mt-1">
              {task.description || 'No detailed instructions provided for this task.'}
            </p>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="rounded-xl border border-gray-100 bg-[#f9fafb] p-3">
              <span className="text-gray-400 font-medium block">Assignee</span>
              <span className="font-bold text-gray-800 mt-0.5 block truncate">
                {task.assignee || 'Unassigned'}
              </span>
            </div>
            <div className="rounded-xl border border-gray-100 bg-[#f9fafb] p-3">
              <span className="text-gray-400 font-medium block">Due Date</span>
              <span className="font-bold text-gray-800 mt-0.5 block">
                {task.dueDate || task.due_date || 'TBD'}
              </span>
            </div>
            <div className="rounded-xl border border-gray-100 bg-[#f9fafb] p-3">
              <span className="text-gray-400 font-medium block">Project Lead / PM</span>
              <span className="font-bold text-gray-800 mt-0.5 block truncate">
                {task.primaryPm || task.teamLead || 'Assigned Reviewer'}
              </span>
            </div>
            <div className="rounded-xl border border-gray-100 bg-[#f9fafb] p-3">
              <span className="text-gray-400 font-medium block">Rejection Count</span>
              <span className={`font-bold mt-0.5 block ${reworkCount > 0 ? 'text-red-600' : 'text-gray-800'}`}>
                {reworkCount} {reworkCount === 1 ? 'time' : 'times'}
              </span>
            </div>
          </div>

          {/* Deliverable info if present */}
          {(task.open_completion_submission || task.deliverable_notes) && (
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-3 text-xs space-y-1">
              <p className="font-bold text-blue-900">Latest Submission</p>
              <p className="text-blue-800">
                {task.open_completion_submission?.notes || task.deliverable_notes || 'Deliverable submitted for review.'}
              </p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-[#f1f5f9] pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#e5e7eb] px-5 py-2 text-xs font-semibold text-[#4b5563] hover:bg-[#f9fafb] transition"
          >
            Close
          </button>
          {task.status !== 'COMPLETED' && task.status !== 'CANCELLED' && onOpenUpdateModal && (
            <button
              type="button"
              onClick={() => {
                onClose()
                onOpenUpdateModal(task)
              }}
              className="rounded-full bg-[#2563eb] px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-[#1d4ed8] transition"
            >
              Update Progress
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default TaskDetailModal
