import { useState } from 'react'
import { X } from 'lucide-react'
import Button from '../ui/Button.jsx'
import { getApiErrorMessage } from '../../utils/apiErrorMessage.js'
import DatePicker from '../ui/DatePicker.jsx'

const FIELDS = ['other_earnings', 'other_deductions', 'previous_month_adjustment']

const FIELD_LABELS = {
  other_earnings: 'Other Earnings', other_deductions: 'Other Deductions',
  previous_month_adjustment: 'Adjustment',
}

const blankIssue = () => ({ field_name: '', record_id: '', current_value: '', expected_value: '', reason: 'NA', updated_amount: '', updated_direction: '', updated_reference_month: '', updated_supporting_reference: '' })
const controlClass = 'w-full rounded-xl border border-[#e5e7eb] bg-white px-3.5 py-2.5 text-[14px] font-medium text-[#111827] outline-none transition focus:border-[#2563eb]'
const labelClass = 'block text-[12px] font-bold uppercase tracking-wider text-[#6b7280]'

function getIssueRecords(payroll, fieldName) {
  const version = payroll?.current_version || {}
  if (fieldName === 'other_earnings') {
    return (Array.isArray(version.earnings) ? version.earnings : []).filter((item) => item.earning_type === 'OTHER')
  }
  if (fieldName === 'other_deductions') {
    return (Array.isArray(version.deductions) ? version.deductions : []).filter((item) => item.deduction_type === 'OTHER')
  }
  if (fieldName === 'previous_month_adjustment') {
    return Array.isArray(version.adjustments) ? version.adjustments : []
  }
  return []
}

function getIssueCurrentValue(payroll, issue) {
  const records = getIssueRecords(payroll, issue.field_name)
  if (records.length === 0 && ['other_earnings', 'other_deductions'].includes(issue.field_name)) return '0.00'
  if (records.length === 1) return String(records[0].amount ?? '')
  const selected = records.find((record) => String(record.id) === String(issue.record_id))
  return selected ? String(selected.amount ?? '') : ''
}

function getSelectedIssueRecord(payroll, issue) {
  const records = getIssueRecords(payroll, issue.field_name)
  if (records.length === 1) return records[0]
  return records.find((record) => String(record.id) === String(issue.record_id))
}

function normalizeMonthDate(value) {
  const match = String(value || '').match(/^(\d{4})-(\d{2})/)
  return match ? match[1] + '-' + match[2] + '-01' : ''
}

function getAdjustmentDraft(record) {
  return {
    updated_amount: record?.amount ? String(record.amount) : '',
    updated_direction: record?.direction || '',
    updated_reference_month: normalizeMonthDate(record?.reference_month),
    updated_supporting_reference: record?.supporting_reference || '',
  }
}

function getIssueDefaults(payroll, fieldName, recordId) {
  const record = getSelectedIssueRecord(payroll, { field_name: fieldName, record_id: recordId })
  return {
    reason: record?.reason || 'NA',
    ...(fieldName === 'previous_month_adjustment' ? getAdjustmentDraft(record) : {}),
  }
}

function formatReferenceMonth(value) {
  if (!value) return '—'
  const date = new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
}

