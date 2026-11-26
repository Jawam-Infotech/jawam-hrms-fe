// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import TaskWorkUpdateModal from './TaskWorkUpdateModal.jsx'

afterEach(cleanup)

const rejectedTask = {
  id: 101,
  title: 'Login page',
  name: 'Login page',
  status: 'IN_PROGRESS',
  progress: 60,
  reworkCount: 2,
  rejectionFeedback: 'Typed reviewer reason that must not show',
  rejection_feedback: 'Typed reviewer reason that must not show',
  rejection_reason: 'Typed reviewer reason that must not show',
}

describe('TaskWorkUpdateModal reviewer feedback', () => {
  it('does not display a typed reviewer reason from the task', () => {
    render(<TaskWorkUpdateModal isOpen onClose={() => {}} task={rejectedTask} onSubmitUpdate={vi.fn()} />)

    expect(screen.queryByText(/Typed reviewer reason that must not show/)).toBeNull()
    expect(screen.queryByText(/TL \/ Reviewer Feedback/i)).toBeNull()
  })

  it('still renders the work-update form for the same task', () => {
    render(<TaskWorkUpdateModal isOpen onClose={() => {}} task={rejectedTask} onSubmitUpdate={vi.fn()} />)

    expect(screen.getByText('Submit Work Update')).toBeTruthy()
  })
})
