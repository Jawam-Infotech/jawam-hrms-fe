import { useCallback, useState } from 'react'
import {
  getCorrectionRequests,
  getAllCorrectionRequests,
  getMyCorrectionRequests,
  getCorrectionRequestById,
  getCorrectionStatusMap,
  approveCorrectionRequest,
  rejectCorrectionRequest,
} from '../services/attendanceService.js'

async function getAllCorrectionRequestPages(params = {}) {
  let response = await getCorrectionRequests(params)
  let page = 1
  const requests = []

  while (response) {
    const results = response?.results ?? response ?? []

    if (Array.isArray(results)) {
      requests.push(...results)
    }

    if (!response?.next) {
      break
    }

    page += 1
    response = await getCorrectionRequests({ ...params, page })
  }

  return requests
}

async function getAllCompanyCorrectionRequestPages(params = {}) {
  let response = await getAllCorrectionRequests(params)
  let page = 1
  const requests = []

  while (response) {
    const results = response?.results ?? response ?? []

    if (Array.isArray(results)) {
      requests.push(...results)
    }

    if (!response?.next) break

    page += 1
    response = await getAllCorrectionRequests({ ...params, page })
  }

  return requests
}

function useCorrectionRequests() {
  const [requests, setRequests] = useState([])
  const [allRequests, setAllRequests] = useState([])
  const [actionableRequests, setActionableRequests] = useState([])
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [correctionStatusMap, setCorrectionStatusMap] = useState({})

  const [loading, setLoading] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const [error, setError] = useState(null)
  const [allRequestsError, setAllRequestsError] = useState(null)
  const [actionableRequestsError, setActionableRequestsError] = useState(null)
  const [actionError, setActionError] = useState(null)

  const loadRequests = useCallback(async (params = {}) => {
    try {
      setLoading(true)
      setError(null)

      const response = await getCorrectionRequests(params)
      const results = response?.results ?? response ?? []

      setRequests(results)

      return results
    } catch (requestError) {
      setError(
        requestError.response?.data?.detail ||
          requestError.message ||
          'Failed to load correction requests.'
      )

      setRequests([])

      throw requestError
    } finally {
      setLoading(false)
    }
  }, [])

  /*
   * HR / CEO review queue.
   *
   * The backend defaults this endpoint to PENDING.
   *
   * We additionally load APPROVED and REJECTED so the
   * attendance table can keep showing the request ID
   * after a request has been reviewed.
   */
  const loadReviewRequests = useCallback(async () => {
    setLoading(true)
    const [allResult, actionableResult] = await Promise.allSettled([
      getAllCompanyCorrectionRequestPages(),
      getAllCorrectionRequestPages(),
    ])

    if (allResult.status === 'fulfilled') {
      setAllRequests(allResult.value)
      setAllRequestsError(null)
    } else {
      setAllRequests([])
      setAllRequestsError(
        allResult.reason?.response?.data?.detail ||
          allResult.reason?.message ||
          'Failed to load company correction requests.'
      )
    }

    if (actionableResult.status === 'fulfilled') {
      setActionableRequests(actionableResult.value)
      setActionableRequestsError(null)
    } else {
      setActionableRequests([])
      setActionableRequestsError(
        actionableResult.reason?.response?.data?.detail ||
          actionableResult.reason?.message ||
          'Failed to load actionable correction requests.'
      )
    }

    try {
      if (allResult.status === 'rejected') throw allResult.reason

      return {
        allRequests: allResult.value,
        actionableRequests: actionableResult.status === 'fulfilled'
          ? actionableResult.value
          : [],
      }
    } finally {
      setLoading(false)
    }
  }, [])

  /*
   * Legacy review-list state for callers that still need the actionable
   * endpoint directly. The attendance management page uses the separated
   * allRequests/actionableRequests state above.
   */
  const loadLegacyReviewRequests = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [pendingResponse, approvedResponse, rejectedResponse] =
        await Promise.all([
          getAllCorrectionRequestPages(),
          getAllCorrectionRequestPages({ status: 'APPROVED' }),
          getAllCorrectionRequestPages({ status: 'REJECTED' }),
        ])

      const pendingRequests =
        pendingResponse?.results ?? pendingResponse ?? []

      const approvedRequests =
        approvedResponse?.results ?? approvedResponse ?? []

      const rejectedRequests =
        rejectedResponse?.results ?? rejectedResponse ?? []

      /*
       * Combine all three lists.
       *
       * Map by request ID first so the same request can never
       * appear twice if the backend returns overlapping data.
       */
      const requestMap = new Map()

      ;[
        ...pendingRequests,
        ...approvedRequests,
        ...rejectedRequests,
      ].forEach((request) => {
        if (request?.id !== undefined && request?.id !== null) {
          requestMap.set(request.id, request)
        }
      })

      const combinedRequests = Array.from(requestMap.values())

      setRequests(combinedRequests)

      return combinedRequests
    } catch (requestError) {
      setError(
        requestError.response?.data?.detail ||
          requestError.message ||
          'Failed to load correction requests.'
      )

      setRequests([])

      throw requestError
    } finally {
      setLoading(false)
    }
  }, [])

  const loadMyRequests = useCallback(async (params = {}) => {
    try {
      setLoading(true)
      setError(null)

      const response = await getMyCorrectionRequests(params)
      const results = response?.results ?? response ?? []

      setRequests(results)

      return results
    } catch (requestError) {
      setError(
        requestError.response?.data?.detail ||
          requestError.message ||
          'Failed to load your correction requests.'
      )

      setRequests([])

      throw requestError
    } finally {
      setLoading(false)
    }
  }, [])

  const loadCorrectionStatusMap = useCallback(async (date) => {
    if (!date) {
      setCorrectionStatusMap({})
      return {}
    }

    try {
      const response = await getCorrectionStatusMap(date)
      const statusMap = response ?? {}

      setCorrectionStatusMap(statusMap)

      return statusMap
    } catch (requestError) {
      setCorrectionStatusMap({})

      setError(
        requestError.response?.data?.detail ||
          requestError.message ||
          'Failed to load correction status.'
      )

      throw requestError
    }
  }, [])

  const loadRequestDetail = useCallback(async (requestId) => {
    if (!requestId) {
      setSelectedRequest(null)
      return null
    }

    try {
      setDetailLoading(true)
      setError(null)

      const response = await getCorrectionRequestById(requestId)

      setSelectedRequest(response)

      return response
    } catch (requestError) {
      setSelectedRequest(null)

      setError(
        requestError.response?.data?.detail ||
          requestError.message ||
          'Failed to load correction request.'
      )

      throw requestError
    } finally {
      setDetailLoading(false)
    }
  }, [])

  const approveRequest = useCallback(
    async (requestId, payload = {}) => {
      try {
        setActionLoading(true)
        setActionError(null)

        const response = await approveCorrectionRequest(
          requestId,
          payload
        )

        setSelectedRequest(response)

        setRequests((currentRequests) =>
          currentRequests.map((request) =>
            request.id === requestId ? response : request
          )
        )

        return response
      } catch (requestError) {
        setActionError(
          requestError.response?.data?.detail ||
            requestError.message ||
            'Failed to approve correction request.'
        )

        throw requestError
      } finally {
        setActionLoading(false)
      }
    },
    []
  )

  const rejectRequest = useCallback(
    async (requestId, payload) => {
      try {
        setActionLoading(true)
        setActionError(null)

        const response = await rejectCorrectionRequest(
          requestId,
          payload
        )

        setSelectedRequest(response)

        setRequests((currentRequests) =>
          currentRequests.map((request) =>
            request.id === requestId ? response : request
          )
        )

        return response
      } catch (requestError) {
        setActionError(
          requestError.response?.data?.detail ||
            requestError.message ||
            'Failed to reject correction request.'
        )

        throw requestError
      } finally {
        setActionLoading(false)
      }
    },
    []
  )

  const clearSelectedRequest = useCallback(() => {
    setSelectedRequest(null)
    setActionError(null)
  }, [])

  const clearError = useCallback(() => {
    setError(null)
    setActionError(null)
  }, [])

  return {
    requests,
    allRequests,
    actionableRequests,
    selectedRequest,
    correctionStatusMap,

    loading,
    detailLoading,
    actionLoading,

    error,
    allRequestsError,
    actionableRequestsError,
    actionError,

    loadRequests,
    loadReviewRequests,
    loadLegacyReviewRequests,
    loadMyRequests,
    loadCorrectionStatusMap,
    loadRequestDetail,

    approveRequest,
    rejectRequest,

    clearSelectedRequest,
    clearError,
  }
}

export default useCorrectionRequests
