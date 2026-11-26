import {
  getCompletedYears,
  isBirthdayToday,
  isEligibleForCelebration,
  isWorkAnniversaryToday,
} from '../utils/celebrationUtils.js'

const INDIA_TIME_ZONE = 'Asia/Kolkata'

function istDateKey(today = new Date()) {
  if (typeof today === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(today)) return today
  if (!(today instanceof Date) || Number.isNaN(today.getTime())) return null
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: INDIA_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(today)
}

function hasValidEmployeeId(profile) {
  return Boolean(String(profile?.id || profile?.user_id || '').trim())
}

function getPersonalCelebrations(profile = {}, today = new Date()) {
  if (!hasValidEmployeeId(profile) || !isEligibleForCelebration(profile.employmentStatus)) return []

  const dateKey = istDateKey(today)
  if (!dateKey) return []
  const employeeId = String(profile.id || profile.user_id || '').trim()
  const employeeName = profile.name || [profile.firstName, profile.lastName].filter(Boolean).join(' ') || profile.employeeName || ''
  const celebrations = []

  if (isBirthdayToday(profile.dateOfBirth, today)) {
    celebrations.push({
      id: `${employeeId}-BIRTHDAY-${dateKey}`,
      type: 'BIRTHDAY',
      employeeId,
      employeeName,
      celebrationDate: dateKey,
    })
  }

  if (isWorkAnniversaryToday(profile.dateOfJoining, today)) {
    celebrations.push({
      id: `${employeeId}-WORK_ANNIVERSARY-${dateKey}`,
      type: 'WORK_ANNIVERSARY',
      employeeId,
      employeeName,
      completedYears: getCompletedYears(profile.dateOfJoining, today),
      celebrationDate: dateKey,
    })
  }

  return celebrations
}

export { getPersonalCelebrations, hasValidEmployeeId, istDateKey }
