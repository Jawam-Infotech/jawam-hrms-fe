import { X } from 'lucide-react'

import LeaveStatusBadge from './LeaveStatusBadge.jsx'

import {
  formatApprovedLeaveDates,
  formatLeaveDate,
} from '../../utils/leaveUtils.js'


function LeaveDetailsModal({
  request,
  onClose,
}) {
  if (!request) return null

  const isPartiallyAccepted =
    request.status === 'Partially Accepted'

  const isAccepted =
    request.status === 'Accepted'

  const daysApproved =
    isPartiallyAccepted
      ? request.approvedDays
      : isAccepted
        ? request.numberOfDays
        : '--'

  const approvedDates =
    request.approvedDates?.length
      ? formatApprovedLeaveDates(
          request.approvedDates,
        )
      : '--'

  const rejectedDates =
    request.rejectedDates?.length
      ? formatApprovedLeaveDates(
          request.rejectedDates,
        )
      : '--'

  const reviewedOn =
    request.reviewedOn
      ? formatLeaveDate(
          request.reviewedOn.slice(0, 10),
        )
      : '--'

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">

      <div className="w-full max-w-2xl rounded-[24px] bg-white shadow-2xl">

        {/* =========================
            HEADER
        ========================== */}

        <div className="flex items-start justify-between gap-4 border-b border-[#e5e7eb] p-6">

          <div>
            <h3 className="text-[20px] font-extrabold text-[#111827]">
              Leave Request
            </h3>

            <p className="mt-1 text-[14px] text-[#6b7280]">
              Complete details of your leave request
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#6b7280] transition hover:bg-[#f3f4f6]"
            aria-label="Close leave details"
            title="Close"
          >
            <X size={20} />
          </button>

        </div>


        {/* =========================
            BODY
        ========================== */}

        <div className="max-h-[75vh] overflow-y-auto p-6">

          {/* STATUS */}

          <div className="mb-6">
            <LeaveStatusBadge
              status={request.status}
            />
          </div>


          {/* =========================
              BASIC DETAILS
          ========================== */}

          <div className="grid gap-5 sm:grid-cols-2">

            <DetailItem
              label="Leave Type"
              value={
                request.leaveType || '--'
              }
            />

            <DetailItem
              label="Duration"
              value={
                request.duration || '--'
              }
            />

            <DetailItem
              label="Start Date"
              value={formatLeaveDate(
                request.startDate,
              )}
            />

            <DetailItem
              label="End Date"
              value={formatLeaveDate(
                request.endDate,
              )}
            />

            <DetailItem
              label="Days Requested"
              value={
                request.numberOfDays ??
                '--'
              }
            />

            <DetailItem
              label="Days Approved"
              value={daysApproved}
            />

          </div>


          {/* =========================
              PARTIAL APPROVAL
          ========================== */}

          {isPartiallyAccepted && (
            <div className="mt-6 rounded-[18px] border border-[#e5e7eb] bg-[#f9fafb] p-4">

              <h4 className="text-[14px] font-extrabold text-[#111827]">
                Partial Approval Details
              </h4>

              <div className="mt-4 grid gap-5 sm:grid-cols-2">

                <DetailItem
                  label="Approved Dates"
                  value={
                    approvedDates
                  }
                  valueClassName="text-[#059669]"
                />

                <DetailItem
                  label="Rejected Dates"
                  value={
                    rejectedDates
                  }
                  valueClassName="text-[#dc2626]"
                />

              </div>

            </div>
          )}


          {/* =========================
              REASON
          ========================== */}

          <DetailBlock
            label="Reason"
            value={request.reason}
          />


          {/* =========================
              REVIEW INFORMATION
          ========================== */}

          <div className="mt-6 grid gap-5 sm:grid-cols-2">

            <DetailItem
              label="Reviewed By"
              value={
                request.reviewedBy || '--'
              }
            />

            <DetailItem
              label="Reviewed On"
              value={reviewedOn}
            />

          </div>


          {/* =========================
              REVIEW COMMENT
          ========================== */}

          <DetailBlock
            label="Review Comment"
            value={
              request.reviewComment
            }
          />

        </div>


        {/* =========================
            FOOTER
        ========================== */}

        <div className="flex justify-end border-t border-[#e5e7eb] p-6">

          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-[#111827] px-6 py-2.5 text-[14px] font-bold text-white transition hover:bg-[#1f2937]"
          >
            Close
          </button>

        </div>

      </div>
    </div>
  )
}


/*
 * =========================
 * DETAIL ITEM
 * =========================
 */

function DetailItem({
  label,
  value,
  valueClassName = 'text-[#111827]',
}) {
  return (
    <div>
      <p className="text-[12px] font-semibold text-[#6b7280]">
        {label}
      </p>

      <p
        className={`mt-1 text-[14px] font-bold ${valueClassName}`}
      >
        {value || '--'}
      </p>
    </div>
  )
}


/*
 * =========================
 * DETAIL BLOCK
 * =========================
 */

function DetailBlock({
  label,
  value,
}) {
  return (
    <div className="mt-6">

      <p className="text-[12px] font-semibold text-[#6b7280]">
        {label}
      </p>

      <div className="mt-2 rounded-[16px] bg-[#f9fafb] p-4 text-[14px] text-[#374151]">
        {value || '--'}
      </div>

    </div>
  )
}


export default LeaveDetailsModal