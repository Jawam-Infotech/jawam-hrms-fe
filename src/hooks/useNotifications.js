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
          getNotifications().catch(() => ({ results: [] })),
          getUnreadNotificationCount().catch(() => 0),
        ])

      const notificationResults = Array.isArray(
        notificationResponse?.results
      )
        ? notificationResponse.results
        : Array.isArray(notificationResponse)
          ? notificationResponse
          : []

      // Integrate local custom notifications (e.g. CEO approvals)
      let customNotifs = []
      try {
        const stored = localStorage.getItem('jawam_custom_notifications_v1')
        if (stored) customNotifs = JSON.parse(stored)
      } catch (e) {
        console.error('Error loading custom notifications', e)
      }

      const merged = [...customNotifs, ...notificationResults]
      setNotifications(merged)

      const apiCount =
        typeof unreadResponse === 'number'
          ? unreadResponse
          : Number(
              unreadResponse?.count ??
              unreadResponse?.unread_count ??
              0
            )

      const customUnread = customNotifs.filter((n) => !n.is_read).length
      setUnreadCount((Number.isFinite(apiCount) ? apiCount : 0) + customUnread)
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
        await markNotificationAsRead(notificationId).catch(() => {})

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

        try {
          const stored = JSON.parse(localStorage.getItem('jawam_custom_notifications_v1') || '[]')
          const updated = stored.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
          localStorage.setItem('jawam_custom_notifications_v1', JSON.stringify(updated))
        } catch (e) {
          console.error('Error updating custom notification', e)
        }
      } catch (err) {
        console.error(
          'Failed to mark notification as read:',
          err
        )
      }
    },
    []
  )

  const markAllAsRead = useCallback(async () => {
    try {
      setIsMarkingAllRead(true)

      await markAllNotificationsAsRead().catch(() => {})

      setNotifications((currentNotifications) =>
        currentNotifications.map((notification) => ({
          ...notification,
          is_read: true,
        }))
      )

      setUnreadCount(0)

      try {
        const stored = JSON.parse(localStorage.getItem('jawam_custom_notifications_v1') || '[]')
        const updated = stored.map((n) => ({ ...n, is_read: true }))
        localStorage.setItem('jawam_custom_notifications_v1', JSON.stringify(updated))
      } catch (e) {
        console.error('Error marking custom notifications as read', e)
      }
    } catch (err) {
      console.error(
        'Failed to mark all notifications as read:',
        err
      )
    } finally {
      setIsMarkingAllRead(false)
    }
  }, [])

  const removeNotification = useCallback(async (notificationId) => {
    if (deletingNotificationId !== null) return
    try {
      setDeletingNotificationId(notificationId)
      const notification = notifications.find((item) => item.id === notificationId)
      await deleteNotification(notificationId).catch(() => {})
      setNotifications((current) => current.filter((item) => item.id !== notificationId))
      if (!notification?.is_read) {
        setUnreadCount((current) => Math.max(0, current - 1))
      }

      try {
        const stored = JSON.parse(localStorage.getItem('jawam_custom_notifications_v1') || '[]')
        const updated = stored.filter((n) => n.id !== notificationId)
        localStorage.setItem('jawam_custom_notifications_v1', JSON.stringify(updated))
      } catch (e) {
        console.error('Error removing custom notification', e)
      }
    } finally {
      setDeletingNotificationId(null)
    }
  }, [deletingNotificationId, notifications])

  const clearAll = useCallback(async () => {
    if (isClearingAll) return
    try {
      setIsClearingAll(true)
      await clearAllNotifications().catch(() => {})
      setNotifications([])
      setUnreadCount(0)

      try {
        localStorage.removeItem('jawam_custom_notifications_v1')
      } catch (e) {
        console.error('Error clearing custom notifications', e)
      }
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

  // Sync across tabs/windows
  useEffect(() => {
    const handleSync = () => {
      loadNotifications()
    }
    window.addEventListener('storage', handleSync)
    window.addEventListener('focus', handleSync)
    return () => {
      window.removeEventListener('storage', handleSync)
      window.removeEventListener('focus', handleSync)
    }
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
