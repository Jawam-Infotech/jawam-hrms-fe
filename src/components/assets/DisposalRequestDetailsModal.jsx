import AssetStatusBadge from './AssetStatusBadge'
import { useState } from 'react'


function DisposalRequestDetailsModal({
  request,
  loading = false,
  onClose,
  onApprove,
  onReject,
  actionLoading = false,
  actionError = '',
  userRole,
}) {
    const [reviewNote, setReviewNote] = useState('')
    const [reviewNoteError, setReviewNoteError] = useState('')
  if (!request && !loading) return null

  const isPending =
    String(request?.status || '').toUpperCase() === 'PENDING'

  const isCEO = userRole === 'CEO'

  const formatDate = (date) => {
    if (!date) return '—'

    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div className="fixed inset-0 z-[9999] flex h-full w-full items-center justify-center overflow-hidden bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[24px] bg-white p-8 shadow-lg">

        {/* Header */}
        <div className="mb-6 flex items-start justify-between border-b border-[#e5e7eb] pb-5">
          <div>
            <h2 className="text-[24px] font-black text-[#111827]">
              Disposal Request Details
            </h2>

            <p className="mt-1 text-[13px] font-medium text-[#6b7280]">
              View asset disposal request information
            </p>
          </div>

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            disabled={actionLoading}
            aria-label="Close disposal request details"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#6b7280] transition hover:bg-[#f3f4f6] hover:text-[#111827] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 6l12 12M18 6L6 18"
              />
            </svg>
          </button>
        </div>

        {/* Body */}
        {loading ? (
          <div className="py-10 text-center text-[14px] font-medium text-[#6b7280]">
            Loading request details...
          </div>
        ) : (
          <div className="space-y-6">

            {/* Request Information */}
            <div>
              <h3 className="mb-4 text-[12px] font-extrabold uppercase tracking-wide text-[#6b7280]">
                Request Information
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <DetailItem
                  label="Request ID"
                  value={request.id}
                />

                <DetailItem
                  label="Date"
                  value={formatDate(request.created_at)}
                />

                <DetailItem
                  label="Asset Type"
                  value={request.asset_type_name}
                />

                <DetailItem
                  label="Asset ID"
                  value={request.asset_tag}
                />

                <DetailItem
                  label="Requested By"
                  value={request.requested_by_name}
                />

                <div>
                  <p className="mb-2 text-[12px] font-bold text-[#6b7280]">
                    Status
                  </p>

                  <AssetStatusBadge status={request.status} />
                </div>

              </div>
            </div>

            {/* Disposal Reason */}
            <div>
              <h3 className="mb-3 text-[12px] font-extrabold uppercase tracking-wide text-[#6b7280]">
                Disposal Reason
              </h3>

              <div className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-4">
                <p className="text-[14px] font-medium text-[#374151]">
                  {request.reason || '—'}
                </p>
              </div>
            </div>

            {/* Approval Information */}
            {!isPending && (
              <div className="space-y-4 border-t border-[#e5e7eb] pt-5">
                <h3 className="text-[12px] font-extrabold uppercase tracking-wide text-[#6b7280]">
                  Approval Information
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                  {/* Approved By */}
                  <div className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-4">
                    <p className="text-[12px] font-bold text-[#6b7280]">
                      Approved By
                    </p>

                    <p className="mt-1 text-[14px] font-bold text-[#111827]">
                      {request.approved_by_name || '—'}
                    </p>
                  </div>

                  {/* Approved Date */}
                  <div className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-4">
                    <p className="text-[12px] font-bold text-[#6b7280]">
                      Approved Date
                    </p>

                    <p className="mt-1 text-[14px] font-bold text-[#111827]">
                      {formatDate(request.approved_at)}
                    </p>
                  </div>

                </div>

                {/* Disposed Date */}
                <div className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-4">
                  <p className="text-[12px] font-bold text-[#6b7280]">
                    Disposed Date
                  </p>

                  <p className="mt-1 text-[14px] font-bold text-[#111827]">
                    {formatDate(request.disposed_at)}
                  </p>
                </div>

                {/* Review Note */}
{request.review_note && (
  <div className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-4">
    <p className="text-[12px] font-bold text-[#6b7280]">
      Review Note
    </p>

    <p className="mt-1 text-[14px] font-medium text-[#374151]">
      {request.review_note}
    </p>
  </div>
)}
              </div>
            )}
          </div>
        )}
        {actionError && (
  <div className="mt-6 rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3">
    <p className="text-[13px] font-semibold text-[#dc2626]">
      {actionError}
    </p>
  </div>
)}
{/* Review Note */}
{!loading && isPending && isCEO && (
  <div className="mt-6">
    <label className="mb-2 block text-[12px] font-bold text-[#6b7280]">
      Review Note
    </label>

    <textarea
      value={reviewNote}
     onChange={(event) => {
  setReviewNote(event.target.value)
  setReviewNoteError('')
}}
      placeholder="Enter review note"
      rows={3}
      disabled={actionLoading}
      className="w-full resize-none rounded-xl border border-[#e5e7eb] bg-white px-4 py-3 text-[14px] font-medium text-[#111827] outline-none transition focus:border-[#3b82f6]"
    />
    
    {reviewNoteError && (
  <p className="mt-2 text-[12px] font-semibold text-[#dc2626]">
    {reviewNoteError}
  </p>
)}
  </div>
  
)}
        {/* CEO Actions - Pending only */}
        {!loading && isPending && isCEO && (
          <div className="mt-8 flex gap-4">

            {/* Reject */}
            <button
              type="button"
              onClick={() => {
  if (!reviewNote.trim()) {
    setReviewNoteError(
      'Review note is required when rejecting.',
    )
    return
  }

  setReviewNoteError('')

  onReject({
    review_note: reviewNote.trim(),
  })
}}
              disabled={actionLoading}
              className="flex-1 rounded-full bg-[#fee2e2] px-6 py-3 text-[14px] font-bold text-[#dc2626] transition-all hover:bg-[#fecaca] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {actionLoading ? 'Processing...' : 'Reject'}
            </button>

            {/* Approve */}
            <button
              type="button"
              onClick={() => {
  if (!reviewNote.trim()) {
    setReviewNoteError('Review note is required when approving.')
    return
  }

  setReviewNoteError('')

  onApprove({
    review_note: reviewNote.trim(),
  })
}}
              disabled={actionLoading}
              className="flex-1 rounded-full bg-[#ccfbf1] px-6 py-3 text-[14px] font-bold text-[#0d9488] transition-all hover:bg-[#99f6e4] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {actionLoading ? 'Processing...' : 'Approve'}
            </button>

          </div>
        )}

      </div>
    </div>
  )
}

function DetailItem({ label, value }) {
  return (
    <div>
      <p className="text-[12px] font-bold text-[#6b7280]">
        {label}
      </p>

      <p className="mt-1 text-[14px] font-bold text-[#111827]">
        {value ?? '—'}
      </p>
    </div>
  )
}

export default DisposalRequestDetailsModal