import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  LEAVE_REVIEW_PAGE_SIZE,
} from '../constants/leave.js'

import {
  approveLeave,
  getPendingRequests,
  partiallyAcceptLeave,
  rejectLeave,
  approveLeaveCancellation,
  rejectLeaveCancellation,
} from '../services/leaveService.js'

import {
  filterLeaveRequests,
  sortLeaveRequests,
} from '../utils/leaveUtils.js'


function useLeaveReview() {
  /*
   * =========================
   * REQUEST DATA
   * =========================
   */

  const [requests, setRequests] =
    useState([])

  const [loading, setLoading] =
    useState(true)

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


  /*
   * =========================
   * PAGINATION
   * =========================
   */

  const [currentPage, setCurrentPage] =
    useState(1)


  /*
   * =========================
   * REVIEW STATE
   * =========================
   */

  const [selectedRequest, setSelectedRequest] =
    useState(null)

  const [actionLoading, setActionLoading] =
    useState(false)

  const [actionError, setActionError] =
    useState(null)


  /*
   * =========================
   * REVIEW QUEUE
   * =========================
   *
   * PENDING
   * CANCELLATION_REQUESTED
   */

  const [queueStatus, setQueueStatus] =
    useState('PENDING')


  /*
   * =========================
   * LOAD REQUESTS
   * =========================
   */

  const loadLeaveRequests =
    useCallback(
      async (requestedQueueStatus = 'PENDING') => {
        try {
          setLoading(true)
          setError(null)

          const response =
            await getPendingRequests({
              status:
                requestedQueueStatus,
            })

          setRequests(
            response?.results || [],
          )
        } catch (requestError) {
          setRequests([])
          setError(requestError)
        } finally {
          setLoading(false)
        }
      },
      [],
    )


  /*
   * =========================
   * INITIAL / QUEUE LOAD
   * =========================
   */

  useEffect(() => {
    let cancelled = false

    queueMicrotask(() => {
      if (cancelled) return

      void loadLeaveRequests(
        queueStatus,
      )
    })

    return () => {
      cancelled = true
    }
  }, [
    loadLeaveRequests,
    queueStatus,
  ])


  /*
   * =========================
   * FILTER + SORT
   * =========================
   */

  const filteredRequests =
    useMemo(
      () =>
        sortLeaveRequests(
          filterLeaveRequests(
            requests,
            {
              search,
              status,
              leaveType,
            },
          ),
          sortBy,
        ),
      [
        leaveType,
        requests,
        search,
        sortBy,
        status,
      ],
    )


  /*
   * =========================
   * PAGINATION
   * =========================
   */

  const totalCount =
    filteredRequests.length

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        totalCount /
          LEAVE_REVIEW_PAGE_SIZE,
      ),
    )


  const paginatedRequests =
    useMemo(
      () => {
        const startIndex =
          (currentPage - 1) *
          LEAVE_REVIEW_PAGE_SIZE

        return filteredRequests.slice(
          startIndex,
          startIndex +
            LEAVE_REVIEW_PAGE_SIZE,
        )
      },
      [
        currentPage,
        filteredRequests,
      ],
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
   *
   * After every successful action:
   *
   * 1. Clear action error
   * 2. Execute backend action
   * 3. Refresh current queue
   * 4. Update selected request
   *
   * The backend remains the
   * source of truth.
   */

  const runReviewAction =
    useCallback(
      async (action) => {
        try {
          setActionLoading(true)
          setActionError(null)

          const updatedRequest =
            await action()

          /*
           * Keep the latest returned
           * request available for the
           * currently open modal.
           */
          setSelectedRequest(
            updatedRequest,
          )

          /*
           * Reload the queue from the
           * backend because the request
           * may have moved out of the
           * current queue.
           */
          await loadLeaveRequests(
            queueStatus,
          )

          return updatedRequest
        } catch (requestError) {
          setActionError(
            requestError?.message ||
              'Unable to update this leave request.',
          )

          throw requestError
        } finally {
          setActionLoading(false)
        }
      },
      [
        loadLeaveRequests,
        queueStatus,
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
      },
      [],
    )


  /*
   * =========================
   * CLEAR SELECTED REQUEST
   * =========================
   */

  const clearSelectedRequest =
    useCallback(() => {
      setSelectedRequest(null)
      setActionError(null)
    }, [])


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
        await loadLeaveRequests(
          queueStatus,
        )
      },
      [
        loadLeaveRequests,
        queueStatus,
      ],
    )


  /*
   * =========================
   * RETURN PUBLIC API
   * =========================
   */

  return {
    /*
     * Requests
     */
    requests:
      paginatedRequests,

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

    setCurrentPage,

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
  }
}


export default useLeaveReview