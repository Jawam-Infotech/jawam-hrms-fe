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
import LeaveApprovalHistory from './LeaveApprovalHistory.jsx'
import LeaveReviewActionButtons from './LeaveReviewActionButtons.jsx'


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
              ========================= */}

          <LeaveApprovalHistory
            leaveHistory={leaveHistory}
            historyLoading={historyLoading}
            historyError={historyError}
            historyCount={historyCount}
            historyPreviousPage={historyPreviousPage}
            historyNextPage={historyNextPage}
            onHistoryPageChange={onHistoryPageChange}
          />


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


        {/* ACTION BUTTONS */}
        <LeaveReviewActionButtons
          isPending={isPending}
          isCancellationRequested={isCancellationRequested}
          canReviewCancellation={canReviewCancellation}
          actionLoading={actionLoading}
          reviewAction={reviewAction}
          onReject={handleReject}
          onOpenPartialApproval={handleOpenPartialApproval}
          onAccept={handleAccept}
          onRejectCancellation={handleRejectCancellation}
          onApproveCancellation={handleApproveCancellation}
        />

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