function DashboardModeToggle({ mode, onModeChange, options = [] }) {
  if (!options.length) return null

  return (
    <div className="inline-flex rounded-full border border-[#e5e7eb] bg-white p-1 shadow-sm">
      {options.map((option) => {
        const isActive = mode === option.value

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onModeChange(option.value)}
            className={`rounded-full px-4 py-2 text-[14px] font-semibold transition-all ${
              isActive ? 'bg-[#3b82f6] text-white' : 'text-[#6b7280] hover:bg-[#f3f4f6]'
            }`}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

export default DashboardModeToggle
