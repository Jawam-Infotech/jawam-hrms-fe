function LeaveApprovalHistory({
  leaveHistory = [],
  historyLoading = false,
  historyError = null,
  historyCount = 0,
  historyPreviousPage = null,
  historyNextPage = null,
  onHistoryPageChange,
}) {
  return (
    <div className="mt-6 border-t border-[#e5e7eb] pt-5">
      <div className="mb-4">
        <h3 className="text-[16px] font-extrabold text-[#111827]">
          Approval History
        </h3>

        <p className="mt-1 text-[13px] text-[#6b7280]">
          Track all status changes and actions for this leave request.
        </p>
      </div>

      {historyLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-20 animate-pulse rounded-[14px] bg-[#f3f4f6]"
            />
          ))}
        </div>
      ) : historyError ? (
        <div
          role="alert"
          className="rounded-[14px] border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-[13px] font-medium text-[#b91c1c]"
        >
          {historyError}
        </div>
      ) : leaveHistory.length === 0 ? (
        <div className="rounded-[14px] border border-dashed border-[#d1d5db] px-4 py-6 text-center">
          <p className="text-[13px] font-semibold text-[#6b7280]">
            No approval history available.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {leaveHistory.map((entry, index) => {
            const performedBy = entry.performed_by

            const performedByName = performedBy
              ? `${performedBy.first_name || ''} ${
                  performedBy.last_name || ''
                }`.trim()
              : 'System'

            const performedAt = entry.performed_at
              ? new Intl.DateTimeFormat('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                }).format(new Date(entry.performed_at))
              : '--'

            return (
              <div
                key={entry.id || `${entry.performed_at}-${index}`}
                className="relative pl-7"
              >
                {/* TIMELINE DOT */}
                <span className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-[#3b82f6]" />

                {/* TIMELINE LINE */}
                {index < leaveHistory.length - 1 && (
                  <span className="absolute left-[5px] top-4 h-[calc(100%+1rem)] w-px bg-[#dbeafe]" />
                )}

                <div className="rounded-[14px] border border-[#e5e7eb] bg-[#fafafa] p-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-[14px] font-extrabold text-[#111827]">
                        {entry.new_status || '--'}
                      </p>

                      <p className="mt-1 text-[12px] font-medium text-[#6b7280]">
                        {entry.previous_status
                          ? `${entry.previous_status} → ${entry.new_status}`
                          : `Status changed to ${entry.new_status || '--'}`}
                      </p>
                    </div>

                    <span className="text-[11px] font-semibold text-[#9ca3af]">
                      {performedAt}
                    </span>
                  </div>

                  <div className="mt-3">
                    <p className="text-[13px] font-bold text-[#374151]">
                      {performedByName}
                    </p>

                    {performedBy && (
                      <p className="mt-1 text-[12px] text-[#6b7280]">
                        {[performedBy.designation, performedBy.department]
                          .filter(Boolean)
                          .join(' • ') || '--'}
                      </p>
                    )}
                  </div>

                  {entry.note && (
                    <div className="mt-3 rounded-xl bg-white p-3">
                      <p className="text-[12px] font-semibold text-[#6b7280]">
                        Note
                      </p>

                      <p className="mt-1 text-[13px] text-[#374151]">
                        {entry.note}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}

          {/* HISTORY PAGINATION */}
          {(historyPreviousPage || historyNextPage) && (
            <div className="flex items-center justify-between border-t border-[#e5e7eb] pt-4">
              <button
                type="button"
                disabled={historyLoading || !historyPreviousPage}
                onClick={() =>
                  onHistoryPageChange?.(
                    Math.max(
                      1,
                      Math.ceil((historyCount - leaveHistory.length) / 20),
                    ),
                  )
                }
                className="rounded-full border border-[#d1d5db] px-4 py-2 text-[12px] font-bold text-[#374151] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <span className="text-[12px] font-semibold text-[#6b7280]">
                {historyCount} history entries
              </span>

              <button
                type="button"
                disabled={historyLoading || !historyNextPage}
                onClick={() => onHistoryPageChange?.(2)}
                className="rounded-full border border-[#d1d5db] px-4 py-2 text-[12px] font-bold text-[#374151] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default LeaveApprovalHistory
