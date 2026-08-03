import { EMPLOYEE_PAGE_SIZE } from '../constants/pagination.js'
import { useEffect, useMemo, useState, useCallback } from 'react'
import { getEmployees } from '../services/employeeService.js'
import {
  matchesEmployeeQuery,
  normalizeEmployeeQuery,
  sortEmployeesById,
} from '../utils/employeeHelpers.js'

function useEmployees() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')
  const [roleFilter, setRoleFilter] = useState('all')
  const [departmentFilter, setDepartmentFilter] = useState('all')

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [nextPage, setNextPage] = useState(null)
  const [previousPage, setPreviousPage] = useState(null)

  const loadEmployees = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await getEmployees({
        page: currentPage,
      })

      setEmployees(response.employees ?? [])
      setTotalCount(response.count ?? 0)
      setNextPage(response.next)
      setPreviousPage(response.previous)
    } catch (err) {
      console.error('Failed to fetch employees:', err)
      setError(err)
      setEmployees([])
      setTotalCount(0)
      setNextPage(null)
      setPreviousPage(null)
    } finally {
      setLoading(false)
    }
  }, [currentPage])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadEmployees()
  }, [loadEmployees])

  const filteredEmployees = useMemo(() => {
    const normalizedQuery = normalizeEmployeeQuery(searchQuery)

    const filtered = employees.filter((employee) => {
      const matchesSearch = matchesEmployeeQuery(employee, normalizedQuery)

      const matchesRole =
        roleFilter === 'all' || employee.role === roleFilter

      const matchesDepartment =
        departmentFilter === 'all' ||
        employee.department === departmentFilter

      return matchesSearch && matchesRole && matchesDepartment
    })

    return sortEmployeesById(filtered, sortOrder)
  }, [
    employees,
    searchQuery,
    sortOrder,
    roleFilter,
    departmentFilter,
  ])

  const totalPages = Math.max(
    1,
    Math.ceil(totalCount / EMPLOYEE_PAGE_SIZE)
  )

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  const goToNextPage = () => {
    if (nextPage) {
      setCurrentPage((page) => page + 1)
    }
  }

  const goToPreviousPage = () => {
    if (previousPage) {
      setCurrentPage((page) => page - 1)
    }
  }

  const toggleSort = () => {
    setSortOrder((current) => (current === 'asc' ? 'desc' : 'asc'))
  }
  const resetFilters = () => {
  setSearchQuery('')
  setRoleFilter('all')
  setDepartmentFilter('all')
  setSortOrder('asc')
}

  return {
    employees,
    filteredEmployees,

    loading,
    error,

    searchQuery,
    setSearchQuery,

    sortOrder,
    toggleSort,
    resetFilters,

    roleFilter,
    setRoleFilter,

    departmentFilter,
    setDepartmentFilter,

    // Pagination
    currentPage,
    totalCount,
    totalPages,
    nextPage,
    previousPage,
    goToPage,
    goToNextPage,
    goToPreviousPage,

    refreshEmployees: loadEmployees,
  }
}

export default useEmployees
