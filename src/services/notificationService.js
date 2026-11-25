import {
  getNotifications as getNotificationsRequest,
  getAllNotifications as getAllNotificationsRequest,
  getUnreadNotificationCount as getUnreadNotificationCountRequest,
  markNotificationAsRead as markNotificationAsReadRequest,
  markAllNotificationsAsRead as markAllNotificationsAsReadRequest,
  deleteNotification as deleteNotificationRequest,
  clearAllNotifications as clearAllNotificationsRequest,
} from './api/notification.api.js'

async function getNotifications(params = {}) {
  return getNotificationsRequest(params)
}

async function getAllNotifications(params = {}) {
  return getAllNotificationsRequest(params)
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
  getAllNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications,
}
