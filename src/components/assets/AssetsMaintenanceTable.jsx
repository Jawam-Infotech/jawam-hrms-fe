import { useState } from 'react'
import AssetStatusBadge from './AssetStatusBadge'
import AssetFilters from './AssetFilters'

function AssetsMaintenanceTable({
  maintenanceAssets = [],
  loading,
  onView,
  pagination,
  onPageChange,
  assetTypes = [],
  maintenanceFilters = {},
  onFiltersChange,
  onResetFilters,
}) {
  const [search, setSearch] = useState('')

const handleSearchChange = (event) => {
  const value = event.target.value

  setSearch(value)

  const filters = {
    ...maintenanceFilters,
  }

  if (value.trim()) {
    filters.search = value.trim()
  } else {
    delete filters.search
  }

  onFiltersChange?.(filters)
}
  const currentPage = pagination?.page || 1

  const totalPages = Math.max(
    1,
    Math.ceil((pagination?.count || 0) / 10),
  )

  const uniqueAssetTypes = Array.from(
  new Map(
    assetTypes.map((assetType) => [
      assetType.id,
      assetType,
    ]),
  ).values(),
)



  const handlePageChange = (page) => {
    if (
      page < 1 ||
      page > totalPages ||
      page === currentPage
    ) {
      return
    }

    onPageChange?.(page)
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-[18px] font-bold text-[#111827]">
          Under Maintenance
        </h2>

        <p className="mt-1 text-[13px] font-medium text-[#6b7280]">
          Assets currently under maintenance
        </p>
      </div>

      {/* Search + Filters */}
<div className="flex w-full items-center justify-between gap-4">
  <div className="relative w-full max-w-[320px]">
    <input
      type="text"
      value={search}
      onChange={handleSearchChange}
      placeholder="Search maintenance assets..."
      className="w-full rounded-lg border border-[#d1d5db] bg-white px-4 py-2.5 pr-10 text-sm font-medium text-[#111827] outline-none placeholder:text-[#9ca3af] focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
    />

    {search && (
      <button
        type="button"
        onClick={() => {
          setSearch('')

          const filters = {
            ...maintenanceFilters,
          }

          delete filters.search
          onFiltersChange?.(filters)
        }}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#111827]"
        aria-label="Clear search"
      >
        ×
      </button>
    )}
  </div>

  <AssetFilters
    filters={maintenanceFilters}
    onApply={onFiltersChange}
    onClear={onResetFilters}
    fields={[
      {
        key: 'status',
        label: 'Status',
        type: 'select',
        placeholder: 'All Statuses',
        options: [
  { value: 'ACTIVE', label: 'Active' },
  { value: 'COMPLETED', label: 'Completed' },
],
      },
      {
        key: 'asset_type',
        label: 'Asset Type',
        type: 'select',
        placeholder: 'All Asset Types',
        options: uniqueAssetTypes.map((assetType) => ({
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

      {/* Maintenance Table */}
      <div className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                <th className="px-6 py-4 text-left text-[12px] font-bold text-[#6b7280]">
                  Date
                </th>

                <th className="px-6 py-4 text-left text-[12px] font-bold text-[#6b7280]">
                  Asset Type
                </th>

                <th className="px-6 py-4 text-left text-[12px] font-bold text-[#6b7280]">
                  Asset ID
                </th>

                <th className="px-6 py-4 text-left text-[12px] font-bold text-[#6b7280]">
                  Reason
                </th>

                <th className="px-6 py-4 text-left text-[12px] font-bold text-[#6b7280]">
                  Status
                </th>

                <th className="px-6 py-4 text-left text-[12px] font-bold text-[#6b7280]">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-sm text-[#6b7280]"
                  >
                    Loading maintenance assets...
                  </td>
                </tr>
              ) : maintenanceAssets.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-sm text-[#6b7280]"
                  >
                    No assets are currently under maintenance.
                  </td>
                </tr>
              ) : (
                maintenanceAssets.map((maintenance) => (
                  <tr
                    key={maintenance.id}
                    className="border-b border-[#f3f4f6] last:border-b-0"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-[#374151]">
                      {maintenance.started_at
                        ? new Date(
                            maintenance.started_at,
                          ).toLocaleDateString()
                        : maintenance.created_at
                          ? new Date(
                              maintenance.created_at,
                            ).toLocaleDateString()
                          : '—'}
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-[#111827]">
                      {maintenance.asset_type_name ||
                        maintenance.asset_name ||
                        '—'}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-[#374151]">
                      {maintenance.asset_tag ||
                        maintenance.asset_id ||
                        maintenance.asset ||
                        '—'}
                    </td>

                    <td className="max-w-[300px] px-6 py-4 text-sm font-medium text-[#374151]">
                      {maintenance.reason || '—'}
                    </td>

                    <td className="px-6 py-4">
                      <AssetStatusBadge
                        status={maintenance.status}
                      />
                    </td>

                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() =>
                          onView?.(maintenance)
                        }
                        className="text-sm font-bold text-[#2563eb] hover:underline"
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

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-[#e5e7eb] px-6 py-4">
          <p className="text-sm font-medium text-[#6b7280]">
            Showing{' '}
            {maintenanceAssets.length === 0
              ? 0
              : (currentPage - 1) * 10 + 1}{' '}
            -{' '}
            {maintenanceAssets.length === 0
              ? 0
              : (currentPage - 1) * 10 +
                maintenanceAssets.length}{' '}
            of {pagination?.count || 0}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                handlePageChange(currentPage - 1)
              }
              disabled={!pagination?.previous}
              className="rounded-lg border border-[#e5e7eb] px-3 py-2 text-sm font-semibold text-[#374151] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            <span className="px-2 text-sm font-semibold text-[#374151]">
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              onClick={() =>
                handlePageChange(currentPage + 1)
              }
              disabled={!pagination?.next}
              className="rounded-lg border border-[#e5e7eb] px-3 py-2 text-sm font-semibold text-[#374151] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AssetsMaintenanceTable