// @vitest-environment jsdom

import { describe, it, expect, vi, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import ProjectTaskTable from './ProjectTaskTable.jsx'

afterEach(cleanup)

describe('ProjectTaskTable Component Tests (Audit Fixes)', () => {
  const baseTask = {
    id: 101,
    title: 'Design API Schema',
    name: 'Design API Schema',
    assignee: 'Alice Employee',
    assignee_id: 10,
    status: 'PENDING_TL_REVIEW',
    progress: 100,
    due_date: '2026-12-31',
  }

  it('Stage 1 (PENDING_TL_REVIEW): displays Review button for TL/PM reviewer', () => {
    const tlUser = { id: 2, role: 'TL', name: 'Bob Lead' }
    render(
      <ProjectTaskTable
        tasks={[baseTask]}
        currentUser={tlUser}
        isPM={false}
        onOpenApprovalModal={vi.fn()}
      />
    )

    expect(screen.getByRole('button', { name: /review/i })).toBeDefined()
  })

  it('Zero Self-Approval: hides Review button when reviewer is the task assignee', () => {
    const assigneeUser = { id: 10, role: 'TL', name: 'Alice Employee' }
    render(
      <ProjectTaskTable
        tasks={[baseTask]}
        currentUser={assigneeUser}
        isPM={false}
        onOpenApprovalModal={vi.fn()}
      />
    )

    expect(screen.queryByRole('button', { name: /^review$/i })).toBeNull()
  })

  it('Stage 2 (PENDING_PM_APPROVAL): displays Review button for PM and CEO, but not regular member', () => {
    const pmTask = { ...baseTask, status: 'PENDING_PM_APPROVAL', assignee_id: 15 }
    const pmUser = { id: 3, role: 'PM', name: 'Carol PM' }
    const empUser = { id: 4, role: 'EMPLOYEE', name: 'Dave Dev' }

    const { rerender } = render(
      <ProjectTaskTable
        tasks={[pmTask]}
        currentUser={pmUser}
        isPM={true}
        onOpenApprovalModal={vi.fn()}
      />
    )
    expect(screen.getByRole('button', { name: /review/i })).toBeDefined()

    rerender(
      <ProjectTaskTable
        tasks={[pmTask]}
        currentUser={empUser}
        isPM={false}
        onOpenApprovalModal={vi.fn()}
      />
    )
    expect(screen.queryByRole('button', { name: /^review$/i })).toBeNull()
  })

  it('Direct/Solo Stage (DIRECT_APPROVAL_REQUIRED): only CEO can review', () => {
    const soloTask = { ...baseTask, status: 'DIRECT_APPROVAL_REQUIRED', assignee_id: 20 }
    const ceoUser = { id: 1, role: 'CEO', name: 'Eve CEO' }
    const pmUser = { id: 3, role: 'PM', name: 'Carol PM' }

    const { rerender } = render(
      <ProjectTaskTable
        tasks={[soloTask]}
        currentUser={ceoUser}
        isSolo={true}
        onOpenApprovalModal={vi.fn()}
      />
    )
    expect(screen.getByRole('button', { name: /review/i })).toBeDefined()

    rerender(
      <ProjectTaskTable
        tasks={[soloTask]}
        currentUser={pmUser}
        isSolo={true}
        isPM={true}
        onOpenApprovalModal={vi.fn()}
      />
    )
    expect(screen.queryByRole('button', { name: /^review$/i })).toBeNull()
  })

  it('Pending TCR detection: displays TCR pending badge and disables duplicate TCR button', () => {
    const taskWithPendingTcr = {
      ...baseTask,
      status: 'IN_PROGRESS',
      assignee_id: 10,
      has_pending_change_request: true,
      open_change_request: {
        id: 7,
        type: 'DEADLINE_EXTENSION',
        status: 'PENDING_TL_REVIEW',
      },
    }
    const assigneeUser = { id: 10, role: 'EMPLOYEE', name: 'Alice Employee' }

    render(
      <ProjectTaskTable
        tasks={[taskWithPendingTcr]}
        currentUser={assigneeUser}
        onOpenChangeRequestModal={vi.fn()}
      />
    )

    expect(screen.getByText(/📝 TCR Pending:/i)).toBeDefined()
    expect(screen.getByText(/Deadline Extension/i)).toBeDefined()

    const tcrButton = screen.getByRole('button', { name: /TCR Pending/i })
    expect(tcrButton.hasAttribute('disabled')).toBe(true)
  })

  it('Task rejection display: renders rejection feedback directly from backend task data', () => {
    const rejectedTask = {
      ...baseTask,
      status: 'IN_PROGRESS',
      isRejected: true,
      reworkCount: 2,
      rejectionFeedback: 'Scope was incomplete, please add unit tests',
    }
    const assigneeUser = { id: 10, role: 'EMPLOYEE', name: 'Alice Employee' }

    render(
      <ProjectTaskTable
        tasks={[rejectedTask]}
        currentUser={assigneeUser}
      />
    )

    expect(screen.getByText(/Rejected \(2 times\)/i)).toBeDefined()
    expect(screen.getByText(/Scope was incomplete, please add unit tests/i)).toBeDefined()
  })
})
