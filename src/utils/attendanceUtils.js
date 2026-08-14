const STATUS_BUCKETS = {
  PRESENT: 'present',
  LATE: 'late',
  HALF_DAY: 'halfDay',
  ABSENT: 'absent',
  ON_LEAVE: 'onLeave',
}

const attendanceDayFormatter = new Intl.DateTimeFormat('en-US', {
  day: '2-digit',
  month: 'short',
})

function toDateInputValue(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function getTodayDateInput(referenceDate = new Date()) {
  return toDateInputValue(referenceDate)
}

function getDefaultAttendanceDateRange(referenceDate = new Date()) {
  const start = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1)
  const end = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0)

  return {
    startDate: toDateInputValue(start),
    endDate: toDateInputValue(end),
  }
}

function parseAttendanceDateInput(dateInput) {
  if (!dateInput) return null

  const parsedDate = new Date(`${dateInput}T00:00:00`)
  if (Number.isNaN(parsedDate.getTime())) {
    return null
  }

  return parsedDate
}

function getAttendanceWeekRange(referenceDateInput) {
  const referenceDate = parseAttendanceDateInput(referenceDateInput)
  if (!referenceDate) {
    return { startDate: null, endDate: null }
  }

  const dayOffset = (referenceDate.getDay() + 6) % 7
  const start = new Date(referenceDate)
  start.setDate(referenceDate.getDate() - dayOffset)

  const end = new Date(start)
  end.setDate(start.getDate() + 6)

  return {
    startDate: toDateInputValue(start),
    endDate: toDateInputValue(end),
  }
}

function getAttendanceMonthRange(referenceDateInput) {
  const referenceDate = parseAttendanceDateInput(referenceDateInput)
  if (!referenceDate) {
    return { startDate: null, endDate: null }
  }

  const start = new Date(referenceDate.getFullYear(), referenceDate.getMonth(), 1)
  const end = new Date(referenceDate.getFullYear(), referenceDate.getMonth() + 1, 0)

  return {
    startDate: toDateInputValue(start),
    endDate: toDateInputValue(end),
  }
}

function normalizeAttendanceStatus(value = '') {
  return String(value || '')
    .trim()
    .toUpperCase()
    .replace(/[\s-]+/g, '_')
}

function getAttendanceStatusBucket(status = '') {
  const normalized = normalizeAttendanceStatus(status)

  if (normalized === 'LEAVE') {
    return 'onLeave'
  }

  return STATUS_BUCKETS[normalized] || null
}

function getAttendanceDateKey(record = {}) {
  const rawValue =
    record.rawDate ||
    record.date ||
    record.attendance_date ||
    record.attendanceDate ||
    record.work_date ||
    record.workDate ||
    ''

  if (!rawValue) return ''

  const stringValue = String(rawValue)

  if (/^\d{4}-\d{2}-\d{2}/.test(stringValue)) {
    return stringValue.slice(0, 10)
  }

  const parsedDate = new Date(stringValue)
  if (Number.isNaN(parsedDate.getTime())) {
    return ''
  }

  return toDateInputValue(parsedDate)
}

function formatAttendanceDateLabel(dateKey) {
  if (!dateKey) return '-'

  const parsedDate = new Date(`${dateKey}T00:00:00`)
  if (Number.isNaN(parsedDate.getTime())) {
    return dateKey
  }

  return attendanceDayFormatter.format(parsedDate)
}

function getAttendanceEmployeeKey(record = {}) {
  const user = record.user || record.employee || {}

  return (
    record.userId ||
    record.user_id ||
    record.employeeId ||
    record.employee_id ||
    user.id ||
    record.id ||
    `${record.name || 'employee'}-${getAttendanceDateKey(record)}`
  )
}

function getAttendanceDepartment(record = {}) {
  return record.department || record.user?.department || record.employee?.department || ''
}

function filterAttendanceRecordsByDepartment(records = [], department = 'All Departments') {
  if (!department || department === 'All Departments') {
    return records
  }

  return records.filter((record) => getAttendanceDepartment(record) === department)
}

