import { useState } from 'react'
import { X } from 'lucide-react'

import { LEAVE_STATUS_CONFIG } from '../../constants/leave.js'

import {
  calculateLeaveDays,
  formatLeaveDate,
  formatLeaveDates,
} from '../../utils/leaveUtils.js'

import LeaveRequestStatus from './LeaveRequestStatus.jsx'
import LeaveConflictIndicator from './LeaveConflictIndicator.jsx'
import PartialLeaveCalendarModal from './PartialLeaveCalendarModal.jsx'
import ReviewComment from './ReviewComment.jsx'


function Detail({
  label,
  value,
}) {
  return (
    <div>
      <dt className="text-[12px] font-extrabold uppercase tracking-wide text-[#6b7280]">
        {label}
      </dt>

      <dd className="mt-1 text-[14px] font-medium text-[#111827]">
        {value || '--'}
      </dd>
    </div>
  )
}


function LeaveReviewDetails({
  request,
  onClose,
  onAccept,
  onReject,
  onPartiallyAccept,
  onApproveCancellation,
  onRejectCancellation,
  canReviewCancellation = false,
  actionLoading = false,
  actionError = null,
  leaveHistory = [],
historyLoading = false,
historyError = null,
historyCount = 0,
historyNextPage = null,
historyPreviousPage = null,
onHistoryPageChange,
}) {
  const [reviewComment, setReviewComment] = useState('')
  const [reviewCommentError, setReviewCommentError] = useState('')
  const [reviewAction, setReviewAction] = useState(null)
  const [showPartialCalendar, setShowPartialCalendar] = useState(false)

  if (!request) return null

  const config =
    LEAVE_STATUS_CONFIG[request.status] || {}

  const isPending =
    request.status === 'Pending'

  const isCancellationRequested =
    request.status === 'Cancellation Requested'

  const requestedDays =
    calculateLeaveDays(
      request.startDate,
      request.endDate,
    )

  const approvedDays =
    Array.isArray(request.approvedDates)
      ? request.approvedDates.length
      : 0


  /*
   * =========================
   * REJECT
   * =========================
   */

  const handleReject = async () => {
    if (actionLoading) return

    setReviewAction('reject')

    const trimmedComment =
      reviewComment.trim()

    if (!trimmedComment) {
      setReviewCommentError(
        'A review comment is required to reject a leave request.',
      )

      return
    }

    setReviewCommentError('')

    await onReject({
      reviewComment: trimmedComment,
    })
  }


  /*
   * =========================
   * ACCEPT
   * =========================
   */

  const handleAccept = async () => {
    if (actionLoading) return

    setReviewAction('accept')
    setReviewCommentError('')

    await onAccept({
      reviewComment: reviewComment.trim(),
    })
  }


  /*
   * =========================
   * APPROVE CANCELLATION
   * =========================
   */

  const handleApproveCancellation =
    async () => {
      if (actionLoading) return

      setReviewAction(
        'approveCancellation',
      )

      setReviewCommentError('')

      await onApproveCancellation()
    }


  /*
   * =========================
   * REJECT CANCELLATION
   * =========================
   */

  const handleRejectCancellation =
    async () => {
      if (actionLoading) return

      setReviewAction(
        'rejectCancellation',
      )

      setReviewCommentError('')

      await onRejectCancellation()
    }


  /*
   * =========================
   * OPEN PARTIAL APPROVAL
   * =========================
   */

  const handleOpenPartialApproval = () => {
    if (actionLoading) return

    setReviewAction('partial')
    setReviewCommentError('')
    setShowPartialCalendar(true)
  }


  /*
   * =========================
   * PARTIAL APPROVAL
   * =========================
   */

  const handlePartialApproval =
    async (payload) => {
      if (actionLoading) return

      await onPartiallyAccept(payload)

      setShowPartialCalendar(false)
      setReviewAction(null)
    }


  /*
   * =========================
   * CLOSE
   * =========================
   */

  const handleClose = () => {
    if (actionLoading) return

    setShowPartialCalendar(false)
    setReviewComment('')
    setReviewCommentError('')
    setReviewAction(null)

    onClose()
  }


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl">

        {/* HEADER */}

        <div className="flex items-start justify-between border-b border-[#e5e7eb] px-6 py-5">

          <div>
            <h2 className="text-[20px] font-extrabold text-[#111827]">
              Leave Request
            </h2>

            <div className="mt-2">
              <LeaveRequestStatus
                status={request.status}
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={actionLoading}
            aria-label="Close leave request"
            className="rounded-full p-2 text-[#6b7280] transition hover:bg-[#f3f4f6] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={20} />
          </button>

        </div>


        {/* DETAILS */}

        <div className="overflow-y-auto p-6">

          <dl className="grid gap-5 sm:grid-cols-2">

            <Detail
              label="Employee Name"
              value={request.employeeName}
            />

            <Detail
              label="Department"
              value={request.department}
            />

            <Detail
              label="Leave Type"
              value={request.leaveType}
            />

            {config.showPartialDates ? (
              <>
                <Detail
                  label="Requested Date Range"
                  value={formatLeaveDates(
                    request.startDate,
                    request.endDate,
                  )}
                />

                <Detail
                  label="Approved Dates"
                  value={
                    request.approvedDates
                      ?.map(formatLeaveDate)
                      .join(', ')
                  }
                />

                <Detail
                  label="Rejected Dates"
                  value={
                    request.rejectedDates
                      ?.map(formatLeaveDate)
                      .join(', ')
                  }
                />

                <Detail
                  label="Days Requested"
                  value={requestedDays}
                />

                <Detail
                  label="Days Approved"
                  value={approvedDays}
                />
              </>
            ) : (
              <>
                <Detail
                  label="Start Date"
                  value={formatLeaveDate(
                    request.startDate,
                  )}
                />

                <Detail
                  label="End Date"
                  value={formatLeaveDate(
                    request.endDate,
                  )}
                />

                <Detail
                  label="Days"
                  value={requestedDays}
                />
              </>
            )}

            <Detail
              label="Duration"
              value={request.duration}
            />

            <Detail
              label="Reason"
              value={request.reason}
            />

            {config.showBalance && (
              <Detail
                label="Available Leave Balance"
                value={
    request.availableLeaveBalance == null
      ? '--'
      : `${request.availableLeaveBalance} days`
  }
              />
            )}

            {!isPending &&
              !isCancellationRequested && (
                <>
                  <Detail
                    label={`${config.reviewerLabel} By`}
                    value={request.reviewedBy}
                  />

                  <Detail
                    label={`${config.reviewerLabel} On`}
                    value={formatLeaveDate(
                      request.reviewedOn,
                    )}
                  />

                  <Detail
                    label={
                      config.reviewDetailLabel
                    }
                    value={
                      request[
                        config.reviewDetailKey
                      ]
                    }
                  />
                </>
              )}

          </dl>


          {/* LEAVE CONFLICT */}

          {config.showConflict && (
            <div className="mt-6 border-t border-[#e5e7eb] pt-5">

              <LeaveConflictIndicator
                conflicts={
                  request.conflicts || []
                }
              />

            </div>
          )}

          {/* =========================
    APPROVAL HISTORY
========================== */}

<div className="mt-6 border-t border-[#e5e7eb] pt-5">

  <div className="mb-4">
    <h3 className="text-[16px] font-extrabold text-[#111827]">
      Approval History
    </h3>

    <p className="mt-1 text-[13px] text-[#6b7280]">
      Track all status changes and actions for this leave request.
    </p>
  </div>

  {historyLoading ? (
    <div className="space-y-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="h-20 animate-pulse rounded-[14px] bg-[#f3f4f6]"
        />
      ))}
    </div>
  ) : historyError ? (
    <div
      role="alert"
      className="rounded-[14px] border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-[13px] font-medium text-[#b91c1c]"
    >
      {historyError}
    </div>
  ) : leaveHistory.length === 0 ? (
    <div className="rounded-[14px] border border-dashed border-[#d1d5db] px-4 py-6 text-center">
      <p className="text-[13px] font-semibold text-[#6b7280]">
        No approval history available.
      </p>
    </div>
  ) : (
    <div className="space-y-4">

      {leaveHistory.map((entry, index) => {

        const performedBy =
          entry.performed_by

        const performedByName =
          performedBy
            ? `${performedBy.first_name || ''} ${
                performedBy.last_name || ''
              }`.trim()
            : 'System'

        const performedAt =
          entry.performed_at
            ? new Intl.DateTimeFormat(
                'en-IN',
                {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                },
              ).format(
                new Date(
                  entry.performed_at,
                ),
              )
            : '--'

        return (
          <div
            key={
              entry.id ||
              `${entry.performed_at}-${index}`
            }
            className="relative pl-7"
          >

            {/* TIMELINE DOT */}

            <span className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-[#3b82f6]" />

            {/* TIMELINE LINE */}

            {index <
              leaveHistory.length - 1 && (
              <span className="absolute left-[5px] top-4 h-[calc(100%+1rem)] w-px bg-[#dbeafe]" />
            )}

            <div className="rounded-[14px] border border-[#e5e7eb] bg-[#fafafa] p-4">

              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

                <div>
                  <p className="text-[14px] font-extrabold text-[#111827]">
                    {entry.new_status || '--'}
                  </p>

                  <p className="mt-1 text-[12px] font-medium text-[#6b7280]">
                    {entry.previous_status
                      ? `${entry.previous_status} → ${entry.new_status}`
                      : `Status changed to ${entry.new_status || '--'}`}
                  </p>
                </div>

                <span className="text-[11px] font-semibold text-[#9ca3af]">
                  {performedAt}
                </span>

              </div>


              <div className="mt-3">

                <p className="text-[13px] font-bold text-[#374151]">
                  {performedByName}
                </p>

                {performedBy && (
                  <p className="mt-1 text-[12px] text-[#6b7280]">
                    {[
                      performedBy.designation,
                      performedBy.department,
                    ]
                      .filter(Boolean)
                      .join(' • ') || '--'}
                  </p>
                )}

              </div>


              {entry.note && (
                <div className="mt-3 rounded-xl bg-white p-3">
                  <p className="text-[12px] font-semibold text-[#6b7280]">
                    Note
                  </p>

                  <p className="mt-1 text-[13px] text-[#374151]">
                    {entry.note}
                  </p>
                </div>
              )}

            </div>

          </div>
        )
      })}


      {/* HISTORY PAGINATION */}

      {(historyPreviousPage ||
        historyNextPage) && (
        <div className="flex items-center justify-between border-t border-[#e5e7eb] pt-4">

          <button
            type="button"
            disabled={
              historyLoading ||
              !historyPreviousPage
            }
            onClick={() =>
              onHistoryPageChange?.(
                Math.max(
                  1,
                  Math.ceil(
                    (historyCount -
                      leaveHistory.length) /
                      20,
                  ),
                ),
              )
            }
            className="rounded-full border border-[#d1d5db] px-4 py-2 text-[12px] font-bold text-[#374151] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          <span className="text-[12px] font-semibold text-[#6b7280]">
            {historyCount} history entries
          </span>

          <button
            type="button"
            disabled={
              historyLoading ||
              !historyNextPage
            }
            onClick={() =>
              onHistoryPageChange?.(2)
            }
            className="rounded-full border border-[#d1d5db] px-4 py-2 text-[12px] font-bold text-[#374151] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>

        </div>
      )}

    </div>
  )}

</div>


          {/* REVIEW COMMENT */}

          {isPending && (
            <div className="mt-6 space-y-5 border-t border-[#e5e7eb] pt-5">

              <ReviewComment
                value={reviewComment}
                required={
                  reviewAction === 'reject'
                }
                error={
                  reviewCommentError
                }
                onChange={(value) => {
                  setReviewComment(value)
                  setReviewCommentError('')
                }}
                disabled={actionLoading}
              />

              {actionError && (
                <p
                  role="alert"
                  className="text-[13px] font-medium text-[#dc2626]"
                >
                  {actionError}
                </p>
              )}

            </div>
          )}

        </div>


        {/* NORMAL LEAVE ACTIONS */}

        {isPending && (
          <div className="flex flex-wrap justify-end gap-3 border-t border-[#e5e7eb] px-6 py-5">

            <button
              type="button"
              onClick={handleReject}
              disabled={actionLoading}
              className="rounded-full border border-[#fecaca] px-5 py-2.5 text-[14px] font-bold text-[#dc2626] transition hover:bg-[#fef2f2] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {actionLoading &&
              reviewAction === 'reject'
                ? 'Rejecting...'
                : 'Reject'}
            </button>

            <button
              type="button"
              onClick={
                handleOpenPartialApproval
              }
              disabled={actionLoading}
              className="rounded-full bg-[#f97316] px-5 py-2.5 text-[14px] font-bold text-white transition hover:bg-[#ea580c] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Partial Accept
            </button>

            <button
              type="button"
              onClick={handleAccept}
              disabled={actionLoading}
              className="rounded-full bg-[#16a34a] px-5 py-2.5 text-[14px] font-bold text-white transition hover:bg-[#15803d] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {actionLoading &&
              reviewAction === 'accept'
                ? 'Accepting...'
                : 'Accept'}
            </button>

          </div>
        )}


        {/* CANCELLATION ACTIONS */}

