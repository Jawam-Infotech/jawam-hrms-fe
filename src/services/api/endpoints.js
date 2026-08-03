const AUTH_ENDPOINTS = {
  login: 'auth/login/',
  logout: 'auth/logout/',
  me: 'auth/me/',
  requestOtp: 'auth/request-otp/',
  verifyOtp: 'auth/verify-otp/',
  resetPasswordOtp: 'auth/reset-password-otp/',
  changePassword: 'auth/change-password/',
}

const EMPLOYEE_ENDPOINTS = {
  listUsers: 'users/',
  createUser: 'users/create-user/',
  managers: '/users/managers/',
}

export { AUTH_ENDPOINTS, EMPLOYEE_ENDPOINTS }
