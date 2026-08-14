import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

const INDIA_TIME_ZONE = 'Asia/Kolkata'

const formatTime = (value) => {
  if (!value) return '--'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return '--'

  return new Intl.DateTimeFormat('en-US', {
    timeZone: INDIA_TIME_ZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date)
}

const formatTimeForInput = (value) => {
  if (!value) return ''

  // Backend may return:
  // 2026-08-11T10:07:00+05:30
  // 2026-08-11T04:37:00Z
  // 2026-08-11T10:07:00
  //
  // If the value already contains +05:30,
  // preserve the employee's actual India time directly.
  const indiaTimeMatch = String(value).match(
    /T(\d{2}):(\d{2})(?::\d{2}(?:\.\d+)?)?\+05:30$/,
  )

  if (indiaTimeMatch) {
    return `${indiaTimeMatch[1]}:${indiaTimeMatch[2]}`
  }

  // If backend sends UTC (Z), convert it to India time.
  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)

  const hour = parts.find(
    (part) => part.type === 'hour',
  )?.value

  const minute = parts.find(
    (part) => part.type === 'minute',
  )?.value

  if (!hour || !minute) {
    return ''
  }

  return `${hour}:${minute}`
}

const formatDate = (date) => {
  if (!date) return '--'

  const parsedDate = new Date(`${date}T00:00:00`)

  if (Number.isNaN(parsedDate.getTime())) return '--'

  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(parsedDate)
}

const formatPersonName = (person) => {
  const name = [person?.first_name, person?.last_name]
    .filter(Boolean)
    .join(' ')

  return name || 'Not provided'
}

const formatBreak = (breakSession) => {
  if (!breakSession) return '--'

  return `${formatTime(
    breakSession.break_start ??
      breakSession.proposed_break_start ??
      breakSession.start,
  )} → ${formatTime(
    breakSession.break_end ??
      breakSession.proposed_break_end ??
      breakSession.end,
  )}`
}

/**
 * Convert a time input value such as "10:15"
 * into the API datetime format:
 *
 * 2026-08-11T10:15:00+05:30
 */
const formatDateTimeForApi = (date, time) => {
  if (!date || !time) return null

  return `${date}T${time}:00+05:30`
}

