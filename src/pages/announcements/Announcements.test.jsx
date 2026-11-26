/* @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor, cleanup } from '@testing-library/react'
import Announcements from './Announcements.jsx'
import { UserContext } from '../../context/UserContext.jsx'
import useAnnouncements from '../../hooks/useAnnouncements.js'
import useAnnouncementManagement from '../../hooks/useAnnouncementManagement.js'

vi.mock('react-router-dom', () => ({ useNavigate: () => vi.fn(), useLocation: () => ({ pathname: '/announcements' }) }))
vi.mock('../../hooks/useAnnouncements.js', () => ({ default: vi.fn() }))
vi.mock('../../hooks/useAnnouncementManagement.js', () => ({ default: vi.fn() }))
vi.mock('../../hooks/useNotifications.js', () => ({ default: () => ({ notifications: [], unreadCount: 0, loading: false, error: null, isMarkingAllRead: false, markAsRead: vi.fn(), markAllAsRead: vi.fn(), removeNotification: vi.fn(), deletingNotificationId: null, clearAll: vi.fn(), isClearingAll: false }) }))

const general = { id: 1, type: 'GENERAL', title: 'Office update', body: 'Please read', visible_from: '2026-01-01T09:00:00+05:30', visible_until: '2026-01-31T18:00:00+05:30', is_read: true, created_at: '2026-01-01T10:00:00+05:30' }
const birthday = { id: 2, type: 'BIRTHDAY', employee_name: 'Asha', is_read: true, occurrence_date: '2026-01-01' }
const anniversary = { id: 3, type: 'ANNIVERSARY', employee_name: 'Ravi', is_read: true, occurrence_date: '2026-01-01' }

function state(overrides = {}) {
  return { announcements: [], isLoading: false, error: '', refreshAnnouncements: vi.fn(), previous: null, next: null, currentPage: 1, pageSize: 20, count: 0, previousPage: vi.fn(), nextPage: vi.fn(), goToPage: vi.fn(), ...overrides }
}

function management(overrides = {}) {
  return { createAnnouncement: vi.fn().mockResolvedValue({}), updateAnnouncement: vi.fn().mockResolvedValue({}), deleteAnnouncement: vi.fn().mockResolvedValue({}), isCreating: false, updatingAnnouncementIds: [], deletingAnnouncementIds: [], mutationError: null, syncError: null, ...overrides }
}

function renderPage() {
  return render(<UserContext.Provider value={{ user: { id: 1, name: 'Test User', role: 'HR' }, logout: vi.fn() }}><Announcements /></UserContext.Provider>)
}

describe('Announcements page', () => {
  let feed
  let mutations

  beforeEach(() => {
    feed = state()
    mutations = management()
    useAnnouncements.mockReturnValue(feed)
    useAnnouncementManagement.mockReturnValue(mutations)
  })

  afterEach(() => cleanup())

  it('renders loading, empty, success, error, retry, and pagination states', () => {
    feed = state({ isLoading: true, next: '?page=2', count: 40 })
    useAnnouncements.mockReturnValue(feed)
    const { rerender } = renderPage()
    expect(screen.getByText('Loading announcements...')).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Next' })).toBeNull()

    feed = state({ announcements: [general], next: '?page=2', count: 40 })
    useAnnouncements.mockReturnValue(feed)
    rerender(<UserContext.Provider value={{ user: { id: 1, name: 'Test User', role: 'HR' }, logout: vi.fn() }}><Announcements /></UserContext.Provider>)
    expect(screen.getAllByText('Office update').length).toBe(1)
    fireEvent.click(screen.getByRole('button', { name: 'Next →' }))
    expect(feed.nextPage).toHaveBeenCalledTimes(1)

    feed = state({ error: 'network' })
    useAnnouncements.mockReturnValue(feed)
    rerender(<UserContext.Provider value={{ user: { id: 1, name: 'Test User', role: 'HR' }, logout: vi.fn() }}><Announcements /></UserContext.Provider>)
    expect(screen.getByText('Unable to load announcements.')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
    expect(feed.refreshAnnouncements).toHaveBeenCalledTimes(1)
  })

  it('renders empty state and management controls only for GENERAL announcements', () => {
    const { rerender } = renderPage()
    expect(screen.getByText('No General announcements available.')).toBeTruthy()
    feed = state({ announcements: [general, birthday, anniversary] })
    useAnnouncements.mockReturnValue(feed)
    rerender(<UserContext.Provider value={{ user: { id: 1, name: 'Test User', role: 'HR' }, logout: vi.fn() }}><Announcements /></UserContext.Provider>)
    expect(screen.getAllByText('Office update').length).toBe(1)
    expect(screen.queryByText('Happy Birthday, Asha!')).toBeNull()
    expect(screen.queryByText('Happy Work Anniversary, Ravi!')).toBeNull()
    expect(screen.getByRole('button', { name: 'Edit' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Delete' })).toBeTruthy()
  })

  it('opens create and edit forms with the expected mode and values', () => {
    feed = state({ announcements: [general] })
    useAnnouncements.mockReturnValue(feed)
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))
    expect(screen.getByRole('dialog').textContent).toContain('Edit General Announcement')
    expect(screen.getByDisplayValue('Office update')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    fireEvent.click(screen.getByRole('button', { name: 'Create Announcement' }))
    expect(screen.getByRole('dialog').textContent).toContain('Create General Announcement')
    expect(screen.getByLabelText('Title').value).toBe('')
  })

  it('handles delete confirmation, cancellation, success, and failure', async () => {
    feed = state({ announcements: [general] })
    useAnnouncements.mockReturnValue(feed)
    const { rerender } = renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    expect(screen.getByText('Delete “Office update”? This action cannot be undone.')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(screen.getAllByText('Office update').length).toBe(1)

    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    fireEvent.click(screen.getAllByRole('button', { name: 'Delete' })[1])
    await waitFor(() => expect(screen.getByText('Announcement deleted.')).toBeTruthy())
    expect(screen.queryByText('This action cannot be undone.')).toBeNull()

    const error = new Error('delete failed')
    mutations = management({ mutationError: error, deleteAnnouncement: vi.fn().mockRejectedValue(error) })
    useAnnouncementManagement.mockReturnValue(mutations)
    rerender(<UserContext.Provider value={{ user: { id: 1, name: 'Test User', role: 'HR' }, logout: vi.fn() }}><Announcements /></UserContext.Provider>)
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    fireEvent.click(screen.getAllByRole('button', { name: 'Delete' })[1])
    await waitFor(() => expect(screen.getByText('Unable to complete the announcement action.')).toBeTruthy())
    expect(screen.getByText('Delete “Office update”? This action cannot be undone.')).toBeTruthy()
  })

  it('reports successful mutation separately from synchronization warnings', async () => {
    feed = state({ announcements: [general] })
    mutations = management({ syncError: new Error('refresh failed') })
    useAnnouncements.mockReturnValue(feed)
    useAnnouncementManagement.mockReturnValue(mutations)
    renderPage()
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }))
    fireEvent.click(screen.getAllByRole('button', { name: 'Delete' })[1])
    await waitFor(() => expect(screen.getByText('Announcement deleted.')).toBeTruthy())
    expect(screen.getByText('The announcement changed, but the feed could not be refreshed.')).toBeTruthy()
  })
})
