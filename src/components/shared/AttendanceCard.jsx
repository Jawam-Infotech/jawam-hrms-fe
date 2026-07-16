export default function AttendanceCard({ checkInTime, checkOutTime, breakDuration, status, hasCheckedOut, workingHours }) {
  return (
    <div className="bg-white rounded-[16px] border border-[#e5e5e5] p-6 shadow-sm">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-[#fef3c7] flex items-center justify-center text-[24px]">⏱️</div>
        <div>
          <h3 className="text-[16px] font-extrabold text-[#111827]">Attendance Status</h3>
          <p className="text-[14px] font-extrabold text-[#f59e0b]">● {status}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-[12px] text-[#5f6679] mb-1">{hasCheckedOut ? 'Working hours' : 'Check in'}</p>
          <p className="text-[16px] font-extrabold text-[#111827]">{hasCheckedOut ? (workingHours || '0m') : (checkInTime || 'Not Checked in')}</p>
        </div>
        <div>
          <p className="text-[12px] text-[#5f6679] mb-1">Break</p>
          <p className="text-[16px] font-extrabold text-[#111827]">{breakDuration || 'N/A'}</p>
        </div>
      </div>
    </div>
  )
}
