const STATUS_LABELS = {
  PRESENT: 'Present',
  ABSENT: 'Absent',
  LATE: 'Late',
  HALF_DAY: 'Half Day',
  ON_LEAVE: 'On Leave',
}

function unwrapAttendanceResponse(data) {
  return data?.data ?? data ?? {}
}

function getAttendanceResults(data) {
  const payload = unwrapAttendanceResponse(data)

  if (Array.isArray(payload?.results)) {
    return payload.results
  }

  if (Array.isArray(payload?.attendance)) {
    return payload.attendance
  }

  if (Array.isArray(payload?.records)) {
    return payload.records
  }

  if (Array.isArray(payload)) {
    return payload
  }

  return []
}

function formatLocalDate(value) {
  if (!value) return '-'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return String(value)
  }

  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function formatLocalTime(value) {
  if (!value) return '-'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return String(value)
  }

  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDuration(value) {
  if (!value) return '-'

  const duration = String(value)

  // Remove microseconds if present
  return duration.split('.')[0]
}

function normalizeStatus(value = '') {
  return String(value || '').trim().toUpperCase()
}

function formatStatusLabel(value = '') {
  const status = normalizeStatus(value)
  return STATUS_LABELS[status] || status.replaceAll('_', ' ') || '-'
}

function getRecordDate(record = {}) {
  return (
    record.date ||
    record.attendance_date ||
    record.work_date ||
    record.check_in ||
    record.checkIn ||
    ''
  )
}

function getEmployeeName(record = {}) {
  const user = record.user || record.employee || {}
  const firstName = record.first_name || user.first_name || user.firstName || ''
  const lastName = record.last_name || user.last_name || user.lastName || ''
  const fullName = [firstName, lastName].filter(Boolean).join(' ')

  return (
    record.name ||
    record.employee_name ||
    record.user_name ||
    user.name ||
    fullName ||
    '-'
  )
}

function normalizeBreakSession(session = {}) {
  return {
    id: session.id || session.break_id || '',
    breakStart: session.break_start || session.breakStart || '',
    breakEnd: session.break_end || session.breakEnd || null,
  }
}

function normalizeAttendanceRecord(record = {}) {
const finalStatus = record.final_status || record.finalStatus || ''
const displayStatus = record.display_status || record.displayStatus || finalStatus
  const breakSessions = Array.isArray(record.break_sessions)
    ? record.break_sessions.map(normalizeBreakSession)
    : Array.isArray(record.breakSessions)
      ? record.breakSessions.map(normalizeBreakSession)
      : []

  return {
    id: record.id || record.attendance_id || `${getEmployeeName(record)}-${getRecordDate(record)}`,
userId:
  record.user_id ||
  record.userId ||
  (typeof record.user === 'number' ? record.user : record.user?.id) ||
  record.employee?.id ||
  '',
    employeeId: record.employee_id || record.employeeId || record.user?.employee_id || '',
    name: getEmployeeName(record),
    department: record.department || record.user?.department || record.employee?.department || '-',
    designation:
      record.designation ||
      record.user?.designation ||
      record.employee?.designation ||
      record.job_title ||
      '-',
    date: formatLocalDate(getRecordDate(record)),
    rawDate: getRecordDate(record),
    rawCheckIn: record.check_in || record.checkIn || '',
    rawCheckOut: record.check_out || record.checkOut || '',
    checkIn: formatLocalTime(record.check_in || record.checkIn),
    checkOut: formatLocalTime(record.check_out || record.checkOut),
    breakEnd: formatLocalTime(record.break_end || record.breakEnd),
    breakSessions,
    breakDuration: formatDuration(
      record.total_break_duration ||
      record.totalBreakDuration ||
      record.break_duration ||
      record.breakDuration
    ),
    workingHours: formatDuration(
      record.working_hours ||
      record.workingHours ||
      record.effective_work_duration ||
      record.effective_working_duration ||
      record.effectiveWorkingDuration
    ),
    effectiveWorkingDuration: formatDuration(
      record.effective_work_duration ||
      record.effective_working_duration ||
      record.effectiveWorkingDuration
    ),
    finalStatus: normalizeStatus(finalStatus),
displayStatus: normalizeStatus(displayStatus),
statusLabel: formatStatusLabel(displayStatus),
    attendance:
      record.attendance ||
      record.remark ||
      record.remarks ||
      formatStatusLabel(finalStatus),
  }
}

