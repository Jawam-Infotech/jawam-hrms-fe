import LeaveHistoryTable from './LeaveHistoryTable.jsx'

function LeaveHistory({
  history = [],
  loading = false,
  error = '',
  onView,
  onCancel,
  pagination,
  onPageChange,
}) {
  const hasHistory =
    Array.isArray(history) &&
    history.length > 0

  return (
    <section
      aria-labelledby="leave-history-title"
      className="rounded-[30px] border border-[#e5e7eb] bg-white p-8 shadow-sm"
    >
      {/* =========================
          HEADER
      ========================== */}

      <h2
        id="leave-history-title"
        className="text-[20px] font-black text-[#111827]"
      >
        Leave History
      </h2>

      {/* =========================
          CONTENT
      ========================== */}

      <div className="mt-6">
        {loading ? (
          <div
            role="status"
            aria-live="polite"
            className="px-6 py-8 text-center text-[#6b7280]"
          >
            Loading leave history...
          </div>
        ) : error ? (
          <div
            role="alert"
            className="px-6 py-8 text-center font-medium text-[#dc2626]"
          >
            {error}
          </div>
        ) : !hasHistory ? (
          <div
            role="status"
            className="px-6 py-8 text-center text-[#6b7280]"
          >
            No leave history found.
          </div>
        ) : (
          <LeaveHistoryTable
            history={history}
            onView={onView}
            onCancel={onCancel}
            pagination={pagination}
            onPageChange={onPageChange}
          />
        )}
      </div>
    </section>
  )
}

export default LeaveHistory