function filterAttendanceAlertsByDepartment(alerts = [], department = 'All Departments') {
  if (!department || department === 'All Departments') {
    return alerts
  }

  return alerts.filter((alert) => alert.department === department)
}

function getAttendanceDepartmentOptions(records = []) {
  return [...new Set(records
    .map((record) => getAttendanceDepartment(record))
    .filter((department) => department && department !== '-'))].sort((left, right) =>
    left.localeCompare(right)
  )
}

function groupAttendanceByDate(records = []) {
  const groupedAttendance = new Map()

  records.forEach((record) => {
    const dateKey = getAttendanceDateKey(record)
    if (!dateKey) return

    if (!groupedAttendance.has(dateKey)) {
      groupedAttendance.set(dateKey, {
        dateKey,
        label: formatAttendanceDateLabel(dateKey),
        present: 0,
        late: 0,
        halfDay: 0,
        absent: 0,
        onLeave: 0,
        totalEmployees: 0,
        employeeKeys: new Set(),
      })
    }

    const dayGroup = groupedAttendance.get(dateKey)
    const employeeKey = getAttendanceEmployeeKey(record)
    const statusBucket = getAttendanceStatusBucket(record.finalStatus)

    if (!dayGroup.employeeKeys.has(employeeKey)) {
      dayGroup.employeeKeys.add(employeeKey)
      dayGroup.totalEmployees += 1
    }

    if (statusBucket) {
      dayGroup[statusBucket] += 1
    }
  })

  return [...groupedAttendance.values()]
    .sort((left, right) => left.dateKey.localeCompare(right.dateKey))
    .map((dayGroup) => {
      const nextGroup = { ...dayGroup }
      delete nextGroup.employeeKeys
      return nextGroup
    })
}

function buildAttendanceChartData(groupedAttendance = []) {
  const maxEmployees = groupedAttendance.reduce(
    (maximum, dayGroup) => Math.max(maximum, dayGroup.totalEmployees),
    0
  )

  return groupedAttendance.map((dayGroup) => {
    const attendanceRate =
      dayGroup.totalEmployees > 0
        ? Math.round((((dayGroup.present + dayGroup.late + dayGroup.halfDay) / dayGroup.totalEmployees) * 100) * 10) / 10
        : 0

    return {
      ...dayGroup,
      maxEmployees,
      attendanceRate,
      totalStackedCount:
        dayGroup.present + dayGroup.late + dayGroup.halfDay + dayGroup.absent + dayGroup.onLeave,
    }
  })
}

function calculateAttendanceAnalytics(groupedAttendance = []) {
  if (groupedAttendance.length === 0) {
    return {
      averageAttendancePercent: 0,
      highestAttendanceDay: null,
      lowestAttendanceDay: null,
      totalWorkingDays: 0,
      averageLateEmployeesPerDay: 0,
    }
  }

  const attendanceRates = groupedAttendance.map((dayGroup) => dayGroup.attendanceRate)
  const lateCounts = groupedAttendance.map((dayGroup) => dayGroup.late)
  const averageAttendancePercent =
    attendanceRates.reduce((sum, rate) => sum + rate, 0) / attendanceRates.length
  const averageLateEmployeesPerDay =
    lateCounts.reduce((sum, count) => sum + count, 0) / lateCounts.length

  const highestAttendanceDay = groupedAttendance.reduce((highest, dayGroup) => {
    if (!highest || dayGroup.attendanceRate > highest.attendanceRate) {
      return dayGroup
    }

    return highest
  }, null)

  const lowestAttendanceDay = groupedAttendance.reduce((lowest, dayGroup) => {
    if (!lowest || dayGroup.attendanceRate < lowest.attendanceRate) {
      return dayGroup
    }

    return lowest
  }, null)

  return {
    averageAttendancePercent: Math.round(averageAttendancePercent * 10) / 10,
    highestAttendanceDay: highestAttendanceDay
      ? {
          label: highestAttendanceDay.label,
          attendanceRate: highestAttendanceDay.attendanceRate,
        }
      : null,
    lowestAttendanceDay: lowestAttendanceDay
      ? {
          label: lowestAttendanceDay.label,
          attendanceRate: lowestAttendanceDay.attendanceRate,
        }
      : null,
    totalWorkingDays: groupedAttendance.length,
    averageLateEmployeesPerDay: Math.round(averageLateEmployeesPerDay * 10) / 10,
  }
}

