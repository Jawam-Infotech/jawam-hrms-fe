import { useNavigate } from 'react-router-dom'

export default function LatestPayslipCard() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col justify-between rounded-[20px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
      <div>
        <h3 className="mb-6 text-[18px] font-extrabold text-[#111827]">Latest Payslip</h3>

        <div className="flex items-center gap-6">
          <div className="flex h-16 w-14 shrink-0 flex-col items-center justify-center rounded-lg border-2 border-[#111827] bg-white p-1">
            <svg className="h-7 w-7 text-[#111827]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
            <span className="text-[9px] font-black uppercase text-[#111827]">PDF</span>
          </div>

          <div>
            <p className="text-[18px] font-black text-[#111827]">June 2026</p>
            <button
              type="button"
              onClick={() => navigate('/payroll')}
              className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#e0f2fe] px-4 py-1.5 text-[13px] font-bold text-[#0284c7] transition-all hover:bg-[#bae6fd]"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
              </svg>
              View Payslip
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-[#f3f4f6] pt-3">
        <button
          type="button"
          onClick={() => navigate('/payroll')}
          className="text-[13px] font-bold text-[#3b82f6] hover:underline"
        >
          View All Payslips →
        </button>
      </div>
    </div>
  )
}