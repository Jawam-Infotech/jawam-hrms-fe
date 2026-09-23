import { useEffect, useState } from 'react'
import RequestInformation from './request-details/RequestInformation'
import RequestReason from './request-details/RequestReason'
import LostAssetAttachment from './request-details/LostAssetAttachment'
import NewAssetAssignment from './request-details/NewAssetAssignment'
import RequestReviewComment from './request-details/RequestReviewComment'
import RequestModalActions from './request-details/RequestModalActions'
import ReplacementAssetSelection from './request-details/ReplacementAssetSelection'

function AssetRequestDetailsModal({
  isOpen,
  request,
  onClose,
  onApprove,
  onProcess,
  onOpenOldAssetAction,
  onReject,
  availableAssets,
  actionError,
}) {
  const [isAssigning, setIsAssigning] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState(null)
  const [reviewComment, setReviewComment] = useState('')
  const [reviewCommentError, setReviewCommentError] = useState('')
  const [reviewAction, setReviewAction] = useState(null)

  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])


  if (!isOpen || !request) return null

  const requestType =
    request.request_type_display || request.request_type

  const status = request.status || 'PENDING'
  const displayStatus = status

  const isNewAssetRequest =
    request.request_type === 'REQUEST_ASSET' ||
    requestType === 'New Asset' ||
    requestType === 'Request Asset'

  const isReplaceRequest =
    request.request_type === 'REPLACE_ASSET' ||
    requestType === 'Replace Asset'

  const isLostRequest =
    request.request_type === 'REPORT_LOST' ||
    requestType === 'Report Lost Asset'

  const shouldShowAssignment =
  isNewAssetRequest && status === 'APPROVED'

  const getStatusClass = () => {
    if (
      displayStatus === 'APPROVED' ||
      displayStatus === 'COMPLETED'
    ) {
      return 'bg-[#dcfce7] text-[#16a34a]'
    }

    if (displayStatus === 'REJECTED') {
      return 'bg-[#fee2e2] text-[#dc2626]'
    }

    if (displayStatus === 'PROCESSING') {
      return 'bg-[#dbeafe] text-[#2563eb]'
    }

    return 'bg-[#fef3c7] text-[#d97706]'
  }

  const getDispositionLabel = (disposition) => {
    if (disposition === 'RETURN_TO_POOL') {
      return 'Return to Pool'
    }

    if (disposition === 'SEND_TO_MAINTENANCE') {
      return 'Send to Maintenance'
    }

    return '—'
  }

  const formatReviewedAt = (date) => {
    if (!date) return '—'

    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  /*
   * =========================
   * APPROVE
   * =========================
   */

  const handleApprove = () => {
  const trimmedComment = reviewComment.trim()

  if (isNewAssetRequest) {
  if (status === 'APPROVED') {
    setIsAssigning(true)
    return
  }

onApprove?.({
  ...request,
  review_note: trimmedComment,
})

return
}

  if (
  isReplaceRequest &&
  status === 'PROCESSING'
) {
  if (!selectedAsset) {
    setReviewAction('approve')
    setReviewCommentError(
      'Select a replacement asset before continuing.',
    )
    return
  }

  onOpenOldAssetAction?.({
    ...request,
    replacement_asset_id: selectedAsset.id,
    review_note: trimmedComment,
  })

  return
}

  if (
    status === 'PENDING' &&
    !isNewAssetRequest &&
    !isReplaceRequest
  ) {
    onApprove?.({
      ...request,
      review_note: trimmedComment,
    })
    return
  }

  if (
  isReplaceRequest &&
  status === 'PENDING'
) {
  Promise.resolve(
    onProcess?.(request),
  )
    .then(() => {
      setReviewCommentError('')
    })
    .catch((error) => {
      setReviewCommentError(
        error?.response?.data?.detail ||
          error?.message ||
          'Unable to process this replacement request.',
      )
    })

  return
}

  onApprove?.({
    ...request,
    review_note: trimmedComment,
  })
}

  /*
   * =========================
   * REJECT
   * =========================
   */

  const handleReject = () => {
    const trimmedComment = reviewComment.trim()

    if (!trimmedComment) {
      setReviewAction('reject')
      setReviewCommentError(
        'A review comment is required to reject this asset request.',
      )
      return
    }

    setReviewCommentError('')

    onReject?.({
      ...request,
      comment: trimmedComment,
    })
  }

  /*
   * =========================
   * BACK
   * =========================
   */

  const handleBack = () => {
    if (isNewAssetRequest && isAssigning) {
      setIsAssigning(false)
      setSelectedAsset(null)
    }
  }

  /*
   * =========================
   * ASSIGN ASSET
   * =========================
   */

  const handleAssignAsset = () => {
    if (!selectedAsset) return

    onApprove?.({
      ...request,
      asset_id: selectedAsset.id,
    })
  }

  return (
    <div className="fixed inset-0 z-[9999] flex h-full w-full items-center justify-center overflow-hidden bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[24px] bg-white p-8 shadow-lg">

        {/* Header */}
        <div className="mb-6 flex items-start justify-between border-b border-[#e5e7eb] pb-5">
          <div>
            <h2 className="text-[24px] font-black text-[#111827]">
              Request Details
            </h2>

            <p className="mt-1 text-[13px] font-medium text-[#6b7280]">
              {isAssigning
                ? 'Assign an available asset to the employee'
                : status === 'PROCESSING'
                  ? 'Continue the replacement request'
                  : 'Review asset request information'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`rounded-full px-4 py-2 text-[12px] font-bold ${getStatusClass()}`}
            >
              {isAssigning ? 'ASSIGN ASSET' : displayStatus}
            </span>

            <button
              type="button"
              onClick={() => {
  setIsAssigning(false)
  setSelectedAsset(null)
  setReviewComment('')
  setReviewCommentError('')
  setReviewAction(null)
  onClose()
}}
              aria-label="Close request details"
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#6b7280] transition hover:bg-[#f3f4f6] hover:text-[#111827]"
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
        </div>

        <div className="space-y-6">

          {/* Request Information */}
          <RequestInformation
            request={request}
            requestType={requestType}
            status={displayStatus}
          />

          {/* Reason */}
          <RequestReason reason={request.reason} />

          {/* Replacement Details */}
          {isReplaceRequest && status === 'COMPLETED' && (
            <div className="space-y-4 border-t border-[#e5e7eb] pt-5">
              <h3 className="text-[12px] font-extrabold uppercase tracking-wide text-[#6b7280]">
                Replacement Details
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-4">
                  <p className="text-[12px] font-bold text-[#6b7280]">
                    Old Asset
                  </p>
                  <p className="mt-1 text-[14px] font-bold text-[#111827]">
                    {request.old_asset_tag || '—'}
                  </p>
                </div>

                <div className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-4">
                  <p className="text-[12px] font-bold text-[#6b7280]">
                    Replacement Asset
                  </p>
                  <p className="mt-1 text-[14px] font-bold text-[#111827]">
                    {request.replacement_asset_tag || '—'}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-4">
                <p className="text-[12px] font-bold text-[#6b7280]">
                  Old Asset Disposition
                </p>
                <p className="mt-1 text-[14px] font-bold text-[#111827]">
                  {getDispositionLabel(
                    request.old_asset_disposition,
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Lost Attachment */}
          {isLostRequest && (
            <LostAssetAttachment request={request} />
          )}

          {/* Replacement Asset Selection */}
{isReplaceRequest && status === 'PROCESSING' && (
            <ReplacementAssetSelection
              assetTypeName={request.asset_type_name}
              availableAssets={availableAssets}
              selectedAsset={selectedAsset}
              onSelectAsset={setSelectedAsset}
            />
          )}

          {/* Assign Asset */}
          {shouldShowAssignment && (
            <NewAssetAssignment
              assetTypeName={request.asset_type_name}
              availableAssets={availableAssets}
              selectedAsset={selectedAsset}
              onSelectAsset={setSelectedAsset}
            />
          )}

          {/* Review Comment for Pending Request */}
          {status === 'PENDING' && (
            <RequestReviewComment
              value={reviewComment}
              required={reviewAction === 'reject'}
              error={reviewCommentError}
              onChange={(value) => {
                setReviewComment(value)
                setReviewCommentError('')
              }}
            />
          )}

          {/* Review Information */}
          {(
            status === 'COMPLETED' ||
            status === 'REJECTED'
          ) && (
            <div className="space-y-4 border-t border-[#e5e7eb] pt-5">
              <h3 className="text-[12px] font-extrabold uppercase tracking-wide text-[#6b7280]">
                Review Information
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-4">
                  <p className="text-[12px] font-bold text-[#6b7280]">
                    Reviewed By
                  </p>
                  <p className="mt-1 text-[14px] font-bold text-[#111827]">
                    {request.reviewed_by_name || '—'}
                  </p>
                </div>

                <div className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-4">
                  <p className="text-[12px] font-bold text-[#6b7280]">
                    Reviewed At
                  </p>
                  <p className="mt-1 text-[14px] font-bold text-[#111827]">
                    {formatReviewedAt(request.reviewed_at)}
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-[12px] font-bold text-[#6b7280]">
                  Review Note
                </p>

                <div className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3">
                  <p className="text-[14px] font-medium text-[#374151]">
                    {request.review_note || 'No review note provided.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
        {actionError && (
  <div className="mt-6 rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3">
    <p className="text-[13px] font-semibold text-[#dc2626]">
      {actionError}
    </p>
  </div>
)}

        {/* Footer Actions */}
        <RequestModalActions
          mode={
  isNewAssetRequest && status === 'APPROVED'
    ? 'ASSIGN_ASSET'
    : isReplaceRequest && status === 'PROCESSING'
      ? 'REPLACE_PROCESSING'
      : isReplaceRequest && status === 'PENDING'
        ? 'REPLACE_PENDING'
        : !isNewAssetRequest && status === 'PROCESSING'
          ? 'PROCESSING'
          : displayStatus === 'PENDING'
            ? 'PENDING'
            : 'NONE'
}
          selectedAsset={selectedAsset}
          onReject={handleReject}
          onApprove={handleApprove}
          onBack={handleBack}
          onAssignAsset={handleAssignAsset}
          onContinue={handleApprove}        />
      </div>
    </div>
  )
}

export default AssetRequestDetailsModal
