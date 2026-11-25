// @vitest-environment jsdom

import { cleanup, render, screen, waitFor } from '@testing-library/react'
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
