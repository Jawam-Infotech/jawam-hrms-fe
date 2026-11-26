/* @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import DashboardLayout from './DashboardLayout.jsx'
import { UserContext } from '../context/UserContext.jsx'

const navigate = vi.fn()

vi.mock('react-router-dom', () => ({
  useNavigate: () => navigate,
  useLocation: () => ({ pathname: '/dashboard' }),
}))

vi.mock('../hooks/useNotifications.js', () => ({
  default: () => ({
    notifications: [],
    unreadCount: 2,
    loading: false,
    error: null,
    isMarkingAllRead: false,
    markAsRead: vi.fn(),
    markAllAsRead: vi.fn(),
    removeNotification: vi.fn(),
    deletingNotificationId: null,
    clearAll: vi.fn(),
    isClearingAll: false,
  }),
}))

function renderLayout(role) {
  return render(<UserContext.Provider value={{ user: { id: 1, name: 'Test User', role }, logout: vi.fn() }}><DashboardLayout><div>Content</div></DashboardLayout></UserContext.Provider>)
}

describe('DashboardLayout announcement topbar control', () => {
  beforeEach(() => navigate.mockClear())
  afterEach(() => cleanup())

  it.each(['CEO', 'HR'])('%s sees the announcement icon and can navigate', (role) => {
    renderLayout(role)
    const button = screen.getByRole('button', { name: 'Announcements' })
    expect(button.getAttribute('title')).toBe('Announcements')
    fireEvent.click(button)
    expect(navigate).toHaveBeenCalledWith('/announcements')
    expect(screen.getByRole('button', { name: 'Notifications' })).toBeTruthy()
  })

  it.each(['TL', 'EMPLOYEE'])('%s does not see the announcement icon', (role) => {
    renderLayout(role)
    expect(screen.queryByRole('button', { name: 'Announcements' })).toBeNull()
    expect(screen.getByRole('button', { name: 'Notifications' })).toBeTruthy()
  })

  it('preserves notification behavior and unread count', () => {
    renderLayout('HR')
    expect(screen.getByRole('button', { name: 'Notifications' })).toBeTruthy()
    expect(screen.getByText('2')).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Notifications' }))
    expect(screen.getByText('Notifications')).toBeTruthy()
  })
})
