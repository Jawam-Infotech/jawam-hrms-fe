import api from './axios.js'
import { NOTIFICATION_ENDPOINTS } from './endpoints.js'

async function getNotifications(params = {}) {
  const { data } = await api.get(
    NOTIFICATION_ENDPOINTS.list,
    { params }
  )

  return data
}

const MAX_NOTIFICATION_PAGES = 50

async function getAllNotifications(params = {}) {
  const notifications = []
  const seenIds = new Set()
  const visitedPages = new Set()
  let next = null
  let pageCount = 0

  const appendPage = (data) => {
    const pageResults = Array.isArray(data?.results)
      ? data.results
      : Array.isArray(data)
        ? data
        : []

    pageResults.forEach((notification) => {
      const key = notification?.id ?? JSON.stringify(notification)
      if (!seenIds.has(key)) {
        seenIds.add(key)
        notifications.push(notification)
      }
    })

    next = data?.next || null
  }

  const firstResponse = await api.get(
    NOTIFICATION_ENDPOINTS.list,
    { params }
  )
  pageCount += 1
  appendPage(firstResponse.data)

  while (next && pageCount < MAX_NOTIFICATION_PAGES) {
    if (visitedPages.has(next)) break
    visitedPages.add(next)
    const pageResponse = await api.get(next)
    pageCount += 1
    appendPage(pageResponse.data)
  }

  return {
    count: notifications.length,
    results: notifications,
  }
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
  getAllNotifications,
  getUnreadNotificationCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications,
}
