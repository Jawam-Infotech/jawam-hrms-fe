import { useCallback, useEffect, useMemo, useState } from 'react'
import { getEmployeeAttendanceSummary } from '../services/attendanceService.js'

function useEmployeeAttendanceSummary(employeeId) {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const currentPeriod = useMemo(() => {
    const currentDate = new Date()

    return {
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear(),
    }
  }, [])

  const loadSummary = useCallback(async () => {
    if (!employeeId) {
      setSummary(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const data = await getEmployeeAttendanceSummary({
        userId: employeeId,
        month: currentPeriod.month,
        year: currentPeriod.year,
      })

      setSummary(data?.summary ?? data)
    } catch (requestError) {
      setSummary(null)
      setError(requestError)
    } finally {
      setLoading(false)
    }
  }, [currentPeriod.month, currentPeriod.year, employeeId])

  useEffect(() => {
    queueMicrotask(() => {
      void loadSummary()
    })
  }, [loadSummary])

  return {
    summary,
    loading,
    error,
    refreshSummary: loadSummary,
  }
}

export default useEmployeeAttendanceSummary
