import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import {
  getApiErrorMessage,
} from '../utils/apiErrorMessage.js'

import {
  LEAVE_REVIEW_PAGE_SIZE,
} from '../constants/leave.js'

import {
  approveLeave,
  getLeaveHistory,
  getLeaveTypes,
  getPendingRequests,
  partiallyAcceptLeave,
  rejectLeave,
  approveLeaveCancellation,
  rejectLeaveCancellation,
} from '../services/leaveService.js'


function useLeaveReview() {
  const [requests, setRequests] =
    useState([])

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState(null)

  const [search, setSearch] =
    useState('')

  const [status, setStatus] =
    useState('All')

  const [leaveType, setLeaveType] =
    useState('All')

  const [sortBy, setSortBy] =
    useState('newest')

  const [leaveTypes, setLeaveTypes] =
    useState([])

  const [currentPage, setCurrentPage] =
    useState(1)

  const [totalCount, setTotalCount] =
    useState(0)

  const [nextPage, setNextPage] =
    useState(null)

  const [previousPage, setPreviousPage] =
    useState(null)

  const [
    selectedRequest,
    setSelectedRequest,
  ] = useState(null)

  const [
    actionLoading,
    setActionLoading,
  ] = useState(false)

  const [
    actionError,
    setActionError,
  ] = useState(null)

  const [
    queueStatus,
    setQueueStatus,
  ] = useState('PENDING')


  /*
   * =========================
   * HISTORY
   * =========================
   */

  const [
    leaveHistory,
    setLeaveHistory,
  ] = useState([])

  const [
    historyLoading,
    setHistoryLoading,
  ] = useState(false)

  const [
    historyPage,
    setHistoryPage,
  ] = useState(1)

  const [
    historyError,
    setHistoryError,
  ] = useState(null)

  const [
    historyCount,
    setHistoryCount,
  ] = useState(0)

  const [
    historyNextPage,
    setHistoryNextPage,
  ] = useState(null)

  const [
    historyPreviousPage,
    setHistoryPreviousPage,
  ] = useState(null)


  /*
   * =========================
   * LOAD REQUESTS
   * =========================
   */

  const loadLeaveRequests =
    useCallback(
      async (
        requestedQueueStatus = 'PENDING',
        requestedPage = 1,
      ) => {
        try {
          setLoading(true)
          setError(null)

          const response =
            await getPendingRequests({
              status:
                requestedQueueStatus,
              page:
                requestedPage,
            })

          setRequests(
            response?.results || [],
          )

          setTotalCount(
            response?.count || 0,
          )

          setNextPage(
            response?.next || null,
          )

          setPreviousPage(
            response?.previous || null,
          )

          return response
        } catch (requestError) {
          setRequests([])
          setTotalCount(0)
          setNextPage(null)
          setPreviousPage(null)

          setError(
            getApiErrorMessage(
              requestError,
              'Unable to load leave requests.',
            ),
          )

          throw requestError
        } finally {
          setLoading(false)
        }
      },
      [],
    )


  /*
   * =========================
   * LOAD QUEUE
   * =========================
   */

  const loadQueue =
    useCallback(
      async (
        requestedQueueStatus,
        requestedPage,
      ) => {
        return loadLeaveRequests(
          requestedQueueStatus ??
            queueStatus,
          requestedPage ??
            currentPage,
        )
      },
      [
        loadLeaveRequests,
        queueStatus,
        currentPage,
      ],
    )


  /*
   * =========================
   * LOAD LEAVE TYPES
   * =========================
   */

  useEffect(() => {
    let cancelled = false

    const loadTypes = async () => {
      try {
        const response =
          await getLeaveTypes()

        if (cancelled) {
          return
        }

        setLeaveTypes(
          Array.isArray(response)
            ? response.filter(
                (type) =>
                  type?.is_active !== false,
              )
            : [],
        )
      } catch (requestError) {
        if (!cancelled) {
          setLeaveTypes([])
        }

        console.error(
          'Failed to load leave types:',
          requestError,
        )
      }
    }

    void loadTypes()

    return () => {
      cancelled = true
    }
  }, [])


  /*
   * =========================
   * LOAD HISTORY
   * =========================
   */

  const loadLeaveHistory =
    useCallback(
      async (
        requestId,
        page = 1,
      ) => {
        if (!requestId) {
          setLeaveHistory([])
          setHistoryCount(0)
          setHistoryNextPage(null)
          setHistoryPreviousPage(null)

          return
        }

        try {
          setHistoryLoading(true)
          setHistoryError(null)

          const response =
            await getLeaveHistory(
              requestId,
              {
                page,
              },
            )

          setLeaveHistory(
            response?.results || [],
          )

          setHistoryCount(
            response?.count || 0,
          )

          setHistoryNextPage(
            response?.next || null,
          )

          setHistoryPreviousPage(
            response?.previous || null,
          )

          setHistoryPage(page)
        } catch (requestError) {
          setLeaveHistory([])

          setHistoryCount(0)

          setHistoryNextPage(null)

          setHistoryPreviousPage(null)

          setHistoryError(
            getApiErrorMessage(
              requestError,
              'Unable to load approval history.',
            ),
          )
        } finally {
          setHistoryLoading(false)
        }
      },
      [],
    )


  /*
   * =========================
   * FILTER HELPERS
   * =========================
   */

  const updateFilter =
    useCallback(
      (setter) => (value) => {
        setter(value)
        setCurrentPage(1)
      },
      [],
    )


  /*
   * =========================
   * REVIEW ACTION
   * =========================
   */

  const runReviewAction =
    useCallback(
      async (action) => {
        try {
          setActionLoading(true)
          setActionError(null)

          const updatedRequest =
            await action()

          setSelectedRequest(
            updatedRequest,
          )

          await loadLeaveRequests(
            queueStatus,
            currentPage,
          )

          if (updatedRequest?.id) {
            await loadLeaveHistory(
              updatedRequest.id,
              1,
            )
          }

          return updatedRequest
        } catch (requestError) {
          setActionError(
            getApiErrorMessage(
              requestError,
              'Unable to update this leave request.',
            ),
          )

          throw requestError
        } finally {
          setActionLoading(false)
        }
      },
      [
        loadLeaveRequests,
        loadLeaveHistory,
        queueStatus,
        currentPage,
      ],
    )


  /*
   * =========================
   * APPROVE
   * =========================
   */

  const acceptRequest =
    useCallback(
      async (
        requestId,
        payload = {},
      ) => {
        return runReviewAction(
          () =>
            approveLeave(
              requestId,
              payload,
            ),
        )
      },
      [runReviewAction],
    )


  /*
   * =========================
   * REJECT
   * =========================
   */

  const rejectRequest =
    useCallback(
      async (
        requestId,
        payload = {},
      ) => {
        return runReviewAction(
          () =>
            rejectLeave(
              requestId,
              payload,
            ),
        )
      },
      [runReviewAction],
    )


  /*
   * =========================
   * PARTIAL APPROVAL
   * =========================
   */

  const partiallyAcceptRequest =
    useCallback(
      async (
        requestId,
        payload = {},
      ) => {
        return runReviewAction(
          () =>
            partiallyAcceptLeave(
              requestId,
              payload,
            ),
        )
      },
      [runReviewAction],
    )


  /*
   * =========================
   * APPROVE CANCELLATION
   * =========================
   */

  const approveCancellationRequest =
    useCallback(
      async (requestId) => {
        return runReviewAction(
          () =>
            approveLeaveCancellation(
              requestId,
            ),
        )
      },
      [runReviewAction],
    )


  /*
   * =========================
   * REJECT CANCELLATION
   * =========================
   */

  const rejectCancellationRequest =
    useCallback(
      async (requestId) => {
        return runReviewAction(
          () =>
            rejectLeaveCancellation(
              requestId,
            ),
        )
      },
      [runReviewAction],
    )


  /*
   * =========================
   * SELECT REQUEST
   * =========================
   */

  const selectRequest =
    useCallback(
      (request) => {
        setSelectedRequest(request)
        setActionError(null)

        setHistoryPage(1)

        void loadLeaveHistory(
          request?.id,
          1,
        )
      },
      [loadLeaveHistory],
    )


  /*
   * =========================
   * CLEAR REQUEST
   * =========================
   */

  const clearSelectedRequest =
    useCallback(() => {
      setSelectedRequest(null)
      setActionError(null)

      setLeaveHistory([])
      setHistoryError(null)
      setHistoryCount(0)
      setHistoryNextPage(null)
      setHistoryPreviousPage(null)
      setHistoryPage(1)
    }, [])


  /*
   * =========================
   * HISTORY PAGINATION
   * =========================
   */

  const changeHistoryPage =
    useCallback(
      async (page) => {
        if (
          !selectedRequest?.id ||
          page < 1 ||
          historyLoading
        ) {
          return
        }

        await loadLeaveHistory(
          selectedRequest.id,
          page,
        )
      },
      [
        selectedRequest,
        historyLoading,
        loadLeaveHistory,
      ],
    )


  /*
   * =========================
   * QUEUE CHANGE
   * =========================
   */

  const changeQueueStatus =
    useCallback(
      (nextQueueStatus) => {
        setQueueStatus(
          nextQueueStatus,
        )

        setCurrentPage(1)
        setSelectedRequest(null)
        setActionError(null)

        setLeaveHistory([])
        setHistoryError(null)
        setHistoryCount(0)
        setHistoryNextPage(null)
        setHistoryPreviousPage(null)
        setHistoryPage(1)
      },
      [],
    )


  /*
   * =========================
   * REFRESH
   * =========================
   */

  const refresh =
    useCallback(
      async () => {
        return loadLeaveRequests(
          queueStatus,
          currentPage,
        )
      },
      [
        loadLeaveRequests,
        queueStatus,
        currentPage,
      ],
    )


  /*
   * =========================
   * PAGINATION
   * =========================
   */

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        totalCount /
          LEAVE_REVIEW_PAGE_SIZE,
      ),
    )


  /*
   * =========================
   * RETURN
   * =========================
   */

  return {
    requests,
    leaveTypes,

    loading,
    error,

    search,
    status,
    leaveType,
    sortBy,

    setSearch:
      updateFilter(setSearch),

    setStatus:
      updateFilter(setStatus),

    setLeaveType:
      updateFilter(setLeaveType),

    setSortBy:
      updateFilter(setSortBy),

    queueStatus,

    setQueueStatus:
      changeQueueStatus,

    currentPage,
    totalPages,
    totalCount,
    nextPage,
    previousPage,

    setCurrentPage,

    loadQueue,

    refresh,

    selectedRequest,

    selectRequest,
    clearSelectedRequest,

    actionLoading,
    actionError,

    acceptRequest,
    rejectRequest,
    partiallyAcceptRequest,

    approveCancellationRequest,
    rejectCancellationRequest,

    leaveHistory,
    historyLoading,
    historyPage,
    historyError,
    historyCount,
    historyNextPage,
    historyPreviousPage,

    changeHistoryPage,
  }
}


export default useLeaveReview