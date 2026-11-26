// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import TcrRejectionReasons from './TcrRejectionReasons.jsx'

vi.mock('../../../services/api/projects.api.js', () => ({
  projectsApi: { getChangeRequests: vi.fn() },
}))

import { projectsApi } from '../../../services/api/projects.api.js'

const change = (overrides = {}) => ({
  id: 1,
  operation: 'EXTEND_DEADLINE',
  state: 'REJECTED',
  rejection_reason: 'The new date is unrealistic.',
  ...overrides,
})

afterEach(cleanup)

describe('TcrRejectionReasons', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows the rejection reason the change-request endpoint returns for a rejected request', async () => {
    projectsApi.getChangeRequests.mockResolvedValue({ data: [change()] })
    render(<TcrRejectionReasons projectId={7} taskId={101} />)

    expect(await screen.findByText('The new date is unrealistic.')).toBeTruthy()
    expect(screen.getByText('Deadline extension:')).toBeTruthy()
    expect(projectsApi.getChangeRequests).toHaveBeenCalledWith(7, 101)
  })

  it('shows nothing when the backend returns a null rejection_reason (the viewer may not see it)', async () => {
    projectsApi.getChangeRequests.mockResolvedValue({ data: [change({ rejection_reason: null })] })
    const { container } = render(<TcrRejectionReasons projectId={7} taskId={101} />)

    await vi.waitFor(() => expect(projectsApi.getChangeRequests).toHaveBeenCalled())
    expect(container.querySelector('[data-testid="tcr-rejection-reasons"]')).toBeNull()
  })

  it('shows nothing for pending, approved or closed requests', async () => {
    projectsApi.getChangeRequests.mockResolvedValue({
      data: [change({ state: 'PENDING', rejection_reason: null }), change({ id: 2, state: 'APPROVED', rejection_reason: null })],
    })
    const { container } = render(<TcrRejectionReasons projectId={7} taskId={101} />)

    await vi.waitFor(() => expect(projectsApi.getChangeRequests).toHaveBeenCalled())
    expect(container.querySelector('[data-testid="tcr-rejection-reasons"]')).toBeNull()
  })

  it('shows nothing when the request fails, rather than showing a stale or inferred reason', async () => {
    projectsApi.getChangeRequests.mockRejectedValue(new Error('Forbidden'))
    const { container } = render(<TcrRejectionReasons projectId={7} taskId={101} />)

    await vi.waitFor(() => expect(projectsApi.getChangeRequests).toHaveBeenCalled())
    expect(container.querySelector('[data-testid="tcr-rejection-reasons"]')).toBeNull()
  })

  it('does not call the endpoint without a project and task', () => {
    render(<TcrRejectionReasons projectId={null} taskId={101} />)
    expect(projectsApi.getChangeRequests).not.toHaveBeenCalled()
  })
})
