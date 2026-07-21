import api from './api'
import { getRefreshToken } from '../utils/tokenStorage'

// ---- CONFIRM THESE WITH YOUR SENIOR, then adjust this block only ----
const ENDPOINTS = {
  login: 'auth/login/',
  logout: 'auth/logout/', // optional — some backends don't need this, JWT is stateless
  me: 'auth/me/', // used to rehydrate user info on page refresh, if available
  requestOtp: 'auth/request-otp/',
  verifyOtp: 'auth/verify-otp/',
  resetPasswordOtp: 'auth/reset-password-otp/',
}

// Backend sends role as uppercase (e.g. "CEO"), our app uses lowercase
// ('admin', 'hr', 'manager', 'employee'). TL/TEAM_LEAD and EMPLOYEE are
// guesses — confirm exact strings with your senior once you have those
// test credentials, then correct here if needed.
const ROLE_MAP = {
  CEO: 'admin',
  HR: 'hr',
  TL: 'manager',
  TEAM_LEAD: 'manager',
  EMPLOYEE: 'employee',
}
// -----------------------------------------------------------------

// Backend returns user fields flat (user_id, email, name, role) —
// not nested inside a "user" object like a typical DRF shape. Both
// /auth/login/ and /auth/me/ share this shape.
function mapUser(data) {
  return {
    id: data.user_id,
    email: data.email,
    name: data.name,
    role: ROLE_MAP[data.role] || data.role.toLowerCase(),
  }
}

export async function loginRequest({ email, password }) {
  const { data } = await api.post(ENDPOINTS.login, { email, password })

  return {
    accessToken: data.access,
    refreshToken: data.refresh,
    user: mapUser(data),
  }
}

export async function fetchCurrentUser() {
  const { data } = await api.get(ENDPOINTS.me)
  return mapUser(data)
}

export async function logoutRequest() {
  const refreshToken = getRefreshToken()
  if (!refreshToken) return

  try {
    await api.post(ENDPOINTS.logout, { refresh: refreshToken })
  } catch {
    // non-fatal — we clear local session regardless
  }
}

export async function requestOtp({ email }) {
  const { data } = await api.post(ENDPOINTS.requestOtp, { email })
  return data
}

export async function verifyOtp({ email, otp }) {
  const { data } = await api.post(ENDPOINTS.verifyOtp, { email, otp })
  return data
}

export async function resetPasswordOtp({ email, otp, password, confirm_password }) {
  const { data } = await api.post(ENDPOINTS.resetPasswordOtp, { email, otp, password, confirm_password })
  return data
}
