import {
  useCallback,
  useEffect,
  useState,
} from 'react'

import {
  getPendingRequests,
} from '../services/leaveService.js'


function usePendingLeaveRequests() {
  const [requests, setRequests] =
    useState([])

  const [totalCount, setTotalCount] =
    useState(0)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState(null)


  /*
   * =========================
   * LOAD PENDING REQUESTS
   * =========================
   */

  const loadPendingRequests =
    useCallback(async () => {
      try {
        setLoading(true)
        setError(null)

        const response =
          await getPendingRequests({
            status: 'PENDING',
          })

        setRequests(
          response?.results?.slice(
            0,
            4,
          ) || [],
        )

        setTotalCount(
          response?.count || 0,
        )
      } catch (requestError) {
        setRequests([])
        setTotalCount(0)
        setError(requestError)
      } finally {
        setLoading(false)
      }
    }, [])


  /*
   * =========================
   * INITIAL LOAD
   * =========================
   */

  useEffect(() => {
    let cancelled = false

    queueMicrotask(() => {
      if (!cancelled) {
        void loadPendingRequests()
      }
    })

    return () => {
      cancelled = true
    }
  }, [loadPendingRequests])


  /*
   * =========================
   * RETURN
   * =========================
   */

  return {
    requests,
    totalCount,
    loading,
    error,
    refresh: loadPendingRequests,
  }
}


export default usePendingLeaveRequests