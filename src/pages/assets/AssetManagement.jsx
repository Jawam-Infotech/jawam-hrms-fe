import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../context/UserContext'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import AssetManagementHeader from '../../components/assets/AssetManagementHeader'
import AssetManagementSummary from '../../components/assets/AssetManagementSummary'
import AssetsInfoTable from '../../components/assets/AssetsInfoTable'
import AssetRequestsTable from '../../components/assets/AssetRequestsTable'
import AssetsMaintenanceTable from '../../components/assets/AssetsMaintenanceTable'
import InventoryRequestModal from '../../components/assets/InventoryRequestModal'
import AssetMaintenanceModal from '../../components/assets/AssetMaintenanceModal'
import useAssetInventory from '../../hooks/useAssetInventory'
import {
  submitInventoryRequest,
  submitDisposalRequest,
  completeMaintenanceById,
  fetchMaintenanceById,
  submitMaintenance,
} from '../../services/assetService'
import AssetDisposeModal from '../../components/assets/AssetDisposeModal'
import AssetMaintenanceDetailsModal from '../../components/assets/AssetMaintenanceDetailsModal'
import AssetDisposalRequestsTable from '../../components/assets/AssetDisposalRequestsTable'
import InventoryRequestsTable from '../../components/assets/InventoryRequestsTable'

