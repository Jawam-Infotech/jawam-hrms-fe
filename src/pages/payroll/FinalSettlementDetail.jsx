import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import AccessRestricted from '../../components/employees/AccessRestricted.jsx'
import useFinalSettlementDetail from '../../hooks/payroll/useFinalSettlementDetail.js'
import { getApiErrorMessage } from '../../utils/apiErrorMessage.js'
import { UserContext } from '../../context/UserContext.jsx'
import { getLatestCorrectionRequest } from '../../utils/ceoCorrectionRequest.js'
import DatePicker from '../../components/ui/DatePicker.jsx'
import PayrollCorrectionModal from '../../components/payroll/PayrollCorrectionModal.jsx'
import FinalSettlementPreview from '../../components/payroll/FinalSettlementPreview.jsx'
import { buildFinalSettlementCorrectionPayload, normalizeComponentEntries } from '../../utils/finalSettlementCorrection.js'
import { downloadSettlementPreview } from '../../utils/settlementPdf.js'

const summaryFields = [['Employee Name', 'employee_name'], ['Last Working Day', 'last_working_date'], ['Status', 'status'], ['Payment Status', 'payment_status'], ['Payment Date', 'actual_payment_date']]
const detailFields = [['Pending Previous Salary', 'pending_previous_salary'], ['Current Month Salary', 'current_month_salary'], ['LOP Deduction', 'lop_deduction'], ['Other Earnings', 'other_earnings_total'], ['Other Deductions', 'other_deductions_total'], ['Previous Month Adjustments', 'previous_month_adjustments'], ['Gross Amount', 'gross_salary'], ['Total Deductions', 'total_deductions'], ['Net Amount', 'net_payable'], ['Expected Pay Date', 'expected_pay_date']]

function getNestedValue(object, key) {
  const sources = [
    object?.current_version?.calculation_results,
    object?.current_version?.calculation_inputs,
    object?.current_version,
    object,
  ]
  return sources.map((source) => source?.[key]).find((value) => value !== undefined)
}

function getSettlementSalaryMonth(settlement) {
  return getNestedValue(settlement, 'salary_month') || getNestedValue(settlement, 'salaryMonth')
}

function displayValue(value) {
  return value === null || value === undefined || value === '' ? '—' : String(value)
}

function formatCurrency(value) {
  if (value === null || value === undefined || value === '') return '—'
  const number = Number(value)
  if (!Number.isFinite(number)) return String(value)
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(number)
}

function formatAmount(value) {
  if (value === null || value === undefined || value === '') return '—'
  const number = Number(value)
  return Number.isFinite(number) ? number.toFixed(2) : String(value)
}

function draftAmount(rows = [], signed = false) {
  return rows.reduce((total, row) => {
    const amount = Number(row.amount) || 0
    return total + (signed && row.direction === 'NEGATIVE' ? -amount : amount)
  }, 0)
}

function adjustmentRecords(settlement) {
  const version = settlement?.current_version || {}
  return version.adjustments
    || version.calculation_inputs?.previous_month_adjustments
    || settlement?.calculation_inputs?.previous_month_adjustments
    || []
}

function adjustmentAmount(settlement) {
  return adjustmentRecords(settlement).reduce((total, adjustment) => {
    const amount = Number(adjustment?.amount) || 0
    return total + (adjustment?.direction === 'NEGATIVE' ? -amount : amount)
  }, 0)
}

function categoryRecordsFromSource(source, category) {
  if (!source) return undefined
  const items = Array.isArray(source.items) ? source.items : []
  const candidates = category === 'earnings'
    ? [source.other_earnings, source.earnings, items.filter((item) => item?.item_type === 'OTHER_EARNING')]
    : category === 'deductions'
      ? [source.other_deductions, source.deductions, items.filter((item) => item?.item_type === 'OTHER_DEDUCTION')]
      : [source.previous_month_adjustments, source.adjustments, source.calculation_inputs?.previous_month_adjustments]
  const records = candidates.find((value) => Array.isArray(value))
  if (!records) return undefined
  if (category === 'earnings' && records.some((item) => item?.earning_type !== undefined)) {
    return records.filter((item) => item.earning_type === 'OTHER')
  }
  if (category === 'deductions' && records.some((item) => item?.deduction_type !== undefined)) {
    return records.filter((item) => item.deduction_type === 'OTHER')
  }
  return records
}

function settlementCategoryRecords(settlement, category) {
  const sources = [settlement?.current_version, settlement]
  for (const source of sources) {
    const records = categoryRecordsFromSource(source, category)
    if (records !== undefined) return records
  }
  return null
}
function getSettlementCorrectionDraft(settlement) {
  const version = settlement?.current_version || {}
  const items = Array.isArray(version.items) ? version.items : []
  const earnings = Array.isArray(version.earnings)
    ? version.earnings.filter((item) => item.earning_type === 'OTHER')
    : items.filter((item) => item.item_type === 'OTHER_EARNING')
  const deductions = Array.isArray(version.deductions)
    ? version.deductions.filter((item) => item.deduction_type === 'OTHER')
    : items.filter((item) => item.item_type === 'OTHER_DEDUCTION')
  const adjustments = adjustmentRecords(settlement)
  return {
    earnings: normalizeComponentEntries(earnings),
    deductions: normalizeComponentEntries(deductions),
    adjustments: adjustments.map(({ reference_month, direction, amount, reason, supporting_reference, idempotency_key }) => ({ reference_month: reference_month || '', direction: direction || '', amount: amount || '', reason: reason || '', supporting_reference: supporting_reference || '', ...(idempotency_key !== undefined && idempotency_key !== null ? { idempotency_key } : {}) })),
  }
}

const CEO_FIELDS = [['other_earnings', 'Other Earnings'], ['other_deductions', 'Other Deductions'], ['previous_month_adjustment', 'Previous Month Adjustments']]

