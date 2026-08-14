import { useCallback, useEffect, useState } from 'react'
import { getTeamAttendance } from '../services/attendanceService.js'

function useTeamAttendance() {
  const [summary, setSummary] = useState({
    totalMembers: 0,
    presentToday: 0,
    absentToday: 0,
    lateArrival: 0,
  })
  const [records, setRecords] = useState([])
  const [alerts, setAlerts] = useState([])
  const [monthlyTrend, setMonthlyTrend] = useState([])
  const [weeklyTrend, setWeeklyTrend] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  

  const loadAttendance = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await getTeamAttendance()
      setRecords(response.records)
      setSummary(response.summary)
      setAlerts(response.alerts)
      setMonthlyTrend(response.monthlyTrend)
      setWeeklyTrend(response.weeklyTrend)
    } catch (err) {
      setRecords([])
      setError(err)
      setAlerts([])
      setMonthlyTrend([])
      setWeeklyTrend({})
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadAttendance()
  }, [loadAttendance])

  return {
    records,
    summary,
    alerts,
    monthlyTrend,
    weeklyTrend,
    loading,
    error,
    refreshAttendance: loadAttendance,
  }
}

export default useTeamAttendance
