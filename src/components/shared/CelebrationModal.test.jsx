// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import CelebrationModal from './CelebrationModal.jsx'

afterEach(cleanup)

describe('CelebrationModal', () => {
  it('does not render when closed', () => {
    render(<CelebrationModal isOpen={false} celebrationType="BIRTHDAY" onClose={vi.fn()} />)
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('renders birthday content', () => {
    render(<CelebrationModal isOpen celebrationType="BIRTHDAY" employeeName="Asha Sharma" onClose={vi.fn()} />)
    expect(screen.getByRole('heading', { name: 'Happy Birthday!' })).toBeTruthy()
    expect(screen.getByText('Asha Sharma')).toBeTruthy()
    expect(screen.getByText(/wonderful birthday/i)).toBeTruthy()
  })

  it('renders work anniversary content with completed years', () => {
    render(<CelebrationModal isOpen celebrationType="WORK_ANNIVERSARY" employeeName="Asha Sharma" completedYears={3} onClose={vi.fn()} />)
    expect(screen.getByRole('heading', { name: 'Happy Work Anniversary!' })).toBeTruthy()
    expect(screen.getByText('Congratulations on completing 3 years with us!')).toBeTruthy()
  })

  it('calls onClose from the close button and Escape key', () => {
    const onClose = vi.fn()
    render(<CelebrationModal isOpen celebrationType="BIRTHDAY" onClose={onClose} />)
    fireEvent.click(screen.getByRole('button', { name: 'Close celebration' }))
    fireEvent.keyDown(document, { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(2)
  })

  it('focuses the close button and traps Tab in both directions', () => {
    render(<CelebrationModal isOpen celebrationType="BIRTHDAY" onClose={vi.fn()} />)
    const closeButton = screen.getByRole('button', { name: 'Close celebration' })
    expect(document.activeElement).toBe(closeButton)

    fireEvent.keyDown(document, { key: 'Tab' })
    expect(document.activeElement).toBe(closeButton)
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true })
    expect(document.activeElement).toBe(closeButton)
  })

  it('restores focus after closing and keeps focus in the next celebration', () => {
    const onClose = vi.fn()
    const trigger = document.createElement('button')
    trigger.textContent = 'Open celebration'
    document.body.appendChild(trigger)
    trigger.focus()
    const { rerender } = render(<CelebrationModal isOpen celebrationType="BIRTHDAY" onClose={onClose} />)
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Close celebration' }))

    rerender(<CelebrationModal isOpen celebrationType="WORK_ANNIVERSARY" onClose={onClose} completedYears={2} />)
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Close celebration' }))
    rerender(<CelebrationModal isOpen={false} celebrationType="WORK_ANNIVERSARY" onClose={onClose} />)
    expect(document.activeElement).toBe(trigger)
    trigger.remove()
  })

  it('exposes accessible dialog semantics', () => {
    render(<CelebrationModal isOpen celebrationType="BIRTHDAY" onClose={vi.fn()} />)
    const dialog = screen.getByRole('dialog')
    expect(dialog.getAttribute('aria-modal')).toBe('true')
    expect(dialog.getAttribute('aria-labelledby')).toBe('celebration-modal-title')
    expect(dialog.getAttribute('aria-describedby')).toBe('celebration-modal-message')
  })
})
