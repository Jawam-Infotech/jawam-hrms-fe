function AssetRequestsPagination({
  pagination,
  currentPage,
  totalPages,
  requestsLoading,
  onPageChange,
}) {
  if (!pagination?.count) {
    return null
  }

  const handlePrevious = () => {
    onPageChange?.(currentPage - 1)
  }

  const handleNext = () => {
    onPageChange?.(currentPage + 1)
  }

  return (
    <div className="flex items-center justify-between border-t border-[#e5e7eb] px-6 py-4">
      <p className="text-[13px] font-medium text-[#6b7280]">
        Showing{' '}
        {Math.min(
          (currentPage - 1) * 10 + 1,
          pagination.count,
        )}{' '}
        -{' '}
        {Math.min(
          currentPage * 10,
          pagination.count,
        )}{' '}
        of {pagination.count}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={
            currentPage === 1 ||
            requestsLoading
          }
          className="rounded-lg border border-[#e5e7eb] px-4 py-2 text-[13px] font-bold text-[#374151] transition hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>

        <span className="px-2 text-[13px] font-semibold text-[#374151]">
          Page {currentPage} of {totalPages}
        </span>

        <button
          type="button"
          onClick={handleNext}
          disabled={
            currentPage === totalPages ||
            requestsLoading
          }
          className="rounded-lg border border-[#e5e7eb] px-4 py-2 text-[13px] font-bold text-[#374151] transition hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default AssetRequestsPagination