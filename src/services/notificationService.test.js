import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('./api/notification.api.js', () => ({
  getNotifications: vi.fn(),
  getUnreadNotificationCount: vi.fn(),
  markNotificationAsRead: vi.fn(),
  markAllNotificationsAsRead: vi.fn(),
}))

import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from './notificationService.js'

import {
  getNotifications as getNotificationsRequest,
  getUnreadNotificationCount as getUnreadNotificationCountRequest,
  markNotificationAsRead as markNotificationAsReadRequest,
  markAllNotificationsAsRead as markAllNotificationsAsReadRequest,
} from './api/notification.api.js'

describe('notification services', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('gets the logged-in user notifications', async () => {
    const response = {
      count: 1,
      results: [
        {
          id: 41,
          message: 'Your correction request was approved.',
          is_read: false,
        },
      ],
    }

    getNotificationsRequest.mockResolvedValue(response)

    await expect(
      getNotifications({ unread_only: true }),
    ).resolves.toEqual(response)

    expect(getNotificationsRequest).toHaveBeenCalledWith({
      unread_only: true,
    })
  })

  it('gets the unread notification count', async () => {
    const response = {
      unread_count: 3,
    }

    getUnreadNotificationCountRequest.mockResolvedValue(response)

    await expect(
      getUnreadNotificationCount(),
    ).resolves.toEqual(response)

    expect(
      getUnreadNotificationCountRequest,
    ).toHaveBeenCalledTimes(1)
  })

  it('marks one notification as read', async () => {
    const response = {
      id: 41,
      is_read: true,
    }

    markNotificationAsReadRequest.mockResolvedValue(response)

    await expect(
      markNotificationAsRead(41),
    ).resolves.toEqual(response)

    expect(
      markNotificationAsReadRequest,
    ).toHaveBeenCalledWith(41)
  })

  it('marks all notifications as read', async () => {
    const response = {
      marked_read: 3,
    }

    markAllNotificationsAsReadRequest.mockResolvedValue(response)

    await expect(
      markAllNotificationsAsRead(),
    ).resolves.toEqual(response)

    expect(
      markAllNotificationsAsReadRequest,
    ).toHaveBeenCalledTimes(1)
  })
})