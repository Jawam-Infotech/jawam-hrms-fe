function AttendanceEmptyState({ message = 'No attendance records found.' }) {
  return (
    <div className="rounded-[18px] border border-dashed border-[#d1d5db] bg-[#f8fafc] px-6 py-8 text-center text-[14px] font-semibold text-[#6b7280]">
      {message}
    </div>
  )
}

export default AttendanceEmptyState
