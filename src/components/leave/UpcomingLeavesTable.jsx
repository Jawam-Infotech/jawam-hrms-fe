import { formatLeaveDate } from '../../utils/leaveUtils.js'
import LeaveRequestStatus from './LeaveRequestStatus.jsx'
import LeaveLoadingState from './LeaveLoadingState.jsx'


function UpcomingLeavesTable({
  requests = [],
  loading = false,
  onView,
}) {
  return (
    <div className="overflow-x-auto rounded-[24px] border border-[#e5e7eb] bg-white shadow-sm">
      <table className="min-w-full text-left text-[14px]">

        <thead>
          <tr className="border-b border-[#e5e7eb] bg-[#f9fafb] text-[#6b7280]">

            <th className="whitespace-nowrap px-5 py-4 text-[12px] font-extrabold uppercase tracking-wide">
              Employee Name
            </th>

            <th className="whitespace-nowrap px-5 py-4 text-[12px] font-extrabold uppercase tracking-wide">
              Leave Type
            </th>

            <th className="whitespace-nowrap px-5 py-4 text-[12px] font-extrabold uppercase tracking-wide">
              Start Date
            </th>

            <th className="whitespace-nowrap px-5 py-4 text-[12px] font-extrabold uppercase tracking-wide">
              End Date
            </th>

            <th className="whitespace-nowrap px-5 py-4 text-[12px] font-extrabold uppercase tracking-wide">
              Days
            </th>

            <th className="whitespace-nowrap px-5 py-4 text-[12px] font-extrabold uppercase tracking-wide">
              Status
            </th>

            <th className="whitespace-nowrap px-5 py-4 text-[12px] font-extrabold uppercase tracking-wide">
              Action
            </th>

          </tr>
        </thead>


        <tbody>

          {loading ? (
            <tr>
              <td
                colSpan={7}
                className="px-5 py-4"
              >
                <LeaveLoadingState />
              </td>
            </tr>
          ) : requests.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="px-5 py-12 text-center text-[14px] font-semibold text-[#6b7280]"
              >
                No upcoming leaves found.
              </td>
            </tr>
          ) : (
            requests.map((request) => (
              <tr
                key={request.id}
                className="border-b border-[#f1f5f9] last:border-0 hover:bg-[#f8fafc]"
              >

                <td className="whitespace-nowrap px-5 py-4 font-semibold text-[#111827]">
                  {request.employeeName}
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-[#4b5563]">
                  {request.leaveType}
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-[#4b5563]">
                  {formatLeaveDate(
                    request.startDate,
                  )}
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-[#4b5563]">
                  {formatLeaveDate(
                    request.endDate,
                  )}
                </td>

                <td className="whitespace-nowrap px-5 py-4 text-[#4b5563]">
                  {request.status ===
                    'Partially Accepted'
                    ? (
                      <div>
                        <div className="font-semibold">
                          {request.approvedDays}{' '}
                          approved
                        </div>

                        <div className="text-[12px] text-[#6b7280]">
                          {request.numberOfDays}{' '}
                          requested
                        </div>
                      </div>
                    )
                    : request.numberOfDays}
                </td>

                <td className="px-5 py-4">
                  <LeaveRequestStatus
                    status={request.status}
                  />
                </td>

                <td className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() =>
                      onView?.(request)
                    }
                    aria-label={`View leave request for ${request.employeeName}`}
                    title="View leave request"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#2563eb] transition hover:bg-[#eff6ff] focus:outline-none focus:ring-2 focus:ring-[#bfdbfe]"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="h-5 w-5"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z"
                      />

                      <circle
                        cx="12"
                        cy="12"
                        r="2.5"
                      />
                    </svg>
                  </button>
                </td>

              </tr>
            ))
          )}

        </tbody>

      </table>
    </div>
  )
}


export default UpcomingLeavesTable