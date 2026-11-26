const INDIA_TIME_ZONE = 'Asia/Kolkata'
const INDIA_OFFSET = '+05:30'

function normalizeAnnouncement(announcement = {}) {
  return { ...announcement }
}

function normalizeAnnouncementList(response) {
  if (Array.isArray(response)) {
    return { count: response.length, next: null, previous: null, results: response.map(normalizeAnnouncement) }
  }

  return {
    count: Number(response?.count) || 0,
    next: response?.next ?? null,
    previous: response?.previous ?? null,
    results: Array.isArray(response?.results) ? response.results.map(normalizeAnnouncement) : [],
  }
}

function serializeISTDateTime(value) {
  if (!value) throw new Error('A visibility timestamp is required.')
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) throw new Error('Invalid visibility timestamp.')

  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: INDIA_TIME_ZONE,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit', hourCycle: 'h23',
  }).formatToParts(date)
  const values = Object.fromEntries(parts.map(({ type, value: part }) => [type, part]))
  return `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}:${values.second}${INDIA_OFFSET}`
}

function serializeISTInputDateTime(value) {
  if (!value || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(String(value))) {
    throw new Error('Invalid IST datetime-local value.')
  }
  return `${value}:00+05:30`
}

function isAnnouncementVisibleAt(announcement, value = new Date()) {
  const visibleFrom = new Date(announcement?.visible_from).getTime()
  const visibleUntil = new Date(announcement?.visible_until).getTime()
  const timestamp = value instanceof Date ? value.getTime() : new Date(value).getTime()
  if (![visibleFrom, visibleUntil, timestamp].every(Number.isFinite)) return false
  return timestamp >= visibleFrom && timestamp < visibleUntil
}

function validateVisibilityWindow(visibleFrom, visibleUntil) {
  const from = new Date(visibleFrom).getTime()
  const until = new Date(visibleUntil).getTime()
  return Number.isFinite(from) && Number.isFinite(until) && until > from
}

export {
  normalizeAnnouncement,
  normalizeAnnouncementList,
  serializeISTDateTime,
  serializeISTInputDateTime,
  isAnnouncementVisibleAt,
  validateVisibilityWindow,
}
