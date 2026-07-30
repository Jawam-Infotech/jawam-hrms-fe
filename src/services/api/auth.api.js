import api from './axios.js'
import { AUTH_ENDPOINTS } from './endpoints.js'
import { getRefreshToken } from '../../utils/tokenStorage.js'

const ROLE_MAP = {
  CEO: 'admin',
  HR: 'hr',
  TL: 'manager',
  TEAM_LEAD: 'manager',
  EMPLOYEE: 'employee',
}

function mapUser(data) {
  return {
    id: data.user_id,
    email: data.email,
    name: data.name,
    role: ROLE_MAP[data.role] || String(data.role || '').toLowerCase(),
  }
}

async function loginRequest({ email, password }) {
  const { data } = await api.post(AUTH_ENDPOINTS.login, { email, password })

  return {
    accessToken: data.access,
    refreshToken: data.refresh,
    user: mapUser(data),
  }
}

async function fetchCurrentUser() {
  const { data } = await api.get(AUTH_ENDPOINTS.me)
  return mapUser(data)
}

async function logoutRequest() {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return

  try {
    await api.post(AUTH_ENDPOINTS.logout, { refresh: refreshToken })
  } catch {
    // non-fatal — local session is cleared by the caller
  }
}

async function requestOtp({ email }) {
  const { data } = await api.post(AUTH_ENDPOINTS.requestOtp, { email })
  return data
}

async function verifyOtp({ email, otp }) {
  const { data } = await api.post(AUTH_ENDPOINTS.verifyOtp, { email, otp })
  return data
}

async function resetPasswordOtp({ email, otp, password, confirm_password }) {
  const { data } = await api.post(AUTH_ENDPOINTS.resetPasswordOtp, {
    email,
    otp,
    password,
    confirm_password: confirm_password || password,
  })
  return data
}

async function changePassword({ current_password, new_password, confirm_password }) {
  const { data } = await api.post(AUTH_ENDPOINTS.changePassword, {
    current_password: String(current_password || '').trim(),
    new_password: String(new_password || '').trim(),
    confirm_password: String(confirm_password || '').trim(),
  })
  return data
}

export { loginRequest, fetchCurrentUser, logoutRequest, requestOtp, verifyOtp, resetPasswordOtp, changePassword }
