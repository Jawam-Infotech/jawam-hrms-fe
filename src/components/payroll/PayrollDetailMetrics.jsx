function PayrollDetailMetrics({
  detailFields,
  canApplyCorrection,
  correctionReady,
  manualDraftInitialized,
  manualDraft,
  earnings,
  deductions,
  adjustments,
  canViewComponentDetails,
  userRole,
  payroll,
  onOpenManualEditor,
  onViewDetails,
}) {
  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {detailFields.map(([label, value]) => {
        const manualType = label === 'Other Earnings'
          ? 'earnings'
          : label === 'Other Deductions'
            ? 'deductions'
            : label === 'Adjustment'
              ? 'adjustments'
              : null

        if (manualType && canApplyCorrection && !correctionReady) {
          const serverEntries = manualType === 'earnings'
            ? payroll?.current_version?.earnings?.filter((item) => item.earning_type === 'OTHER')
            : manualType === 'deductions'
              ? payroll?.current_version?.deductions?.filter((item) => item.deduction_type === 'OTHER')
              : adjustments
          const count = (manualDraftInitialized ? manualDraft[manualType] : serverEntries || []).length
          return <ManualSummaryCard key={label} label={label} value={count ? `${count} ${count === 1 ? 'entry' : 'entries'}` : '0'} canEdit={userRole === 'HR'} onOpen={() => onOpenManualEditor(manualType)} onViewDetails={canViewComponentDetails ? () => onViewDetails({ label, records: serverEntries || [] }) : undefined} />
        }

        const records = manualType === 'earnings'
          ? earnings.filter((item) => item.earning_type === 'OTHER')
          : manualType === 'deductions'
            ? deductions.filter((item) => item.deduction_type === 'OTHER')
            : manualType === 'adjustments'
              ? adjustments
              : []
        return <Detail key={label} label={label} value={value} onViewDetails={manualType && canViewComponentDetails ? () => onViewDetails({ label, records }) : undefined} />
      })}
    </div>
  )
}

export function Detail({ label, value, onViewDetails }) {
  const displayValue = Array.isArray(value)
    ? (value.length ? JSON.stringify(value) : '—')
    : value ?? '—'

  return <div className="rounded-[14px] bg-[#f9fafb] p-4"><p className="text-[12px] font-semibold text-[#6b7280]">{label}</p><p className="mt-1 break-words text-[14px] font-bold text-[#111827]">{String(displayValue)}</p>{onViewDetails && <button type="button" onClick={onViewDetails} className="mt-2 text-[11px] font-semibold text-[#2563eb] hover:text-[#1d4ed8]">View Details</button>}</div>
}

function ManualSummaryCard({ label, value, canEdit, onOpen, onViewDetails }) {
  return (
    <div className="rounded-[14px] bg-[#f9fafb] p-4 text-left">
      <p className="text-[12px] font-semibold text-[#6b7280]">{label}</p>
      <p className="mt-1 text-[14px] font-bold text-[#111827]">{value}</p>
      <div className="mt-2 flex gap-3">{canEdit && <button type="button" onClick={onOpen} className="text-[11px] font-semibold text-[#2563eb]">Edit entries</button>}{onViewDetails && <button type="button" onClick={onViewDetails} className="text-[11px] font-semibold text-[#2563eb]">View Details</button>}</div>
    </div>
  )
}

export default PayrollDetailMetrics
