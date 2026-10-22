
import api from './axios.js'
import { SETTLEMENT_ENDPOINTS } from './endpoints.js'

async function getSettlements(filters = {}) {
  const params = {}

  if (filters.page) {
    params.page = filters.page
  }

  const { data } = await api.get(
    SETTLEMENT_ENDPOINTS.list,
    { params },
  )

  return data
}

async function getSettlementById(settlementId) {
  const { data } = await api.get(
    SETTLEMENT_ENDPOINTS.byId(settlementId),
  )

  return data
}

async function downloadSettlementStatement(settlementId) {
  const { data, headers } = await api.get(SETTLEMENT_ENDPOINTS.statement(settlementId), { responseType: 'blob' })
  return { data, headers }
}

async function createSettlement(employeeId) {
  const { data } = await api.post(
    SETTLEMENT_ENDPOINTS.list,
    { employee: employeeId },
  )

  return data
}

async function regenerateSettlement(settlementId) {
  const { data } = await api.post(SETTLEMENT_ENDPOINTS.regenerate(settlementId))
  return data
}

async function approveSettlement(settlementId) {
  const { data } = await api.post(SETTLEMENT_ENDPOINTS.approve(settlementId))
  return data
}

async function rejectSettlement(settlementId, payload) {
  const { data } = await api.post(SETTLEMENT_ENDPOINTS.reject(settlementId), payload)
  return data
}

async function paySettlement(settlementId, payload) {
  const { data } = await api.post(SETTLEMENT_ENDPOINTS.pay(settlementId), payload)
  return data
}

async function cancelSettlement(settlementId, payload) {
  const { data } = await api.post(SETTLEMENT_ENDPOINTS.cancel(settlementId), payload)
  return data
}

async function createSettlementReplacement(settlementId) {
  const { data } = await api.post(SETTLEMENT_ENDPOINTS.createReplacement(settlementId))
  return data
}

async function requestSettlementCorrection(settlementId, payload) {
  const { data } = await api.post(SETTLEMENT_ENDPOINTS.correction(settlementId), payload)
  return data
}

async function applySettlementCorrection(settlementId, payload) {
  const { data } = await api.post(SETTLEMENT_ENDPOINTS.correction(settlementId), payload)
  return data
}

async function requestSettlementCeoCorrection(settlementId, payload) {
  const issues = Array.isArray(payload?.issues) ? payload.issues : []
  if (issues.length === 0 || issues.some((issue) => (
    !issue || typeof issue !== 'object' ||
    !Object.prototype.hasOwnProperty.call(issue, 'field_name') ||
    !Object.prototype.hasOwnProperty.call(issue, 'current_value') ||
    !Object.prototype.hasOwnProperty.call(issue, 'expected_value') ||
    !Object.prototype.hasOwnProperty.call(issue, 'reason')
  ))) {
    throw new Error('At least one complete correction issue is required.')
  }

  const requestPayload = {
    remarks: typeof payload?.remarks === 'string' ? payload.remarks : '',
    issues: issues.map((issue) => ({
      field_name: issue.field_name,
      current_value: issue.current_value,
      expected_value: issue.expected_value,
      reason: issue.reason,
    })),
  }
  const { data } = await api.post(SETTLEMENT_ENDPOINTS.ceoCorrection(settlementId), requestPayload)
  return data
}

export {
  getSettlements,
  getSettlementById,
  downloadSettlementStatement,
  createSettlement,
  regenerateSettlement,
  approveSettlement,
  rejectSettlement,
  paySettlement,
  cancelSettlement,
  createSettlementReplacement,
  requestSettlementCorrection,
  applySettlementCorrection,
  requestSettlementCeoCorrection,
}