function calculateSummary(records = []) {
  const total = records.length
  const present = records.filter((record) => record.finalStatus === 'PRESENT').length
  const absent = records.filter((record) => record.finalStatus === 'ABSENT').length
  const late = records.filter((record) => record.finalStatus === 'LATE').length
  const halfDay = records.filter((record) => record.finalStatus === 'HALF_DAY').length
  const onLeave = records.filter((record) => record.finalStatus === 'ON_LEAVE').length
  const attendanceRate = total > 0 ? Math.round(((present + late + halfDay) / total) * 100) : 0

  return {
    total,
    present,
    absent,
    late,
    halfDay,
    onLeave,
    attendanceRate,
  }
}

function normalizeEmployeeSummary(summary = {}, records = []) {
  const calculated = calculateSummary(records)

  return {
    presentDays: summary.present_days ?? summary.presentDays ?? calculated.present,
    absentDays: summary.absent_days ?? summary.absentDays ?? calculated.absent,
    lateArrival: summary.late_arrival ?? summary.lateArrival ?? summary.late ?? calculated.late,
    attendanceRate:
      summary.attendance_rate ?? summary.attendanceRate ?? calculated.attendanceRate,
  }
}

function normalizeTeamSummary(summary = {}, records = []) {
  const calculated = calculateSummary(records)

  return {
    totalMembers:
      summary.total_members ??
      summary.total_employees ??
      summary.totalMembers ??
      summary.total ??
      calculated.total,

    presentToday:
      summary.present_today ??
      summary.presentToday ??
      summary.present ??
      calculated.present,

    absentToday:
      summary.absent_today ??
      summary.absentToday ??
      summary.absent ??
      calculated.absent,

    lateArrival:
      summary.late_today ??
      summary.late_arrival ??
      summary.lateArrival ??
      summary.late ??
      calculated.late,
  }
}

function normalizeCompanySummary(summary = {}, records = []) {
  const calculated = calculateSummary(records)

  return {
    totalEmployees:
      summary.total_employees ??
      calculated.total,

    presentToday:
      summary.present_today ??
      calculated.present,

    absent:
      summary.absent_today ??
      calculated.absent,

    late:
      summary.late_today ??
      calculated.late,
  }
}

function normalizeAlert(alert = {}) {
  return {
    id: alert.employee_id || alert.employeeId || alert.id || alert.user_id || alert.name,
    name: getEmployeeName(alert),
    department: alert.department || alert.user?.department || '-',
    issue: formatStatusLabel(alert.issue || alert.final_status || alert.status),
    reliability:
      alert.reliability ||
      alert.attendance_reliability ||
      alert.attendanceReliability ||
      '-',
  }
}

function normalizeAlerts(data) {
  const payload = unwrapAttendanceResponse(data)
  const alerts = payload.alerts || payload.attendance_alerts || payload.attendanceAlerts || []

  return Array.isArray(alerts) ? alerts.map(normalizeAlert) : []
}

function normalizeTrendPoint(point = {}, index) {
  return {
    label: point.label || point.month || point.week || String(index + 1),
    value: Number(point.value ?? point.attendance_rate ?? point.attendanceRate ?? 0),
  }
}

function normalizeTrendData(data) {
  const payload = unwrapAttendanceResponse(data)
  const trends = payload.trends || payload.graph || payload.chart || {}
  const monthly = trends.monthly || payload.monthly || payload.monthly_graph || []
  const weekly = trends.weekly || payload.weekly || payload.weekly_graph || {}

  return {
    monthlyTrend: Array.isArray(monthly) ? monthly.map(normalizeTrendPoint) : [],
    weeklyTrend: Object.entries(weekly).reduce((accumulator, [key, value]) => {
      accumulator[key] = Array.isArray(value) ? value.map(normalizeTrendPoint) : []
      return accumulator
    }, {}),
  }
}

function mapRecordsByDay(records = []) {
  return records.reduce((accumulator, record) => {
    const rawDate = record.rawDate || record.date
    const date = new Date(rawDate)

    if (!Number.isNaN(date.getTime())) {
      accumulator[date.getDate()] = record
    }

    return accumulator
  }, {})
}

function toDateInputValue(date) {
  return date.toISOString().slice(0, 10)
}

function getMonthDateRange(date) {
  const start = new Date(date.getFullYear(), date.getMonth(), 1)
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0)

  return {
    startDate: toDateInputValue(start),
    endDate: toDateInputValue(end),
  }
}

export {
  calculateSummary,
  formatLocalDate,
  formatLocalTime,
  formatStatusLabel,
  getAttendanceResults,
  getMonthDateRange,
  mapRecordsByDay,
  normalizeAlerts,
  normalizeAttendanceRecord,
  normalizeBreakSession,
  normalizeCompanySummary,
  normalizeEmployeeSummary,
  normalizeTeamSummary,
  normalizeTrendData,
}
