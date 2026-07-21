import { useMemo, useState } from 'react'
import {
  matchesEmployeeQuery,
  normalizeEmployeeQuery,
  sortEmployeesById,
} from '../utils/employeeHelpers.js'

function useEmployees(employeeData) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')

  const filteredEmployees = useMemo(() => {
    const normalizedQuery = normalizeEmployeeQuery(searchQuery)
    const filtered = employeeData.filter((employee) => matchesEmployeeQuery(employee, normalizedQuery))

    return sortEmployeesById(filtered, sortOrder)
  }, [employeeData, searchQuery, sortOrder])

  const toggleSort = () => {
    setSortOrder((current) => (current === 'asc' ? 'desc' : 'asc'))
  }

  return {
    filteredEmployees,
    searchQuery,
    setSearchQuery,
    sortOrder,
    toggleSort,
  }
}

export default useEmployees
