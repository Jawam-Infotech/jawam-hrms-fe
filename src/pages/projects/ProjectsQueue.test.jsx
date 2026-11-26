// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { BrowserRouter } from 'react-router-dom'
import { UserContext } from '../../context/UserContext.jsx'
import Projects from './Projects.jsx'

vi.mock('../../layouts/DashboardLayout', () => ({
  default: ({ children }) => <div data-testid="dashboard-layout">{children}</div>,
}))

vi.mock('../../services/api/index.js', () => ({
  projectsApi: {
    getProjects: vi.fn(),
    getApprovalQueue: vi.fn(),
    getProjectRequests: vi.fn(),
    getTasks: vi.fn(),
    getMembers: vi.fn(),
    decideChangeRequest: vi.fn(),
  },
}))

import { projectsApi } from '../../services/api/index.js'

afterEach(cleanup)

describe('Projects TCR Queue Backend Exclusivity', () => {
  const tlUser = {
    id: 10,
    name: 'TL Lead',
    role: 'TL',
  }

  const sampleProject = {
    id: 1,
    name: 'Alpha Project',
    status: 'ACTIVE',
  }

  const taskWithPendingTcr = {
    id: 101,
    name: 'Critical Task',
    title: 'Critical Task',
    status: 'IN_PROGRESS',
    open_change_request: {
      id: 99,
      type: 'DEADLINE_EXTENSION',
      state: 'PENDING_TL_REVIEW',
      can_decide: true,
      reason: 'Need 3 more days',
    },
  }

  beforeEach(() => {
    vi.clearAllMocks()
    projectsApi.getProjects.mockResolvedValue({
      data: { results: [sampleProject], count: 1 },
    })
    projectsApi.getProjectRequests.mockResolvedValue({
      data: { results: [] },
    })
    projectsApi.getTasks.mockResolvedValue({
      data: { results: [taskWithPendingTcr] },
    })
    projectsApi.getMembers.mockResolvedValue({
      data: { results: [{ user_id: 10, name: 'TL Lead', is_current_pm: false }] },
    })
  })

  it('renders an empty state and does not trigger fallback when queue API returns empty', async () => {
    // Backend queue returns empty
    projectsApi.getApprovalQueue.mockResolvedValue({
      data: { results: [] },
    })

    render(
      <BrowserRouter>
        <UserContext.Provider value={{ user: tlUser, refreshUser: vi.fn() }}>
          <Projects />
        </UserContext.Provider>
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.queryByText(/Loading project workspace.../i)).toBeNull()
    })

    // TCR section for TL reviews should NOT appear because queue is empty
    expect(screen.queryByText(/Task-Change Requests Awaiting TL Review/i)).toBeNull()
    expect(screen.queryByText(/Need 3 more days/i)).toBeNull()
  })

  it('displays the error state and does not silently fall back to tasks when queue API fails', async () => {
    projectsApi.getApprovalQueue.mockRejectedValue(new Error('Network error on queue endpoint'))

    render(
      <BrowserRouter>
        <UserContext.Provider value={{ user: tlUser, refreshUser: vi.fn() }}>
          <Projects />
        </UserContext.Provider>
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/Workspace Error/i)).toBeDefined()
    })
    expect(screen.getByText(/Network error on queue endpoint/i)).toBeDefined()
    expect(screen.getByRole('button', { name: /Retry Loading/i })).toBeDefined()
    // Does NOT silently fall back to tasks
    expect(screen.queryByText(/Task-Change Requests Awaiting TL Review/i)).toBeNull()
  })

  it('renders queue items exclusively from the backend approval-queue response', async () => {
    projectsApi.getApprovalQueue.mockResolvedValue({
      data: {
        results: [
          {
            id: 88,
            task_id: 101,
            task_name: 'Authorized Queue Task',
            type: 'CHANGE',
            stage: 'TL',
            requested_by_name: 'Alice Requester',
            reason: 'Official Scope Change',
          },
        ],
      },
    })

    render(
      <BrowserRouter>
        <UserContext.Provider value={{ user: tlUser, refreshUser: vi.fn() }}>
          <Projects />
        </UserContext.Provider>
      </BrowserRouter>
    )

    await waitFor(() => {
      expect(screen.getByText(/Task-Change Requests Awaiting TL Review/i)).toBeDefined()
    })

    expect(screen.getByText(/Authorized Queue Task/i)).toBeDefined()
    expect(screen.getByText(/Alice Requester/i)).toBeDefined()
  })
})

