import { useState } from 'react'

function TaskChangeReviewModal({
  isOpen,
  onClose,
  task,
  currentUser,
  onApprove,
  onReject,
}) {
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectInput, setShowRejectInput] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen || !task || !task.changeRequest) return null

  const request = task.changeRequest
  const isRequester = currentUser && (
    currentUser.name === request.requester ||
    currentUser.id === request.requesterId
  )

  const isTLReview = request.status === 'PENDING_TL_REVIEW' && currentUser?.role === 'TL'

  const handleConfirmReject = (e) => {
    e.preventDefault()
    if (!rejectReason.trim()) {
      setError('A mandatory decision reason is required to reject a task-change request.')
      return
    }

    onReject(task.id, request, rejectReason.trim())
    setRejectReason('')
    setShowRejectInput(false)
    setError('')
    onClose()
  }

  const handleApprove = () => {
    onApprove(task.id, request)
    onClose()
  }

  const getChangeTypeName = (type) => {
    switch (type) {
      case 'DEADLINE_EXTENSION':
        return 'Deadline Extension'
      case 'TASK_DELETION':
        return 'Task Cancellation / Deletion'
      case 'REASSIGNMENT':
        return 'Assignee Reassignment'
      default:
        return type
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[28px] bg-white p-7 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-4">
          <div>
            <h2 className="text-[19px] font-black text-[#111827]">Review Task-Change Request</h2>
            <p className="text-xs text-[#6b7280] mt-0.5">Workflow E — Scope & Schedule Governance</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#9ca3af] hover:bg-[#f1f5f9] hover:text-[#111827]"
          >
            ✕
          </button>
        </div>

        {/* Zero Self-Approval Guard Banner */}
        {isRequester && (
          <div className="mt-4 rounded-xl border border-[#fecaca] bg-[#fef2f2] p-3 text-xs text-[#b91c1c]">
            <p className="font-bold">Zero Self-Approval Rule (Section 8.1):</p>
            <p className="mt-0.5">
              You submitted this change request. Under no circumstances can a user approve their own task-change request. Review must be performed by your lead or CEO.
            </p>
          </div>
        )}

        <div className="mt-4 space-y-4">
          {/* Metadata Card */}
          <div className="rounded-xl border border-[#e5e7eb] bg-[#f8fafc] p-3.5 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[#6b7280]">Target Task:</span>
              <span className="font-bold text-[#111827]">{task.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6b7280]">Requested By:</span>
              <span className="font-semibold text-[#111827]">{request.requester || 'Team Member'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6b7280]">Request Type:</span>
              <span className="font-bold text-[#2563eb]">{getChangeTypeName(request.type)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6b7280]">Review Stage:</span>
              <span className="font-semibold text-[#4338ca]">
                {task.isIndependent
                  ? 'Direct PM / CEO Single-Stage Decision'
                  : isTLReview
                    ? 'Stage 1 of 2: Team Leader Review (Routes to CEO)'
                    : request.tlRecommendedBy
                      ? `Stage 2 of 2: Recommended to You by ${request.tlRecommendedBy}`
                      : 'Stage 2 of 2: Recommended to You for Final Decision'}
              </span>
            </div>
            {request.tlRecommendedBy && !isTLReview && (
              <div className="flex justify-between">
                <span className="text-[#6b7280]">TL Recommendation:</span>
                <span className="font-semibold text-[#7c3aed]">
                  ✓ Endorsed by {request.tlRecommendedBy}
                </span>
              </div>
            )}
          </div>

          {/* Current vs Requested Value Comparison */}
          <div className="rounded-xl border border-[#dbeafe] bg-[#eff6ff] p-4 text-xs">
            <p className="font-bold uppercase tracking-wider text-[#1e40af] mb-2">Atomic Change Comparison</p>
            {request.type === 'DEADLINE_EXTENSION' && (
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-white p-2.5 border border-[#bfdbfe]">
                  <span className="block text-[11px] text-[#6b7280]">Current Due Date</span>
                  <span className="font-bold text-[#374151] mt-0.5 block">{task.dueDate || 'None set'}</span>
                </div>
                <div className="rounded-lg bg-white p-2.5 border border-[#60a5fa]">
                  <span className="block text-[11px] text-[#2563eb]">Requested Due Date</span>
                  <span className="font-bold text-[#1e40af] mt-0.5 block">{request.requestedChange?.dueDate}</span>
                </div>
              </div>
            )}

            {request.type === 'REASSIGNMENT' && (
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg bg-white p-2.5 border border-[#bfdbfe]">
                  <span className="block text-[11px] text-[#6b7280]">Current Assignee</span>
                  <span className="font-bold text-[#374151] mt-0.5 block">{task.assignee}</span>
                </div>
                <div className="rounded-lg bg-white p-2.5 border border-[#60a5fa]">
                  <span className="block text-[11px] text-[#2563eb]">Replacement Assignee</span>
                  <span className="font-bold text-[#1e40af] mt-0.5 block">{request.requestedChange?.newAssignee}</span>
                </div>
              </div>
            )}

            {request.type === 'TASK_DELETION' && (
              <div className="rounded-lg bg-white p-2.5 border border-[#fca5a5] text-[#991b1b]">
                <span className="block font-bold">Proposed Action: Cancel & Abandon Task</span>
                <span className="block mt-0.5 text-[11px] text-[#b91c1c]">
                  Status will transition to CANCELLED and will be excluded from the project progress denominator.
                </span>
              </div>
            )}
          </div>

          {/* Requester's Justification */}
          <div className="rounded-xl border border-[#e5e7eb] p-3 text-xs">
            <p className="font-bold text-[#374151] mb-1">Requester's Reason / Justification:</p>
            <p className="text-[#4b5563] italic bg-[#f9fafb] p-2.5 rounded-lg border border-[#f1f5f9]">
              &quot;{request.reason}&quot;
            </p>
          </div>

          {/* Rejection Form Input */}
          {showRejectInput && (
            <div className="rounded-xl border border-[#fed7aa] bg-[#fffbeb] p-3.5">
              <label className="block text-xs font-bold text-[#b45309] mb-1">
                Mandatory Decision Reason for Rejection <span className="text-[#dc2626]">*</span>
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => {
                  setRejectReason(e.target.value)
                  if (error) setError('')
                }}
                rows={2}
                placeholder="Explain why this request is rejected (e.g. milestones cannot slip, task is critical)..."
                className="w-full rounded-[10px] border border-[#fde68a] bg-white px-3 py-2 text-xs text-[#111827] focus:border-[#b45309] focus:outline-none"
              />
              {error && <p className="mt-1 text-xs text-[#dc2626] font-medium">{error}</p>}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 flex justify-end gap-3 border-t border-[#f1f5f9] pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#e5e7eb] px-5 py-2 text-[14px] font-semibold text-[#4b5563] hover:bg-[#f9fafb]"
          >
            Close
          </button>

          {!showRejectInput ? (
            <>
              <button
                type="button"
                disabled={isRequester}
                onClick={() => setShowRejectInput(true)}
                className={`rounded-full px-5 py-2 text-[14px] font-semibold transition ${
                  isRequester
                    ? 'cursor-not-allowed bg-[#f3f4f6] text-[#9ca3af]'
                    : 'border border-[#fca5a5] bg-[#fff1f2] text-[#dc2626] hover:bg-[#fee2e2]'
                }`}
              >
                Reject Request
              </button>
              <button
                type="button"
                disabled={isRequester}
                onClick={handleApprove}
                className={`rounded-full px-6 py-2 text-[14px] font-semibold text-white shadow-sm transition ${
                  isRequester
                    ? 'cursor-not-allowed bg-[#9ca3af]'
                    : isTLReview
                      ? 'bg-[#4338ca] hover:bg-[#3730a3]'
                      : 'bg-[#10b981] hover:bg-[#059669]'
                }`}
              >
                {isTLReview ? 'Recommend to CEO' : 'Approve & Apply Atomically'}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setShowRejectInput(false)}
                className="rounded-full border border-[#e5e7eb] px-4 py-2 text-xs font-semibold text-[#6b7280]"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                className="rounded-full bg-[#dc2626] px-5 py-2 text-[14px] font-semibold text-white hover:bg-[#b91c1c]"
              >
                Confirm Rejection
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default TaskChangeReviewModal
