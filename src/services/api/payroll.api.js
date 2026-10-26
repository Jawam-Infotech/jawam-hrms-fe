import api from './axios.js'
import {
  PAYROLL_ENDPOINTS,
  SALARY_REVISION_ENDPOINTS,
} from './endpoints.js'


/*
 * =========================
 * PAYROLL
 * =========================
 */

async function getPayrolls(filters = {}) {
  const params = {}

  if (filters.page) {
    params.page = filters.page
  }

  if (filters.employee) {
    params.employee = filters.employee
  }

  if (filters.department) {
    params.department = filters.department
  }

  if (filters.salaryMonth || filters.salary_month) {
    params.salary_month = filters.salaryMonth || filters.salary_month
  }

  if (filters.status) {
    params.status = filters.status
  }

  if (filters.paymentStatus || filters.payment_status) {
    params.payment_status = filters.paymentStatus || filters.payment_status
  }

  if (filters.joiningDate || filters.joining_date) {
    params.joining_date = filters.joiningDate || filters.joining_date
  }

  if (filters.leavingDate || filters.leaving_date) {
    params.leaving_date = filters.leavingDate || filters.leaving_date
  }

  if (filters.payrollGenerationDate || filters.payroll_generation_date) {
    params.payroll_generation_date =
      filters.payrollGenerationDate || filters.payroll_generation_date
  }

  if (filters.paymentDate || filters.payment_date) {
    params.payment_date = filters.paymentDate || filters.payment_date
  }

  if (filters.salaryRange || filters.salary_range) {
    params.salary_range = filters.salaryRange || filters.salary_range
  }

  if ((filters.lopDays !== undefined && filters.lopDays !== null) ||
      (filters.lop_days !== undefined && filters.lop_days !== null)) {
    params.lop_days = filters.lopDays ?? filters.lop_days
  }

  const { data } = await api.get(
    PAYROLL_ENDPOINTS.list,
    { params }
  )

  return data
}


async function getPayrollById(payrollId) {
  const { data } = await api.get(
    PAYROLL_ENDPOINTS.byId(payrollId)
  )

  return data
}

async function downloadPayrollPayslip(payrollId) {
  return api.get(PAYROLL_ENDPOINTS.payslip(payrollId), { responseType: 'blob' })
}

async function approvePayroll(payrollId) {
  const { data } = await api.post(
    PAYROLL_ENDPOINTS.approve(payrollId),
  )

  return data
}

async function rejectPayroll(payrollId, payload) {
  const { data } = await api.post(PAYROLL_ENDPOINTS.reject(payrollId), payload)
  return data
}

async function requestPayrollCorrection(payrollId, payload) {
  const { data } = await api.post(PAYROLL_ENDPOINTS.ceoCorrection(payrollId), payload)
  return data
}

async function applyPayrollCorrection(payrollId, payload) {
  const { data } = await api.post(PAYROLL_ENDPOINTS.correction(payrollId), payload)
  return data
}

async function startPayrollCorrection(payrollId, payload) {
  const { data } = await api.post(PAYROLL_ENDPOINTS.correction(payrollId), payload)
  return data
}

async function payPayroll(payrollId, payload) {
  const { data } = await api.post(PAYROLL_ENDPOINTS.pay(payrollId), payload)
  return data
}

async function requestPayrollCancellation(payrollId, payload) {
  const { data } = await api.post(PAYROLL_ENDPOINTS.cancelRequest(payrollId), payload)
  return data
}

async function approvePayrollCancellation(payrollId) {
  const { data } = await api.post(PAYROLL_ENDPOINTS.cancelApprove(payrollId))
  return data
}

async function rejectPayrollCancellation(payrollId, payload) {
  const { data } = await api.post(PAYROLL_ENDPOINTS.cancelReject(payrollId), payload)
  return data
}

async function createPayrollReplacement(payrollId) {
  const { data } = await api.post(PAYROLL_ENDPOINTS.createReplacement(payrollId))
  return data
}

async function regeneratePayroll(payrollId) {
  const { data } = await api.post(PAYROLL_ENDPOINTS.regenerate(payrollId))
  return data
}

async function exportPayrollExcel(filters = {}) {
  const params = {}
  if (filters.period) params.period = filters.period
  if (filters.salary_month) params.salary_month = filters.salary_month
  if (filters.financial_year) params.financial_year = filters.financial_year
  if (filters.start_month) params.start_month = filters.start_month
  if (filters.end_month) params.end_month = filters.end_month
  if (filters.department) params.department = filters.department
  return api.get(PAYROLL_ENDPOINTS.exportExcel, { params, responseType: 'blob' })
}


async function getPayrollSettings() {
  const { data } = await api.get(
    PAYROLL_ENDPOINTS.settings
  )

  return data
}

async function createPayrollSettings(payload) {
  const { data } = await api.post(
    PAYROLL_ENDPOINTS.settings,
    payload,
  )

  return data
}


/*
 * =========================
 * SALARY REVISIONS
 * =========================
 */

async function getSalaryRevisions(filters = {}) {
  const params = {}

  if (filters.page) {
    params.page = filters.page
  }

  if (filters.employee) {
    params.employee = filters.employee
  }

  if (filters.status) {
    params.status = filters.status
  }


  const { data } = await api.get(
    SALARY_REVISION_ENDPOINTS.list,
    { params }
  )

  return data
}


async function createSalaryRevision(payload) {
  const { data } = await api.post(
    SALARY_REVISION_ENDPOINTS.list,
    payload
  )

  return data
}


async function getSalaryRevisionById(revisionId) {
  const { data } = await api.get(
    SALARY_REVISION_ENDPOINTS.byId(revisionId)
  )

  return data
}


async function approveSalaryRevision(revisionId) {
  const { data } = await api.post(
    SALARY_REVISION_ENDPOINTS.approve(revisionId)
  )

  return data
}


async function rejectSalaryRevision(revisionId, rejectionReason) {
  const { data } = await api.post(
    SALARY_REVISION_ENDPOINTS.reject(revisionId),
    { rejection_reason: rejectionReason }
  )

  return data
}


/*
 * =========================
 * PAYROLL ACTIONS
 * =========================
 */

async function generatePayroll(salaryMonth) {
  const { data } = await api.post(
    PAYROLL_ENDPOINTS.generate,
    {
      salary_month: salaryMonth,
    }
  )

  return data
}

async function approveLateGeneration(payload) {
  const { data } = await api.post(
    PAYROLL_ENDPOINTS.lateGenerationApprove,
    payload,
  )

  return data
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
