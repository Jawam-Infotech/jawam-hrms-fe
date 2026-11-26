// @vitest-environment jsdom

import { cleanup, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { UserContext } from '../../context/UserContext.jsx'
import ProjectDetails from './ProjectDetails.jsx'

vi.mock('../../layouts/DashboardLayout', () => ({
  default: ({ children }) => <div data-testid="dashboard-layout">{children}</div>,
}))

vi.mock('../../services/api/projects.api.js', () => ({
  projectsApi: {
    getProjectDetail: vi.fn(),
    getMembers: vi.fn(),
    getTasks: vi.fn(),
    getCancellationRequest: vi.fn(),
    getClosureBlockers: vi.fn(),
  },
}))

import { projectsApi } from '../../services/api/projects.api.js'

const TYPED = 'Typed reviewer reason on the task row'

const project = {
  id: 1,
  name: 'Alpha',
  status: 'ACTIVE',
  staffing_mode: 'TEAM',
  current_pm_id: 10,
  primary_pm_id: 10,
  members: [],
}

const pmUser = { id: 10, role: 'TL', name: 'PM Lead' }

const taskRow = (overrides = {}) => ({
  id: 101,
  title: 'Login page',
  status: 'IN_PROGRESS',
  progress: 60,
  assignee_id: 10,
  project: 1,
  due_date: '2027-01-01',
  rejection_count: 1,
  rejection_feedback: TYPED,
  rejection_reason: TYPED,
  latest_rejection_reason: TYPED,
  rework_reason: TYPED,
  ...overrides,
})

function renderProjectDetails() {
  return render(
    <MemoryRouter initialEntries={['/projects/1']}>
      <UserContext.Provider value={{ user: pmUser, refreshUser: vi.fn() }}>
        <Routes>
          <Route path="/projects/:projectId" element={<ProjectDetails />} />
        </Routes>
      </UserContext.Provider>
    </MemoryRouter>
  )
}

function mockWorkspace(tasks) {
  projectsApi.getProjectDetail.mockResolvedValue({ data: project })
  projectsApi.getMembers.mockResolvedValue({
    data: { results: [{ user_id: 10, name: 'PM Lead', is_active: true, is_current_pm: true, role: 'TL' }] },
  })
  projectsApi.getTasks.mockResolvedValue({ data: { results: tasks, count: tasks.length, next: null } })
  projectsApi.getCancellationRequest.mockResolvedValue({ data: null })
  projectsApi.getClosureBlockers.mockResolvedValue({ data: { blockers: [] } })
}

afterEach(cleanup)

describe('ProjectDetails task normalization (regression)', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows the generic rework message for a rejected task and never the typed reviewer reason from its row', async () => {
    mockWorkspace([taskRow()])
    renderProjectDetails()

    expect(await screen.findByText('Rework requested by reviewer.')).toBeTruthy()
    expect(screen.queryByText(new RegExp(TYPED))).toBeNull()
  })

  it('derives the rejected state from the rework count alone, so a reason field on an un-rejected task is not shown', async () => {
    mockWorkspace([taskRow({ rejection_count: 0 })])
    renderProjectDetails()

    expect(await screen.findByText('Login page')).toBeTruthy()
    expect(screen.queryByText('Rework requested by reviewer.')).toBeNull()
    expect(screen.queryByText(new RegExp(TYPED))).toBeNull()
  })

  it('still loads the workspace from the project and task APIs', async () => {
    mockWorkspace([taskRow()])
    renderProjectDetails()

    await waitFor(() => {
      expect(projectsApi.getProjectDetail).toHaveBeenCalledWith('1')
    })
    expect(projectsApi.getTasks).toHaveBeenCalled()
  })
})