function PayrollCorrectionModal({ isOpen, loading, error, payroll, onCancel, onSubmit, onSaveDraft, draft, componentType, title = 'Request Correction', submitLabel = 'Request Correction', mode = 'request', requireRemarks = false, draftOnly = false }) {
  const [remarks, setRemarks] = useState('')
  const [issues, setIssues] = useState([blankIssue()])
  const [validation, setValidation] = useState('')

  if (mode === 'manual') {
    return <ManualComponentsModal isOpen={isOpen} loading={loading} error={error} draft={draft} componentType={componentType} onCancel={onCancel} onSubmit={onSubmit} onSaveDraft={onSaveDraft} title={title} submitLabel={submitLabel} requireRemarks={requireRemarks} draftOnly={draftOnly} />
  }

  if (!isOpen) return null

  const selectedFields = new Set(issues.map((issue) => issue.field_name).filter(Boolean))
  const updateIssue = (index, key, value) => setIssues((items) => items.map((item, itemIndex) => (
    itemIndex === index ? {
      ...item,
      [key]: value,
      ...(['field_name', 'record_id'].includes(key) ? {
        ...(key === 'field_name' ? { record_id: '' } : {}),
        ...getIssueDefaults(payroll, key === 'field_name' ? value : item.field_name, key === 'record_id' ? value : ''),
        ...((key === 'field_name' && value === 'previous_month_adjustment') || key === 'record_id'
          ? getAdjustmentDraft(getSelectedIssueRecord(payroll, {
            field_name: key === 'field_name' ? value : item.field_name,
            record_id: key === 'record_id' ? value : '',
          }))
          : {
            updated_amount: '',
            updated_direction: '',
            updated_reference_month: '',
            updated_supporting_reference: '',
          }),
      } : {}),
    } : item
  )))

  const submit = async (event) => {
    event.preventDefault()
    if (issues.length === 0 || new Set(issues.map((issue) => issue.field_name).filter(Boolean)).size !== issues.filter((issue) => issue.field_name).length || issues.some((issue) => (
      !issue.field_name || !getIssueCurrentValue(payroll, issue).trim() ||
      !String(issue.expected_value).trim() || !issue.reason.trim()
    ))) {
      setValidation('Select each payroll field once and complete every correction issue.')
      return
    }
    setValidation('')
    await onSubmit({ remarks: remarks.trim(), issues: issues.map((issue) => ({ field_name: issue.field_name, current_value: getIssueCurrentValue(payroll, issue), expected_value: issue.expected_value.trim(), reason: issue.reason.trim() })) })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="payroll-correction-title">
      <form onSubmit={submit} className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[24px] bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 py-5">
          <h2 id="payroll-correction-title" className="text-[22px] font-black text-[#111827]">{title}</h2>
          <button type="button" onClick={onCancel} disabled={loading} aria-label="Close correction dialog" className="rounded-full p-1 text-[#6b7280] transition hover:bg-[#f3f4f6] disabled:cursor-not-allowed disabled:opacity-50"><X size={22} /></button>
        </div>

        <div className="min-h-0 space-y-6 overflow-y-auto px-6 py-5">
          <div className="space-y-2">
            <label htmlFor="correction-remarks" className={labelClass}>Correction Remarks</label>
            <textarea id="correction-remarks" value={remarks} onChange={(event) => setRemarks(event.target.value)} placeholder="Correction Remarks" rows={3} className={`${controlClass} min-h-20 resize-y leading-6`} />
          </div>

          <section className="space-y-3" aria-labelledby="correction-issues-title">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h3 id="correction-issues-title" className="text-[15px] font-bold text-[#111827]">Correction Issues</h3>
                <p className="mt-1 text-[13px] font-medium text-[#6b7280]">Specify each payroll value that needs correction.</p>
              </div>
              <span className="text-[12px] font-semibold text-[#9ca3af]">{issues.length} {issues.length === 1 ? 'issue' : 'issues'}</span>
            </div>

            <div className="space-y-3">
              {issues.map((issue, index) => (
                <div key={index} className="rounded-2xl border border-[#e5e7eb] bg-[#f9fafb] p-4">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h4 className="text-[14px] font-bold text-[#111827]">Issue {index + 1}</h4>
                    {issues.length > 1 && <button type="button" onClick={() => setIssues((items) => items.filter((_, itemIndex) => itemIndex !== index))} className="rounded-full px-2.5 py-1 text-[12px] font-bold text-[#dc2626] transition hover:bg-[#fee2e2]">Remove</button>}
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor={`correction-field-${index}`} className={labelClass}>Field *</label>
                      <select id={`correction-field-${index}`} value={issue.field_name} onChange={(event) => updateIssue(index, 'field_name', event.target.value)} className={controlClass}>
                        <option value="">Select field</option>
                        {FIELDS.filter((field) => field === issue.field_name || !selectedFields.has(field)).map((field) => <option key={field} value={field}>{FIELD_LABELS[field]}</option>)}
                      </select>
                    </div>

                    {getIssueRecords(payroll, issue.field_name).length > 1 && <div className="space-y-2"><label htmlFor={`correction-record-${index}`} className={labelClass}>Record *</label><select id={`correction-record-${index}`} value={issue.record_id || ''} onChange={(event) => updateIssue(index, 'record_id', event.target.value)} className={controlClass}><option value="">Select record</option>{getIssueRecords(payroll, issue.field_name).map((record) => <option key={record.id} value={record.id}>{record.reference_month || record.reason || 'Record'} · {record.amount} · #{record.id}</option>)}</select></div>}

                    {issue.field_name === 'previous_month_adjustment' && (() => {
                      const adjustmentRecords = getIssueRecords(payroll, issue.field_name)
                      const adjustment = getSelectedIssueRecord(payroll, issue)
                      if (!adjustmentRecords.length) return <p className="rounded-xl border border-[#e5e7eb] bg-white px-4 py-3 text-[13px] font-semibold text-[#6b7280]">No adjustment records are available for this payroll.</p>
                      if (!adjustment) return <p className="rounded-xl border border-[#e5e7eb] bg-white px-4 py-3 text-[13px] font-semibold text-[#6b7280]">Select an adjustment record to view its details.</p>
                      return <div className="grid grid-cols-1 gap-3 rounded-xl border border-[#e5e7eb] bg-white p-4 text-[13px] sm:grid-cols-2" aria-label="Adjustment details">
                        <div><span className={labelClass}>Reference Month</span><p className="mt-1 font-semibold text-[#111827]">{formatReferenceMonth(adjustment.reference_month)}</p></div>
                        <div><span className={labelClass}>Direction</span><p className="mt-1 font-semibold text-[#111827]">{adjustment.direction || '—'}</p></div>
                        <div><span className={labelClass}>Current Amount</span><p className="mt-1 font-semibold text-[#111827]">{adjustment.amount ?? '—'}</p></div>
                        <div><span className={labelClass}>Reason</span><p className="mt-1 font-semibold text-[#111827]">{adjustment.reason || '—'}</p></div>
                        <div><span className={labelClass}>Supporting Reference</span><p className="mt-1 font-semibold text-[#111827]">{adjustment.supporting_reference || '—'}</p></div>
                        <div><span className={labelClass}>Adjustment ID</span><p className="mt-1 font-semibold text-[#111827]">{adjustment.id ?? '—'}</p></div>
                      </div>
                    })()}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2"><label htmlFor={`correction-current-${index}`} className={labelClass}>Current Value *</label><input id={`correction-current-${index}`} value={getIssueCurrentValue(payroll, issue)} readOnly className={`${controlClass} bg-[#f9fafb]`} /></div>
                      <div className="space-y-2"><label htmlFor={`correction-expected-${index}`} className={labelClass}>Expected Value *</label><input id={`correction-expected-${index}`} value={issue.expected_value} onChange={(event) => updateIssue(index, 'expected_value', event.target.value)} className={controlClass} /></div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor={`correction-reason-${index}`} className={labelClass}>Reason *</label>
                      <textarea id={`correction-reason-${index}`} value={issue.reason} onChange={(event) => updateIssue(index, 'reason', event.target.value)} rows={2} className={`${controlClass} resize-y leading-6`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button type="button" disabled={issues.length >= FIELDS.length || selectedFields.size >= FIELDS.length} onClick={() => setIssues((items) => [...items, blankIssue()])} className="text-[13px] font-bold text-[#2563eb] transition hover:text-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-50">+ Add Another Issue</button>
          </section>

          {(validation || error) && <p className="rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-[13px] font-semibold text-[#b91c1c]">{validation || getApiErrorMessage(error, 'Unable to request correction.')}</p>}
        </div>

        <div className="flex justify-end gap-3 border-t border-[#e5e7eb] px-6 py-5">
          <Button type="button" disabled={loading} onClick={onCancel} className="rounded-full border border-[#d1d5db] px-5 py-2.5 text-[14px] font-bold text-[#4b5563] transition hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-50">Cancel</Button>
          <Button type="submit" disabled={loading} className={`rounded-full px-5 py-2.5 text-[14px] font-bold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${mode === 'request' ? 'bg-red-600 hover:bg-red-700' : 'bg-[#2563eb] hover:bg-[#1d4ed8]'}`}>{loading ? 'Submitting...' : submitLabel}</Button>
        </div>
      </form>
    </div>
  )
}

function ManualComponentsModal({ isOpen, loading, error, draft, componentType, onCancel, onSubmit, onSaveDraft, title, submitLabel, draftOnly }) {
  const initialEarnings = draft?.earnings?.[0] || { amount: '', reason: '' }
  const initialDeductions = draft?.deductions?.[0] || { amount: '', reason: '' }
  const initialAdjustments = draft?.adjustments?.length
    ? draft.adjustments.map((adjustment) => ({ ...adjustment, reference_month: normalizeMonthDate(adjustment.reference_month) }))
    : [{ reference_month: '', direction: '', amount: '', reason: '', supporting_reference: '' }]
  const [earnings, setEarnings] = useState(() => draft?.earnings?.length ? draft.earnings : [initialEarnings])
  const [deductions, setDeductions] = useState(() => draft?.deductions?.length ? draft.deductions : [initialDeductions])
  const [adjustments, setAdjustments] = useState(() => initialAdjustments)
  const [validation, setValidation] = useState('')

  if (!isOpen) return null

  const update = (setter, index, key, value) => setter((rows) => rows.map((row, rowIndex) => rowIndex === index ? { ...row, [key]: value } : row))
  const validAmount = (value) => /^\d+(?:\.\d+)?$/.test(value) && BigInt(value.replace('.', '')) > 0n
  const validate = () => {
    const rows = componentType === 'earnings' ? earnings : componentType === 'deductions' ? deductions : adjustments
    if (rows.length === 0) return ''
    const populatedRows = rows.filter((row) => Object.values(row).some((value) => String(value || '').trim()))
    if (populatedRows.length === 0) return ''
    if (componentType !== 'adjustments' && populatedRows.some((row) => !validAmount(row.amount) || !row.reason.trim())) return 'Amount and reason are required for every row.'
    if (componentType === 'adjustments' && populatedRows.some((row) => (!/^\d{4}-\d{2}-01$/.test(normalizeMonthDate(row.reference_month)) || !['POSITIVE', 'NEGATIVE'].includes(row.direction) || !validAmount(row.amount) || !row.reason.trim()))) return 'Reference month, direction, amount, and reason are required for every adjustment.'
    return ''
  }
  const submit = async (event) => {
    event.preventDefault()
    const message = validate()
    if (message) {
      setValidation(message)
      return
    }
    setValidation('')
    const payload = {
      [componentType]: [],
    }
    const rows = componentType === 'earnings' ? earnings : componentType === 'deductions' ? deductions : adjustments
    const populatedRows = rows.filter((row) => Object.values(row).some((value) => String(value || '').trim()))
    if (componentType === 'earnings') payload.earnings = populatedRows.map((row) => ({ amount: row.amount.trim(), reason: row.reason.trim() }))
    if (componentType === 'deductions') payload.deductions = populatedRows.map((row) => ({ amount: row.amount.trim(), reason: row.reason.trim() }))
    if (componentType === 'adjustments') payload.adjustments = populatedRows.map((row) => ({ reference_month: normalizeMonthDate(row.reference_month), direction: row.direction, amount: row.amount.trim(), reason: row.reason.trim(), ...(String(row.supporting_reference ?? '').trim() ? { supporting_reference: String(row.supporting_reference).trim() } : {}), ...(row.idempotency_key ? { idempotency_key: row.idempotency_key } : {}) }))
    if (draftOnly) {
      onSaveDraft?.({ draft: payload })
      return
    }
    await onSubmit({ payload })
  }
  const input = 'w-full rounded-xl border border-[#d1d5db] px-3 py-2 text-sm outline-none focus:border-[#2563eb] disabled:bg-[#f9fafb]'
  const renderRows = (rows, setter, type) => rows.map((row, index) => (
    <div key={`${type}-${index}`} className="grid gap-3 rounded-xl border border-[#e5e7eb] bg-[#f9fafb] p-3 sm:grid-cols-2">
      {type === 'adjustments' && <DatePicker value={normalizeMonthDate(row.reference_month)} onChange={(value) => update(setter, index, 'reference_month', normalizeMonthDate(value))} disabled={loading} monthOnly portal ariaLabel="Reference month" placeholder="Select reference month" className="min-h-0 rounded-xl px-3 py-2" />}
      {type === 'adjustments' && <select value={row.direction} onChange={(event) => update(setter, index, 'direction', event.target.value)} disabled={loading} className={input} aria-label="Adjustment direction"><option value="">Direction</option><option value="POSITIVE">Positive</option><option value="NEGATIVE">Negative</option></select>}
      <input value={row.amount} onChange={(event) => update(setter, index, 'amount', event.target.value)} disabled={loading} placeholder="Amount" inputMode="decimal" className={input} aria-label={`${type} amount`} />
      <input value={row.reason} onChange={(event) => update(setter, index, 'reason', event.target.value)} disabled={loading} placeholder="Reason" className={input} aria-label={`${type} reason`} />
      {type === 'adjustments' && <input value={row.supporting_reference} onChange={(event) => update(setter, index, 'supporting_reference', event.target.value)} disabled={loading} placeholder="Supporting reference (optional)" className={`${input} sm:col-span-2`} />}
    </div>
  ))
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="manual-payroll-title">
    <form onSubmit={submit} className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-[24px] bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 py-5"><h2 id="manual-payroll-title" className="text-[22px] font-black text-[#111827]">{title}</h2><button type="button" onClick={onCancel} disabled={loading} className="text-2xl text-[#6b7280]" aria-label="Close">×</button></div>
      <div className="min-h-0 space-y-5 overflow-y-auto px-6 py-5">
        {[['Other Earnings', earnings, setEarnings, 'earnings'], ['Other Deductions', deductions, setDeductions, 'deductions'], ['Previous Month Adjustments', adjustments, setAdjustments, 'adjustments']].filter(([, , , type]) => type === componentType).map(([label, rows, setter, type]) => <section key={type} className="space-y-2"><div className="flex items-center justify-between gap-3"><h3 className="text-sm font-bold text-[#111827]">{label}</h3>{type === 'adjustments' && rows.length > 0 && <button type="button" onClick={() => { setAdjustments((items) => items.slice(0, -1)); setValidation('') }} disabled={loading} className="rounded-full px-3 py-1 text-[12px] font-bold text-[#dc2626] transition hover:bg-[#fee2e2] disabled:cursor-not-allowed disabled:opacity-50">Remove Adjustment</button>}</div>{rows.length > 0 ? renderRows(rows, setter, type) : <button type="button" onClick={() => setAdjustments([initialAdjustments[0]])} disabled={loading} className="rounded-full border border-[#d1d5db] px-4 py-2 text-[13px] font-bold text-[#374151] transition hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-50">Add Adjustment</button>}{type === 'adjustments' && <button type="button" onClick={() => setAdjustments((items) => [...items, { reference_month: '', direction: '', amount: '', reason: '', supporting_reference: '' }])} disabled={loading} className="text-[13px] font-bold text-[#2563eb] disabled:opacity-50">+ Add Adjustment</button>}</section>)}
        {(validation || error) && <p className="rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm font-semibold text-[#b91c1c]">{validation || getApiErrorMessage(error, 'Unable to apply payroll correction.')}</p>}
      </div>
      <div className="flex justify-end gap-3 border-t border-[#e5e7eb] px-6 py-5"><Button type="button" onClick={onCancel} disabled={loading} className="rounded-full border px-5 py-2.5 font-bold">Cancel</Button><Button type="submit" disabled={loading} className="rounded-full bg-[#2563eb] px-5 py-2.5 font-bold text-white">{loading ? 'Saving...' : submitLabel}</Button></div>
    </form>
  </div>
}

export default PayrollCorrectionModal
