import { useCallback, useState } from 'react'
import { fetchAllAssetRequests } from '../services/assetService'


function useAssetRequests() {
  const [assetRequests, setAssetRequests] = useState([])

  const [assetRequestsPagination, setAssetRequestsPagination] =
    useState({
      count: 0,
      next: null,
      previous: null,
      page: 1,
    })

  const [requestFilters, setRequestFilters] = useState({})

  const [requestsLoading, setRequestsLoading] = useState(false)

  const updateAssetRequestsState = useCallback(
    (response, page = 1) => {
      const requests = Array.isArray(response)
        ? response
        : response?.results || []

      setAssetRequests(requests)

      setAssetRequestsPagination({
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



  const setInitialAssetRequests = useCallback(
    (response, page = 1) => {
      updateAssetRequestsState(response, page)
    },
    [updateAssetRequestsState],
  )

  const loadAssetRequests = useCallback(
  async (page = 1, filters = requestFilters) => {
    setRequestsLoading(true)
    try {
      const response = await fetchAllAssetRequests({
        ...filters,
        requested_by_role: 'EMPLOYEE,TL,CEO',
        page,
      })
      updateAssetRequestsState(response, page)
    } finally {
      setRequestsLoading(false)
    }
  },
  [updateAssetRequestsState],
)

  const refreshAssetRequests = useCallback(
    async (
      page = assetRequestsPagination.page,
      filters = requestFilters,
    ) => {
      setRequestsLoading(true)

      try {
        const response = await fetchAllAssetRequests({
          ...filters,
          page,
        })

        updateAssetRequestsState(response, page)
      } finally {
        setRequestsLoading(false)
      }
    },
    [
      assetRequestsPagination.page,
      requestFilters,
      updateAssetRequestsState,
    ],
  )

  const loadCEOHRAssetRequests = useCallback(
    async (page = 1, filters = requestFilters) => {
      setRequestsLoading(true)

      try {
        const response = await fetchAllAssetRequests({
          ...filters,
          requested_by_role: 'HR',
          page,
        })

        updateAssetRequestsState(response, page)
      } finally {
        setRequestsLoading(false)
      }
    },
    [requestFilters, updateAssetRequestsState],
  )

  const handleRequestFiltersChange = useCallback(
    (filters) => {
      setRequestFilters(filters)
      void loadAssetRequests(1, filters)
    },
    [loadAssetRequests],
  )

  const resetRequestFilters = useCallback(() => {
    const filters = {}

    setRequestFilters(filters)
    void loadAssetRequests(1, filters)
  }, [loadAssetRequests])

  return {
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
  }
}

export default useAssetRequests