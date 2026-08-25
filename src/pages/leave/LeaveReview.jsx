import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import { getApiErrorMessage } from '../../utils/apiErrorMessage.js'

import {
  LEAVE_REVIEW_PAGE_SIZE,
} from '../../constants/leave.js'

import {
  approveLeave,
  getLeaveHistory,
  getLeaveTypes,
  getPendingRequests,
  partiallyAcceptLeave,
  rejectLeave,
  approveLeaveCancellation,
  rejectLeaveCancellation,
} from '../../services/leaveService.js'


function useLeaveReview() {
  /*
   * =========================
   * REQUEST DATA
   * =========================
   */

  const [requests, setRequests] =
    useState([])

  const [loading, setLoading] =
    useState(false)

  const [error, setError] =
    useState(null)


  /*
   * =========================
   * FILTERS
   * =========================
   */

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


  /*
   * =========================
   * PAGINATION
   * =========================
   */

  const [currentPage, setCurrentPage] =
    useState(1)

  const [totalCount, setTotalCount] =
    useState(0)

  const [nextPage, setNextPage] =
    useState(null)

  const [previousPage, setPreviousPage] =
    useState(null)


  /*
   * =========================
   * REVIEW STATE
   * =========================
   */

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


  /*
   * =========================
   * APPROVAL HISTORY
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

  const [
    historyPage,
    setHistoryPage,
  ] = useState(1)


  /*
   * =========================
   * REVIEW QUEUE
   * =========================
   */

  const [
    queueStatus,
    setQueueStatus,
  ] = useState('PENDING')


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

          const message =
            getApiErrorMessage(
              requestError,
              'Unable to load leave requests.',
            )

          setError(message)

          throw requestError
        } finally {
          setLoading(false)
        }
      },
      [],
    )


  /*
   * =========================
   * PUBLIC QUEUE LOADER
   * =========================
   *
   * The page calls this explicitly.
   *
   * We intentionally do NOT call
   * loadLeaveRequests from an effect.
   * This avoids the React
   * set-state-in-effect lint rule.
   */

  const loadQueue =
    useCallback(
      async (
        requestedQueueStatus = queueStatus,
        requestedPage = currentPage,
      ) => {
        return loadLeaveRequests(
          requestedQueueStatus,
          requestedPage,
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
   * LOAD LEAVE HISTORY
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
          setHistoryPage(1)

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

          setHistoryPage(page)

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
        } catch (requestError) {
          setLeaveHistory([])
          setHistoryCount(0)
          setHistoryNextPage(null)
          setHistoryPreviousPage(null)

          const message =
            getApiErrorMessage(
              requestError,
              'Unable to load approval history.',
            )

          setHistoryError(message)
        } finally {
          setHistoryLoading(false)
        }
      },
      [],
    )


  /*
   * =========================
   * LOAD LEAVE TYPES
   * =========================
   */

  useEffect(() => {
    let cancelled = false

    const loadLeaveTypes = async () => {
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

    void loadLeaveTypes()

    return () => {
      cancelled = true
    }
  }, [])


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

          await loadLeaveHistory(
            updatedRequest?.id,
            historyPage,
          )

          return updatedRequest
        } catch (requestError) {
          const message =
            getApiErrorMessage(
              requestError,
              'Unable to update this leave request.',
            )

          setActionError(message)

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
        historyPage,
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
   * CLEAR SELECTED REQUEST
   * =========================
   */

  const clearSelectedRequest =
    useCallback(
      () => {
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
   * CHANGE HISTORY PAGE
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
   * CHANGE QUEUE
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
   * MANUAL REFRESH
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
   * TOTAL PAGES
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
   * PUBLIC API
   * =========================
   */

  return {
    /*
     * Requests
     */

    requests,
    leaveTypes,


    /*
     * State
     */

    loading,
    error,


    /*
     * Filters
     */

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


    /*
     * Queue
     */

    queueStatus,

    setQueueStatus:
      changeQueueStatus,


    /*
     * Pagination
     */

    currentPage,
    totalPages,
    totalCount,
    nextPage,
    previousPage,

    setCurrentPage,


    /*
     * Queue loading
     */

    loadQueue,


    /*
     * Refresh
     */

    refresh,


    /*
     * Selected request
     */

    selectedRequest,

    selectRequest,

    clearSelectedRequest,


    /*
     * Review action state
     */

    actionLoading,
    actionError,


    /*
     * Review actions
     */

    acceptRequest,
    rejectRequest,
    partiallyAcceptRequest,


    /*
     * Cancellation actions
     */

    approveCancellationRequest,
    rejectCancellationRequest,


    /*
     * Approval history
     */

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