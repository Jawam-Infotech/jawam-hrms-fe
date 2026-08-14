import { useCallback, useEffect, useState } from 'react'
import {
  checkIn as checkInService,
  checkOut as checkOutService,
  startBreak as startBreakService,
  endBreak as endBreakService,
  getTodayAttendance as getTodayAttendanceService,
} from '../services/attendanceService.js'

function useAttendance() {
  const [attendance, setAttendance] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleError = useCallback((err) => {
    const message = err.response?.data?.detail || err.message || 'Something went wrong.'
    setError(message)
    throw err
  }, [])

  const loadTodayAttendance = useCallback(async () => {
    try {
      setLoading(true)
      setError('')

      const data = await getTodayAttendanceService()
      setAttendance(data)

      return data
    } catch (err) {
      if (err.response?.status === 404) {
        setAttendance(null)
        return null
      }

      handleError(err)
    } finally {
      setLoading(false)
    }
  }, [handleError])

  const checkIn = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await checkInService()
      await loadTodayAttendance()

      return data
    } catch (err) {
      handleError(err)
    } finally {
      setLoading(false)
    }
  }

  const checkOut = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await checkOutService()
      await loadTodayAttendance()

      return data
    } catch (err) {
      handleError(err)
    } finally {
      setLoading(false)
    }
  }

  const startBreak = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await startBreakService()
      await loadTodayAttendance()

      return data
    } catch (err) {
      handleError(err)
    } finally {
      setLoading(false)
    }
  }

  const endBreak = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await endBreakService()
      await loadTodayAttendance()

      return data
    } catch (err) {
      handleError(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadTodayAttendance()
  }, [loadTodayAttendance])

  return {
    attendance,
    loading,
    error,
    checkIn,
    checkOut,
    startBreak,
    endBreak,
    loadTodayAttendance,
  }
}

export default useAttendance