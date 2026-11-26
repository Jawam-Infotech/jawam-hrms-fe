import api from './axios.js'
import { ANNOUNCEMENT_ENDPOINTS } from './endpoints.js'

async function getAnnouncements(params = {}) {
  const { data } = await api.get(ANNOUNCEMENT_ENDPOINTS.list, { params })
  return data
}

async function getUnreadAnnouncementCount() {
  const { data } = await api.get(ANNOUNCEMENT_ENDPOINTS.unreadCount)
  return data
}

async function markAnnouncementAsRead(announcementId) {
  const { data } = await api.post(ANNOUNCEMENT_ENDPOINTS.markAsRead(announcementId))
  return data
}

async function createAnnouncement(payload) {
  const { data } = await api.post(ANNOUNCEMENT_ENDPOINTS.list, payload)
  return data
}

async function updateAnnouncement(announcementId, payload) {
  const { data } = await api.patch(ANNOUNCEMENT_ENDPOINTS.byId(announcementId), payload)
  return data
}

async function deleteAnnouncement(announcementId) {
  await api.delete(ANNOUNCEMENT_ENDPOINTS.byId(announcementId))
}

export {
  getAnnouncements,
  getUnreadAnnouncementCount,
  markAnnouncementAsRead,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
}
