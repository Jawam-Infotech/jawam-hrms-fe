import { useState } from 'react'
import AssetStatusBadge from './AssetStatusBadge'
import InventoryRequestDetailsModal from './InventoryRequestDetailsModal'
import {
  fetchInventoryRequestById,
  approveInventoryRequestById,
  rejectInventoryRequestById,
  receiveInventoryRequestById,
} from '../../services/assetService'
import AssetFilters from './AssetFilters'

function InventoryRequestsTable({
  inventoryRequests = [],
  loading,
  pagination,
  assetTypes = [],
  inventoryRequestFilters = {},
  onFiltersChange,
  onResetFilters,
  onPageChange,
  onRefresh,
  onRefreshSummary,
  userRole,
}) {
  const totalPages = Math.max(
    1,
    Math.ceil((pagination?.count || 0) / 10),
  )

  const [selectedRequest, setSelectedRequest] = useState(null)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
const [actionError, setActionError] = useState('')
const [search, setSearch] = useState('')

const handleSearchChange = (event) => {
  const value = event.target.value

  setSearch(value)

  const filters = {
    ...inventoryRequestFilters,
  }

  if (value.trim()) {
    filters.search = value.trim()
  } else {
    delete filters.search
  }

  onFiltersChange?.(filters)
}



  const handlePageChange = (page) => {
    if (
      page < 1 ||
      page > totalPages ||
      page === pagination?.page ||
      loading
    ) {
      return
    }

    onPageChange?.(page)
  }

  const handleViewRequest = async (request) => {
    try {
      setActionError('')
      setDetailsLoading(true)

      const response = await fetchInventoryRequestById(request.id)
      setSelectedRequest(response)
    } catch (error) {
      console.error('Failed to load inventory request:', error)
    } finally {
      setDetailsLoading(false)
    }
  }

  const handleApprove = async (payload) => {
    if (!selectedRequest) return

    try {
      setActionError('')
      setActionLoading(true)

      await approveInventoryRequestById(
        selectedRequest.id,
        payload,
      )

      await onRefresh?.(pagination?.page || 1)
      await onRefreshSummary?.()

      setSelectedRequest(null)
    } catch (error) {
      console.error(
        'Failed to approve inventory request:',
        error,
      )

      setActionError(
        error?.response?.data?.detail ||
          error?.response?.data?.message ||
          error?.message ||
          'Unable to approve the inventory request.',
      )
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async (payload) => {
    if (!selectedRequest) return

    try {
      setActionError('')
      setActionLoading(true)

      await rejectInventoryRequestById(
        selectedRequest.id,
        {
          review_note:
            payload?.review_note || '',
        },
      )

      await onRefresh?.(pagination?.page || 1)

      setSelectedRequest(null)
    } catch (error) {
      console.error(
        'Failed to reject inventory request:',
        error,
      )

      setActionError(
        error?.response?.data?.detail ||
          error?.response?.data?.message ||
          error?.message ||
          'Unable to reject the inventory request.',
      )
    } finally {
      setActionLoading(false)
    }
  }

  const handleReceive = async () => {
    if (!selectedRequest) return

    try {
      setActionError('')
      setActionLoading(true)

      await receiveInventoryRequestById(
        selectedRequest.id,
      )

      await onRefresh?.(pagination?.page || 1)
      await onRefreshSummary?.()

      setSelectedRequest(null)
    } catch (error) {
      console.error(
        'Failed to receive inventory:',
        error,
      )

      setActionError(
        error?.response?.data?.detail ||
          error?.response?.data?.message ||
          error?.message ||
          'Unable to receive the inventory.',
      )
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-[18px] font-bold text-[#111827]">
          Inventory Requests
        </h2>

        <p className="mt-1 text-[13px] font-medium text-[#6b7280]">
          Inventory requests submitted by HR
        </p>
      </div>

     <div className="flex w-full items-center justify-between gap-4">
  <div className="relative w-full max-w-[320px]">
    <input
      type="text"
      value={search}
      onChange={handleSearchChange}
      placeholder="Search inventory requests..."
      className="w-full rounded-lg border border-[#d1d5db] bg-white px-4 py-2.5 pr-10 text-sm font-medium text-[#111827] outline-none placeholder:text-[#9ca3af] focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
    />

    {search && (
      <button
        type="button"
        onClick={() => {
          setSearch('')

          const filters = {
            ...inventoryRequestFilters,
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
    filters={inventoryRequestFilters}
    onApply={onFiltersChange}
    onClear={onResetFilters}
    fields={[
      {
        key: 'status',
        label: 'Status',
        type: 'select',
        placeholder: 'All Statuses',
        options: [
          { value: 'PENDING', label: 'Pending' },
          { value: 'APPROVED', label: 'Approved' },
          { value: 'REJECTED', label: 'Rejected' },
          { value: 'RECEIVED', label: 'Received' },
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
                  Asset Type
                </th>

                <th className="px-6 py-4 text-left text-[12px] font-bold text-[#6b7280]">
                  Quantity
                </th>

                <th className="px-6 py-4 text-left text-[12px] font-bold text-[#6b7280]">
                  Reason
                </th>

                <th className="px-6 py-4 text-left text-[12px] font-bold text-[#6b7280]">
                  Requested By
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
                    colSpan={7}
                    className="px-6 py-10 text-center text-sm text-[#6b7280]"
                  >
                    Loading inventory requests...
                  </td>
                </tr>
              ) : inventoryRequests.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-sm text-[#6b7280]"
                  >
                    No inventory requests found.
                  </td>
                </tr>
              ) : (
                inventoryRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="border-b border-[#f3f4f6] last:border-b-0"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-[#374151]">
                      {request.created_at
                        ? new Date(
                            request.created_at,
                          ).toLocaleDateString('en-GB')
                        : '—'}
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-[#111827]">
                      {request.asset_type_name || '—'}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-[#374151]">
                      {request.quantity ?? '—'}
                    </td>

                    <td className="max-w-[300px] px-6 py-4 text-sm font-medium text-[#374151]">
                      {request.reason || '—'}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-[#374151]">
                      {request.requested_by_name || '—'}
                    </td>

                    <td className="px-6 py-4">
                      <AssetStatusBadge status={request.status} />
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

        {pagination?.count > 0 && (
          <div className="flex items-center justify-between border-t border-[#e5e7eb] px-6 py-4">
            <p className="text-[13px] font-medium text-[#6b7280]">
              Showing{' '}
              {Math.min(
                ((pagination?.page || 1) - 1) * 10 + 1,
                pagination.count,
              )}{' '}
              -{' '}
              {Math.min(
                (pagination?.page || 1) * 10,
                pagination.count,
              )}{' '}
              of {pagination.count}
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  handlePageChange(
                    (pagination?.page || 1) - 1,
                  )
                }
                disabled={
                  (pagination?.page || 1) === 1 ||
                  loading
                }
                className="rounded-lg border border-[#e5e7eb] px-4 py-2 text-[13px] font-bold text-[#374151] transition hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <span className="px-2 text-[13px] font-semibold text-[#374151]">
                Page {pagination?.page || 1} of {totalPages}
              </span>

              <button
                type="button"
                onClick={() =>
                  handlePageChange(
                    (pagination?.page || 1) + 1,
                  )
                }
                disabled={
                  (pagination?.page || 1) === totalPages ||
                  loading
                }
                className="rounded-lg border border-[#e5e7eb] px-4 py-2 text-[13px] font-bold text-[#374151] transition hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedRequest && (
        <InventoryRequestDetailsModal
          request={selectedRequest}
          loading={detailsLoading}
          actionLoading={actionLoading}
          actionError={actionError}
          onApprove={handleApprove}
          onReject={handleReject}
          onReceive={
            userRole === 'HR'
              ? handleReceive
              : undefined
          }
          onClose={() => {
            setActionError('')
            setSelectedRequest(null)
          }}
          userRole={userRole}
        />
      )}
    </section>
  )
}

export default InventoryRequestsTable