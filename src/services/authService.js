import api from './api'

// ---- CONFIRM THESE WITH YOUR SENIOR, then adjust this block only ----
const ENDPOINTS = {
  login: 'auth/login/',
  logout: 'auth/logout/', // optional — some backends don't need this, JWT is stateless
  me: 'auth/me/', // used to rehydrate user info on page refresh, if available
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

export async function loginRequest({ email, password }) {
  const { data } = await api.post(ENDPOINTS.login, { email, password })

  // Backend returns user fields flat (user_id, email, name, role) —
  // not nested inside a "user" object like a typical DRF shape.
  return {
    accessToken: data.access,
    refreshToken: data.refresh,
    user: {
      id: data.user_id,
      email: data.email,
      name: data.name,
      role: ROLE_MAP[data.role] || data.role.toLowerCase(),
    },
  }
}

export async function fetchCurrentUser() {
  const { data } = await api.get(ENDPOINTS.me)
  return data
}

export async function logoutRequest() {
  try {
    await api.post(ENDPOINTS.logout)
  } catch {
    // non-fatal — we clear local session regardless
  }
}