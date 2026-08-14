import api from './axios.js'
import { HOLIDAY_ENDPOINTS } from './endpoints.js'

async function getHolidaysRequest() {
  const { data } = await api.get(HOLIDAY_ENDPOINTS.holidays)
  return data
}

async function createHolidayRequest(payload) {
  const { data } = await api.post(HOLIDAY_ENDPOINTS.holidays, {
    name: payload.holidayName,
    date: payload.holidayDate,
  })

  return data
}

async function updateHolidayRequest(id, payload) {
  const { data } = await api.patch(
    `${HOLIDAY_ENDPOINTS.holidays}${id}/`,
    {
      name: payload.holidayName,
      date: payload.holidayDate,
    }
  )

  return data
}

async function deleteHolidayRequest(id) {
  await api.delete(`${HOLIDAY_ENDPOINTS.holidays}${id}/`)
}

export {
  getHolidaysRequest,
  createHolidayRequest,
  updateHolidayRequest,
  deleteHolidayRequest,
}