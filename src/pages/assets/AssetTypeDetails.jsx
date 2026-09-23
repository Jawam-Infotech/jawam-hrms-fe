import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import DashboardLayout from '../../layouts/DashboardLayout'
import AssetStatusBadge from '../../components/assets/AssetStatusBadge'
import {
  fetchAssets,
  fetchAssetAssignments,
  fetchAllDisposalRequests,
} from '../../services/assetService'
import { getEmployeesByIds } from '../../services/employeeService'
import useAssetTypeDetailsData from '../../hooks/useAssetTypeDetailsData'

function AssetTypeDetails() {
  const { assetTypeId } = useParams()
  const navigate = useNavigate()

  const [assets, setAssets] = useState([])
  const [assignments, setAssignments] = useState([])
  const [disposalRequests, setDisposalRequests] = useState([])

  const [assetsPagination, setAssetsPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    page: 1,
  })

  const [employeeNames, setEmployeeNames] = useState({})

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  const loadAssetsPage = useCallback(
    async (page = 1) => {
      try {
        setLoading(true)
        setError('')

        const params = {
  asset_type: assetTypeId,
  page,
}

if (search.trim()) {
  params.search = search.trim()
}

if (statusFilter !== 'ALL') {
  params.status = statusFilter
}

const assetsResponse = await fetchAssets(params)

        const assetList = Array.isArray(assetsResponse)
          ? assetsResponse
          : assetsResponse?.results ?? []

        setAssets(assetList)

        setAssetsPagination({
          count: Array.isArray(assetsResponse)
            ? assetsResponse.length
            : assetsResponse?.count || 0,
          next: Array.isArray(assetsResponse)
            ? null
            : assetsResponse?.next || null,
          previous: Array.isArray(assetsResponse)
            ? null
            : assetsResponse?.previous || null,
          page,
        })
      } catch (err) {
        console.error(
          'Failed to load assets:',
          err,
        )

        setError(
          err?.response?.data?.detail ||
            'Unable to load assets. Please try again.',
        )
      } finally {
        setLoading(false)
      }
    },
    [assetTypeId, search, statusFilter],
  )

  const loadSharedDetails = useCallback(
    async () => {
      try {
        const [
          assignmentsResponse,
          disposalResponse,
        ] = await Promise.all([
          fetchAssetAssignments(),
          fetchAllDisposalRequests(),
        ])

        const assignmentList = Array.isArray(
          assignmentsResponse,
        )
          ? assignmentsResponse
          : assignmentsResponse?.results ?? []

        const disposalList = Array.isArray(
          disposalResponse,
        )
          ? disposalResponse
          : disposalResponse?.results ?? []

        const activeAssignments = assignmentList.filter(
          (assignment) =>
            String(
              assignment?.status || '',
            ).toUpperCase() === 'ACTIVE',
        )

        setAssignments(activeAssignments)
        setDisposalRequests(disposalList)

        const employeeIds = [
          ...new Set(
            activeAssignments
              .map(
                (assignment) =>
                  assignment?.employee,
              )
              .filter(
                (employeeId) =>
                  employeeId !== null &&
                  employeeId !== undefined,
              )
              .map((employeeId) =>
                String(employeeId),
              ),
          ),
        ]

        const employeeNameMap =
          await getEmployeesByIds(employeeIds)

        setEmployeeNames(employeeNameMap)
      } catch (err) {
        console.error(
          'Failed to load shared asset details:',
          err,
        )

        setError(
          err?.response?.data?.detail ||
            'Unable to load asset details. Please try again.',
        )
      }
    },
    [],
  )

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadAssetsPage(1)
    void loadSharedDetails()
  }, [loadAssetsPage, loadSharedDetails])

  const currentPage = assetsPagination?.page || 1

  const totalPages = Math.max(
    1,
    Math.ceil(
      (assetsPagination?.count || 0) / 10,
    ),
  )

  const handleAssetsPageChange = (page) => {
    if (
      page < 1 ||
      page > totalPages ||
      page === currentPage ||
      loading
    ) {
      return
    }

    loadAssetsPage(page)
  }

  const {
    enrichedAssets,
    filteredAssets,
    summary,
  } = useAssetTypeDetailsData({
    assets,
    assignments,
    disposalRequests,
    employeeNames,
  })

  const assetTypeName =
    enrichedAssets[0]?.asset_type_name ||
    `Asset Type ${assetTypeId}`

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <section>
          <button
            type="button"
            onClick={() =>
              navigate('/assets/manage')
            }
            className="mb-4 text-sm font-bold text-[#2563eb] hover:underline"
          >
            ← Back to Asset Management
          </button>

          <div>
            <h1 className="text-[28px] font-black text-[#111827]">
              {assetTypeName}
            </h1>

            <p className="mt-1 text-[13px] font-medium text-[#6b7280]">
              Detailed information about physical{' '}
              {assetTypeName.toLowerCase()} assets
            </p>

            <p className="mt-1 text-[12px] font-semibold text-[#9ca3af]">
              Asset Type ID: {assetTypeId}
            </p>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="rounded-[24px] border border-[#fecaca] bg-[#fef2f2] p-6 shadow-sm">
            <p className="text-[14px] font-bold text-[#991b1b]">
              Unable to load assets
            </p>

            <p className="mt-1 text-[12px] font-medium text-[#b91c1c]">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="mt-4 rounded-xl bg-white px-4 py-2 text-[13px] font-bold text-[#991b1b] ring-1 ring-[#fecaca] hover:bg-[#fff7f7]"
            >
              Retry
            </button>
          </div>
        )}

        {!error && (
          <>
            {/* Summary */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <SummaryCard
                title="Total Assets"
                value={summary.total}
                description="All assets of this type"
                valueClass="text-[#3b82f6]"
                loading={loading}
              />

              <SummaryCard
                title="Occupied Assets"
                value={summary.occupied}
                description="Currently assigned to employees"
                valueClass="text-[#10b981]"
                loading={loading}
              />

              <SummaryCard
                title="Available Assets"
                value={summary.available}
                description="Ready to be assigned"
                valueClass="text-[#6366f1]"
                loading={loading}
              />

              <SummaryCard
                title="Under Maintenance"
                value={summary.maintenance}
                description="Currently under maintenance"
                valueClass="text-[#f59e0b]"
                loading={loading}
              />
            </div>

            {/* Assets Table */}
            <section className="space-y-4">
              <div>
                <h2 className="text-[18px] font-bold text-[#111827]">
                  Physical Assets
                </h2>

                <p className="mt-1 text-[13px] font-medium text-[#6b7280]">
                  Overview of individual assets and
                  their current assignment
                </p>
              </div>

              <div className="overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white">
                {/* Filters */}
                <div className="flex flex-col gap-3 border-b border-[#e5e7eb] p-5 md:flex-row md:items-center md:justify-between">
                  <input
                    type="text"
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search assets..."
                    className="w-full rounded-xl border border-[#e5e7eb] px-4 py-2.5 text-[13px] font-medium text-[#111827] outline-none placeholder:text-[#9ca3af] focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10 md:max-w-md"
                  />

                  <select
                    value={statusFilter}
                    onChange={(event) =>
                      setStatusFilter(
                        event.target.value,
                      )
                    }
                    className="rounded-xl border border-[#e5e7eb] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#374151] outline-none focus:border-[#2563eb]"
                  >
                    <option value="ALL">
                      All Statuses
                    </option>

                    <option value="ACTIVE">
                      Active
                    </option>

                    <option value="PENDING_DISPOSAL">
                      Pending Disposal
                    </option>

                    <option value="UNDER_MAINTENANCE">
                      Under Maintenance
                    </option>

                    <option value="LOST">
                      Lost
                    </option>

                    <option value="DISPOSED">
                      Disposed
                    </option>
                  </select>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[900px]">
                    <thead>
                      <tr className="border-b border-[#e5e7eb] bg-[#f9fafb]">
                        <th className="px-6 py-4 text-left text-[12px] font-bold text-[#6b7280]">
                          Asset ID
                        </th>

                        <th className="px-6 py-4 text-left text-[12px] font-bold text-[#6b7280]">
                          Asset Tag
                        </th>

                        <th className="px-6 py-4 text-left text-[12px] font-bold text-[#6b7280]">
                          Asset Name
                        </th>

                        <th className="px-6 py-4 text-left text-[12px] font-bold text-[#6b7280]">
                          Status
                        </th>

                        <th className="px-6 py-4 text-left text-[12px] font-bold text-[#6b7280]">
                          Assigned To
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {loading ? (
                        <LoadingRows />
                      ) : filteredAssets.length === 0 ? (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-6 py-12 text-center"
                          >
                            <p className="text-[14px] font-bold text-[#374151]">
                              {search ||
                              statusFilter !==
                                'ALL'
                                ? 'No matching assets found.'
                                : 'No assets found.'}
                            </p>

                            <p className="mt-1 text-[12px] font-medium text-[#9ca3af]">
                              {search ||
                              statusFilter !==
                                'ALL'
                                ? 'Try changing your search or status filter.'
                                : 'There are currently no physical assets for this asset type.'}
                            </p>
                          </td>
                        </tr>
                      ) : (
                        filteredAssets.map((asset) => (
                          <tr
                            key={asset.id}
                            className="border-b border-[#f3f4f6] last:border-b-0"
                          >
                            <td className="px-6 py-4 text-sm font-semibold text-[#374151]">
                              {asset.id}
                            </td>

                            <td className="px-6 py-4 text-sm font-semibold text-[#111827]">
                              {asset.asset_tag || '—'}
                            </td>

                            <td className="px-6 py-4 text-sm font-semibold text-[#111827]">
                              {asset.asset_type_name ||
                                assetTypeName}
                            </td>

                            <td className="px-6 py-4">
                              <AssetStatusBadge
                                status={
                                  asset.pendingDisposal
                                    ? 'PENDING_DISPOSAL'
                                    : asset.status
                                }
                              />
                            </td>

                            <td className="px-6 py-4 text-sm font-semibold text-[#374151]">
                              {asset.assignedTo}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {!loading &&
                  assetsPagination?.count > 0 && (
                    <div className="flex items-center justify-between border-t border-[#e5e7eb] px-6 py-4">
                      <p className="text-[13px] font-medium text-[#6b7280]">
                        Showing{' '}
                        {Math.min(
                          (currentPage - 1) *
                            10 +
                            1,
                          assetsPagination.count,
                        )}{' '}
                        -{' '}
                        {Math.min(
                          currentPage * 10,
                          assetsPagination.count,
                        )}{' '}
                        of{' '}
                        {assetsPagination.count}
                      </p>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            handleAssetsPageChange(
                              currentPage - 1,
                            )
                          }
                          disabled={
                            currentPage === 1 ||
                            loading
                          }
                          className="rounded-lg border border-[#e5e7eb] px-4 py-2 text-[13px] font-bold text-[#374151] transition hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          Previous
                        </button>

                        <span className="px-2 text-[13px] font-semibold text-[#374151]">
                          Page {currentPage} of{' '}
                          {totalPages}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            handleAssetsPageChange(
                              currentPage + 1,
                            )
                          }
                          disabled={
                            currentPage ===
                              totalPages ||
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
            </section>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

function SummaryCard({
  title,
  value,
  description,
  valueClass,
  loading,
}) {
  return (
    <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
      <p className="text-[14px] font-semibold text-[#111827]">
        {title}
      </p>

      <p
        className={`mt-3 text-[30px] font-black ${valueClass}`}
      >
        {loading ? '—' : value}
      </p>

      <p className="mt-1 text-[12px] font-medium text-[#9ca3af]">
        {description}
      </p>
    </div>
  )
}

function LoadingRows() {
  return Array.from({ length: 5 }).map(
    (_, rowIndex) => (
      <tr
        key={rowIndex}
        className="border-b border-[#f3f4f6]"
      >
        {Array.from({ length: 5 }).map(
          (_, cellIndex) => (
            <td
              key={cellIndex}
              className="px-6 py-5"
            >
              <div className="h-4 w-24 animate-pulse rounded bg-[#e5e7eb]" />
            </td>
          ),
        )}
      </tr>
    ),
  )
}

export default AssetTypeDetails