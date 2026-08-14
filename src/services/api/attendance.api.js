import api from './axios.js'
import { ATTENDANCE_ENDPOINTS } from './endpoints.js'

function buildAttendanceParams({
  page,
  userId,
  startDate,
  endDate,
} = {}) {
  const params = {}

  if (page) {
    params.page = page
  }

  if (userId) {
    params.user_id = userId
  }

  if (startDate) {
    params.start_date = startDate
  }

  if (endDate) {
    params.end_date = endDate
  }

  return params
}

async function checkIn() {
  const { data } = await api.post(ATTENDANCE_ENDPOINTS.checkIn)
  return data
}

async function checkOut() {
  const { data } = await api.post(ATTENDANCE_ENDPOINTS.checkOut)
  return data
}

async function startBreak() {
  const { data } = await api.post(ATTENDANCE_ENDPOINTS.startBreak)
  return data
}

async function endBreak() {
  const { data } = await api.post(ATTENDANCE_ENDPOINTS.endBreak)
  return data
}

async function getMyAttendance(params) {
  const { data } = await api.get(ATTENDANCE_ENDPOINTS.me, {
    params: buildAttendanceParams(params),
  })
  return data
}

async function getMyAttendanceCalendar(params = {}) {
  const { data } = await api.get(ATTENDANCE_ENDPOINTS.calendar, { params })
  return data
}

async function getTeamAttendance(params) {
  const { data } = await api.get(ATTENDANCE_ENDPOINTS.team, {
    params: buildAttendanceParams(params),
  })
  return data
}

async function getCompanyAttendance(params) {
  const { data } = await api.get(ATTENDANCE_ENDPOINTS.company, {
    params: buildAttendanceParams(params),
  })
  return data
}

async function overrideAttendance(attendanceId, payload) {
  const { data } = await api.patch(
    ATTENDANCE_ENDPOINTS.override(attendanceId),
    payload
  )
  return data
}

async function getTodayAttendance() {
  const { data } = await api.get(ATTENDANCE_ENDPOINTS.today)
  return data
}

async function getAttendanceTrend(view) {
  const { data } = await api.get(ATTENDANCE_ENDPOINTS.trend, {
    params: {
      view,
    },
  })

  return data
}

async function getEmployeeAttendanceSummary({ userId, month, year }) {
  const { data } = await api.get(ATTENDANCE_ENDPOINTS.summary, {
    params: {
      user_id: userId,
      month,
      year,
    },
  })

  return data
}

async function getCorrectionRequests(params = {}) {
  const { data } = await api.get(
    ATTENDANCE_ENDPOINTS.correctionRequests,
    {
      params,
    }
  )

  return data
}

async function getAllCorrectionRequests(params = {}) {
  const { data } = await api.get(
    ATTENDANCE_ENDPOINTS.allCorrectionRequests,
    { params }
  )

  return data
}

async function getMyCorrectionRequests(params = {}) {
  const { data } = await api.get(
    ATTENDANCE_ENDPOINTS.myCorrectionRequests,
    { params }
  )

  return data
}

async function getCorrectionRequestById(requestId) {
  const { data } = await api.get(
    ATTENDANCE_ENDPOINTS.correctionRequestById(requestId)
  )

  return data
}

async function approveCorrectionRequest(requestId, payload = {}) {
  const { data } = await api.patch(
    ATTENDANCE_ENDPOINTS.approveCorrectionRequest(requestId),
    payload
  )

  return data
}

async function rejectCorrectionRequest(requestId, payload) {
  const { data } = await api.patch(
    ATTENDANCE_ENDPOINTS.rejectCorrectionRequest(requestId),
    payload
  )

  return data
}

async function getCorrectionStatusMap(date) {
  const { data } = await api.get(
    ATTENDANCE_ENDPOINTS.correctionStatusMap,
    {
      params: {
        date,
      },
    }
  )

  return data
}

async function getAttendanceById(attendanceId) {
  const { data } = await api.get(
    ATTENDANCE_ENDPOINTS.byId(attendanceId)
  )

  return data
}

async function correctAttendanceBulk(attendanceId, payload) {
  const { data } = await api.patch(
    ATTENDANCE_ENDPOINTS.correctionBulk(attendanceId),
    payload
  )

  return data
}

async function createCorrectionRequest(payload) {
  const { data } = await api.post(
    ATTENDANCE_ENDPOINTS.correctionRequests,
    payload
  )

  return data
}

export const getMissedCheckouts = () =>
  api.get('attendance/me/missed-checkouts/')

export {
  checkIn,
  checkOut,
  startBreak,
  endBreak,
  getMyAttendance,
  getMyAttendanceCalendar,
  getTeamAttendance,
  getCompanyAttendance,
  getAttendanceTrend,
  getEmployeeAttendanceSummary,
  overrideAttendance,
  getTodayAttendance,
  getAttendanceById,
  correctAttendanceBulk,
  createCorrectionRequest,
  getCorrectionRequests,
  getAllCorrectionRequests,
  getMyCorrectionRequests,
getCorrectionRequestById,
approveCorrectionRequest,
rejectCorrectionRequest,
getCorrectionStatusMap,
}
