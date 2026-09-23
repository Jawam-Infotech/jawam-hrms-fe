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
  departments: 'departments/',
departmentById: (departmentId) => `departments/${departmentId}/`,
designations: 'designations/',
designationById: (designationId) => `designations/${designationId}/`,
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

  byId: (leaveId) =>
    `leave/${leaveId}/`,

  history: (leaveId) =>
    `leave/${leaveId}/history/`,

  cancel: (leaveId) =>
    `leave/${leaveId}/cancel/`,

  approve: (leaveId) =>
    `leave/${leaveId}/approve/`,

  reject: (leaveId) =>
    `leave/${leaveId}/reject/`,

  partialApprove: (leaveId) =>
    `leave/${leaveId}/partial-approve/`,

  approveCancellation: (leaveId) =>
    `leave/${leaveId}/approve-cancellation/`,

  rejectCancellation: (leaveId) =>
    `leave/${leaveId}/reject-cancellation/`,

  upcoming: 'leave/upcoming/',
}

const NOTIFICATION_ENDPOINTS = {
  list: 'notifications/',
  unreadCount: 'notifications/unread-count/',
  markAsRead: (notificationId) =>
    `notifications/${notificationId}/read/`,
  markAllAsRead: 'notifications/mark-all-read/',
  delete: (notificationId) => `notifications/${notificationId}/`,
  clearAll: 'notifications/clear-all/',
}

const ASSETS_ENDPOINTS = {
  // My Assets
  me: 'assets/me/',
  history: 'assets/me/history/',
  summary: 'assets/me/summary/',

  // Asset Types
  types: 'assets/types/',
  typeById: (typeId) => `assets/types/${typeId}/`,

  // Asset Requests
  requests: 'assets/requests/',
  allRequests: 'assets/requests/all/',
  requestById: (requestId) => `assets/requests/${requestId}/`,
  processRequest: (requestId) =>
    `assets/requests/${requestId}/process/`,
  approveRequest: (requestId) =>
    `assets/requests/${requestId}/approve/`,
  rejectRequest: (requestId) =>
    `assets/requests/${requestId}/reject/`,
  cancelRequest: (requestId) =>
    `assets/requests/${requestId}/cancel/`,

  // Asset Request Attachments
  requestAttachments: (requestId) =>
    `assets/requests/${requestId}/attachments/`,
  requestAttachmentById: (
    requestId,
    attachmentId,
  ) =>
    `assets/requests/${requestId}/attachments/${attachmentId}/`,

  // Physical Assets
  assets: 'assets/',
  assetById: (assetId) => `assets/${assetId}/`,

  // Assignments
  assignments: 'assets/assignments/',
  assignmentById: (assignmentId) =>
    `assets/assignments/${assignmentId}/`,
  returnAssignment: (assignmentId) =>
    `assets/assignments/${assignmentId}/return/`,
  transferAssignment: (assignmentId) =>
    `assets/assignments/${assignmentId}/transfer/`,

  // Maintenance
  maintenance: 'assets/maintenance/',
  maintenanceById: (maintenanceId) =>
    `assets/maintenance/${maintenanceId}/`,
  completeMaintenance: (maintenanceId) =>
    `assets/maintenance/${maintenanceId}/complete/`,

  // Disposal
  disposalRequests: 'assets/disposal-requests/',
  disposalRequestById: (requestId) =>
    `assets/disposal-requests/${requestId}/`,
  approveDisposal: (requestId) =>
    `assets/disposal-requests/${requestId}/approve/`,
  rejectDisposal: (requestId) =>
    `assets/disposal-requests/${requestId}/reject/`,

  // Inventory / Procurement
  inventoryRequests: 'assets/inventory-requests/',
  inventoryRequestById: (requestId) =>
    `assets/inventory-requests/${requestId}/`,
  approveInventoryRequest: (requestId) =>
  `assets/inventory-requests/${requestId}/approve/`,
rejectInventoryRequest: (requestId) =>
  `assets/inventory-requests/${requestId}/reject/`,
  cancelInventory: (requestId) =>
    `assets/inventory-requests/${requestId}/cancel/`,
  receiveInventory: (requestId) =>
    `assets/inventory-requests/${requestId}/receive/`,

  // Inventory Summary
  inventorySummary: 'assets/inventory-summary/',

  // Audit
  auditLogs: 'assets/audit-logs/',
}


export const HOLIDAY_ENDPOINTS = {
  holidays: 'holidays/',
}
export { AUTH_ENDPOINTS, EMPLOYEE_ENDPOINTS, ATTENDANCE_ENDPOINTS, LEAVE_ENDPOINTS, NOTIFICATION_ENDPOINTS, ASSETS_ENDPOINTS,}
