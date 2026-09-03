import api from './axios.js'
import { NOTIFICATION_ENDPOINTS } from './endpoints.js'

async function getNotifications(params = {}) {
  const { data } = await api.get(
    NOTIFICATION_ENDPOINTS.list,
    { params }
  )

  return data
}

async function getUnreadNotificationCount() {
  const { data } = await api.get(
    NOTIFICATION_ENDPOINTS.unreadCount
  )

  return data
}

async function markNotificationAsRead(notificationId) {
  const { data } = await api.patch(
    NOTIFICATION_ENDPOINTS.markAsRead(notificationId)
  )

  return data
}

async function markAllNotificationsAsRead() {
  const { data } = await api.post(
    NOTIFICATION_ENDPOINTS.markAllAsRead
  )

  return data
}

async function deleteNotification(notificationId) {
  await api.delete(NOTIFICATION_ENDPOINTS.delete(notificationId))
}

async function clearAllNotifications() {
  const { data } = await api.delete(NOTIFICATION_ENDPOINTS.clearAll)
  return data
}

export {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications,
}
