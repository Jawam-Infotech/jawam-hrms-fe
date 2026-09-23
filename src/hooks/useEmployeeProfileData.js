import { useCallback, useEffect, useState } from 'react'
import { fetchAssetAssignments } from '../services/assetService.js'
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
      setError('Unable to identify the employee.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const [
        employeeData,
        managers,
        assignments,
      ] = await Promise.all([
        getEmployeeById(userId),
        getManagers(),
        fetchAssetAssignments(),
      ])

      const reportingManager =
        managers.find(
          (manager) =>
            manager.id ===
            employeeData.reporting_manager,
        )

      const employeeAssets =
        assignments
          .filter(
            (assignment) =>
              String(assignment?.employee) ===
                String(userId) &&
              String(
                assignment?.status || '',
              ).toUpperCase() === 'ACTIVE',
          )
          .map((assignment) => ({
            id: assignment.id,
            asset: assignment.asset,
            asset_tag: assignment.asset_tag,
            asset_type_name:
              assignment.asset_type_name,
            serial_number:
              assignment.serial_number || null,
            status: assignment.status,
          }))

      setEmployee({
        ...employeeData,
        assets: employeeAssets,
        reportingManager:
          reportingManager?.label || 'N/A',
      })
    } catch (loadError) {
      setError(
        getApiErrorMessage(
          loadError,
          'Failed to load profile.',
        ),
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