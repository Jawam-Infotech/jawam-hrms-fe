import { useEffect, useState } from 'react'
import {
  fetchDisposalRequestById,
  approveDisposalRequestById,
  rejectDisposalRequestById,
} from '../../services/assetService'
import DisposalRequestDetailsModal from './DisposalRequestDetailsModal'
import AssetStatusBadge from './AssetStatusBadge'
import AssetFilters from './AssetFilters'

function AssetDisposalRequestsTable({
  disposalRequests = [],
  loading,
  pagination,
  onPageChange,
  onRefresh,
  onRefreshSummary,
  userRole,
  assetTypes = [],
  disposalRequestFilters = {},
  onFiltersChange,
  onResetFilters,
}) {
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState('')
  const [search, setSearch] = useState('')
  const handleSearchChange = (event) => {
  const value = event.target.value

  setSearch(value)

  const filters = {
    ...disposalRequestFilters,
  }

  if (value.trim()) {
    filters.search = value.trim()
  } else {
    delete filters.search
  }

  onFiltersChange?.(filters)
}

  const totalPages = Math.max(
    1,
    Math.ceil((pagination?.count || 0) / 10),
  )


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
      setDetailsLoading(true)

      const response = await fetchDisposalRequestById(
        request.id,
      )

      setSelectedRequest(response)
    } catch (error) {
      console.error(
        'Failed to load disposal request:',
        error,
      )
    } finally {
      setDetailsLoading(false)
    }
  }

  const handleApprove = async (payload) => {
    if (!selectedRequest?.id) return

    try {
      setActionError('')
      setActionLoading(true)

      await approveDisposalRequestById(
        selectedRequest.id,
        payload,
      )

      await onRefresh?.(
        pagination?.page || 1,
      )

      await onRefreshSummary?.()

      setSelectedRequest(null)
    } catch (error) {
      console.error(
        'Failed to approve disposal request:',
        error,
      )

      console.error(
        'API error response:',
        error?.response?.data,
      )

      setActionError(
        error?.response?.data?.detail ||
          error?.response?.data?.message ||
          error?.message ||
          'Unable to approve the disposal request.',
      )
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async (payload) => {
    if (!selectedRequest?.id) return

    try {
      setActionError('')
      setActionLoading(true)

      await rejectDisposalRequestById(
        selectedRequest.id,
        payload,
      )

      await onRefresh?.(
        pagination?.page || 1,
      )

      setSelectedRequest(null)
    } catch (error) {
      console.error(
        'Failed to reject disposal request:',
        error,
      )

      console.error(
        'API error response:',
        error?.response?.data,
      )

      setActionError(
        error?.response?.data?.detail ||
          error?.response?.data?.message ||
          error?.message ||
          'Unable to reject the disposal request.',
      )
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-[18px] font-bold text-[#111827]">
          Disposal Requests
        </h2>

        <p className="mt-1 text-[13px] font-medium text-[#6b7280]">
          Asset disposal requests awaiting CEO approval
        </p>
      </div>

      {/* Search + Filters */}
<div className="flex w-full items-center justify-between gap-4">
  <div className="relative w-full max-w-[320px]">
    <input
      type="text"
      value={search}
      onChange={handleSearchChange}
      placeholder="Search disposal requests..."
      className="w-full rounded-lg border border-[#d1d5db] bg-white px-4 py-2.5 pr-10 text-sm font-medium text-[#111827] outline-none placeholder:text-[#9ca3af] focus:border-[#2563eb] focus:ring-1 focus:ring-[#2563eb]"
    />

    {search && (
      <button
        type="button"
        onClick={() => setSearch('')}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b7280] hover:text-[#111827]"
        aria-label="Clear search"
      >
        ×
      </button>
    )}
  </div>

  <AssetFilters
    filters={disposalRequestFilters}
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

      {/* Table */}
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
                  Asset ID
                </th>

                <th className="px-6 py-4 text-left text-[12px] font-bold text-[#6b7280]">
                  Reason
                </th>

                <th className="px-6 py-4 text-left text-[12px] font-bold text-[#6b7280]">
                  Request By
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
                    Loading disposal requests...
                  </td>
                </tr>
              ) : disposalRequests.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-sm text-[#6b7280]"
                  >
                    No disposal requests found.
                  </td>
                </tr>
              ) : (
                disposalRequests.map((request) => (
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
                      {request.asset_type_name || '—'}
                    </td>

                    <td className="px-6 py-4 text-sm font-medium text-[#374151]">
                      {request.asset_tag || '—'}
                    </td>

                    <td className="max-w-[300px] px-6 py-4 text-sm font-medium text-[#374151]">
                      {request.reason || '—'}
                    </td>

                    <td className="px-6 py-4 text-sm font-semibold text-[#111827]">
                      {request.requested_by_name || '—'}
                    </td>

                    <td className="px-6 py-4">
                      <AssetStatusBadge
                        status={request.status}
                      />
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
                className="rounded-lg border border-[#d1d5db] px-3 py-2 text-[13px] font-semibold text-[#374151] disabled:cursor-not-allowed disabled:opacity-50"
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
                className="rounded-lg border border-[#d1d5db] px-3 py-2 text-[13px] font-semibold text-[#374151] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {selectedRequest && (
        <DisposalRequestDetailsModal
          request={selectedRequest}
          loading={detailsLoading}
          actionLoading={actionLoading}
          actionError={actionError}
          onApprove={handleApprove}
          onReject={handleReject}
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

export default AssetDisposalRequestsTable