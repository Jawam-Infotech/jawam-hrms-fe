const STATUS_STYLES = {
  'in progress': 'bg-[#dbeafe] text-[#0284c7]',
  completed: 'bg-[#d1fae5] text-[#059669]',
  blocked: 'bg-[#fee2e2] text-[#dc2626]',
  pending: 'bg-[#fef3c7] text-[#d97706]',
  approved: 'bg-[#d1fae5] text-[#059669]',
  rejected: 'bg-[#fee2e2] text-[#dc2626]',
  cancelled: 'bg-[#f3f4f6] text-[#6b7280]',
}

function StatusBadge({ status, className = '' }) {
  if (!status) return null

  const normalized = String(status).trim().toLowerCase()
  const colorClass = STATUS_STYLES[normalized] || 'bg-[#f3f4f6] text-[#374151]'

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${colorClass} ${className}`}
    >
      {status}
    </span>
  )
}

export default StatusBadge
