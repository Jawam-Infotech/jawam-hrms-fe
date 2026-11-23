const STATUS_STYLES = {
  'in progress': 'bg-[#dbeafe] text-[#0284c7]',
  completed: 'bg-[#d1fae5] text-[#059669]',
  blocked: 'bg-[#fee2e2] text-[#dc2626]',
  pending: 'bg-[#fef3c7] text-[#d97706]',
  approved: 'bg-[#d1fae5] text-[#059669]',
  rejected: 'bg-[#fee2e2] text-[#dc2626]',
  cancelled: 'bg-[#f3f4f6] text-[#6b7280]',
  todo: 'bg-[#f1f5f9] text-[#475569]',
  'to do': 'bg-[#f1f5f9] text-[#475569]',
  planned: 'bg-[#ede9fe] text-[#7c3aed]',
  active: 'bg-[#dbeafe] text-[#0284c7]',
  on_hold: 'bg-[#fef3c7] text-[#d97706]',
  'on hold': 'bg-[#fef3c7] text-[#d97706]',
  pending_ceo_closure: 'bg-[#ffedd5] text-[#c2410c]',
  'pending closure': 'bg-[#ffedd5] text-[#c2410c]',
  pending_tl_review: 'bg-[#e0e7ff] text-[#4338ca]',
  'under tl review': 'bg-[#e0e7ff] text-[#4338ca]',
  pending_pm_approval: 'bg-[#ede9fe] text-[#6d28d9]',
  'recommended to you': 'bg-[#ede9fe] text-[#6d28d9]',
  'under pm approval': 'bg-[#ede9fe] text-[#6d28d9]',
  'awaiting pm sign-off': 'bg-[#ede9fe] text-[#6d28d9]',
  direct_approval_required: 'bg-[#fed7aa] text-[#c2410c]',
  'direct approval required': 'bg-[#fed7aa] text-[#c2410c]',
  'direct approval pending': 'bg-[#fed7aa] text-[#c2410c]',
  'direct pm/tl approval': 'bg-[#fed7aa] text-[#c2410c]',
  'awaiting pm approval': 'bg-[#fed7aa] text-[#c2410c]',
  pending_ceo_approval: 'bg-[#fce7f3] text-[#be185d]',
  'direct ceo approval': 'bg-[#fce7f3] text-[#be185d]',
  'awaiting ceo approval': 'bg-[#fce7f3] text-[#be185d]',
  quality_risk: 'bg-[#ffe4e6] text-[#e11d48]',
  'quality risk': 'bg-[#ffe4e6] text-[#e11d48]',
  archived: 'bg-[#f1f5f9] text-[#64748b]',
}

const DISPLAY_LABELS = {
  pending_tl_review: 'Under TL Review',
  pending_pm_approval: 'Awaiting PM Approval',
  direct_approval_required: 'Direct PM Approval',
  'direct approval required': 'Direct PM Approval',
  'direct approval pending': 'Direct PM Approval',
  'awaiting pm approval': 'Awaiting PM Approval',
  'awaiting pm sign-off': 'Awaiting PM Approval',
  'direct pm approval': 'Direct PM Approval',
  'direct pm/tl approval': 'Direct PM Approval',
  pending_ceo_approval: 'Awaiting CEO Approval',
  pending_ceo_closure: 'Pending CEO Closure',
  on_hold: 'On Hold',
  quality_risk: 'Quality Risk',
  archived: 'Archived',
  rejected: 'Rejected',
}

function StatusBadge({ status, isSolo = false, className = '' }) {
  if (!status) return null

  const normalized = String(status).trim().toLowerCase()
  const colorClass = STATUS_STYLES[normalized] || 'bg-[#f3f4f6] text-[#374151]'
  let label = DISPLAY_LABELS[normalized] || status

  if (
    normalized === 'direct_approval_required' ||
    normalized === 'direct approval required' ||
    normalized === 'direct approval pending' ||
    normalized === 'direct pm/tl approval' ||
    normalized === 'direct pm approval'
  ) {
    label = 'Direct PM Approval'
  } else if (
    normalized === 'awaiting pm approval' ||
    normalized === 'pending_pm_approval' ||
    normalized === 'awaiting pm sign-off'
  ) {
    label = isSolo ? 'Direct PM Approval' : 'Awaiting PM Approval'
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${colorClass} ${className}`}
    >
      {label}
    </span>
  )
}

export default StatusBadge
