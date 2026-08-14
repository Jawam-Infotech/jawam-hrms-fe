function SummaryCard({ label, value, valueClassName = 'text-[#111827]' }) {
  return (
    <div className="rounded-[20px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
      <p className="text-[14px] font-semibold text-[#6b7280]">{label}</p>
      <p className={`mt-4 text-[30px] font-black ${valueClassName}`}>{value}</p>
    </div>
  )
}

function CompanyAttendanceSummaryCards({
  summary,
  loading = false,
  scope = 'company',
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        label={scope === 'team' ? 'Total Members' : 'Total Employees'}
        value={
          loading
            ? '...'
            : scope === 'team'
            ? summary.totalMembers
            : summary.totalEmployees
        }
      />

      <SummaryCard
        label="Present Today"
        value={loading ? '...' : summary.presentToday}
        valueClassName="text-[#10b981]"
      />

      <SummaryCard
        label="Late Today"
        value={
          loading
            ? '...'
            : scope === 'team'
            ? summary.lateArrival
            : summary.late
        }
        valueClassName="text-[#f59e0b]"
      />

      <SummaryCard
        label="Absent Today"
        value={
          loading
            ? '...'
            : scope === 'team'
            ? summary.absentToday
            : summary.absent
        }
        valueClassName="text-[#ef4444]"
      />
    </div>
  )
}

export default CompanyAttendanceSummaryCards