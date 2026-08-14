import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ATTENDANCE_PAGE_SIZE } from '../constants/attendance.js'
import {
  getCompanyAttendanceOverview,
  getTeamAttendanceOverview,
} from '../services/attendanceService.js'
import {
  buildAttendanceChartData,
  calculateAttendanceAnalytics,
  calculateAttendanceSummary,
  filterAttendanceAlertsByDepartment,
  filterAttendanceRecordsByDepartment,
  getAttendanceDepartmentOptions,
  getDefaultAttendanceDateRange,
  groupAttendanceByDate,
} from '../utils/attendanceUtils.js'

function useAttendanceOverview(scope = 'company') {
  const defaultDateRange = useMemo(() => getDefaultAttendanceDateRange(), [])
  const [startDate, setStartDate] = useState(defaultDateRange.startDate)
  const [endDate, setEndDate] = useState(defaultDateRange.endDate)
  const [department, setDepartment] = useState('All Departments')
  const [records, setRecords] = useState([])
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const requestSequence = useRef(0)

  const fetchOverview = useCallback(async () => {
    const requestId = requestSequence.current + 1
    requestSequence.current = requestId

    setLoading(true)
    setError(null)
    setCurrentPage(1)

    try {
      const fetcher =
        scope === 'team'
          ? getTeamAttendanceOverview
          : getCompanyAttendanceOverview

      const response = await fetcher({
        startDate,
        endDate,
      })

      if (requestSequence.current !== requestId) {
        return
      }

      setRecords(response.records)
      setAlerts(response.alerts)
    } catch (err) {
      if (requestSequence.current !== requestId) {
        return
      }

      setRecords([])
      setAlerts([])
      setError(err)
    } finally {
      if (requestSequence.current === requestId) {
        setLoading(false)
      }
    }
  }, [endDate, scope, startDate])

  useEffect(() => {
    const initialize = () => {
      void fetchOverview()
    }

    queueMicrotask(initialize)
  }, [fetchOverview])

  const availableDepartments = useMemo(
    () => getAttendanceDepartmentOptions(records),
    [records]
  )

  const filteredRecords = useMemo(
    () => filterAttendanceRecordsByDepartment(records, department),
    [department, records]
  )

  const groupedAttendance = useMemo(
    () => groupAttendanceByDate(filteredRecords),
    [filteredRecords]
  )

  const chartData = useMemo(
    () => buildAttendanceChartData(groupedAttendance),
    [groupedAttendance]
  )

  const analytics = useMemo(
    () => calculateAttendanceAnalytics(groupedAttendance),
    [groupedAttendance]
  )

  const summary = useMemo(
    () => calculateAttendanceSummary(filteredRecords, scope),
    [filteredRecords, scope]
  )

  const filteredAlerts = useMemo(
    () => filterAttendanceAlertsByDepartment(alerts, department),
    [alerts, department]
  )

  const totalCount = filteredRecords.length
  const totalPages = Math.max(1, Math.ceil(totalCount / ATTENDANCE_PAGE_SIZE))

  const currentPageRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * ATTENDANCE_PAGE_SIZE
    return filteredRecords.slice(startIndex, startIndex + ATTENDANCE_PAGE_SIZE)
  }, [currentPage, filteredRecords])

  const goToPage = useCallback(
    (page) => {
      if (page < 1 || page > totalPages) {
        return
      }

      setCurrentPage(page)
    },
    [totalPages]
  )

  const goToNextPage = useCallback(() => {
    setCurrentPage((page) => (page < totalPages ? page + 1 : page))
  }, [totalPages])

  const goToPreviousPage = useCallback(() => {
    setCurrentPage((page) => (page > 1 ? page - 1 : page))
  }, [])

  return {
    startDate,
    endDate,
    department,
    setStartDate,
    setEndDate,
    setDepartment,
    availableDepartments,
    summary,
    analytics,
    chartData,
    records: currentPageRecords,
    filteredRecords,
    alerts: filteredAlerts,
    loading,
    error,
    currentPage,
    totalCount,
    totalPages,
    nextPage: currentPage < totalPages ? currentPage + 1 : null,
    previousPage: currentPage > 1 ? currentPage - 1 : null,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    refreshAttendance: fetchOverview,
  }
}

export default useAttendanceOverview