{isCancellationRequested &&
  canReviewCancellation && (
          <div className="flex flex-wrap justify-end gap-3 border-t border-[#e5e7eb] px-6 py-5">

            <button
              type="button"
              onClick={
                handleRejectCancellation
              }
              disabled={actionLoading}
              className="rounded-full border border-[#fecaca] px-5 py-2.5 text-[14px] font-bold text-[#dc2626] transition hover:bg-[#fef2f2] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {actionLoading &&
              reviewAction ===
                'rejectCancellation'
                ? 'Rejecting...'
                : 'Reject Cancellation'}
            </button>

            <button
              type="button"
              onClick={
                handleApproveCancellation
              }
              disabled={actionLoading}
              className="rounded-full bg-[#16a34a] px-5 py-2.5 text-[14px] font-bold text-white transition hover:bg-[#15803d] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {actionLoading &&
              reviewAction ===
                'approveCancellation'
                ? 'Approving...'
                : 'Approve Cancellation'}
            </button>

          </div>
        )}

      </div>


      {/* PARTIAL APPROVAL */}

      {showPartialCalendar && (
        <PartialLeaveCalendarModal
          request={request}
          reviewComment={
            reviewComment
          }
          onReviewCommentChange={
            setReviewComment
          }
          loading={
            actionLoading
          }
          onClose={() => {
            if (!actionLoading) {
              setShowPartialCalendar(false)
              setReviewAction(null)
            }
          }}
          onConfirm={
            handlePartialApproval
          }
        />
      )}

    </div>
  )
}

export default LeaveReviewDetails