import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPayrollById } from '../../services/payrollService.js'
import { getApiErrorMessage } from '../../utils/apiErrorMessage.js'
import { downloadPayslipPreview } from '../../utils/payslipPdf.js'
import useLatestPaidPayroll from '../../hooks/payroll/useLatestPaidPayroll.js'
import PayslipPreview from '../payroll/PayslipPreview.jsx'

const formatMonth = (value) => {
  if (!value) return '—'
  const match = String(value).match(/^(\d{4})-(\d{2})/)
  if (!match) return String(value)
  return new Intl.DateTimeFormat('en-IN', { month: 'long', year: 'numeric' }).format(new Date(`${match[1]}-${match[2]}-01T00:00:00`))
}

export default function LatestPayslipCard({ buttonText = 'Download Payslip', employeeId }) {
  const navigate = useNavigate()
  const { payroll, loading, error, retry } = useLatestPaidPayroll(employeeId)
  const [downloading, setDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState(null)
  const [previewPayroll, setPreviewPayroll] = useState(null)
  const previewRef = useRef(null)

  useEffect(() => {
    if (!previewPayroll || !previewRef.current) return
    let cancelled = false
    const run = async () => {
      try {
        await new Promise((resolve) => requestAnimationFrame(resolve))
        if (!cancelled) await downloadPayslipPreview(previewRef.current, previewPayroll)
      } catch (requestError) {
        if (!cancelled) setDownloadError(getApiErrorMessage(requestError, 'Unable to download payslip.'))
      } finally {
        if (!cancelled) { setDownloading(false); setPreviewPayroll(null) }
      }
    }
    void run()
    return () => { cancelled = true }
  }, [previewPayroll])

  const handleDownload = async () => {
    if (!payroll?.id || downloading) return
    setDownloading(true)
    setDownloadError(null)
    try { setPreviewPayroll(await getPayrollById(payroll.id)) } catch (requestError) {
      setDownloading(false)
      setDownloadError(getApiErrorMessage(requestError, 'Unable to download payslip.'))
    }
  }

  return (
    <div className="flex flex-col justify-between rounded-[20px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
      <div>
        <h3 className="mb-6 text-[18px] font-extrabold text-[#111827]">Latest Payslip</h3>
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex h-16 w-14 shrink-0 flex-col items-center justify-center rounded-lg border-2 border-[#111827] bg-white p-1 text-[#111827]"><span className="text-[28px]">📄</span><span className="text-[9px] font-black uppercase">PDF</span></div>
          {loading ? <p className="text-[14px] font-semibold text-[#6b7280]">Loading latest payslip...</p> : error ? <><p className="text-[14px] font-semibold text-[#b91c1c]">Unable to load latest payslip.</p><button type="button" onClick={retry} className="rounded-full border border-[#d1d5db] px-4 py-2 text-[12px] font-bold text-[#374151]">Retry</button></> : <p className="text-[18px] font-black text-[#111827]">{payroll ? formatMonth(payroll.salary_month) : '—'}</p>}
          {!loading && !error && !payroll && <p className="text-[14px] font-semibold text-[#6b7280]">No paid payslip available yet.</p>}
          <button type="button" onClick={handleDownload} disabled={!payroll || downloading || loading || Boolean(error)} className="inline-flex items-center justify-center rounded-full bg-[#3b82f6] px-5 py-2 text-[14px] font-extrabold text-white transition-all duration-200 hover:bg-[#2563eb] disabled:cursor-not-allowed disabled:opacity-50">{downloading ? 'Downloading...' : buttonText}</button>
          {downloadError && <p className="text-[12px] font-semibold text-[#b91c1c]">{downloadError}</p>}
        </div>
      </div>
      <div className="mt-6 border-t border-[#f3f4f6] pt-3 text-center"><button type="button" onClick={() => navigate('/payroll')} className="text-[13px] font-bold text-[#3b82f6] hover:underline">View All Payslips →</button></div>
      {previewPayroll && <PayslipPreview exportOnly payroll={previewPayroll} previewRef={previewRef} onClose={() => {}} />}
    </div>
  )
}
