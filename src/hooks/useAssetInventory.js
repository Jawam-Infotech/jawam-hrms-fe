import { useCallback, useEffect, useState } from 'react'
import {
  fetchInventorySummary,
  fetchInventoryRequests,
  fetchDisposalRequests,
  fetchAssets,
} from '../services/assetService'

import useAssetTypes from './useAssetTypes'
import useInventoryRequests from './useInventoryRequests'
import useDisposalRequests from './useDisposalRequests'
import useMaintenanceAssets from './useMaintenanceAssets'
import useAssetPool from './useAssetPool'
import useAssetRequests from './useAssetRequests'

function useAssetInventory(userRole) {
    const {
    assetTypes,
    loadAssetTypes,
  } = useAssetTypes()

  const {
    inventoryRequests,
    inventoryRequestsPagination,
    inventoryRequestFilters,
    loadInventoryRequests,
    refreshInventoryRequests,
    handleInventoryRequestFiltersChange,
    resetInventoryRequestFilters,
    setInitialInventoryRequests,
  } = useInventoryRequests()

  const {
  disposalRequests,
  disposalRequestsPagination,
  disposalRequestFilters,
  loadDisposalRequests,
  refreshDisposalRequests,
  handleDisposalRequestFiltersChange,
  resetDisposalRequestFilters,
  setInitialDisposalRequests,
} = useDisposalRequests()

  const {
    maintenanceAssets,
    maintenanceAssetsPagination,
    maintenanceFilters,
    loadMaintenanceAssets,
    handleMaintenanceFiltersChange,
    resetMaintenanceFilters,
  } = useMaintenanceAssets()

  const {
    assets,
    loadAssets,
  } = useAssetPool()

  const {
    assetRequests,
    assetRequestsPagination,
    requestsLoading,
    requestFilters,
    loadAssetRequests,
    refreshAssetRequests,
    loadCEOHRAssetRequests,
    handleRequestFiltersChange,
    resetRequestFilters,
    setInitialAssetRequests,
  } = useAssetRequests()

  const [allAssets, setAllAssets] = useState([])
  const [inventorySummary, setInventorySummary] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refreshInventorySummary = useCallback(async () => {
    try {
      const response = await fetchInventorySummary()

      setInventorySummary(
        Array.isArray(response)
          ? response
          : response?.results || response || [],
      )
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          'Failed to load inventory summary.',
      )
    }
  }, [])

  const loadAllAssets = useCallback(async () => {
    try {
      const response = await fetchAssets({
        page: 1,
        page_size: 100,
      })

      setAllAssets(
        Array.isArray(response)
          ? response
          : response?.results || [],
      )
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          'Failed to load assets.',
      )
    }
  }, [])

  const loadInventory = useCallback(
  async ({
    assetRequestsPage = 1,
    inventoryRequestsPage = 1,
    disposalRequestsPage = 1,
  } = {}) => {
    setLoading(true)
    setError('')

    try {
      const [
        inventoryResponse,
        inventoryRequestsResponse,
        disposalRequestsResponse,
      ] = await Promise.all([
        fetchInventorySummary(),
        fetchInventoryRequests({
          page: inventoryRequestsPage,
        }),
        fetchDisposalRequests({
          page: disposalRequestsPage,
        }),
      ])

      setInventorySummary(
        Array.isArray(inventoryResponse)
          ? inventoryResponse
          : inventoryResponse?.results ||
            inventoryResponse ||
            [],
      )

      setInitialInventoryRequests(
        inventoryRequestsResponse,
        inventoryRequestsPage,
      )

      setInitialDisposalRequests(
        disposalRequestsResponse,
        disposalRequestsPage,
      )

      
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          'Failed to load asset inventory.',
      )
    } finally {
      setLoading(false)
    }
  },
  [
    setInitialInventoryRequests,
    setInitialDisposalRequests,
  ],
)

  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([
        loadInventory(),
        loadMaintenanceAssets(),
        loadAssetTypes(),
        loadAllAssets(),
      ])
    }

    void loadInitialData()
  }, [
    loadInventory,
    loadMaintenanceAssets,
    loadAssetTypes,
    loadAllAssets,
  ])

  return {
    inventorySummary,

    inventoryRequests,
    inventoryRequestsPagination,
    inventoryRequestFilters,
    loadInventoryRequests,
    refreshInventoryRequests,
    handleInventoryRequestFiltersChange,
    resetInventoryRequestFilters,

    refreshInventorySummary,

    assetRequests,
    assetRequestsPagination,
    requestsLoading,
    requestFilters,
    loadAssetRequests,
    refreshAssetRequests,
    loadCEOHRAssetRequests,
    handleRequestFiltersChange,
    resetRequestFilters,

    maintenanceAssets,
    maintenanceAssetsPagination,
    maintenanceFilters,
    loadMaintenanceAssets,
    handleMaintenanceFiltersChange,
    resetMaintenanceFilters,

    assetTypes,
    loadAssetTypes,

    assets,
    allAssets,
    loadAssets,
    loadAllAssets,

    disposalRequests,
disposalRequestsPagination,
disposalRequestFilters,
loadDisposalRequests,
refreshDisposalRequests,
handleDisposalRequestFiltersChange,
resetDisposalRequestFilters,
setInitialDisposalRequests,

    loading,
    error,

    refreshInventory: loadInventory,
  }
}

export default useAssetInventory