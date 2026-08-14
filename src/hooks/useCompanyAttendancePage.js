import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ATTENDANCE_PAGE_SIZE } from '../constants/attendance.js'
import { getCompanyAttendanceOverview, getTeamAttendanceOverview, getAttendanceTrend } from '../services/attendanceService.js'
import { getAttendanceDepartmentOptions, getAttendanceStatusOptions, getTodayDateInput, normalizeAttendanceStatus } from '../utils/attendanceUtils.js'

function useCompanyAttendancePage(user, options = {}) {
  console.log('CURRENT USER ROLE:', user?.role)

  const { scope = 'company' } = options
  const todayDate = useMemo(() => getTodayDateInput(), [])
  const [attendanceDate, setAttendanceDate] = useState(todayDate)
  const [department, setDepartment] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [summary, setSummary] = useState({ totalEmployees: 0, presentToday: 0, late: 0, absent: 0 })
  const [attendanceRecords, setAttendanceRecords] = useState([])
  const [trendData, setTrendData] = useState({ weekly: [], monthly: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const requestSequence = useRef(0)

  const fetchOverview = useMemo(() => scope === 'team' ? getTeamAttendanceOverview : getCompanyAttendanceOverview, [scope])

const fetchAttendanceBundle = useCallback(async (dateValue, options = {}) => {
  const { resetPage = true } = options
  const selectedDate = dateValue || todayDate
  const requestId = requestSequence.current + 1
  requestSequence.current = requestId

  setLoading(true)
  setError(null)
  if (resetPage) setCurrentPage(1)

  try {
    const selectedResponse = await fetchOverview({ startDate: selectedDate, endDate: selectedDate })

    if (requestSequence.current !== requestId) return

    const canViewTrend = ['admin', 'hr', 'ceo'].includes(String(user?.role || '').toLowerCase())
    let weeklyTrend = []
    let monthlyTrend = []

    if (canViewTrend) {
      ;[weeklyTrend, monthlyTrend] = await Promise.all([getAttendanceTrend('weekly'), getAttendanceTrend('monthly')])
    }

    if (requestSequence.current !== requestId) return

    setAttendanceRecords(selectedResponse.records || [])
    setSummary(selectedResponse.summary)
    setTrendData({
      weekly: weeklyTrend.map((item) => ({ label: item.label, value: item.attendance_rate, presentEmployees: item.present_employees })),
      monthly: monthlyTrend.map((item) => ({ label: item.label, value: item.attendance_rate })),
    })
  } catch (err) {
    if (requestSequence.current !== requestId) return

    setAttendanceRecords([])
    setTrendData({ weekly: [], monthly: [] })
    setSummary({ totalEmployees: 0, presentToday: 0, late: 0, absent: 0 })
    setError(err)
  } finally {
    if (requestSequence.current === requestId) setLoading(false)
  }
}, [fetchOverview, todayDate, user?.role])

  useEffect(() => {
    let cancelled = false

    queueMicrotask(() => {
      if (!cancelled) void fetchAttendanceBundle(attendanceDate)
    })

    return () => {
      cancelled = true
    }
  }, [attendanceDate, fetchAttendanceBundle])

  const refreshAttendance = useCallback(async () => {
    await fetchAttendanceBundle(attendanceDate)
  }, [attendanceDate, fetchAttendanceBundle])

  const availableDepartments = useMemo(() => getAttendanceDepartmentOptions(attendanceRecords), [attendanceRecords])

  const filteredRecords = useMemo(() => {
    const search = searchQuery.trim().toLowerCase()

    return attendanceRecords.filter((record) => {
      const departmentValue = String(record.department || '').trim()
      const matchesDepartment = department === 'All' || departmentValue === department
      const recordStatus = normalizeAttendanceStatus(record.displayStatus || record.finalStatus)
      const normalizedFilter = normalizeAttendanceStatus(statusFilter)
      const matchesStatus = statusFilter === 'All' || recordStatus === normalizedFilter
      const matchesSearch = !search || [record.name, record.department, record.designation, record.checkIn, record.checkOut].filter(Boolean).some((value) => String(value).toLowerCase().includes(search))

      return matchesDepartment && matchesStatus && matchesSearch
    })
  }, [attendanceRecords, department, searchQuery, statusFilter])

  const totalCount = filteredRecords.length
  const totalPages = Math.max(1, Math.ceil(totalCount / ATTENDANCE_PAGE_SIZE))

  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * ATTENDANCE_PAGE_SIZE
    return filteredRecords.slice(startIndex, startIndex + ATTENDANCE_PAGE_SIZE)
  }, [currentPage, filteredRecords])

  const goToPage = useCallback((page) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }, [totalPages])

  const goToNextPage = useCallback(() => {
    setCurrentPage((page) => page < totalPages ? page + 1 : page)
  }, [totalPages])

  const goToPreviousPage = useCallback(() => {
    setCurrentPage((page) => page > 1 ? page - 1 : page)
  }, [])

  const onDepartmentChange = useCallback((value) => {
    setDepartment(value)
    setCurrentPage(1)
  }, [])

  const onStatusFilterChange = useCallback((value) => {
    setStatusFilter(value)
    setCurrentPage(1)
  }, [])

  const onSearchQueryChange = useCallback((value) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }, [])

  return {
    attendanceDate,
    setAttendanceDate,
    department,
    searchQuery,
    statusFilter,
    onDepartmentChange,
    onSearchQueryChange,
    onStatusFilterChange,
    availableDepartments,
    statusOptions: getAttendanceStatusOptions(),
    summaryCards: summary,
    trendData,
    records: paginatedRecords,
    allRecords: attendanceRecords,
    loading,
    error,
    currentPage,
    totalCount,
    totalPages,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    refreshAttendance,
  }
}

export default useCompanyAttendancePage