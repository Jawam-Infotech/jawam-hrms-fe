import { useContext, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import AccessRestricted from '../../components/employees/AccessRestricted.jsx'
import usePayroll from '../../hooks/usePayroll.js'
import { getApiErrorMessage } from '../../utils/apiErrorMessage.js'
import { UserContext } from '../../context/UserContext.jsx'
import Button from '../../components/ui/Button.jsx'
import ConfirmationModal from '../../components/shared/ConfirmationModal.jsx'
import PayrollCorrectionModal from '../../components/payroll/PayrollCorrectionModal.jsx'
import DatePicker from '../../components/ui/DatePicker.jsx'
import PayslipPreview from '../../components/payroll/PayslipPreview.jsx'
import { downloadPayslipPreview } from '../../utils/payslipPdf.js'

function getSelectedCeoCorrectionRequest(payroll) {
  if (Array.isArray(payroll?.correction_issues)) return { issues: payroll.correction_issues }
  const requests = Array.isArray(payroll?.ceo_correction_requests) ? payroll.ceo_correction_requests : []
  return requests.reduce((latest, request) => {
    if (!Array.isArray(request?.issues)) return latest
    if (!latest) return request
    return new Date(request.created_at || 0).getTime() > new Date(latest.created_at || 0).getTime() ? request : latest
  }, null)
}

function PayrollDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useContext(UserContext)
  const [isApprovalConfirmationOpen, setIsApprovalConfirmationOpen] = useState(false)
  const [isRejectOpen, setIsRejectOpen] = useState(false)
  const [isCorrectionOpen, setIsCorrectionOpen] = useState(false)
  const [isCeoRequestDetailsOpen, setIsCeoRequestDetailsOpen] = useState(false)
  const [isCancellationOpen, setIsCancellationOpen] = useState(false)
  const [cancellationReason, setCancellationReason] = useState('')
  const [isCancellationRejectOpen, setIsCancellationRejectOpen] = useState(false)
  const [cancellationRejectReason, setCancellationRejectReason] = useState('')
  const [rejectionReason, setRejectionReason] = useState('')
  const [correctionReady, setCorrectionReady] = useState(false)
  const [paymentDate, setPaymentDate] = useState('')
  const [manualDraft, setManualDraft] = useState({ earnings: [], deductions: [], adjustments: [] })
  const [manualDraftInitialized, setManualDraftInitialized] = useState(false)
  const [manualEditor, setManualEditor] = useState(null)
  const [manualEditorKey, setManualEditorKey] = useState(0)
  const [detailsCategory, setDetailsCategory] = useState(null)
  const [payslipDownloadLoading, setPayslipDownloadLoading] = useState(false)
  const [payslipDownloadError, setPayslipDownloadError] = useState(null)
  const [payslipDownloadRequested, setPayslipDownloadRequested] = useState(false)
  const payslipPreviewRef = useRef(null)
  const {
    payroll,
    payrollDetailLoading,
    payrollDetailError,
    fetchPayrollById,
    handleApprovePayroll,
    payrollApprovalLoading,
    payrollApprovalError,
    handleRejectPayroll,
    payrollRejectionLoading,
    payrollRejectionError,
    handleRequestPayrollCorrection,
    handleApplyPayrollCorrection,
    handlePayPayroll,
    payrollCorrectionLoading,
    payrollCorrectionError,
    handleRegeneratePayroll,
    payrollRegenerateLoading,
    payrollRegenerateError,
    handleRequestPayrollCancellation,
    handleApprovePayrollCancellation,
    handleRejectPayrollCancellation,
    handleCreatePayrollReplacement,
    cancellationLoading,
    cancellationError,
  } = usePayroll()

  useEffect(() => {
    fetchPayrollById(id).catch(() => {})
  }, [fetchPayrollById, id])

  const status = payrollDetailError?.response?.status
  const message = getApiErrorMessage(payrollDetailError, 'Unable to load payroll details.')
  const approvalMessage = getApiErrorMessage(
    payrollApprovalError,
    'Unable to approve payroll.',
  )
  const userRole = String(user?.role || '').trim().toUpperCase()
  const isMyPayrollView = searchParams.get('view') === 'my'
  const payrollStatus = String(payroll?.status || '').trim().toUpperCase()
  const calculationInputs = payroll?.current_version?.calculation_inputs || {}
  const calculationResults = payroll?.current_version?.calculation_results || {}
  const earnings = payroll?.current_version?.earnings || []
  const otherEarnings = earnings
    .filter((earning) => earning.earning_type === 'OTHER')
    .map((earning) => earning.amount)
    .filter(Boolean)
  const positiveAdjustment = calculationResults.positive_adjustments_total
  const negativeAdjustment = calculationResults.negative_adjustments_total
  const adjustment = positiveAdjustment && positiveAdjustment !== '0.00'
    ? positiveAdjustment
    : negativeAdjustment && negativeAdjustment !== '0.00'
      ? negativeAdjustment
      : undefined
  const formatDayCount = (value) => {
    if (value === null || value === undefined || value === '') return undefined
    const numericValue = Number(value)
    return Number.isFinite(numericValue) ? numericValue.toString() : value
  }
  const formatCurrency = (value) => {
    if (value === null || value === undefined || value === '') return undefined
    const numericValue = Number(value)
    return Number.isFinite(numericValue)
      ? new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(numericValue)
      : value
  }
  const formatAmountOrZero = (value) => formatCurrency(value === null || value === undefined || value === '' ? 0 : value)
  const detailFields = [
    ['Calendar Days', calculationInputs.calendar_days],
    ['Working Days', calculationInputs.working_days],
    ['Weekend Days', calculationInputs.weekly_off_days],
    ['Holiday Days', calculationInputs.holiday_days],
    ['Present Days', calculationInputs.present_days],
    ['Absent Days', formatDayCount(calculationInputs.absent_days)],
    ['Paid Leave Days', formatDayCount(calculationInputs.paid_leave_days)],
    ['Unpaid Leave Days', formatDayCount(calculationInputs.unpaid_leave_days)],
    ['Late Days', formatDayCount(calculationInputs.late_days)],
    ['Eligible Days', formatDayCount(calculationInputs.eligible_days)],
    ['Not Joined Days', formatDayCount(calculationInputs.not_joined_days)],
    ['LOP Days', calculationInputs.lop_days],
    ['Half Days', calculationInputs.half_days],
    ['Per Day Salary for LOP', formatCurrency(calculationInputs.per_day_salary_for_lop)],
    ['Monthly Salary', calculationInputs.monthly_salary],
    ['LOP Deduction', calculationResults.lop_deduction],
    ['Other Earnings', otherEarnings.length ? otherEarnings.map((value) => formatAmountOrZero(value)).join(', ') : formatAmountOrZero(0)],
    ['Other Deductions', formatAmountOrZero(calculationResults.other_deductions_total)],
    ['Adjustment', formatAmountOrZero(adjustment)],
    ['Gross', calculationResults.gross_salary],
    ['Total Deductions', calculationResults.total_deductions],
    ['Net Payable', calculationResults.net_payable],
    ['Expected Pay Date', payroll?.expected_pay_date],
    ['Payment Date', payroll?.payment_date],
  ]
  const canApprove = !isMyPayrollView && userRole === 'HR' && payrollStatus === 'GENERATED'
  const canReject = canApprove
  const canRequestCancellation = !isMyPayrollView && userRole === 'HR' && ['GENERATED', 'HR_APPROVED'].includes(payrollStatus) && payroll?.payment_status !== 'PAID' && !payroll?.payment_date
  const canReviewCancellation = !isMyPayrollView && userRole === 'CEO' && payrollStatus === 'CANCELLATION_REQUESTED'
  const canCreateReplacement = !isMyPayrollView && userRole === 'HR' && payrollStatus === 'CANCELLED'
  const canApplyCorrection = !isMyPayrollView && userRole === 'HR' && ['HR_REJECTED', 'CORRECTION_REQUIRED'].includes(payrollStatus)
  const canRegenerate = !isMyPayrollView && userRole === 'HR' && ['ERROR', 'PAYMENT_INFO_PENDING'].includes(payrollStatus)
  const canRequestCorrection = !isMyPayrollView && userRole === 'CEO' && payrollStatus === 'HR_APPROVED'
  const canPay = !isMyPayrollView && userRole === 'CEO' && payrollStatus === 'HR_APPROVED' && payroll?.payment_status !== 'NOT_REQUIRED'
  const canDownloadPayslip = !isMyPayrollView && ['HR', 'CEO'].includes(userRole) && payroll?.payment_status === 'PAID'
  const selectedCeoCorrectionRequest = getSelectedCeoCorrectionRequest(payroll)
  const canViewComponentDetails = !['HR_REJECTED', 'CORRECTION_REQUIRED'].includes(payrollStatus)

  const getManualDraft = (source) => ({
    earnings: source?.current_version?.earnings?.filter((item) => item.earning_type === 'OTHER').map(({ amount, reason }) => ({ amount: amount || '', reason: reason || '' })) || [],
    deductions: source?.current_version?.deductions?.filter((item) => item.deduction_type === 'OTHER').map(({ amount, reason }) => ({ amount: amount || '', reason: reason || '' })) || [],
    adjustments: source?.current_version?.adjustments?.map(({ reference_month, direction, amount, reason, supporting_reference }) => ({ reference_month: reference_month || '', direction: direction || '', amount: amount || '', reason: reason || '', supporting_reference: supporting_reference || '' })) || [],
  })

  const handleApprove = async () => {
    try {
      await handleApprovePayroll(id)
      await fetchPayrollById(id)
      setIsApprovalConfirmationOpen(false)
    } catch {
      // The hook stores the backend error for display.
    }
  }

  const handleReject = async () => {
    if (!rejectionReason.trim()) return
    try {
      await handleRejectPayroll(id, { reason: rejectionReason.trim() })
      const refreshedPayroll = await fetchPayrollById(id)
      if (String(refreshedPayroll?.status || '').trim().toUpperCase() === 'HR_REJECTED') {
        setCorrectionReady(false)
        setManualDraft(getManualDraft(refreshedPayroll))
        setManualDraftInitialized(true)
      }
      setIsRejectOpen(false)
      setRejectionReason('')
    } catch {
      // The hook stores the backend error for display.
    }
  }

  const handleRequestCancellation = async () => {
    const reason = cancellationReason.trim()
    if (!reason || cancellationLoading) return
    try {
      await handleRequestPayrollCancellation(id, reason)
      await fetchPayrollById(id)
      setIsCancellationOpen(false)
      setCancellationReason('')
    } catch {
      // The hook stores the backend error for display.
    }
  }

  const handleApproveCancellation = async () => {
    if (cancellationLoading) return
    try {
      await handleApprovePayrollCancellation(id)
      await fetchPayrollById(id)
    } catch {
      // The hook stores the backend error for display.
    }
  }

  const handleRejectCancellation = async () => {
    const reason = cancellationRejectReason.trim()
    if (!reason || cancellationLoading) return
    try {
      await handleRejectPayrollCancellation(id, reason)
      await fetchPayrollById(id)
      setIsCancellationRejectOpen(false)
      setCancellationRejectReason('')
    } catch {
      // The hook stores the backend error for display.
    }
  }

  const handleCreateReplacement = async () => {
    if (cancellationLoading) return
    try {
      const response = await handleCreatePayrollReplacement(id)
      if (response?.id !== undefined && response?.id !== null) {
        navigate('/payroll/' + response.id)
      }
    } catch {
      // The hook stores the backend error for display.
    }
  }

  const handleCorrection = async (payload) => {
    try {
      await handleRequestPayrollCorrection(id, payload)
      await fetchPayrollById(id)
      setIsCorrectionOpen(false)
    } catch {
      // The hook stores the backend error for display.
    }
  }

  const handleApplyCorrection = async (payload) => {
    try {
      await handleApplyPayrollCorrection(id, payload.payload)
      const refreshedPayroll = await fetchPayrollById(id)
      setCorrectionReady(refreshedPayroll?.status === 'GENERATED')
      setManualDraft({ earnings: [], deductions: [], adjustments: [] })
      setManualDraftInitialized(false)
      setIsCorrectionOpen(false)
    } catch {
      // The hook stores the backend error and keeps the modal open.
    }
  }

  const openManualEditor = (type) => {
    if (!manualDraftInitialized) {
      setManualDraft(getManualDraft(payroll))
      setManualDraftInitialized(true)
    }
    setManualEditor(type)
    setManualEditorKey((current) => current + 1)
    setIsCorrectionOpen(true)
  }

  const handleSaveDraft = ({ draft }) => {
    setManualDraft((current) => ({ ...current, ...draft }))
    setIsCorrectionOpen(false)
  }

  const handleConfirmChanges = () => {
    handleApplyCorrection({ payload: manualDraft })
  }

  const handlePay = async () => {
    if (!paymentDate) return
    try {
      await handlePayPayroll(id, { actual_payment_date: paymentDate })
      await fetchPayrollById(id)
    } catch {
      // The hook stores the backend error for display.
    }
  }

  const handleRegenerate = async () => {
    try {
      await handleRegeneratePayroll(id)
    } catch {
      // The hook stores the backend error for display.
    }
  }

  const handleDownloadPayslip = () => {
    if (!canDownloadPayslip || payslipDownloadLoading || !payroll) return
    setPayslipDownloadError(null)
    setPayslipDownloadLoading(true)
    setPayslipDownloadRequested(true)
  }

  useEffect(() => {
    if (!payslipDownloadRequested || !payslipPreviewRef.current || !payroll) return
    let cancelled = false
    const exportPayslip = async () => {
      try {
        await downloadPayslipPreview(payslipPreviewRef.current, payroll)
        if (!cancelled) setPayslipDownloadRequested(false)
      } catch (error) {
        if (!cancelled) {
          setPayslipDownloadError(getApiErrorMessage(error, 'Unable to download payslip.'))
          setPayslipDownloadRequested(false)
        }
      } finally {
        if (!cancelled) setPayslipDownloadLoading(false)
      }
    }
    void exportPayslip()
    return () => { cancelled = true }
  }, [payslipDownloadRequested, payroll])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-[28px] font-black text-[#111827]">Payroll Detail</h1>
            <p className="mt-1 text-[14px] text-[#6b7280]">Backend-provided payroll snapshot.</p>
          </div>
          <Link to="/payroll" className="rounded-full border border-[#d1d5db] px-4 py-2 text-[14px] font-bold text-[#374151]">Back to Payroll</Link>
        </div>

        {payrollDetailLoading && <div className="rounded-[24px] bg-white p-12 text-center text-[#6b7280]">Loading payroll details...</div>}

        {!payrollDetailLoading && payrollDetailError && (
          status === 403
            ? <AccessRestricted title="Payroll access denied" message={message} buttonText="Return to Payroll" onBack={() => window.history.back()} />
            : <div className="rounded-[24px] border border-[#fecaca] bg-[#fef2f2] p-8 text-center text-[14px] font-semibold text-[#b91c1c]">{status === 404 ? 'Payroll record not found.' : message}</div>
        )}

        {!payrollDetailLoading && !payrollDetailError && payroll && (
          <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <div className="grid gap-4 border-b border-[#e5e7eb] pb-6 sm:grid-cols-2 lg:grid-cols-4">
              <Detail label="Employee" value={payroll.employee_name || payroll.employee || '—'} />
              <Detail label="Salary Month" value={payroll.salary_month || '—'} />
              <Detail label="Status" value={payrollStatus === 'HR_REJECTED' ? 'Needs Changes' : payroll.status || '—'} />
              <Detail label="Payment Status" value={payroll.payment_status || '—'} />
            </div>
            {payroll.cancelled_replacement_for !== undefined && payroll.cancelled_replacement_for !== null && (
              <p className="mt-4 text-sm font-semibold text-[#6b7280]">Replacement for payroll #{payroll.cancelled_replacement_for}</p>
            )}
            {payrollStatus === 'SKIPPED' && payroll.skip_reason && (
              <div className="mt-6 rounded-[14px] border border-[#fde68a] bg-[#fffbeb] p-4">
                <p className="text-[12px] font-semibold text-[#92400e]">
                  Skip Reason
                </p>
                <p className="mt-1 text-[14px] font-bold text-[#78350f]">
                  {payroll.skip_reason}
                </p>
              </div>
            )}
            {payrollApprovalError && (
              <div className="mt-4 rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-[14px] font-semibold text-[#b91c1c]">
                {approvalMessage}
              </div>
            )}
            {(payrollRejectionError || payrollCorrectionError || payrollRegenerateError || cancellationError) && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{getApiErrorMessage(payrollRejectionError || payrollCorrectionError || payrollRegenerateError || cancellationError, 'Payroll action failed.')}</div>}

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {detailFields.map(([label, value]) => {
                const manualType = label === 'Other Earnings'
                  ? 'earnings'
                  : label === 'Other Deductions'
                    ? 'deductions'
                    : label === 'Adjustment'
                      ? 'adjustments'
                      : null

                if (manualType && canApplyCorrection && !correctionReady) {
                  const serverEntries = manualType === 'earnings'
                    ? payroll?.current_version?.earnings?.filter((item) => item.earning_type === 'OTHER')
                    : manualType === 'deductions'
                      ? payroll?.current_version?.deductions?.filter((item) => item.deduction_type === 'OTHER')
                      : payroll?.current_version?.adjustments
                  const count = (manualDraftInitialized ? manualDraft[manualType] : serverEntries || []).length
                  return <ManualSummaryCard key={label} label={label} value={count ? `${count} ${count === 1 ? 'entry' : 'entries'}` : '0'} canEdit={userRole === 'HR'} onOpen={() => openManualEditor(manualType)} onViewDetails={canViewComponentDetails ? () => setDetailsCategory({ label, records: serverEntries || [] }) : undefined} />
                }

                const records = manualType === 'earnings'
                  ? earnings.filter((item) => item.earning_type === 'OTHER')
                  : manualType === 'deductions'
                    ? (payroll?.current_version?.deductions || []).filter((item) => item.deduction_type === 'OTHER')
                    : manualType === 'adjustments'
                      ? (payroll?.current_version?.adjustments || [])
                      : []
                return <Detail key={label} label={label} value={value} onViewDetails={manualType && canViewComponentDetails ? () => setDetailsCategory({ label, records }) : undefined} />
              })}
            </div>

            {payrollStatus === 'ERROR' && (
              <WorkflowNotice
                title="Payroll Generation Failed"
                value={payroll.error_message || 'Payroll generation failed.'}
                onAction={canRegenerate ? handleRegenerate : undefined}
                loading={payrollRegenerateLoading}
                actionLabel="Regenerate Payroll"
              />
            )}
            {payrollStatus === 'PAYMENT_INFO_PENDING' && (
              <WorkflowNotice
                title="Payment Information Required"
                value="Update the employee's bank information, then regenerate this payroll."
                onAction={canRegenerate ? handleRegenerate : undefined}
                loading={payrollRegenerateLoading}
                actionLabel="Regenerate Payroll"
              />
            )}
            {payrollStatus === 'HR_REJECTED' && userRole === 'HR' && <WorkflowNotice title="Needs Changes" value={payroll.hr_rejection_reason || payroll.rejection_reason || 'Payroll was rejected.'} valueLabel="HR Rejection Reason" onAction={canApplyCorrection ? handleConfirmChanges : undefined} loading={payrollCorrectionLoading} actionLabel="Make Changes" />}
            {payrollStatus === 'CORRECTION_REQUIRED' && userRole === 'HR' && <WorkflowNotice title="Correction Required" value={payroll.correction_remarks || payroll.remarks || 'Review the requested correction and apply the required changes.'} onAction={handleConfirmChanges} onDetails={() => setIsCeoRequestDetailsOpen(true)} loading={payrollCorrectionLoading} actionLabel="Make Changes" />}

            {(canApprove || canReject || canRequestCancellation || canRequestCorrection || canPay || canReviewCancellation || canCreateReplacement || (canApplyCorrection && ['GENERATED', 'HR_REJECTED', 'CORRECTION_REQUIRED'].includes(payrollStatus))) && (
              <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
                {canPay && <div className="flex min-w-[230px] flex-col gap-1"><span className="text-[12px] font-bold uppercase tracking-wider text-[#6b7280]">Actual Payment Date</span><DatePicker value={paymentDate} onChange={setPaymentDate} disabled={payrollCorrectionLoading} ariaLabel="Actual payment date" placeholder="Select payment date" className="min-h-12 w-full px-4 text-[15px]" /></div>}
                <div className="flex flex-wrap items-end gap-3">
                {canApplyCorrection && !['GENERATED', 'HR_REJECTED', 'CORRECTION_REQUIRED'].includes(payrollStatus) && !correctionReady && <Button type="button" onClick={handleConfirmChanges} disabled={payrollCorrectionLoading} className="rounded-full bg-[#2563eb] px-5 py-2.5 text-[14px] font-bold text-white">{payrollCorrectionLoading ? 'Saving...' : 'Confirm Changes'}</Button>}
                {canApprove && <Button type="button" onClick={() => setIsApprovalConfirmationOpen(true)} disabled={payrollApprovalLoading} className="rounded-full bg-[#2563eb] px-5 py-2.5 text-[14px] font-bold text-white hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-50">Approve Payroll</Button>}
                {canReject && <Button type="button" onClick={() => setIsRejectOpen(true)} disabled={payrollRejectionLoading} className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-bold text-white">Reject Payroll</Button>}{canRequestCancellation && <Button type="button" onClick={() => setIsCancellationOpen(true)} disabled={cancellationLoading} className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-bold text-white">Cancel Payroll</Button>}{canReviewCancellation && <><Button type="button" onClick={handleApproveCancellation} disabled={cancellationLoading} className="rounded-full bg-green-600 px-5 py-2.5 text-sm font-bold text-white">{cancellationLoading ? 'Approving...' : 'Approve Cancellation'}</Button><Button type="button" onClick={() => setIsCancellationRejectOpen(true)} disabled={cancellationLoading} className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-bold text-white">Reject Cancellation</Button></>}{canCreateReplacement && <Button type="button" onClick={handleCreateReplacement} disabled={cancellationLoading} className="rounded-full bg-[#2563eb] px-5 py-2.5 text-[14px] font-bold text-white disabled:opacity-50">{cancellationLoading ? 'Creating...' : 'Create Replacement Payroll'}</Button>}
                {canRequestCorrection && <Button type="button" onClick={() => setIsCorrectionOpen(true)} className="rounded-full bg-amber-600 px-5 py-2.5 text-sm font-bold text-white">Request Correction</Button>}
                {canPay && <Button type="button" onClick={handlePay} disabled={!paymentDate || payrollCorrectionLoading} className="rounded-full bg-[#16a34a] px-5 py-2.5 text-sm font-bold text-white">{payrollCorrectionLoading ? 'Paying...' : 'Mark as Paid'}</Button>}
                </div>
              </div>
            )}
            {payslipDownloadError && <p className="mt-4 rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-[14px] font-semibold text-[#b91c1c]">{payslipDownloadError}</p>}
            {canDownloadPayslip && <div className="mt-6 flex justify-end border-t border-[#e5e7eb] pt-5"><Button type="button" onClick={handleDownloadPayslip} disabled={payslipDownloadLoading} className="rounded-full bg-[#2563eb] px-5 py-2.5 text-[14px] font-bold text-white hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-50">{payslipDownloadLoading ? 'Downloading...' : 'Download Payslip'}</Button></div>}
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={isApprovalConfirmationOpen}
        title="Approve Payroll"
        message="Approve this payroll and move it from GENERATED to HR_APPROVED?"
        confirmText="Approve Payroll"
        cancelText="Cancel"
        loading={payrollApprovalLoading}
        loadingText="Approving..."
        onConfirm={handleApprove}
        onCancel={() => setIsApprovalConfirmationOpen(false)}
      />
      {isRejectOpen && <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="w-full max-w-lg rounded-2xl bg-white p-6"><h2 className="text-xl font-black">Reject Payroll</h2><textarea autoFocus value={rejectionReason} onChange={(event) => setRejectionReason(event.target.value)} placeholder="Rejection Reason *" className="mt-5 min-h-28 w-full rounded-xl border p-3" /><div className="mt-5 flex justify-end gap-3"><Button type="button" disabled={payrollRejectionLoading} onClick={() => setIsRejectOpen(false)} className="rounded-full border px-5 py-2">Cancel</Button><Button type="button" disabled={payrollRejectionLoading || !rejectionReason.trim()} onClick={handleReject} className="rounded-full bg-red-600 px-5 py-2 text-white">{payrollRejectionLoading ? 'Rejecting...' : 'Reject Payroll'}</Button></div></div></div>}
      {isCancellationOpen && <PayrollCancellationModal isOpen loading={cancellationLoading} error={cancellationError} reason={cancellationReason} onReasonChange={setCancellationReason} onClose={() => setIsCancellationOpen(false)} onSubmit={handleRequestCancellation} />}
      {isCancellationRejectOpen && <PayrollCancellationModal isOpen loading={cancellationLoading} error={cancellationError} title="Reject Cancellation" submitLabel="Reject Cancellation" reason={cancellationRejectReason} onReasonChange={setCancellationRejectReason} onClose={() => setIsCancellationRejectOpen(false)} onSubmit={handleRejectCancellation} />}
      <PayrollCorrectionModal key={`payroll-${id}-correction-${isCorrectionOpen}-${manualEditorKey}`} isOpen={isCorrectionOpen} loading={payrollCorrectionLoading} error={payrollCorrectionError} payroll={payroll} draft={manualDraft} componentType={manualEditor} onCancel={() => setIsCorrectionOpen(false)} onSubmit={canApplyCorrection ? handleApplyCorrection : handleCorrection} onSaveDraft={handleSaveDraft} mode={canApplyCorrection ? 'manual' : 'request'} draftOnly={canApplyCorrection} title={canApplyCorrection ? (manualEditor === 'earnings' ? 'Other Earnings' : manualEditor === 'deductions' ? 'Other Deductions' : 'Previous Month Adjustment') : 'Request Correction'} submitLabel={canApplyCorrection ? 'Save Changes' : 'Request Correction'} />
      <CeoCorrectionDetailsModal isOpen={isCeoRequestDetailsOpen} payroll={payroll} request={selectedCeoCorrectionRequest} onClose={() => setIsCeoRequestDetailsOpen(false)} />
      <PayrollRecordsModal category={detailsCategory} onClose={() => setDetailsCategory(null)} />
      {payslipDownloadRequested && <PayslipPreview payroll={payroll} previewRef={payslipPreviewRef} onClose={() => {}} />}
    </DashboardLayout>
  )
}

function PayrollCancellationModal({ isOpen, loading, error, title = 'Cancel Payroll', submitLabel = 'Cancel Payroll', reason, onReasonChange, onClose, onSubmit }) {
  if (!isOpen) return null
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="payroll-cancellation-title"><div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"><h2 id="payroll-cancellation-title" className="text-xl font-black">{title}</h2><p className="mt-2 text-sm text-[#6b7280]">Provide a reason for this cancellation action.</p><textarea value={reason} onChange={(event) => onReasonChange(event.target.value)} disabled={loading} placeholder="Reason *" className="mt-5 min-h-28 w-full rounded-xl border p-3" />{error && <p className="mt-3 text-sm font-semibold text-red-600">{getApiErrorMessage(error, 'Unable to update payroll cancellation.')}</p>}<div className="mt-5 flex justify-end gap-3"><Button type="button" onClick={onClose} disabled={loading} className="rounded-full border px-5 py-2">Cancel</Button><Button type="button" onClick={onSubmit} disabled={loading || !reason.trim()} className="rounded-full bg-red-600 px-5 py-2 text-white">{loading ? 'Submitting...' : submitLabel}</Button></div></div></div>
}

function WorkflowNotice({ title, value, valueLabel, issues = [], onAction, onDetails, loading, actionLabel }) {
  const loadingLabel = actionLabel === 'Make Changes' ? 'Saving...' : 'Regenerating...'
  return <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="font-bold text-amber-900">{title}</p>{valueLabel && <p className="mt-1 text-[12px] font-semibold text-amber-900">{valueLabel}</p>}<p className="mt-1 text-sm text-amber-800">{value}</p>{issues.length > 0 && <div className="mt-3 space-y-2 text-sm text-amber-900"><p className="font-bold">Correction Issues</p>{issues.map((issue, index) => <div key={`${issue.field_name || 'issue'}-${index}`} className="rounded-lg border border-amber-200 bg-amber-100/50 p-2"><p><strong>Field:</strong> {issue.field_name || '—'}</p><p><strong>Current:</strong> {issue.current_value || '—'}</p><p><strong>Expected:</strong> {issue.expected_value || '—'}</p><p><strong>Reason:</strong> {issue.reason || '—'}</p></div>)}</div>}</div><div className="flex gap-3">{onDetails && <Button type="button" onClick={onDetails} className="rounded-full border border-amber-300 px-4 py-2 text-sm font-bold text-amber-900 hover:bg-amber-100">View Details</Button>}{onAction && <Button type="button" onClick={onAction} disabled={loading} className="rounded-full bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">{loading ? loadingLabel : actionLabel}</Button>}</div></div></div>
}

function Detail({ label, value, onViewDetails }) {
  const displayValue = Array.isArray(value)
    ? (value.length ? JSON.stringify(value) : '—')
    : value ?? '—'

  return <div className="rounded-[14px] bg-[#f9fafb] p-4"><p className="text-[12px] font-semibold text-[#6b7280]">{label}</p><p className="mt-1 break-words text-[14px] font-bold text-[#111827]">{String(displayValue)}</p>{onViewDetails && <button type="button" onClick={onViewDetails} className="mt-2 text-[11px] font-semibold text-[#2563eb] hover:text-[#1d4ed8]">View Details</button>}</div>
}

function ManualSummaryCard({ label, value, canEdit, onOpen, onViewDetails }) {
  return (
    <div className="rounded-[14px] bg-[#f9fafb] p-4 text-left">
      <p className="text-[12px] font-semibold text-[#6b7280]">{label}</p>
      <p className="mt-1 text-[14px] font-bold text-[#111827]">{value}</p>
      <div className="mt-2 flex gap-3">{canEdit && <button type="button" onClick={onOpen} className="text-[11px] font-semibold text-[#2563eb]">Edit entries</button>}{onViewDetails && <button type="button" onClick={onViewDetails} className="text-[11px] font-semibold text-[#2563eb]">View Details</button>}</div>
    </div>
  )
}

function PayrollRecordsModal({ category, onClose }) {
  if (!category) return null
  const records = Array.isArray(category.records) ? category.records : []
  const formatMonth = (value) => {
    if (!value) return '—'
    const date = new Date(`${value}T00:00:00`)
    return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
  }
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="payroll-records-title"><div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[24px] bg-white p-6 shadow-xl"><div className="flex items-center justify-between gap-4"><h2 id="payroll-records-title" className="text-[22px] font-black text-[#111827]">{category.label}</h2><button type="button" onClick={onClose} aria-label="Close details" className="text-2xl text-[#6b7280]">×</button></div>{records.length === 0 ? <p className="mt-6 rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-4 text-sm font-semibold text-[#6b7280]">No records available.</p> : <div className="mt-6 space-y-3">{records.map((record) => <div key={record.id} className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-4 text-sm"><div className="grid gap-3 sm:grid-cols-2">{category.label === 'Other Earnings' && <><Record label="Earning Type" value={record.earning_type} /><Record label="Amount" value={record.amount} /><Record label="Reason" value={record.reason} /><Record label="Record ID" value={record.id} /></>}{category.label === 'Other Deductions' && <><Record label="Deduction Type" value={record.deduction_type} /><Record label="Amount" value={record.amount} /><Record label="Reason" value={record.reason} /><Record label="Record ID" value={record.id} /></>}{category.label === 'Adjustment' && <><Record label="Reference Month" value={formatMonth(record.reference_month)} /><Record label="Direction" value={record.direction} /><Record label="Amount" value={record.amount} /><Record label="Reason" value={record.reason} /><Record label="Supporting Reference" value={record.supporting_reference} /><Record label="Record ID" value={record.id} /></>}</div></div>)}</div>}<div className="mt-6 flex justify-end"><Button type="button" onClick={onClose} className="rounded-full border px-5 py-2.5 text-sm font-bold">Close</Button></div></div></div>
}

function Record({ label, value }) {
  return <div><p className="text-[11px] font-semibold uppercase tracking-wider text-[#6b7280]">{label}</p><p className="mt-1 font-bold text-[#111827]">{value || '—'}</p></div>
}

function CeoCorrectionDetailsModal({ isOpen, payroll, request, onClose }) {
  if (!isOpen) return null
  const safeIssues = Array.isArray(request?.issues) ? request.issues : []
  const fieldLabels = { previous_month_adjustment: 'Adjustment', other_earnings: 'Other Earnings', other_deductions: 'Other Deductions' }
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="ceo-correction-details-title"><div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[24px] bg-white p-6 shadow-xl"><div className="flex items-center justify-between gap-4"><h2 id="ceo-correction-details-title" className="text-[22px] font-black text-[#111827]">CEO Correction Request</h2><button type="button" onClick={onClose} aria-label="Close CEO correction request" className="text-2xl text-[#6b7280]">×</button></div><div className="mt-5 grid gap-3 rounded-xl bg-[#f9fafb] p-4 sm:grid-cols-2"><Record label="Employee" value={payroll?.employee_name || payroll?.employee} /><Record label="Salary Month" value={payroll?.salary_month} /></div><section className="mt-6 space-y-3"><h3 className="text-[15px] font-bold text-[#111827]">Requested Corrections</h3>{safeIssues.length === 0 ? <p className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-4 text-sm font-semibold text-[#6b7280]">No correction issues were provided.</p> : safeIssues.map((issue, index) => <div key={issue.id || `${issue.field_name || 'issue'}-${index}`} className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-4"><div className="grid gap-3 sm:grid-cols-2"><Record label="Field" value={fieldLabels[issue.field_name] || issue.field_name} /><Record label="Current Value" value={issue.current_value} /><Record label="Expected Value" value={issue.expected_value} /><Record label="CEO Reason" value={issue.reason} /></div></div>)}</section><div className="mt-6 flex justify-end"><Button type="button" onClick={onClose} className="rounded-full border px-5 py-2.5 text-sm font-bold">Close</Button></div></div></div>
}

export default PayrollDetail
