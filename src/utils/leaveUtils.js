function toDate(value) {
  if (!value) return null

  const stringValue = String(value)

  /*
   * Date-only value:
   * 2026-08-30
   *
   * Parse it as local midnight so date
   * formatting does not shift because of UTC.
   */
  if (/^\d{4}-\d{2}-\d{2}$/.test(stringValue)) {
    const date = new Date(
      `${stringValue}T00:00:00`,
    )

    return Number.isNaN(date.getTime())
      ? null
      : date
  }

  /*
   * Timestamp / ISO date:
   * 2026-08-30T10:30:00Z
   */
  const date = new Date(stringValue)

  return Number.isNaN(date.getTime())
    ? null
    : date
}


/*
 * =========================
 * DATE FORMATTING
 * =========================
 */

function formatLeaveDate(value) {
  const date = toDate(value)

  if (!date) return '--'

  return new Intl.DateTimeFormat(
    'en-US',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    },
  ).format(date)
}


function formatLeaveDates(
  startDate,
  endDate,
) {
  if (!startDate && !endDate) {
    return '--'
  }

  if (
    startDate &&
    endDate &&
    startDate === endDate
  ) {
    return formatLeaveDate(startDate)
  }

  return `${formatLeaveDate(startDate)} – ${formatLeaveDate(endDate)}`
}


function formatShortLeaveDate(value) {
  const date = toDate(value)

  if (!date) return '--'

  return new Intl.DateTimeFormat(
    'en-US',
    {
      day: 'numeric',
      month: 'short',
    },
  ).format(date)
}


function formatApprovedLeaveDates(
  dates = [],
) {
  if (
    !Array.isArray(dates) ||
    dates.length === 0
  ) {
    return '--'
  }

  const formattedDates = dates
    .map((date) =>
      formatShortLeaveDate(date),
    )
    .filter(
      (date) => date !== '--',
    )

  return formattedDates.length > 0
    ? formattedDates.join(', ')
    : '--'
}


/*
 * =========================
 * LEAVE DAY CALCULATION
 * =========================
 */

function calculateLeaveDays(
  startDate,
  endDate,
) {
  const start = toDate(startDate)
  const end = toDate(endDate)

  if (
    !start ||
    !end ||
    end < start
  ) {
    return 0
  }

  return (
    Math.floor(
      (end.getTime() -
        start.getTime()) /
        86_400_000,
    ) + 1
  )
}


/*
 * =========================
 * LEAVE DATE LIST
 * =========================
 */

function getLeaveDates(
  startDate,
  endDate,
) {
  const start = toDate(startDate)
  const end = toDate(endDate)

  if (
    !start ||
    !end ||
    end < start
  ) {
    return []
  }

  const dates = []
  const current = new Date(start)

  while (current <= end) {
    const year =
      current.getFullYear()

    const month = String(
      current.getMonth() + 1,
    ).padStart(2, '0')

    const day = String(
      current.getDate(),
    ).padStart(2, '0')

    dates.push(
      `${year}-${month}-${day}`,
    )

    current.setDate(
      current.getDate() + 1,
    )
  }

  return dates
}


/*
 * =========================
 * FILTER LEAVE REQUESTS
 * =========================
 */

function filterLeaveRequests(
  requests,
  {
    search = '',
    status = 'All',
    leaveType = 'All',
  } = {},
) {
  if (!Array.isArray(requests)) {
    return []
  }

  const normalizedSearch =
    search.trim().toLowerCase()

  return requests.filter(
    (request) => {
      const matchesSearch =
        !normalizedSearch ||
        [
          request.employeeName,
          request.leaveType,
          request.reason,
        ].some((value) =>
          String(value || '')
            .toLowerCase()
            .includes(
              normalizedSearch,
            ),
        )

      const matchesStatus =
        status === 'All' ||
        request.status === status

      const matchesLeaveType =
        leaveType === 'All' ||
        request.leaveType ===
          leaveType

      return (
        matchesSearch &&
        matchesStatus &&
        matchesLeaveType
      )
    },
  )
}


/*
 * =========================
 * SORT LEAVE REQUESTS
 * =========================
 */

function sortLeaveRequests(
  requests,
  sortBy = 'newest',
) {
  if (!Array.isArray(requests)) {
    return []
  }

  return [...requests].sort(
    (first, second) => {
      if (sortBy === 'employee') {
        return String(
          first.employeeName || '',
        ).localeCompare(
          String(
            second.employeeName || '',
          ),
        )
      }

      const firstDate =
        new Date(
          first.startDate,
        ).getTime()

      const secondDate =
        new Date(
          second.startDate,
        ).getTime()

      const comparison =
        firstDate - secondDate

      return sortBy === 'oldest'
        ? comparison
        : -comparison
    },
  )
}


export {
  calculateLeaveDays,
  filterLeaveRequests,
  formatApprovedLeaveDates,
  formatLeaveDate,
  formatLeaveDates,
  formatShortLeaveDate,
  getLeaveDates,
  sortLeaveRequests,
}