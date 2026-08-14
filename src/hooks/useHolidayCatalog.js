import { useCallback, useEffect, useMemo, useState } from 'react'
import { HOLIDAY_UPDATED_EVENT } from '../constants/holiday.js'
import { getHolidays } from '../services/holidayService.js'
import { buildHolidayMap } from '../utils/holidayUtils.js'

function useHolidayCatalog() {
  const [holidays, setHolidays] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const refreshHolidays = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await getHolidays()
      setHolidays(response.records)
    } catch (err) {
      setHolidays([])
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    queueMicrotask(() => {
      if (!cancelled) {
        void refreshHolidays()
      }
    })

    const handleHolidayUpdate = () => {
      void refreshHolidays()
    }

    window.addEventListener(HOLIDAY_UPDATED_EVENT, handleHolidayUpdate)

    return () => {
      cancelled = true
      window.removeEventListener(HOLIDAY_UPDATED_EVENT, handleHolidayUpdate)
    }
  }, [refreshHolidays])

  const holidayMap = useMemo(() => buildHolidayMap(holidays), [holidays])

  return {
    holidays,
    holidayMap,
    loading,
    error,
    refreshHolidays,
  }
}

export { HOLIDAY_UPDATED_EVENT }
export default useHolidayCatalog
