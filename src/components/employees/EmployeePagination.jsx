import { EMPLOYEE_PAGE_SIZE } from '../../constants/pagination.js'

function EmployeePagination({
  currentPage,
  totalPages,
  totalCount,
  hasPrevious,
  hasNext,
  onPrevious,
  onNext,
  onPageChange,
}) {
  const startItem =
    totalCount === 0
      ? 0
      : (currentPage - 1) * EMPLOYEE_PAGE_SIZE + 1

  const endItem = Math.min(
    currentPage * EMPLOYEE_PAGE_SIZE,
    totalCount
  )

const getVisiblePages = () => {
  const pages = []

  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  pages.push(1)

  if (currentPage > 4) {
    pages.push('...')
  }

  const start = Math.max(2, currentPage - 1)
  const end = Math.min(totalPages - 1, currentPage + 1)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  if (currentPage < totalPages - 3) {
    pages.push('...')
  }

  pages.push(totalPages)

  return pages
}

const pages = getVisiblePages()

  return (
    <div className="mt-6 flex flex-col gap-4 border-t border-gray-200 pt-4 md:flex-row md:items-center md:justify-between">
      <div className="text-sm text-gray-600">
        Showing{' '}
        <span className="font-semibold">{startItem}</span>
        {'–'}
        <span className="font-semibold">{endItem}</span>
        {' '}of{' '}
        <span className="font-semibold">{totalCount}</span>
        {' '}employees
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
  type="button"
  onClick={onPrevious}
  disabled={!hasPrevious}
  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
    hasPrevious
      ? 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
      : 'cursor-not-allowed border border-gray-200 bg-gray-100 text-gray-400'
  }`}
>
  ← Previous
</button>

        {pages.map((page, index) => {
  if (page === '...') {
    return (
      <span
        key={`ellipsis-${index}`}
        className="flex h-10 w-10 items-center justify-center text-gray-500"
      >
        ...
      </span>
    )
  }

  return (
    <button
      key={page}
      type="button"
      onClick={() => onPageChange(page)}
      className={`flex h-10 w-10 items-center justify-center rounded-lg border text-sm font-medium transition ${
        currentPage === page
          ? 'border-blue-600 bg-blue-600 text-white'
          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
      }`}
    >
      {page}
    </button>
  )
})}

        <button
  type="button"
  onClick={onNext}
  disabled={!hasNext}
  className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
    hasNext
      ? 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-100'
      : 'cursor-not-allowed border border-gray-200 bg-gray-100 text-gray-400'
  }`}
>
  Next →
</button>
      </div>
    </div>
  )
}

export default EmployeePagination