describe('Dashboard TCR queue approve and reject (regression)', () => {
  const tlUser = { id: 10, name: 'TL Lead', role: 'TL' }
  const ceoUser = { id: 1, name: 'CEO', role: 'CEO' }

  // The shape the backend approval queue actually returns for a CHANGE item (project/workflow_services.py).
  const backendChangeItem = (overrides = {}) => ({
    type: 'CHANGE',
    item_id: 88,
    project_id: 1,
    task_id: 101,
    task_title: 'Queue Task',
    operation: 'EXTEND_DEADLINE',
    stage: 'TL',
    routing: 'TL_THEN_PM',
    requested_by_id: 20,
    requested_by_name: 'Alice Requester',
    requested_at: '2026-11-20T10:00:00+05:30',
    ...overrides,
  })

  const renderDashboard = (user) => render(
    <BrowserRouter>
      <UserContext.Provider value={{ user, refreshUser: vi.fn() }}>
        <Projects />
      </UserContext.Provider>
    </BrowserRouter>
  )

  beforeEach(() => {
    vi.clearAllMocks()
    projectsApi.getProjects.mockResolvedValue({
      data: { results: [{ id: 1, name: 'Alpha Project', status: 'ACTIVE' }], count: 1 },
    })
    projectsApi.getProjectRequests.mockResolvedValue({ data: { results: [] } })
    projectsApi.getTasks.mockResolvedValue({ data: { results: [] } })
    projectsApi.getMembers.mockResolvedValue({ data: { results: [] } })
    projectsApi.decideChangeRequest.mockResolvedValue({ data: { id: 88, task_id: 101 } })
  })

  it('a TL approves a backend-queued change using the queue item id and project id', async () => {
    projectsApi.getApprovalQueue.mockResolvedValue({ data: { results: [backendChangeItem()] } })
    renderDashboard(tlUser)

    fireEvent.click(await screen.findByRole('button', { name: /Review TCR/i }))
    fireEvent.click(screen.getByRole('button', { name: /Approve TCR/i }))

    await waitFor(() => {
      expect(projectsApi.decideChangeRequest).toHaveBeenCalledWith(1, 88, { decision: 'APPROVE', reason: undefined })
    })
  })

  it('a TL rejects a backend-queued change with a reason, using the queue item id', async () => {
    projectsApi.getApprovalQueue.mockResolvedValue({ data: { results: [backendChangeItem()] } })
    renderDashboard(tlUser)

    fireEvent.click(await screen.findByRole('button', { name: /Review TCR/i }))
    fireEvent.click(screen.getByRole('button', { name: /Reject TCR/i }))
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Scope too large' } })
    fireEvent.click(screen.getByRole('button', { name: /Confirm Rejection/i }))

    await waitFor(() => {
      expect(projectsApi.decideChangeRequest).toHaveBeenCalledWith(1, 88, { decision: 'REJECT', reason: 'Scope too large' })
    })
  })

  it('a CEO approves a PM-stage queued change through the Review & Decide card', async () => {
    projectsApi.getApprovalQueue.mockResolvedValue({
      data: { results: [backendChangeItem({ stage: 'PM', routing: 'TL_THEN_PM' })] },
    })
    renderDashboard(ceoUser)

    fireEvent.click(await screen.findByRole('button', { name: /Review & Decide/i }))
    fireEvent.click(screen.getByRole('button', { name: /Approve TCR/i }))

    await waitFor(() => {
      expect(projectsApi.decideChangeRequest).toHaveBeenCalledWith(1, 88, { decision: 'APPROVE', reason: undefined })
    })
  })

  it('a queue item without an item id is not decidable: buttons are disabled and no API call is made', async () => {
    projectsApi.getApprovalQueue.mockResolvedValue({
      data: { results: [backendChangeItem({ item_id: undefined })] },
    })
    renderDashboard(tlUser)

    fireEvent.click(await screen.findByRole('button', { name: /Review TCR/i }))
    expect(screen.getByRole('button', { name: /Approve TCR/i }).disabled).toBe(true)
    expect(screen.getByRole('button', { name: /Reject TCR/i }).disabled).toBe(true)
    expect(projectsApi.decideChangeRequest).not.toHaveBeenCalled()
  })

  it('a queue item without a project id is not decidable: buttons are disabled and no API call is made', async () => {
    projectsApi.getApprovalQueue.mockResolvedValue({
      data: { results: [backendChangeItem({ project_id: undefined })] },
    })
    renderDashboard(tlUser)

    fireEvent.click(await screen.findByRole('button', { name: /Review TCR/i }))
    expect(screen.getByRole('button', { name: /Approve TCR/i }).disabled).toBe(true)
    expect(projectsApi.decideChangeRequest).not.toHaveBeenCalled()
  })
})
