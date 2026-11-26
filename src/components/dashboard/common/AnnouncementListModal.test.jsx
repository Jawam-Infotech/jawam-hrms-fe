/* @vitest-environment jsdom */
import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import AnnouncementListModal from './AnnouncementListModal.jsx'

afterEach(cleanup)

describe('AnnouncementListModal', () => {
  it('renders an accessible scrollable list and closes with Escape', () => {
    const onClose = vi.fn()
    render(<AnnouncementListModal isOpen announcements={[{ id: 1, type: 'GENERAL', title: 'Policy', is_read: true }, { id: 2, type: 'BIRTHDAY', employee_name: 'Asha', is_read: true }, { id: 3, type: 'ANNIVERSARY', employee_name: 'Ravi', is_read: true }]} onClose={onClose} />)
    const dialog = screen.getByRole('dialog')
    expect(dialog.getAttribute('aria-modal')).toBe('true')
    expect(screen.getByText('Policy')).toBeTruthy()
    expect(screen.getByText('Happy Birthday, Asha!')).toBeTruthy()
    expect(screen.getByText('Happy Work Anniversary, Ravi!')).toBeTruthy()
    expect(dialog.querySelector('.overflow-y-auto')).toBeTruthy()
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('shows loading, empty, and retryable error states', () => {
    const onRetry = vi.fn()
    const { rerender } = render(<AnnouncementListModal isOpen announcements={[]} loading onClose={vi.fn()} />)
    expect(screen.getByText('Loading announcements...')).toBeTruthy()
    rerender(<AnnouncementListModal isOpen announcements={[]} error={new Error('failed')} onRetry={onRetry} onClose={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: 'Retry' }))
    expect(onRetry).toHaveBeenCalledTimes(1)
    rerender(<AnnouncementListModal isOpen announcements={[]} onClose={vi.fn()} />)
    expect(screen.getByText('No announcements available.')).toBeTruthy()
  })
})
