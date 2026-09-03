import { EMPLOYEE_PAGE_SIZE } from '../constants/pagination.js'
import { useEffect, useState, useCallback } from 'react'
import {
  getEmployees,
  getDepartments,
} from '../services/employeeService.js'

function useEmployees() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')

  const [sortOrder, setSortOrder] = useState('asc')
  const [roleFilter, setRoleFilter] = useState('all')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [departmentOptions, setDepartmentOptions] = useState([])

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const [nextPage, setNextPage] = useState(null)
  const [previousPage, setPreviousPage] = useState(null)

  /*
   * Debounce search input.
   *
   * The user can type normally without triggering
   * an API request for every character.
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim())
    }, 400)

    return () => {
      clearTimeout(timer)
    }
  }, [searchQuery])

  const loadDepartments = useCallback(async () => {
    try {
      const departments = await getDepartments()

      setDepartmentOptions(
        Array.isArray(departments)
          ? departments.map((department) => ({
              value: department.name,
              label: department.name,
            }))
          : [],
      )
    } catch (err) {
      console.error('Failed to fetch departments:', err)
      setDepartmentOptions([])
    }
  }, [])

  const loadEmployees = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await getEmployees({
        page: currentPage,

        role:
          roleFilter !== 'all'
            ? roleFilter
            : undefined,

        search:
          debouncedSearchQuery || undefined,

        department:
          departmentFilter !== 'all'
            ? departmentFilter
            : undefined,

        ordering:
          sortOrder === 'asc'
            ? 'id'
            : '-id',
      })

      setEmployees(response.employees ?? [])
      setTotalCount(response.count ?? 0)
      setNextPage(response.next ?? null)
      setPreviousPage(response.previous ?? null)
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
  }, [
    currentPage,
    debouncedSearchQuery,
    roleFilter,
    departmentFilter,
    sortOrder,
  ])

  /*
   * Reset pagination when the actual backend
   * search/filter/sort value changes.
   */
  useEffect(() => {
    setCurrentPage(1)
  }, [
    debouncedSearchQuery,
    roleFilter,
    departmentFilter,
    sortOrder,
  ])

  /*
   * Fetch employees whenever page/search/filter/sort changes.
   */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadEmployees()
  }, [loadEmployees])

  /*
   * Departments only need to be loaded separately.
   */
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDepartments()
  }, [loadDepartments])

  const totalPages = Math.max(
    1,
    Math.ceil(totalCount / EMPLOYEE_PAGE_SIZE),
  )

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) {
      return
    }

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
    setSortOrder((current) =>
      current === 'asc'
        ? 'desc'
        : 'asc',
    )
  }

  const resetFilters = () => {
    setSearchQuery('')
    setRoleFilter('all')
    setDepartmentFilter('all')
    setSortOrder('asc')
  }

  return {
    employees,

    // Backend already filtered/sorted the data.
    filteredEmployees: employees,

    loading,
    error,
    departmentOptions,

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