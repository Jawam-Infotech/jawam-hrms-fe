import { X } from 'lucide-react'
import { classifySettlementItem } from '../../utils/settlementItemClassification.js'
import { finalSettlementItemLabel, paymentStatusClass } from '../../utils/finalSettlementPreview.js'

const money = (value) => {
  if (value === null || value === undefined || value === '') return '—'
  const amount = Number(value)
  return Number.isFinite(amount)
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(amount)
    : String(value)
}

const valueOrDash = (value) => value === null || value === undefined || value === '' ? '—' : String(value)

const dateValue = (value) => {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? String(value) : new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(date)
}

const monthValue = (value) => {
  if (!value) return '—'
  const match = String(value).match(/^(\d{4})-(\d{2})/)
  if (!match) return String(value)
  const date = new Date(`${match[1]}-${match[2]}-01T00:00:00`)
  return Number.isNaN(date.getTime()) ? String(value) : new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(date)
}

function PayslipPreview({ payroll, onClose, previewRef, exportOnly = false }) {
  if (!payroll) return null
  const version = payroll.current_version || {}
  const inputs = version.calculation_inputs || {}
  const results = version.calculation_results || {}
  const items = Array.isArray(version.items) ? version.items : []
  const earnings = Array.isArray(version.earnings) && version.earnings.length ? version.earnings : items.filter((item) => ['EARNING', 'OTHER_EARNING', 'SALARY', 'MONTHLY_SALARY', 'GROSS'].includes(String(item.item_type || '').toUpperCase()))
  const deductions = Array.isArray(version.deductions) && version.deductions.length ? version.deductions : items.filter((item) => ['DEDUCTION', 'OTHER_DEDUCTION', 'LOP_DEDUCTION'].includes(String(item.item_type || '').toUpperCase()))
  const status = String(payroll.payment_status || payroll.status || '').toUpperCase()
  const employee = payroll.employee || {}
  const employeeName = payroll.employee_name || employee.name || employee.full_name
  const employeeId = payroll.employee_code || payroll.employee_id || employee.employee_code || employee.employee_id || employee.code || employee.id
  const authorizedBy = typeof (payroll.authorized_by || payroll.approved_by) === 'string'
    ? (payroll.authorized_by || payroll.approved_by)
    : (payroll.authorized_by || payroll.approved_by)?.name || (payroll.authorized_by || payroll.approved_by)?.full_name
  const detailedItems = [
    { item_type: 'CURRENT_MONTH_SALARY', amount: inputs.monthly_salary ?? results.current_month_salary },
    { item_type: 'LOP_DEDUCTION', amount: results.lop_deduction },
    ...earnings.filter((item) => String(item.earning_type || '').toUpperCase() === 'OTHER').map((item) => ({ ...item, item_type: 'OTHER_EARNING', description: item.description || item.name || item.reason })),
    ...deductions.filter((item) => String(item.deduction_type || '').toUpperCase() === 'OTHER').map((item) => ({ ...item, item_type: 'OTHER_DEDUCTION', description: item.description || item.name || item.reason })),
    ...(Array.isArray(version.adjustments) ? version.adjustments : []).map((item) => ({ ...item, item_type: 'PREVIOUS_MONTH_ADJUSTMENT', description: item.description || item.name || item.reason })),
  ].filter((item) => item.amount !== null && item.amount !== undefined && item.amount !== '')
  const payrollItems = detailedItems.length >= 2 || !items.length
    ? detailedItems.map((item) => ({ item, fallbackPositive: undefined }))
    : items.length
      ? items.map((item) => ({ item, fallbackPositive: undefined }))
      : [
          ...earnings.map((item) => ({ item, fallbackPositive: true })),
          ...deductions.map((item) => ({ item, fallbackPositive: false })),
        ]
  const settlementRows = payrollItems.map(({ item, fallbackPositive }) => {
    const itemIsPositive = fallbackPositive === undefined
      ? classifySettlementItem(item)
      : (item.direction || item.item_type ? classifySettlementItem(item) : fallbackPositive)
    return {
      description: finalSettlementItemLabel(item),
      type: itemIsPositive ? 'Earning' : 'Deduction',
      amount: item.amount ?? item.value,
      positive: itemIsPositive,
    }
  })

  return <div className={`fixed inset-0 z-50 overflow-y-auto bg-black/50 p-4 ${exportOnly ? 'pointer-events-none left-[-10000px]' : ''}`} role="dialog" aria-modal="true" aria-labelledby="payslip-preview-title">
    <div className="mx-auto max-w-4xl rounded-[24px] bg-[#f3f4f6] shadow-2xl">
      <div className="flex items-center justify-between border-b border-[#e5e7eb] bg-white px-6 py-5">
        <h2 id="payslip-preview-title" className="text-[22px] font-black text-[#111827]">Payslip Preview</h2>
        <button type="button" onClick={onClose} aria-label="Close payslip preview" className="rounded-full p-1 text-[#6b7280] hover:bg-[#f3f4f6]"><X size={22} /></button>
      </div>
      <article ref={previewRef} data-payslip-preview className="mx-auto my-6 max-w-[794px] bg-white p-8 text-[#111827] shadow-sm print:my-0 print:max-w-none print:shadow-none sm:p-10">
        <header className="flex flex-wrap items-start justify-between gap-5 border-b-2 border-[#111827] pb-5">
          <div><img src="/assets/jawam.png" alt="Jawam Infotech" className="h-28 w-44 object-contain object-left" /></div>
          <div className="text-right"><h1 className="text-[20px] font-black uppercase tracking-wider">Payslip</h1><span className={`mt-2 inline-block rounded-full px-3 py-1 text-[11px] font-extrabold uppercase ${paymentStatusClass(status)}`}>{valueOrDash(status)}</span></div>
        </header>
        <div className="mt-5 grid gap-3 rounded-xl bg-[#f8fafc] p-4 text-[12px] sm:grid-cols-4"><Info label="Salary Month" value={monthValue(payroll.salary_month || inputs.salary_month)} /><Info label="Payment Date" value={dateValue(payroll.payment_date || payroll.expected_pay_date)} /><Info label="Generated Date" value={dateValue(payroll.created_at || payroll.generated_at)} /><Info label="Payment Status" value={payroll.payment_status || payroll.status} /></div>
        <section className="mt-6"><h3 className="border-b border-[#d1d5db] pb-2 text-[13px] font-black uppercase tracking-wider">Employee Details</h3><div className="mt-3 grid gap-x-6 gap-y-3 text-[13px] sm:grid-cols-2"><Info label="Employee Name" value={employeeName} /><Info label="Employee ID" value={employeeId} /><Info label="Department" value={payroll.employee_department || employee.department_name || employee.department} /><Info label="Designation" value={payroll.employee_designation || payroll.designation_name || payroll.designation || employee.designation_name || employee.designation} /><Info label="Employment Start Date" value={dateValue(inputs.date_of_joining || payroll.date_of_joining || employee.date_of_joining || employee.joining_date)} /></div></section>
        <section className="mt-6"><h3 className="border-b border-[#d1d5db] pb-2 text-[13px] font-black uppercase tracking-wider">Settlement Breakdown</h3><div className="mt-2 overflow-x-auto"><table className="w-full min-w-[480px] text-left text-[12px]"><thead><tr className="border-b border-[#111827]"><th className="w-1/2 py-2 pr-3">Item Description</th><th className="w-1/4 py-2 pr-3">Type</th><th className="w-1/4 py-2 text-right">Amount</th></tr></thead><tbody>{settlementRows.length ? settlementRows.map((row, index) => <tr key={`${row.description}-${index}`} className="border-b border-[#f3f4f6]"><td className="py-2 pr-3 font-semibold">{row.description}</td><td className="py-2 pr-3">{row.type}</td><td className={`py-2 text-right font-semibold ${row.positive ? 'text-[#166534]' : 'text-[#b91c1c]'}`}>{row.positive ? '+' : '−'}{money(Math.abs(Number(row.amount)))}</td></tr>) : <tr><td colSpan="3" className="py-4 text-center text-[#6b7280]">No payroll items provided.</td></tr>}</tbody></table></div></section>
        <div className="mt-6 flex items-center justify-between rounded-xl bg-[#0D9CD4] px-5 py-4 text-white"><span className="text-[13px] font-bold uppercase tracking-wider">Net Payable Salary</span><strong className="text-[20px]">{money(results.net_payable)}</strong></div>
        <section className="mt-6 grid gap-3 text-[13px] sm:grid-cols-3"><Info label="Payment Status" value={payroll.payment_status || payroll.status} /><Info label="Payment Date" value={dateValue(payroll.payment_date)} /><Info label="Authorized By" value={authorizedBy} /></section>
        <footer className="mt-8 border-t border-[#d1d5db] pt-4 text-center text-[10px] text-[#6b7280]">This is a system-generated payslip. Confidential — for the intended employee only.</footer>
      </article>
    </div>
  </div>
}

function Info({ label, value, valueClassName = 'break-words font-semibold' }) { return <div><p className="text-[10px] font-bold uppercase tracking-wider text-[#6b7280]">{label}</p><p className={`mt-1 ${valueClassName}`}>{valueOrDash(value)}</p></div> }

export default PayslipPreview
