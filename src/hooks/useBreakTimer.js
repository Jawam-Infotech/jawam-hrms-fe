import { useEffect, useMemo, useState } from 'react'

function formatElapsedTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return [hours, minutes, seconds].map((value) => String(value).padStart(2, '0')).join(':')
}

function getElapsedSeconds(startTime, currentTime = Date.now()) {
  const startDate = new Date(startTime)

  if (Number.isNaN(startDate.getTime())) return 0

  return Math.max(0, Math.floor((currentTime - startDate.getTime()) / 1000))
}

function getCompletedBreakSeconds(attendance) {
  const breakSessions = attendance?.breakSessions || attendance?.break_sessions || []

  if (!Array.isArray(breakSessions)) return 0

  return breakSessions.reduce((total, session) => {
    const start = session.breakStart || session.break_start
    const end = session.breakEnd || session.break_end

    if (!start || !end) return total

    const startDate = new Date(start)
    const endDate = new Date(end)

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) return total

    return total + Math.floor((endDate - startDate) / 1000)
  }, 0)
}

function getActiveBreakSession(attendance) {
  const breakSessions = attendance?.breakSessions || attendance?.break_sessions || []

  if (!Array.isArray(breakSessions)) return null

  return breakSessions.find((session) => {
    const breakStart = session.breakStart || session.break_start
    const breakEnd = session.breakEnd || session.break_end

    return Boolean(breakStart) && !breakEnd
  }) || null
}

function useBreakTimer(attendance) {
  const activeBreak = useMemo(() => getActiveBreakSession(attendance), [attendance])
  const activeBreakStart = activeBreak?.breakStart || activeBreak?.break_start || ''
  const shouldRun = Boolean(activeBreakStart)
  const [currentTime, setCurrentTime] = useState(() => Date.now())

  const completedBreakSeconds = useMemo(
    () => getCompletedBreakSeconds(attendance),
    [attendance]
  )

  useEffect(() => {
    if (!shouldRun) return undefined

    const intervalId = window.setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)

    return () => window.clearInterval(intervalId)
  }, [shouldRun, activeBreakStart])

  if (!shouldRun) {
    return completedBreakSeconds > 0 ? formatElapsedTime(completedBreakSeconds) : ''
  }

  const runningBreakSeconds = getElapsedSeconds(activeBreakStart, currentTime)

  return formatElapsedTime(completedBreakSeconds + runningBreakSeconds)
}

export default useBreakTimer