function PayrollPagination({
  count,
  hasPrevious,
  hasNext,
  currentPage,
  loading,
  onPrevious,
  onNext,
}) {
  return (
    <div className="mt-6 flex flex-col gap-3 border-t border-[#e5e7eb] pt-4 text-[14px] sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[#6b7280]">
        Page <span className="font-bold text-[#111827]">{currentPage}</span>
        {' · '}
        <span className="font-bold text-[#111827]">{count}</span> total records
      </p>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onPrevious}
          disabled={!hasPrevious || loading}
          className="rounded-full border border-[#d1d5db] px-4 py-2 font-semibold text-[#374151] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!hasNext || loading}
          className="rounded-full border border-[#d1d5db] px-4 py-2 font-semibold text-[#374151] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default PayrollPagination
