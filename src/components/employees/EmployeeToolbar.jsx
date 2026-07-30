import Button from '../ui/Button.jsx'

function EmployeeToolbar({
  sortOrder,
  onSortToggle,
  roleFilter,
  onRoleChange,
  departmentFilter,
  onDepartmentChange,
  onResetFilters,
}) {
  return (
    <div className="flex items-center gap-3">
      <select
        value={roleFilter}
        onChange={(e) => onRoleChange(e.target.value)}
        className="rounded-full border border-[#d1d5db] bg-white px-4 py-3 text-[14px] font-medium text-[#111827] outline-none focus:border-[#3b82f6]"
      >
        <option value="all">All Roles</option>
        <option value="EMPLOYEE">Employee</option>
        <option value="TL">Team Lead</option>
        <option value="HR">HR</option>
        <option value="CEO">CEO</option>
      </select>

      <select
        value={departmentFilter}
        onChange={(e) => onDepartmentChange(e.target.value)}
        className="rounded-full border border-[#d1d5db] bg-white px-4 py-3 text-[14px] font-medium text-[#111827] outline-none focus:border-[#3b82f6]"
      >
        <option value="all">All Departments</option>
        <option value="Development">Development</option>
        <option value="HR">HR</option>
        <option value="Design">Design</option>
        <option value="Marketing">Marketing</option>
        <option value="Finance">Finance</option>
      </select>

      <Button
        type="button"
        onClick={onSortToggle}
        className="rounded-full bg-[#3b82f6] px-5 py-3 text-[14px] font-extrabold text-white transition-all duration-200 hover:bg-[#2563eb]"
      >
        Sort by ID {sortOrder === 'asc' ? '↑' : '↓'}
      </Button>

      <Button
        type="button"
        onClick={onResetFilters}
        className="rounded-full border border-[#d1d5db] bg-white px-5 py-3 text-[14px] font-semibold text-[#111827] transition-all duration-200 hover:bg-[#f8fafc]"
      >
        Reset
      </Button>
    </div>
  )
}

export default EmployeeToolbar