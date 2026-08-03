import api from './axios.js'
import { EMPLOYEE_ENDPOINTS } from './endpoints.js'

async function getProfileByUserId(userId) {
  const { data } = await api.get(`${EMPLOYEE_ENDPOINTS.listUsers}${userId}/`)
  return data
}

async function updateProfileByUserId(userId, payload) {
  const { data } = await api.patch(`${EMPLOYEE_ENDPOINTS.listUsers}${userId}/`, payload)
  return data
}

export { getProfileByUserId, updateProfileByUserId }
