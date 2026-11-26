/* @vitest-environment jsdom */

import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import useAnnouncements from './useAnnouncements.js'
import * as service from '../services/announcementService.js'

vi.mock('../services/announcementService.js', () => ({
  getAnnouncements: vi.fn(),
  getUnreadAnnouncementCount: vi.fn(),
  markAnnouncementAsRead: vi.fn(),
}))

describe('useAnnouncements', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    service.getAnnouncements.mockResolvedValue({ count: 1, next: '/next', previous: null, results: [{ id: 1, is_read: false }] })
    service.getUnreadAnnouncementCount.mockResolvedValue({ unread_count: 1 })
    service.markAnnouncementAsRead.mockResolvedValue({})
  })

  it('loads paginated announcements and unread count', async () => {
    const { result } = renderHook(() => useAnnouncements())
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(result.current.announcements).toEqual([{ id: 1, is_read: false }])
    expect(result.current.next).toBe('/next')
    expect(result.current.unreadCount).toBe(1)
    expect(service.getAnnouncements).toHaveBeenCalledWith({ page: 1, page_size: 20 })
  })

  it('preserves filters and page size while changing pages', async () => {
    const { result } = renderHook(() => useAnnouncements({ type: 'GENERAL', pageSize: 10 }))
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    await act(async () => { await result.current.goToPage(2) })
    expect(service.getAnnouncements).toHaveBeenLastCalledWith({ type: 'GENERAL', page: 2, page_size: 10 })
  })

  it('updates read state only after successful mark-read and refreshes count', async () => {
    const { result } = renderHook(() => useAnnouncements())
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    await act(async () => { await result.current.markAsRead(1) })
    expect(result.current.announcements[0].is_read).toBe(true)
    expect(service.markAnnouncementAsRead).toHaveBeenCalledWith(1)
    expect(service.getUnreadAnnouncementCount).toHaveBeenCalledTimes(2)
  })

  it('does not change read state when mark-read fails', async () => {
    service.markAnnouncementAsRead.mockRejectedValueOnce(new Error('expired'))
    const { result } = renderHook(() => useAnnouncements())
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    await act(async () => { await expect(result.current.markAsRead(1)).rejects.toThrow('expired') })
    expect(result.current.announcements[0].is_read).toBe(false)
  })

  it('does not duplicate the initial fetch', async () => {
    const { result } = renderHook(() => useAnnouncements())
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(service.getAnnouncements).toHaveBeenCalledTimes(1)
    expect(service.getUnreadAnnouncementCount).toHaveBeenCalledTimes(1)
  })

  it('resets to page one when type or page size changes', async () => {
    const { result, rerender } = renderHook(
      ({ type, pageSize }) => useAnnouncements({ type, pageSize }),
      { initialProps: { type: 'GENERAL', pageSize: 20 } },
    )
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    await act(async () => { await result.current.goToPage(3) })

    rerender({ type: 'BIRTHDAY', pageSize: 20 })
    await waitFor(() => expect(service.getAnnouncements).toHaveBeenLastCalledWith({ type: 'BIRTHDAY', page: 1, page_size: 20 }))
    rerender({ type: 'BIRTHDAY', pageSize: 10 })
    await waitFor(() => expect(service.getAnnouncements).toHaveBeenLastCalledWith({ type: 'BIRTHDAY', page: 1, page_size: 10 }))
  })

  it('navigates pages without issuing an unintended page-one request', async () => {
    const { result } = renderHook(() => useAnnouncements({ type: 'GENERAL', pageSize: 10 }))
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    service.getAnnouncements.mockClear()
    await act(async () => { await result.current.goToPage(2) })
    expect(service.getAnnouncements).toHaveBeenCalledTimes(1)
    expect(service.getAnnouncements).toHaveBeenCalledWith({ type: 'GENERAL', page: 2, page_size: 10 })
  })

  it('refreshes the list and unread count at the next visibility boundary', async () => {
    vi.useFakeTimers()
    try {
      const now = new Date('2026-11-24T00:00:00+05:30')
      vi.setSystemTime(now)
      service.getAnnouncements.mockResolvedValue({
        count: 2,
        results: [
          { id: 1, visible_from: '2026-11-24T00:00:00+05:30', visible_until: '2026-11-24T01:00:00+05:30' },
          { id: 2, visible_from: '2026-11-24T00:00:00+05:30', visible_until: '2026-11-24T02:00:00+05:30' },
        ],
      })
      const { result } = renderHook(() => useAnnouncements())
      await act(async () => { await Promise.resolve() })
      expect(result.current.isLoading).toBe(false)
      service.getAnnouncements.mockClear()
      service.getUnreadAnnouncementCount.mockClear()
      await act(async () => { await vi.advanceTimersByTimeAsync(60 * 60 * 1000) })
      expect(service.getAnnouncements).toHaveBeenCalledTimes(1)
      expect(service.getUnreadAnnouncementCount).toHaveBeenCalledTimes(1)
    } finally {
      vi.useRealTimers()
    }
  })

  it('cleans up expiry timers on unmount', async () => {
    vi.useFakeTimers()
    try {
      service.getAnnouncements.mockResolvedValue({ results: [{ id: 1, visible_until: '2026-11-24T01:00:00+05:30' }] })
      vi.setSystemTime(new Date('2026-11-24T00:00:00+05:30'))
      const { unmount } = renderHook(() => useAnnouncements())
      await act(async () => { await Promise.resolve() })
      service.getAnnouncements.mockClear()
      unmount()
      await act(async () => { await vi.advanceTimersByTimeAsync(60 * 60 * 1000) })
      expect(service.getAnnouncements).not.toHaveBeenCalled()
    } finally {
      vi.useRealTimers()
    }
  })

  it('clears previous-user data and ignores stale responses after identity changes', async () => {
    let resolveFirst
    service.getAnnouncements.mockImplementationOnce(() => new Promise((resolve) => { resolveFirst = resolve }))
    service.getUnreadAnnouncementCount.mockImplementationOnce(() => new Promise(() => {}))
    const { result, rerender } = renderHook(({ userId }) => useAnnouncements({ userId }), { initialProps: { userId: 'one' } })
    rerender({ userId: 'two' })
    await waitFor(() => expect(result.current.announcements).toEqual([]))
    resolveFirst({ results: [{ id: 'old' }], count: 1 })
    await act(async () => { await Promise.resolve() })
    expect(result.current.announcements).not.toEqual([{ id: 'old' }])
  })

  it('does not apply a pending read request to a new identity', async () => {
    let resolveRead
    service.markAnnouncementAsRead.mockImplementationOnce(() => new Promise((resolve) => { resolveRead = resolve }))
    const { result, rerender } = renderHook(({ userId }) => useAnnouncements({ userId }), { initialProps: { userId: 'one' } })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    let readPromise
    act(() => { readPromise = result.current.markAsRead(1) })
    rerender({ userId: 'two' })
    resolveRead({})
    await act(async () => { await readPromise })
    expect(result.current.pendingReadIds).toEqual([])
    expect(result.current.announcements[0]?.is_read).not.toBe(true)
  })

  it('does not duplicate initial requests under StrictMode', async () => {
    const { result } = renderHook(() => useAnnouncements(), { reactStrictMode: true })
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    expect(service.getAnnouncements).toHaveBeenCalledTimes(1)
    expect(service.getUnreadAnnouncementCount).toHaveBeenCalledTimes(1)
  })

  it('preserves loaded announcements when a refresh fails', async () => {
    const { result } = renderHook(() => useAnnouncements())
    await waitFor(() => expect(result.current.isLoading).toBe(false))
    const loaded = result.current.announcements
    service.getAnnouncements.mockRejectedValueOnce(new Error('server failure'))
    await act(async () => { await expect(result.current.refreshAnnouncements()).rejects.toThrow('server failure') })
    expect(result.current.announcements).toEqual(loaded)
    expect(result.current.error).toBeInstanceOf(Error)
  })
})
