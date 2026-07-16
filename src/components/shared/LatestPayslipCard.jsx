export default function LatestPayslipCard({ buttonText = 'Download Payslip' }) {
  return (
    <div className="bg-white rounded-[16px] border border-[#e5e5e5] p-6 shadow-sm">
      <h3 className="text-[18px] font-extrabold text-[#111827] mb-4">Latest Payslip</h3>

      <div className="text-center py-8">
        <div className="text-[48px] mb-4">📄</div>
        <p className="text-[16px] font-extrabold text-[#111827] mb-2">June 2026</p>
        <button className="mb-4 inline-flex items-center justify-center rounded-full bg-[#3b82f6] px-5 py-2 text-[14px] font-extrabold text-white transition-all duration-200 hover:bg-[#2563eb]">
          {buttonText}
        </button>
        <p className="text-[12px] text-[#5f6679]">View All Payslips →</p>
      </div>
    </div>
  )
}