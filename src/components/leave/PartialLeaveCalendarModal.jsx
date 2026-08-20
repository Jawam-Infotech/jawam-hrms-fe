import { useState } from 'react'
import { X } from 'lucide-react'

import {
  formatLeaveDate,
  getLeaveDates,
} from '../../utils/leaveUtils.js'

import ReviewComment from './ReviewComment.jsx'


function PartialLeaveCalendarModal({
  request,
  reviewComment,
  onReviewCommentChange,
  onClose,
  onConfirm,
  loading = false,
}) {
  const requestedDates = getLeaveDates(
    request?.startDate,
    request?.endDate,
  )

  const [approvedDates, setApprovedDates] =
    useState(requestedDates)

  const [error, setError] =
    useState('')


  /*
   * =========================
   * TOGGLE DATE
   * =========================
   */

  const toggleDate = (date) => {
    if (loading) {
      return
    }

    setError('')

    setApprovedDates((current) => {
      if (current.includes(date)) {
        return current.filter(
          (value) => value !== date,
        )
      }

      return [
        ...current,
        date,
      ]
    })
  }


  /*
   * =========================
   * SUBMIT
   * =========================
   */

  const submit = async () => {
    if (loading) {
      return
    }

    if (approvedDates.length === 0) {
      setError(
        'Select at least one date to approve.',
      )

      return
    }

    setError('')

    const sortedApprovedDates = [
      ...approvedDates,
    ].sort()

    await onConfirm({
      approvedDates:
        sortedApprovedDates,

      reviewComment:
        reviewComment.trim(),
    })
  }


  /*
   * =========================
   * CLOSE
   * =========================
   */

  const handleClose = () => {
    if (loading) {
      return
    }

    setError('')
    onClose()
  }


  /*
   * =========================
   * INVALID REQUEST
   * =========================
   */

  if (!request) {
    return null
  }


  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">

      <div className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-[24px] bg-white shadow-2xl">

        {/* HEADER */}

        <div className="flex items-start justify-between gap-4 border-b border-[#e5e7eb] p-6">

          <div>
            <h3 className="text-[20px] font-extrabold text-[#111827]">
              Partially Accept Leave
            </h3>

            <p className="mt-1 text-[14px] text-[#6b7280]">
              Select the dates you want to approve.
            </p>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            aria-label="Close partial leave approval"
            className="rounded-full p-2 text-[#6b7280] transition hover:bg-[#f3f4f6] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={20} />
          </button>

        </div>


        {/* BODY */}

        <div className="overflow-y-auto p-6">

          {/* REQUESTED RANGE */}

          <div className="rounded-[16px] border border-[#e5e7eb] bg-[#f9fafb] p-4">

            <p className="text-[12px] font-extrabold uppercase tracking-wide text-[#6b7280]">
              Requested Dates
            </p>

            <p className="mt-1 text-[14px] font-bold text-[#111827]">
              {formatLeaveDate(
                request.startDate,
              )}

              {request.startDate !==
                request.endDate &&
                ` – ${formatLeaveDate(
                  request.endDate,
                )}`}
            </p>

          </div>


          {/* DATE SELECTION */}

          <div className="mt-5">

            <div className="flex items-center justify-between gap-4">

              <h4 className="text-[14px] font-extrabold text-[#111827]">
                Approval Dates
              </h4>

              <span className="text-[12px] font-semibold text-[#6b7280]">
                {approvedDates.length} of{' '}
                {requestedDates.length}{' '}
                selected
              </span>

            </div>


            {requestedDates.length === 0 ? (
              <div className="mt-3 rounded-[14px] border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-[13px] font-medium text-[#b91c1c]">
                No valid leave dates were found
                for this request.
              </div>
            ) : (
              <div className="mt-3 grid gap-2 sm:grid-cols-2">

                {requestedDates.map(
                  (date) => {
                    const isSelected =
                      approvedDates.includes(
                        date,
                      )

                    return (
                      <label
                        key={date}
                        className={[
                          'flex items-center gap-3 rounded-xl border p-3 text-[14px] transition',
                          loading
                            ? 'cursor-not-allowed opacity-60'
                            : 'cursor-pointer',
                          isSelected
                            ? 'border-[#86efac] bg-[#f0fdf4]'
                            : 'border-[#e5e7eb] bg-white hover:bg-[#f8fafc]',
                        ].join(' ')}
                      >

                        <input
                          type="checkbox"
                          checked={
                            isSelected
                          }
                          onChange={() =>
                            toggleDate(
                              date,
                            )
                          }
                          disabled={
                            loading
                          }
                          className="h-4 w-4 rounded border-[#d1d5db] text-[#16a34a] focus:ring-[#86efac]"
                        />

                        <span className="font-medium text-[#111827]">
                          {formatLeaveDate(
                            date,
                          )}
                        </span>

                      </label>
                    )
                  },
                )}

              </div>
            )}

          </div>


          {/* VALIDATION ERROR */}

          {error && (
            <div
              role="alert"
              className="mt-4 rounded-[14px] border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-[13px] font-medium text-[#b91c1c]"
            >
              {error}
            </div>
          )}


          {/* REVIEW COMMENT */}

          <div className="mt-5">

            <ReviewComment
              value={reviewComment}
              onChange={onReviewCommentChange}
              disabled={loading}
            />

          </div>

        </div>


        {/* FOOTER */}

        <div className="flex flex-wrap justify-end gap-3 border-t border-[#e5e7eb] p-6">

          <button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="rounded-full px-5 py-2.5 text-[14px] font-bold text-[#4b5563] transition hover:bg-[#f3f4f6] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={submit}
            disabled={
              loading ||
              requestedDates.length === 0
            }
            className="rounded-full bg-[#f97316] px-5 py-2.5 text-[14px] font-bold text-white transition hover:bg-[#ea580c] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? 'Saving...'
              : 'Save Partial Acceptance'}
          </button>

        </div>

      </div>

    </div>
  )
}


export default PartialLeaveCalendarModal