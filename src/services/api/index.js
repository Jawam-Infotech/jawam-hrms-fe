export { default as api } from './axios.js'
export { AUTH_ENDPOINTS, EMPLOYEE_ENDPOINTS } from './endpoints.js'
export {
  loginRequest,
  fetchCurrentUser,
  logoutRequest,
  requestOtp,
  verifyOtp,
  resetPasswordOtp,
} from './auth.api.js'
export { createEmployee } from './employee.api.js'
export { PROJECT_ENDPOINTS } from './endpoints.js'
export { projectsApi, default as projectApi } from './projects.api.js'
