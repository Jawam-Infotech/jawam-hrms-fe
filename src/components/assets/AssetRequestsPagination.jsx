import Pagination from '../ui/Pagination.jsx'

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

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      totalCount={pagination.count}
      hasPrevious={currentPage > 1 && !requestsLoading}
      hasNext={currentPage < totalPages && !requestsLoading}
      onPrevious={() => onPageChange?.(currentPage - 1)}
      onNext={() => onPageChange?.(currentPage + 1)}
      onPageChange={onPageChange}
      itemLabel="requests"
      pageSize={10}
    />
  )
}

export default AssetRequestsPagination