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
    open_completion_submission: {
      id: 501,
      can_decide: true,
    },
    can_decide: true,
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
    const assigneeTask = {
      ...baseTask,
      can_decide: false,
      open_completion_submission: {
        id: 501,
        can_decide: false,
      },
    }
    const assigneeUser = { id: 10, role: 'TL', name: 'Alice Employee' }
    render(
      <ProjectTaskTable
        tasks={[assigneeTask]}
        currentUser={assigneeUser}
        isPM={false}
        onOpenApprovalModal={vi.fn()}
      />
    )

    expect(screen.queryByRole('button', { name: /^review$/i })).toBeNull()
  })

  it('Stage 2 (PENDING_PM_APPROVAL): displays Review button for PM and CEO, but not regular member', () => {
    const pmTask = { ...baseTask, status: 'PENDING_PM_APPROVAL', assignee_id: 15, can_decide: true }
    const pmUser = { id: 3, role: 'PM', name: 'Carol PM' }
    const empUser = { id: 4, role: 'EMPLOYEE', name: 'Dave Dev' }
    const empTask = {
      ...pmTask,
      can_decide: false,
      open_completion_submission: { id: 501, can_decide: false },
    }

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
        tasks={[empTask]}
        currentUser={empUser}
        isPM={false}
        onOpenApprovalModal={vi.fn()}
      />
    )
    expect(screen.queryByRole('button', { name: /^review$/i })).toBeNull()
  })

  it('Direct/Solo Stage (DIRECT_APPROVAL_REQUIRED): only CEO can review', () => {
    const soloTask = { ...baseTask, status: 'DIRECT_APPROVAL_REQUIRED', assignee_id: 20, can_decide: true }
    const ceoUser = { id: 1, role: 'CEO', name: 'Eve CEO' }
    const pmUser = { id: 3, role: 'PM', name: 'Carol PM' }
    const pmTask = {
      ...soloTask,
      can_decide: false,
      open_completion_submission: { id: 501, can_decide: false },
    }

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
        tasks={[pmTask]}
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
      open_change_request: {
        id: 7,
        type: 'DEADLINE_EXTENSION',
        state: 'PENDING_TL_REVIEW',
        can_decide: true,
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

  it('does not show review actions when can_decide is missing', () => {
    const taskWithoutPermission = {
      ...baseTask,
      open_completion_submission: {
        id: 502,
        can_decide: false,
      },
      can_decide: false,
    }

    render(
      <ProjectTaskTable
        tasks={[taskWithoutPermission]}
        currentUser={{ id: 2, role: 'TL', name: 'Bob Lead' }}
        onOpenApprovalModal={vi.fn()}
      />
    )

    expect(screen.queryByRole('button', { name: /^review$/i })).toBeNull()
  })

  it('uses open_completion_submission and not task status for completion review presence', () => {
    const taskWithoutSubmission = {
      ...baseTask,
      status: 'PENDING_TL_REVIEW',
      open_completion_submission: null,
      can_decide: true,
    }

    render(
      <ProjectTaskTable
        tasks={[taskWithoutSubmission]}
        currentUser={{ id: 2, role: 'TL', name: 'Bob Lead' }}
        onOpenApprovalModal={vi.fn()}
      />
    )

    expect(screen.queryByRole('button', { name: /^review$/i })).toBeNull()
  })

  it('displays assignee names without User # fallback IDs', () => {
    render(
      <ProjectTaskTable
        tasks={[{ ...baseTask, assignee: null, assignee_name: 'Alice Employee', assignee_id: 10 }]}
        currentUser={{ id: 2, role: 'TL', name: 'Bob Lead' }}
      />
    )

    expect(screen.getByText(/Alice Employee/i)).toBeDefined()
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

  it('TCR status and action mapping: maps DELETE_TASK operation to Task Deletion and displays state', () => {
    const taskWithDeleteTcr = {
      ...baseTask,
      status: 'IN_PROGRESS',
      assignee_id: 10,
      open_change_request: {
        id: 8,
        operation: 'DELETE_TASK',
        state: 'PENDING_TL_REVIEW',
        can_decide: true,
      },
    }
    const assigneeUser = { id: 10, role: 'EMPLOYEE', name: 'Alice Employee' }

    render(
      <ProjectTaskTable
        tasks={[taskWithDeleteTcr]}
        currentUser={assigneeUser}
        onOpenChangeRequestModal={vi.fn()}
      />
    )

    expect(screen.getByText(/Task Deletion/i)).toBeDefined()
    expect(screen.getByText(/Under TL Review/i)).toBeDefined()
  })

  it('TCR mapping ignores legacy status when state is present or missing', () => {
    const taskWithConflictingStatus = {
      ...baseTask,
      status: 'IN_PROGRESS',
      assignee_id: 10,
      open_change_request: {
        id: 9,
        operation: 'DELETE_TASK',
        state: 'PENDING_PM_APPROVAL',
        status: 'PENDING_TL_REVIEW',
        can_decide: true,
      },
    }

    const { rerender } = render(
      <ProjectTaskTable
        tasks={[taskWithConflictingStatus]}
        currentUser={{ id: 10, role: 'EMPLOYEE', name: 'Alice Employee' }}
        onOpenChangeRequestModal={vi.fn()}
      />
    )

    expect(screen.queryByText(/Under TL Review/i)).toBeNull()
    expect(screen.getByText('Awaiting PM Approval')).toBeDefined()

    rerender(
      <ProjectTaskTable
        tasks={[{
          ...taskWithConflictingStatus,
          open_change_request: {
            id: 9,
            operation: 'DELETE_TASK',
            status: 'PENDING_TL_REVIEW',
            can_decide: true,
          },
        }]}
        currentUser={{ id: 10, role: 'EMPLOYEE', name: 'Alice Employee' }}
        onOpenChangeRequestModal={vi.fn()}
      />
    )

    expect(screen.queryByText(/Under TL Review/i)).toBeNull()
  })

  it('Strict permission: does not grant review when task.can_decide is true but open_completion_submission.can_decide is false', () => {
    const strictTask = {
      ...baseTask,
      can_decide: true,
      open_completion_submission: {
        id: 501,
        can_decide: false,
      },
    }
    const tlUser = { id: 2, role: 'TL', name: 'Bob Lead' }

    render(
      <ProjectTaskTable
        tasks={[strictTask]}
        currentUser={tlUser}
        onOpenApprovalModal={vi.fn()}
      />
    )

    expect(screen.queryByRole('button', { name: /^review$/i })).toBeNull()
  })
})