function calculateAttendanceSummary(records = [], scope = 'company') {
  const uniqueEmployees = new Set(records.map(getAttendanceEmployeeKey).filter(Boolean)).size

  const counts = records.reduce(
    (accumulator, record) => {
      const status = normalizeAttendanceStatus(record.finalStatus)

      if (status === 'PRESENT') accumulator.present += 1
      if (status === 'ABSENT') accumulator.absent += 1
      if (status === 'LATE') accumulator.late += 1

      return accumulator
    },
    { present: 0, absent: 0, late: 0 }
  )

  if (scope === 'team') {
    return {
      totalMembers: uniqueEmployees,
      presentToday: counts.present,
      absentToday: counts.absent,
      lateArrival: counts.late,
    }
  }

  return {
    totalEmployees: uniqueEmployees,
    presentToday: counts.present,
    absent: counts.absent,
    late: counts.late,
  }
}

function compareAttendanceDateValues(left = {}, right = {}) {
  const leftDate = new Date(`${getAttendanceDateKey(left)}T00:00:00`)
  const rightDate = new Date(`${getAttendanceDateKey(right)}T00:00:00`)

  return leftDate.getTime() - rightDate.getTime()
}

function collapseAttendanceToLatestPerEmployee(records = []) {
  const latestRecords = new Map()

  records.forEach((record) => {
    const key = getAttendanceEmployeeKey(record)
    if (!key) return

    const currentRecord = latestRecords.get(key)

    if (!currentRecord || compareAttendanceDateValues(currentRecord, record) <= 0) {
      latestRecords.set(key, record)
    }
  })

  return [...latestRecords.values()].sort((left, right) =>
    String(getAttendanceEmployeeKey(left)).localeCompare(String(getAttendanceEmployeeKey(right)))
  )
}

function getAttendanceDateRange(records = []) {
  const dateKeys = records
    .map((record) => getAttendanceDateKey(record))
    .filter(Boolean)
    .sort()

  if (dateKeys.length === 0) {
    return { startDate: null, endDate: null }
  }

  return {
    startDate: dateKeys[0],
    endDate: dateKeys[dateKeys.length - 1],
  }
}

function formatAttendanceTrendLabel(dateKey, formatterOptions = {}) {
  const parsedDate = new Date(`${dateKey}T00:00:00`)
  if (Number.isNaN(parsedDate.getTime())) return dateKey

  return new Intl.DateTimeFormat('en-US', formatterOptions).format(parsedDate)
}

function getAttendanceDayIndex(dateKey) {
  const parsedDate = new Date(`${dateKey}T00:00:00`)
  if (Number.isNaN(parsedDate.getTime())) return 0
  return parsedDate.getDay()
}

