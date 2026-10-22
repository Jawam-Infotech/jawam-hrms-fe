import { useMemo } from 'react'

function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalCount = 0,
  pageSize = 10,
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
  onPageChange,
  itemLabel = 'records',
  showPageNumbers = true,
}) {
  const effectiveTotalPages = Math.max(1, totalPages || Math.ceil(totalCount / pageSize))
  const canGoPrevious = hasPrevious !== undefined ? hasPrevious : currentPage > 1
  const canGoNext = hasNext !== undefined ? hasNext : currentPage < effectiveTotalPages

  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const endItem = Math.min(currentPage * pageSize, totalCount)

  const visiblePages = useMemo(() => {
    if (!showPageNumbers) return []
    if (effectiveTotalPages <= 7) {
      return Array.from({ length: effectiveTotalPages }, (_, i) => i + 1)
    }

    const pages = [1]
    if (currentPage > 4) {
      pages.push('...')
    }

    const start = Math.max(2, currentPage - 1)
    const end = Math.min(effectiveTotalPages - 1, currentPage + 1)

    for (let i = start; i <= end; i += 1) {
      pages.push(i)
    }

    if (currentPage < effectiveTotalPages - 3) {
      pages.push('...')
    }

    pages.push(effectiveTotalPages)
    return pages
  }, [effectiveTotalPages, currentPage, showPageNumbers])

  if (totalCount <= pageSize && effectiveTotalPages <= 1) {
    return null
  }

  const handlePrevious = () => {
    if (!canGoPrevious) return
    if (onPrevious) {
      onPrevious()
    } else if (onPageChange) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (!canGoNext) return
    if (onNext) {
      onNext()
    } else if (onPageChange) {
      onPageChange(currentPage + 1)
    }
  }

  return (
    <div className="mt-6 flex flex-col gap-4 border-t border-[#e5e7eb] pt-4 md:flex-row md:items-center md:justify-between">
      <div className="text-[13px] font-medium text-[#64748b]">
        Showing <span className="font-bold text-[#1e293b]">{startItem}</span>
        {' – '}
        <span className="font-bold text-[#1e293b]">{endItem}</span>
        {' of '}
        <span className="font-bold text-[#1e293b]">{totalCount}</span>
        {' '}{itemLabel}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handlePrevious}
          disabled={!canGoPrevious}
          className={`rounded-lg px-3.5 py-1.5 text-sm font-semibold transition ${
            canGoPrevious
              ? 'border border-[#d1d5db] bg-white text-[#374151] hover:bg-[#f8fafc]'
              : 'cursor-not-allowed border border-[#e5e7eb] bg-[#f1f5f9] text-[#94a3b8]'
          }`}
        >
          ← Previous
        </button>

        {showPageNumbers &&
          visiblePages.map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="flex h-9 w-9 items-center justify-center text-sm font-semibold text-[#94a3b8]"
                >
                  ...
                </span>
              )
            }

            const isActive = currentPage === page
            return (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange?.(page)}
                className={`flex h-9 min-w-9 items-center justify-center rounded-lg border px-2 text-sm font-bold transition ${
                  isActive
                    ? 'border-[#2563eb] bg-[#2563eb] text-white shadow-sm'
                    : 'border-[#d1d5db] bg-white text-[#374151] hover:bg-[#f8fafc]'
                }`}
              >
                {page}
              </button>
            )
          })}

        <button
          type="button"
          onClick={handleNext}
          disabled={!canGoNext}
          className={`rounded-lg px-3.5 py-1.5 text-sm font-semibold transition ${
            canGoNext
              ? 'border border-[#d1d5db] bg-white text-[#374151] hover:bg-[#f8fafc]'
              : 'cursor-not-allowed border border-[#e5e7eb] bg-[#f1f5f9] text-[#94a3b8]'
          }`}
        >
          Next →
        </button>
      </div>
    </div>
  )
}

export default Pagination
