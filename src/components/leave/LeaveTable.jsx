import { LEAVE_REVIEW_COLUMNS } from '../../constants/leave.js'
import { formatLeaveDate } from '../../utils/leaveUtils.js'

import LeaveActionButton from './LeaveActionButton.jsx'
import LeaveStatusBadge from './LeaveStatusBadge.jsx'
import EmptyLeaveState from './EmptyLeaveState.jsx'
import LeaveLoadingState from './LeaveLoadingState.jsx'


function LeaveTable({
  requests = [],
  loading = false,
  onView,
}) {
  const hasRequests = requests.length > 0


  /*
   * =========================
   * RENDER DATE CELL
   * =========================
   */

  const renderStartDate = (request) => {
    if (
      request.status === 'Partially Accepted'
    ) {
      const approvedDates =
        Array.isArray(
          request.displayDates,
        )
          ? request.displayDates
          : []

      if (approvedDates.length === 0) {
        return '--'
      }

      return approvedDates
        .map(formatLeaveDate)
        .join(', ')
    }

    return formatLeaveDate(
      request.startDate,
    )
  }


  /*
   * =========================
   * RENDER END DATE
   * =========================
   */

  const renderEndDate = (request) => {
    if (
      request.status === 'Partially Accepted'
    ) {
      return '—'
    }

    return formatLeaveDate(
      request.endDate,
    )
  }


  /*
   * =========================
   * RENDER DAYS
   * =========================
   */

  const renderDays = (request) => {
    if (
      request.status !==
      'Partially Accepted'
    ) {
      return request.numberOfDays ?? '--'
    }

    return (
      <div>
        <div className="font-semibold text-[#111827]">
          {request.approvedDays ?? 0}{' '}
          approved
        </div>

        <div className="text-[12px] text-[#6b7280]">
          {request.numberOfDays ?? 0}{' '}
          requested
        </div>
      </div>
    )
  }


  /*
   * =========================
   * LOADING / EMPTY STATE
   * =========================
   */

  const renderTableBody = () => {
    if (loading) {
      return (
        <tr>
          <td
            colSpan={
              LEAVE_REVIEW_COLUMNS.length
            }
          >
            <LeaveLoadingState />
          </td>
        </tr>
      )
    }

    if (!hasRequests) {
      return (
        <tr>
          <td
            colSpan={
              LEAVE_REVIEW_COLUMNS.length
            }
          >
            <EmptyLeaveState />
          </td>
        </tr>
      )
    }

    return requests.map((request) => (
      <tr
        key={request.id}
        className="border-b border-[#f1f5f9] transition last:border-0 hover:bg-[#f8fafc]"
      >

        {/* EMPLOYEE */}

        <td className="whitespace-nowrap px-5 py-4 font-semibold text-[#111827]">
          {request.employeeName || '--'}
        </td>


        {/* LEAVE TYPE */}

        <td className="whitespace-nowrap px-5 py-4 text-[#4b5563]">
          {request.leaveType || '--'}
        </td>


        {/* START DATE */}

        <td className="whitespace-nowrap px-5 py-4 text-[#4b5563]">
          {renderStartDate(request)}
        </td>


        {/* END DATE */}

        <td className="whitespace-nowrap px-5 py-4 text-[#4b5563]">
          {renderEndDate(request)}
        </td>


        {/* DAYS */}

        <td className="whitespace-nowrap px-5 py-4 text-[#4b5563]">
          {renderDays(request)}
        </td>


        {/* REASON */}

        <td className="min-w-52 max-w-80 px-5 py-4 text-[#4b5563]">
          <span
            className="block truncate"
            title={request.reason || ''}
          >
            {request.reason || '--'}
          </span>
        </td>


        {/* STATUS */}

        <td className="whitespace-nowrap px-5 py-4">
          <LeaveStatusBadge
            status={request.status}
          />
        </td>


        {/* ACTION */}

        <td className="whitespace-nowrap px-5 py-4">
          <LeaveActionButton
            request={request}
            onView={onView}
          />
        </td>

      </tr>
    ))
  }


  return (
    <div className="overflow-x-auto rounded-[24px] border border-[#e5e7eb] bg-white shadow-sm">

      <table className="min-w-full text-left text-[14px]">

        <thead>
          <tr className="border-b border-[#e5e7eb] bg-[#f9fafb] text-[#6b7280]">

            {LEAVE_REVIEW_COLUMNS.map(
              (column) => (
                <th
                  key={column}
                  scope="col"
                  className="whitespace-nowrap px-5 py-4 text-[12px] font-extrabold uppercase tracking-wide"
                >
                  {column}
                </th>
              ),
            )}

          </tr>
        </thead>

        <tbody>
          {renderTableBody()}
        </tbody>

      </table>

    </div>
  )
}


export default LeaveTable