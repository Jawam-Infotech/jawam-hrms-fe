import { useCallback, useRef, useState } from 'react'
import { getEmployees } from '../../services/employeeService.js'

const SEARCH_DELAY = 300

function usePayrollEmployeeSelector() {
  const [employees, setEmployees] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const searchTimerRef = useRef(null)

  const fetchEmployees = useCallback(async (searchTerm = '') => {
    setLoading(true)
    setError(null)

    try {
      const data = await getEmployees({
        page: 1,
        search: searchTerm.trim(),
      })

      setEmployees(data.employees)
    } catch (requestError) {
      setError(requestError)
      setEmployees([])
    } finally {
      setLoading(false)
    }
  }, [])

  const handleSearchChange = useCallback(
    (value) => {
      setSearch(value)

      if (searchTimerRef.current) {
        clearTimeout(searchTimerRef.current)
      }

      searchTimerRef.current = setTimeout(() => {
        fetchEmployees(value)
      }, SEARCH_DELAY)
    },
    [fetchEmployees]
  )

  return {
    employees,
    search,
    setSearch,
    handleSearchChange,
    fetchEmployees,
    loading,
    error,
  }
}

export default usePayrollEmployeeSelector