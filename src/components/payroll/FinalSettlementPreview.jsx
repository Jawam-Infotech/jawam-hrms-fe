import { X } from 'lucide-react'
import { classifySettlementItem } from '../../utils/settlementItemClassification.js'
import { finalSettlementAuthorizedBy, finalSettlementEmployeeFields, finalSettlementItemLabel, paymentStatusClass } from '../../utils/finalSettlementPreview.js'

const valueOrDash = (value) => value === null || value === undefined || value === '' ? '—' : String(value)
const money = (value) => {
  if (value === null || value === undefined || value === '') return '—'
  const amount = Number(value)
  return Number.isFinite(amount) ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(amount) : String(value)
}
const dateValue = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? String(value) : new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}

function FinalSettlementPreview({ settlement, isOpen, onClose, previewRef, exportOnly = false }) {
  if (!isOpen || !settlement) return null
  const version = settlement.current_version || {}
  const results = version.calculation_results || {}
  const items = Array.isArray(version.items) ? version.items : []
  const employee = settlement.employee || {}
  const employeeFields = finalSettlementEmployeeFields(settlement)
  const rows = items.map((item) => {
    const amount = item.amount ?? item.value
    const positive = classifySettlementItem(item)
    return {
      description: finalSettlementItemLabel(item),
      type: positive ? 'Earning' : 'Deduction',
      note: item.reason || item.notes || item.supporting_reference,
      amount: positive ? amount : (amount === null || amount === undefined ? amount : -Math.abs(Number(amount))),
      positive,
    }
  })
  const status = String(settlement.payment_status || settlement.status || '').toUpperCase()
  const employeeCode = settlement.employee_code || settlement.employee_id || employee.employee_code || employee.employee_id || employee.code
  const netPayable = results.net_payable ?? settlement.net_payable

  const containerClassName = exportOnly
    ? 'pointer-events-none absolute left-[-10000px] top-0 w-[794px] bg-white p-0'
    : 'fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4'

  return <div className={containerClassName} role="dialog" aria-modal="true" aria-labelledby="settlement-preview-title">
    <div className="mx-auto max-w-4xl rounded-[24px] bg-[#f3f4f6] shadow-2xl">
      <div className="flex items-center justify-between border-b border-[#e5e7eb] bg-white px-6 py-5"><h2 id="settlement-preview-title" className="text-[22px] font-black text-[#111827]">Final Settlement Preview</h2><button type="button" onClick={onClose} aria-label="Close settlement preview" className="rounded-full p-1 text-[#6b7280] hover:bg-[#f3f4f6]"><X size={22} /></button></div>
      <article ref={previewRef} data-settlement-preview className="mx-auto my-6 max-w-[794px] bg-white p-8 text-[#111827] shadow-sm print:my-0 print:max-w-none print:shadow-none sm:p-10">
        <header className="flex flex-wrap items-start justify-between gap-5 border-b-2 border-[#111827] pb-5"><div><img src="/assets/jawam.png" alt="Jawam Infotech" className="h-28 w-44 object-contain object-left" /></div><div className="text-right"><h1 className="text-[20px] font-black uppercase tracking-wider">Final Settlement Statement</h1><span className={`mt-2 inline-block rounded-full px-3 py-1 text-[11px] font-extrabold uppercase ${paymentStatusClass(status)}`}>{valueOrDash(status)}</span></div></header>
        <div className="mt-5 grid gap-3 rounded-xl bg-[#f8fafc] p-4 text-[12px] sm:grid-cols-4"><Info label="Settlement ID" value={settlement.id} /><Info label="Generated Date" value={dateValue(settlement.created_at || settlement.generated_at)} /><Info label="Payment Date" value={dateValue(settlement.actual_payment_date || settlement.payment_date)} /><Info label="Payment Status" value={settlement.payment_status || settlement.status} /></div>
        <section className="mt-6"><h3 className="border-b border-[#d1d5db] pb-2 text-[13px] font-black uppercase tracking-wider">Employee Details</h3><div className="mt-3 grid gap-x-6 gap-y-3 text-[13px] sm:grid-cols-2"><Info label="Employee Name" value={settlement.employee_name || employee.name || employee.full_name} /><Info label="Employee ID" value={employeeCode} /><Info label="Department" value={employeeFields.department} /><Info label="Designation" value={employeeFields.designation} /><Info label="Employment Start Date" value={dateValue(employeeFields.employmentStartDate)} /><Info label="Last Working Date" value={dateValue(settlement.last_working_date)} /></div></section>
        <section className="mt-6"><h3 className="border-b border-[#d1d5db] pb-2 text-[13px] font-black uppercase tracking-wider">Settlement Breakdown</h3><div className="mt-2 overflow-x-auto"><table className="w-full min-w-[480px] text-left text-[12px]"><thead><tr className="border-b border-[#111827]"><th className="w-1/2 py-2 pr-3">Item Description</th><th className="w-1/4 py-2 pr-3">Type</th><th className="w-1/4 py-2 text-right">Amount</th></tr></thead><tbody>{rows.length ? rows.map((row, index) => <tr key={`${row.description}-${index}`} className="border-b border-[#f3f4f6]"><td className="py-2 pr-3 font-semibold">{row.description}</td><td className="py-2 pr-3">{row.type}</td><td className={`py-2 text-right font-semibold ${row.positive ? 'text-[#166534]' : 'text-[#b91c1c]'}`}>{row.positive ? '+' : '−'}{money(Math.abs(Number(row.amount)))}</td></tr>) : <tr><td colSpan="3" className="py-4 text-center text-[#6b7280]">No settlement items provided.</td></tr>}</tbody></table></div></section>
        <div className="mt-6 flex items-center justify-between rounded-xl bg-[#0D9CD4] px-5 py-4 text-white"><span className="text-[13px] font-bold uppercase tracking-wider">Net Final Settlement Payable</span><strong className="text-[20px]">{money(netPayable)}</strong></div>
        <section className="mt-6 grid gap-3 text-[13px] sm:grid-cols-3"><Info label="Payment Status" value={settlement.payment_status} /><Info label="Actual Payment Date" value={dateValue(settlement.actual_payment_date || settlement.payment_date)} /><Info label="Authorized By" value={finalSettlementAuthorizedBy(settlement)} /></section>
        <footer className="mt-8 border-t border-[#d1d5db] pt-4 text-center text-[10px] text-[#6b7280]">This is a system-generated final settlement statement. Confidential — for the intended employee only.</footer>
      </article>
    </div>
  </div>
}

function Info({ label, value, valueClassName = 'break-words font-semibold' }) { return <div><p className="text-[10px] font-bold uppercase tracking-wider text-[#6b7280]">{label}</p><p className={`mt-1 ${valueClassName}`}>{valueOrDash(value)}</p></div> }

export default FinalSettlementPreview
