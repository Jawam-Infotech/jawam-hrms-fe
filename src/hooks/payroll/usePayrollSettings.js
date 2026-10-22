import { useCallback, useState } from 'react'
import {
  getPayrollSettings,
  createPayrollSettings,
} from '../../services/payrollService.js'

const INITIAL_SETTINGS = {
  results: [],
  count: 0,
  next: null,
  previous: null,
}

function usePayrollSettings() {
  const [settings, setSettings] = useState(INITIAL_SETTINGS)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [saveError, setSaveError] = useState(null)

  const fetchSettings = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const data = await getPayrollSettings()
      const normalized = {
        results: Array.isArray(data?.results) ? data.results : [],
        count: data?.count ?? 0,
        next: data?.next ?? null,
        previous: data?.previous ?? null,
      }
      setSettings(normalized)
      return normalized
    } catch (requestError) {
      setError(requestError)
      throw requestError
    } finally {
      setLoading(false)
    }
  }, [])

  const createSetting = useCallback(async (payload) => {
    setSaving(true)
    setSaveError(null)

    try {
      const data = await createPayrollSettings(payload)
      return data
    } catch (requestError) {
      setSaveError(requestError)
      throw requestError
    } finally {
      setSaving(false)
    }
  }, [])

  const clearSaveError = useCallback(() => setSaveError(null), [])

  return {
    settings: settings.results,
    pagination: {
      count: settings.count,
      next: settings.next,
      previous: settings.previous,
    },
    loading,
    saving,
    error,
    saveError,
    fetchSettings,
    createSetting,
    clearSaveError,
  }
}

export default usePayrollSettings
