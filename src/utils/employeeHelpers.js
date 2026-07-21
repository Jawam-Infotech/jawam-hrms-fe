function normalizeEmployeeQuery(query) {
  return String(query || '').trim().toLowerCase()
}

function matchesEmployeeQuery(employee, normalizedQuery) {
  return (
    employee.id.includes(normalizedQuery) ||
    employee.name.toLowerCase().includes(normalizedQuery) ||
    employee.email.toLowerCase().includes(normalizedQuery) ||
    employee.designation.toLowerCase().includes(normalizedQuery)
  )
}

function sortEmployeesById(employees, sortOrder) {
  return [...employees].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.id.localeCompare(b.id)
    }
    return b.id.localeCompare(a.id)
  })
}

function formatEmployeeFieldValue(fieldName, value) {
  const rawValue = String(value ?? '')

  if (
    ['phoneNumber', 'accountNumber', 'annualCtc', 'monthlySalary'].includes(fieldName)
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
}
