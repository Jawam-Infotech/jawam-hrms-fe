import { useState } from 'react'
import { X } from 'lucide-react'

import { formatLeaveDate } from '../../utils/leaveUtils.js'


function LeaveCancellationModal({
  request,
  onClose,
  onConfirm,
  loading = false,
}) {
  const [
    cancellationReason,
    setCancellationReason,
  ] = useState('')

  const [error, setError] =
    useState('')


  /*
   * =========================
   * EMPTY STATE
   * =========================
   */

  if (!request) {
    return null
  }


  /*
   * =========================
   * SUBMIT
   * =========================
   */

  const submit = async () => {
    const trimmedReason =
      cancellationReason.trim()

    if (!trimmedReason) {
      setError(
        'A cancellation reason is required.',
      )

      return
    }

    setError('')

    try {
      await onConfirm?.({
        cancellationReason:
          trimmedReason,
      })
    } catch (submitError) {
      setError(
        submitError?.message ||
          'Unable to submit the cancellation request.',
      )
    }
  }


  /*
   * =========================
   * REASON CHANGE
   * =========================
   */

  const handleReasonChange = (
    event,
  ) => {
    setCancellationReason(
      event.target.value,
    )

    if (error) {
      setError('')
    }
  }


  /*
   * =========================
   * RENDER
   * =========================
   */

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="leave-cancellation-title"
    >

      <div className="w-full max-w-lg rounded-[24px] bg-white p-6 shadow-2xl">

        {/* =========================
            HEADER
        ========================== */}

        <div className="flex items-start justify-between gap-4">

          <div>
            <h3
              id="leave-cancellation-title"
              className="text-[20px] font-extrabold text-[#111827]"
            >
              Request Leave Cancellation
            </h3>

            <p className="mt-1 text-[14px] text-[#6b7280]">
              Are you sure you want to
              request cancellation of
              this leave?
            </p>
          </div>


          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close cancellation request"
            className="rounded-full p-2 text-[#6b7280] transition hover:bg-[#f3f4f6] focus:outline-none focus:ring-2 focus:ring-[#bfdbfe] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={20} />
          </button>

        </div>


        {/* =========================
            LEAVE DETAILS
        ========================== */}

        <div className="mt-5 rounded-[18px] border border-[#e5e7eb] bg-[#f9fafb] p-4">

          <div className="grid gap-4 sm:grid-cols-2">

            <div>
              <p className="text-[12px] font-semibold text-[#6b7280]">
                Leave Type
              </p>

              <p className="mt-1 text-[14px] font-bold text-[#111827]">
                {request.leaveType ||
                  '--'}
              </p>
            </div>


            <div>
              <p className="text-[12px] font-semibold text-[#6b7280]">
                Days
              </p>

              <p className="mt-1 text-[14px] font-bold text-[#111827]">
                {request.numberOfDays ??
                  '--'}
              </p>
            </div>


            <div>
              <p className="text-[12px] font-semibold text-[#6b7280]">
                Start Date
              </p>

              <p className="mt-1 text-[14px] font-bold text-[#111827]">
                {formatLeaveDate(
                  request.startDate,
                )}
              </p>
            </div>


            <div>
              <p className="text-[12px] font-semibold text-[#6b7280]">
                End Date
              </p>

              <p className="mt-1 text-[14px] font-bold text-[#111827]">
                {formatLeaveDate(
                  request.endDate,
                )}
              </p>
            </div>

          </div>

        </div>


        {/* =========================
            INFORMATION
        ========================== */}

        <div className="mt-5 rounded-[16px] border border-[#fed7aa] bg-[#fff7ed] px-4 py-3">

          <p className="text-[13px] leading-5 text-[#9a3412]">
            Your cancellation request
            will be sent to the
            appropriate reviewer for
            approval.
          </p>

        </div>


        {/* =========================
            CANCELLATION REASON
        ========================== */}

        <div className="mt-5">

          <label
            htmlFor="leave-cancellation-reason"
            className="mb-2 block text-[13px] font-semibold text-[#374151]"
          >
            Cancellation Reason{' '}

            <span
              className="text-[#dc2626]"
              aria-hidden="true"
            >
              *
            </span>
          </label>


          <textarea
            id="leave-cancellation-reason"
            rows={4}
            value={
              cancellationReason
            }
            disabled={loading}
            required
            aria-required="true"
            aria-invalid={Boolean(error)}
            aria-describedby={
              error
                ? 'leave-cancellation-error'
                : undefined
            }
            onChange={
              handleReasonChange
            }
            placeholder="Why do you want to cancel this leave?"
            className="w-full resize-none rounded-xl border border-[#d1d5db] px-3 py-2.5 text-[14px] text-[#111827] outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-[#dbeafe] disabled:cursor-not-allowed disabled:bg-[#f9fafb]"
          />


          {error && (
            <p
              id="leave-cancellation-error"
              role="alert"
              className="mt-2 text-[13px] font-medium text-[#dc2626]"
            >
              {error}
            </p>
          )}

        </div>


        {/* =========================
            ACTIONS
        ========================== */}

        <div className="mt-6 flex justify-end gap-3">

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-full px-5 py-2.5 text-[14px] font-bold text-[#4b5563] transition hover:bg-[#f3f4f6] focus:outline-none focus:ring-2 focus:ring-[#d1d5db] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>


          <button
            type="button"
            onClick={submit}
            disabled={loading}
            className="rounded-full bg-[#2563eb] px-5 py-2.5 text-[14px] font-bold text-white transition hover:bg-[#1d4ed8] focus:outline-none focus:ring-2 focus:ring-[#bfdbfe] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? 'Submitting...'
              : 'Request Cancellation'}
          </button>

        </div>

      </div>

    </div>
  )
}


export default LeaveCancellationModal