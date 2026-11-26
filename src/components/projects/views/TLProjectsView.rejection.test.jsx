// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import TLProjectsView from './TLProjectsView.jsx'

afterEach(cleanup)

const TYPED = 'Typed reviewer reason that must not show'

describe('TL dashboard rejected task rows', () => {
  it('keeps the rejection count indicator and never shows the typed reviewer reason', () => {
    const rejectedTask = {
      id: 9,
      name: 'Checkout',
      title: 'Checkout',
      status: 'IN_PROGRESS',
      isRejected: true,
      reworkCount: 2,
      rejectionFeedback: TYPED,
      rejection_feedback: TYPED,
      rejection_reason: TYPED,
      projectTitle: 'Alpha',
      progress: 50,
    }
    render(<TLProjectsView projects={[]} myTasks={[rejectedTask]} currentUser={{ id: 10, role: 'TL' }} />)

    expect(screen.getByText(/Rejected \(2×\)/)).toBeTruthy()
    expect(screen.queryByText(new RegExp(TYPED))).toBeNull()
    expect(screen.queryByText(/Rework requested/i)).toBeNull()
  })
})
