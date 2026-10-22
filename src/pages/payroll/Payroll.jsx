import { useContext, useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import SalaryRevisions from './SalaryRevisions.jsx'
import FinalSettlement from './FinalSettlement.jsx'
import DashboardLayout from '../../layouts/DashboardLayout'
import usePayroll from '../../hooks/usePayroll.js'
import { UserContext } from '../../context/UserContext.jsx'
import PayrollFilters from '../../components/payroll/PayrollFilters.jsx'
import PayrollPagination from '../../components/payroll/PayrollPagination.jsx'
import AccessRestricted from '../../components/employees/AccessRestricted.jsx'
import Button from '../../components/ui/Button.jsx'
import GeneratePayrollModal from '../../components/payroll/GeneratePayrollModal.jsx'
import LateGenerationApprovalModal from '../../components/payroll/LateGenerationApprovalModal.jsx'
import PayrollSettings from './PayrollSettings.jsx'
import PayrollReports from './PayrollReports.jsx'
import { getApiErrorMessage } from '../../utils/apiErrorMessage.js'
import { Download } from 'lucide-react'
import PayslipPreview from '../../components/payroll/PayslipPreview.jsx'
import { downloadPayslipPreview, getPayslipFilename } from '../../utils/payslipPdf.js'
import PaymentStatusBadge from '../../components/payroll/PaymentStatusBadge.jsx'

function Payroll() {
  const { user } = useContext(UserContext)
  const canViewGeneratedPayroll = user.role === 'HR' || user.role === 'CEO'
  const canViewSalaryRevisions = canViewGeneratedPayroll
  const defaultTab = user.role === 'CEO' ? 'generated' : 'my'
  const navigate = useNavigate()
  const location = useLocation()
  const routeTab = location.pathname === '/payroll/settings' ? 'settings' : location.pathname === '/payroll/reports' ? 'reports' : location.pathname === '/payroll/salary-revisions' ? 'revisions' : null
  const [activeTab, setActiveTab] = useState(routeTab || defaultTab)
  const [isGeneratePayrollModalOpen, setIsGeneratePayrollModalOpen] = useState(false)
  const [isLateGenerationApprovalOpen, setIsLateGenerationApprovalOpen] = useState(false)
  const [lateGenerationApprovalKey, setLateGenerationApprovalKey] = useState(0)
  const [employeeFilterResetKey, setEmployeeFilterResetKey] = useState(0)
  const [payslipLoadingId, setPayslipLoadingId] = useState(null)
  const [payslipError, setPayslipError] = useState(null)
  const [previewPayroll, setPreviewPayroll] = useState(null)
  const [pendingPdf, setPendingPdf] = useState(null)
  const payslipPreviewRef = useRef(null)
  const {
    payrolls,
    payrollLoading,
    payrollError,
    payrollPagination,
    filters,
    fetchPayrolls,
    fetchPayrollById,
    updateFilters,
    changePayrollPage,
    handleGeneratePayroll,
    clearGenerateError,
    generateLoading,
    generateError,
    refreshPayroll,
    handleApproveLateGeneration,
    lateGenerationLoading,
    lateGenerationError,
    clearLateGenerationError,
  } = usePayroll()

  const canGeneratePayroll = user.role === 'HR' || user.role === 'CEO'

  const handleGenerate = async (salaryMonth) => {
    try {
      await handleGeneratePayroll(salaryMonth)
      setIsGeneratePayrollModalOpen(false)
      await refreshPayroll()
    } catch {
      // The hook stores the backend error for the modal to display.
    }
  }

  const handleOpenGeneratePayroll = () => {
    clearGenerateError()
    setIsGeneratePayrollModalOpen(true)
  }

  const handleDownloadPayslip = async (payroll) => {
    if (!payroll?.id || payslipLoadingId !== null) return
    setPayslipLoadingId(payroll.id)
    setPayslipError(null)
    try {
      const detail = await fetchPayrollById(payroll.id)
      const record = detail || payroll
      setPreviewPayroll(record)
      setPendingPdf({ filename: getPayslipFilename(record) })
    } catch (requestError) {
      setPayslipError(getApiErrorMessage(requestError, 'Unable to download payslip.'))
      setPayslipLoadingId(null)
    }
  }

  useEffect(() => {
    if (!pendingPdf || !previewPayroll || !payslipPreviewRef.current) return
    let cancelled = false
    const exportPreview = async () => {
      try {
        await downloadPayslipPreview(payslipPreviewRef.current, previewPayroll)
        if (!cancelled) {
          setPendingPdf(null)
          setPreviewPayroll(null)
          setPayslipLoadingId(null)
        }
      } catch (requestError) {
        if (!cancelled) {
          setPayslipError(getApiErrorMessage(requestError, 'Unable to generate payslip PDF.'))
          setPendingPdf(null)
          setPreviewPayroll(null)
          setPayslipLoadingId(null)
        }
      }
    }
    void exportPreview()
    return () => { cancelled = true }
  }, [pendingPdf, previewPayroll])

  useEffect(() => {
    // The URL is the source of truth when navigating with browser controls.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (routeTab) setActiveTab(routeTab)
  }, [routeTab])

  useEffect(() => {
    if (activeTab === 'my' || activeTab === 'generated') {
      fetchPayrolls({
        ...filters,
        employee: activeTab === 'my' ? user.id : filters.employee,
      }).catch(() => {})
    }
  }, [activeTab, fetchPayrolls, filters, user.id])

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    if (tab === 'settings') navigate('/payroll/settings')
    if (tab === 'reports') navigate('/payroll/reports')
    if (tab === 'revisions') navigate('/payroll/salary-revisions')
    if (tab === 'generated' || tab === 'my' || tab === 'settlements') navigate('/payroll')
    updateFilters({
      employee: tab === 'my' ? user.id : undefined,
    })
  }

  const getErrorMessage = (error) => {
    if (!error) {
      return 'Unable to load payroll records.'
    }

    return getApiErrorMessage(error, 'Unable to load payroll records.')
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-[32px] font-black text-[#111827]">
            Payroll
          </h1>

          <p className="mt-2 text-[16px] text-[#5f6679]">
            View your payroll records and payslips.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-[#e5e7eb]">
          {user.role !== 'CEO' && (
            <button
              type="button"
              onClick={() => handleTabChange('my')}
              className={`px-5 py-3 text-[14px] font-semibold ${
                activeTab === 'my'
                  ? 'border-b-2 border-[#111827] text-[#111827]'
                  : 'text-[#6b7280]'
              }`}
            >
              My Payroll
            </button>
          )}

          {canViewGeneratedPayroll && (
            <button
              type="button"
              onClick={() => handleTabChange('generated')}
              className={`px-5 py-3 text-[14px] font-semibold ${
                activeTab === 'generated'
                  ? 'border-b-2 border-[#111827] text-[#111827]'
                  : 'text-[#6b7280]'
              }`}
            >
              Generated Payroll
            </button>
          )}

          {canViewSalaryRevisions && (
            <button
              type="button"
              onClick={() => handleTabChange('revisions')}
              className={`px-5 py-3 text-[14px] font-semibold ${
                activeTab === 'revisions'
                  ? 'border-b-2 border-[#111827] text-[#111827]'
                  : 'text-[#6b7280]'
              }`}
            >
              Salary Revisions
            </button>
          )}

          <button
            type="button"
            onClick={() => handleTabChange('settlements')}
            className={activeTab === 'settlements'
              ? 'px-5 py-3 text-[14px] font-semibold border-b-2 border-[#111827] text-[#111827]'
              : 'px-5 py-3 text-[14px] font-semibold text-[#6b7280]'}
          >
            Final Settlement
          </button>

          {canViewGeneratedPayroll && (
            <button
              type="button"
              onClick={() => handleTabChange('settings')}
              className={activeTab === 'settings' ? 'border-b-2 border-[#111827] px-5 py-3 text-[14px] font-semibold text-[#111827]' : 'px-5 py-3 text-[14px] font-semibold text-[#6b7280]'}
            >
              Payroll Settings
            </button>
          )}

          {canViewGeneratedPayroll && (
            <button
              type="button"
              onClick={() => handleTabChange('reports')}
              className={activeTab === 'reports' ? 'border-b-2 border-[#111827] px-5 py-3 text-[14px] font-semibold text-[#111827]' : 'px-5 py-3 text-[14px] font-semibold text-[#6b7280]'}
            >
              Payroll Reports
            </button>
          )}
        </div>

        {/* Payroll History */}
        {(activeTab === 'my' || activeTab === 'generated') && (
          <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-[20px] font-black text-[#111827]">
                {activeTab === 'my' ? 'My Payroll' : 'Generated Payroll'}
              </h2>

              <div className="flex flex-wrap items-center justify-end gap-3">
                {activeTab === 'generated' && canGeneratePayroll && (
                  <Button
                    type="button"
                    onClick={handleOpenGeneratePayroll}
                    className="rounded-xl bg-[#2563eb] px-4 py-2.5 text-[13px] font-bold text-white transition hover:bg-[#1d4ed8]"
                  >
                    Generate Payroll
                  </Button>
                )}

                {activeTab === 'generated' && user.role === 'CEO' && (
                  <Button
                    type="button"
                    onClick={() => {
                      setLateGenerationApprovalKey((current) => current + 1)
                      clearLateGenerationError()
                      setIsLateGenerationApprovalOpen(true)
                    }}
                    className="rounded-xl border border-[#2563eb] px-4 py-2.5 text-[13px] font-bold text-[#2563eb] transition hover:bg-[#eff6ff]"
                  >
                    Late Generation Approval
                  </Button>
                )}

                <PayrollFilters
                  filters={filters}
                  showEmployee={activeTab === 'generated'}
                  employeeResetKey={employeeFilterResetKey}
                  onEmployeeChange={(employee) => updateFilters({ employee })}
                  onApply={(nextFilters) => updateFilters({
                    employee: activeTab === 'my' ? user.id : filters.employee,
                    salary_month: nextFilters.salary_month,
                    status: nextFilters.status,
                    payment_status: nextFilters.payment_status,
                  })}
                  onClear={() => {
                    setEmployeeFilterResetKey((current) => current + 1)
                    updateFilters({
                      employee: activeTab === 'my' ? user.id : undefined,
                      salary_month: undefined,
                      status: undefined,
                      payment_status: undefined,
                    })
                  }}
                />
              </div>
            </div>

            {/* Loading */}
            {payrollLoading && (
              <div className="py-12 text-center">
                <p className="text-[14px] text-[#6b7280]">
                  Loading payroll records...
                </p>
              </div>
            )}

            {/* Error */}
            {!payrollLoading && payrollError && payrollError.response?.status === 403 && (
              <AccessRestricted
                title="Payroll access denied"
                message={getErrorMessage(payrollError)}
                buttonText="Stay on Payroll"
                onBack={() => {}}
              />
            )}

            {!payrollLoading && payrollError && payrollError.response?.status !== 403 && (
              <div className="rounded-[16px] border border-[#fecaca] bg-[#fef2f2] p-6 text-center">
                <p className="text-[14px] font-semibold text-[#b91c1c]">
                  {getErrorMessage(payrollError)}
                </p>
              </div>
            )}
            {payslipError && <p className="mt-4 rounded-xl border border-[#fecaca] bg-[#fef2f2] p-4 text-sm font-semibold text-[#b91c1c]">{payslipError}</p>}

            {/* Empty State */}
            {!payrollLoading &&
              !payrollError &&
              payrolls.length === 0 && (
                <div className="py-12 text-center">
                  <h3 className="text-[16px] font-bold text-[#111827]">
                    No payroll records found
                  </h3>

                  <p className="mt-2 text-[14px] text-[#6b7280]">
                    Payroll records will appear here once they are
                    available.
                  </p>
                </div>
              )}

            {/* Payroll Table */}
            {!payrollLoading &&
              !payrollError &&
              payrolls.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-left text-[14px] text-[#374151]">
                    <thead className="border-b border-[#e5e7eb] text-[#6b7280]">
                      <tr>
                        <th className="py-4 font-semibold">
                          Employee Name
                        </th>

                        <th className="py-4 font-semibold">
                          Payroll Period
                        </th>

                        <th className="py-4 font-semibold">
                          Status
                        </th>

                        <th className="py-4 font-semibold">
                          Payment Status
                        </th>

                        <th className="py-4 font-semibold">
                          Payment Date
                        </th>

                        <th className="py-4 font-semibold">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {payrolls.map((payroll) => (
                        <tr
                          key={payroll.id}
                          className="border-b border-[#f3f4f6] transition-all hover:bg-[#f8fafc]"
                      >
                      <td className="py-4 font-semibold text-[#111827]">
                        {payroll.employee_name || '-'}
                      </td>

                      <td className="py-4 font-semibold text-[#111827]">
                            {payroll.salary_month || '-'}
                          </td>

                          <td className="py-4">
                            {payroll.status || '-'}
                          </td>

                          <td className="py-4">
                            <PaymentStatusBadge status={payroll.payment_status} />
                          </td>

                          <td className="py-4 text-[#6b7280]">
                            {payroll.payment_date || '-'}
                          </td>

                          <td className="py-4">
                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => navigate(`/payroll/${payroll.id}?view=${activeTab}`)}
                                className="rounded-full bg-[#e5e7eb] px-4 py-2 text-[12px] font-semibold text-[#374151]"
                              >
                                View
                              </button>
                              {activeTab === 'my' && payroll.payment_status === 'PAID' && (
                                <button type="button" onClick={() => handleDownloadPayslip(payroll)} disabled={payslipLoadingId !== null} className="inline-flex items-center gap-1 rounded-full border border-[#d1d5db] px-4 py-2 text-[12px] font-semibold text-[#374151] disabled:cursor-not-allowed disabled:opacity-50"><Download size={14} aria-hidden="true" />{payslipLoadingId === payroll.id ? 'Downloading...' : 'Download'}</button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
              </div>
            )}

            {!payrollError && payrollPagination.count > 0 && (
              <PayrollPagination
                count={payrollPagination.count}
                currentPage={filters.page || 1}
                hasPrevious={Boolean(payrollPagination.previous)}
                hasNext={Boolean(payrollPagination.next)}
                loading={payrollLoading}
                onPrevious={() => changePayrollPage(Math.max(1, (filters.page || 1) - 1))}
                onNext={() => changePayrollPage((filters.page || 1) + 1)}
              />
            )}
          </div>
        )}

        {/* Salary Revisions */}
        {activeTab === 'revisions' && canViewSalaryRevisions && <SalaryRevisions />}
        {activeTab === 'settlements' && <FinalSettlement />}
        {activeTab === 'settings' && canViewGeneratedPayroll && <PayrollSettings embedded />}
        {activeTab === 'reports' && canViewGeneratedPayroll && <PayrollReports embedded />}
      </div>

      <GeneratePayrollModal
        isOpen={isGeneratePayrollModalOpen}
        onClose={() => setIsGeneratePayrollModalOpen(false)}
        onGenerate={handleGenerate}
        loading={generateLoading}
        error={generateError}
      />

      <LateGenerationApprovalModal
        key={`late-generation-${lateGenerationApprovalKey}`}
        isOpen={isLateGenerationApprovalOpen}
        onClose={() => setIsLateGenerationApprovalOpen(false)}
        onApprove={handleApproveLateGeneration}
        loading={lateGenerationLoading}
        error={lateGenerationError}
      />
      <PayslipPreview exportOnly payroll={previewPayroll} previewRef={payslipPreviewRef} onClose={() => { if (!pendingPdf) setPreviewPayroll(null) }} />
    </DashboardLayout>
  )
}

export default Payroll
