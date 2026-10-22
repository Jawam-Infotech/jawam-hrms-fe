
import { useCallback, useState } from 'react'
import { getEmployees } from '../../services/employeeService.js'
import { createSettlement, getSettlements, regenerateSettlement } from '../../services/settlementService.js'

function useFinalSettlementData(initialFilters = {}) {
  const [settlements, setSettlements] = useState([])
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  })
  const [filters, setFilters] = useState({
    page: 1,
    ...initialFilters,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [eligibleEmployees, setEligibleEmployees] = useState([])
  const [employeeLoading, setEmployeeLoading] = useState(false)
  const [employeeError, setEmployeeError] = useState(null)
  const [createLoading, setCreateLoading] = useState(false)
  const [createError, setCreateError] = useState(null)

  const fetchEligibleEmployees = useCallback(async (search = '') => {
    setEmployeeLoading(true)
    setEmployeeError(null)
    try {
      const data = await getEmployees({ page: 1, search })
      const eligible = data.employees.filter((employee) => (
        ['EXIT_PENDING', 'EXITED'].includes(String(employee.employmentStatus || '').toUpperCase()) &&
        Boolean(employee.lastWorkingDate)
      ))
      setEligibleEmployees(eligible)
      return eligible
    } catch (requestError) {
      setEmployeeError(requestError)
      throw requestError
    } finally {
      setEmployeeLoading(false)
    }
  }, [])

  const handleCreateSettlement = useCallback(async (employeeId) => {
    setCreateLoading(true)
    setCreateError(null)
    try {
      return await createSettlement(employeeId)
    } catch (requestError) {
      setCreateError(requestError)
      throw requestError
    } finally {
      setCreateLoading(false)
    }
  }, [])

  const handleRegenerateSettlement = useCallback(async (settlementId) => {
    setCreateLoading(true)
    setCreateError(null)
    try {
      return await regenerateSettlement(settlementId)
    } catch (requestError) {
      setCreateError(requestError)
      throw requestError
    } finally {
      setCreateLoading(false)
    }
  }, [])

  const fetchSettlements = useCallback(
    async (nextFilters = filters) => {
      setLoading(true)
      setError(null)

      try {
        const data = await getSettlements(nextFilters)

        setSettlements(data.settlements)
        setPagination({
          count: data.count,
          next: data.next,
          previous: data.previous,
        })

        return data
      } catch (requestError) {
        setError(requestError)
        throw requestError
      } finally {
        setLoading(false)
      }
    },
    [filters],
  )

  const changePage = useCallback((page) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      page,
    }))
  }, [])

  const refresh = useCallback(() => {
    return fetchSettlements()
  }, [fetchSettlements])

  return {
    settlements,
    pagination,
    filters,
    loading,
    error,
    fetchSettlements,
    changePage,
    refresh,
    eligibleEmployees,
    employeeLoading,
    employeeError,
    fetchEligibleEmployees,
    createLoading,
    createError,
    handleCreateSettlement,
    handleRegenerateSettlement,
  }
}

export default useFinalSettlementData
