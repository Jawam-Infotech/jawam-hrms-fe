import { useCallback, useEffect, useState } from 'react'
import { ATTENDANCE_PAGE_SIZE } from '../constants/attendance.js'
import { getCompanyAttendance } from '../services/attendanceService.js'

function useCompanyAttendance(filters = {}) {
  const [records, setRecords] = useState([])
  const [summary, setSummary] = useState({
    totalEmployees: 0,
    presentToday: 0,
    absent: 0,
    late: 0,
  })
  const [alerts, setAlerts] = useState([])
  const [monthlyTrend, setMonthlyTrend] = useState([])
  const [weeklyTrend, setWeeklyTrend] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [nextPage, setNextPage] = useState(null)
  const [previousPage, setPreviousPage] = useState(null)

  const loadAttendance = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await getCompanyAttendance({
        page: currentPage,
        userId: filters.userId,
        startDate: filters.startDate,
        endDate: filters.endDate,
      })

      setRecords(response.records)
      setSummary(response.summary)
      setAlerts(response.alerts)
      setMonthlyTrend(response.monthlyTrend)
      setWeeklyTrend(response.weeklyTrend)
      setTotalCount(response.count)
      setNextPage(response.next)
      setPreviousPage(response.previous)
    } catch (err) {
      setError(err)
      setRecords([])
      setAlerts([])
      setTotalCount(0)
      setNextPage(null)
      setPreviousPage(null)
    } finally {
      setLoading(false)
    }
  }, [currentPage, filters.endDate, filters.startDate, filters.userId])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAttendance()
  }, [loadAttendance])

  const totalPages = Math.max(1, Math.ceil(totalCount / ATTENDANCE_PAGE_SIZE))

  return {
    records,
    summary,
    alerts,
    monthlyTrend,
    weeklyTrend,
    loading,
    error,
    currentPage,
    totalCount,
    totalPages,
    nextPage,
    previousPage,
    goToPage: (page) => {
      if (page < 1 || page > totalPages) return
      setCurrentPage(page)
    },
    goToNextPage: () => {
      if (nextPage) setCurrentPage((page) => page + 1)
    },
    goToPreviousPage: () => {
      if (previousPage) setCurrentPage((page) => page - 1)
    },
    refreshAttendance: loadAttendance,
  }
}

export default useCompanyAttendance
