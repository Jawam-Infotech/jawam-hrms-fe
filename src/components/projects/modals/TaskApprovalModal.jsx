import { useState } from 'react'

function TaskApprovalModal({ isOpen, onClose, task, currentUser, onApprove, onReject }) {
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectBox, setShowRejectBox] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen || !task) return null

  // Zero Self-Approval Enforcement
  const isSelf = currentUser && (
    currentUser.id === task.assigneeId ||
    currentUser.name === task.assignee ||
    currentUser.email === task.assigneeEmail
  )

  const isIndependent = task.isIndependent || task.status === 'DIRECT_APPROVAL_REQUIRED'

  const handleConfirmReject = () => {
    if (!rejectReason.trim()) {
      setError('Rejection requires a mandatory explanation of required fixes.')
      return
    }
    onReject(task.id, rejectReason)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[28px] bg-white p-8 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-4">
          <div>
            <h2 className="text-[20px] font-black text-[#111827]">Review Deliverable</h2>
            <p className="text-xs text-[#6b7280] mt-1">{task.name} • Assigned to {task.assignee}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#9ca3af] hover:bg-[#f1f5f9] hover:text-[#111827]"
          >
            ✕
          </button>
        </div>

        {/* Self-Approval Block Warning */}
        {isSelf && (
          <div className="mt-4 rounded-xl border border-[#fecaca] bg-[#fef2f2] p-4 text-xs text-[#b91c1c]">
            <p className="font-bold">Zero Self-Approval Enforced:</p>
            <p className="mt-1">
              You are the assignee of this task. System rules strictly prohibit approving your own deliverables. This task requires sign-off from the CEO or an alternate lead.
            </p>
          </div>
        )}

        <div className="mt-5 space-y-4">
          {/* Routing Banner */}
          <div className="flex items-center justify-between rounded-xl bg-[#f8fafc] p-3 text-xs">
            <span className="text-[#6b7280]">Approval Route:</span>
            <span className="font-bold text-[#111827]">
              {isIndependent ? 'Direct PM/CEO Approval (Independent)' : 'Team Review Stage (TL → PM)'}
            </span>
          </div>

          {/* Proof-of-Work Deliverable Display */}
          <div className="rounded-xl border border-[#e5e7eb] p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-[#6b7280]">Submitted Deliverable</p>
            {task.deliverable ? (
              <div className="mt-2 flex items-center justify-between">
                <div>
                  <p className="text-[14px] font-bold text-[#111827]">
                    {task.deliverable.type === 'LINK' ? 'Deliverable URL' : 'Uploaded File'}
                  </p>
                  <p className="text-xs text-[#2563eb] truncate max-w-xs">{task.deliverable.value}</p>
                </div>
                {task.deliverable.type === 'LINK' ? (
                  <a
                    href={task.deliverable.value}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-[#eff6ff] px-3 py-1.5 text-xs font-bold text-[#2563eb] hover:bg-[#dbeafe]"
                  >
                    Open Link ↗
                  </a>
                ) : (
                  <span className="rounded-full bg-[#f1f5f9] px-3 py-1.5 text-xs font-semibold text-[#475569]">
                    Attached File
                  </span>
                )}
              </div>
            ) : (
              <p className="mt-2 text-xs text-[#9ca3af]">No deliverable link attached to this submission.</p>
            )}
          </div>

          {/* Task Info & Notes */}
          <div className="rounded-xl bg-[#f8fafc] p-4 text-[13px] space-y-1.5">
            <p><span className="font-semibold text-[#374151]">Task:</span> {task.name}</p>
            <p><span className="font-semibold text-[#374151]">Priority:</span> {task.priority || 'Medium'}</p>
            {task.reworkCount > 0 && (
              <p className="text-[#e11d48] font-semibold">Previous Rejections: {task.reworkCount}</p>
            )}
          </div>

          {/* Rejection Note Box */}
          {showRejectBox && (
            <div className="rounded-xl border border-[#fed7aa] bg-[#fffbeb] p-4">
              <label className="block text-[13px] font-bold text-[#b45309] mb-1">
                Mandatory Rejection / Rework Feedback <span className="text-[#dc2626]">*</span>
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => {
                  setRejectReason(e.target.value)
                  if (error) setError('')
                }}
                rows={2}
                placeholder="Explain required changes, failing tests, or missing criteria..."
                className="w-full rounded-[10px] border border-[#fde68a] bg-white px-3 py-2 text-[13px] text-[#111827] focus:border-[#b45309] focus:outline-none"
              />
              {error && <p className="mt-1 text-xs text-[#dc2626] font-medium">{error}</p>}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end gap-3 border-t border-[#f1f5f9] pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#e5e7eb] px-5 py-2 text-[14px] font-semibold text-[#4b5563] hover:bg-[#f9fafb]"
          >
            Cancel
          </button>

          {!showRejectBox ? (
            <>
              <button
                type="button"
                onClick={() => setShowRejectBox(true)}
                className="rounded-full border border-[#fca5a5] bg-[#fef2f2] px-5 py-2 text-[14px] font-semibold text-[#dc2626] hover:bg-[#fee2e2]"
              >
                Request Rework / Reject
              </button>
              <button
                type="button"
                disabled={isSelf}
                onClick={() => {
                  onApprove(task.id)
                  onClose()
                }}
                className={`rounded-full px-6 py-2 text-[14px] font-semibold text-white shadow-sm transition ${
                  isSelf
                    ? 'cursor-not-allowed bg-[#9ca3af]'
                    : 'bg-[#10b981] hover:bg-[#059669]'
                }`}
              >
                Approve & Sign Off
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setShowRejectBox(false)}
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

export default TaskApprovalModal
