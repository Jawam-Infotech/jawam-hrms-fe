const INDIA_TIME_ZONE = 'Asia/Kolkata'

function parseCalendarDate(value) {
  if (!value) return null
  const stringValue = String(value)
  const match = stringValue.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  const parts = match
    ? match.slice(1).map(Number)
    : (() => {
        const date = value instanceof Date ? value : new Date(value)
        if (Number.isNaN(date.getTime())) return null
        const formatted = new Intl.DateTimeFormat('en-CA', {
          timeZone: INDIA_TIME_ZONE,
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }).formatToParts(date)
        const values = Object.fromEntries(formatted.map(({ type, value: part }) => [type, Number(part)]))
        return [values.year, values.month, values.day]
      })()

  if (!parts || parts.some((part) => !Number.isInteger(part))) return null
  const [year, month, day] = parts
  const calendarDate = new Date(Date.UTC(year, month - 1, day))
  return calendarDate.getUTCFullYear() === year && calendarDate.getUTCMonth() === month - 1 && calendarDate.getUTCDate() === day
    ? { year, month, day }
    : null
}

function getCompanyTenure(employee = {}, today = new Date()) {
  const joiningDate = parseCalendarDate(employee.joiningDate || employee.date_of_joining || employee.dateOfJoining)
  if (!joiningDate) return null

  const status = String(employee.employmentStatus || employee.employment_status || '').trim().toUpperCase()
  let endDateValue = today
  if (status === 'EXIT_PENDING') endDateValue = employee.lastWorkingDate || employee.last_working_date
  if (status === 'EXITED') endDateValue = employee.exitDate || employee.exit_date
  if (['EXIT_PENDING', 'EXITED'].includes(status) && !endDateValue) return null

  const endDate = parseCalendarDate(endDateValue)
  if (!endDate) return null
  const joiningIndex = joiningDate.year * 12 + joiningDate.month - 1
  const endIndex = endDate.year * 12 + endDate.month - 1
  if (endIndex < joiningIndex || (endIndex === joiningIndex && endDate.day < joiningDate.day)) return null

  let years = endDate.year - joiningDate.year
  if (endDate.month < joiningDate.month || (endDate.month === joiningDate.month && endDate.day < joiningDate.day)) years -= 1
  years = Math.max(0, years)
  let months = endIndex - (joiningIndex + years * 12)
  if (endDate.day < joiningDate.day) months -= 1
  months = Math.max(0, Math.min(11, months))

  return { years, months, label: `${years} yrs ${months} mos` }
}

export { getCompanyTenure }
