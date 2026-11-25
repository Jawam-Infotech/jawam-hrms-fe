// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import TLProjectRequestModal from './TLProjectRequestModal.jsx'
import TaskDetailModal from './TaskDetailModal.jsx'

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
})
