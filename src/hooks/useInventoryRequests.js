import { useCallback, useState } from 'react'
import { fetchInventoryRequests } from '../services/assetService'

function useInventoryRequests() {
  const [inventoryRequests, setInventoryRequests] = useState([])
  const [inventoryRequestFilters, setInventoryRequestFilters] = useState({})

  const [inventoryRequestsPagination, setInventoryRequestsPagination] =
    useState({
      count: 0,
      next: null,
      previous: null,
      page: 1,
    })

  const loadInventoryRequests = useCallback(
    async (page = 1, filters = inventoryRequestFilters) => {
      const response = await fetchInventoryRequests({
        ...filters,
        page,
      })

      const requests = Array.isArray(response)
        ? response
        : response?.results || []

      setInventoryRequests(requests)

      setInventoryRequestsPagination({
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
    [inventoryRequestFilters],
  )

  const refreshInventoryRequests = useCallback(
    async (
      page = inventoryRequestsPagination.page,
      filters = inventoryRequestFilters,
    ) => {
      await loadInventoryRequests(page, filters)
    },
    [
      loadInventoryRequests,
      inventoryRequestsPagination.page,
      inventoryRequestFilters,
    ],
  )

  const handleInventoryRequestFiltersChange = useCallback(
    (filters) => {
      setInventoryRequestFilters(filters)
      void loadInventoryRequests(1, filters)
    },
    [loadInventoryRequests],
  )

  const resetInventoryRequestFilters = useCallback(() => {
    const filters = {}
    setInventoryRequestFilters(filters)
    void loadInventoryRequests(1, filters)
  }, [loadInventoryRequests])

  const setInitialInventoryRequests = useCallback(
    (response, page = 1) => {
      const requests = Array.isArray(response)
        ? response
        : response?.results || []

      setInventoryRequests(requests)

      setInventoryRequestsPagination({
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

  return {
    inventoryRequests,
    inventoryRequestsPagination,
    inventoryRequestFilters,
    loadInventoryRequests,
    refreshInventoryRequests,
    handleInventoryRequestFiltersChange,
    resetInventoryRequestFilters,
    setInitialInventoryRequests,
  }
}

export default useInventoryRequests