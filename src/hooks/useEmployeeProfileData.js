import { useCallback, useEffect, useState } from 'react'
import {
  getEmployeeById,
  getManagers,
} from '../services/employeeService.js'
import { getApiErrorMessage } from '../utils/apiErrorMessage.js'

function useEmployeeProfileData(userId) {
  const [employee, setEmployee] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadProfile = useCallback(async () => {
    if (!userId) {
      setLoading(false)
      setError('Unable to identify the logged-in user.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const [employeeData, managers] =
        await Promise.all([
          getEmployeeById(userId),
          getManagers(),
        ])

      const reportingManager =
        managers.find(
          (manager) =>
            manager.id ===
            employeeData.reporting_manager
        )

      setEmployee({
        ...employeeData,
        reportingManager:
          reportingManager?.label || 'N/A',
      })
    } catch (loadError) {
      setError(
        getApiErrorMessage(
          loadError,
          'Failed to load profile.'
        )
      )
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProfile()
  }, [loadProfile])

  return {
    employee,
    loading,
    error,
    refreshProfile: loadProfile,
  }
}

export default useEmployeeProfileData