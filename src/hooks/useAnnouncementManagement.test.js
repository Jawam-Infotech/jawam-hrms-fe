/* @vitest-environment jsdom */

import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import useAnnouncementManagement from './useAnnouncementManagement.js'
import * as service from '../services/announcementService.js'

vi.mock('../services/announcementService.js', () => ({
  createAnnouncement: vi.fn(),
  updateAnnouncement: vi.fn(),
  deleteAnnouncement: vi.fn(),
}))

const refreshAnnouncements = vi.fn()
const fetchUnreadCount = vi.fn()
const goToPage = vi.fn()

function state(currentPage = 1) {
  return { refreshAnnouncements, fetchUnreadCount, goToPage, currentPage }
}

describe('useAnnouncementManagement', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    refreshAnnouncements.mockResolvedValue({ results: [{ id: 1 }] })
    fetchUnreadCount.mockResolvedValue({ unread_count: 0 })
    goToPage.mockResolvedValue({ results: [{ id: 2 }] })
    service.createAnnouncement.mockResolvedValue({ id: 1, type: 'GENERAL' })
    service.updateAnnouncement.mockResolvedValue({ id: 1, type: 'GENERAL' })
    service.deleteAnnouncement.mockResolvedValue(undefined)
  })

  it('rejects every incomplete or system-generated announcement before the API call', async () => {
    const { result } = renderHook(() => useAnnouncementManagement({ announcementState: state() }))
    const invalid = [undefined, {}, { id: 1 }, { id: 1, type: undefined }, { id: 1, type: null }, { id: 1, type: 'general' }, { id: 1, type: 'BIRTHDAY' }, { id: 1, type: 'ANNIVERSARY' }]
    for (const announcement of invalid) {
      await expect(result.current.updateAnnouncement(announcement, { title: 'x' })).rejects.toThrow()
      await expect(result.current.deleteAnnouncement(announcement)).rejects.toThrow()
    }
    expect(service.updateAnnouncement).not.toHaveBeenCalled()
    expect(service.deleteAnnouncement).not.toHaveBeenCalled()
  })

  it('creates a GENERAL announcement and synchronizes feed and unread count', async () => {
    const { result } = renderHook(() => useAnnouncementManagement({ announcementState: state() }))
    await act(async () => { await result.current.createAnnouncement({ title: 'Holiday' }) })
    expect(service.createAnnouncement).toHaveBeenCalledWith({ title: 'Holiday' })
    expect(refreshAnnouncements).toHaveBeenCalledTimes(1)
    expect(fetchUnreadCount).toHaveBeenCalledTimes(1)
  })

  it('propagates failed create, update, and delete mutations', async () => {
    const error = new Error('backend failure')
    const { result } = renderHook(() => useAnnouncementManagement({ announcementState: state() }))
    service.createAnnouncement.mockRejectedValueOnce(error)
    await act(async () => { await expect(result.current.createAnnouncement({ title: 'x' })).rejects.toBe(error) })
    service.updateAnnouncement.mockRejectedValueOnce(error)
    await act(async () => { await expect(result.current.updateAnnouncement({ id: 1, type: 'GENERAL' }, { title: 'x' })).rejects.toBe(error) })
    service.deleteAnnouncement.mockRejectedValueOnce(error)
    await act(async () => { await expect(result.current.deleteAnnouncement({ id: 1, type: 'GENERAL' })).rejects.toBe(error) })
    expect(result.current.mutationError).toBe(error)
  })

  it('updates GENERAL announcements and refreshes unread count only for visibility changes', async () => {
    const { result } = renderHook(() => useAnnouncementManagement({ announcementState: state() }))
    await act(async () => { await result.current.updateAnnouncement({ id: 4, type: 'GENERAL' }, { title: 'Updated' }) })
    expect(service.updateAnnouncement).toHaveBeenCalledWith(4, { title: 'Updated' })
    expect(fetchUnreadCount).not.toHaveBeenCalled()
    await act(async () => { await result.current.updateAnnouncement({ id: 4, type: 'GENERAL' }, { visible_until: 'later' }) })
    expect(fetchUnreadCount).toHaveBeenCalledTimes(1)
  })

  it('deletes GENERAL announcements and refreshes unread count', async () => {
    const { result } = renderHook(() => useAnnouncementManagement({ announcementState: state() }))
    await act(async () => { await result.current.deleteAnnouncement({ id: 5, type: 'GENERAL' }) })
    expect(service.deleteAnnouncement).toHaveBeenCalledWith(5)
    expect(fetchUnreadCount).toHaveBeenCalledTimes(1)
    expect(result.current.deletingAnnouncementIds).toEqual([])
  })

  it('falls back to the previous page after deleting the final item', async () => {
    refreshAnnouncements.mockResolvedValueOnce({ results: [] })
    const { result } = renderHook(() => useAnnouncementManagement({ announcementState: state(3) }))
    await act(async () => { await result.current.deleteAnnouncement({ id: 5, type: 'GENERAL' }) })
    expect(goToPage).toHaveBeenCalledWith(2)
    expect(fetchUnreadCount).toHaveBeenCalledTimes(1)
  })

  it('prevents same-ID duplicates while tracking different concurrent IDs independently', async () => {
    let resolveUpdateOne
    let resolveUpdateTwo
    service.updateAnnouncement
      .mockReturnValueOnce(new Promise((resolve) => { resolveUpdateOne = resolve }))
      .mockReturnValueOnce(new Promise((resolve) => { resolveUpdateTwo = resolve }))
    const { result } = renderHook(() => useAnnouncementManagement({ announcementState: state() }))
    let first
    let duplicate
    let second
    act(() => { first = result.current.updateAnnouncement({ id: 1, type: 'GENERAL' }, { title: 'a' }) })
    act(() => { duplicate = result.current.updateAnnouncement({ id: 1, type: 'GENERAL' }, { title: 'b' }); second = result.current.updateAnnouncement({ id: 2, type: 'GENERAL' }, { title: 'c' }) })
    expect(duplicate).not.toBe(undefined)
    expect(service.updateAnnouncement).toHaveBeenCalledTimes(2)
    expect(result.current.updatingAnnouncementIds).toEqual(expect.arrayContaining([1, 2]))
    resolveUpdateOne({})
    await act(async () => { await first })
    expect(result.current.updatingAnnouncementIds).toEqual([2])
    resolveUpdateTwo({})
    await act(async () => { await second })
    expect(result.current.updatingAnnouncementIds).toEqual([])
  })

  it('keeps mutation success separate from synchronization failure', async () => {
    const syncError = new Error('refresh failed')
    refreshAnnouncements.mockRejectedValueOnce(syncError)
    fetchUnreadCount.mockRejectedValueOnce(syncError)
    const { result } = renderHook(() => useAnnouncementManagement({ announcementState: state() }))
    await act(async () => { await expect(result.current.createAnnouncement({ title: 'Created' })).resolves.toMatchObject({ id: 1, type: 'GENERAL' }) })
    expect(result.current.mutationError).toBe(null)
    expect(result.current.syncError).toBe(syncError)
    expect(fetchUnreadCount).toHaveBeenCalledTimes(1)
  })

  it('ignores pending mutation synchronization after identity changes and unmounts safely', async () => {
    let resolveDelete
    service.deleteAnnouncement.mockReturnValueOnce(new Promise((resolve) => { resolveDelete = resolve }))
    const { result, rerender, unmount } = renderHook(({ userId }) => useAnnouncementManagement({ userId, announcementState: state() }), { initialProps: { userId: 1 } })
    let request
    act(() => { request = result.current.deleteAnnouncement({ id: 5, type: 'GENERAL' }) })
    rerender({ userId: 2 })
    expect(result.current.deletingAnnouncementIds).toEqual([])
    resolveDelete(undefined)
    await act(async () => { await request })
    expect(refreshAnnouncements).not.toHaveBeenCalled()
    expect(fetchUnreadCount).not.toHaveBeenCalled()
    unmount()
  })

  it('keeps a new same-ID update after an old identity request completes', async () => {
    let resolveOld
    let resolveNew
    service.updateAnnouncement
      .mockReturnValueOnce(new Promise((resolve) => { resolveOld = resolve }))
      .mockReturnValueOnce(new Promise((resolve) => { resolveNew = resolve }))
    const { result, rerender } = renderHook(({ userId }) => useAnnouncementManagement({ userId, announcementState: state() }), { initialProps: { userId: 1 } })
    let oldRequest
    act(() => { oldRequest = result.current.updateAnnouncement({ id: 8, type: 'GENERAL' }, { title: 'old' }) })
    rerender({ userId: 2 })
    let newRequest
    act(() => { newRequest = result.current.updateAnnouncement({ id: 8, type: 'GENERAL' }, { title: 'new' }) })
    resolveOld({})
    await act(async () => { await oldRequest })
    expect(result.current.updatingAnnouncementIds).toEqual([8])
    resolveNew({})
    await act(async () => { await newRequest })
    expect(result.current.updatingAnnouncementIds).toEqual([])
  })

  it('keeps a new same-ID delete after an old identity request completes', async () => {
    let resolveOld
    let resolveNew
    service.deleteAnnouncement
      .mockReturnValueOnce(new Promise((resolve) => { resolveOld = resolve }))
      .mockReturnValueOnce(new Promise((resolve) => { resolveNew = resolve }))
    const { result, rerender } = renderHook(({ userId }) => useAnnouncementManagement({ userId, announcementState: state() }), { initialProps: { userId: 1 } })
    let oldRequest
    act(() => { oldRequest = result.current.deleteAnnouncement({ id: 8, type: 'GENERAL' }) })
    rerender({ userId: 2 })
    let newRequest
    act(() => { newRequest = result.current.deleteAnnouncement({ id: 8, type: 'GENERAL' }) })
    resolveOld(undefined)
    await act(async () => { await oldRequest })
    expect(result.current.deletingAnnouncementIds).toEqual([8])
    resolveNew(undefined)
    await act(async () => { await newRequest })
    expect(result.current.deletingAnnouncementIds).toEqual([])
  })

  it('attempts unread refresh when delete list refresh fails', async () => {
    const error = new Error('list unavailable')
    refreshAnnouncements.mockRejectedValueOnce(error)
    const { result } = renderHook(() => useAnnouncementManagement({ announcementState: state() }))
    await act(async () => { await result.current.deleteAnnouncement({ id: 3, type: 'GENERAL' }) })
    expect(fetchUnreadCount).toHaveBeenCalledTimes(1)
    expect(result.current.syncError).toBe(error)
  })

  it('prevents duplicate same-ID updates and supports concurrent deletes', async () => {
    let resolveUpdate
    service.updateAnnouncement.mockReturnValueOnce(new Promise((resolve) => { resolveUpdate = resolve }))
    let resolveDeleteOne
    let resolveDeleteTwo
    service.deleteAnnouncement
      .mockReturnValueOnce(new Promise((resolve) => { resolveDeleteOne = resolve }))
      .mockReturnValueOnce(new Promise((resolve) => { resolveDeleteTwo = resolve }))
    const { result } = renderHook(() => useAnnouncementManagement({ announcementState: state() }))
    let firstUpdate
    let duplicateUpdate
    act(() => { firstUpdate = result.current.updateAnnouncement({ id: 1, type: 'GENERAL' }, { title: 'a' }); duplicateUpdate = result.current.updateAnnouncement({ id: 1, type: 'GENERAL' }, { title: 'b' }) })
    expect(duplicateUpdate).toBe(firstUpdate)
    expect(service.updateAnnouncement).toHaveBeenCalledTimes(1)
    act(() => { result.current.deleteAnnouncement({ id: 2, type: 'GENERAL' }); result.current.deleteAnnouncement({ id: 3, type: 'GENERAL' }) })
    expect(result.current.deletingAnnouncementIds).toEqual(expect.arrayContaining([2, 3]))
    resolveUpdate({})
    resolveDeleteOne(undefined)
    resolveDeleteTwo(undefined)
    await act(async () => { await Promise.resolve() })
    expect(result.current.updatingAnnouncementIds).toEqual([])
    expect(result.current.deletingAnnouncementIds).toEqual([])
  })

  it('uses the latest page when a deletion finishes after pagination changes', async () => {
    let resolveDelete
    const announcementState = state(3)
    service.deleteAnnouncement.mockReturnValueOnce(new Promise((resolve) => { resolveDelete = resolve }))
    const { result, rerender } = renderHook(({ page }) => useAnnouncementManagement({ announcementState: { ...announcementState, currentPage: page } }), { initialProps: { page: 3 } })
    act(() => { result.current.deleteAnnouncement({ id: 4, type: 'GENERAL' }) })
    rerender({ page: 4 })
    refreshAnnouncements.mockResolvedValueOnce({ results: [] })
    resolveDelete(undefined)
    await act(async () => { await Promise.resolve(); await Promise.resolve() })
    expect(goToPage).toHaveBeenCalledWith(3)
  })

  it('clears a prior sync error after a later successful synchronization', async () => {
    refreshAnnouncements.mockRejectedValueOnce(new Error('temporary')).mockResolvedValueOnce({ results: [{ id: 1 }] })
    const { result } = renderHook(() => useAnnouncementManagement({ announcementState: state() }))
    await act(async () => { await result.current.deleteAnnouncement({ id: 1, type: 'GENERAL' }) })
    expect(result.current.syncError).toBeTruthy()
    await act(async () => { await result.current.deleteAnnouncement({ id: 2, type: 'GENERAL' }) })
    expect(result.current.syncError).toBe(null)
  })

  it.each([
    ['create', 'createAnnouncement', { title: 'x' }],
    ['update', 'updateAnnouncement', { id: 1, type: 'GENERAL' }, { title: 'x' }],
    ['delete', 'deleteAnnouncement', { id: 1, type: 'GENERAL' }],
  ])('does not update state after unmount during pending %s', async (_, method, firstArg, secondArg) => {
    let resolveRequest
    service[method].mockReturnValueOnce(new Promise((resolve) => { resolveRequest = resolve }))
    const { result, unmount } = renderHook(() => useAnnouncementManagement({ announcementState: state() }))
    let request
    act(() => { request = secondArg === undefined ? result.current[method](firstArg) : result.current[method](firstArg, secondArg) })
    unmount()
    resolveRequest({ id: 1, type: 'GENERAL' })
    await act(async () => { await request })
    expect(refreshAnnouncements).not.toHaveBeenCalled()
    expect(fetchUnreadCount).not.toHaveBeenCalled()
  })

  it('does not synchronize create or update responses after identity changes', async () => {
    let resolveCreate
    let resolveUpdate
    service.createAnnouncement.mockReturnValueOnce(new Promise((resolve) => { resolveCreate = resolve }))
    service.updateAnnouncement.mockReturnValueOnce(new Promise((resolve) => { resolveUpdate = resolve }))
    const { result, rerender } = renderHook(({ userId }) => useAnnouncementManagement({ userId, announcementState: state() }), { initialProps: { userId: 1 } })
    let createRequest
    act(() => { createRequest = result.current.createAnnouncement({ title: 'x' }) })
    rerender({ userId: 2 })
    resolveCreate({ id: 1 })
    await act(async () => { await createRequest })
    expect(refreshAnnouncements).not.toHaveBeenCalled()
    let updateRequest
    act(() => { updateRequest = result.current.updateAnnouncement({ id: 2, type: 'GENERAL' }, { title: 'x' }) })
    rerender({ userId: 3 })
    resolveUpdate({ id: 2 })
    await act(async () => { await updateRequest })
    expect(refreshAnnouncements).not.toHaveBeenCalled()
  })

  it('does not let an old synchronization clear or set the new identity error', async () => {
    let resolveRefresh
    refreshAnnouncements.mockReturnValueOnce(new Promise((resolve) => { resolveRefresh = resolve }))
    const { result, rerender } = renderHook(({ userId }) => useAnnouncementManagement({ userId, announcementState: state() }), { initialProps: { userId: 1 } })
    let request
    act(() => { request = result.current.deleteAnnouncement({ id: 1, type: 'GENERAL' }) })
    rerender({ userId: 2 })
    resolveRefresh({ results: [] })
    await act(async () => { await request })
    expect(result.current.syncError).toBe(null)
  })
})