function CorrectionRequestReviewModal({
  isOpen,
  onClose,
  correctionRequestId,
  correctionRequest,
  loading,
  error,
  actionLoading = false,
  actionError = null,
  onApprove,
  onReject,
  readOnly = false,
}) {
  const [reviewComment, setReviewComment] = useState('')
  const [reviewCommentError, setReviewCommentError] = useState('')

  const [editedCheckIn, setEditedCheckIn] = useState('')
  const [editedCheckOut, setEditedCheckOut] = useState('')
  const [editedBreaks, setEditedBreaks] = useState([])

  /**
   * Populate editable values whenever a new
   * correction request is loaded.
   */
  useEffect(() => {
    if (!correctionRequest) {
      setEditedCheckIn('')
      setEditedCheckOut('')
      setEditedBreaks([])
      setReviewComment('')
      setReviewCommentError('')
      return
    }

    setEditedCheckIn(
      formatTimeForInput(correctionRequest.proposed_check_in),
    )

    setEditedCheckOut(
      formatTimeForInput(correctionRequest.proposed_check_out),
    )

    const breakItems = Array.isArray(
      correctionRequest.break_items,
    )
      ? correctionRequest.break_items
      : []

    setEditedBreaks(
      breakItems.map((breakItem) => ({
        id: breakItem.id,
        break_start: formatTimeForInput(
          breakItem.proposed_break_start,
        ),
        break_end: formatTimeForInput(
          breakItem.proposed_break_end,
        ),
      })),
    )

    setReviewComment(correctionRequest.review_comment || '')
    setReviewCommentError('')
  }, [correctionRequest])

  if (!isOpen) return null

  const request = correctionRequest
  const status = String(request?.status || 'PENDING')
    .trim()
    .toUpperCase()

  /**
   * Pending requests are editable only when the
   * modal is being used as the HR/CEO review modal.
   *
   * Employee/TL/HR tracking page can pass readOnly=true.
   */
  const isReadOnly = readOnly || status !== 'PENDING'

  const oldSnapshot = request?.old_snapshot || {}

  const originalBreaks = Array.isArray(oldSnapshot.breaks)
    ? oldSnapshot.breaks
    : []

  const requestedBreaks = Array.isArray(request?.break_items)
    ? request.break_items
    : []

  const breakRowCount = Math.max(
    originalBreaks.length,
    requestedBreaks.length,
  )

  const requestedColumnLabel =
    status === 'APPROVED'
      ? 'Approved'
      : status === 'REJECTED'
        ? 'Reviewed'
        : 'Requested / Review'

  const statusClass =
    status === 'PENDING'
      ? 'bg-[#fef3c7] text-[#b45309]'
      : status === 'APPROVED'
        ? 'bg-[#dcfce7] text-[#15803d]'
        : 'bg-[#fee2e2] text-[#b91c1c]'

  /**
   * Update one break's start/end time.
   */
  const handleBreakChange = (
    index,
    field,
    value,
  ) => {
    setEditedBreaks((currentBreaks) =>
      currentBreaks.map((breakItem, breakIndex) =>
        breakIndex === index
          ? {
              ...breakItem,
              [field]: value,
            }
          : breakItem,
      ),
    )
  }

  /**
   * Approve using the edited requested values.
   *
   * Backend contract:
   *
   * {
   *   check_in,
   *   check_out,
   *   breaks,
   *   review_comment
   * }
   */
  const handleApprove = async () => {
    if (!correctionRequestId || !request) return

    const breaks = editedBreaks
      .filter(
        (breakItem) =>
          breakItem.break_start &&
          breakItem.break_end,
      )
      .map((breakItem) => ({
        id: breakItem.id,
        break_start: formatDateTimeForApi(
          request.date,
          breakItem.break_start,
        ),
        break_end: formatDateTimeForApi(
          request.date,
          breakItem.break_end,
        ),
      }))

    const payload = {
      check_in: formatDateTimeForApi(
        request.date,
        editedCheckIn,
      ),
      check_out: formatDateTimeForApi(
        request.date,
        editedCheckOut,
      ),
      breaks,
      ...(reviewComment.trim()
        ? {
            review_comment: reviewComment.trim(),
          }
        : {}),
    }

    try {
      await onApprove?.(
        correctionRequestId,
        payload,
      )
    } catch {
      // Parent/hook exposes the actual error through actionError.
    }
  }

  /**
   * Reject still requires a review comment.
   */
  const handleReject = async () => {
    if (!correctionRequestId) return

    if (!reviewComment.trim()) {
      setReviewCommentError(
        'Please provide a review comment before rejecting this request.',
      )
      return
    }

    setReviewCommentError('')

    try {
      await onReject?.(
        correctionRequestId,
        {
          review_comment: reviewComment.trim(),
        },
      )
    } catch {
      // Parent/hook exposes the actual error through actionError.
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl">

        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#e5e7eb] px-6 py-5">
          <div>
            <h2 className="text-[20px] font-extrabold text-[#111827]">
              Correction Request
            </h2>

            {request && (
              <div className="mt-2 text-[13px] font-semibold text-[#6b7280]">
                {formatPersonName(request.user)} •{' '}
                {request.user?.department || 'Not provided'} •{' '}
                {formatDate(request.date)}

                <div>
                  <span
                    className={`mt-3 inline-flex rounded-full px-3 py-1 text-[12px] font-extrabold tracking-wide ${statusClass}`}
                  >
                    {status}
                  </span>
                </div>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={actionLoading}
            className="rounded-full p-2 text-[#6b7280] transition hover:bg-[#f3f4f6] hover:text-[#111827] disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto">
          {loading ? (
            <div className="p-6 text-[14px] font-semibold text-[#6b7280]">
              Loading correction request...
            </div>
          ) : error ? (
            <div className="p-6 text-[14px] font-semibold text-[#b91c1c]">
              Failed to load correction request. Please close this window and
              try again.
            </div>
          ) : request ? (
            <div className="space-y-5 p-6">

              {/* Original vs Requested */}
              <section className="overflow-hidden rounded-[18px] border border-[#e5e7eb]">

                {/* Table Header */}
                <div className="grid grid-cols-[minmax(115px,0.8fr)_minmax(150px,1fr)_minmax(220px,1.3fr)] border-b border-[#e5e7eb] bg-[#f9fafb] max-[680px]:grid-cols-[90px_1fr_1fr]">
                  <div className="px-4 py-3" />

                  <div className="px-4 py-3 text-[12px] font-extrabold uppercase tracking-wider text-[#6b7280]">
                    Original
                  </div>

                  <div className="border-l border-[#e5e7eb] px-4 py-3 text-[12px] font-extrabold uppercase tracking-wider text-[#2563eb]">
                    {requestedColumnLabel}
                  </div>
                </div>

                {/* Check In */}
                <ComparisonRow
                  label="Check In"
                  original={formatTime(oldSnapshot.check_in)}
                  requested={
                    isReadOnly ? (
                      formatTime(request.proposed_check_in)
                    ) : (
                      <TimeInput
                        value={editedCheckIn}
                        onChange={setEditedCheckIn}
                      />
                    )
                  }
                  editable={!isReadOnly}
                />

                {/* Check Out */}
                <ComparisonRow
                  label="Check Out"
                  original={formatTime(oldSnapshot.check_out)}
                  requested={
                    isReadOnly ? (
                      formatTime(request.proposed_check_out)
                    ) : (
                      <TimeInput
                        value={editedCheckOut}
                        onChange={setEditedCheckOut}
                      />
                    )
                  }
                  editable={!isReadOnly}
                />

                {/* Break Header */}
                {breakRowCount > 0 && (
                  <div className="grid grid-cols-[minmax(115px,0.8fr)_minmax(150px,1fr)_minmax(220px,1.3fr)] border-b border-[#e5e7eb] bg-[#f9fafb] max-[680px]:grid-cols-[90px_1fr_1fr]">
                    <div className="px-4 py-3 text-[13px] font-bold text-[#111827]">
                      Breaks
                    </div>

                    <div className="px-4 py-3" />

                    <div className="border-l border-[#e5e7eb] px-4 py-3" />
                  </div>
                )}

                {/* Breaks */}
                {breakRowCount === 0 ? (
                  <ComparisonRow
                    label="Breaks"
                    original="--"
                    requested="--"
                  />
                ) : (
                  Array.from(
                    { length: breakRowCount },
                    (_, index) => {
                      const requestedBreak =
                        requestedBreaks[index]

                      const editedBreak =
                        editedBreaks[index]

                      return (
                        <ComparisonRow
                          key={
                            requestedBreak?.id ||
                            index
                          }
                          label={`Break ${index + 1}`}
                          original={formatBreak(
                            originalBreaks[index],
                          )}
                          requested={
                            isReadOnly ? (
                              formatBreak(
                                requestedBreak,
                              )
                            ) : editedBreak ? (
                              <div className="flex flex-wrap items-center gap-2">
                                <TimeInput
                                  value={
                                    editedBreak.break_start
                                  }
                                  onChange={(value) =>
                                    handleBreakChange(
                                      index,
                                      'break_start',
                                      value,
                                    )
                                  }
                                />

                                <span className="text-[#6b7280]">
                                  →
                                </span>

                                <TimeInput
                                  value={
                                    editedBreak.break_end
                                  }
                                  onChange={(value) =>
                                    handleBreakChange(
                                      index,
                                      'break_end',
                                      value,
                                    )
                                  }
                                />
                              </div>
                            ) : (
                              '--'
                            )
                          }
                          editable={!isReadOnly}
                        />
                      )
                    },
                  )
                )}
              </section>

              {/* Reason */}
              <DetailSection
                label="Reason"
                value={request.reason}
              />

              {/* Review Comment */}
              <div>
                <label
                  htmlFor="correction-review-comment"
                  className="mb-2 block text-[13px] font-semibold text-[#4b5563]"
                >
                  Review Comment

                  {status === 'PENDING' && (
                    <span className="text-[#6b7280]">
                      {' '}
                      (required for rejection)
                    </span>
                  )}
                </label>

                {isReadOnly ? (
                  <DetailSection
                    label="Review Comment"
                    value={request.review_comment}
                  />
                ) : (
                  <textarea
                    id="correction-review-comment"
                    rows={3}
                    value={reviewComment}
                    onChange={(event) => {
                      setReviewComment(
                        event.target.value,
                      )

                      if (reviewCommentError) {
                        setReviewCommentError('')
                      }
                    }}
                    disabled={actionLoading}
                    placeholder="Add a review comment..."
                    className="w-full resize-none rounded-xl border border-[#d1d5db] px-4 py-3 text-[14px] outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-[#dbeafe] disabled:bg-[#f9fafb]"
                  />
                )}

                {reviewCommentError && (
                  <p className="mt-2 text-[13px] font-medium text-[#dc2626]">
                    {reviewCommentError}
                  </p>
                )}
              </div>

              {/* Backend Action Error */}
              {actionError && (
                <div className="rounded-xl bg-[#fef2f2] px-4 py-3 text-[13px] font-semibold text-[#b91c1c]">
                  {typeof actionError === 'string'
                    ? actionError
                    : 'Failed to process this correction request.'}
                </div>
              )}
            </div>
          ) : (
            <div className="p-6 text-[14px] font-semibold text-[#6b7280]">
              Correction request details are not available.
            </div>
          )}
        </div>

        {/* Footer */}
        {!isReadOnly ? (
          <div className="flex flex-wrap justify-end gap-3 border-t border-[#e5e7eb] px-6 py-5">
            <button
              type="button"
              onClick={onClose}
              disabled={actionLoading}
              className="rounded-full px-5 py-2.5 text-[14px] font-bold text-[#4b5563] transition hover:bg-[#f3f4f6] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleReject}
              disabled={actionLoading}
              className="rounded-full border border-[#fecaca] bg-white px-5 py-2.5 text-[14px] font-bold text-[#dc2626] transition hover:bg-[#fef2f2] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {actionLoading
                ? 'Processing...'
                : 'Reject'}
            </button>

            <button
              type="button"
              onClick={handleApprove}
              disabled={actionLoading}
              className="rounded-full bg-[#16a34a] px-5 py-2.5 text-[14px] font-bold text-white transition hover:bg-[#15803d] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {actionLoading
                ? 'Processing...'
                : 'Approve'}
            </button>
          </div>
        ) : (
          <div className="flex justify-end border-t border-[#e5e7eb] px-6 py-5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-5 py-2.5 text-[14px] font-bold text-[#4b5563] transition hover:bg-[#f3f4f6]"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function ComparisonRow({
  label,
  original,
  requested,
  editable = false,
}) {
  return (
    <div className="grid grid-cols-[minmax(115px,0.8fr)_minmax(150px,1fr)_minmax(220px,1.3fr)] border-b border-[#e5e7eb] max-[680px]:grid-cols-[90px_1fr_1fr]">
      <div className="px-4 py-4 text-[13px] font-bold text-[#111827]">
        {label}
      </div>

      <div className="px-4 py-4 text-[13px] font-semibold text-[#4b5563]">
        {original}
      </div>

      <div
        className={`border-l border-[#e5e7eb] px-4 py-4 text-[13px] font-semibold ${
          editable
            ? 'bg-[#eff6ff] text-[#2563eb]'
            : 'text-[#2563eb]'
        }`}
      >
        {requested}
      </div>
    </div>
  )
}

function TimeInput({
  value,
  onChange,
}) {
  return (
    <input
      type="time"
      value={value || ''}
      onChange={(event) =>
        onChange(event.target.value)
      }
      className="h-9 rounded-lg border border-[#bfdbfe] bg-white px-2.5 text-[13px] font-semibold text-[#2563eb] outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-[#dbeafe]"
    />
  )
}

function DetailSection({
  label,
  value,
}) {
  return (
    <div>
      <div className="mb-2 text-[12px] font-extrabold uppercase tracking-wider text-[#6b7280]">
        {label}
      </div>

      <div className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3 text-[14px] font-medium text-[#374151]">
        {value || 'Not provided'}
      </div>
    </div>
  )
}

export default CorrectionRequestReviewModal