function AssetManagement() {
  const { user } = useContext(UserContext)
  const navigate = useNavigate()

  const canCreateMaintenance = user?.role === 'HR'
  const canCompleteMaintenance = user?.role === 'HR'

  const {
    inventorySummary,

    inventoryRequests,
    inventoryRequestsPagination,
    loadInventoryRequests,
    refreshInventoryRequests,
    refreshInventorySummary,

    assetRequests,
    assetRequestsPagination,
    loadCEOHRAssetRequests,

    maintenanceAssets,
    maintenanceAssetsPagination,
    maintenanceFilters,
    loadMaintenanceAssets,
    handleMaintenanceFiltersChange,
    resetMaintenanceFilters,

    assetTypes,
    loadAssetTypes,

    loading,
    error,

    loadAssetRequests,
    requestsLoading,
    refreshAssetRequests,

    assets,
    loadAssets,

    disposalRequests,
disposalRequestsPagination,
disposalRequestFilters,
loadDisposalRequests,
refreshDisposalRequests,
handleDisposalRequestFiltersChange,
resetDisposalRequestFilters,
    requestFilters,
    handleRequestFiltersChange,
    resetRequestFilters,

    inventoryRequestFilters,
    handleInventoryRequestFiltersChange,
    resetInventoryRequestFilters,
  } = useAssetInventory(user?.role)

    useEffect(() => {
    if (user?.role === 'CEO') {
      void loadCEOHRAssetRequests(1, {})
    } else if (user?.role === 'HR') {
      void loadAssetRequests(1, {})
    }
  }, [
    user?.role,
    loadCEOHRAssetRequests,
    loadAssetRequests,
  ])

  const [isInventoryRequestModalOpen, setIsInventoryRequestModalOpen] =
    useState(false)

  const [isMaintenanceModalOpen, setIsMaintenanceModalOpen] =
    useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [requestError, setRequestError] = useState('')

  const [maintenanceDetails, setMaintenanceDetails] = useState(null)
  const [maintenanceSubmitting, setMaintenanceSubmitting] = useState(false)
  const [maintenanceCompleting, setMaintenanceCompleting] = useState(false)
  const [maintenanceError, setMaintenanceError] = useState('')

  const [isDisposeModalOpen, setIsDisposeModalOpen] = useState(false)
  const [disposeSubmitting, setDisposeSubmitting] = useState(false)
  const [disposeError, setDisposeError] = useState('')

  const handleOpenInventoryRequest = async () => {
    setRequestError('')

    await loadAssetTypes()

    setIsInventoryRequestModalOpen(true)
  }

  const handleCloseInventoryRequest = () => {
    if (submitting) return

    setRequestError('')
    setIsInventoryRequestModalOpen(false)
  }

  const handleSubmitInventoryRequest = async (payload) => {
    setSubmitting(true)
    setRequestError('')

    try {
      await submitInventoryRequest(payload)

      setIsInventoryRequestModalOpen(false)

      await refreshInventoryRequests(
        inventoryRequestsPagination?.page || 1,
      )
    } catch (err) {
      setRequestError(
        err?.response?.data?.detail ||
          err?.message ||
          'Failed to submit inventory request.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handleOpenMaintenance = async () => {
    if (!canCreateMaintenance) return

    setMaintenanceError('')

    try {
      await loadAssets()
      setIsMaintenanceModalOpen(true)
    } catch (err) {
      setMaintenanceError(
        err?.response?.data?.detail ||
          err?.message ||
          'Failed to load assets.',
      )
    }
  }

  const handleSubmitMaintenance = async (payload) => {
    setMaintenanceSubmitting(true)
    setMaintenanceError('')

    try {
      await submitMaintenance(payload)

      setIsMaintenanceModalOpen(false)

      await loadAssets(true)

      await loadMaintenanceAssets(
        maintenanceAssetsPagination?.page || 1,
        maintenanceFilters,
      )
    } catch (err) {
      setMaintenanceError(
        err?.response?.data?.detail ||
          err?.message ||
          'Failed to start maintenance.',
      )
    } finally {
      setMaintenanceSubmitting(false)
    }
  }

  const handleViewMaintenance = async (maintenance) => {
    try {
      setMaintenanceDetails(
        await fetchMaintenanceById(maintenance.id),
      )
    } catch (err) {
      setMaintenanceError(
        err?.response?.data?.detail ||
          err?.message ||
          'Failed to load maintenance details.',
      )
    }
  }

  const handleCompleteMaintenance = async (payload) => {
    if (!maintenanceDetails) return

    setMaintenanceCompleting(true)
    setMaintenanceError('')

    try {
      await completeMaintenanceById(
        maintenanceDetails.id,
        payload,
      )

      setMaintenanceDetails(null)

      await loadAssets(true)

      await refreshInventorySummary()

      await loadMaintenanceAssets(
        maintenanceAssetsPagination?.page || 1,
        maintenanceFilters,
      )
    } catch (err) {
      setMaintenanceError(
        err?.response?.data?.detail ||
          err?.message ||
          'Failed to complete maintenance.',
      )
    } finally {
      setMaintenanceCompleting(false)
    }
  }

  const handleCloseMaintenance = () => {
    setIsMaintenanceModalOpen(false)
  }

  const handleOpenDispose = async () => {
    setDisposeError('')

    try {
      await loadAssets()
      setIsDisposeModalOpen(true)
    } catch (err) {
      setDisposeError(
        err?.response?.data?.detail ||
          err?.message ||
          'Failed to load assets.',
      )
    }
  }

  const handleCloseDispose = () => {
    setIsDisposeModalOpen(false)
  }

  const handleSubmitDispose = async (payload) => {
    setDisposeSubmitting(true)
    setDisposeError('')

    try {
      await submitDisposalRequest(payload)

      setIsDisposeModalOpen(false)

      await loadAssets(true)

      await loadDisposalRequests(
        disposalRequestsPagination?.page || 1,
          disposalRequestFilters,

      )
    } catch (err) {
      setDisposeError(
        err?.response?.data?.detail ||
          err?.message ||
          'Failed to submit disposal request.',
      )
    } finally {
      setDisposeSubmitting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {(user?.role === 'HR' || user?.role === 'CEO') && (
          <AssetManagementHeader
            onRequestNewAsset={
              user?.role === 'HR'
                ? handleOpenInventoryRequest
                : undefined
            }
            onUnderMaintenance={
              user?.role === 'HR'
                ? handleOpenMaintenance
                : undefined
            }
            onAssetDispose={
              user?.role === 'HR'
                ? handleOpenDispose
                : undefined
            }
          />
        )}

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <AssetManagementSummary
          inventorySummary={inventorySummary}
          loading={loading}
        />

        <AssetsInfoTable
          inventorySummary={inventorySummary}
          loading={loading}
          assets={assets}
          onAssetClick={(asset) =>
            navigate(`/assets/manage/type/${asset.asset_type_id}`)
          }
        />

        {(user?.role === 'HR' || user?.role === 'CEO') && (
          <AssetRequestsTable
            assetRequests={assetRequests}
            pagination={assetRequestsPagination}
            assetTypes={assetTypes}
            filters={requestFilters}
            onFiltersChange={handleRequestFiltersChange}
            onResetFilters={resetRequestFilters}
            onRefresh={(page) =>
              refreshAssetRequests(
                page,
                requestFilters,
              )
            }
            onPageChange={(page) => {
              if (user?.role === 'CEO') {
                loadCEOHRAssetRequests(
                  page,
                  requestFilters,
                )
              } else {
                loadAssetRequests(
                  page,
                  requestFilters,
                )
              }
            }}
            loading={loading}
            requestsLoading={requestsLoading}
            userRole={user?.role}
          />
        )}

        <InventoryRequestsTable
          inventoryRequests={inventoryRequests}
          loading={loading}
          pagination={inventoryRequestsPagination}
          onPageChange={(page) =>
            loadInventoryRequests(
              page,
              inventoryRequestFilters,
            )
          }
          onRefresh={refreshInventoryRequests}
          onRefreshSummary={refreshInventorySummary}
          userRole={user?.role}
          assetTypes={assetTypes}
          inventoryRequestFilters={inventoryRequestFilters}
          onFiltersChange={handleInventoryRequestFiltersChange}
          onResetFilters={resetInventoryRequestFilters}
        />

        <AssetsMaintenanceTable
          maintenanceAssets={maintenanceAssets}
          pagination={maintenanceAssetsPagination}
          onPageChange={(page) =>
            loadMaintenanceAssets(
              page,
              maintenanceFilters,
            )
          }
          loading={loading}
          onView={handleViewMaintenance}
          assetTypes={assetTypes}
          maintenanceFilters={maintenanceFilters}
          onFiltersChange={handleMaintenanceFiltersChange}
          onResetFilters={resetMaintenanceFilters}
        />

        <AssetDisposalRequestsTable
  disposalRequests={disposalRequests}
  loading={loading}
  pagination={disposalRequestsPagination}
  onPageChange={(page) =>
    loadDisposalRequests(
      page,
      disposalRequestFilters,
    )
  }
  onRefresh={refreshDisposalRequests}
  onRefreshSummary={refreshInventorySummary}
  userRole={user?.role}
  assetTypes={assetTypes}
  disposalRequestFilters={disposalRequestFilters}
  onFiltersChange={handleDisposalRequestFiltersChange}
  onResetFilters={resetDisposalRequestFilters}
/>
      </div>

      {isInventoryRequestModalOpen && (
        <InventoryRequestModal
          isOpen
          onClose={handleCloseInventoryRequest}
          assetTypes={assetTypes}
          onSubmit={handleSubmitInventoryRequest}
          submitting={submitting}
          error={requestError}
        />
      )}

      <AssetMaintenanceModal
        isOpen={isMaintenanceModalOpen}
        onClose={handleCloseMaintenance}
        onSubmit={handleSubmitMaintenance}
        submitting={maintenanceSubmitting}
        requestError={maintenanceError}
        assets={assets}
      />

      <AssetMaintenanceDetailsModal
        isOpen={Boolean(maintenanceDetails)}
        maintenance={maintenanceDetails}
        canComplete={canCompleteMaintenance}
        completing={maintenanceCompleting}
        onClose={() => setMaintenanceDetails(null)}
        onComplete={handleCompleteMaintenance}
      />

      <AssetDisposeModal
        isOpen={isDisposeModalOpen}
        onClose={handleCloseDispose}
        onSubmit={handleSubmitDispose}
        submitting={disposeSubmitting}
        requestError={disposeError}
        assets={assets}
      />
    </DashboardLayout>
  )
}

export default AssetManagement