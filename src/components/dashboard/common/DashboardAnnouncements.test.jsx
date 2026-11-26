/* @vitest-environment jsdom */

import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import DashboardAnnouncements from './DashboardAnnouncements.jsx'
import useAnnouncements from '../../../hooks/useAnnouncements.js'

vi.mock('../../../hooks/useAnnouncements.js', () => ({ default: vi.fn() }))

const baseState = {
  announcements: [],
  isLoading: false,
  error: null,
  refreshAnnouncements: vi.fn(),
  allAnnouncements: [],
  isAllLoading: false,
  allError: null,
  loadAllAnnouncements: vi.fn().mockResolvedValue([]),
}

describe('DashboardAnnouncements', () => {
  afterEach(cleanup)
  beforeEach(() => {
    vi.clearAllMocks()
    useAnnouncements.mockReturnValue({ ...baseState })
  })

  it('passes the hook loading state to the shared card', () => {
    useAnnouncements.mockReturnValue({ ...baseState, isLoading: true })
    render(<DashboardAnnouncements />)
    expect(screen.getByText('Loading announcements...')).toBeTruthy()
  })

  it('shows an error and retries through refreshAnnouncements', () => {
    const refreshAnnouncements = vi.fn()
    useAnnouncements.mockReturnValue({ ...baseState, error: new Error('server'), refreshAnnouncements })
    render(<DashboardAnnouncements />)
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
    expect(refreshAnnouncements).toHaveBeenCalledTimes(1)
  })

  it('does not render a read action for unread announcements', () => {
    useAnnouncements.mockReturnValue({ ...baseState, announcements: [{ id: 7, type: 'GENERAL', title: 'Policy', is_read: false }] })
    render(<DashboardAnnouncements />)
    expect(screen.getByLabelText('Unread')).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Mark as read' })).toBeNull()
    expect(screen.queryByText('Marking...')).toBeNull()
  })

  it('opens the complete-list modal without navigating', () => {
    const loadAllAnnouncements = vi.fn().mockResolvedValue([])
    useAnnouncements.mockReturnValue({ ...baseState, announcements: [{ id: 1, type: 'GENERAL', title: 'Policy', is_read: true }], loadAllAnnouncements })
    render(<DashboardAnnouncements />)
    fireEvent.click(screen.getByRole('button', { name: 'View All Announcements' }))
    expect(screen.getByRole('dialog')).toBeTruthy()
    expect(loadAllAnnouncements).toHaveBeenCalledTimes(1)
    expect(screen.getByRole('button', { name: 'Close announcements' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Close announcements' }))
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('shows three items and advances, loops, and pauses the dashboard carousel', () => {
    vi.useFakeTimers()
    try {
      const items = [1, 2, 3, 4].map((id) => ({ id, type: 'GENERAL', title: `Announcement ${id}`, is_read: true }))
      useAnnouncements.mockReturnValue({ ...baseState, announcements: items })
      render(<DashboardAnnouncements />)
      expect(screen.getAllByText('Announcement 1').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Announcement 2').length).toBeGreaterThan(0)
      expect(screen.getAllByText('Announcement 3').length).toBeGreaterThan(0)
      const carousel = screen.getAllByText('Announcement 1')[0].closest('.h-\\[360px\\]')
      expect(carousel).toBeTruthy()
      const track = carousel.querySelector('.will-change-transform')
      expect(track.style.transform).toBe('translate3d(0, 0px, 0)')
      expect(track.style.transition).toContain('transform')

      fireEvent.mouseEnter(carousel)
      act(() => { vi.advanceTimersByTime(3000) })
      expect(track.style.transform).toBe('translate3d(0, 0px, 0)')
      fireEvent.mouseLeave(carousel)
      act(() => { vi.advanceTimersByTime(3000) })
      expect(track.style.transform).toBe('translate3d(0, -76px, 0)')
      fireEvent.transitionEnd(track)
      expect(track.style.transform).toBe('translate3d(0, 0px, 0)')
      expect(track.children[0].textContent).toContain('Announcement 2')
      expect(track.children[1].textContent).toContain('Announcement 3')
      expect(track.children[2].textContent).toContain('Announcement 4')
      act(() => { vi.advanceTimersByTime(3000) })
      fireEvent.transitionEnd(track)
      expect(track.children[0].textContent).toContain('Announcement 3')
      act(() => { vi.advanceTimersByTime(3000) })
      fireEvent.transitionEnd(track)
      expect(track.children[0].textContent).toContain('Announcement 4')
      act(() => { vi.advanceTimersByTime(3000) })
      fireEvent.transitionEnd(track)
      expect(track.children[0].textContent).toContain('Announcement 1')
    } finally {
      vi.useRealTimers()
    }
  })

  it('does not auto-advance when reduced motion is requested', () => {
    vi.useFakeTimers()
    const originalMatchMedia = window.matchMedia
    window.matchMedia = vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() })
    try {
      const items = [1, 2, 3, 4].map((id) => ({ id, type: 'GENERAL', title: `Announcement ${id}`, is_read: true }))
      useAnnouncements.mockReturnValue({ ...baseState, announcements: items })
      render(<DashboardAnnouncements />)
      act(() => { vi.advanceTimersByTime(9000) })
      expect(screen.getAllByText('Announcement 1').length).toBeGreaterThan(0)
      expect(document.querySelector('.will-change-transform').style.transform).toBe('translate3d(0, 0px, 0)')
    } finally {
      window.matchMedia = originalMatchMedia
      vi.useRealTimers()
    }
  })
})
