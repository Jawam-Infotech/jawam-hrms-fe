import { useCallback, useContext, useEffect, useState } from 'react'
import { UserContext } from '../context/UserContext.jsx'
import { getMyProfile } from '../services/profileService.js'
import { getPersonalCelebrations, istDateKey } from '../services/celebrationService.js'

const shownCelebrations = new Set()
const INDIA_OFFSET_MINUTES = 330

function nextISTMidnight(dateKey, now = new Date()) {
  const [year, month, day] = dateKey.split('-').map(Number)
  const nextDay = new Date(Date.UTC(year, month - 1, day + 1))
  const target = Date.UTC(nextDay.getUTCFullYear(), nextDay.getUTCMonth(), nextDay.getUTCDate()) - INDIA_OFFSET_MINUTES * 60 * 1000
  return Math.max(1000, target - now.getTime())
}

function useCelebrations() {
  const { user } = useContext(UserContext)
  const [profile, setProfile] = useState(null)
  const [dateKey, setDateKey] = useState(() => istDateKey())
  const [activeCelebration, setActiveCelebration] = useState(null)
  const [, setPendingCelebrations] = useState([])
  const [loading, setLoading] = useState(Boolean(user?.id))
  const [error, setError] = useState('')

  useEffect(() => {
    let timerId
    const schedule = () => {
      const currentDateKey = istDateKey()
      const delay = currentDateKey ? nextISTMidnight(currentDateKey) : 60 * 60 * 1000
      timerId = window.setTimeout(() => {
        setDateKey(istDateKey())
        schedule()
      }, delay)
    }

    schedule()
    return () => window.clearTimeout(timerId)
  }, [])

  useEffect(() => {
    let active = true
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProfile(null)
    setActiveCelebration(null)
    setPendingCelebrations([])

    if (!user?.id) {
      setLoading(false)
      return undefined
    }

    setLoading(true)
    setError('')
    getMyProfile(user.id)
      .then((nextProfile) => {
        if (active) setProfile(nextProfile)
      })
      .catch(() => {
        if (active) setError('Unable to load celebration details.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [user?.id])

  useEffect(() => {
    if (!profile || !dateKey) return
    const celebrations = getPersonalCelebrations(profile, dateKey)
      .filter((celebration) => !shownCelebrations.has(celebration.id))

    if (celebrations.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveCelebration(null)
      setPendingCelebrations([])
      return
    }

    const [first, ...rest] = celebrations
    shownCelebrations.add(first.id)
    setActiveCelebration(first)
    setPendingCelebrations(rest)
  }, [profile, dateKey])

  const closeCelebration = useCallback(() => {
    setPendingCelebrations((currentQueue) => {
      const [next, ...rest] = currentQueue
      if (next) {
        shownCelebrations.add(next.id)
        setActiveCelebration(next)
      } else {
        setActiveCelebration(null)
      }
      return rest
    })
  }, [])

  const currentEmployeeId = String(user?.id || '')
  const visibleCelebration = activeCelebration && activeCelebration.employeeId === currentEmployeeId

  return {
    activeCelebration: visibleCelebration ? activeCelebration : null,
    isModalOpen: Boolean(visibleCelebration),
    closeCelebration,
    loading,
    error,
  }
}

export { nextISTMidnight, shownCelebrations }
export default useCelebrations
