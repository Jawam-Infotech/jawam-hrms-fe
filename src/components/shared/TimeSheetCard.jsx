export default function TimeSheetCard() {
  return (
    <div className="rounded-[20px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fee2e2] text-[#ef4444]">
          <svg className="h-6 w-6 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
        </div>
        <div>
          <h3 className="text-[16px] font-extrabold text-[#111827]">Time Sheet</h3>
          <p className="mt-1 text-[14px] font-extrabold text-[#ef4444]">● Pending</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-1">
        <div>
          <p className="mb-1 text-[12px] text-[#6b7280]">Due in</p>
          <p className="text-[15px] font-extrabold text-[#111827]">3 days left</p>
        </div>
        <div>
          <p className="mb-1 text-[12px] text-[#6b7280]">Logged</p>
          <p className="text-[15px] font-extrabold text-[#111827]">30/45 hrs week</p>
        </div>
      </div>
    </div>
  )
}

