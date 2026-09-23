import { useCallback, useEffect, useState } from 'react'
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications,
} from '../services/notificationService.js'

function useNotifications() {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false)
  const [deletingNotificationId, setDeletingNotificationId] = useState(null)
  const [isClearingAll, setIsClearingAll] = useState(false)

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const [notificationResponse, unreadResponse] =
        await Promise.all([
          getNotifications(),
          getUnreadNotificationCount(),
        ])

      const notificationResults = Array.isArray(
        notificationResponse?.results
      )
        ? notificationResponse.results
        : Array.isArray(notificationResponse)
          ? notificationResponse
          : []

      setNotifications(notificationResults)

      const count =
        typeof unreadResponse === 'number'
          ? unreadResponse
          : Number(
              unreadResponse?.count ??
              unreadResponse?.unread_count ??
              0
            )

      setUnreadCount(
        Number.isFinite(count) ? count : 0
      )
    } catch (err) {
      console.error(
        'Failed to load notifications:',
        err
      )
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  const markAsRead = useCallback(
    async (notificationId) => {
      try {
        await markNotificationAsRead(notificationId)

        setNotifications((currentNotifications) =>
          currentNotifications.map((notification) =>
            notification.id === notificationId
              ? {
                  ...notification,
                  is_read: true,
                }
              : notification
          )
        )

        setUnreadCount((currentCount) =>
          Math.max(0, currentCount - 1)
        )
      } catch (err) {
        console.error(
          'Failed to mark notification as read:',
          err
        )
        throw err
      }
    },
    []
  )

  const markAllAsRead = useCallback(async () => {
    try {
      setIsMarkingAllRead(true)

      await markAllNotificationsAsRead()

      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) => ({
          ...notification,
          is_read: true,
        }))
      )

      setUnreadCount(0)
    } catch (err) {
      console.error(
        'Failed to mark all notifications as read:',
        err
      )
      throw err
    } finally {
      setIsMarkingAllRead(false)
    }
  }, [])

  const removeNotification = useCallback(async (notificationId) => {
    if (deletingNotificationId !== null) return
    try {
      setDeletingNotificationId(notificationId)
      const notification = notifications.find((item) => item.id === notificationId)
      await deleteNotification(notificationId)
      setNotifications((current) => current.filter((item) => item.id !== notificationId))
      if (!notification?.is_read) {
        setUnreadCount((current) => Math.max(0, current - 1))
      }
    } finally {
      setDeletingNotificationId(null)
    }
  }, [deletingNotificationId, notifications])

  const clearAll = useCallback(async () => {
    if (isClearingAll) return
    try {
      setIsClearingAll(true)
      await clearAllNotifications()
      setNotifications([])
      setUnreadCount(0)
    } finally {
      setIsClearingAll(false)
    }
  }, [isClearingAll])

useEffect(() => {
  const loadInitialNotifications = async () => {
    await loadNotifications()
  }

  void loadInitialNotifications()
}, [loadNotifications])

  return {
    notifications,
    unreadCount,
    loading,
    error,
    isMarkingAllRead,
    markAsRead,
    markAllAsRead,
    removeNotification,
    deletingNotificationId,
    clearAll,
    isClearingAll,
    refreshNotifications: loadNotifications,
  }
}

export default useNotifications
