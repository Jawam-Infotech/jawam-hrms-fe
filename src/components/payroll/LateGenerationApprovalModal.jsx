import { useState } from 'react'
import { X } from 'lucide-react'
import Button from '../ui/Button.jsx'
import { getApiErrorMessage } from '../../utils/apiErrorMessage.js'
import { getPreviousCalendarMonth } from '../../utils/payrollDate.js'

function LateGenerationApprovalModal({ isOpen, loading = false, error = null, onClose, onApprove }) {
  const salaryMonth = getPreviousCalendarMonth()
  const [reason, setReason] = useState('')
  const [success, setSuccess] = useState('')

  if (!isOpen) return null

  const formattedMonth = new Date(`${salaryMonth}-01T00:00:00`).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const handleSubmit = async (event) => {
    event.preventDefault()
    const trimmedReason = reason.trim()
    if (!trimmedReason || loading) return
    await onApprove({ salary_month: salaryMonth, reason: trimmedReason })
    setSuccess(`Late generation approved for ${formattedMonth}.`)
    setTimeout(onClose, 900)
  }

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-labelledby="late-generation-title">
    <form onSubmit={handleSubmit} className="w-full max-w-lg rounded-[24px] bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 py-5"><h2 id="late-generation-title" className="text-[22px] font-black text-[#111827]">Late Generation Approval</h2><button type="button" onClick={onClose} disabled={loading} aria-label="Close late generation approval" className="rounded-full p-1 text-[#6b7280] hover:bg-[#f3f4f6] disabled:opacity-50"><X size={24} /></button></div>
      <div className="space-y-5 p-6">
        <div><label className="mb-2 block text-[13px] font-bold uppercase tracking-wider text-[#6b7280]">Salary Month</label><div className="flex h-11 items-center rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 text-[15px] font-semibold text-[#111827]">{formattedMonth}</div></div>
        <div><label htmlFor="late-generation-reason" className="mb-2 block text-[13px] font-bold uppercase tracking-wider text-[#6b7280]">Reason</label><textarea id="late-generation-reason" value={reason} onChange={(event) => setReason(event.target.value)} disabled={loading} rows={4} placeholder="Enter approval reason" className="w-full resize-none rounded-xl border border-[#d1d5db] px-4 py-3 text-[15px] text-[#111827] outline-none focus:border-[#2563eb] disabled:bg-[#f9fafb]" /></div>
        {error && <p className="rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-[14px] font-semibold text-[#b91c1c]">{getApiErrorMessage(error, 'Unable to approve late generation.')}</p>}
        {success && <p className="rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-3 text-[14px] font-semibold text-[#15803d]">{success}</p>}
      </div>
      <div className="flex justify-end gap-3 border-t border-[#e5e7eb] px-6 py-5"><Button type="button" onClick={onClose} disabled={loading} className="rounded-full px-5 py-2.5 text-[14px] font-bold text-[#4b5563] hover:bg-[#f3f4f6]">Cancel</Button><Button type="submit" disabled={loading || !reason.trim()} className="rounded-full bg-[#2563eb] px-5 py-2.5 text-[14px] font-bold text-white hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-50">{loading ? 'Approving...' : 'Approve Late Generation'}</Button></div>
    </form>
  </div>
}

export default LateGenerationApprovalModal
