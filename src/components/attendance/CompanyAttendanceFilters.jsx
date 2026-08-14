function CompanyAttendanceFilters({
  attendanceDate,
  department,
  departmentOptions = [],
  searchQuery,
  statusFilter,
  statusOptions = [],
  onAttendanceDateChange,
  onDepartmentChange,
  onSearchQueryChange,
  onStatusFilterChange,
  onRefresh,
  loading = false,
}) {
  return (
    <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-5 shadow-sm">
      <div className="grid gap-4 xl:grid-cols-5">
        <label className="flex flex-col gap-2 xl:col-span-1">
          <span className="text-[13px] font-extrabold text-[#111827]">Attendance Date</span>
          <input
            type="date"
            value={attendanceDate}
            onChange={(event) => onAttendanceDateChange(event.target.value)}
            className="h-11 rounded-[12px] border border-[#d1d5db] px-4 text-[14px] text-[#111827] outline-none transition focus:border-[#3b82f6] focus:shadow-[0_0_0_4px_rgba(59,130,246,0.12)]"
          />
        </label>

        <label className="flex flex-col gap-2 xl:col-span-1">
          <span className="text-[13px] font-extrabold text-[#111827]">Department</span>
          <select
            value={department}
            onChange={(event) => onDepartmentChange(event.target.value)}
            className="h-11 rounded-[12px] border border-[#d1d5db] bg-white px-4 text-[14px] text-[#111827] outline-none transition focus:border-[#3b82f6] focus:shadow-[0_0_0_4px_rgba(59,130,246,0.12)]"
          >
            <option value="All">All Departments</option>
            {departmentOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 xl:col-span-1">
          <span className="text-[13px] font-extrabold text-[#111827]">Employee Search</span>
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            placeholder="Search employee"
            className="h-11 rounded-[12px] border border-[#d1d5db] px-4 text-[14px] text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#3b82f6] focus:shadow-[0_0_0_4px_rgba(59,130,246,0.12)]"
          />
        </label>

        <label className="flex flex-col gap-2 xl:col-span-1">
          <span className="text-[13px] font-extrabold text-[#111827]">Status</span>
          <select
            value={statusFilter}
            onChange={(event) => onStatusFilterChange(event.target.value)}
            className="h-11 rounded-[12px] border border-[#d1d5db] bg-white px-4 text-[14px] text-[#111827] outline-none transition focus:border-[#3b82f6] focus:shadow-[0_0_0_4px_rgba(59,130,246,0.12)]"
          >
            {(statusOptions.length > 0 ? statusOptions : ['All']).map((option) => (
              <option key={option} value={option}>
                {option === 'All' ? 'All Status' : option}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-end xl:col-span-1">
          <button
            type="button"
            onClick={onRefresh}
            disabled={loading}
            className="flex h-11 w-full items-center justify-center rounded-[12px] bg-[#3b82f6] px-5 text-[14px] font-extrabold text-white transition hover:bg-[#2563eb] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CompanyAttendanceFilters
