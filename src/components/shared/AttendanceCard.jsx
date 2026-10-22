export default function AttendanceCard({ checkInTime, breakDuration, status, hasCheckedOut, workingHours }) {
  const displayStatus = status || 'Awaiting'

  return (
    <div className="rounded-[20px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fef3c7] text-[#f59e0b]">
          <svg className="h-6 w-6 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="9" />
            <polyline points="12 7 12 12 15 15" />
          </svg>
        </div>
        <div>
          <h3 className="text-[16px] font-extrabold text-[#111827] leading-tight">
            Attendance<br />Status
          </h3>
          <p className="mt-1 text-[14px] font-extrabold text-[#f59e0b]">● {displayStatus}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 pt-1">
        <div>
          <p className="mb-1 text-[12px] text-[#6b7280]">{hasCheckedOut ? 'Working hours' : 'Check in'}</p>
          <p className="text-[15px] font-extrabold text-[#111827]">{hasCheckedOut ? (workingHours || '0m') : (checkInTime || 'Not Checked in')}</p>
        </div>
        <div>
          <p className="mb-1 text-[12px] text-[#6b7280]">Break</p>
          <p className="text-[15px] font-extrabold text-[#111827]">{breakDuration || 'N/A'}</p>
        </div>
      </div>
    </div>
  )
}

