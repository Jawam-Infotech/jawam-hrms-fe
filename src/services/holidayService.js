import {
  createHolidayRequest,
  deleteHolidayRequest,
  getHolidaysRequest,
  updateHolidayRequest,
} from './api/holiday.api.js'
import { normalizeHolidayRecord } from '../utils/holidayUtils.js'

async function getHolidays() {
  const data = await getHolidaysRequest()

  const records = Array.isArray(data)
    ? data.map((record) => normalizeHolidayRecord(record))
    : []

  return {
    records,
  }
}

async function createHoliday(payload) {
  const data = await createHolidayRequest(payload)
  return normalizeHolidayRecord(data)
}

async function updateHoliday(id, payload) {
  const data = await updateHolidayRequest(id, payload)
  return normalizeHolidayRecord(data)
}

async function deleteHoliday(id) {
  await deleteHolidayRequest(id)
  return { ok: true }
}

export {
  getHolidays,
  createHoliday,
  updateHoliday,
  deleteHoliday,
}