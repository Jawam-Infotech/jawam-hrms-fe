import { useCallback, useEffect, useState } from 'react'

import {
  fetchMyAssets,
  fetchMyAssetSummary,
  fetchAssetTypes,
  fetchMyAssetRequests,
  submitAssetRequest,
} from '../services/assetService'

function useAssets() {
  const [assignedAssets, setAssignedAssets] = useState([])
  const [summary, setSummary] = useState(null)
  const [assetTypes, setAssetTypes] = useState([])
  const [assetRequests, setAssetRequests] = useState([])

  const [assetRequestsPagination, setAssetRequestsPagination] =
    useState({
      count: 0,
      next: null,
      previous: null,
      page: 1,
    })

  const [requestFilters, setRequestFilters] = useState({})

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [requestSubmitting, setRequestSubmitting] = useState(false)
  const [requestError, setRequestError] = useState('')

  const clearRequestError = useCallback(() => {
    setRequestError('')
  }, [])

  const loadAssets = useCallback(async (page = 1) => {
    setLoading(true)
    setError('')

    try {
      const [
        currentAssets,
        assetSummary,
        types,
        requests,
      ] = await Promise.all([
        fetchMyAssets(),
        fetchMyAssetSummary(),
        fetchAssetTypes(),
        fetchMyAssetRequests({
  page,
}),
      ])

      setAssignedAssets(
        Array.isArray(currentAssets)
          ? currentAssets
          : currentAssets?.results || [],
      )

      setSummary(assetSummary)

      setAssetTypes(
        Array.isArray(types)
          ? types
          : types?.results || [],
      )

      const requestList = Array.isArray(requests)
        ? requests
        : requests?.results || []

      setAssetRequests(requestList)

      setAssetRequestsPagination({
        count: Array.isArray(requests)
          ? requests.length
          : requests?.count || 0,
        next: Array.isArray(requests)
          ? null
          : requests?.next || null,
        previous: Array.isArray(requests)
          ? null
          : requests?.previous || null,
        page,
      })
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          'Failed to load assets.',
      )
    } finally {
      setLoading(false)
    }
}, [])

const loadAssetRequests = useCallback(
  async (page = 1, filters = requestFilters) => {
    try {
      const requests = await fetchMyAssetRequests({
        ...filters,
        page,
      })

      const requestList = Array.isArray(requests)
        ? requests
        : requests?.results || []

      setAssetRequests(requestList)

      setAssetRequestsPagination({
        count: Array.isArray(requests)
          ? requests.length
          : requests?.count || 0,
        next: Array.isArray(requests)
          ? null
          : requests?.next || null,
        previous: Array.isArray(requests)
          ? null
          : requests?.previous || null,
        page,
      })
    } catch (err) {
      setError(
        err?.response?.data?.detail ||
          err?.message ||
          'Failed to load asset requests.',
      )
    }
  },
  [requestFilters],
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

  useEffect(() => {
    const loadInitialAssets = async () => {
      await loadAssets()
    }

    void loadInitialAssets()
  }, [loadAssets])

  const raiseAssetRequest = useCallback(async (payload) => {
    setRequestSubmitting(true)
    setRequestError('')

    try {
      const response = await submitAssetRequest(payload)

      return response
    } catch (err) {
      const errorData = err?.response?.data

      const message =
        typeof errorData?.detail === 'string'
          ? errorData.detail
          : Array.isArray(errorData?.non_field_errors)
            ? errorData.non_field_errors.join(', ')
            : typeof err?.message === 'string'
              ? err.message
              : 'Failed to submit asset request.'

      setRequestError(message)
      throw err
    } finally {
      setRequestSubmitting(false)
    }
  }, [])

  return {
    assignedAssets,
    summary,
    assetTypes,
    assetRequests,
    assetRequestsPagination,

    requestFilters,

    loading,
    error,

    requestSubmitting,
    requestError,
    clearRequestError,

    raiseAssetRequest,
    loadAssets,
    loadAssetRequests,
    handleRequestFiltersChange,
    resetRequestFilters,
    refreshAssets: loadAssets,
  }
}

export default useAssets