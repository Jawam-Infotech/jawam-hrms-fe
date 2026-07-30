function normalizeEmployeeQuery(query) {
  return String(query || '').trim().toLowerCase()
}

function getEmployeeDisplayId(employee = {}) {
  return String(employee.employee_id ?? employee.employeeId ?? employee.id ?? '').trim()
}

function getEmployeeDisplayName(employee = {}) {
  const firstName = String(employee.first_name ?? employee.firstName ?? '').trim()
  const lastName = String(employee.last_name ?? employee.lastName ?? '').trim()

  return (
    [firstName, lastName].filter(Boolean).join(' ') ||
    String(employee.name ?? '').trim() ||
    '-'
  )
}

function matchesEmployeeQuery(employee, normalizedQuery) {
  const searchableValues = [
    getEmployeeDisplayId(employee),
    getEmployeeDisplayName(employee),
    String(employee.email ?? '').trim(),
    String(employee.department ?? '').trim(),
    String(employee.designation ?? '').trim(),
  ]

  const searchableText = searchableValues.join(' ').toLowerCase()

  return (
    searchableText.includes(normalizedQuery)
  )
}

function sortEmployeesById(employees, sortOrder) {
  return [...employees].sort((a, b) => {
    const left = getEmployeeDisplayId(a)
    const right = getEmployeeDisplayId(b)

    if (sortOrder === 'asc') {
      return left.localeCompare(right, undefined, { numeric: true, sensitivity: 'base' })
    }
    return right.localeCompare(left, undefined, { numeric: true, sensitivity: 'base' })
  })
}

function formatEmployeeFieldValue(fieldName, value) {
  const rawValue = String(value ?? '')

  if (
    ['phone', 'accountNumber', 'annualCtc', 'monthlySalary'].includes(fieldName)
  ) {
    return rawValue.replace(/\D/g, '')
  }

  if (fieldName === 'ifscCode') {
    return rawValue.toUpperCase().replace(/\s+/g, '')
  }

  if (fieldName === 'employeeId') {
    return rawValue.replace(/\D/g, '')
  }

  return rawValue
}

function generateEmployeeId(employees = []) {
  const numericIds = employees
    .map((employee) => Number.parseInt(employee.id, 10))
    .filter((value) => Number.isFinite(value))

  const nextId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 101
  return String(nextId)
}

export {
  formatEmployeeFieldValue,
  generateEmployeeId,
  normalizeEmployeeQuery,
  matchesEmployeeQuery,
  sortEmployeesById,
  getEmployeeDisplayId,
  getEmployeeDisplayName,
}
