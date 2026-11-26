import { useState } from 'react'

function ProjectClosureModal({
  isOpen,
  onClose,
  project,
  isCEO = true,
  blockers = [],
  onRequestClosure,
  onApproveClosure,
  onRejectClosure,
  isSubmitting = false,
  apiError = null,
}) {
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectBox, setShowRejectBox] = useState(false)

  if (!isOpen || !project) return null

  const isPendingCeoReview = project.status === 'PENDING_CEO_CLOSURE'
  const canRequest = blockers.length === 0

  const handleConfirmReject = () => {
    onRejectClosure(project.id, rejectReason.trim())
  }

  const handleApprove = () => {
    onApproveClosure(project.id)
  }

  const handleRequest = () => {
    if (onRequestClosure) onRequestClosure(project.id)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-[28px] bg-white p-7 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-4">
          <div>
            <h2 className="text-[20px] font-black text-[#111827]">
              {isPendingCeoReview
                ? 'Executive Project Closure Review'
                : canRequest
                  ? 'Request Project Closure'
                  : 'Project Closure Blocked'}
            </h2>
            <p className="text-xs text-[#6b7280] mt-0.5">
              {isPendingCeoReview ? 'E17 / E18 POST — CEO Decision' : 'E15 POST & E16 GET — Closure Readiness'}
            </p>
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

        {/* If blockers exist on request stage */}
        {!isPendingCeoReview && !canRequest && (
          <div className="mt-5 space-y-4">
            <div className="rounded-xl border border-[#fecaca] bg-[#fef2f2] p-4 text-xs text-[#991b1b]">
              <p className="font-bold text-[13px] text-[#b91c1c]">🛑 Closure Blockers Detected (E16 GET)</p>
              <p className="mt-1 text-[#7f1d1d]">
                Section 9 prerequisites enforce that every non-cancelled task must be approved COMPLETED and zero pending TCRs must exist before requesting closure.
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-[#374151]">Active Blockers:</p>
              {blockers.map((b, i) => (
                <div key={i} className="rounded-xl border border-[#fed7aa] bg-[#fffbeb] p-3 text-xs text-[#b45309]">
                  ⚠ {b}
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end border-t border-[#f1f5f9] pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-[#111827] px-6 py-2 text-xs font-bold text-white hover:bg-black"
              >
                Understood — Resolve Blockers
              </button>
            </div>
          </div>
        )}

        {/* If ready to request closure (Current PM) */}
        {!isPendingCeoReview && canRequest && (
          <div className="mt-5 space-y-4">
            <div className="rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] p-4 text-xs text-[#166534]">
              <p className="font-bold text-[13px] text-[#15803d]">✓ All Closure Guards Satisfied</p>
              <p className="mt-1">
                Zero blockers detected by E16. Submitting this request will transition the initiative to <strong>PENDING_CEO_CLOSURE</strong> for executive deliverable review.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-3.5 text-xs">
              <p className="font-semibold text-gray-800">Initiative: {project.title || project.name}</p>
              <p className="text-gray-600 mt-0.5">Primary PM: {project.primaryPm || 'Current PM'}</p>
            </div>

            <div className="mt-6 flex justify-end gap-3 border-t border-[#f1f5f9] pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="rounded-full border border-[#e5e7eb] px-5 py-2 text-xs font-semibold text-[#4b5563] hover:bg-[#f9fafb] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRequest}
                disabled={isSubmitting}
                className="rounded-full bg-[#f59e0b] px-6 py-2 text-xs font-bold text-white hover:bg-[#d97706] disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Closure Request to CEO'}
              </button>
            </div>
          </div>
        )}

        {/* CEO Reviewing Closure Request */}
        {isPendingCeoReview && isCEO && (
          <div className="mt-5 space-y-4">
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-xs text-blue-900">
              <p className="font-bold text-[13px]">Executive Sign-Off Pending</p>
              <p className="mt-1">
                The Primary PM has submitted all deliverables for official closure. Approving transitions the project to <strong>COMPLETED</strong>.
              </p>
            </div>

            {showRejectBox && (
              <div className="rounded-xl border border-[#fed7aa] bg-[#fffbeb] p-4">
                <label className="block text-xs font-bold text-[#b45309] mb-1">
                  Rejection Reason <span className="text-gray-500 font-normal">(optional)</span>
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  disabled={isSubmitting}
                  rows={2}
                  placeholder="Optional rationale for returning project to ACTIVE..."
                  className="w-full rounded-lg border border-[#fde68a] bg-white p-2 text-xs text-[#111827] focus:border-[#b45309] focus:outline-none"
                />
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3 border-t border-[#f1f5f9] pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="rounded-full border border-[#e5e7eb] px-5 py-2 text-xs font-semibold text-[#4b5563] hover:bg-[#f9fafb] disabled:opacity-50"
              >
                Cancel
              </button>

              {!showRejectBox ? (
                <>
                  <button
                    type="button"
                    onClick={() => setShowRejectBox(true)}
                    disabled={isSubmitting}
                    className="rounded-full border border-red-300 bg-red-50 px-5 py-2 text-xs font-bold text-red-700 hover:bg-red-100 disabled:opacity-50"
                  >
                    Reject Closure (Return to ACTIVE)
                  </button>
                  <button
                    type="button"
                    onClick={handleApprove}
                    disabled={isSubmitting}
                    className="rounded-full bg-emerald-600 px-6 py-2 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm disabled:opacity-50"
                  >
                    {isSubmitting ? 'Approving...' : 'Approve Project Closure (COMPLETED)'}
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setShowRejectBox(false)}
                    disabled={isSubmitting}
                    className="rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-700 disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmReject}
                    disabled={isSubmitting}
                    className="rounded-full bg-red-600 px-6 py-2 text-xs font-bold text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Rejecting...' : 'Confirm Reject'}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectClosureModal
