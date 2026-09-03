import api from './axios.js'
import { EMPLOYEE_ENDPOINTS } from './endpoints.js'

async function getEmployees({
  page,
  role,
  search,
  department,
  ordering,
} = {}) {
  const params = {}

  if (page) {
    params.page = page
  }

  if (role) {
    params.role = role
  }

  if (search) {
    params.search = search
  }

  if (department) {
    params.department = department
  }

  if (ordering) {
    params.ordering = ordering
  }

  const { data } = await api.get(
    EMPLOYEE_ENDPOINTS.listUsers,
    { params }
  )

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

async function getDepartments() {
  const { data } = await api.get(EMPLOYEE_ENDPOINTS.departments)
  return data
}

async function createDepartment(payload) {
  const { data } = await api.post(
    EMPLOYEE_ENDPOINTS.departments,
    payload
  )
  return data
}

async function updateDepartment(departmentId, payload) {
  const { data } = await api.patch(
    EMPLOYEE_ENDPOINTS.departmentById(departmentId),
    payload
  )
  return data
}

async function getDesignations() {
  const { data } = await api.get(EMPLOYEE_ENDPOINTS.designations)
  return data
}

async function createDesignation(payload) {
  const { data } = await api.post(
    EMPLOYEE_ENDPOINTS.designations,
    payload
  )
  return data
}

async function updateDesignation(designationId, payload) {
  const { data } = await api.patch(
    EMPLOYEE_ENDPOINTS.designationById(designationId),
    payload
  )
  return data
}

export {getEmployees, createEmployee, getEmployeeById, updateEmployee, getManagers, updateEmployeeRole, getDepartments, createDepartment, updateDepartment, getDesignations, createDesignation, updateDesignation,}
