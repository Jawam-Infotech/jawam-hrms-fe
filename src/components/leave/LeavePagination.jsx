import {
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'


function LeavePagination({
  page,
  count,
  pageSize,
  next,
  previous,
  loading = false,
  onPageChange,
}) {
  const totalPages =
    Math.max(
      1,
      Math.ceil(
        count / pageSize,
      ),
    )

  const hasPrevious =
    Boolean(previous) && page > 1

  const hasNext =
    Boolean(next) &&
    page < totalPages

  if (count === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-3 border-t border-[#e5e7eb] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

      {/* RESULT INFORMATION */}

      <p className="text-[13px] font-medium text-[#6b7280]">
        Showing{' '}
        <span className="font-bold text-[#374151]">
          {(page - 1) * pageSize + 1}
        </span>
        {' '}to{' '}
        <span className="font-bold text-[#374151]">
          {Math.min(
            page * pageSize,
            count,
          )}
        </span>
        {' '}of{' '}
        <span className="font-bold text-[#374151]">
          {count}
        </span>
        {' '}leaves
      </p>


      {/* CONTROLS */}

      <div className="flex items-center gap-2">

        <button
          type="button"
          onClick={() =>
            onPageChange(page - 1)
          }
          disabled={
            loading ||
            !hasPrevious
          }
          aria-label="Previous page"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#d1d5db] bg-white text-[#374151] transition hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft size={17} />
        </button>


        <span
          aria-current="page"
          className="min-w-20 rounded-lg bg-[#f3f4f6] px-3 py-2 text-center text-[13px] font-bold text-[#111827]"
        >
          Page {page} of {totalPages}
        </span>


        <button
          type="button"
          onClick={() =>
            onPageChange(page + 1)
          }
          disabled={
            loading ||
            !hasNext
          }
          aria-label="Next page"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#d1d5db] bg-white text-[#374151] transition hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronRight size={17} />
        </button>

      </div>

    </div>
  )
}


export default LeavePagination