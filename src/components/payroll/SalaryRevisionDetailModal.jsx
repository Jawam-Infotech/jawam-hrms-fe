import { useState } from 'react'
import RequestReason from '../assets/request-details/RequestReason.jsx'
import RequestReviewComment from '../assets/request-details/RequestReviewComment.jsx'
import { getApiErrorMessage } from '../../utils/apiErrorMessage.js'

function SalaryRevisionDetailModal({
  isOpen,
  revision,
  onClose,
  onApprove,
  onReject,
  loading,
  error,
  actionLoading,
  actionError,
  canReview = false,
}) {
  const [reviewComment, setReviewComment] = useState('')
  const [reviewCommentError, setReviewCommentError] = useState('')
  const [reviewAction, setReviewAction] = useState(null)

  if (!isOpen || !revision) {
    return null
  }

  const status = revision.status || 'PENDING'
  const isPending = status === 'PENDING'
  const isApproved = status === 'APPROVED'
  const isRejected = status === 'REJECTED'

  const getStatusClass = () => {
    if (status === 'APPROVED') {
      return 'bg-[#dcfce7] text-[#16a34a]'
    }

    if (status === 'REJECTED') {
      return 'bg-[#fee2e2] text-[#dc2626]'
    }

    if (status === 'CANCELLED') {
      return 'bg-[#e5e7eb] text-[#4b5563]'
    }

    return 'bg-[#fef3c7] text-[#d97706]'
  }

  const formatDate = (value) => {
    if (!value) {
      return '—'
    }

    return new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const formatDateTime = (value) => {
    if (!value) {
      return '—'
    }

    return new Date(value).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const handleApprove = async () => {
    setReviewAction('approve')
    setReviewCommentError('')

    try {
      await onApprove?.(revision.id)
    } catch {
      // Parent hook stores the API error.
    } finally {
      setReviewAction(null)
    }
  }

  const handleReject = async () => {
    const trimmedReason = reviewComment.trim()

    if (!trimmedReason) {
      setReviewAction('reject')
      setReviewCommentError(
        'A rejection reason is required to reject this salary revision.'
      )
      return
    }

    setReviewCommentError('')

    try {
      await onReject?.(revision.id, trimmedReason)
      setReviewComment('')
    } catch {
      // Parent hook stores the API error.
    } finally {
      setReviewAction(null)
    }
  }

  const handleClose = () => {
    if (actionLoading) {
      return
    }

    setReviewComment('')
    setReviewCommentError('')
    setReviewAction(null)
    onClose()
  }

  const getErrorMessage = (requestError) => {
    return getApiErrorMessage(
      requestError,
      'Unable to load salary revision details.'
    )
  }

  return (
    <div className="fixed inset-0 z-[9999] flex h-full w-full items-center justify-center overflow-hidden bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[24px] bg-white p-8 shadow-lg">

        {/* Header */}
        <div className="mb-6 flex items-start justify-between border-b border-[#e5e7eb] pb-5">
          <div>
            <h2 className="text-[24px] font-black text-[#111827]">
              Salary Revision Details
            </h2>

            <p className="mt-1 text-[13px] font-medium text-[#6b7280]">
              Review salary revision request information
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`rounded-full px-4 py-2 text-[12px] font-bold ${getStatusClass()}`}
            >
              {status}
            </span>

            <button
              type="button"
              onClick={handleClose}
              disabled={actionLoading}
              aria-label="Close salary revision details"
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
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-12 text-center">
            <p className="text-[14px] font-medium text-[#6b7280]">
              Loading salary revision details...
            </p>
          </div>
        )}

        {/* Detail Content */}
        {!loading && !error && (
          <div className="space-y-6">

            {/* Revision Information */}
            <section className="space-y-4">
              <h3 className="mb-4 text-[16px] font-bold text-[#111827]">
                Revision Information
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">

                <DetailCard
                  label="Employee"
                  value={revision.employee_name || '—'}
                />

                <DetailCard
                  label="Employee ID"
                  value={revision.employee ?? '—'}
                />

                <DetailCard
                  label="Monthly Salary"
                  value={
                    revision.monthly_salary
                      ? `₹${revision.monthly_salary}`
                      : '—'
                  }
                />

                <DetailCard
                  label="Annual CTC"
                  value={revision.annual_ctc ?? '—'}
                />

                <DetailCard
                  label="Effective From"
                  value={formatDate(revision.effective_from)}
                />

                <DetailCard
                  label="Revision ID"
                  value={`#${revision.id}`}
                />

                <DetailCard
                  label="Status"
                  value={status}
                />

              </div>
            </section>

            {/* Request Information */}
            <section className="space-y-4 border-t border-[#e5e7eb] pt-5">
              <h3 className="mb-4 text-[16px] font-bold text-[#111827]">
                Request Information
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <DetailCard
                  label="Requested By"
                  value={revision.requested_by_name || '—'}
                />

                <DetailCard
                  label="Created At"
                  value={formatDateTime(revision.created_at)}
                />

                <DetailCard
                  label="Updated At"
                  value={formatDateTime(revision.updated_at)}
                />

              </div>

              <RequestReason reason={revision.reason} />
            </section>
            {/* Approval Information */}
            {isApproved && (
            <section className="space-y-4 border-t border-[#e5e7eb] pt-5">
                <h3 className="text-[12px] font-extrabold uppercase tracking-wide text-[#6b7280]">
                Approval Information
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <DetailCard
                  label="Approved By"
                  value={revision.approved_by_name || '—'}
                />

                <DetailCard
                  label="Approved At"
                  value={formatDateTime(revision.approved_at)}
                />

              </div>
            </section>
            )}

            {/* Rejection Information */}
            {isRejected && (
            <section className="space-y-4 border-t border-[#e5e7eb] pt-5">
                <h3 className="text-[12px] font-extrabold uppercase tracking-wide text-[#6b7280]">
                Rejection Information
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <DetailCard
                  label="Rejected By"
                  value={revision.rejected_by_name || '—'}
                />

                <DetailCard
                  label="Rejected At"
                  value={formatDateTime(revision.rejected_at)}
                />

              </div>

              <DetailCard
                label="Rejection Reason"
                value={
                  revision.rejection_reason ||
                  'No rejection reason provided.'
                }
                fullWidth
              />
            </section>
            )}

            {/* Review Comment */}
            {isPending && canReview && (
              <RequestReviewComment
                value={reviewComment}
                label="Rejection Reason"
                required={reviewAction === 'reject'}
                error={reviewCommentError}
                onChange={(value) => {
                  setReviewComment(value)
                  setReviewCommentError('')
                }}
              />
            )}

            {/* Detail Error */}
            {error && (
              <div className="rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3">
                <p className="text-[13px] font-semibold text-[#dc2626]">
                  {getErrorMessage(error)}
                </p>
              </div>
            )}

            {/* Action Error */}
            {actionError && (
              <div className="rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3">
                <p className="text-[13px] font-semibold text-[#dc2626]">
                  {getErrorMessage(actionError)}
                </p>
              </div>
            )}

          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-8 flex gap-4">

          {isPending && canReview ? (
            <>
              <button type="button" onClick={handleReject} disabled={actionLoading} className="flex-1 rounded-full bg-[#fee2e2] px-6 py-3 text-[14px] font-bold text-[#dc2626] transition-all hover:bg-[#fecaca] disabled:cursor-not-allowed disabled:opacity-50">
                {reviewAction === 'reject' && actionLoading ? 'Rejecting...' : 'Reject'}
              </button>
              <button type="button" onClick={handleApprove} disabled={actionLoading} className="flex-1 rounded-full bg-[#ccfbf1] px-6 py-3 text-[14px] font-bold text-[#0d9488] transition-all hover:bg-[#99f6e4] disabled:cursor-not-allowed disabled:opacity-50">
                {reviewAction === 'approve' && actionLoading ? 'Approving...' : 'Approve'}
              </button>
            </>
          ) : null}

          <button type="button" onClick={handleClose} disabled={actionLoading} className="flex-1 rounded-full bg-[#f3f4f6] px-6 py-3 text-[14px] font-bold text-[#374151] transition-all hover:bg-[#e5e7eb] disabled:cursor-not-allowed disabled:opacity-50">
            Close
          </button>
        </div>

      </div>
    </div>
  )
}

function DetailCard({ label, value, fullWidth = false }) {
  return (
    <div
      className={`rounded-[14px] border border-[#e5e7eb] bg-[#f9fafb] p-4 ${
        fullWidth ? 'w-full' : ''
      }`}
    >
      <p className="text-[12px] font-semibold text-[#6b7280]">
        {label}
      </p>

      <p className="mt-1 break-words text-[14px] font-bold text-[#111827]">
        {value}
      </p>
    </div>
  )
}

export default SalaryRevisionDetailModal
