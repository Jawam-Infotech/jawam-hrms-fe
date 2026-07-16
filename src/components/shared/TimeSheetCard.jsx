export default function TimeSheetCard() {
  return (
    <div className="bg-white rounded-[16px] border border-[#e5e5e5] p-6 shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-[#fce7f3] flex items-center justify-center text-[24px]">📋</div>
        <div>
          <h3 className="text-[16px] font-extrabold text-[#111827]">Time Sheet</h3>
          <p className="text-[14px] font-extrabold text-[#ef4444]">● Pending</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-[12px] text-[#5f6679] mb-1">Due in</p>
          <p className="text-[16px] font-extrabold text-[#111827]">5 days left</p>
        </div>
        <div>
          <p className="text-[12px] text-[#5f6679] mb-1">Logged</p>
          <p className="text-[16px] font-extrabold text-[#111827]">30/hrs week</p>
        </div>
      </div>
    </div>
  )
}