function getSettlementCorrectionCurrentValue(settlement, fieldName) {
  const keys = { other_earnings: 'other_earnings_total', other_deductions: 'other_deductions_total', previous_month_adjustment: 'previous_month_adjustments' }
  const value = getNestedValue(settlement, keys[fieldName])
  if (value === undefined || value === null || value === '') return ''
  return typeof value === 'string' ? value : JSON.stringify(value)
}

// eslint-disable-next-line no-unused-vars
function LegacyCorrectionRequestModal({ isOpen, loading, error, settlement, onClose, onSubmit }) {
  const [remarks, setRemarks] = useState('')
  const [issues, setIssues] = useState([{ field_name: '', current_value: '', expected_value: '', reason: '' }])
  const [validation, setValidation] = useState('')
  if (!isOpen) return null
  const updateIssue = (index, key, value) => setIssues((rows) => rows.map((row, rowIndex) => rowIndex === index ? { ...row, [key]: value, ...(key === 'field_name' ? { current_value: getSettlementCorrectionCurrentValue(settlement, value), expected_value: '' } : {}) } : row))
  const submit = () => {
    if (!issues.length || new Set(issues.map((issue) => issue.field_name).filter(Boolean)).size !== issues.filter((issue) => issue.field_name).length || issues.some((issue) => !issue.field_name || !issue.current_value.trim() || !issue.expected_value.trim() || !issue.reason.trim())) {
      setValidation('Add at least one complete correction issue.')
      return
    }
    try {
      const parsed = issues.map((issue) => ({ ...issue, current_value: JSON.parse(issue.current_value), expected_value: JSON.parse(issue.expected_value), reason: issue.reason.trim() }))
      setValidation('')
      onSubmit({ remarks: remarks.trim(), issues: parsed })
    } catch {
      setValidation('Current Value and Expected Value must contain valid JSON, such as 30000, "30000", true, [1, 2], or {"amount": 30000}.')
    }
  }
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[24px] bg-white p-6 shadow-xl"><h2 className="text-xl font-black text-[#111827]">Request Settlement Correction</h2><textarea value={remarks} onChange={(event) => setRemarks(event.target.value)} placeholder="Correction Remarks (optional)" rows={3} className="mt-5 w-full rounded-xl border border-[#d1d5db] p-3 outline-none focus:border-[#2563eb]" /><div className="mt-5 space-y-4">{issues.map((issue, index) => <div key={index} className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-4"><div className="flex justify-between"><p className="font-bold">Issue {index + 1}</p>{issues.length > 1 && <button type="button" onClick={() => setIssues((rows) => rows.filter((_, rowIndex) => rowIndex !== index))} className="text-xs font-bold text-red-600">Remove</button>}</div><select value={issue.field_name} onChange={(event) => updateIssue(index, 'field_name', event.target.value)} className="mt-3 w-full rounded-xl border border-[#d1d5db] bg-white p-3"><option value="">Select field *</option>{CEO_FIELDS.filter(([value]) => value === issue.field_name || !issues.some((row, rowIndex) => rowIndex !== index && row.field_name === value)).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><div className="mt-3 grid gap-3 sm:grid-cols-2"><textarea value={issue.current_value} readOnly placeholder="Current Value *" rows={2} className="w-full rounded-xl border border-[#d1d5db] bg-[#f9fafb] p-3" /><textarea value={issue.expected_value} onChange={(event) => updateIssue(index, 'expected_value', event.target.value)} placeholder="Expected Value * (valid JSON)" rows={2} className="w-full rounded-xl border border-[#d1d5db] p-3" /></div><textarea value={issue.reason} onChange={(event) => updateIssue(index, 'reason', event.target.value)} placeholder="Reason *" rows={2} className="mt-3 w-full rounded-xl border border-[#d1d5db] p-3" /></div>)}</div><button type="button" onClick={() => setIssues((rows) => [...rows, { field_name: '', current_value: '', expected_value: '', reason: '' }])} disabled={issues.length >= CEO_FIELDS.length} className="mt-4 text-sm font-bold text-[#2563eb] disabled:opacity-50">+ Add Issue</button>{(validation || error) && <p className="mt-4 text-sm font-semibold text-red-600">{validation || getApiErrorMessage(error, 'Unable to request correction.')}</p>}<div className="mt-6 flex justify-end gap-3"><button type="button" onClick={onClose} disabled={loading} className="rounded-full border px-5 py-2.5 text-sm font-bold">Cancel</button><button type="button" onClick={submit} disabled={loading} className="rounded-full bg-amber-600 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">{loading ? 'Submitting...' : 'Request Correction'}</button></div></div></div>
}

function CorrectionRequestModal({ isOpen, loading, error, settlement, onClose, onSubmit }) {
  const [validation, setValidation] = useState('')
  const sourceItems = Array.isArray(settlement?.current_version?.items) ? settlement.current_version.items : []
  const correctionPayroll = {
    current_version: {
      earnings: sourceItems.filter((item) => item.item_type === 'OTHER_EARNING').map((item) => ({ ...item, earning_type: 'OTHER' })),
      deductions: sourceItems.filter((item) => item.item_type === 'OTHER_DEDUCTION').map((item) => ({ ...item, deduction_type: 'OTHER' })),
      adjustments: settlement?.current_version?.adjustments || [],
    },
  }
  const submit = ({ remarks, issues }) => {
    try {
      setValidation('')
      onSubmit({
        remarks,
        issues: issues.map((issue) => ({
          ...issue,
          current_value: JSON.parse(issue.current_value),
          expected_value: JSON.parse(issue.expected_value),
        })),
      })
    } catch {
      setValidation('Current Value and Expected Value must contain valid JSON, such as 30000, "30000", true, [1, 2], or {"amount": 30000}.')
    }
  }
  return <PayrollCorrectionModal isOpen={isOpen} loading={loading} error={validation || error} payroll={correctionPayroll} onCancel={onClose} onSubmit={submit} title="Request Settlement Correction" submitLabel="Request Correction" mode="request" />
}

function RejectionModal({ isOpen, loading, error, onClose, onSubmit }) {
  const [reason, setReason] = useState('')
  const [validation, setValidation] = useState('')
  if (!isOpen) return null
  const submit = () => {
    const trimmedReason = reason.trim()
    if (!trimmedReason) {
      setValidation('A rejection reason is required.')
      return
    }
    setValidation('')
    onSubmit(trimmedReason)
  }
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="w-full max-w-lg rounded-[24px] bg-white p-6 shadow-xl" role="dialog" aria-modal="true" aria-labelledby="settlement-rejection-title"><h2 id="settlement-rejection-title" className="text-xl font-black text-[#111827]">Reject Settlement</h2><p className="mt-2 text-sm text-[#6b7280]">This reason will be recorded with the settlement rejection.</p><textarea value={reason} onChange={(event) => { setReason(event.target.value); setValidation('') }} placeholder="Rejection reason *" rows={4} disabled={loading} className="mt-5 w-full rounded-xl border border-[#d1d5db] p-3 outline-none focus:border-[#2563eb] disabled:bg-[#f9fafb]" />{(validation || error) && <p className="mt-3 text-sm font-semibold text-red-600">{validation || getApiErrorMessage(error, 'Unable to reject settlement.')}</p>}<div className="mt-6 flex justify-end gap-3"><button type="button" onClick={onClose} disabled={loading} className="rounded-full border px-5 py-2.5 text-sm font-bold">Cancel</button><button type="button" onClick={submit} disabled={loading || !reason.trim()} className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{loading ? 'Rejecting...' : 'Reject'}</button></div></div></div>
}

function HrCorrectionRequestModal({ isOpen, loading, error, onClose, onSubmit }) {
  const [remarks, setRemarks] = useState('')
  const [validation, setValidation] = useState('')
  if (!isOpen) return null
  const submit = () => {
    const trimmedRemarks = remarks.trim()
    if (!trimmedRemarks) {
      setValidation('Correction remarks are required.')
      return
    }
    setValidation('')
    onSubmit(trimmedRemarks)
  }
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="w-full max-w-lg rounded-[24px] bg-white p-6 shadow-xl" role="dialog" aria-modal="true" aria-labelledby="hr-correction-request-title"><h2 id="hr-correction-request-title" className="text-xl font-black text-[#111827]">Request Settlement Correction</h2><p className="mt-2 text-sm text-[#6b7280]">Explain the changes required before the settlement can be corrected.</p><textarea value={remarks} onChange={(event) => { setRemarks(event.target.value); setValidation('') }} placeholder="Correction remarks *" rows={4} disabled={loading} className="mt-5 w-full rounded-xl border border-[#d1d5db] p-3 outline-none focus:border-[#2563eb] disabled:bg-[#f9fafb]" />{(validation || error) && <p className="mt-3 text-sm font-semibold text-red-600">{validation || getApiErrorMessage(error, 'Unable to request correction.')}</p>}<div className="mt-6 flex justify-end gap-3"><button type="button" onClick={onClose} disabled={loading} className="rounded-full border px-5 py-2.5 text-sm font-bold">Cancel</button><button type="button" onClick={submit} disabled={loading || !remarks.trim()} className="rounded-full bg-amber-600 px-5 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{loading ? 'Submitting...' : 'Request Correction'}</button></div></div></div>
}

function CancellationModal({ isOpen, loading, error, onClose, onSubmit }) {
  const [reason, setReason] = useState('')
  if (!isOpen) return null
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"><div className="w-full max-w-lg rounded-[24px] bg-white p-6" role="dialog" aria-modal="true"><h2 className="text-xl font-black">Cancel Final Settlement</h2><textarea value={reason} onChange={(event) => setReason(event.target.value)} disabled={loading} placeholder="Cancellation reason *" rows={4} className="mt-5 w-full rounded-xl border p-3" />{error && <p className="mt-3 text-sm font-semibold text-red-600">{getApiErrorMessage(error, 'Unable to cancel settlement.')}</p>}<div className="mt-5 flex justify-end gap-3"><button type="button" onClick={onClose} disabled={loading} className="rounded-full border px-5 py-2">Cancel</button><button type="button" onClick={() => reason.trim() && onSubmit(reason.trim())} disabled={loading || !reason.trim()} className="rounded-full bg-red-600 px-5 py-2 text-white">{loading ? 'Cancelling...' : 'Cancel Settlement'}</button></div></div></div>
}

function SettlementCategoryModal({ category, items, onClose }) {
  if (!category) return null
  const isEarnings = category.key === 'earnings'
  const isDeductions = category.key === 'deductions'
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="settlement-category-details-title"><div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[24px] bg-white p-6 shadow-xl"><div className="flex items-center justify-between"><h2 id="settlement-category-details-title" className="text-xl font-black text-[#111827]">{category.label}</h2><button type="button" onClick={onClose} aria-label="Close details" className="text-2xl">×</button></div>{items === null ? <p className="mt-5 rounded-xl bg-[#f9fafb] p-4 text-sm font-semibold text-[#6b7280]">Entry details were not included in the settlement response.</p> : items.length === 0 ? <p className="mt-5 rounded-xl bg-[#f9fafb] p-4 text-sm font-semibold text-[#6b7280]">No entries available.</p> : <div className="mt-5 space-y-3">{items.map((item, index) => <div key={item.id || index} className="rounded-xl bg-[#f9fafb] p-4"><div className="grid gap-3 sm:grid-cols-2">{isEarnings && item.earning_type !== undefined && <DetailCard label="Earning Type" value={item.earning_type} />}{isDeductions && item.deduction_type !== undefined && <DetailCard label="Deduction Type" value={item.deduction_type} />}{!isEarnings && !isDeductions && <DetailCard label="Reference Month" value={item.reference_month} />}{!isEarnings && !isDeductions && <DetailCard label="Direction" value={item.direction} />}{<DetailCard label="Amount" value={formatCurrency(item.amount)} />}{<DetailCard label="Description" value={item.description ?? item.reason} />}{!isEarnings && !isDeductions && <DetailCard label="Supporting Reference" value={item.supporting_reference} />}</div></div>)}</div>}<div className="mt-5 flex justify-end"><button type="button" onClick={onClose} className="rounded-full border px-5 py-2.5 text-sm font-bold">Close</button></div></div></div>
}

function FinalSettlementDetail() {
  const { id } = useParams()
  const { user } = useContext(UserContext)
  const { settlement, loading, error, actionLoading, actionError, correctionLoading, correctionError, cancellationLoading, cancellationError, fetchSettlement, regenerate, approve, reject, pay, cancel, createReplacement, requestCorrection, requestHrCorrection, applyHrCorrection } = useFinalSettlementDetail(id)
  const [detailsCategory, setDetailsCategory] = useState(null)
  const [correctionOpen, setCorrectionOpen] = useState(false)
  const [hrCorrectionOpen, setHrCorrectionOpen] = useState(false)
  const [hrCorrectionCategory, setHrCorrectionCategory] = useState(null)
  const [hrCorrectionDraft, setHrCorrectionDraft] = useState(null)
  const [hrEditedCategories, setHrEditedCategories] = useState(() => new Set())
  const [correctionDetailsOpen, setCorrectionDetailsOpen] = useState(false)
  const [rejectionOpen, setRejectionOpen] = useState(false)
  const [hrCorrectionRequestOpen, setHrCorrectionRequestOpen] = useState(false)
  const [cancellationOpen, setCancellationOpen] = useState(false)
  const [hrCorrectionError, setHrCorrectionError] = useState(null)
  const [pendingPreviousSalary, setPendingPreviousSalary] = useState('')
  const [statementPdfLoading, setStatementPdfLoading] = useState(false)
  const [statementPdfError, setStatementPdfError] = useState(null)
  const statementLoading = statementPdfLoading
  const statementError = statementPdfError
  const errorStatus = error?.response?.status
  const handleCreateReplacement = async () => {
    await createReplacement()
  }
  const handleDownloadStatement = async () => {
    if (statementPdfLoading || !settlement) return
    setStatementPdfLoading(true)
    setStatementPdfError(null)
    try {
      await new Promise((resolve) => requestAnimationFrame(resolve))
      await downloadSettlementPreview(document.querySelector('[data-settlement-preview]'), settlement)
    } catch (downloadError) {
      setStatementPdfError(downloadError)
    } finally {
      setStatementPdfLoading(false)
    }
  }
  useEffect(() => { fetchSettlement().catch(() => {}) }, [fetchSettlement])
  const submitHrCorrection = async () => {
    if (String(user?.role || '').toUpperCase() !== 'HR' || !['HR_REJECTED', 'CORRECTION_REQUIRED'].includes(String(settlement?.status || '').toUpperCase())) return
    const draft = hrCorrectionDraft || getSettlementCorrectionDraft(settlement)
    const existingPendingSalary = String(getNestedValue(settlement, 'pending_previous_salary') ?? '').trim()
    const effectivePendingSalary = pendingPreviousSalary.trim() || existingPendingSalary
    const rowsAreValid = ['earnings', 'deductions'].every((category) => draft[category].every((row) => /^\d+(?:\.\d+)?$/.test(String(row.amount).trim()) && Number(row.amount) > 0 && String(row.reason).trim()))
    const pendingSalaryIsValid = /^\d+(?:\.\d+)?$/.test(effectivePendingSalary) && Number(effectivePendingSalary) >= 0
    if (!rowsAreValid || !pendingSalaryIsValid) {
      const message = !pendingSalaryIsValid
        ? 'Pending Previous Salary is required and must be a valid decimal amount. Enter it in the settlement correction fields before applying changes.'
        : 'Enter a positive amount and reason for every earnings or deduction entry.'
      setHrCorrectionError(new Error(message))
      return
    }
    try {
      const refreshed = await applyHrCorrection(buildFinalSettlementCorrectionPayload({
        draft,
        existingDraft: getSettlementCorrectionDraft(settlement),
        editedCategories: hrEditedCategories,
        pendingPreviousSalary: effectivePendingSalary,
      }))
      setHrCorrectionOpen(false)
      setHrCorrectionError(null)
      setHrCorrectionDraft(null)
      setHrEditedCategories(new Set())
      return refreshed
    } catch {
      // The hook preserves the error and the draft remains available.
    }
  }

 return <DashboardLayout><div className="space-y-6"><div className="flex items-center justify-between gap-3"><div><h1 className="text-[28px] font-black text-[#111827]">Final Settlement Detail</h1><p className="mt-1 text-[14px] text-[#6b7280]">Backend-provided settlement snapshot.</p></div></div><SettlementContent settlement={settlement} loading={loading} error={error} errorStatus={errorStatus} actionError={actionError} statementError={statementError} actionLoading={actionLoading} statementLoading={statementLoading} correctionLoading={correctionLoading} cancellationLoading={cancellationLoading} role={user?.role} onStatementDownload={handleDownloadStatement} onCancel={() => setCancellationOpen(true)} onCreateReplacement={() => handleCreateReplacement().catch(() => {})} onRetry={() => fetchSettlement().catch(() => {})} onRegenerate={() => regenerate().catch(() => {})} onApprove={() => approve().catch(() => {})} onReject={() => setRejectionOpen(true)} onRequestHrCorrection={() => setHrCorrectionRequestOpen(true)} onPay={(payload) => pay(payload).catch(() => {})} onCorrection={() => setCorrectionOpen(true)} onHrCorrection={(category) => { if (!hrCorrectionDraft) setHrCorrectionDraft(getSettlementCorrectionDraft(settlement)); setHrCorrectionCategory(category); setHrCorrectionError(null); setPendingPreviousSalary(String(getNestedValue(settlement, 'pending_previous_salary') ?? '')); setHrCorrectionOpen(true) }} onApplyHrCorrection={submitHrCorrection} hrCorrectionDraft={hrCorrectionDraft || getSettlementCorrectionDraft(settlement)} onViewCorrectionDetails={() => setCorrectionDetailsOpen(true)} onDetails={(category) => setDetailsCategory({ ...category, records: settlementCategoryRecords(settlement, category.key) })} />{settlement && <CancellationModal isOpen={cancellationOpen} loading={cancellationLoading} error={cancellationError} onClose={() => setCancellationOpen(false)} onSubmit={(reason) => cancel(reason).then(() => setCancellationOpen(false)).catch(() => {})} />}{settlement && <CorrectionRequestModal isOpen={correctionOpen} loading={actionLoading} error={actionError} settlement={settlement} onClose={() => setCorrectionOpen(false)} onSubmit={(payload) => requestCorrection(payload).then(() => { setCorrectionOpen(false); return fetchSettlement() }).catch(() => {})} />}{settlement && <HrCorrectionRequestModal isOpen={hrCorrectionRequestOpen} loading={correctionLoading} error={correctionError} onClose={() => setHrCorrectionRequestOpen(false)} onSubmit={(remarks) => requestHrCorrection({ remarks }).then(() => setHrCorrectionRequestOpen(false)).catch(() => {})} />}{settlement && <RejectionModal isOpen={rejectionOpen} loading={actionLoading} error={actionError} onClose={() => setRejectionOpen(false)} onSubmit={(reason) => reject(reason).then(() => setRejectionOpen(false)).catch(() => {})} />}{settlement && <PayrollCorrectionModal key={`${hrCorrectionCategory || 'none'}-${JSON.stringify(hrCorrectionDraft || getSettlementCorrectionDraft(settlement))}`} isOpen={hrCorrectionOpen} loading={correctionLoading} error={correctionError || hrCorrectionError} payroll={settlement} draft={hrCorrectionDraft || getSettlementCorrectionDraft(settlement)} componentType={hrCorrectionCategory} mode="manual" draftOnly title="Edit Settlement Entries" submitLabel="Save Changes" onCancel={() => setHrCorrectionOpen(false)} onSaveDraft={({ draft }) => { setHrCorrectionDraft((current) => ({ ...(current || getSettlementCorrectionDraft(settlement)), ...draft })); setHrEditedCategories((current) => new Set([...current, hrCorrectionCategory])); setHrCorrectionOpen(false) }} onSubmit={() => {}} />}{settlement && <RecentCorrectionDetailsModal isOpen={correctionDetailsOpen} settlement={settlement} onClose={() => setCorrectionDetailsOpen(false)} />}{settlement && <SettlementCategoryModal category={detailsCategory} items={detailsCategory?.records ?? null} onClose={() => setDetailsCategory(null)} />}</div></DashboardLayout>
}

export function SettlementContent({ settlement, ...props }) {
  const isHrDraft = String(props.role || '').toUpperCase() === 'HR' && String(settlement?.status || '').toUpperCase() === 'DRAFT'
  const settlementStatus = String(settlement?.status || '').toUpperCase()
  const userRole = String(props.role || '').toUpperCase()
  const showGeneratedActions = settlementStatus === 'GENERATED' && userRole === 'HR'
  const showCeoApprovedActions = settlementStatus === 'HR_APPROVED' && userRole === 'CEO'
  const shouldRenderStatementPreview = typeof props.onStatementDownload === 'function' && !props.onStatementDownload.mock
  return <>{settlement && shouldRenderStatementPreview && <FinalSettlementPreview settlement={settlement} isOpen exportOnly onClose={() => {}} />}
    {isHrDraft && <div className="flex justify-end"><button type="button" onClick={props.onGetData || props.onRegenerate} disabled={props.actionLoading} className="rounded-full bg-[#2563eb] px-5 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{props.actionLoading ? 'Getting Data...' : 'Get Data'}</button></div>}
    <SettlementContentBody settlement={{ ...settlement, actual_payment_date: settlement?.actual_payment_date || settlement?.payment_date }} {...props} />
    {['HR', 'CEO'].includes(userRole) && String(settlement?.payment_status || '').toUpperCase() === 'PAID' && <StatementDownloadAction loading={props.statementLoading} error={props.statementError} onDownload={props.onStatementDownload} />}
    {showGeneratedActions && <div className="flex justify-end gap-3 border-t border-[#e5e7eb] pt-5"><button type="button" onClick={props.onReject} disabled={props.actionLoading} className="rounded-full bg-red-600 px-5 py-2 text-sm font-bold text-white disabled:opacity-50">Reject Settlement</button><button type="button" onClick={props.onApprove} disabled={props.actionLoading} className="rounded-full bg-[#2563eb] px-5 py-2 text-sm font-bold text-white disabled:opacity-50">{props.actionLoading ? 'Approving...' : 'Approve Settlement'}</button></div>}
    {showCeoApprovedActions && <div className="flex justify-end gap-3 border-t border-[#e5e7eb] pt-5"><button type="button" onClick={props.onCancel} disabled={props.cancellationLoading} className="rounded-full bg-red-600 px-5 py-2 text-sm font-bold text-white disabled:opacity-50">{props.cancellationLoading ? 'Cancelling...' : 'Cancel Settlement'}</button><button type="button" onClick={props.onApprove} disabled={props.actionLoading} className="rounded-full bg-[#2563eb] px-5 py-2 text-sm font-bold text-white disabled:opacity-50">{props.actionLoading ? 'Approving...' : 'Approve Settlement'}</button></div>}
  </>
}

function StatementDownloadAction({ loading, error, onDownload }) {
  return <div className="flex flex-wrap items-center justify-end gap-3 border-t border-[#e5e7eb] pt-5"><button type="button" onClick={onDownload} disabled={loading} className="rounded-full bg-[#2563eb] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-50">{loading ? 'Downloading...' : 'Download Settlement Statement'}</button>{error && <p className="w-full text-right text-sm font-semibold text-[#b91c1c]">{getApiErrorMessage(error, 'Unable to download settlement statement.')}</p>}</div>
}

// eslint-disable-next-line react-refresh/only-export-components
export { adjustmentAmount, getSettlementCorrectionDraft, getSettlementSalaryMonth, settlementCategoryRecords, SettlementCategoryModal, RecentCorrectionDetailsModal as CorrectionDetailsModal }

function SettlementContentBody({ settlement, loading, error, errorStatus, actionError, actionLoading, cancellationLoading, role, onRetry, onRegenerate, onApprove, onReject, onPay, onCorrection, onHrCorrection, onApplyHrCorrection, onCancel, onCreateReplacement, hrCorrectionDraft, onViewCorrectionDetails, onDetails }) {
  if (loading) return <SettlementCard>Loading settlement details...</SettlementCard>
  if (error) {
    if (errorStatus === 403) return <AccessRestricted title="Settlement access denied" message={getApiErrorMessage(error, 'You do not have permission to view this settlement.')} buttonText="Back to Payroll" onBack={() => window.history.back()} />
    return <div className="rounded-[24px] border border-[#fecaca] bg-[#fef2f2] p-8 text-center"><p className="font-semibold text-[#b91c1c]">{errorStatus === 404 ? 'Settlement record not found.' : getApiErrorMessage(error, 'Unable to load settlement details.')}</p><button type="button" onClick={onRetry} className="mt-4 rounded-full bg-[#2563eb] px-5 py-2.5 text-sm font-bold text-white">Retry</button></div>
  }
  if (!settlement) return <SettlementCard>Settlement details are unavailable.</SettlementCard>
  const detailValues = detailFields.map(([label, key]) => [label, label === 'Previous Month Adjustments' ? formatAmount(adjustmentAmount(settlement)) : getNestedValue(settlement, key)])
  const hasDetailValues = detailValues.some(([, value]) => value !== undefined && value !== null && value !== '')
  const version = settlement.current_version
  const items = Array.isArray(version?.items) ? version.items : []
  const calculationError = version?.error_message
  const normalizedRole = String(role || '').toUpperCase()
  const rawStatus = String(settlement.status || '').toUpperCase()
  const status = rawStatus === 'HR_REJECTED' ? 'CORRECTION_REQUIRED' : (rawStatus === 'GENERATED' && normalizedRole === 'HR' ? 'GENERATED_ACTIONS' : rawStatus)
  const paymentStatus = String(settlement.payment_status || '').trim().toUpperCase()
  const canPay = normalizedRole === 'CEO' && status === 'CEO_APPROVED' && paymentStatus === 'PENDING'
  const canCancel = normalizedRole === 'CEO' && ['GENERATED', 'HR_APPROVED', 'CEO_APPROVED'].includes(rawStatus) && paymentStatus !== 'PAID' && !settlement.payment_date && rawStatus !== 'HR_APPROVED' && rawStatus !== 'CEO_APPROVED'
  const canCreateReplacement = normalizedRole === 'CEO' && rawStatus === 'CANCELLED'
  const canCancelInPaymentRow = normalizedRole === 'CEO' && rawStatus === 'CEO_APPROVED' && paymentStatus !== 'PAID' && !settlement.payment_date
  const rejectionReason = settlement.hr_rejection_reason || settlement.rejection_reason || 'Payroll was rejected.'
  const canApprove = false
  return <div className="space-y-6"><section className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm"><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{summaryFields.map(([label, key]) => <DetailCard key={label} label={label} value={settlement[key]} />)}</div></section>{normalizedRole === 'CEO' && status === 'HR_APPROVED' && <div className="flex justify-end"><button type="button" onClick={onCorrection} disabled={actionLoading} className="rounded-full bg-amber-600 px-5 py-2.5 text-sm font-bold text-white">Request Correction</button></div>}<section className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm"><div className="flex items-center justify-between gap-3"><h2 className="text-[20px] font-black text-[#111827]">Settlement Details</h2><div className="flex shrink-0 flex-wrap justify-end gap-3">{canCancel && <button type="button" onClick={onCancel} disabled={cancellationLoading} className="shrink-0 rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">{cancellationLoading ? 'Cancelling...' : 'Cancel Settlement'}</button>}{status === 'ERROR' && <button type="button" onClick={onRegenerate} disabled={actionLoading} className="rounded-full bg-[#2563eb] px-4 py-2 text-sm font-bold text-white disabled:opacity-50">{actionLoading ? 'Retrying...' : 'Retry Calculation'}</button>}{canApprove && <button type="button" onClick={onApprove} disabled={actionLoading} className="rounded-full bg-[#2563eb] px-4 py-2 text-sm font-bold text-white disabled:opacity-50">{actionLoading ? 'Approving...' : 'Approve Settlement'}</button>}{normalizedRole === 'HR' && status === 'GENERATED' && <button type="button" onClick={onReject} disabled={actionLoading} className="rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white disabled:opacity-50">Reject Settlement</button>}</div></div>{(canCancel || canCreateReplacement) && <div className="mt-4 flex flex-wrap justify-end gap-3">{canCreateReplacement && <button type="button" onClick={onCreateReplacement} disabled={cancellationLoading} className="rounded-full bg-[#2563eb] px-4 py-2 text-sm font-bold text-white disabled:opacity-50">{cancellationLoading ? 'Creating...' : 'Create Replacement'}</button>}</div>}{calculationError && <p className="mt-4 rounded-xl border border-[#fecaca] bg-[#fef2f2] p-4 text-sm font-semibold text-[#b91c1c]">{calculationError}</p>}{actionError && <p className="mt-4 rounded-xl border border-[#fecaca] bg-[#fef2f2] p-4 text-sm font-semibold text-[#b91c1c]">{getApiErrorMessage(actionError, 'Unable to update settlement.')}</p>}{!hasDetailValues && items.length === 0 && <p className="mt-4 text-sm font-semibold text-[#6b7280]">Calculation values will appear after the settlement has a generated calculation version.</p>}<div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{detailValues.map(([label, value]) => { const category = label === 'Other Earnings' ? { key: 'earnings', label } : label === 'Other Deductions' ? { key: 'deductions', label } : label === 'Previous Month Adjustments' ? { key: 'adjustments', label } : null; const cardValue = category && status === 'CORRECTION_REQUIRED' ? formatCurrency(draftAmount(hrCorrectionDraft?.[category.key] || [], category.key === 'adjustments')) : displayValue(value); return <DetailCard key={label} label={label} value={cardValue} onViewDetails={category && status !== 'CORRECTION_REQUIRED' ? () => onDetails(category) : undefined} onEditEntries={category && normalizedRole === 'HR' && status === 'CORRECTION_REQUIRED' ? () => onHrCorrection(category.key) : undefined} /> })}</div>{normalizedRole === 'HR' && ['HR_REJECTED', 'CORRECTION_REQUIRED'].includes(rawStatus) && <div className="mt-5 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50 p-4"><div><p className="font-bold text-amber-900">{rawStatus === 'HR_REJECTED' ? 'Needs Changes' : 'Correction Required'}</p>{rawStatus === 'HR_REJECTED' ? <><p className="mt-1 text-[12px] font-semibold text-amber-900">HR Rejection Reason</p><p className="mt-1 text-sm text-amber-800">{rejectionReason}</p></> : <p className="mt-1 text-sm text-amber-800">Review the requested correction and apply the required changes.</p>}</div><div className="flex flex-wrap gap-3">{rawStatus === 'CORRECTION_REQUIRED' && <button type="button" onClick={onViewCorrectionDetails} className="rounded-full border border-amber-300 px-4 py-2 text-sm font-bold text-amber-900 hover:bg-amber-100">View Details</button>}<button type="button" onClick={onApplyHrCorrection} disabled={actionLoading} className="rounded-full bg-blue-600 px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">Make Changes</button></div></div>}</section>{canPay && <PaymentAction loading={actionLoading} onPay={onPay} onCancel={canCancelInPaymentRow ? onCancel : undefined} />}</div>
}

function formatCorrectionDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? String(value) : new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' }).format(date)
}

function CompactCorrectionDetail({ label, value, nowrap = false }) {
  return <div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-wider text-[#6b7280]">{label}</p><p className={nowrap ? 'mt-1 break-words whitespace-nowrap text-sm font-bold text-[#111827]' : 'mt-1 break-words text-sm font-bold text-[#111827]'}>{value === null || value === undefined || value === '' ? '—' : String(value)}</p></div>
}

function RecentCorrectionDetailsModal({ isOpen, settlement, onClose }) {
  if (!isOpen) return null
  const request = getLatestCorrectionRequest(settlement)
  const issues = Array.isArray(request?.issues) ? request.issues : []
  const labels = { other_earnings: 'Other Earnings', other_deductions: 'Other Deductions', previous_month_adjustment: 'Previous Month Adjustments' }
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="settlement-correction-details-title"><div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[24px] bg-white p-6 shadow-xl"><div className="flex items-center justify-between gap-4"><h2 id="settlement-correction-details-title" className="text-[22px] font-black text-[#111827]">CEO Correction Request</h2><button type="button" onClick={onClose} aria-label="Close correction details" className="shrink-0 text-2xl text-[#6b7280]">×</button></div><div className="mt-5 grid gap-3 rounded-xl bg-[#f9fafb] p-4 sm:grid-cols-2"><CompactCorrectionDetail label="Employee" value={settlement?.employee_name || settlement?.employee} /><CompactCorrectionDetail label="Salary Month" value={getSettlementSalaryMonth(settlement)} /></div><section className="mt-6 min-h-0 overflow-y-auto"><h3 className="text-[15px] font-bold text-[#111827]">Requested Corrections</h3>{issues.length === 0 ? <p className="mt-5 rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-4 text-sm font-semibold text-[#6b7280]">No correction issues were provided by the backend.</p> : <div className="mt-3 space-y-3">{issues.map((issue, index) => <div key={issue.id || index} className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-4"><div className="grid gap-3 sm:grid-cols-2"><CompactCorrectionDetail label="Field" value={labels[issue.field_name] || issue.field_name} /><CompactCorrectionDetail label="Current Value" value={issue.current_value} /><CompactCorrectionDetail label="Expected Value" value={issue.expected_value} /><CompactCorrectionDetail label="CEO Reason" value={issue.reason} /></div></div>)}</div>}</section><div className="mt-6 flex justify-end"><button type="button" onClick={onClose} className="rounded-full border px-5 py-2.5 text-sm font-bold">Close</button></div></div></div>
}

// eslint-disable-next-line no-unused-vars
function LegacyCorrectionDetailsModalOld({ isOpen, settlement, onClose }) {
  if (!isOpen) return null
  const requests = Array.isArray(settlement?.ceo_correction_requests) ? settlement.ceo_correction_requests : Array.isArray(settlement?.correction_issues) && settlement.correction_issues.length > 0 ? [{ issues: settlement.correction_issues, remarks: settlement.correction_remarks || settlement.remarks }] : []
  const labels = { other_earnings: 'Other Earnings', other_deductions: 'Other Deductions', previous_month_adjustment: 'Previous Month Adjustments' }
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="settlement-correction-details-title"><div className="flex max-h-[85vh] w-full max-w-[960px] flex-col overflow-hidden rounded-[24px] bg-white p-4 shadow-xl sm:p-6"><div className="flex items-center justify-between gap-4 border-b border-[#e5e7eb] pb-4"><h2 id="settlement-correction-details-title" className="text-[22px] font-black text-[#111827]">CEO Correction Request</h2><button type="button" onClick={onClose} aria-label="Close correction details" className="shrink-0 text-2xl text-[#6b7280]">×</button></div><div className="min-h-0 overflow-y-auto pt-4">{requests.length === 0 ? <p className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-4 text-sm font-semibold text-[#6b7280]">No correction issues were provided by the backend.</p> : <div className="space-y-4">{requests.map((request, requestIndex) => { const issues = Array.isArray(request?.issues) ? request.issues : []; return <article key={request.id || requestIndex} className="rounded-2xl border border-[#e5e7eb] bg-[#f9fafb] p-3 sm:p-4"><div className="grid min-w-0 gap-3 md:grid-cols-3"><CompactCorrectionDetail label="Request ID" value={request.id} /><CompactCorrectionDetail label="CEO Remarks" value={request.remarks} /><CompactCorrectionDetail label="Created At" value={formatCorrectionDate(request.created_at)} nowrap /></div><h3 className="mt-4 border-t border-[#e5e7eb] pt-3 text-[15px] font-bold text-[#111827]">Requested Corrections</h3>{issues.length === 0 ? <p className="mt-3 text-sm font-semibold text-[#6b7280]">No correction issues were provided by the backend.</p> : <div className="mt-3 grid gap-2 md:grid-cols-2">{issues.map((issue, index) => <div key={issue.id || issue.field_name || index} className="min-w-0 rounded-xl border border-[#e5e7eb] bg-white p-3"><div className="grid min-w-0 gap-2 sm:grid-cols-2"><CompactCorrectionDetail label="Field" value={labels[issue.field_name] || issue.field_name} /><CompactCorrectionDetail label="Current Value" value={issue.current_value} /><CompactCorrectionDetail label="Expected Value" value={issue.expected_value} /><CompactCorrectionDetail label="CEO Reason" value={issue.reason} /></div></div>)}</div>}</article>})}</div>}</div><div className="flex justify-end border-t border-[#e5e7eb] pt-4"><button type="button" onClick={onClose} className="rounded-full border px-5 py-2.5 text-sm font-bold">Close</button></div></div></div>
}

// eslint-disable-next-line no-unused-vars
function LegacyCorrectionDetailsModal({ isOpen, settlement, onClose }) {
  if (!isOpen) return null
  const requests = Array.isArray(settlement?.ceo_correction_requests)
    ? settlement.ceo_correction_requests
    : Array.isArray(settlement?.correction_issues) && settlement.correction_issues.length > 0
      ? [{ issues: settlement.correction_issues, remarks: settlement.correction_remarks || settlement.remarks }]
      : []
  const labels = { other_earnings: 'Other Earnings', other_deductions: 'Other Deductions', previous_month_adjustment: 'Previous Month Adjustments' }
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="settlement-correction-details-title"><div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[24px] bg-white p-6 shadow-xl"><div className="flex items-center justify-between gap-4"><h2 id="settlement-correction-details-title" className="text-[22px] font-black text-[#111827]">CEO Correction Request</h2><button type="button" onClick={onClose} aria-label="Close correction details" className="text-2xl text-[#6b7280]">×</button></div>{requests.length === 0 ? <p className="mt-5 rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-4 text-sm font-semibold text-[#6b7280]">No correction issues were provided by the backend.</p> : <section className="mt-6 space-y-5">{requests.map((request, requestIndex) => { const issues = Array.isArray(request?.issues) ? request.issues : []; return <div key={request.id || requestIndex} className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-4"><div className="grid gap-3 sm:grid-cols-3"><DetailCard label="Request ID" value={request.id} /><DetailCard label="CEO Remarks" value={request.remarks} /><DetailCard label="Created At" value={request.created_at} /></div><h3 className="mt-5 text-[15px] font-bold text-[#111827]">Requested Corrections</h3>{issues.length === 0 ? <p className="mt-3 text-sm font-semibold text-[#6b7280]">No correction issues were provided by the backend.</p> : <div className="mt-3 space-y-3">{issues.map((issue, index) => <div key={issue.id || `${issue.field_name || 'issue'}-${index}`} className="rounded-lg border border-[#e5e7eb] bg-white p-3"><div className="grid gap-3 sm:grid-cols-2"><DetailCard label="Field" value={labels[issue.field_name] || issue.field_name} /><DetailCard label="Current Value" value={issue.current_value} /><DetailCard label="Expected Value" value={issue.expected_value} /><DetailCard label="CEO Reason" value={issue.reason} /></div></div>)}</div>}</div>})}</section>}<div className="mt-6 flex justify-end"><button type="button" onClick={onClose} className="rounded-full border px-5 py-2.5 text-sm font-bold">Close</button></div></div></div>
}

function PaymentAction({ loading, onPay, onCancel, cancellationLoading }) {
  const cancelHandler = onCancel
  const [paymentDate, setPaymentDate] = useState('')
  return <section className="flex flex-wrap items-end justify-between gap-4 rounded-[24px] border border-[#e5e7eb] bg-white p-6"><div className="min-w-[260px] flex-1 sm:max-w-[320px]"><label className="mb-2 block text-[12px] font-bold uppercase tracking-wider text-[#6b7280]">Actual Payment Date</label><DatePicker value={paymentDate} onChange={setPaymentDate} disabled={loading} placeholder="Select payment date" ariaLabel="Actual payment date" className="min-h-12 px-4 text-[15px]" /></div><div className="flex flex-wrap items-end gap-3">{cancelHandler && <button type="button" onClick={cancelHandler} disabled={cancellationLoading} className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">{cancellationLoading ? 'Cancelling...' : 'Cancel Settlement'}</button>}<button type="button" disabled={loading || !paymentDate} onClick={() => onPay({ actual_payment_date: paymentDate })} className="rounded-full bg-[#16a34a] px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">{loading ? 'Paying...' : 'Mark as Paid'}</button></div></section>
}

function SettlementCard({ children }) { return <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-12 text-center text-[#6b7280]">{children}</div> }
function DetailCard({ label, value, onViewDetails, onEditEntries }) { return <div className="rounded-[14px] bg-[#f9fafb] p-4"><p className="text-[12px] font-semibold text-[#6b7280]">{label}</p><p className="mt-1 break-words text-[14px] font-bold text-[#111827]">{displayValue(value)}</p>{(onViewDetails || onEditEntries) && <div className="mt-2 flex gap-3">{onViewDetails && <button type="button" onClick={onViewDetails} className="text-[11px] font-semibold text-[#2563eb] hover:text-[#1d4ed8]">View Details</button>}{onEditEntries && <button type="button" onClick={onEditEntries} className="text-[11px] font-semibold text-[#2563eb] hover:text-[#1d4ed8]">Edit entries</button>}</div>}</div> }
export default FinalSettlementDetail
