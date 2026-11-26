// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import ProjectAuditTimeline from './ProjectAuditTimeline.jsx'

vi.mock('../../../services/api/projects.api.js', () => ({
  projectsApi: { getAuditTimeline: vi.fn() },
}))

import { projectsApi } from '../../../services/api/projects.api.js'

const pageOf = (results, extra = {}) => ({ data: { count: results.length, next: null, previous: null, results, ...extra } })

const event = (overrides = {}) => ({
  id: 1,
  created_at: '2026-11-20T10:00:00Z',
  action: 'MEMBER_ADDED',
  entity_type: 'project_member',
  entity_id: '4',
  actor: { id: 9, name: 'Asha Rao' },
  details: { new_status: 'ACTIVE' },
  ...overrides,
})

afterEach(cleanup)

describe('ProjectAuditTimeline', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows a loading state, then the entries with action, actor, entity type and allowlisted details', async () => {
    projectsApi.getAuditTimeline.mockResolvedValue(pageOf([event()]))
    render(<ProjectAuditTimeline projectId={7} />)

    expect(screen.getByText(/Loading audit timeline/i)).toBeTruthy()
    expect(await screen.findByText('Member added')).toBeTruthy()
    expect(screen.getByText('Asha Rao')).toBeTruthy()
    expect(screen.getByText(/project_member/)).toBeTruthy()
    expect(screen.getByText('New status: ACTIVE')).toBeTruthy()
    expect(projectsApi.getAuditTimeline).toHaveBeenCalledWith(7, { page: 1, page_size: 20, action: undefined })
  })

  it('never displays a reason field or a detail key outside the allowlist', async () => {
    projectsApi.getAuditTimeline.mockResolvedValue(pageOf([
      event({ reason: 'Secret scope note', details: { reason: 'Secret scope note', secret_key: 'x', operation: 'REASSIGN' } }),
    ]))
    render(<ProjectAuditTimeline projectId={7} />)

    await screen.findByText('Member added')
    expect(screen.queryByText(/Secret scope note/)).toBeNull()
    expect(screen.queryByText(/secret_key/)).toBeNull()
    expect(screen.getByText('Operation: REASSIGN')).toBeTruthy()
  })

  it('shows the empty state when the page has no entries', async () => {
    projectsApi.getAuditTimeline.mockResolvedValue(pageOf([]))
    render(<ProjectAuditTimeline projectId={7} />)

    expect(await screen.findByText('No audit activity recorded yet.')).toBeTruthy()
  })

  it('shows the filtered empty message when an action filter matches nothing', async () => {
    projectsApi.getAuditTimeline.mockResolvedValueOnce(pageOf([event()]))
    projectsApi.getAuditTimeline.mockResolvedValueOnce(pageOf([]))
    render(<ProjectAuditTimeline projectId={7} />)
    await screen.findByText('Member added')

    fireEvent.change(screen.getByLabelText('Filter by action'), { target: { value: 'PROJECT_ARCHIVED' } })

    expect(await screen.findByText('No audit events match this filter.')).toBeTruthy()
  })

  it('shows a forbidden message on 403 and offers no retry', async () => {
    projectsApi.getAuditTimeline.mockRejectedValue({ response: { status: 403, data: { detail: 'no' } } })
    render(<ProjectAuditTimeline projectId={7} />)

    expect(await screen.findByText(/does not have access to this project/i)).toBeTruthy()
    expect(screen.queryByRole('button', { name: /Retry/i })).toBeNull()
  })

  it('shows an error with a retry that reloads the timeline', async () => {
    projectsApi.getAuditTimeline.mockRejectedValueOnce(new Error('Network down'))
    projectsApi.getAuditTimeline.mockResolvedValueOnce(pageOf([event()]))
    render(<ProjectAuditTimeline projectId={7} />)

    fireEvent.click(await screen.findByRole('button', { name: /Retry/i }))

    expect(await screen.findByText('Member added')).toBeTruthy()
    expect(projectsApi.getAuditTimeline).toHaveBeenCalledTimes(2)
  })

  it('pages forward with the next page and back with the previous page', async () => {
    projectsApi.getAuditTimeline.mockResolvedValueOnce(pageOf([event()], { next: 'page=2', previous: null }))
    projectsApi.getAuditTimeline.mockResolvedValueOnce(pageOf([event({ id: 2, action: 'TASK_CREATED' })], { next: null, previous: 'page=1' }))
    render(<ProjectAuditTimeline projectId={7} />)
    await screen.findByText('Member added')

    expect(screen.getByRole('button', { name: 'Previous' }).disabled).toBe(true)
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))

    expect(await screen.findByText('Task created')).toBeTruthy()
    expect(projectsApi.getAuditTimeline).toHaveBeenLastCalledWith(7, { page: 2, page_size: 20, action: undefined })
    expect(screen.getByRole('button', { name: 'Next' }).disabled).toBe(true)
  })

  it('applies an action filter and returns to page one', async () => {
    projectsApi.getAuditTimeline.mockResolvedValueOnce(pageOf([event()], { next: 'page=2' }))
    projectsApi.getAuditTimeline.mockResolvedValueOnce(pageOf([event({ id: 2, action: 'TASK_CREATED' })]))
    projectsApi.getAuditTimeline.mockResolvedValueOnce(pageOf([event({ id: 3, action: 'CHANGE_APPROVED' })]))
    render(<ProjectAuditTimeline projectId={7} />)
    await screen.findByText('Member added')
    fireEvent.click(screen.getByRole('button', { name: 'Next' }))
    await screen.findByText('Task created')

    fireEvent.change(screen.getByLabelText('Filter by action'), { target: { value: 'CHANGE_APPROVED' } })

    expect(await screen.findByText('Change approved')).toBeTruthy()
    expect(projectsApi.getAuditTimeline).toHaveBeenLastCalledWith(7, { page: 1, page_size: 20, action: 'CHANGE_APPROVED' })
  })
})
