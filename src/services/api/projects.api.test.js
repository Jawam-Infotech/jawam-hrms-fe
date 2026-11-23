import { describe, it, expect, vi, beforeEach } from 'vitest'
import { projectsApi } from './projects.api.js'
import api from './axios.js'

vi.mock('./axios.js', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
  },
}))

describe('projectsApi (E01 to E35)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  // E01: Project list & creation
  it('E01 GET: getProjects calls projects/ with pagination query', async () => {
    api.get.mockResolvedValueOnce({ data: { results: [] } })
    await projectsApi.getProjects({ page: 2, page_size: 20 })
    expect(api.get).toHaveBeenCalledWith('projects/', { params: { page: 2, page_size: 20 } })
  })

  it('E01 POST: createProject calls projects/ with payload', async () => {
    const payload = { name: 'New Project', staffing_mode: 'TEAM' }
    api.post.mockResolvedValueOnce({ data: { id: 10 } })
    await projectsApi.createProject(payload)
    expect(api.post).toHaveBeenCalledWith('projects/', payload)
  })

  // E02: TL creation permission toggle
  it('E02 POST: setCreationPermission calls projects/creation-permissions/{userId}/', async () => {
    api.post.mockResolvedValueOnce({ data: { can_create: true } })
    await projectsApi.setCreationPermission(5, true)
    expect(api.post).toHaveBeenCalledWith('projects/creation-permissions/5/', { can_create: true })
  })

  // E03: Project detail & PATCH
  it('E03 GET & PATCH: getProjectDetail and updateProject', async () => {
    api.get.mockResolvedValueOnce({ data: { id: 9 } })
    await projectsApi.getProjectDetail(9)
    expect(api.get).toHaveBeenCalledWith('projects/9/')

    const patchPayload = { name: 'Renamed Project' }
    api.patch.mockResolvedValueOnce({ data: { id: 9, name: 'Renamed Project' } })
    await projectsApi.updateProject(9, patchPayload)
    expect(api.patch).toHaveBeenCalledWith('projects/9/', patchPayload)
  })

  // E04: Assign Primary PM
  it('E04 POST: assignPrimaryPM calls projects/{id}/primary-pm/', async () => {
    const payload = { user_id: 12, reason: 'Promoted' }
    api.post.mockResolvedValueOnce({ data: { id: 9 } })
    await projectsApi.assignPrimaryPM(9, payload)
    expect(api.post).toHaveBeenCalledWith('projects/9/primary-pm/', payload)
  })

  // E05: Members GET & POST
  it('E05 GET & POST: getMembers with include_inactive and addMember', async () => {
    api.get.mockResolvedValueOnce({ data: { results: [] } })
    await projectsApi.getMembers(9, { include_inactive: true })
    expect(api.get).toHaveBeenCalledWith('projects/9/members/', { params: { include_inactive: true } })

    api.post.mockResolvedValueOnce({ data: { user_id: 15 } })
    await projectsApi.addMember(9, { user_id: 15 })
    expect(api.post).toHaveBeenCalledWith('projects/9/members/', { user_id: 15 })
  })

  // E06 & E07: Member removal & deactivation
  it('E06 POST: removeMember calls projects/{id}/members/{uid}/remove/', async () => {
    const payload = { reason: 'Resigned', decisions: [] }
    api.post.mockResolvedValueOnce({ data: { id: 9 } })
    await projectsApi.removeMember(9, 15, payload)
    expect(api.post).toHaveBeenCalledWith('projects/9/members/15/remove/', payload)
  })

  it('E07 POST: deactivateMember calls projects/{id}/members/{uid}/deactivate/', async () => {
    const payload = { reason: 'On Leave', decisions: [] }
    api.post.mockResolvedValueOnce({ data: { id: 9 } })
    await projectsApi.deactivateMember(9, 15, payload)
    expect(api.post).toHaveBeenCalledWith('projects/9/members/15/deactivate/', payload)
  })

  // E08: Solo to Team conversion
  it('E08 POST: setStaffingMode calls projects/{id}/staffing-mode/', async () => {
    const payload = { staffing_mode: 'TEAM', member_id: 18 }
    api.post.mockResolvedValueOnce({ data: { id: 9, staffing_mode: 'TEAM' } })
    await projectsApi.setStaffingMode(9, payload)
    expect(api.post).toHaveBeenCalledWith('projects/9/staffing-mode/', payload)
  })

  // E09 to E14: Lifecycle transitions
  it('E09 to E14: lifecycle actions hit correct endpoints', async () => {
    api.post.mockResolvedValue({ data: { id: 9 } })

    await projectsApi.activateProject(9)
    expect(api.post).toHaveBeenCalledWith('projects/9/activate/', { reason: '' })

    await projectsApi.holdProject(9, 'Budget pause')
    expect(api.post).toHaveBeenCalledWith('projects/9/hold/', { reason: 'Budget pause' })

    await projectsApi.resumeProject(9)
    expect(api.post).toHaveBeenCalledWith('projects/9/resume/', { reason: '' })

    await projectsApi.cancelSoloProject(9, 'Cancelled by CEO')
    expect(api.post).toHaveBeenCalledWith('projects/9/cancel/', { reason: 'Cancelled by CEO' })

    await projectsApi.archiveProject(9)
    expect(api.post).toHaveBeenCalledWith('projects/9/archive/', { reason: '' })

    await projectsApi.reactivateProject(9)
    expect(api.post).toHaveBeenCalledWith('projects/9/reactivate/', { reason: '' })
  })

  // E15 to E18: Closure workflow
  it('E15 to E18: closure workflow methods', async () => {
    api.post.mockResolvedValue({ data: { id: 9 } })
    api.get.mockResolvedValue({ data: { blockers: [] } })

    await projectsApi.requestClosure(9)
    expect(api.post).toHaveBeenCalledWith('projects/9/closure/request/', { reason: '' })

    await projectsApi.getClosureBlockers(9)
    expect(api.get).toHaveBeenCalledWith('projects/9/closure/blockers/')

    await projectsApi.approveClosure(9)
    expect(api.post).toHaveBeenCalledWith('projects/9/closure/approve/', { reason: '' })

    await projectsApi.rejectClosure(9, 'Incomplete tests')
    expect(api.post).toHaveBeenCalledWith('projects/9/closure/reject/', { reason: 'Incomplete tests' })
  })

  // E19: Work updates
  it('E19 GET & POST: recordWorkUpdate with json and multipart', async () => {
    api.get.mockResolvedValueOnce({ data: [] })
    await projectsApi.getWorkUpdates(9, 41)
    expect(api.get).toHaveBeenCalledWith('projects/9/tasks/41/work-updates/')

    const jsonPayload = { progress: 80, note: 'Implemented UI' }
    api.post.mockResolvedValueOnce({ data: { id: 1 } })
    await projectsApi.recordWorkUpdate(9, 41, jsonPayload, false)
    expect(api.post).toHaveBeenCalledWith('projects/9/tasks/41/work-updates/', jsonPayload, {})

    const formData = new FormData()
    formData.append('progress', '100')
    api.post.mockResolvedValueOnce({ data: { id: 2 } })
    await projectsApi.recordWorkUpdate(9, 41, formData, true)
    expect(api.post).toHaveBeenCalledWith(
      'projects/9/tasks/41/work-updates/',
      formData,
      expect.objectContaining({ headers: { 'Content-Type': 'multipart/form-data' } })
    )
  })

  // E20, E21, E24: Task review & file download
  it('E20, E21, E24: completion review and binary stream download', async () => {
    api.get.mockResolvedValueOnce({ data: { task_id: 41 } })
    await projectsApi.getTaskWorkflow(9, 41)
    expect(api.get).toHaveBeenCalledWith('projects/9/tasks/41/workflow/')

    api.post.mockResolvedValueOnce({ data: { status: 'COMPLETED' } })
    await projectsApi.decideCompletion(9, 41, 15, { decision: 'APPROVE' })
    expect(api.post).toHaveBeenCalledWith('projects/9/tasks/41/completion-submissions/15/decision/', { decision: 'APPROVE' })

    api.get.mockResolvedValueOnce(new Blob())
    await projectsApi.downloadDeliverableFile(9, 41, 15, 3)
    expect(api.get).toHaveBeenCalledWith(
      'projects/9/tasks/41/completion-submissions/15/files/3/',
      expect.objectContaining({ responseType: 'blob' })
    )
  })

  // E22 & E23: Task-Change Requests
  it('E22 & E23: TCR create, list, and decision', async () => {
    api.get.mockResolvedValueOnce({ data: [] })
    await projectsApi.getChangeRequests(9, 41)
    expect(api.get).toHaveBeenCalledWith('projects/9/tasks/41/change-requests/')

    const tcrPayload = { operation: 'EXTEND_DEADLINE', reason: 'Blocked' }
    api.post.mockResolvedValueOnce({ data: { id: 5 } })
    await projectsApi.createChangeRequest(9, 41, tcrPayload)
    expect(api.post).toHaveBeenCalledWith('projects/9/tasks/41/change-requests/', tcrPayload)

    api.post.mockResolvedValueOnce({ data: { status: 'APPROVED' } })
    await projectsApi.decideChangeRequest(9, 5, { decision: 'APPROVE' })
    expect(api.post).toHaveBeenCalledWith('projects/9/change-requests/5/decision/', { decision: 'APPROVE' })
  })

  // E25 & E26: Approver reassignment
  it('E25 & E26: reassign completion and change approvers', async () => {
    api.post.mockResolvedValue({ data: { success: true } })

    await projectsApi.reassignCompletionApprover(9, 41, 15, { stage: 'PM', new_approver_id: 20 })
    expect(api.post).toHaveBeenCalledWith('projects/9/tasks/41/completion-submissions/15/reassign-approver/', {
      stage: 'PM',
      new_approver_id: 20,
    })

    await projectsApi.reassignChangeApprover(9, 5, { stage: 'DIRECT', new_approver_id: 20 })
    expect(api.post).toHaveBeenCalledWith('projects/9/change-requests/5/reassign-approver/', {
      stage: 'DIRECT',
      new_approver_id: 20,
    })
  })

  // E27, E28, E29: Team cancellation
  it('E27, E28, E29: team cancellation request, approve, and reject', async () => {
    api.get.mockResolvedValueOnce({ data: { pending: null } })
    await projectsApi.getCancellationRequest(9)
    expect(api.get).toHaveBeenCalledWith('projects/9/cancellation-requests/')

    api.post.mockResolvedValueOnce({ data: { id: 1 } })
    await projectsApi.requestCancellation(9, 'Client terminated scope')
    expect(api.post).toHaveBeenCalledWith('projects/9/cancellation-requests/', { reason: 'Client terminated scope' })

    api.post.mockResolvedValueOnce({ data: { status: 'CANCELLED' } })
    await projectsApi.approveCancellation(9, 1)
    expect(api.post).toHaveBeenCalledWith('projects/9/cancellation-requests/1/approve/', { reason: '' })

    api.post.mockResolvedValueOnce({ data: { status: 'ACTIVE' } })
    await projectsApi.rejectCancellation(9, 1, 'Continue work')
    expect(api.post).toHaveBeenCalledWith('projects/9/cancellation-requests/1/reject/', { reason: 'Continue work' })
  })

  // E30 to E34: Tasks CRUD & actions
  it('E30 to E34: task management endpoints', async () => {
    api.get.mockResolvedValueOnce({ data: { results: [] } })
    await projectsApi.getTasks(9, { status: 'IN_PROGRESS', assignee_id: 12 })
    expect(api.get).toHaveBeenCalledWith('projects/9/tasks/', { params: { status: 'IN_PROGRESS', assignee_id: 12 } })

    const taskPayload = { title: 'Implement E30', assignee_id: 12, due_date: '2026-12-01' }
    api.post.mockResolvedValueOnce({ data: { id: 41 } })
    await projectsApi.createTask(9, taskPayload)
    expect(api.post).toHaveBeenCalledWith('projects/9/tasks/', taskPayload)

    api.get.mockResolvedValueOnce({ data: { id: 41 } })
    await projectsApi.getTaskDetail(9, 41)
    expect(api.get).toHaveBeenCalledWith('projects/9/tasks/41/')

    api.patch.mockResolvedValueOnce({ data: { id: 41, title: 'Updated' } })
    await projectsApi.updateTask(9, 41, { title: 'Updated' })
    expect(api.patch).toHaveBeenCalledWith('projects/9/tasks/41/', { title: 'Updated' })

    api.post.mockResolvedValueOnce({ data: { id: 41 } })
    await projectsApi.assignTask(9, 41, { user_id: 14, reason: 'Rebalancing' })
    expect(api.post).toHaveBeenCalledWith('projects/9/tasks/41/assign/', { user_id: 14, reason: 'Rebalancing' })

    api.post.mockResolvedValueOnce({ data: { id: 41, status: 'IN_PROGRESS' } })
    await projectsApi.setTaskStatus(9, 41, 'IN_PROGRESS')
    expect(api.post).toHaveBeenCalledWith('projects/9/tasks/41/status/', { status: 'IN_PROGRESS' })

    api.post.mockResolvedValueOnce({ data: { id: 41, status: 'CANCELLED' } })
    await projectsApi.cancelTask(9, 41, 'Obsolete')
    expect(api.post).toHaveBeenCalledWith('projects/9/tasks/41/cancel/', { reason: 'Obsolete' })
  })

  // E35: Approval queue
  it('E35 GET: getApprovalQueue calls approvals/ with pagination', async () => {
    api.get.mockResolvedValueOnce({ data: { results: [] } })
    await projectsApi.getApprovalQueue({ page: 1, page_size: 50 })
    expect(api.get).toHaveBeenCalledWith('approvals/', { params: { page: 1, page_size: 50 } })
  })
})
