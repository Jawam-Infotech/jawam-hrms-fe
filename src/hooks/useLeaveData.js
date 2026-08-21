import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import {
  getLeaveTypes,
  getLeaveSummary,
  getLeaveBalance,
  getLeaveRequests,
} from '../services/leaveService.js'


const HISTORY_PAGE_SIZE = 10

const INITIAL_SUMMARY = {
  available: 0,
  approved: 0,
  inProcess: 0,
  rejected: 0,
}


const INITIAL_HISTORY_PAGINATION = {
  page: 1,
  pageSize: HISTORY_PAGE_SIZE,
  count: 0,
  next: null,
  previous: null,
}


function useLeaveData() {
  /*
   * =========================
   * LEAVE DATA
   * =========================
   */

  const [leaveTypes, setLeaveTypes] =
    useState([])

  const [summary, setSummary] =
    useState(INITIAL_SUMMARY)

  const [leaveBalances, setLeaveBalances] =
    useState([])

  const [history, setHistory] =
    useState([])


  /*
   * =========================
   * HISTORY PAGINATION
   * =========================
   *
   * Backend supports:
   *
   * ?page=2&page_size=10
   *
   * Page size is intentionally fixed
   * to 10 for Employee Leave History.
   */

  const [
    historyPagination,
    setHistoryPagination,
  ] = useState(
    INITIAL_HISTORY_PAGINATION,
  )


  /*
   * =========================
   * LOADING STATES
   * =========================
   */

  const [
    leaveTypesLoading,
    setLeaveTypesLoading,
  ] = useState(true)

  const [
    summaryLoading,
    setSummaryLoading,
  ] = useState(true)

  const [
    balanceLoading,
    setBalanceLoading,
  ] = useState(true)

  const [
    historyLoading,
    setHistoryLoading,
  ] = useState(true)


  /*
   * =========================
   * ERROR STATES
   * =========================
   */

  const [
    leaveTypesError,
    setLeaveTypesError,
  ] = useState('')

  const [
    summaryError,
    setSummaryError,
  ] = useState('')

  const [
    balanceError,
    setBalanceError,
  ] = useState('')

  const [
    historyError,
    setHistoryError,
  ] = useState('')


  /*
   * =========================
   * LOAD LEAVE TYPES
   * =========================
   */

  const loadLeaveTypes = useCallback(
    async () => {
      try {
        setLeaveTypesLoading(true)
        setLeaveTypesError('')

        const response =
          await getLeaveTypes()

        const activeTypes =
          Array.isArray(response)
            ? response.filter(
                (type) =>
                  type?.is_active,
              )
            : []

        setLeaveTypes(
          activeTypes,
        )
      } catch (error) {
        console.error(
          'Failed to load leave types:',
          error,
        )

        setLeaveTypes([])

        setLeaveTypesError(
          error?.message ||
            'Unable to load leave types.',
        )
      } finally {
        setLeaveTypesLoading(false)
      }
    },
    [],
  )


  /*
   * =========================
   * LOAD LEAVE SUMMARY
   * =========================
   */

  const loadLeaveSummary = useCallback(
    async () => {
      try {
        setSummaryLoading(true)
        setSummaryError('')

        const response =
          await getLeaveSummary()

        setSummary({
          available:
            Number.parseFloat(
              response?.available_leaves ??
                0,
            ),

          approved:
            Number.parseFloat(
              response?.approved_leaves ??
                0,
            ),

          inProcess:
            Number.parseFloat(
              response?.pending_leaves ??
                0,
            ),

          rejected:
            Number.parseFloat(
              response?.rejected_leaves ??
                0,
            ),
        })
      } catch (error) {
        console.error(
          'Failed to load leave summary:',
          error,
        )

        setSummary(
          INITIAL_SUMMARY,
        )

        setSummaryError(
          error?.message ||
            'Unable to load leave summary.',
        )
      } finally {
        setSummaryLoading(false)
      }
    },
    [],
  )


  /*
   * =========================
   * LOAD LEAVE BALANCES
   * =========================
   *
   * IMPORTANT:
   *
   * The frontend does NOT calculate,
   * deduct, or restore leave balances.
   *
   * The backend remains the source
   * of truth for balance calculations.
   */

  const loadLeaveBalances = useCallback(
    async () => {
      try {
        setBalanceLoading(true)
        setBalanceError('')

        const response =
          await getLeaveBalance()

        setLeaveBalances(
          Array.isArray(response)
            ? response
            : [],
        )
      } catch (error) {
        console.error(
          'Failed to load leave balances:',
          error,
        )

        setLeaveBalances([])

        setBalanceError(
          error?.message ||
            'Unable to load leave balances.',
        )
      } finally {
        setBalanceLoading(false)
      }
    },
    [],
  )


  /*
   * =========================
   * LOAD LEAVE HISTORY
   * =========================
   *
   * Backend response:
   *
   * {
   *   count,
   *   next,
   *   previous,
   *   results
   * }
   */

  const loadLeaveHistory = useCallback(
    async (page = 1) => {
      try {
        setHistoryLoading(true)
        setHistoryError('')

        const response =
          await getLeaveRequests({
            page,
            page_size: HISTORY_PAGE_SIZE,
          })

        /*
         * The backend returns a paginated
         * response for Leave History.
         */

        if (
          response &&
          !Array.isArray(response)
        ) {
          setHistory(
            Array.isArray(
              response.results,
            )
              ? response.results
              : [],
          )

          setHistoryPagination({
            page,
            pageSize:
              HISTORY_PAGE_SIZE,
            count:
              Number.parseInt(
                response.count ?? 0,
                10,
              ),
            next:
              response.next || null,
            previous:
              response.previous ||
              null,
          })

          return
        }

        /*
         * Defensive fallback in case the
         * endpoint ever returns a direct
         * array instead of pagination.
         */

        setHistory(
          Array.isArray(response)
            ? response
            : [],
        )

        setHistoryPagination({
          page: 1,
          pageSize:
            HISTORY_PAGE_SIZE,
          count: Array.isArray(
            response,
          )
            ? response.length
            : 0,
          next: null,
          previous: null,
        })
      } catch (error) {
        console.error(
          'Failed to load leave history:',
          error,
        )

        setHistory([])

        setHistoryPagination(
          INITIAL_HISTORY_PAGINATION,
        )

        setHistoryError(
          error?.message ||
            'Unable to load leave history.',
        )
      } finally {
        setHistoryLoading(false)
      }
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
          historyLoading ||
          page < 1 ||
          page ===
            historyPagination.page
        ) {
          return
        }

        await loadLeaveHistory(page)
      },
      [
        historyLoading,
        historyPagination.page,
        loadLeaveHistory,
      ],
    )


  /*
   * =========================
   * REFRESH ALL LEAVE DATA
   * =========================
   */

  const refresh = useCallback(
    async () => {
      const results =
        await Promise.allSettled([
          loadLeaveTypes(),
          loadLeaveSummary(),
          loadLeaveBalances(),
          loadLeaveHistory(
            historyPagination.page,
          ),
        ])

      const failedRequests =
        results.filter(
          (result) =>
            result.status === 'rejected',
        )

      if (
        failedRequests.length > 0
      ) {
        console.error(
          'One or more leave refresh operations failed:',
          failedRequests,
        )
      }

      return results
    },
    [
      loadLeaveTypes,
      loadLeaveSummary,
      loadLeaveBalances,
      loadLeaveHistory,
      historyPagination.page,
    ],
  )


  /*
   * =========================
   * INITIAL LOAD
   * =========================
   */

  useEffect(() => {
    let cancelled = false

    queueMicrotask(() => {
      if (cancelled) {
        return
      }

      void refresh()
    })

    return () => {
      cancelled = true
    }
  }, [refresh])


  /*
   * =========================
   * RETURN PUBLIC API
   * =========================
   */

  return {
    /*
     * Data
     */
    leaveTypes,
    summary,
    leaveBalances,
    history,

    /*
     * History pagination
     */
    historyPagination,
    changeHistoryPage,

    /*
     * Loading
     */
    leaveTypesLoading,
    summaryLoading,
    balanceLoading,
    historyLoading,

    /*
     * Errors
     */
    leaveTypesError,
    summaryError,
    balanceError,
    historyError,

    /*
     * Refresh
     */
    refresh,
  }
}


export default useLeaveData