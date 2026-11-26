// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import EmployeeProjectsView from './EmployeeProjectsView.jsx'

afterEach(cleanup)

const TYPED = 'Typed reviewer reason that must not show'

const qualityRiskTask = {
  id: 7,
  name: 'Payment flow',
  title: 'Payment flow',
  status: 'IN_PROGRESS',
  isRejected: true,
  reworkCount: 3,
  quality_risk: true,
  isQualityRisk: true,
  rejectionFeedback: TYPED,
  rejection_feedback: TYPED,
  rejection_reason: TYPED,
  projectTitle: 'Alpha',
  progress: 40,
  assignee_id: 3,
}

describe('EmployeeProjectsView quality-risk banner', () => {
  beforeEach(() => {
    // The banner is hidden once dismissed, and dismissals persist in localStorage. Start each test from a clean state.
    localStorage.clear()
  })

  it('renders the quality-risk banner with its task, rejection count and warning, without the typed reviewer reason', () => {
    render(<EmployeeProjectsView projects={[]} myTasks={[qualityRiskTask]} currentUser={{ id: 3, role: 'EMPLOYEE' }} />)

    // The banner's title is unique. The task name and count text may also appear in the task list, so match them as a set.
    expect(screen.getByText('Quality Risk Warning')).toBeTruthy()
    expect(screen.getAllByText(/Task: Payment flow/).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/Task has undergone 3 rejections/).length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText(/Schedule a sync meeting with the assignee/).length).toBeGreaterThanOrEqual(1)

    expect(screen.queryByText(new RegExp(TYPED))).toBeNull()
    expect(screen.queryByText(/Latest Reviewer Feedback/i)).toBeNull()
    expect(screen.queryByText(/Reason:/)).toBeNull()
  })

  it('shows no quality-risk banner below three rejections', () => {
    const belowThreshold = { ...qualityRiskTask, id: 8, reworkCount: 2 }
    render(<EmployeeProjectsView projects={[]} myTasks={[belowThreshold]} currentUser={{ id: 3, role: 'EMPLOYEE' }} />)

    expect(screen.queryByText('Quality Risk Warning')).toBeNull()
    expect(screen.queryByText(new RegExp(TYPED))).toBeNull()
  })
})
