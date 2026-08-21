import LeaveHistoryRow from './LeaveHistoryRow.jsx'

function LeaveHistoryTable({
  history = [],
  onView,
  onCancel,
  pagination,
  onPageChange,
}) {
  const currentPage = pagination?.page || 1
  const pageSize = pagination?.pageSize || 10
  const totalCount = pagination?.count || 0

  const totalPages = Math.max(
    1,
    Math.ceil(totalCount / pageSize),
  )

  const hasPrevious =
    Boolean(pagination?.previous) &&
    currentPage > 1

  const hasNext =
    Boolean(pagination?.next) &&
    currentPage < totalPages

  return (
    <div>
      {/* =========================
          TABLE
      ========================== */}

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-[14px]">
          <thead>
            <tr className="border-b border-[#e5e7eb] text-[#6b7280]">
              <th className="px-6 py-4 font-semibold">
                Date
              </th>

              <th className="px-6 py-4 font-semibold">
                Leave Type
              </th>

              <th className="px-6 py-4 font-semibold">
                Days
              </th>

              <th className="px-6 py-4 font-semibold">
                Reason
              </th>

              <th className="px-6 py-4 font-semibold">
                Status
              </th>

              <th className="px-6 py-4 font-semibold">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {history.map((entry) => (
              <LeaveHistoryRow
                key={entry.id}
                entry={entry}
                onView={onView}
                onCancel={onCancel}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* =========================
          PAGINATION
      ========================== */}

      {totalCount > 0 && (
        <div className="mt-6 flex flex-col gap-4 border-t border-[#e5e7eb] pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[13px] text-[#6b7280]">
            Showing{' '}
            <span className="font-semibold text-[#374151]">
              {(currentPage - 1) * pageSize + 1}
            </span>
            {' '}to{' '}
            <span className="font-semibold text-[#374151]">
              {Math.min(
                currentPage * pageSize,
                totalCount,
              )}
            </span>
            {' '}of{' '}
            <span className="font-semibold text-[#374151]">
              {totalCount}
            </span>
            {' '}leave requests
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                onPageChange?.(currentPage - 1)
              }
              disabled={!hasPrevious}
              className="rounded-xl border border-[#d1d5db] px-4 py-2 text-[13px] font-semibold text-[#374151] transition hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <span className="min-w-[90px] text-center text-[13px] font-semibold text-[#374151]">
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              onClick={() =>
                onPageChange?.(currentPage + 1)
              }
              disabled={!hasNext}
              className="rounded-xl border border-[#d1d5db] px-4 py-2 text-[13px] font-semibold text-[#374151] transition hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default LeaveHistoryTable