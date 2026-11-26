import {
  getAnnouncements as getAnnouncementsRequest,
  getUnreadAnnouncementCount as getUnreadAnnouncementCountRequest,
  markAnnouncementAsRead as markAnnouncementAsReadRequest,
  createAnnouncement as createAnnouncementRequest,
  updateAnnouncement as updateAnnouncementRequest,
  deleteAnnouncement as deleteAnnouncementRequest,
} from './api/announcement.api.js'

const ANNOUNCEMENT_TYPES = ['GENERAL', 'BIRTHDAY', 'ANNIVERSARY']

function getAnnouncementParams({ type, page, page_size } = {}) {
  const params = {}
  if (type) params.type = type
  if (page !== undefined && page !== null) params.page = page
  if (page_size !== undefined && page_size !== null) params.page_size = page_size
  return params
}

async function getAnnouncements(params = {}) {
  return getAnnouncementsRequest(getAnnouncementParams(params))
}

async function getUnreadAnnouncementCount() {
  return getUnreadAnnouncementCountRequest()
}

async function markAnnouncementAsRead(id) {
  return markAnnouncementAsReadRequest(id)
}

async function createAnnouncement(payload) {
  return createAnnouncementRequest(payload)
}

async function updateAnnouncement(id, payload) {
  return updateAnnouncementRequest(id, payload)
}

async function deleteAnnouncement(id) {
  return deleteAnnouncementRequest(id)
}

export {
  ANNOUNCEMENT_TYPES,
  getAnnouncements,
  getUnreadAnnouncementCount,
  markAnnouncementAsRead,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
}
