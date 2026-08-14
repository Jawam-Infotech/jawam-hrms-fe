import {
  checkIn as checkInRequest,
  checkOut as checkOutRequest,
  getCompanyAttendance as getCompanyAttendanceRequest,
  getMyAttendance as getMyAttendanceRequest,
  getTeamAttendance as getTeamAttendanceRequest,
  overrideAttendance as overrideAttendanceRequest,
  startBreak as startBreakRequest,
  endBreak as endBreakRequest,
  getTodayAttendance as getTodayAttendanceRequest,
  getMissedCheckouts as getMissedCheckoutsRequest,
  getAttendanceTrend as getAttendanceTrendRequest, 
  getEmployeeAttendanceSummary as getEmployeeAttendanceSummaryRequest,
  getMyAttendanceCalendar as getMyAttendanceCalendarRequest,
  getAttendanceById as getAttendanceByIdRequest,
  correctAttendanceBulk as correctAttendanceBulkRequest,
  createCorrectionRequest as createCorrectionRequestRequest,
  getCorrectionRequests as getCorrectionRequestsRequest,
  getAllCorrectionRequests as getAllCorrectionRequestsRequest,
  getMyCorrectionRequests as getMyCorrectionRequestsRequest,
getCorrectionRequestById as getCorrectionRequestByIdRequest,
approveCorrectionRequest as approveCorrectionRequestRequest,
rejectCorrectionRequest as rejectCorrectionRequestRequest,
getCorrectionStatusMap as getCorrectionStatusMapRequest,
} from './api/attendance.api.js'
import {
  getAttendanceResults,
  normalizeAlerts,
  normalizeAttendanceRecord,
  normalizeCompanySummary,
  normalizeEmployeeSummary,
  normalizeTeamSummary,
  normalizeTrendData,
} from '../utils/attendanceHelpers.js'

async function checkIn() {
  return await checkInRequest()
}

async function checkOut() {
  return await checkOutRequest()
}

async function startBreak() {
  return await startBreakRequest()
}

async function endBreak() {
  return await endBreakRequest()
}

async function getAttendanceById(attendanceId) {
  return await getAttendanceByIdRequest(attendanceId)
}

async function correctAttendanceBulk(attendanceId, payload) {
  return await correctAttendanceBulkRequest(attendanceId, payload)
}

async function createCorrectionRequest(payload) {
  return await createCorrectionRequestRequest(payload)
}

function normalizePaginatedAttendance(data, summaryNormalizer) {
  const payload = data?.data ?? data ?? {}
  const records = getAttendanceResults(data).map(normalizeAttendanceRecord)
  const trendData = normalizeTrendData(data)

  return {
    records,
    summary: summaryNormalizer(payload.summary || {}, records),
    alerts: normalizeAlerts(data),
    monthlyTrend: trendData.monthlyTrend,
    weeklyTrend: trendData.weeklyTrend,
    count: payload.count ?? records.length,
    next: payload.next ?? null,
    previous: payload.previous ?? null,
  }
}

async function getMyAttendance(params) {
  const data = await getMyAttendanceRequest(params)

  console.log('RAW MY ATTENDANCE API:', data)

  const normalized = normalizePaginatedAttendance(data, normalizeEmployeeSummary)

  console.log('NORMALIZED MY ATTENDANCE:', normalized)
    console.log('FIRST RECORD:', normalized.records[0])


  return normalized
}

async function getMyAttendanceCalendar(params = {}) {
  const data = await getMyAttendanceCalendarRequest(params)
  return data
}

async function getTeamAttendance(params) {
  const data = await getTeamAttendanceRequest(params)
  return normalizePaginatedAttendance(data, normalizeTeamSummary)
}

async function getCompanyAttendance(params) {
  const data = await getCompanyAttendanceRequest(params)

  return normalizePaginatedAttendance(data, normalizeCompanySummary)
}

async function fetchAllAttendancePages(requestFn, params = {}, summaryNormalizer = () => ({})) {
  const firstPageData = await requestFn({ ...params, page: 1 })
  const firstPage = normalizePaginatedAttendance(firstPageData, summaryNormalizer)
  const records = [...firstPage.records]
  let nextPage = firstPage.next
  let page = 1

  while (nextPage) {
    page += 1
    // Fetch each remaining page from the same endpoint so the overview can be built
    // from the complete date range without adding a new backend API.
    const pageData = await requestFn({ ...params, page })
    const normalizedPage = normalizePaginatedAttendance(pageData, summaryNormalizer)
    records.push(...normalizedPage.records)
    nextPage = normalizedPage.next
  }

  return {
    records,
    summary: firstPage.summary,
    alerts: firstPage.alerts,
    count: records.length,
    next: null,
    previous: null,
  }
}

async function getCompanyAttendanceOverview(params) {
  return fetchAllAttendancePages(
    getCompanyAttendanceRequest,
    params,
    normalizeCompanySummary
  )
}

async function getTeamAttendanceOverview(params) {
  const data = await fetchAllAttendancePages(
    getTeamAttendanceRequest,
    params,
    normalizeTeamSummary
  )

  console.log('TEAM OVERVIEW', data)

  return data
}

async function getTodayAttendance() {
  const payload = await getTodayAttendanceRequest()

  return {
    ...(payload.attendance
      ? normalizeAttendanceRecord(payload.attendance)
      : {}),
    todayStatus: payload.today_status,
  }
}

async function overrideAttendance(attendanceId, payload) {
  const data = await overrideAttendanceRequest(attendanceId, payload)
  return normalizeAttendanceRecord(data)
}

async function getMissedCheckouts() {
  return await getMissedCheckoutsRequest()
}

async function getAttendanceTrend(view) {
  const data = await getAttendanceTrendRequest(view)
    console.log(`TREND API (${view})`, data)


  return data
}

async function getEmployeeAttendanceSummary(params) {
  return await getEmployeeAttendanceSummaryRequest(params)
}

async function getCorrectionRequests(params = {}) {
  return await getCorrectionRequestsRequest(params)
}

async function getAllCorrectionRequests(params = {}) {
  return await getAllCorrectionRequestsRequest(params)
}

async function getMyCorrectionRequests(params = {}) {
  return await getMyCorrectionRequestsRequest(params)
}

async function getCorrectionRequestById(requestId) {
  return await getCorrectionRequestByIdRequest(requestId)
}

async function approveCorrectionRequest(requestId, payload = {}) {
  return await approveCorrectionRequestRequest(
    requestId,
    payload
  )
}

async function rejectCorrectionRequest(requestId, payload) {
  return await rejectCorrectionRequestRequest(
    requestId,
    payload
  )
}

async function getCorrectionStatusMap(date) {
  return await getCorrectionStatusMapRequest(date)
}

export {
  checkIn,
  checkOut,
  startBreak,
  endBreak,
  getMyAttendance,
  getTeamAttendance,
  getCompanyAttendance,
  getCompanyAttendanceOverview,
  getTeamAttendanceOverview,
  overrideAttendance,
  getTodayAttendance,
  getMissedCheckouts,
  getAttendanceTrend,
  getEmployeeAttendanceSummary,
  getMyAttendanceCalendar,
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
