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

const ATTENDANCE_ENDPOINTS = {
  checkIn: 'attendance/check-in/',
  checkOut: 'attendance/check-out/',
  startBreak: 'attendance/break-start/',
  endBreak: 'attendance/break-end/',
  me: 'attendance/me/',
  team: 'attendance/team/',
  company: 'attendance/company/',
  today: 'attendance/today/',
  trend: 'attendance/trend/', // ← Add this
  summary: 'attendance/summary/',
  byId: (attendanceId) => `attendance/${attendanceId}/`,
  override: (attendanceId) => `attendance/${attendanceId}/override/`,
  calendar: 'attendance/me/calendar/',
  correctionRequests: 'attendance/correction-requests/',
  allCorrectionRequests: 'attendance/correction-requests/all/',
  correctionBulk: (attendanceId) =>
  `attendance/${attendanceId}/correct-bulk/`,
  // Correction Requests
myCorrectionRequests: 'attendance/correction-requests/me/',

correctionRequestById: (requestId) =>
  `attendance/correction-requests/${requestId}/`,

approveCorrectionRequest: (requestId) =>
  `attendance/correction-requests/${requestId}/approve/`,

rejectCorrectionRequest: (requestId) =>
  `attendance/correction-requests/${requestId}/reject/`,

correctionStatusMap: 'attendance/correction-requests/status-map/',
}

const LEAVE_ENDPOINTS = {
  types: 'leave/types/',
  summary: 'leave/summary/',
  balance: 'leave/balance/',
  leaves: 'leave/',
  pending: 'leave/pending/',
  byId: (leaveId) => `leave/${leaveId}/`,
  cancel: (leaveId) => `leave/${leaveId}/cancel/`,
  approve: (leaveId) => `leave/${leaveId}/approve/`,
  reject: (leaveId) => `leave/${leaveId}/reject/`,
  partialApprove: (leaveId) => `leave/${leaveId}/partial-approve/`,
  approveCancellation: (leaveId) =>
    `leave/${leaveId}/approve-cancellation/`,
  rejectCancellation: (leaveId) =>
    `leave/${leaveId}/reject-cancellation/`,
  upcoming: 'leave/upcoming/',
}


export const HOLIDAY_ENDPOINTS = {
  holidays: 'holidays/',
}
export { AUTH_ENDPOINTS, EMPLOYEE_ENDPOINTS, ATTENDANCE_ENDPOINTS, LEAVE_ENDPOINTS}
