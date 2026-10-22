import {
  getPayrolls as getPayrollsRequest,
  getPayrollById as getPayrollByIdRequest,
  downloadPayrollPayslip as downloadPayrollPayslipRequest,
  approvePayroll as approvePayrollRequest,
  rejectPayroll as rejectPayrollRequest,
  requestPayrollCorrection as requestPayrollCorrectionRequest,
  applyPayrollCorrection as applyPayrollCorrectionRequest,
  startPayrollCorrection as startPayrollCorrectionRequest,
  payPayroll as payPayrollRequest,
  requestPayrollCancellation as requestPayrollCancellationRequest,
  approvePayrollCancellation as approvePayrollCancellationRequest,
  rejectPayrollCancellation as rejectPayrollCancellationRequest,
  createPayrollReplacement as createPayrollReplacementRequest,
  regeneratePayroll as regeneratePayrollRequest,
  exportPayrollExcel as exportPayrollExcelRequest,
  getPayrollSettings as getPayrollSettingsRequest,
  createPayrollSettings as createPayrollSettingsRequest,
  getSalaryRevisions as getSalaryRevisionsRequest,
  createSalaryRevision as createSalaryRevisionRequest,
  getSalaryRevisionById as getSalaryRevisionByIdRequest,
  approveSalaryRevision as approveSalaryRevisionRequest,
  rejectSalaryRevision as rejectSalaryRevisionRequest,
  generatePayroll as generatePayrollRequest,
  approveLateGeneration as approveLateGenerationRequest,
} from './api/payroll.api.js'


/*
 * =========================
 * PAYROLL
 * =========================
 */

async function getPayrolls(filters = {}) {
  const data = await getPayrollsRequest(filters)

  return {
    payrolls: Array.isArray(data?.results)
      ? data.results
      : [],
    count: data?.count ?? 0,
    next: data?.next ?? null,
    previous: data?.previous ?? null,
  }
}


async function getPayrollById(payrollId) {
  return getPayrollByIdRequest(payrollId)
}

async function downloadPayrollPayslip(payrollId) {
  return downloadPayrollPayslipRequest(payrollId)
}

async function approvePayroll(payrollId) {
  return approvePayrollRequest(payrollId)
}

async function rejectPayroll(payrollId, payload) {
  return rejectPayrollRequest(payrollId, payload)
}

async function requestPayrollCorrection(payrollId, payload) {
  return requestPayrollCorrectionRequest(payrollId, payload)
}

async function applyPayrollCorrection(payrollId, payload) {
  return applyPayrollCorrectionRequest(payrollId, payload)
}

async function startPayrollCorrection(payrollId, payload) {
  return startPayrollCorrectionRequest(payrollId, payload)
}

async function payPayroll(payrollId, payload) {
  return payPayrollRequest(payrollId, payload)
}

async function requestPayrollCancellation(payrollId, reason) {
  const trimmedReason = typeof reason === 'string' ? reason.trim() : ''
  if (!trimmedReason) throw new Error('A cancellation reason is required.')
  return requestPayrollCancellationRequest(payrollId, { reason: trimmedReason })
}

async function approvePayrollCancellation(payrollId) {
  return approvePayrollCancellationRequest(payrollId)
}

async function rejectPayrollCancellation(payrollId, payload) {
  return rejectPayrollCancellationRequest(payrollId, payload)
}

async function createPayrollReplacement(payrollId) {
  return createPayrollReplacementRequest(payrollId)
}

async function regeneratePayroll(payrollId) {
  return regeneratePayrollRequest(payrollId)
}

async function exportPayrollExcel(filters = {}) {
  return exportPayrollExcelRequest(filters)
}


async function getPayrollSettings() {
  return getPayrollSettingsRequest()
}

async function createPayrollSettings(payload) {
  return createPayrollSettingsRequest(payload)
}
async function generatePayroll(salaryMonth) {
  return generatePayrollRequest(salaryMonth)
}

async function approveLateGeneration(payload) {
  return approveLateGenerationRequest(payload)
}


/*
 * =========================
 * SALARY REVISIONS
 * =========================
 */

async function getSalaryRevisions(filters = {}) {
  const data = await getSalaryRevisionsRequest(filters)

  return {
    revisions: Array.isArray(data?.results)
      ? data.results
      : [],
    count: data?.count ?? 0,
    next: data?.next ?? null,
    previous: data?.previous ?? null,
  }
}


async function createSalaryRevision(payload) {
  return createSalaryRevisionRequest(payload)
}


async function getSalaryRevisionById(revisionId) {
  return getSalaryRevisionByIdRequest(revisionId)
}


async function approveSalaryRevision(revisionId) {
  return approveSalaryRevisionRequest(revisionId)
}


async function rejectSalaryRevision(revisionId, reason) {
  return rejectSalaryRevisionRequest(revisionId, reason)
}


export {
  getPayrolls,
  getPayrollById,
  downloadPayrollPayslip,
  approvePayroll,
  rejectPayroll,
  requestPayrollCorrection,
  applyPayrollCorrection,
  startPayrollCorrection,
  payPayroll,
  requestPayrollCancellation,
  approvePayrollCancellation,
  rejectPayrollCancellation,
  createPayrollReplacement,
  regeneratePayroll,
  exportPayrollExcel,
  getPayrollSettings,
  createPayrollSettings,
  generatePayroll,
  approveLateGeneration,
  getSalaryRevisions,
  createSalaryRevision,
  getSalaryRevisionById,
  approveSalaryRevision,
  rejectSalaryRevision,
}
