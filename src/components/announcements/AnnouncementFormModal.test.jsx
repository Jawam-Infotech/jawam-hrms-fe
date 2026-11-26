/* @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi, beforeEach, afterEach as vitestAfterEach } from 'vitest'
import AnnouncementFormModal from './AnnouncementFormModal.jsx'

const fields = { title: 'Office Holiday', body: 'Closed.', visible_from: '2026-11-26T10:30', visible_until: '2026-11-27T10:30' }

describe('AnnouncementFormModal', () => {
  beforeEach(() => vi.useFakeTimers())
  vitestAfterEach(() => vi.useRealTimers())
  afterEach(cleanup)
  it('validates required fields and invalid visibility windows', () => {
    const onSubmit = vi.fn()
    render(<AnnouncementFormModal isOpen onSubmit={onSubmit} />)
    fireEvent.submit(screen.getByRole('dialog'))
    expect(screen.getByText('Title is required.')).toBeTruthy()
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'Title' } })
    fireEvent.change(screen.getByLabelText('Visible From time'), { target: { value: '10:30' } })
    fireEvent.change(screen.getByLabelText('Visible Until time'), { target: { value: '09:00' } })
    fireEvent.submit(screen.getByRole('dialog'))
    expect(screen.getByText('Visible until must be later than visible from.')).toBeTruthy()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('serializes create timestamps explicitly in IST and omits empty body', () => {
    const onSubmit = vi.fn()
    vi.setSystemTime(new Date('2026-11-26T04:00:00.000Z'))
    render(<AnnouncementFormModal isOpen onSubmit={onSubmit} />)
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: fields.title } })
    fireEvent.change(screen.getByLabelText('Visible From time'), { target: { value: '10:30' } })
    fireEvent.change(screen.getByLabelText('Visible Until time'), { target: { value: '23:59' } })
    fireEvent.submit(screen.getByRole('dialog'))
    expect(onSubmit).toHaveBeenCalledWith({ title: fields.title, visible_from: '2026-11-26T10:30:00+05:30', visible_until: '2026-11-26T23:59:00+05:30' })
  })

  it('sends only changed edit fields and supports clearing body', () => {
    const onSubmit = vi.fn()
    render(<AnnouncementFormModal isOpen mode="edit" announcement={{ id: 1, type: 'GENERAL', title: fields.title, body: fields.body, visible_from: '2026-11-26T05:00:00Z', visible_until: '2026-11-27T05:00:00Z' }} onSubmit={onSubmit} />)
    fireEvent.change(screen.getByLabelText('Body'), { target: { value: '' } })
    fireEvent.submit(screen.getByRole('dialog'))
    expect(onSubmit).toHaveBeenCalledWith({ body: '' })
  })

  it('uses the current IST date with start and end of day defaults for create mode', () => {
    vi.setSystemTime(new Date('2026-11-25T20:00:00.000Z'))
    render(<AnnouncementFormModal isOpen onSubmit={vi.fn()} />)
    expect(screen.getByLabelText('Visible From date').querySelector('span').textContent).toBe('2026-11-26')
    expect(screen.getByLabelText('Visible From time').value).toBe('00:00')
    expect(screen.getByLabelText('Visible Until date').querySelector('span').textContent).toBe('2026-11-26')
    expect(screen.getByLabelText('Visible Until time').value).toBe('23:59')
  })

  it('preserves edit timestamps and submits only changed fields', () => {
    const onSubmit = vi.fn()
    render(<AnnouncementFormModal isOpen mode="edit" announcement={{ id: 1, type: 'GENERAL', title: fields.title, body: fields.body, visible_from: '2026-11-26T05:00:00Z', visible_until: '2026-11-27T05:00:00Z' }} onSubmit={onSubmit} />)
    expect(screen.getByLabelText('Visible From time').value).toBe('10:30')
    expect(screen.getByLabelText('Visible Until time').value).toBe('10:30')
    fireEvent.change(screen.getByLabelText('Visible From time'), { target: { value: '11:30' } })
    fireEvent.submit(screen.getByRole('dialog'))
    expect(onSubmit).toHaveBeenCalledWith({ visible_from: '2026-11-26T11:30:00+05:30' })
  })

  it('maps backend field errors and clears them when edited', () => {
    const error = { response: { data: { title: ['Title already exists.'], visible_until: 'Invalid window.' } } }
    render(<AnnouncementFormModal isOpen error={error} onSubmit={vi.fn()} />)
    expect(screen.getByText('Title already exists.')).toBeTruthy()
    fireEvent.change(screen.getByLabelText('Title'), { target: { value: 'New title' } })
    expect(screen.queryByText('Title already exists.')).toBeNull()
    expect(screen.getByText('Invalid window.')).toBeTruthy()
  })
})
