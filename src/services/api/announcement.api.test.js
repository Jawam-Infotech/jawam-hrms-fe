import { beforeEach, describe, expect, it, vi } from 'vitest'
import api from './axios.js'
import { createAnnouncement, deleteAnnouncement, getAnnouncements, getUnreadAnnouncementCount, markAnnouncementAsRead, updateAnnouncement } from './announcement.api.js'

vi.mock('./axios.js', () => ({ default: { get: vi.fn(), post: vi.fn(), patch: vi.fn(), delete: vi.fn() } }))

describe('announcement API', () => {
  beforeEach(() => vi.clearAllMocks())

  it('uses the contract methods, paths, and payloads', async () => {
    api.get.mockResolvedValue({ data: { count: 0, results: [] } })
    api.post.mockResolvedValue({ data: { id: 1 } })
    api.patch.mockResolvedValue({ data: { id: 1 } })
    api.delete.mockResolvedValue({ status: 204 })

    await getAnnouncements({ type: 'GENERAL', page: 2, page_size: 10 })
    await getUnreadAnnouncementCount()
    await markAnnouncementAsRead(4)
    await createAnnouncement({ title: 'T', body: 'B' })
    await updateAnnouncement(4, { title: 'Updated' })
    await deleteAnnouncement(4)

    expect(api.get).toHaveBeenNthCalledWith(1, 'announcements/', { params: { type: 'GENERAL', page: 2, page_size: 10 } })
    expect(api.get).toHaveBeenNthCalledWith(2, 'announcements/unread-count/')
    expect(api.post).toHaveBeenNthCalledWith(1, 'announcements/4/read/')
    expect(api.post).toHaveBeenNthCalledWith(2, 'announcements/', { title: 'T', body: 'B' })
    expect(api.patch).toHaveBeenCalledWith('announcements/4/', { title: 'Updated' })
    expect(api.delete).toHaveBeenCalledWith('announcements/4/')
  })
})
