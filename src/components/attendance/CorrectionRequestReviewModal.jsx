import {useState } from 'react'
import {
  Check,
  Clock3,
  Loader2,
  MessageSquare,
  X,
} from 'lucide-react'

import Button from '../ui/Button.jsx'

function formatDisplayTime(value) {
  if (!value) return '--'

  const date = new Date(`1970-01-01T${value}`)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

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

function createOriginalBreaks(correctionRequest) {
  const breaks = Array.isArray(
    correctionRequest?.old_snapshot?.breaks,
  )
    ? correctionRequest.old_snapshot.breaks
    : []

  return breaks.map((breakItem, index) => ({
    id: breakItem.id ?? `original-break-${index}`,
    break_start:
      breakItem.break_start ||
      breakItem.start ||
      breakItem.original_break_start ||
      '',
    break_end:
      breakItem.break_end ||
      breakItem.end ||
      breakItem.original_break_end ||
      '',
  }))
}

function Detail({ label, value }) {
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

function CorrectionRequestReviewModal({
  isOpen,
  onClose,
  correctionRequest,
  onApprove,
  onReject,
  onSuccess,
  readOnly = false,
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

  const originalBreaks =
    createOriginalBreaks(correctionRequest)

  if (!isOpen || !correctionRequest) {
    return null
  }

  const originalCheckIn = formatTimeForInput(
    correctionRequest.original_check_in ||
      correctionRequest.check_in ||
      correctionRequest.old_snapshot?.check_in,
  )

  const originalCheckOut = formatTimeForInput(
    correctionRequest.original_check_out ||
      correctionRequest.check_out ||
      correctionRequest.old_snapshot?.check_out,
  )

  const handleApprove = async () => {
    if (correctionRequest?.status !== 'PENDING') {
      setReviewCommentError(
        'This correction request has already been reviewed.',
      )
      return
    }

    setReviewCommentError('')
    setIsSubmitting(true)

    try {
      await onApprove?.(
        correctionRequest.id,
        {
          checkIn: editedCheckIn,
          checkOut: editedCheckOut,
          breaks: editedBreaks.map((breakItem) => ({
            ...breakItem,
            break_start: breakItem.break_start
              ? `${correctionRequest.date}T${breakItem.break_start}:00+05:30`
              : null,
            break_end: breakItem.break_end
              ? `${correctionRequest.date}T${breakItem.break_end}:00+05:30`
              : null,
          })),
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
    if (correctionRequest?.status !== 'PENDING') {
      setReviewCommentError(
        'This correction request has already been reviewed.',
      )
      return
    }

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
      await onReject?.(
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
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl">

        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 py-5">
          <div>
            <h2
              id="attendance-correction-title"
              className="text-[22px] font-black text-[#111827]"
            >
              Review Correction Request
            </h2>

            <p className="mt-1 text-[14px] text-[#6b7280]">
              {readOnly
                ? 'View the details and status of your correction request.'
                : 'Review and update the requested attendance correction.'}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close correction request"
            className="rounded-full p-1 text-[#6b7280] transition hover:bg-[#f3f4f6] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* CONTENT */}

        <div className="overflow-y-auto p-6">

          {/* REQUEST DETAILS */}

          <div>
            <h3 className="mb-4 flex items-center gap-2 text-[16px] font-extrabold text-[#111827]">
              <MessageSquare size={16} />
              Request Details
            </h3>

            <dl className="grid gap-5 sm:grid-cols-2">

              <Detail
                label="Employee Name"
                value={
                  correctionRequest.employeeName ||
                  [
                    correctionRequest.user?.first_name,
                    correctionRequest.user?.last_name,
                  ]
                    .filter(Boolean)
                    .join(' ')
                }
              />

              <Detail
                label="Date"
                value={
                  correctionRequest.date ||
                  correctionRequest.attendance_date
                }
              />

              <Detail
                label="Requested On"
                value={
                  correctionRequest.created_at
                    ? new Date(
                        correctionRequest.created_at,
                      ).toLocaleString()
                    : '--'
                }
              />

              <Detail
                label="Status"
                value={
                  correctionRequest.status ||
                  'Pending'
                }
              />

            </dl>
          </div>

          {/* ATTENDANCE TIME */}

          <div className="mt-6 border-t border-[#e5e7eb] pt-5">

            <h3 className="mb-4 flex items-center gap-2 text-[16px] font-extrabold text-[#111827]">
              <Clock3 size={16} />
              Attendance Time
            </h3>

            <div className="mb-2 grid grid-cols-2 text-[12px] font-extrabold uppercase tracking-wide">
              <span className="text-[#6b7280]">
                Original
              </span>

              <span className="text-[#2563eb]">
                Requested
              </span>
            </div>

            {/* CHECK IN */}

            <div className="grid grid-cols-2 gap-5">

              <div>
                <span className="mb-1 block text-[12px] font-extrabold uppercase tracking-wide text-[#6b7280]">
                  Check In
                </span>

                <div className="rounded-[14px] border border-[#e5e7eb] bg-[#fafafa] px-4 py-3 text-[14px] font-medium text-[#111827]">
                  {formatDisplayTime(originalCheckIn)}
                </div>
              </div>

              <div>
                <span className="mb-1 block text-[12px] font-extrabold uppercase tracking-wide text-[#2563eb]">
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
                  disabled={
                    readOnly || isSubmitting
                  }
                  className="w-full rounded-[14px] border border-[#bfdbfe] bg-white px-4 py-2.5 text-[14px] font-medium text-[#111827] outline-none transition focus:border-[#2563eb]"
                />
              </div>

            </div>

            {/* CHECK OUT */}

            <div className="mt-4 grid grid-cols-2 gap-5">

              <div>
                <span className="mb-1 block text-[12px] font-extrabold uppercase tracking-wide text-[#6b7280]">
                  Check Out
                </span>

                <div className="rounded-[14px] border border-[#e5e7eb] bg-[#fafafa] px-4 py-3 text-[14px] font-medium text-[#111827]">
                  {formatDisplayTime(
                    originalCheckOut,
                  )}
                </div>
              </div>

              <div>
                <span className="mb-1 block text-[12px] font-extrabold uppercase tracking-wide text-[#2563eb]">
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
                  disabled={
                    readOnly || isSubmitting
                  }
                  className="w-full rounded-[14px] border border-[#bfdbfe] bg-white px-4 py-2.5 text-[14px] font-medium text-[#111827] outline-none transition focus:border-[#2563eb]"
                />
              </div>

            </div>
          </div>

          {/* BREAKS */}

          <div className="mt-6 border-t border-[#e5e7eb] pt-5">

            <h3 className="mb-4 text-[16px] font-extrabold text-[#111827]">
              Breaks
            </h3>

            {originalBreaks.length === 0 &&
            editedBreaks.length === 0 ? (
              <p className="text-[14px] font-medium text-[#6b7280]">
                No breaks recorded.
              </p>
            ) : (
              <>
                <div className="mb-3 grid grid-cols-2 gap-5">
                  <span className="text-[12px] font-extrabold uppercase tracking-wide text-[#6b7280]">
                    Original
                  </span>

                  <span className="text-[12px] font-extrabold uppercase tracking-wide text-[#2563eb]">
                    Requested
                  </span>
                </div>

                <div className="space-y-4">

                  {Array.from(
                    {
                      length: Math.max(
                        originalBreaks.length,
                        editedBreaks.length,
                      ),
                    },
                    (_, index) => {
                      const original =
                        originalBreaks[index]

                      const requested =
                        editedBreaks[index]

                      return (
                        <div
                          key={
                            requested?.id ||
                            original?.id ||
                            `break-${index}`
                          }
                          className="grid gap-5 sm:grid-cols-2"
                        >

                          {/* ORIGINAL */}

                          <div>
                            <span className="mb-1 block text-[12px] font-extrabold uppercase tracking-wide text-[#6b7280]">
                              Break {index + 1}
                            </span>

                            <div className="rounded-[14px] border border-[#e5e7eb] bg-[#fafafa] px-4 py-3 text-[14px] font-medium text-[#111827]">
                              {original ? (
                                <>
                                  {formatTimeForInput(
                                    original.break_start,
                                  ) || '--'}

                                  <span className="mx-2 text-[#9ca3af]">
                                    →
                                  </span>

                                  {formatTimeForInput(
                                    original.break_end,
                                  ) || '--'}
                                </>
                              ) : (
                                '--'
                              )}
                            </div>
                          </div>

                          {/* REQUESTED */}

                          <div>
                            <span className="mb-1 block text-[12px] font-extrabold uppercase tracking-wide text-[#2563eb]">
                              Break {index + 1}
                            </span>

                            {requested ? (
                              <div className="flex items-center gap-2">

                                <input
                                  type="time"
                                  value={
                                    requested.break_start ||
                                    ''
                                  }
                                  onChange={(event) =>
                                    handleBreakChange(
                                      requested.id,
                                      'break_start',
                                      event.target.value,
                                    )
                                  }
                                  disabled={
                                    readOnly ||
                                    isSubmitting
                                  }
                                  className="min-w-0 flex-1 rounded-[14px] border border-[#bfdbfe] bg-white px-3 py-2.5 text-[14px] font-medium text-[#111827] outline-none focus:border-[#2563eb]"
                                />

                                <span className="text-[#9ca3af]">
                                  →
                                </span>

                                <input
                                  type="time"
                                  value={
                                    requested.break_end ||
                                    ''
                                  }
                                  onChange={(event) =>
                                    handleBreakChange(
                                      requested.id,
                                      'break_end',
                                      event.target.value,
                                    )
                                  }
                                  disabled={
                                    readOnly ||
                                    isSubmitting
                                  }
                                  className="min-w-0 flex-1 rounded-[14px] border border-[#bfdbfe] bg-white px-3 py-2.5 text-[14px] font-medium text-[#111827] outline-none focus:border-[#2563eb]"
                                />

                              </div>
                            ) : (
                              <div className="rounded-[14px] border border-[#e5e7eb] bg-[#fafafa] px-4 py-3 text-[14px] font-medium text-[#6b7280]">
                                --
                              </div>
                            )}
                          </div>

                        </div>
                      )
                    },
                  )}

                </div>
              </>
            )}
          </div>

          {/* REASON */}

          <div className="mt-6 border-t border-[#e5e7eb] pt-5">

            <div>
              <span className="mb-2 block text-[12px] font-extrabold uppercase tracking-wide text-[#6b7280]">
                Reason
              </span>

              <div className="whitespace-pre-wrap rounded-[14px] border border-[#e5e7eb] bg-[#fafafa] px-4 py-3 text-[14px] font-medium text-[#111827]">
                {correctionRequest.reason || '--'}
              </div>
            </div>

            {/* REVIEW COMMENT */}

            <div className="mt-4">

              {readOnly ? (
                reviewComment ? (
                  <>
                    <span className="mb-2 block text-[12px] font-extrabold uppercase tracking-wide text-[#6b7280]">
                      Review Comment
                    </span>

                    <div className="whitespace-pre-wrap rounded-[14px] border border-[#e5e7eb] bg-[#fafafa] px-4 py-3 text-[14px] font-medium text-[#111827]">
                      {reviewComment}
                    </div>
                  </>
                ) : null
              ) : (
                <>
                  <span className="mb-2 block text-[12px] font-extrabold uppercase tracking-wide text-[#6b7280]">
                    Review Comment
                  </span>

                  <textarea
                    value={reviewComment}
                    onChange={(event) => {
                      setReviewComment(
                        event.target.value,
                      )

                      if (reviewCommentError) {
                        setReviewCommentError('')
                      }
                    }}
                    rows={4}
                    disabled={isSubmitting}
                    placeholder="Add a comment..."
                    className="w-full resize-none rounded-[14px] border border-[#d1d5db] bg-white px-4 py-3 text-[14px] text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#9ca3af]"
                  />

                  {reviewCommentError && (
                    <p className="mt-2 text-[13px] font-medium text-[#dc2626]">
                      {reviewCommentError}
                    </p>
                  )}
                </>
              )}

            </div>
          </div>

        </div>

        {/* FOOTER */}

        <div className="flex flex-wrap justify-end gap-3 border-t border-[#e5e7eb] px-6 py-5">

          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-full px-5 py-2.5 text-[14px] font-bold"
          >
            {readOnly ? 'Close' : 'Cancel'}
          </Button>

          {!readOnly &&
            correctionRequest?.status === 'PENDING' && (
              <Button
                type="button"
                variant="danger"
                onClick={handleReject}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-full border border-[#fecaca] px-5 py-2.5 text-[14px] font-bold text-[#dc2626]"
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
            )}

          {!readOnly &&
            correctionRequest?.status === 'PENDING' && (
              <Button
                type="button"
                onClick={handleApprove}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-full bg-[#16a34a] px-5 py-2.5 text-[14px] font-bold text-white hover:bg-[#15803d]"
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
            )}

        </div>

      </div>
    </div>
  )
}

export default CorrectionRequestReviewModal