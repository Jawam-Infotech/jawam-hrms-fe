
import {
  getSettlements as getSettlementsRequest,
  getSettlementById as getSettlementByIdRequest,
  downloadSettlementStatement as downloadSettlementStatementRequest,
  createSettlement as createSettlementRequest,
  regenerateSettlement as regenerateSettlementRequest,
  approveSettlement as approveSettlementRequest,
  rejectSettlement as rejectSettlementRequest,
  paySettlement as paySettlementRequest,
  cancelSettlement as cancelSettlementRequest,
  createSettlementReplacement as createSettlementReplacementRequest,
  requestSettlementCorrection as requestSettlementCorrectionRequest,
  applySettlementCorrection as applySettlementCorrectionRequest,
  requestSettlementCeoCorrection as requestSettlementCeoCorrectionRequest,
} from './api/settlements.api.js'

async function getSettlements(filters = {}) {
  const data = await getSettlementsRequest(filters)

  return {
    settlements: Array.isArray(data?.results)
      ? data.results
      : [],
    count: data?.count ?? 0,
    next: data?.next ?? null,
    previous: data?.previous ?? null,
  }
}

async function getSettlementById(settlementId) {
  return getSettlementByIdRequest(settlementId)
}

async function downloadSettlementStatement(settlementId) {
  return downloadSettlementStatementRequest(settlementId)
}

async function createSettlement(employeeId) {
  return createSettlementRequest(employeeId)
}

async function regenerateSettlement(settlementId) {
  return regenerateSettlementRequest(settlementId)
}

async function approveSettlement(settlementId) {
  return approveSettlementRequest(settlementId)
}

async function rejectSettlement(settlementId, payload) {
  return rejectSettlementRequest(settlementId, payload)
}

async function paySettlement(settlementId, payload) {
  return paySettlementRequest(settlementId, payload)
}

async function cancelSettlement(settlementId, reason) {
  const trimmedReason = typeof reason === 'string' ? reason.trim() : ''
  if (!trimmedReason) throw new Error('A cancellation reason is required.')
  return cancelSettlementRequest(settlementId, { reason: trimmedReason })
}

async function createSettlementReplacement(settlementId) {
  return createSettlementReplacementRequest(settlementId)
}

async function requestSettlementCorrection(settlementId, payload) {
  return requestSettlementCorrectionRequest(settlementId, payload)
}

async function applySettlementCorrection(settlementId, payload) {
  return applySettlementCorrectionRequest(settlementId, payload)
}

async function requestSettlementCeoCorrection(settlementId, payload) {
  return requestSettlementCeoCorrectionRequest(settlementId, payload)
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
