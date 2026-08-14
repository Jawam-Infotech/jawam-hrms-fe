import { useCallback, useEffect, useState } from 'react'
import {
  getMissedCheckouts,
  getMyCorrectionRequests,
} from '../services/attendanceService.js'

const getResults = (response) => response?.results ?? response ?? []

const normalizeAttendanceDate = (value) => {
  if (!value) return ''

  const dateMatch = String(value).match(/^\d{4}-\d{2}-\d{2}/)

  return dateMatch ? dateMatch[0] : ''
}

async function getAllMyCorrectionRequests() {
  const requests = []
  let page = 1
  let response

  do {
    response = await getMyCorrectionRequests({ page })
    const results = getResults(response)

    if (Array.isArray(results)) {
      requests.push(...results)
    }

    page += 1
  } while (response?.next)

  return requests
}

function useAttendanceCorrections() {
  const [missedCheckouts, setMissedCheckouts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [correctionRequestsError, setCorrectionRequestsError] = useState('')

  const loadMissedCheckouts = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const [missedCheckoutsResult, correctionRequestsResult] =
        await Promise.allSettled([
          getMissedCheckouts(),
          getAllMyCorrectionRequests(),
        ])

      if (missedCheckoutsResult.status === 'rejected') {
        throw missedCheckoutsResult.reason
      }

      const response = missedCheckoutsResult.value
      const missedCheckoutRecords = getResults(response?.data ?? response)

      if (correctionRequestsResult.status === 'rejected') {
        setCorrectionRequestsError(
          correctionRequestsResult.reason?.response?.data?.detail ||
            correctionRequestsResult.reason?.message ||
            'Failed to load correction requests.'
        )
        // Keep the normal reminder behavior if correction requests are unavailable.
        setMissedCheckouts(missedCheckoutRecords)
        return
      }

      const pendingRequestDates = new Set(
        correctionRequestsResult.value
          .filter((request) => request?.status === 'PENDING')
          .map((request) => normalizeAttendanceDate(request?.date))
          .filter(Boolean)
      )

      setMissedCheckouts(
        missedCheckoutRecords.filter(
          (attendance) =>
            !pendingRequestDates.has(
              normalizeAttendanceDate(attendance?.date)
            )
        )
      )
    } catch (err) {
      setError(
        err.response?.data?.detail ||
        err.message ||
        'Failed to load missed checkouts.'
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Schedule the initial load after mount so this effect only starts the
    // asynchronous synchronization and does not synchronously update state.
    const loadTimer = window.setTimeout(() => {
      loadMissedCheckouts()
    }, 0)

    return () => window.clearTimeout(loadTimer)
  }, [loadMissedCheckouts])

  return {
    missedCheckouts,
    loading,
    error,
    correctionRequestsError,
    refreshMissedCheckouts: loadMissedCheckouts,
  }
}

export default useAttendanceCorrections
