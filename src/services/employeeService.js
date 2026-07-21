import { employees } from '../data/employees.js'
import { formatEmployeeFieldValue, generateEmployeeId as generateEmployeeIdHelper, sortEmployeesById } from '../utils/employeeHelpers.js'

const employeeStore = [...employees]

function getEmployees() {
  return sortEmployeesById(employeeStore, 'asc')
}

function getEmployeeById(employeeId) {
  return employeeStore.find((employee) => employee.id === employeeId) ?? null
}

function createEmployee(employee) {
  const storedEmployee = {
    ...employee,
    id: employee.id || employee.employeeId || generateEmployeeId(),
    email: formatEmployeeFieldValue('email', employee.email || employee.officialEmail || ''),
    name: employee.name || employee.fullName || '',
    designation: employee.designation || '',
  }

  employeeStore.push(storedEmployee)
  return storedEmployee
}

function updateEmployee(employeeId, updates) {
  const index = employeeStore.findIndex((employee) => employee.id === employeeId)
  if (index === -1) {
    return null
  }

  const updatedEmployee = {
    ...employeeStore[index],
    ...updates,
    id: employeeId,
  }

  employeeStore[index] = updatedEmployee
  return updatedEmployee
}

function deleteEmployee(employeeId) {
  const index = employeeStore.findIndex((employee) => employee.id === employeeId)
  if (index === -1) {
    return false
  }

  employeeStore.splice(index, 1)
  return true
}

function generateEmployeeId() {
  return generateEmployeeIdHelper(employeeStore)
}

function uploadDocument(documentKey, file) {
  return {
    file,
    fileName: file.name,
    previewUrl: URL.createObjectURL(file),
    status: 'Uploaded',
    key: documentKey,
  }
}

export { getEmployees, getEmployeeById, createEmployee, updateEmployee, deleteEmployee, generateEmployeeId, uploadDocument }
