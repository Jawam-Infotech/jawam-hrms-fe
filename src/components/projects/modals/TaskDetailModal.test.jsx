// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import TaskDetailModal from './TaskDetailModal.jsx'

vi.mock('../../../services/api/projects.api.js', () => ({
  projectsApi: { getChangeRequests: vi.fn() },
}))

import { projectsApi } from '../../../services/api/projects.api.js'

const baseTask = {
  id: 101,
  project: 7,
  title: 'Login page',
  status: 'IN_PROGRESS',
  progress: 60,
  description: 'Build the page.',
}

afterEach(cleanup)

describe('TaskDetailModal rejection display', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    projectsApi.getChangeRequests.mockResolvedValue({ data: [] })
  })

  it('shows the completion rejection generically, even when the task row carries a reviewer reason field', () => {
    render(
      <TaskDetailModal
        isOpen
        onClose={() => {}}
        task={{ ...baseTask, reworkCount: 1, rejection_reason: 'Secret reviewer note', rejection_feedback: 'Also secret' }}
      />
    )

    expect(screen.getByText(/The deliverable was rejected by the reviewer/i)).toBeTruthy()
    expect(screen.queryByText(/Secret reviewer note/)).toBeNull()
    expect(screen.queryByText(/Also secret/)).toBeNull()
  })

  it('shows no rejection callout for a task that has not been rejected', () => {
    render(<TaskDetailModal isOpen onClose={() => {}} task={{ ...baseTask, reworkCount: 0 }} />)

    expect(screen.queryByText(/The deliverable was rejected by the reviewer/i)).toBeNull()
  })

  it('shows the TCR rejection reason from the change-request endpoint', async () => {
    projectsApi.getChangeRequests.mockResolvedValue({
      data: [{ id: 5, operation: 'DELETE_TASK', state: 'REJECTED', rejection_reason: 'Still needed for the release.' }],
    })
    render(<TaskDetailModal isOpen onClose={() => {}} task={baseTask} />)

    expect(await screen.findByText('Still needed for the release.')).toBeTruthy()
    expect(projectsApi.getChangeRequests).toHaveBeenCalledWith(7, 101)
  })

  it('shows no TCR reason when the endpoint returns a null reason for the viewer', async () => {
    projectsApi.getChangeRequests.mockResolvedValue({
      data: [{ id: 5, operation: 'DELETE_TASK', state: 'REJECTED', rejection_reason: null }],
    })
    render(<TaskDetailModal isOpen onClose={() => {}} task={baseTask} />)

    await vi.waitFor(() => expect(projectsApi.getChangeRequests).toHaveBeenCalled())
    expect(screen.queryByTestId('tcr-rejection-reasons')).toBeNull()
  })
})
