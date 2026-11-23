import api from './axios.js'
import { PROJECT_ENDPOINTS } from './endpoints.js'

export const projectsApi = {
  // === E01: Project List (GET) & Project Create (POST) ===
  getProjects: (params = {}) =>
    api.get(PROJECT_ENDPOINTS.projects, { params }),

  createProject: (payload) =>
    api.post(PROJECT_ENDPOINTS.projects, payload),

  // === E02: TL Creation Permission (POST) ===
  setCreationPermission: (userId, canCreate) =>
    api.post(PROJECT_ENDPOINTS.creationPermissions(userId), { can_create: canCreate }),

  // === E03: Project Detail (GET) & Metadata Edit (PATCH) ===
  getProjectDetail: (projectId) =>
    api.get(PROJECT_ENDPOINTS.projectById(projectId)),

  patchProject: (projectId, payload) =>
    api.patch(PROJECT_ENDPOINTS.projectById(projectId), payload),

  updateProject: (projectId, payload) =>
    api.patch(PROJECT_ENDPOINTS.projectById(projectId), payload),

  // === E04: Primary PM Assignment (POST) ===
  assignPrimaryPM: (projectId, payload) =>
    api.post(PROJECT_ENDPOINTS.primaryPm(projectId), payload),

  // === E05: Project Members List (GET) & Add Member (POST) ===
  getMembers: (projectId, params = {}) =>
    api.get(PROJECT_ENDPOINTS.members(projectId), { params }),

  addMember: (projectId, payload) =>
    api.post(PROJECT_ENDPOINTS.members(projectId), payload),

  // === E06: Member Removal (POST) ===
  removeMember: (projectId, userId, payload) =>
    api.post(PROJECT_ENDPOINTS.memberRemove(projectId, userId), payload),

  // === E07: Member Deactivation (POST) ===
  deactivateMember: (projectId, userId, payload) =>
    api.post(PROJECT_ENDPOINTS.memberDeactivate(projectId, userId), payload),

  // === E08: Staffing Mode Conversion (Solo to Team) (POST) ===
  setStaffingMode: (projectId, payload) =>
    api.post(PROJECT_ENDPOINTS.staffingMode(projectId), payload),

  // === E09: Activate Project (POST) ===
  activateProject: (projectId, reason = '') =>
    api.post(PROJECT_ENDPOINTS.activate(projectId), { reason }),

  // === E10: Hold Project (POST) ===
  holdProject: (projectId, reason = '') =>
    api.post(PROJECT_ENDPOINTS.hold(projectId), { reason }),

  // === E11: Resume Project (POST) ===
  resumeProject: (projectId, reason = '') =>
    api.post(PROJECT_ENDPOINTS.resume(projectId), { reason }),

  // === E12: Cancel Solo Project (POST) ===
  cancelSoloProject: (projectId, reason) =>
    api.post(PROJECT_ENDPOINTS.cancelSolo(projectId), { reason }),

  // === E13: Archive Project (POST) ===
  archiveProject: (projectId, reason = '') =>
    api.post(PROJECT_ENDPOINTS.archive(projectId), { reason }),

  // === E14: Reactivate Project (POST) ===
  reactivateProject: (projectId, reason = '') =>
    api.post(PROJECT_ENDPOINTS.reactivate(projectId), { reason }),

  // === E15: Request Closure (POST) ===
  requestClosure: (projectId, reason = '') =>
    api.post(PROJECT_ENDPOINTS.closureRequest(projectId), { reason }),

  // === E16: Closure Blockers Preview (GET) ===
  getClosureBlockers: (projectId) =>
    api.get(PROJECT_ENDPOINTS.closureBlockers(projectId)),

  // === E17: Approve Closure (POST) ===
  approveClosure: (projectId, reason = '') =>
    api.post(PROJECT_ENDPOINTS.closureApprove(projectId), { reason }),

  // === E18: Reject Closure (POST) ===
  rejectClosure: (projectId, reason = '') =>
    api.post(PROJECT_ENDPOINTS.closureReject(projectId), { reason }),

  // === E19: Work Update History (GET) & Record Work Update (POST) ===
  getWorkUpdates: (projectId, taskId) =>
    api.get(PROJECT_ENDPOINTS.workUpdates(projectId, taskId)),

  recordWorkUpdate: (projectId, taskId, payload, isMultipart = false) => {
    const config = isMultipart
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {}
    return api.post(PROJECT_ENDPOINTS.workUpdates(projectId, taskId), payload, config)
  },

  // === E20: Task Workflow Summary (GET) ===
  getTaskWorkflow: (projectId, taskId) =>
    api.get(PROJECT_ENDPOINTS.taskWorkflow(projectId, taskId)),

  // === E21: Completion Review Decision (POST) ===
  decideCompletion: (projectId, taskId, submissionId, payload) =>
    api.post(PROJECT_ENDPOINTS.completionDecision(projectId, taskId, submissionId), payload),

  // === E22: Task-Change Requests (GET & POST) ===
  getChangeRequests: (projectId, taskId) =>
    api.get(PROJECT_ENDPOINTS.changeRequests(projectId, taskId)),

  createChangeRequest: (projectId, taskId, payload) =>
    api.post(PROJECT_ENDPOINTS.changeRequests(projectId, taskId), payload),

  // === E23: Task-Change Request Decision (POST) ===
  decideChangeRequest: (projectId, requestId, payload) =>
    api.post(PROJECT_ENDPOINTS.changeRequestDecision(projectId, requestId), payload),

  // === E24: Private Deliverable File Download (GET) ===
  downloadDeliverableFile: (projectId, taskId, submissionId, fileId) =>
    api.get(PROJECT_ENDPOINTS.deliverableFile(projectId, taskId, submissionId, fileId), {
      responseType: 'blob',
    }),

  // === E25: Reassign Completion Approver (POST) ===
  reassignCompletionApprover: (projectId, taskId, submissionId, payload) =>
    api.post(PROJECT_ENDPOINTS.reassignCompletionApprover(projectId, taskId, submissionId), payload),

  // === E26: Reassign TCR Approver (POST) ===
  reassignChangeApprover: (projectId, requestId, payload) =>
    api.post(PROJECT_ENDPOINTS.reassignChangeApprover(projectId, requestId), payload),

  // === E27: Read Pending Cancellation (GET) & Request Cancellation (POST) ===
  getCancellationRequest: (projectId) =>
    api.get(PROJECT_ENDPOINTS.cancellationRequests(projectId)),

  requestCancellation: (projectId, reason) =>
    api.post(PROJECT_ENDPOINTS.cancellationRequests(projectId), { reason }),

  // === E28: Approve Team Cancellation (POST) ===
  approveCancellation: (projectId, requestId, reason = '') =>
    api.post(PROJECT_ENDPOINTS.cancellationApprove(projectId, requestId), { reason }),

  // === E29: Reject Team Cancellation (POST) ===
  rejectCancellation: (projectId, requestId, reason) =>
    api.post(PROJECT_ENDPOINTS.cancellationReject(projectId, requestId), { reason }),

  // === E30: Project Tasks List (GET) & Create Task (POST) ===
  getTasks: (projectId, params = {}) =>
    api.get(PROJECT_ENDPOINTS.tasks(projectId), { params }),

  createTask: (projectId, payload) =>
    api.post(PROJECT_ENDPOINTS.tasks(projectId), payload),

  // === E31: Task Detail (GET) & Task Edit (PATCH) ===
  getTaskDetail: (projectId, taskId) =>
    api.get(PROJECT_ENDPOINTS.taskById(projectId, taskId)),

  patchTask: (projectId, taskId, payload) =>
    api.patch(PROJECT_ENDPOINTS.taskById(projectId, taskId), payload),

  updateTask: (projectId, taskId, payload) =>
    api.patch(PROJECT_ENDPOINTS.taskById(projectId, taskId), payload),

  // === E32: Assign Task (POST) ===
  assignTask: (projectId, taskId, payload) =>
    api.post(PROJECT_ENDPOINTS.taskAssign(projectId, taskId), payload),

  // === E33: Set Task Status (POST) ===
  setTaskStatus: (projectId, taskId, status) =>
    api.post(PROJECT_ENDPOINTS.taskStatus(projectId, taskId), { status }),

  // === E34: Cancel Task (POST) ===
  cancelTask: (projectId, taskId, reason = '') =>
    api.post(PROJECT_ENDPOINTS.taskCancel(projectId, taskId), { reason }),

  // === E35: Approval Queue (GET) ===
  getApprovalQueue: (params = {}) =>
    api.get(PROJECT_ENDPOINTS.approvalQueue, { params }),
}

export default projectsApi
