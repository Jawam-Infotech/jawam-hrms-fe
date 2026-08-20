import { LEAVE_STATUS_CONFIG } from '../../constants/leave.js'


function LeaveRequestStatus({
  status,
}) {
  const normalizedStatus =
    status || 'Unknown'

  const config =
    LEAVE_STATUS_CONFIG[
      normalizedStatus
    ]

  const badgeClass =
    config?.badgeClass ||
    'bg-[#f3f4f6] text-[#4b5563]'

  return (
    <span
      role="status"
      aria-label={`Leave status: ${normalizedStatus}`}
      className={`inline-flex items-center rounded-full px-3 py-1 text-[12px] font-bold ${badgeClass}`}
    >
      {normalizedStatus}
    </span>
  )
}


export default LeaveRequestStatus