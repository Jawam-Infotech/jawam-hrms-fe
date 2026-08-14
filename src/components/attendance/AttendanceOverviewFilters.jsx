function AttendanceOverviewFilters({
  scope = 'company',
  startDate,
  endDate,
  department,
  availableDepartments = [],
  showDepartmentFilter = false,
  onStartDateChange,
  onEndDateChange,
  onDepartmentChange,
  onRefresh,
  loading = false,
}) {
  return (
    <div className="rounded-[30px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="text-[20px] font-black text-[#111827]">Attendance Overview</h2>
          <p className="text-[14px] text-[#6b7280]">
            {scope === 'team'
              ? 'Review your team attendance across the selected date range.'
              : 'Review company attendance across the selected date range.'}
          </p>
        </div>

        <div className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-2 text-[12px] font-semibold uppercase tracking-wider text-[#6b7280]">
            Start Date
            <input
              type="date"
              value={startDate}
              onChange={(event) => onStartDateChange(event.target.value)}
              className="h-11 rounded-full border border-[#d1d5db] bg-white px-4 text-[14px] font-semibold text-[#111827] outline-none transition focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20"
            />
          </label>

          <label className="flex flex-col gap-2 text-[12px] font-semibold uppercase tracking-wider text-[#6b7280]">
            End Date
            <input
              type="date"
              value={endDate}
              onChange={(event) => onEndDateChange(event.target.value)}
              className="h-11 rounded-full border border-[#d1d5db] bg-white px-4 text-[14px] font-semibold text-[#111827] outline-none transition focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20"
            />
          </label>

          {showDepartmentFilter && availableDepartments.length > 0 && (
            <label className="flex flex-col gap-2 text-[12px] font-semibold uppercase tracking-wider text-[#6b7280]">
              Department
              <select
                value={department}
                onChange={(event) => onDepartmentChange(event.target.value)}
                className="h-11 rounded-full border border-[#d1d5db] bg-white px-4 text-[14px] font-semibold text-[#111827] outline-none transition focus:border-[#3b82f6] focus:ring-2 focus:ring-[#3b82f6]/20"
              >
                <option value="All Departments">All Departments</option>
                {availableDepartments.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          )}

          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="h-11 rounded-full bg-[#3b82f6] px-5 text-[14px] font-extrabold text-white transition-all hover:bg-[#2563eb] disabled:cursor-wait disabled:opacity-70"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AttendanceOverviewFilters
