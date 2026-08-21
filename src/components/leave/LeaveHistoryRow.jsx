import { Eye, Trash2 } from 'lucide-react'

import LeaveStatusBadge from './LeaveStatusBadge.jsx'

import { formatApprovedLeaveDates } from '../../utils/leaveUtils.js'


function LeaveHistoryRow({
  entry,
  onView,
  onCancel,
}) {
  const isPartiallyAccepted =
    entry.status === 'Partially Accepted'

  const today = new Date()
today.setHours(0, 0, 0, 0)

const leaveStartDate = new Date(
  `${entry.startDate}T00:00:00`,
)

const hasStarted =
  leaveStartDate <= today

const isCancellationDisabled =
  hasStarted ||
  entry.status === 'Rejected' ||
  entry.status === 'Cancelled' ||
  entry.status ===
    'Cancellation Requested'

  const dateLabel = isPartiallyAccepted
    ? formatApprovedLeaveDates(
        entry.approvedDates,
      )
    : entry.endDate !== entry.startDate
      ? `${entry.startDate} - ${entry.endDate}`
      : entry.startDate

  const daysLabel = isPartiallyAccepted
    ? entry.approvedDays
    : entry.numberOfDays

  const cancellationTitle =
  entry.status ===
  'Cancellation Requested'
    ? 'Cancellation already requested'
    : hasStarted
      ? 'Cancellation is not allowed because the leave has already started or ended'
      : 'Request cancellation'

  return (
    <tr className="border-b border-[#f1f5f9] hover:bg-[#f8fafc]">

      {/* DATE */}
      <td className="px-6 py-4 text-[#111827]">
        {dateLabel}
      </td>


      {/* LEAVE TYPE */}
      <td className="px-6 py-4 text-[#111827]">
        {entry.leaveType}
      </td>


      {/* DAYS */}
      <td className="px-6 py-4 text-[#111827]">
        {daysLabel}
      </td>


      {/* REASON */}
      <td className="px-6 py-4 text-[#111827]">
        {entry.reason || '--'}
      </td>


      {/* STATUS */}
      <td className="px-6 py-4">
        <LeaveStatusBadge
          status={entry.status}
        />
      </td>


      {/* ACTION */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-2">

          {/* VIEW */}
          <button
            type="button"
            onClick={() =>
              onView?.(entry)
            }
            aria-label={`View ${entry.leaveType} request`}
            title="View leave details"
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#2563eb] transition hover:bg-[#eff6ff]"
          >
            <Eye size={18} />
          </button>


          {/* CANCEL */}
          <button
            type="button"
            onClick={() =>
              onCancel?.(entry)
            }
            disabled={
              isCancellationDisabled
            }
            aria-label={`Cancel ${entry.leaveType} request`}
            title={cancellationTitle}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#dc2626] transition hover:bg-[#fef2f2] disabled:cursor-not-allowed disabled:text-[#d1d5db] disabled:hover:bg-transparent"
          >
            <Trash2 size={17} />
          </button>

        </div>
      </td>

    </tr>
  )
}


export default LeaveHistoryRow