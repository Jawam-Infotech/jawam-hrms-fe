import { useState } from 'react'
import AssetStatusBadge from './AssetStatusBadge'
import AssetRequestDetailsModal from './AssetRequestDetailsModal'
import AssetRequestsPagination from './AssetRequestsPagination'
import useAssetRequestActions from '../../hooks/useAssetRequestActions'
import OldAssetActionModal from './OldAssetActionModal'
import AssetFilters from './AssetFilters'

function AssetRequestsTable({
  assetRequests,
  loading,
  pagination,
  assetTypes = [],
  filters = {},
  onFiltersChange,
  onResetFilters,
  onPageChange,
  onRefresh,
  requestsLoading = false,
  userRole,
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

  const currentPage = pagination?.page || 1

  const {
    selectedRequest,
    availableAssets,
    oldAssetRequest,
    actionError,
    selectedOldAssetAction,
    setSelectedOldAssetAction,
    handleViewRequest,
    handleRejectRequest,
    handleApproveRequest,
    handleProcessRequest,
    handleCloseRequestDetails,
    handleOpenOldAssetAction,
    handleCloseOldAssetAction,
    handleFinalReplacementApproval,
  } = useAssetRequestActions({
    pagination,
    onRefresh,
  })

  const totalPages = Math.max(
    1,
    Math.ceil((pagination?.count || 0) / 10),
  )

  const handlePageChange = (page) => {
    if (
      page < 1 ||
      page > totalPages ||
      page === currentPage ||
      requestsLoading
    ) {
      return
    }

    onPageChange?.(page)
  }



  return (
    <>
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-[18px] font-bold text-[#111827]">
              {userRole === 'CEO'
                ? 'HR Personal Asset Requests'
                : 'HR Request Regarding Assets'}
            </h2>

            <p className="mt-1 text-[13px] font-medium text-[#6b7280]">
              {userRole === 'CEO'
                ? 'Asset requests raised by HR for personal use'
                : 'Review asset requests raised by employees'}
            </p>
          </div>
        </div>

        <div className="flex w-full items-center justify-between gap-4">
  <div className="relative w-full max-w-[320px]">
    <input
  type="text"
  value={search}
  onChange={handleSearchChange}
  placeholder="Search asset requests..."
  className="w-full rounded-lg border border-[#e5e7eb] bg-white px-4 py-2.5 pr-10 text-sm font-medium text-[#111827] outline-none placeholder:text-[#9ca3af] focus:border-[#2563eb]"
/>

    {search && (
      <button
        type="button"
        onClick={() => {
          setSearch('')

          const nextFilters = { ...filters }
          delete nextFilters.search

          onFiltersChange?.(nextFilters)
        }}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[#6b7280] hover:text-[#111827]"
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

        <div className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                  <th className="px-6 py-4 text-left text-[12px] font-bold text-[#6b7280]">
                    Date
                  </th>

                  <th className="px-6 py-4 text-left text-[12px] font-bold text-[#6b7280]">
                    Asset Name
                  </th>

                  <th className="px-6 py-4 text-left text-[12px] font-bold text-[#6b7280]">
                    Asset ID
                  </th>

                  <th className="px-6 py-4 text-left text-[12px] font-bold text-[#6b7280]">
                    Request Type
                  </th>

                  <th className="px-6 py-4 text-left text-[12px] font-bold text-[#6b7280]">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-[12px] font-bold text-[#6b7280]">
                    Request By
                  </th>

                  <th className="px-6 py-4 text-left text-[12px] font-bold text-[#6b7280]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading || requestsLoading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-10 text-center text-sm text-[#6b7280]"
                    >
                      Loading requests...
                    </td>
                  </tr>
                ) : assetRequests.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-10 text-center text-sm text-[#6b7280]"
                    >
                      No asset requests found.
                    </td>
                  </tr>
                ) : (
                  assetRequests.map((request) => (
                    <tr
                      key={request.id}
                      className="border-b border-[#f3f4f6] last:border-b-0"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-[#374151]">
                        {request.created_at
                          ? new Date(
                              request.created_at,
                            ).toLocaleDateString()
                          : '—'}
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-[#111827]">
                        {request.asset_type_name ||
                          request.asset_name ||
                          '—'}
                      </td>

                      <td className="px-6 py-4 text-sm font-medium text-[#374151]">
                        {request.asset_tag ||
                          request.asset_id ||
                          request.asset ||
                          '—'}
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex rounded-full bg-[#eff6ff] px-3 py-1 text-xs font-semibold text-[#2563eb]">
                          {request.request_type_display ||
                            request.request_type ||
                            '—'}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <AssetStatusBadge
                          status={request.status}
                        />
                      </td>

                      <td className="px-6 py-4 text-sm font-semibold text-[#111827]">
                        {request.requested_by_name ||
                          request.requested_by ||
                          '—'}
                      </td>

                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() =>
                            handleViewRequest(request)
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

          <AssetRequestsPagination
            pagination={pagination}
            currentPage={currentPage}
            totalPages={totalPages}
            requestsLoading={requestsLoading}
            onPageChange={handlePageChange}
          />
        </div>
      </section>

      {selectedRequest && (
        <AssetRequestDetailsModal
          isOpen
          request={selectedRequest}
          availableAssets={availableAssets}
          actionError={actionError}
          onOpenOldAssetAction={
            handleOpenOldAssetAction
          }
          onClose={handleCloseRequestDetails}
          onApprove={handleApproveRequest}
          onProcess={handleProcessRequest}
          onReject={handleRejectRequest}
        />
      )}

      <OldAssetActionModal
        isOpen={Boolean(oldAssetRequest)}
        selectedAction={selectedOldAssetAction}
        onSelectAction={
          setSelectedOldAssetAction
        }
        onClose={handleCloseOldAssetAction}
        onContinue={
          handleFinalReplacementApproval
        }
      />
    </>
  )
}

export default AssetRequestsTable