import api from './axios.js'
import { EMPLOYEE_ENDPOINTS } from './endpoints.js'

async function getEmployees({ page, role } = {}) {
  const params = {}

  if (page) {
    params.page = page
  }

  if (role) {
    params.role = role
  }

  const { data } = await api.get(EMPLOYEE_ENDPOINTS.listUsers, { params })
  return data
}

async function getManagers() {
  const { data } = await api.get(EMPLOYEE_ENDPOINTS.managers)
  return data
}

async function getEmployeeById(employeeId) {
  const { data } = await api.get(`${EMPLOYEE_ENDPOINTS.listUsers}${employeeId}/`)
  return data
}

async function createEmployee(payload) {
  const { data } = await api.post(EMPLOYEE_ENDPOINTS.createUser, payload)
  return data
}

async function updateEmployee(employeeId, payload) {
  const { data } = await api.patch(
    `${EMPLOYEE_ENDPOINTS.listUsers}${employeeId}/`,
    payload
  )

  
  return data
}

async function updateEmployeeRole(employeeId, role) {
  const { data } = await api.patch(
    `${EMPLOYEE_ENDPOINTS.listUsers}${employeeId}/role/`,
    {
      role,
    }
  )

  return data
}
export { getEmployees, createEmployee, getEmployeeById, updateEmployee, getManagers, updateEmployeeRole}
