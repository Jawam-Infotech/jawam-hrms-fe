export default function AssignedTaskCard() {
  return (
    <div className="rounded-[20px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#dbeafe] text-[#3b82f6]">
          <svg className="h-6 w-6 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
        </div>
        <div>
          <h3 className="text-[16px] font-extrabold text-[#111827]">Assigned Task</h3>
          <p className="mt-1 text-[14px] font-extrabold text-[#3b82f6]">5 Active</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-1">
        <div>
          <p className="mb-1 text-[12px] text-[#6b7280]">Completed</p>
          <p className="text-[15px] font-extrabold text-[#111827]">3</p>
        </div>
        <div>
          <p className="mb-1 text-[12px] text-[#6b7280]">Remaining</p>
          <p className="text-[15px] font-extrabold text-[#111827]">2</p>
        </div>
      </div>
    </div>
  )
}

