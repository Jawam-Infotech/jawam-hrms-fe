// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import TLProjectRequestModal from './TLProjectRequestModal.jsx'
import TaskDetailModal from './TaskDetailModal.jsx'
import TaskChangeReviewModal from './TaskChangeReviewModal.jsx'

afterEach(cleanup)

describe('project clarification and task field mappings', () => {
  it('renders decision_reason as the CEO clarification note', () => {
    render(
      <TLProjectRequestModal
        isOpen
        onClose={vi.fn()}
        onSubmit={vi.fn()}
        initialData={{
          name: 'Project',
          decision_reason: 'Please adjust the proposed dates.',
        }}
        isEditing
      />
    )

    expect(screen.getByText(/Please adjust the proposed dates/i)).toBeDefined()
  })

  it('does not display unsupported task priority', () => {
    render(
      <TaskDetailModal
        isOpen
        onClose={vi.fn()}
        task={{
          id: 1,
          name: 'Backend task',
          priority: 'High',
        }}
      />
    )

    expect(screen.queryByText(/Priority:/i)).toBeNull()
  })

  it('does not render unsupported priority selector in project creation request modal', () => {
    render(
      <TLProjectRequestModal
        isOpen
        onClose={vi.fn()}
        onSubmitRequest={vi.fn()}
      />
    )

    expect(screen.queryByRole('combobox', { name: /priority/i })).toBeNull()
    expect(screen.queryByText(/^Priority$/i)).toBeNull()
  })

  it('TaskChangeReviewModal: disables decision buttons when task has can_decide: true but open_change_request is absent', () => {
    const taskWithoutTcr = {
      id: 10,
      name: 'Task without TCR',
      can_decide: true,
      open_change_request: null,
    }

    render(
      <TaskChangeReviewModal
        isOpen
        task={taskWithoutTcr}
        onClose={vi.fn()}
        onApprove={vi.fn()}
        onReject={vi.fn()}
      />
    )

    const approveBtn = screen.getByRole('button', { name: /approve tcr/i })
    const rejectBtn = screen.getByRole('button', { name: /reject tcr/i })

    expect(approveBtn.hasAttribute('disabled')).toBe(true)
    expect(rejectBtn.hasAttribute('disabled')).toBe(true)
  })
})
