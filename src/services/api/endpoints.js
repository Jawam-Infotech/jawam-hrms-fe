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
  managers: 'users/managers/',
  departments: 'departments/',
departmentById: (departmentId) => `departments/${departmentId}/`,
designations: 'designations/',
designationById: (designationId) => `designations/${designationId}/`,
}

const PAYROLL_ENDPOINTS = {
  list: 'payroll/',
  byId: (payrollId) => `payroll/${payrollId}/`,
  payslip: (payrollId) => `payroll/${payrollId}/payslip/`,
  approve: (payrollId) => `payroll/${payrollId}/approve/`,
  reject: (payrollId) => `payroll/${payrollId}/reject/`,
  ceoCorrection: (payrollId) => `payroll/${payrollId}/ceo-correction/`,
  correction: (payrollId) => `payroll/${payrollId}/correction/`,
  pay: (payrollId) => `payroll/${payrollId}/pay/`,
  cancelRequest: (payrollId) => `payroll/${payrollId}/cancel-request/`,
  cancelApprove: (payrollId) => `payroll/${payrollId}/cancel-approve/`,
  cancelReject: (payrollId) => `payroll/${payrollId}/cancel-reject/`,
  createReplacement: (payrollId) => `payroll/${payrollId}/create-replacement/`,
  regenerate: (payrollId) => `payroll/${payrollId}/regenerate/`,
  settings: 'payroll/settings/',
  generate: 'payroll/generate/',
  lateGenerationApprove: 'payroll/late-generation-approve/',
  exportExcel: 'payroll/export/excel/',
}

const SETTLEMENT_ENDPOINTS = {
  list: 'settlements/',
  byId: (settlementId) => `settlements/${settlementId}/`,
  regenerate: (settlementId) =>
    `settlements/${settlementId}/regenerate/`,
  approve: (settlementId) =>
    `settlements/${settlementId}/approve/`,
  reject: (settlementId) =>
    `payroll/settlements/${settlementId}/reject/`,
  correction: (settlementId) =>
    `settlements/${settlementId}/correction/`,
  ceoCorrection: (settlementId) =>
    `payroll/settlements/${settlementId}/ceo-correction/`,
  pay: (settlementId) =>
    `settlements/${settlementId}/pay/`,
  cancel: (settlementId) =>
    `settlements/${settlementId}/cancel/`,
  createReplacement: (settlementId) =>
    `settlements/${settlementId}/create-replacement/`,
  statement: (settlementId) =>
    `settlements/${settlementId}/statement/`,
}

const SALARY_REVISION_ENDPOINTS = {
  list: 'salary-revisions/',
  byId: (revisionId) => `salary-revisions/${revisionId}/`,
  approve: (revisionId) =>
    `salary-revisions/${revisionId}/approve/`,
  reject: (revisionId) =>
    `salary-revisions/${revisionId}/reject/`,
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

const ANNOUNCEMENT_ENDPOINTS = {
  list: 'announcements/',
  unreadCount: 'announcements/unread-count/',
  markAsRead: (announcementId) => `announcements/${announcementId}/read/`,
  byId: (announcementId) => `announcements/${announcementId}/`,
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

export const PROJECT_ENDPOINTS = {
  projects: 'projects/',
  projectById: (projectId) => `projects/${projectId}/`,
  primaryPm: (projectId) => `projects/${projectId}/primary-pm/`,
  members: (projectId) => `projects/${projectId}/members/`,
  memberRemove: (projectId, userId) => `projects/${projectId}/members/${userId}/remove/`,
  memberDeactivate: (projectId, userId) => `projects/${projectId}/members/${userId}/deactivate/`,
  staffingMode: (projectId) => `projects/${projectId}/staffing-mode/`,
  activate: (projectId) => `projects/${projectId}/activate/`,
  hold: (projectId) => `projects/${projectId}/hold/`,
  resume: (projectId) => `projects/${projectId}/resume/`,
  cancelSolo: (projectId) => `projects/${projectId}/cancel/`,
  archive: (projectId) => `projects/${projectId}/archive/`,
  reactivate: (projectId) => `projects/${projectId}/reactivate/`,
  closureRequest: (projectId) => `projects/${projectId}/closure/request/`,
  closureBlockers: (projectId) => `projects/${projectId}/closure/blockers/`,
  closureApprove: (projectId) => `projects/${projectId}/closure/approve/`,
  closureReject: (projectId) => `projects/${projectId}/closure/reject/`,
  workUpdates: (projectId, taskId) => `projects/${projectId}/tasks/${taskId}/work-updates/`,
  taskWorkflow: (projectId, taskId) => `projects/${projectId}/tasks/${taskId}/workflow/`,
  completionDecision: (projectId, taskId, submissionId) =>
    `projects/${projectId}/tasks/${taskId}/completion-submissions/${submissionId}/decision/`,
  changeRequests: (projectId, taskId) => `projects/${projectId}/tasks/${taskId}/change-requests/`,
  auditTimeline: (projectId) => `projects/${projectId}/audit/`,
  changeRequestDecision: (projectId, requestId) =>
    `projects/${projectId}/change-requests/${requestId}/decision/`,
  deliverableFile: (projectId, taskId, submissionId, fileId) =>
    `projects/${projectId}/tasks/${taskId}/completion-submissions/${submissionId}/files/${fileId}/`,
  reassignCompletionApprover: (projectId, taskId, submissionId) =>
    `projects/${projectId}/tasks/${taskId}/completion-submissions/${submissionId}/reassign-approver/`,
  reassignChangeApprover: (projectId, requestId) =>
    `projects/${projectId}/change-requests/${requestId}/reassign-approver/`,
  cancellationRequests: (projectId) => `projects/${projectId}/cancellation-requests/`,
  cancellationApprove: (projectId, requestId) =>
    `projects/${projectId}/cancellation-requests/${requestId}/approve/`,
  cancellationReject: (projectId, requestId) =>
    `projects/${projectId}/cancellation-requests/${requestId}/reject/`,
  tasks: (projectId) => `projects/${projectId}/tasks/`,
  taskById: (projectId, taskId) => `projects/${projectId}/tasks/${taskId}/`,
  taskAssign: (projectId, taskId) => `projects/${projectId}/tasks/${taskId}/assign/`,
  taskStatus: (projectId, taskId) => `projects/${projectId}/tasks/${taskId}/status/`,
  taskCancel: (projectId, taskId) => `projects/${projectId}/tasks/${taskId}/cancel/`,
  approvalQueue: 'approvals/',
}

export const PROJECT_REQUEST_ENDPOINTS = {
  requests: 'project-requests/',
  requestById: (id) => `project-requests/${id}/`,
  approve: (id) => `project-requests/${id}/approve/`,
  reject: (id) => `project-requests/${id}/reject/`,
  withdraw: (id) => `project-requests/${id}/withdraw/`,
  returnForClarification: (id) => `project-requests/${id}/return/`,
  resubmit: (id) => `project-requests/${id}/resubmit/`,
}

export {
  AUTH_ENDPOINTS,
  EMPLOYEE_ENDPOINTS,
  ATTENDANCE_ENDPOINTS,
  LEAVE_ENDPOINTS,
  NOTIFICATION_ENDPOINTS,
  ANNOUNCEMENT_ENDPOINTS,
  ASSETS_ENDPOINTS,
  PAYROLL_ENDPOINTS,
  SALARY_REVISION_ENDPOINTS,
  SETTLEMENT_ENDPOINTS,
}

