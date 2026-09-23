import { useState } from 'react'
import AssetStatusBadge from './AssetStatusBadge'
import RequestModalActions from './request-details/RequestModalActions'

function InventoryRequestDetailsModal({
  request,
  loading = false,
  onClose,
  onApprove,
  onReject,
  onReceive,
  actionLoading = false,
  actionError = '',
  userRole,
}) {
  const [approvedQuantity, setApprovedQuantity] = useState('')
  const [reviewNote, setReviewNote] = useState('')


  if (!request && !loading) return null

  const isPending = request?.status === 'PENDING'
  const isApproved = request?.status === 'APPROVED'

  const isCEO = userRole === 'CEO'
  const isHR = userRole === 'HR'

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
              Inventory Request Details
            </h2>

            <p className="mt-1 text-[13px] font-medium text-[#6b7280]">
              View inventory request information
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={actionLoading}
            aria-label="Close inventory request details"
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

                {/* Request ID */}
                <div>
                  <p className="text-[12px] font-bold text-[#6b7280]">
                    Request ID
                  </p>

                  <p className="mt-1 text-[14px] font-bold text-[#111827]">
                    {request.id || '—'}
                  </p>
                </div>

                {/* Date */}
                <div>
                  <p className="text-[12px] font-bold text-[#6b7280]">
                    Date
                  </p>

                  <p className="mt-1 text-[14px] font-bold text-[#111827]">
                    {formatDate(request.created_at)}
                  </p>
                </div>

                {/* Asset Type */}
                <div>
                  <p className="text-[12px] font-bold text-[#6b7280]">
                    Asset Type
                  </p>

                  <p className="mt-1 text-[14px] font-bold text-[#111827]">
                    {request.asset_type_name || '—'}
                  </p>
                </div>

                {/* Requested Quantity */}
                <div>
                  <p className="text-[12px] font-bold text-[#6b7280]">
                    Requested Quantity
                  </p>

                  <p className="mt-1 text-[14px] font-bold text-[#111827]">
                    {request.quantity ?? '—'}
                  </p>
                </div>

                {/* Approved Quantity */}
                {!isPending && (
                  <div>
                    <p className="text-[12px] font-bold text-[#6b7280]">
                      Approved Quantity
                    </p>

                    <p className="mt-1 text-[14px] font-bold text-[#111827]">
                      {request.approved_quantity ?? '—'}
                    </p>
                  </div>
                )}

                {/* Requested By */}
                <div>
                  <p className="text-[12px] font-bold text-[#6b7280]">
                    Requested By
                  </p>

                  <p className="mt-1 text-[14px] font-bold text-[#111827]">
                    {request.requested_by_name || '—'}
                  </p>
                </div>

                {/* Status */}
                <div>
                  <p className="mb-2 text-[12px] font-bold text-[#6b7280]">
                    Status
                  </p>

                  <AssetStatusBadge status={request.status} />
                </div>

                {/* Received Date */}
                {!isPending && (
                  <div>
                    <p className="text-[12px] font-bold text-[#6b7280]">
                      Received Date
                    </p>

                    <p className="mt-1 text-[14px] font-bold text-[#111827]">
                      {formatDate(request.received_at)}
                    </p>
                  </div>
                )}

              </div>
            </div>

            {/* Reason */}
            <div>
              <h3 className="mb-3 text-[12px] font-extrabold uppercase tracking-wide text-[#6b7280]">
                Reason
              </h3>

              <div className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-4">
                <p className="text-[14px] font-medium text-[#374151]">
                  {request.reason || '—'}
                </p>
              </div>
            </div>

            {/* CEO Review */}
            {isPending && isCEO && (
              <div className="space-y-4 border-t border-[#e5e7eb] pt-5">
                <h3 className="text-[12px] font-extrabold uppercase tracking-wide text-[#6b7280]">
                  CEO Review
                </h3>

                {/* Approved Quantity */}
                <div>
                  <label className="mb-2 block text-[12px] font-bold text-[#6b7280]">
                    Approved Quantity
                  </label>

                  <input
                    type="number"
                    min="1"
                    max={request.quantity}
                    value={approvedQuantity}
                    onChange={(event) =>
                      setApprovedQuantity(event.target.value)
                    }
                    disabled={actionLoading}
                    className="w-full rounded-xl border border-[#e5e7eb] bg-white px-4 py-3 text-[14px] font-medium text-[#111827] outline-none transition focus:border-[#111827] disabled:cursor-not-allowed disabled:bg-[#f9fafb]"
                  />

                  <p className="mt-1 text-[12px] font-medium text-[#6b7280]">
                    Maximum allowed: {request.quantity}
                  </p>
                </div>

                {/* Review Note */}
                <div>
                  <label className="mb-2 block text-[12px] font-bold text-[#6b7280]">
                    Review Note
                  </label>

                  <textarea
                    rows={3}
                    value={reviewNote}
                    onChange={(event) =>
                      setReviewNote(event.target.value)
                    }
                    placeholder="Add a review note..."
                    disabled={actionLoading}
                    className="w-full resize-none rounded-xl border border-[#e5e7eb] bg-white px-4 py-3 text-[14px] font-medium text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#111827] disabled:cursor-not-allowed disabled:bg-[#f9fafb]"
                  />
                </div>
              </div>
            )}

            {/* Review Information */}
            {!isPending && (
              <div className="space-y-4 border-t border-[#e5e7eb] pt-5">
                <h3 className="text-[12px] font-extrabold uppercase tracking-wide text-[#6b7280]">
                  Review Information
                </h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                  {/* Reviewed By */}
                  <div className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-4">
                    <p className="text-[12px] font-bold text-[#6b7280]">
                      Reviewed By
                    </p>

                    <p className="mt-1 text-[14px] font-bold text-[#111827]">
                      {request.reviewed_by_name || '—'}
                    </p>
                  </div>

                  {/* Reviewed Date */}
                  <div className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-4">
                    <p className="text-[12px] font-bold text-[#6b7280]">
                      Reviewed Date
                    </p>

                    <p className="mt-1 text-[14px] font-bold text-[#111827]">
                      {formatDate(request.reviewed_at)}
                    </p>
                  </div>

                </div>

                {/* Review Note */}
                <div className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-4">
                  <p className="text-[12px] font-bold text-[#6b7280]">
                    Review Note
                  </p>

                  <p className="mt-1 text-[14px] font-medium text-[#374151]">
                    {request.review_note || '—'}
                  </p>
                </div>
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

        {/* CEO Pending Actions */}
        {!loading && isPending && isCEO && (
          <RequestModalActions
            mode="INVENTORY_PENDING"
            onReject={() =>
  onReject?.({
    review_note: reviewNote.trim(),
  })
}
            onApprove={() =>
              onApprove?.({
                approved_quantity: Number(approvedQuantity),
                review_note: reviewNote.trim(),
              })
            }
            onBack={onClose}
          />
        )}

        {/* HR Approved - Receive Inventory */}
        {!loading && isApproved && isHR && (
  <div className="mt-8 flex justify-end">
    <button
      type="button"
      onClick={onReceive}
      disabled={actionLoading}
      className="relative min-w-[170px] rounded-full bg-[#ccfbf1] px-6 py-3 text-[14px] font-bold text-[#0d9488] transition-all hover:bg-[#99f6e4] disabled:cursor-not-allowed disabled:opacity-50"
    >
      <span className={actionLoading ? 'invisible' : 'visible'}>
        Receive Inventory
      </span>

      {actionLoading && (
        <span className="absolute inset-0 flex items-center justify-center">
          Receiving...
        </span>
      )}
    </button>
  </div>
)}

      </div>
    </div>
  )
}

export default InventoryRequestDetailsModal