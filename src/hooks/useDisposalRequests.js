import { useCallback, useState } from 'react'
import { fetchDisposalRequests } from '../services/assetService'

function useDisposalRequests() {
  const [disposalRequests, setDisposalRequests] = useState([])

  const [disposalRequestFilters, setDisposalRequestFilters] =
    useState({})

  const [disposalRequestsPagination, setDisposalRequestsPagination] =
    useState({
      count: 0,
      next: null,
      previous: null,
      page: 1,
    })

  const loadDisposalRequests = useCallback(
    async (page = 1, filters = disposalRequestFilters) => {
      const response = await fetchDisposalRequests({
        ...filters,
        page,
      })

      const requests = Array.isArray(response)
        ? response
        : response?.results || []

      setDisposalRequests(requests)

      setDisposalRequestsPagination({
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
    [disposalRequestFilters],
  )

  const refreshDisposalRequests = useCallback(
    async (
      page = disposalRequestsPagination.page,
      filters = disposalRequestFilters,
    ) => {
      await loadDisposalRequests(page, filters)
    },
    [
      loadDisposalRequests,
      disposalRequestsPagination.page,
      disposalRequestFilters,
    ],
  )

  const handleDisposalRequestFiltersChange = useCallback(
    (filters) => {
      setDisposalRequestFilters(filters)
      void loadDisposalRequests(1, filters)
    },
    [loadDisposalRequests],
  )

  const resetDisposalRequestFilters = useCallback(() => {
    const filters = {}

    setDisposalRequestFilters(filters)
    void loadDisposalRequests(1, filters)
  }, [loadDisposalRequests])

  const setInitialDisposalRequests = useCallback(
    (response, page = 1) => {
      const requests = Array.isArray(response)
        ? response
        : response?.results || []

      setDisposalRequests(requests)

      setDisposalRequestsPagination({
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
    disposalRequests,
    disposalRequestsPagination,
    disposalRequestFilters,

    loadDisposalRequests,
    refreshDisposalRequests,

    handleDisposalRequestFiltersChange,
    resetDisposalRequestFilters,

    setInitialDisposalRequests,
  }
}

export default useDisposalRequests