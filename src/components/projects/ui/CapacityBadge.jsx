
function getCapacityDetails(activeTasks = 0, projectCount = 1) {
  if (activeTasks >= 6 || projectCount >= 3) {
    return {
      tier: 'overloaded',
      label: 'Overloaded',
      detail: `${activeTasks} active tasks across ${projectCount} projects`,
      pillColor: 'bg-[#fee2e2] text-[#dc2626] border-[#fca5a5]',
      dotColor: 'bg-[#ef4444]',
    }
  }

  if (activeTasks >= 4 || projectCount >= 2) {
    return {
      tier: 'moderate',
      label: 'Moderate',
      detail: `${activeTasks} active tasks across ${projectCount} projects`,
      pillColor: 'bg-[#fef3c7] text-[#b45309] border-[#fde68a]',
      dotColor: 'bg-[#f59e0b]',
    }
  }

  return {
    tier: 'available',
    label: 'Available',
    detail: `${activeTasks} active task${activeTasks === 1 ? '' : 's'}`,
    pillColor: 'bg-[#d1fae5] text-[#059669] border-[#a7f3d0]',
    dotColor: 'bg-[#10b981]',
  }
}

function CapacityBadge({ activeTasks = 0, projectCount = 1, showDetail = false, className = '' }) {
  const info = getCapacityDetails(activeTasks, projectCount)

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${info.pillColor} ${className}`}
      title={info.detail}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${info.dotColor}`} />
      <span>{showDetail ? `${info.label}: ${info.detail}` : info.label}</span>
    </span>
  )
}

export default CapacityBadge
