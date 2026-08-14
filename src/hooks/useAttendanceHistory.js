import { useCallback, useEffect, useMemo, useState } from 'react'
import { ATTENDANCE_PAGE_SIZE } from '../constants/attendance.js'
import useHolidayCatalog from './useHolidayCatalog.js'
import { getMyAttendance, getMyAttendanceCalendar } from '../services/attendanceService.js'
import { getMonthDateRange, mapRecordsByDay } from '../utils/attendanceHelpers.js'

function useAttendanceHistory(currentDate) {
  const { holidayMap, refreshHolidays } = useHolidayCatalog()
  const [{ startDate, endDate }, setDateRange] = useState(() => getMonthDateRange(currentDate))
  const [records, setRecords] = useState([])
  const [calendar, setCalendar] = useState([])
  const [summary, setSummary] = useState({ presentDays: 0, absentDays: 0, lateArrival: 0, attendanceRate: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [nextPage, setNextPage] = useState(null)
  const [previousPage, setPreviousPage] = useState(null)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDateRange(getMonthDateRange(currentDate))
    setCurrentPage(1)
    void refreshHolidays()
  }, [currentDate, refreshHolidays])

  const loadAttendance = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await getMyAttendance({ page: currentPage, startDate, endDate })

      const calendarResponse = await getMyAttendanceCalendar({
        month: currentDate.getMonth() + 1,
        year: currentDate.getFullYear(),
      })


      setRecords(response.records)
      setCalendar(calendarResponse)
      setSummary(response.summary)
      setTotalCount(response.count)
      setNextPage(response.next)
      setPreviousPage(response.previous)
    } catch (err) {
      console.error('ATTENDANCE HISTORY ERROR:', err)
      setError(err)
      setRecords([])
      setCalendar([])
      setTotalCount(0)
      setNextPage(null)
      setPreviousPage(null)
    } finally {
      setLoading(false)
    }
  }, [currentDate, currentPage, endDate, startDate])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAttendance()
  }, [loadAttendance])

  const totalPages = Math.max(1, Math.ceil(totalCount / ATTENDANCE_PAGE_SIZE))
  const recordsByDay = useMemo(() => mapRecordsByDay(records), [records])

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  return {
    records,
    recordsByDay,
    calendar,
    holidayMap,
    summary,
    loading,
    error,
    currentPage,
    totalCount,
    totalPages,
    nextPage,
    previousPage,
    goToPage,
    goToNextPage: () => {
      if (nextPage) setCurrentPage((page) => page + 1)
    },
    goToPreviousPage: () => {
      if (previousPage) setCurrentPage((page) => page - 1)
    },
    refreshAttendance: loadAttendance,
  }
}

export default useAttendanceHistory