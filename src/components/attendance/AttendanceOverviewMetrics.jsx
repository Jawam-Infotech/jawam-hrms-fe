function MetricCard({ label, value, detail, tone = 'neutral' }) {
  const toneClasses = {
    neutral: 'text-[#111827]',
    success: 'text-[#10b981]',
    warning: 'text-[#f59e0b]',
    danger: 'text-[#ef4444]',
    info: 'text-[#3b82f6]',
  }

  return (
    <div className="rounded-[18px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
      <p className="text-[14px] font-semibold text-[#6b7280]">{label}</p>
      <p className={`mt-4 text-[28px] font-black ${toneClasses[tone] || toneClasses.neutral}`}>
        {value}
      </p>
      {detail && <p className="mt-2 text-[13px] text-[#6b7280]">{detail}</p>}
    </div>
  )
}

function AttendanceOverviewMetrics({ analytics, loading = false }) {
  const metricValue = (value, suffix = '') => {
    if (loading) return '...'
    if (value === null || value === undefined || value === '') return '-'
    return `${value}${suffix}`
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <MetricCard
        label="Average Attendance %"
        value={metricValue(analytics.averageAttendancePercent, '%')}
        tone="success"
      />
      <MetricCard
        label="Highest Attendance Day"
        value={
          loading
            ? '...'
            : analytics.highestAttendanceDay
              ? analytics.highestAttendanceDay.label
              : '-'
        }
        detail={
          loading
            ? ''
            : analytics.highestAttendanceDay
              ? `${analytics.highestAttendanceDay.attendanceRate}% attendance`
              : 'No attendance data'
        }
        tone="info"
      />
      <MetricCard
        label="Lowest Attendance Day"
        value={
          loading
            ? '...'
            : analytics.lowestAttendanceDay
              ? analytics.lowestAttendanceDay.label
              : '-'
        }
        detail={
          loading
            ? ''
            : analytics.lowestAttendanceDay
              ? `${analytics.lowestAttendanceDay.attendanceRate}% attendance`
              : 'No attendance data'
        }
        tone="danger"
      />
      <MetricCard
        label="Total Working Days"
        value={metricValue(analytics.totalWorkingDays)}
        tone="neutral"
      />
      <MetricCard
        label="Average Late Employees / Day"
        value={metricValue(analytics.averageLateEmployeesPerDay)}
        tone="warning"
      />
    </div>
  )
}

export default AttendanceOverviewMetrics