function buildAttendanceTrendData(records = [], range = {}) {
  const groupedByDate = groupAttendanceByDate(records)

  if (groupedByDate.length === 0) {
    return {
      weekly: [],
      monthly: [],
    }
  }

  const dailyPoints = groupedByDate.map((dayGroup) => ({
    dateKey: dayGroup.dateKey,
    label: dayGroup.label,
    rate:
      dayGroup.totalEmployees > 0
        ? Math.round(((dayGroup.present + dayGroup.late + dayGroup.halfDay) / dayGroup.totalEmployees) * 1000) / 10
        : 0,
    totalEmployees: dayGroup.totalEmployees,
  }))

  const weekdayOrder = [1, 2, 3, 4, 5, 6, 0]
  const weekdayLabels = {
    0: 'Sun',
    1: 'Mon',
    2: 'Tue',
    3: 'Wed',
    4: 'Thu',
    5: 'Fri',
    6: 'Sat',
  }

  const weeklyBuckets = weekdayOrder.map((dayIndex) => ({
    dayIndex,
    label: weekdayLabels[dayIndex],
    rates: [],
    employees: [],
  }))

  dailyPoints.forEach((point) => {
    const dayIndex = getAttendanceDayIndex(point.dateKey)
    const bucket = weeklyBuckets.find((entry) => entry.dayIndex === dayIndex)
    if (!bucket) return

    bucket.rates.push(point.rate)
    bucket.employees.push(point.totalEmployees)
  })

  const weekly = weeklyBuckets
    .map((bucket) => ({
      label: bucket.label,
      value:
        bucket.rates.length > 0
          ? Math.round((bucket.rates.reduce((sum, rate) => sum + rate, 0) / bucket.rates.length) * 10) / 10
          : 0,
      totalEmployees:
        bucket.employees.length > 0
          ? Math.round(bucket.employees.reduce((sum, employees) => sum + employees, 0) / bucket.employees.length)
          : 0,
      count: bucket.rates.length,
    }))

  const { startDate, endDate } = range
  const rangeStart = startDate ? new Date(`${startDate}T00:00:00`) : null
  const rangeEnd = endDate ? new Date(`${endDate}T00:00:00`) : null
  let monthly

  if (rangeStart && rangeEnd && rangeStart.getMonth() === rangeEnd.getMonth() && rangeStart.getFullYear() === rangeEnd.getFullYear()) {
    const weekMap = new Map()

    dailyPoints.forEach((point) => {
      const day = new Date(`${point.dateKey}T00:00:00`)
      const weekIndex = Math.floor((day.getDate() - 1) / 7) + 1
      const label = `Week ${weekIndex}`

      if (!weekMap.has(label)) {
        weekMap.set(label, { label, rates: [], employees: [] })
      }

      const bucket = weekMap.get(label)
      bucket.rates.push(point.rate)
      bucket.employees.push(point.totalEmployees)
    })

    monthly = [...weekMap.values()].map((bucket) => ({
      label: bucket.label,
      value:
        bucket.rates.length > 0
          ? Math.round((bucket.rates.reduce((sum, rate) => sum + rate, 0) / bucket.rates.length) * 10) / 10
          : 0,
      totalEmployees:
        bucket.employees.length > 0
          ? Math.round(bucket.employees.reduce((sum, employees) => sum + employees, 0) / bucket.employees.length)
          : 0,
      count: bucket.rates.length,
    }))
  } else {
    const monthMap = new Map()

    dailyPoints.forEach((point) => {
      const monthLabel = formatAttendanceTrendLabel(point.dateKey, {
        month: 'short',
      })

      if (!monthMap.has(monthLabel)) {
        monthMap.set(monthLabel, { label: monthLabel, rates: [], employees: [] })
      }

      const bucket = monthMap.get(monthLabel)
      bucket.rates.push(point.rate)
      bucket.employees.push(point.totalEmployees)
    })

    monthly = [...monthMap.values()].map((bucket) => ({
      label: bucket.label,
      value:
        bucket.rates.length > 0
          ? Math.round((bucket.rates.reduce((sum, rate) => sum + rate, 0) / bucket.rates.length) * 10) / 10
          : 0,
      totalEmployees:
        bucket.employees.length > 0
          ? Math.round(bucket.employees.reduce((sum, employees) => sum + employees, 0) / bucket.employees.length)
          : 0,
      count: bucket.rates.length,
    }))
  }

  return {
    weekly,
    monthly,
  }
}

function getAttendanceStatusOptions() {
  return ['All', 'Present', 'Late', 'Half Day', 'Absent', 'On Leave']
}

export {
  buildAttendanceChartData,
  buildAttendanceTrendData,
  calculateAttendanceAnalytics,
  calculateAttendanceSummary,
  collapseAttendanceToLatestPerEmployee,
  compareAttendanceDateValues,
  filterAttendanceAlertsByDepartment,
  filterAttendanceRecordsByDepartment,
  getAttendanceDateKey,
  getAttendanceDateRange,
  getAttendanceDepartmentOptions,
  getAttendanceMonthRange,
  getAttendanceWeekRange,
  getAttendanceStatusOptions,
  getDefaultAttendanceDateRange,
  getTodayDateInput,
  groupAttendanceByDate,
  parseAttendanceDateInput,
  normalizeAttendanceStatus,
  formatAttendanceDateLabel,
  formatAttendanceTrendLabel,
}
