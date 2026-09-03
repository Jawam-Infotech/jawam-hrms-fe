import {
  getNotifications as getNotificationsRequest,
  getUnreadNotificationCount as getUnreadNotificationCountRequest,
  markNotificationAsRead as markNotificationAsReadRequest,
  markAllNotificationsAsRead as markAllNotificationsAsReadRequest,
  deleteNotification as deleteNotificationRequest,
  clearAllNotifications as clearAllNotificationsRequest,
} from './api/notification.api.js'

async function getNotifications(params = {}) {
  return getNotificationsRequest(params)
}

async function getUnreadNotificationCount() {
  return getUnreadNotificationCountRequest()
}

async function markNotificationAsRead(notificationId) {
  return markNotificationAsReadRequest(notificationId)
}

async function markAllNotificationsAsRead() {
  return markAllNotificationsAsReadRequest()
}

async function deleteNotification(notificationId) {
  return deleteNotificationRequest(notificationId)
}

async function clearAllNotifications() {
  return clearAllNotificationsRequest()
}

export {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications,
}
