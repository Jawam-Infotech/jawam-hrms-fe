const INDIA_TIME_ZONE = 'Asia/Kolkata'

function isValidCalendarDate(year, month, day) {
  if (![year, month, day].every(Number.isInteger) || month < 1 || month > 12 || day < 1 || day > 31) return false
  const date = new Date(Date.UTC(year, month - 1, day))
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
}

function calendarDate(value) {
  if (!value) return null

  const stringValue = String(value)
  const dateOnlyMatch = stringValue.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (dateOnlyMatch) {
    const parts = dateOnlyMatch.slice(1).map(Number)
    return isValidCalendarDate(...parts) ? { year: parts[0], month: parts[1], day: parts[2] } : null
  }

  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return null

  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: INDIA_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date)
  const values = Object.fromEntries(parts.map(({ type, value: partValue }) => [type, partValue]))
  const result = { year: Number(values.year), month: Number(values.month), day: Number(values.day) }
  return isValidCalendarDate(result.year, result.month, result.day) ? result : null
}

function compareCalendarDates(first, second) {
  const firstValue = Date.UTC(first.year, first.month - 1, first.day)
  const secondValue = Date.UTC(second.year, second.month - 1, second.day)
  return firstValue === secondValue ? 0 : firstValue < secondValue ? -1 : 1
}

function isBirthdayToday(dateOfBirth, today = new Date()) {
  const birthDate = calendarDate(dateOfBirth)
  const currentDate = calendarDate(today)
  return Boolean(birthDate && currentDate && birthDate.month === currentDate.month && birthDate.day === currentDate.day)
}

function getCompletedYears(joiningDate, today = new Date()) {
  const joined = calendarDate(joiningDate)
  const current = calendarDate(today)
  if (!joined || !current || compareCalendarDates(current, joined) < 0) return 0

  let years = current.year - joined.year
  const anniversaryThisYear = { year: current.year, month: joined.month, day: joined.day }
  if (compareCalendarDates(current, anniversaryThisYear) < 0) years -= 1
  return Math.max(0, years)
}

function isWorkAnniversaryToday(joiningDate, today = new Date()) {
  const joined = calendarDate(joiningDate)
  const current = calendarDate(today)
  return Boolean(joined && current && getCompletedYears(joiningDate, today) >= 1 && joined.month === current.month && joined.day === current.day)
}

function isEligibleForCelebration(employmentStatus) {
  return ['ACTIVE', 'ON_NOTICE'].includes(String(employmentStatus || '').trim().toUpperCase())
}

export { isBirthdayToday, getCompletedYears, isWorkAnniversaryToday, isEligibleForCelebration }
