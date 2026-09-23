import { useCallback, useState } from 'react'
import { fetchMaintenanceAssets } from '../services/assetService'

function useMaintenanceAssets() {
  const [maintenanceAssets, setMaintenanceAssets] = useState([])
  const [maintenanceFilters, setMaintenanceFilters] = useState({})

  const [maintenanceAssetsPagination, setMaintenanceAssetsPagination] =
    useState({
      count: 0,
      next: null,
      previous: null,
      page: 1,
    })

  const loadMaintenanceAssets = useCallback(
    async (page = 1, filters = {}) => {
      const response = await fetchMaintenanceAssets({
        ...filters,
        page,
      })

      const assets = Array.isArray(response)
        ? response
        : response?.results || []

      setMaintenanceAssets(assets)

      setMaintenanceAssetsPagination({
        count: Array.isArray(response)
          ? response.length
          : response?.count || 0,
        next: Array.isArray(response)
          ? null
          : response?.next || null,
        previous: Array.isArray(response)
          ? null
          : response?.previous || null,
        page,
      })
    },
    [],
  )

  const handleMaintenanceFiltersChange = useCallback(
    (filters) => {
      setMaintenanceFilters(filters)
      void loadMaintenanceAssets(1, filters)
    },
    [loadMaintenanceAssets],
  )

  const resetMaintenanceFilters = useCallback(() => {
    const filters = {}
    setMaintenanceFilters(filters)
    void loadMaintenanceAssets(1, filters)
  }, [loadMaintenanceAssets])

  return {
    maintenanceAssets,
    maintenanceAssetsPagination,
    maintenanceFilters,
    loadMaintenanceAssets,
    handleMaintenanceFiltersChange,
    resetMaintenanceFilters,
  }
}

export default useMaintenanceAssets