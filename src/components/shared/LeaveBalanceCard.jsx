export default function LeaveBalanceCard() {
  return (
    <div className="bg-white rounded-[16px] border border-[#e5e5e5] p-6 shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-[#ccfbf1] flex items-center justify-center text-[24px]">📅</div>
        <div>
          <h3 className="text-[16px] font-extrabold text-[#111827]">Leave Balance</h3>
          <p className="text-[14px] font-extrabold text-[#3b82f6]">12 Days</p>
        </div>
      </div>

      <button className="text-[#3b82f6] text-[14px] font-extrabold hover:underline">Check Leave History</button>
    </div>
  )
}
