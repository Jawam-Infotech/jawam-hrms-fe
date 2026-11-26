// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import TLProjectsView from './TLProjectsView.jsx'

vi.mock('../../../services/api/projects.api.js', () => ({
  projectsApi: { getChangeRequests: vi.fn() },
}))

afterEach(cleanup)

describe('TL dashboard completion review: requester name', () => {
  it('shows the backend requester name, and a fallback only when the name is null or missing', () => {
    render(
      <TLProjectsView
        teamReviews={[
          { id: 1, name: 'Task A', projectTitle: 'Alpha', assignee: 'Asha', requested_by_name: 'Mira Sen' },
          { id: 2, name: 'Task B', projectTitle: 'Alpha', assignee: 'Ravi', requested_by_name: null },
          { id: 3, name: 'Task C', projectTitle: 'Alpha', assignee: 'Dev' },
        ]}
      />
    )

    expect(screen.getByText('Submitted by Mira Sen')).toBeTruthy()
    expect(screen.getAllByText('Submitted by Unknown requester')).toHaveLength(2)
  })
})
