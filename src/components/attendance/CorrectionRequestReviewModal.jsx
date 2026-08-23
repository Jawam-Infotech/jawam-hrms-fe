import { useState } from 'react'
import {
  Check,
  Clock3,
  Loader2,
  MessageSquare,
  X,
} from 'lucide-react'

import Button from '../ui/Button.jsx'
import { approveCorrectionRequest, rejectCorrectionRequest } from '../../services/attendanceService.js'


function formatTimeForInput(value) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return String(value).slice(0, 5)
  }

  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}


function createInitialBreaks(correctionRequest) {
  const breakItems = Array.isArray(
    correctionRequest?.break_items,
  )
    ? correctionRequest.break_items
    : []

  return breakItems.map((breakItem) => ({
    id: breakItem.id,
    break_start: formatTimeForInput(
      breakItem.proposed_break_start,
    ),
    break_end: formatTimeForInput(
      breakItem.proposed_break_end,
    ),
  }))
}


function CorrectionRequestReviewModal({
  isOpen,
  onClose,
  correctionRequest,
  onSuccess,
}) {
  const [reviewComment, setReviewComment] = useState(
    correctionRequest?.review_comment || '',
  )

  const [reviewCommentError, setReviewCommentError] =
    useState('')

  const [editedCheckIn, setEditedCheckIn] = useState(() =>
    formatTimeForInput(
      correctionRequest?.proposed_check_in,
    ),
  )

  const [editedCheckOut, setEditedCheckOut] =
    useState(() =>
      formatTimeForInput(
        correctionRequest?.proposed_check_out,
      ),
    )

  const [editedBreaks, setEditedBreaks] = useState(
    () => createInitialBreaks(correctionRequest),
  )

  const [isSubmitting, setIsSubmitting] =
    useState(false)

  if (!isOpen) return null

  if (!correctionRequest) return null


  const handleApprove = async () => {
    setReviewCommentError('')
    setIsSubmitting(true)

    try {
      await approveCorrectionRequest(
        correctionRequest.id,
        {
          checkIn: editedCheckIn,
          checkOut: editedCheckOut,
          breaks: editedBreaks,
          reviewComment: reviewComment.trim(),
        },
      )

      onSuccess?.()
      onClose()
    } catch (error) {
      setReviewCommentError(
        error?.message ||
          'Failed to approve correction request.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }


  const handleReject = async () => {
    const trimmedComment =
      reviewComment.trim()

    if (!trimmedComment) {
      setReviewCommentError(
        'A review comment is required to reject this request.',
      )
      return
    }

    setReviewCommentError('')
    setIsSubmitting(true)

    try {
      await rejectCorrectionRequest(
        correctionRequest.id,
        {
          reviewComment: trimmedComment,
        },
      )

      onSuccess?.()
      onClose()
    } catch (error) {
      setReviewCommentError(
        error?.message ||
          'Failed to reject correction request.',
      )
    } finally {
      setIsSubmitting(false)
    }
  }


  const handleBreakChange = (
    breakId,
    field,
    value,
  ) => {
    setEditedBreaks((currentBreaks) =>
      currentBreaks.map((breakItem) =>
        breakItem.id === breakId
          ? {
              ...breakItem,
              [field]: value,
            }
          : breakItem,
      ),
    )
  }


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Review Correction Request
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Review and update the requested attendance correction.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>


        <div className="space-y-6 p-6">

          {/* Employee information */}
          <div className="rounded-xl border border-gray-200 p-4">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gray-900">
              <MessageSquare size={16} />
              Request Details
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-gray-500">
                  Employee
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900">
                  {correctionRequest.employeeName ||
                    correctionRequest.user?.first_name ||
                    '--'}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Date
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900">
                  {correctionRequest.date ||
                    correctionRequest.attendance_date ||
                    '--'}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Requested On
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900">
                  {correctionRequest.created_at
                    ? new Date(
                        correctionRequest.created_at,
                      ).toLocaleString()
                    : '--'}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-500">
                  Status
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900">
                  {correctionRequest.status || 'Pending'}
                </p>
              </div>
            </div>
          </div>


          {/* Check in / Check out */}
          <div className="rounded-xl border border-gray-200 p-4">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-900">
              <Clock3 size={16} />
              Attendance Time
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-xs font-medium text-gray-600">
                  Check In
                </span>

                <input
                  type="time"
                  value={editedCheckIn}
                  onChange={(event) =>
                    setEditedCheckIn(
                      event.target.value,
                    )
                  }
                  disabled={isSubmitting}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-xs font-medium text-gray-600">
                  Check Out
                </span>

                <input
                  type="time"
                  value={editedCheckOut}
                  onChange={(event) =>
                    setEditedCheckOut(
                      event.target.value,
                    )
                  }
                  disabled={isSubmitting}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                />
              </label>
            </div>
          </div>


          {/* Breaks */}
          {editedBreaks.length > 0 && (
            <div className="rounded-xl border border-gray-200 p-4">
              <h3 className="mb-4 text-sm font-semibold text-gray-900">
                Breaks
              </h3>

              <div className="space-y-3">
                {editedBreaks.map(
                  (breakItem, index) => (
                    <div
                      key={
                        breakItem.id ??
                        `break-${index}`
                      }
                      className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                    >
                      <label className="block">
                        <span className="mb-1 block text-xs font-medium text-gray-600">
                          Break Start
                        </span>

                        <input
                          type="time"
                          value={
                            breakItem.break_start
                          }
                          onChange={(event) =>
                            handleBreakChange(
                              breakItem.id,
                              'break_start',
                              event.target.value,
                            )
                          }
                          disabled={isSubmitting}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                        />
                      </label>

                      <label className="block">
                        <span className="mb-1 block text-xs font-medium text-gray-600">
                          Break End
                        </span>

                        <input
                          type="time"
                          value={
                            breakItem.break_end
                          }
                          onChange={(event) =>
                            handleBreakChange(
                              breakItem.id,
                              'break_end',
                              event.target.value,
                            )
                          }
                          disabled={isSubmitting}
                          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
                        />
                      </label>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}


          {/* Review comment */}
          <div className="rounded-xl border border-gray-200 p-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-gray-900">
                Review Comment
              </span>

              <textarea
                value={reviewComment}
                onChange={(event) => {
                  setReviewComment(
                    event.target.value,
                  )

                  if (
                    reviewCommentError
                  ) {
                    setReviewCommentError('')
                  }
                }}
                rows={4}
                disabled={isSubmitting}
                placeholder="Add a comment..."
                className="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
              />

              {reviewCommentError && (
                <p className="mt-2 text-sm text-red-600">
                  {reviewCommentError}
                </p>
              )}
            </label>
          </div>
        </div>


        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t bg-gray-50 px-6 py-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="danger"
            onClick={handleReject}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2
                size={16}
                className="animate-spin"
              />
            ) : (
              <X size={16} />
            )}

            Reject
          </Button>

          <Button
            type="button"
            onClick={handleApprove}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Loader2
                size={16}
                className="animate-spin"
              />
            ) : (
              <Check size={16} />
            )}

            Approve
          </Button>
        </div>
      </div>
    </div>
  )
}

export default CorrectionRequestReviewModal