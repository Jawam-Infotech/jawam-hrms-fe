import { useState, useEffect, useCallback } from 'react'
import {
  getEmployeeById,
  getManagers,
} from '../services/employeeService.js'

function useEmployeeProfile(employeeId) {
  const [employee, setEmployee] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadEmployee = useCallback(async () => {
    if (!employeeId) return

    setLoading(true)
    setError('')

    try {
      const [employeeData, managers] = await Promise.all([
        getEmployeeById(employeeId),
        getManagers(),
      ])

      const reportingManager = managers.find(
        (manager) => manager.id === employeeData.reporting_manager
      )

      setEmployee({
        ...employeeData,
        reportingManager: reportingManager?.label || 'N/A',
      })
    } catch (err) {
      setError(err.message || 'Failed to load employee.')
    } finally {
      setLoading(false)
    }
  }, [employeeId])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadEmployee()
  }, [loadEmployee])

  return {
    employee,
    loading,
    error,
    refreshEmployee: loadEmployee,
  }
}

export default useEmployeeProfile
