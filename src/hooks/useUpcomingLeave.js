import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import {
  getUpcomingRequests,
} from '../services/leaveService.js'


const UPCOMING_LEAVE_PAGE_SIZE = 10


const INITIAL_PAGINATION = {
  page: 1,
  pageSize: UPCOMING_LEAVE_PAGE_SIZE,
  count: 0,
  next: null,
  previous: null,
}


function useUpcomingLeave() {
  /*
   * =========================
   * DATA
   * =========================
   */

  const [requests, setRequests] =
    useState([])

  /*
   * =========================
   * PAGINATION
   * =========================
   *
   * Pagination is controlled by
   * the backend.
   *
   * The frontend requests:
   *
   * ?page=1&page_size=10
   */

  const [
    pagination,
    setPagination,
  ] = useState(
    INITIAL_PAGINATION,
  )

  /*
   * =========================
   * LOADING
   * =========================
   */

  const [loading, setLoading] =
    useState(true)

  /*
   * =========================
   * ERROR
   * =========================
   */

  const [error, setError] =
    useState(null)


  /*
   * =========================
   * LOAD UPCOMING LEAVES
   * =========================
   */

  const loadUpcomingLeaves =
    useCallback(
      async (page = 1) => {
        try {
          setLoading(true)
          setError(null)

          const response =
            await getUpcomingRequests({
              page,
              page_size:
                UPCOMING_LEAVE_PAGE_SIZE,
            })

          /*
           * Backend returns:
           *
           * {
           *   count,
           *   next,
           *   previous,
           *   results
           * }
           */

          if (
            response &&
            !Array.isArray(response)
          ) {
            setRequests(
              Array.isArray(
                response.results,
              )
                ? response.results
                : [],
            )

            setPagination({
              page,
              pageSize:
                UPCOMING_LEAVE_PAGE_SIZE,
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
           * Defensive fallback.
           */

          setRequests(
            Array.isArray(response)
              ? response
              : [],
          )

          setPagination({
            page: 1,
            pageSize:
              UPCOMING_LEAVE_PAGE_SIZE,
            count: Array.isArray(
              response,
            )
              ? response.length
              : 0,
            next: null,
            previous: null,
          })
        } catch (requestError) {
          console.error(
            'Failed to load upcoming leaves:',
            requestError,
          )

          setRequests([])

          setPagination(
            INITIAL_PAGINATION,
          )

          setError(
            requestError?.message ||
              'Unable to load upcoming leaves.',
          )
        } finally {
          setLoading(false)
        }
      },
      [],
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

      void loadUpcomingLeaves(1)
    })

    return () => {
      cancelled = true
    }
  }, [loadUpcomingLeaves])


  /*
   * =========================
   * CHANGE PAGE
   * =========================
   */

  const changePage =
    useCallback(
      async (page) => {
        if (
          loading ||
          page < 1 ||
          page === pagination.page
        ) {
          return
        }

        await loadUpcomingLeaves(
          page,
        )
      },
      [
        loading,
        pagination.page,
        loadUpcomingLeaves,
      ],
    )


  /*
   * =========================
   * REFRESH
   * =========================
   */

  const refresh =
    useCallback(
      async () => {
        await loadUpcomingLeaves(
          pagination.page,
        )
      },
      [
        loadUpcomingLeaves,
        pagination.page,
      ],
    )


  /*
   * =========================
   * RETURN PUBLIC API
   * =========================
   */

  return {
    requests,

    loading,

    error,

    pagination,

    changePage,

    refresh,
  }
}


export default useUpcomingLeave