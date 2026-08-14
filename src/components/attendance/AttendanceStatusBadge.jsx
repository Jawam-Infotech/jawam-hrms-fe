function getStatusBadgeClass(status) {
  switch (status) {
    case 'PRESENT':
      return 'bg-[#d1fae5] text-[#10b981]' // Green

    case 'LATE':
      return 'bg-[#fef3c7] text-[#f59e0b]' // Yellow

    case 'HALF_DAY':
      return 'bg-[#fed7aa] text-[#ea580c]' // Orange

    case 'ON_LEAVE':
      return 'bg-[#dbeafe] text-[#3b82f6]' // Blue

    case 'ABSENT':
      return 'bg-[#fee2e2] text-[#ef4444]' // Red

    default:
      return 'bg-[#f3f4f6] text-[#6b7280]' // Gray
  }
}

function AttendanceStatusBadge({ status, children }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-[12px] font-semibold ${getStatusBadgeClass(status)}`}
    >
      {children}
    </span>
  )
}

export default AttendanceStatusBadge
