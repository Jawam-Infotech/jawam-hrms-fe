import usePayrollData from './payroll/usePayrollData.js'
import useSalaryRevisions from './payroll/useSalaryRevisions.js'

function usePayroll() {
  const {
    payrolls,
    pagination: payrollPagination,
    payroll,
    settings,

    filters,

    loading: payrollLoading,
    detailLoading: payrollDetailLoading,
    approvalLoading: payrollApprovalLoading,
    rejectionLoading: payrollRejectionLoading,
    correctionLoading: payrollCorrectionLoading,
    regenerateLoading: payrollRegenerateLoading,
    settingsLoading,

    error: payrollError,
    detailError: payrollDetailError,
    approvalError: payrollApprovalError,
    rejectionError: payrollRejectionError,
    correctionError: payrollCorrectionError,
    regenerateError: payrollRegenerateError,
    settingsError,

    fetchPayrolls,
    fetchPayrollById,
    handleApprovePayroll,
    handleRejectPayroll,
    handleRequestPayrollCancellation,
    handleApprovePayrollCancellation,
    handleRejectPayrollCancellation,
    handleCreatePayrollReplacement,
    cancellationLoading,
    cancellationError,
    handleRequestPayrollCorrection,
    handleApplyPayrollCorrection,
    handleStartPayrollCorrection,
    handlePayPayroll,
    handleRegeneratePayroll,
    fetchPayrollSettings,

    updateFilters,
    changePage: changePayrollPage,

    refresh: refreshPayroll,
    handleGeneratePayroll,
    clearGenerateError,
    handleApproveLateGeneration,
  generateLoading,
  generateError,
    lateGenerationLoading,
    lateGenerationError,
    clearLateGenerationError,
  } = usePayrollData()

  const {
    revisions,
    pagination: revisionPagination,
    revision,

    loading: revisionsLoading,
    detailLoading: revisionDetailLoading,
    actionLoading: revisionActionLoading,

    error: revisionsError,
    detailError: revisionDetailError,
    actionError: revisionActionError,

    fetchRevisions,
    fetchRevisionById,

    handleCreateRevision,
    handleApproveRevision,
    handleRejectRevision,

    clearRevision,
    clearRevisionActionError,
  } = useSalaryRevisions()

  const refresh = async () => {
    await Promise.all([
      refreshPayroll(),
      fetchRevisions(),
    ])
  }

  return {
    /*
     * =========================
     * PAYROLL
     * =========================
     */

    payrolls,
    payroll,
    payrollPagination,
    filters,
    settings,
    handleGeneratePayroll,
    clearGenerateError,
    handleApproveLateGeneration,
    clearLateGenerationError,

    fetchPayrolls,
    fetchPayrollById,
    handleApprovePayroll,
    handleRejectPayroll,
    handleRequestPayrollCancellation,
    handleApprovePayrollCancellation,
    handleRejectPayrollCancellation,
    handleCreatePayrollReplacement,
    cancellationLoading,
    cancellationError,
    handleRequestPayrollCorrection,
    handleApplyPayrollCorrection,
    handleStartPayrollCorrection,
    handlePayPayroll,
    handleRegeneratePayroll,
    fetchPayrollSettings,

    updateFilters,
    changePayrollPage,

    refreshPayroll,

    /*
     * =========================
     * SALARY REVISIONS
     * =========================
     */

    revisions,
    revision,
    revisionPagination,

    fetchRevisions,
    fetchRevisionById,

    handleCreateRevision,
    handleApproveRevision,
    handleRejectRevision,

    clearRevision,
    clearRevisionActionError,

    /*
     * =========================
     * LOADING
     * =========================
     */

    payrollLoading,
    payrollDetailLoading,
    payrollApprovalLoading,
    payrollRejectionLoading,
    payrollCorrectionLoading,
    payrollRegenerateLoading,
    settingsLoading,

    revisionsLoading,
    revisionDetailLoading,
    revisionActionLoading,
    generateLoading,
    lateGenerationLoading,

    /*
     * =========================
     * ERRORS
     * =========================
     */

    payrollError,
    payrollDetailError,
    payrollApprovalError,
    payrollRejectionError,
    payrollCorrectionError,
    payrollRegenerateError,
    settingsError,

    revisionsError,
    revisionDetailError,
    revisionActionError,
    generateError,
    lateGenerationError,

    /*
     * =========================
     * MODULE REFRESH
     * =========================
     */

    refresh,
  }
}

export default usePayroll
