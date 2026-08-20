import api from './axios.js'
import { LEAVE_ENDPOINTS } from './endpoints.js'


async function getLeaveTypes() {
  const { data } = await api.get(LEAVE_ENDPOINTS.types)
  return data
}


async function getLeaveSummary() {
  const { data } = await api.get(LEAVE_ENDPOINTS.summary)
  return data
}


async function getLeaveBalance(params = {}) {
  const { data } = await api.get(LEAVE_ENDPOINTS.balance, {
    params,
  })
  return data
}


async function getMyLeaveRequests(params = {}) {
  const { data } = await api.get(LEAVE_ENDPOINTS.leaves, {
    params,
  })
  return data
}


async function createLeaveRequest(payload) {
  const { data } = await api.post(
    LEAVE_ENDPOINTS.leaves,
    payload,
  )
  return data
}


async function getLeaveRequestById(leaveId) {
  const { data } = await api.get(
    LEAVE_ENDPOINTS.byId(leaveId),
  )
  return data
}


async function cancelLeave(leaveId) {
  const { data } = await api.post(
    LEAVE_ENDPOINTS.cancel(leaveId),
  )
  return data
}


async function getPendingLeaveRequests(params = {}) {
  const { data } = await api.get(
    LEAVE_ENDPOINTS.pending,
    {
      params,
    },
  )
  return data
}


async function approveLeaveRequest(leaveId, payload = {}) {
  const { data } = await api.post(
    LEAVE_ENDPOINTS.approve(leaveId),
    payload,
  )
  return data
}


async function rejectLeaveRequest(leaveId, payload) {
  const { data } = await api.post(
    LEAVE_ENDPOINTS.reject(leaveId),
    payload,
  )
  return data
}


async function partiallyApproveLeave(
  leaveId,
  payload,
) {
  const { data } = await api.post(
    LEAVE_ENDPOINTS.partialApprove(leaveId),
    payload,
  )
  return data
}


async function approveLeaveCancellation(leaveId) {
  const { data } = await api.post(
    LEAVE_ENDPOINTS.approveCancellation(leaveId),
  )
  return data
}


async function rejectLeaveCancellation(leaveId) {
  const { data } = await api.post(
    LEAVE_ENDPOINTS.rejectCancellation(leaveId),
  )
  return data
}

async function getUpcomingLeaveRequests(params = {}) {
  const { data } = await api.get(
    LEAVE_ENDPOINTS.upcoming,
    {
      params,
    },
  )

  return data
}


export {
  getLeaveTypes,
  getLeaveSummary,
  getLeaveBalance,
  getMyLeaveRequests,
  createLeaveRequest,
  getLeaveRequestById,
  cancelLeave,
  getPendingLeaveRequests,
  approveLeaveRequest,
  rejectLeaveRequest,
  partiallyApproveLeave,
  approveLeaveCancellation,
  rejectLeaveCancellation,
  getUpcomingLeaveRequests,
}