import { updateEmployeeRole as updateEmployeeRoleRequest, getEmployeeById as getEmployeeByIdRequest, getEmployees as getEmployeesRequest, createEmployee as createEmployeeRequest, updateEmployee as updateEmployeeRequest, getManagers as getManagersRequest,} from './api/employee.api.js'
import { getEmployeeDisplayId } from '../utils/employeeHelpers.js'

const employeeCache = new Map()

function normalizeEmployeeRecord(employee = {}) {
  const id = String(employee.employee_id || employee.employeeId || employee.id || '').trim()
  const firstName = String(employee.first_name || employee.firstName || '').trim()
  const lastName = String(employee.last_name || employee.lastName || '').trim()
  const name =
    [firstName, lastName].filter(Boolean).join(' ') ||
    String(employee.name || '').trim() ||
    '-'

  return {
    ...employee,
    id,
    employeeId: getEmployeeDisplayId(employee) || id,
    name,
    firstName,
    lastName,
    email: String(employee.email || '').trim(),
    department: String(employee.department || '').trim(),
    designation: String(employee.designation || '').trim(),
    role: employee.role || '',
    phone: employee.phone || employee.contact_number || employee.contactNumber || '',
    joiningDate: employee.joiningDate || employee.date_of_joining || employee.dateOfJoining || '',
    employmentType: employee.employmentType || employee.employment_type || '',
    employmentStatus: employee.employmentStatus || employee.employment_status || '',
    workLocation: employee.workLocation || employee.work_location || '',
  }
}

function cacheEmployee(employee) {
  const normalizedEmployee = normalizeEmployeeRecord(employee)
  if (normalizedEmployee.id) {
    employeeCache.set(normalizedEmployee.id, normalizedEmployee)
  }
  return normalizedEmployee
}

async function getEmployees({ page, role } = {}) {
  const data = await getEmployeesRequest({ page, role })
  const results = Array.isArray(data?.results) ? data.results : []
  const employees = results.map(cacheEmployee)

  return {
    employees,
    count: data?.count ?? employees.length,
    next: data?.next ?? null,
    previous: data?.previous ?? null,
  }
}

async function getManagers() {
  const data = await getManagersRequest()

  return Array.isArray(data)
    ? data.map((manager) => ({
        id: manager.id,
        firstName: manager.first_name,
        lastName: manager.last_name,
        role: manager.role,
        label: `${manager.first_name} ${manager.last_name} (${manager.role})`,
      }))
    : []
}

async function getEmployeeById(employeeId) {
  const employee = await getEmployeeByIdRequest(employeeId)

  return cacheEmployee(employee)
}

async function createEmployee(payload) {
  const data = await createEmployeeRequest(payload)
  const normalizedEmployee = cacheEmployee({
    ...payload,
    ...data,
    employee_id: data.employee_id || data.user_id || data.id || payload.employee_id,
    id: data.id || data.user_id || payload.employee_id,
    first_name: payload.first_name,
    last_name: payload.last_name,
    email: data.email || payload.email,
    designation: payload.designation,
    department: payload.department,
    role: data.role || payload.role,
  })

  return {
    id: normalizedEmployee.id,
    email: normalizedEmployee.email,
    role: normalizedEmployee.role,
    name: normalizedEmployee.name,
  }
}

async function updateEmployeeRole(employeeId, role) {
  const data = await updateEmployeeRoleRequest(employeeId, role)

  return cacheEmployee(data)
}

async function updateEmployee(employeeId, payload) {
  const data = await updateEmployeeRequest(employeeId, payload)

  return cacheEmployee(data)
}



export { getEmployees, createEmployee, updateEmployee, getManagers, getEmployeeById, updateEmployeeRole }
