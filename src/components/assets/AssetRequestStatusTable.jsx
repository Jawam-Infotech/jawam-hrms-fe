import { useState } from 'react'
import AssetFilters from './AssetFilters'

function AssetRequestStatusTable({
  requests = [],
  loading = false,
  pagination,
  assetTypes = [],
  filters = {},
  onFiltersChange,
  onResetFilters,
  onPageChange,
  onViewRequest,
}) {
    const [search, setSearch] = useState('')

const handleSearchChange = (event) => {
  const value = event.target.value

  setSearch(value)

  const nextFilters = {
    ...filters,
  }

  if (value.trim()) {
    nextFilters.search = value.trim()
  } else {
    delete nextFilters.search
  }

  onFiltersChange?.(nextFilters)
}
  const currentPage = pagination?.current_page || 1
  const totalPages = pagination?.total_pages || 1

  const handlePageChange = (page) => {
    if (
      page < 1 ||
      page > totalPages ||
      page === currentPage ||
      loading
    ) {
      return
    }

    onPageChange?.(page)
  }

  const formatDate = (date) => {
    if (!date) return '—'

    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const getStatusStyle = (status) => {
    switch (String(status || '').toUpperCase()) {
      case 'PENDING':
        return 'bg-[#fef3c7] text-[#d97706]'

      case 'APPROVED':
        return 'bg-[#ccfbf1] text-[#0d9488]'

      case 'PROCESSING':
        return 'bg-[#dbeafe] text-[#2563eb]'

      case 'COMPLETED':
        return 'bg-[#dcfce7] text-[#16a34a]'

      case 'REJECTED':
        return 'bg-[#fee2e2] text-[#dc2626]'

      default:
        return 'bg-[#f3f4f6] text-[#374151]'
    }
  }

  return (
    <section className="mt-8 w-full rounded-[24px] bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-[20px] font-black text-[#111827]">
          My Asset Requests
        </h2>

        <p className="mt-1 text-[14px] font-medium text-[#6b7280]">
          Track the status of your asset requests.
        </p>
      </div>

      <div className="mb-6 flex w-full items-center justify-between gap-4">
  <div className="relative w-full max-w-[320px]">
    <input
      type="text"
      value={search}
      onChange={handleSearchChange}
      placeholder="Search asset requests..."
      className="w-full rounded-lg border border-[#d1d5db] bg-white px-4 py-2.5 pr-10 text-sm font-medium text-[#111827] outline-none placeholder:text-[#9ca3af] focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
    />

    {search && (
      <button
        type="button"
        onClick={() => {
          setSearch('')

          const nextFilters = {
            ...filters,
          }

          delete nextFilters.search
          onFiltersChange?.(nextFilters)
        }}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#111827]"
        aria-label="Clear search"
      >
        ×
      </button>
    )}
  </div>

  <AssetFilters
          filters={filters}
          onApply={onFiltersChange}
          onClear={onResetFilters}
          fields={[
            {
              key: 'status',
              label: 'Status',
              type: 'select',
              placeholder: 'All Statuses',
              options: [
                {
                  value: 'PENDING',
                  label: 'Pending',
                },
                {
                  value: 'APPROVED',
                  label: 'Approved',
                },
                {
                  value: 'PROCESSING',
                  label: 'Processing',
                },
                {
                  value: 'COMPLETED',
                  label: 'Completed',
                },
                {
                  value: 'REJECTED',
                  label: 'Rejected',
                },
              ],
            },
            {
              key: 'request_type',
              label: 'Request Type',
              type: 'select',
              placeholder: 'All Request Types',
              options: [
                {
                  value: 'REQUEST_ASSET',
                  label: 'Request Asset',
                },
                {
                  value: 'REPLACE_ASSET',
                  label: 'Replace Asset',
                },
                {
                  value: 'RETURN_ASSET',
                  label: 'Return Asset',
                },
                {
                  value: 'REPORT_LOST',
                  label: 'Report Lost',
                },
              ],
            },
            {
              key: 'asset_type',
              label: 'Asset Type',
              type: 'select',
              placeholder: 'All Asset Types',
              options: assetTypes.map((assetType) => ({
                value: assetType.id,
                label: assetType.name,
              })),
            },
            {
              key: 'date',
              label: 'Date',
              type: 'date-range',
              fromKey: 'start_date',
              toKey: 'end_date',
            },
          ]}
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] border-collapse">
          <thead>
            <tr className="border-b border-[#e5e7eb]">
              <th className="px-4 py-4 text-left text-[12px] font-extrabold uppercase tracking-wide text-[#6b7280]">
                Request ID
              </th>

              <th className="px-4 py-4 text-left text-[12px] font-extrabold uppercase tracking-wide text-[#6b7280]">
                Asset Type
              </th>

              <th className="px-4 py-4 text-left text-[12px] font-extrabold uppercase tracking-wide text-[#6b7280]">
                Request Type
              </th>

              <th className="px-4 py-4 text-left text-[12px] font-extrabold uppercase tracking-wide text-[#6b7280]">
                Reason
              </th>

              <th className="px-4 py-4 text-left text-[12px] font-extrabold uppercase tracking-wide text-[#6b7280]">
                Date
              </th>

              <th className="px-4 py-4 text-left text-[12px] font-extrabold uppercase tracking-wide text-[#6b7280]">
                Status
              </th>

              <th className="px-4 py-4 text-left text-[12px] font-extrabold uppercase tracking-wide text-[#6b7280]">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="7"
                  className="px-4 py-10 text-center text-[14px] font-medium text-[#6b7280]"
                >
                  Loading requests...
                </td>
              </tr>
            ) : requests.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="px-4 py-10 text-center text-[14px] font-medium text-[#6b7280]"
                >
                  No asset requests raised yet.
                </td>
              </tr>
            ) : (
              requests.map((request) => (
                <tr
                  key={request.id}
                  className="border-b border-[#e5e7eb] transition hover:bg-[#f9fafb]"
                >
                  <td className="px-4 py-4 text-[14px] font-bold text-[#111827]">
                    #{request.id}
                  </td>

                  <td className="px-4 py-4 text-[14px] font-bold text-[#111827]">
                    {request.asset_type_name ||
                      request.asset_type?.name ||
                      '—'}
                  </td>

                  <td className="px-4 py-4 text-[14px] font-medium text-[#374151]">
                    {request.request_type || '—'}
                  </td>

                  <td className="max-w-[250px] truncate px-4 py-4 text-[14px] font-medium text-[#374151]">
                    {request.reason || '—'}
                  </td>

                  <td className="px-4 py-4 text-[14px] font-medium text-[#374151]">
                    {formatDate(request.created_at)}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-[12px] font-bold ${getStatusStyle(
                        request.status,
                      )}`}
                    >
                      {request.status || '—'}
                    </span>
                  </td>

                  <td className="px-4 py-4">
                    <button
                      type="button"
                      onClick={() => onViewRequest?.(request)}
                      className="rounded-full border border-[#3b82f6] bg-white px-4 py-2 text-[12px] font-bold text-[#2563eb] transition-all hover:bg-[#eff6ff]"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination?.count > 0 && (
        <div className="mt-4 flex items-center justify-between border-t border-[#e5e7eb] pt-4">
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
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="rounded-lg border border-[#e5e7eb] px-4 py-2 text-[13px] font-bold text-[#374151] transition hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <span className="px-2 text-[13px] font-semibold text-[#374151]">
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              className="rounded-lg border border-[#e5e7eb] px-4 py-2 text-[13px] font-bold text-[#374151] transition hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export default AssetRequestStatusTable