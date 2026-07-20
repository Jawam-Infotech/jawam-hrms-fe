function EmployeeSearch({ value, onChange }) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[#9ca3af]">🔍</span>
      <input
        value={value}
        onChange={onChange}
        placeholder="Search employees..."
        className="h-12 w-full rounded-full border border-[#e5e7eb] bg-[#f8fafc] px-14 text-[14px] text-[#111827] outline-none transition-all duration-200 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#bfdbfe]/50"
      />
    </div>
  )
}

export default EmployeeSearch
