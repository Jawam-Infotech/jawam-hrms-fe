import { useState } from 'react'

function TaskChangeReviewModal({
  isOpen,
  onClose,
  task,
  onApprove,
  onReject,
  isSubmitting = false,
  apiError = null,
}) {
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectInput, setShowRejectInput] = useState(false)

  if (!isOpen || !task) return null

  // The review object comes exclusively from task.open_change_request.
  // Never fall back to the task itself, and never use task-level permission flags.
  const request = task.open_change_request ?? null
  const requestId = request?.id || request?.item_id
  const canDecide = request?.can_decide === true

  const handleConfirmReject = (e) => {
    e.preventDefault()
    if (!canDecide) return
    onReject({
      requestId,
      reason: rejectReason.trim(),
    })
  }

  const handleConfirmApprove = () => {
    if (!canDecide) return
    onApprove({
      requestId,
      reason: '',
    })
  }

  const getChangeTypeName = (type) => {
    switch (type) {
      case 'EXTEND_DEADLINE':
      case 'DEADLINE_EXTENSION':
        return 'Deadline Extension'
      case 'DELETE_TASK':
        return 'Task Cancellation / Deletion'
      case 'REASSIGN':
      case 'REASSIGNMENT':
        return 'Assignee Reassignment'
      default:
        return type || 'Change Request'
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[28px] bg-white p-7 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-4">
          <div>
            <h2 className="text-[19px] font-black text-[#111827]">Review Task-Change Request</h2>
            <p className="text-xs text-[#6b7280] mt-0.5">E23 POST — Scope &amp; Schedule Governance</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-full p-2 text-[#9ca3af] hover:bg-[#f1f5f9] hover:text-[#111827] disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        {apiError && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
            {apiError}
          </div>
        )}

        <div className="mt-4 space-y-4">
          {/* Metadata Card */}
          <div className="rounded-xl border border-[#e5e7eb] bg-[#f8fafc] p-3.5 text-xs space-y-1.5">
            <div className="flex justify-between">
              <span className="text-[#6b7280]">Target Task:</span>
              <span className="font-bold text-[#111827]">{task.title || task.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6b7280]">Operation:</span>
              <span className="font-bold text-[#2563eb]">{getChangeTypeName(request?.operation || request?.type)}</span>
            </div>
            {request?.new_due_date && (
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Requested Due Date:</span>
                <span className="font-bold text-gray-800">{request.new_due_date}</span>
              </div>
            )}
            {request?.new_assignee_id && (
              <div className="flex justify-between">
                <span className="text-[#6b7280]">Requested Assignee ID:</span>
                <span className="font-bold text-gray-800">User #{request.new_assignee_id}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-[#6b7280]">Requested By:</span>
              <span className="font-bold text-gray-800">{request?.requested_by_name || 'Unknown requester'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#6b7280]">Stage:</span>
              <span className="font-bold text-gray-800">{request?.stage || 'Deciding Stage'}</span>
            </div>
          </div>

          {/* Requester's Justification */}
          <div className="rounded-xl border border-[#e5e7eb] p-3.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#6b7280]">Requester Justification</p>
            <p className="mt-1 text-xs text-[#111827] italic">&quot;{request?.reason || 'No detailed reason provided'}&quot;</p>
          </div>

          {showRejectInput && (
            <div className="rounded-xl border border-[#fed7aa] bg-[#fffbeb] p-3.5">
              <label className="block text-xs font-bold text-[#b45309] mb-1">
                Decision Note <span className="text-[#6b7280] font-normal">(optional — Revision 3.8)</span>
              </label>
              <textarea
                rows={2}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                disabled={isSubmitting}
                placeholder="Optional feedback regarding this rejection..."
                className="w-full rounded-lg border border-[#fde68a] bg-white p-2 text-xs text-[#111827] focus:border-[#b45309] focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-3 border-t border-[#f1f5f9] pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-full border border-[#e5e7eb] px-5 py-2 text-[14px] font-semibold text-[#4b5563] hover:bg-[#f9fafb] disabled:opacity-50"
          >
            Cancel
          </button>

          {!showRejectInput ? (
            <>
              <button
                type="button"
                onClick={() => setShowRejectInput(true)}
                disabled={isSubmitting || !canDecide}
                className="rounded-full border border-[#fca5a5] bg-[#fef2f2] px-5 py-2 text-[14px] font-semibold text-[#dc2626] hover:bg-[#fee2e2] disabled:opacity-50"
              >
                Reject TCR
              </button>
              <button
                type="button"
                onClick={handleConfirmApprove}
                disabled={isSubmitting || !canDecide}
                className="rounded-full bg-[#10b981] px-6 py-2 text-[14px] font-semibold text-white shadow-sm hover:bg-[#059669] disabled:opacity-50"
              >
                {isSubmitting ? 'Approving...' : 'Approve TCR'}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setShowRejectInput(false)}
                disabled={isSubmitting}
                className="rounded-full border border-[#e5e7eb] px-4 py-2 text-xs font-semibold text-[#6b7280] disabled:opacity-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                disabled={isSubmitting || !canDecide}
                className="rounded-full bg-[#dc2626] px-5 py-2 text-[14px] font-semibold text-white hover:bg-[#b91c1c] disabled:opacity-50"
              >
                {isSubmitting ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default TaskChangeReviewModal
