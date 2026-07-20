import Button from '../ui/Button.jsx'

function EmployeeToolbar({ user, sortOrder, onSortToggle }) {
  return (
    <div className="flex items-center gap-3">
      <div className="rounded-full border border-[#e5e7eb] bg-white px-4 py-3 text-[14px] font-semibold text-[#111827]">
        Logged in as {user.name || 'User'}
      </div>
      <Button
        type="button"
        onClick={onSortToggle}
        className="rounded-full bg-[#3b82f6] px-5 py-3 text-[14px] font-extrabold text-white transition-all duration-200 hover:bg-[#2563eb]"
      >
        Sort by ID {sortOrder === 'asc' ? '↑' : '↓'}
      </Button>
      <Button className="inline-flex items-center gap-2 rounded-full border border-[#e5e7eb] bg-white px-5 py-3 text-[14px] font-extrabold text-[#111827] transition-all duration-200 hover:border-[#cbd5e1] hover:bg-[#f8fafc]">
        <span>⚙️</span>
        Filter & Sort
      </Button>
    </div>
  )
}

export default EmployeeToolbar
