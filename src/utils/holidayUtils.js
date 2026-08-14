function toHolidayInputDate(value) {
  if (!value) {
    return ''
  }

  const parsedDate = value instanceof Date ? value : new Date(value)

  if (Number.isNaN(parsedDate.getTime())) {
    return ''
  }

  const year = parsedDate.getFullYear()
  const month = String(parsedDate.getMonth() + 1).padStart(2, '0')
  const day = String(parsedDate.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

const holidayDateFormatter = new Intl.DateTimeFormat('en-US', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

function formatHolidayDate(value) {
  const inputValue = toHolidayInputDate(value)

  if (!inputValue) {
    return '-'
  }

  const parsedDate = new Date(`${inputValue}T00:00:00`)

  if (Number.isNaN(parsedDate.getTime())) {
    return '-'
  }

  return holidayDateFormatter.format(parsedDate)
}

function normalizeHolidayRecord(record = {}) {
  return {
    id:
      record.id ||
      record.holidayId ||
      `holiday-${record.holidayName || record.name || 'holiday'}-${record.holidayDate || record.date || ''}`,

    holidayName:
      record.holidayName ||
      record.name ||
      '',

    holidayDate: toHolidayInputDate(
      record.holidayDate ||
      record.holiday_date ||
      record.date
    ),

    createdBy:
  typeof record.created_by === 'object'
    ? `${record.created_by?.first_name || ''} ${record.created_by?.last_name || ''}`.trim()
    : record.createdBy ||
      record.created_by_name ||
      record.created_by ||
      '',

    createdAt:
      record.createdAt ||
      record.created_at ||
      '',
  }
}

function getHolidayDateKey(value) {
  return toHolidayInputDate(value)
}

function buildHolidayMap(holidays = []) {
  return holidays.reduce((accumulator, holiday) => {
    if (holiday?.holidayDate) {
      accumulator[holiday.holidayDate] = holiday
    }

    return accumulator
  }, {})
}

export {
  buildHolidayMap,
  formatHolidayDate,
  getHolidayDateKey,
  normalizeHolidayRecord,
  toHolidayInputDate,
}