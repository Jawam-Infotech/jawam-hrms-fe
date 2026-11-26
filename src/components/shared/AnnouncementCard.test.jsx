// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import AnnouncementCard from './AnnouncementCard.jsx'

afterEach(cleanup)

describe('AnnouncementCard', () => {
  it('renders birthday, anniversary, and multiple announcements', () => {
    render(<AnnouncementCard announcements={[{ id: 'b1', type: 'BIRTHDAY', employee_name: 'Asha Sharma', title: 'Happy Birthday, Asha Sharma!', body: 'Have a wonderful day.' }, { id: 'a1', type: 'ANNIVERSARY', employee_name: 'Ravi Kumar', title: 'Congratulations, Ravi!' }]} />)
    expect(screen.getByText('Happy Birthday, Asha Sharma!')).toBeTruthy()
    expect(screen.getByText('Congratulations, Ravi!')).toBeTruthy()
    expect(screen.getByText('Work Anniversary')).toBeTruthy()
  })

  it('renders regular announcements', () => {
    render(<AnnouncementCard announcements={[{ id: 'r1', type: 'GENERAL', title: 'New leave policy', body: 'Please review the update.' }]} />)
    expect(screen.getByText('New leave policy')).toBeTruthy()
    expect(screen.getByText('Please review the update.')).toBeTruthy()
  })

  it('renders loading, error, and empty states', () => {
    const { rerender } = render(<AnnouncementCard loading />)
    expect(screen.getByText('Loading announcements...')).toBeTruthy()
    rerender(<AnnouncementCard error="Unable to load announcements." />)
    expect(screen.getByText('Unable to load announcements.')).toBeTruthy()
    rerender(<AnnouncementCard />)
    expect(screen.getByText('No announcements available.')).toBeTruthy()
  })

  it('handles missing optional fields', () => {
    render(<AnnouncementCard announcements={[{ id: 'm1', type: 'ANNIVERSARY', employee_name: 'Asha Sharma' }]} />)
    expect(screen.getByText('Happy Work Anniversary, Asha Sharma!')).toBeTruthy()
  })

  it('distinguishes unread items without rendering a read action', () => {
    render(<AnnouncementCard announcements={[{ id: 'u1', type: 'GENERAL', title: 'Unread', body: 'Read me', is_read: false }, { id: 'r1', type: 'GENERAL', title: 'Read', is_read: true }]} />)
    expect(screen.getByLabelText('Unread')).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Mark as read' })).toBeNull()
    expect(screen.queryByText('Marking...')).toBeNull()
  })

  it('supports retry without displaying mark-read UI', () => {
    const onRetry = vi.fn()
    const { rerender } = render(<AnnouncementCard error="request failed" onRetry={onRetry} />)
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
    expect(onRetry).toHaveBeenCalled()

    rerender(<AnnouncementCard announcements={[{ id: 'u1', type: 'GENERAL', title: 'Unread', is_read: false }]} />)
    expect(screen.queryByText('Unable to mark announcement as read.')).toBeNull()
    expect(screen.queryByRole('button', { name: 'Mark as read' })).toBeNull()
    rerender(<AnnouncementCard announcements={[{ id: 'u1', type: 'GENERAL', title: 'Unread', is_read: true }]} />)
    expect(screen.queryByRole('button', { name: 'Mark as read' })).toBeNull()
  })
})
