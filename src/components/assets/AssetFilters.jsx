import { useEffect, useRef, useState } from 'react'

function AssetFilters({
  filters = {},
  onApply,
  onClear,
  fields = [],
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [draftFilters, setDraftFilters] = useState(filters)
  const containerRef = useRef(null)


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener(
      'mousedown',
      handleClickOutside,
    )

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside,
      )
    }
  }, [])

  const handleChange = (key, value) => {
    setDraftFilters((current) => ({
      ...current,
      [key]: value,
    }))
  }

  const handleApply = () => {
  const appliedFilters = Object.fromEntries(
    Object.entries(draftFilters).filter(
      ([, value]) =>
        value !== '' &&
        value !== null &&
        value !== undefined,
    ),
  )

  onApply?.(appliedFilters)
  setIsOpen(false)
}

  const handleClear = () => {
    const clearedFilters = {}

    fields.forEach((field) => {
      clearedFilters[field.key] = ''
    })

    setDraftFilters(clearedFilters)
    onClear?.()
    setIsOpen(false)
  }

  const activeFilterCount = Object.values(filters).filter(
    (value) =>
      value !== '' &&
      value !== null &&
      value !== undefined,
  ).length

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="inline-flex items-center gap-2 rounded-xl border border-[#e5e7eb] bg-white px-4 py-2.5 text-[13px] font-bold text-[#374151] transition hover:bg-[#f9fafb]"
      >
        <span>Filter</span>

        {activeFilterCount > 0 && (
          <span className="inline-flex min-w-[20px] items-center justify-center rounded-full bg-[#2563eb] px-1.5 py-0.5 text-[11px] font-bold text-white">
            {activeFilterCount}
          </span>
        )}

        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-[340px] rounded-2xl border border-[#e5e7eb] bg-white p-5 shadow-xl">
          <div className="mb-5">
            <h3 className="text-[15px] font-bold text-[#111827]">
              Filters
            </h3>
          </div>

          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.key}>
                <label className="mb-1.5 block text-[12px] font-bold text-[#374151]">
                  {field.label}
                </label>

                {field.type === 'select' && (
                  <select
                    value={
                      draftFilters[field.key] || ''
                    }
                    onChange={(event) =>
                      handleChange(
                        field.key,
                        event.target.value,
                      )
                    }
                    className="w-full rounded-xl border border-[#e5e7eb] bg-white px-3 py-2.5 text-[13px] font-medium text-[#374151] outline-none focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10"
                  >
                    <option value="">
                      {field.placeholder ||
                        `All ${field.label}`}
                    </option>

                    {(field.options || []).map(
                      (option) => (
                        <option
                          key={option.value}
                          value={option.value}
                        >
                          {option.label}
                        </option>
                      ),
                    )}
                  </select>
                )}

                {field.type === 'date-range' && (
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={
                        draftFilters[
                          field.fromKey
                        ] || ''
                      }
                      onChange={(event) =>
                        handleChange(
                          field.fromKey,
                          event.target.value,
                        )
                      }
                      className="w-full rounded-xl border border-[#e5e7eb] px-3 py-2.5 text-[12px] font-medium text-[#374151] outline-none focus:border-[#2563eb]"
                    />

                    <input
                      type="date"
                      value={
                        draftFilters[
                          field.toKey
                        ] || ''
                      }
                      onChange={(event) =>
                        handleChange(
                          field.toKey,
                          event.target.value,
                        )
                      }
                      className="w-full rounded-xl border border-[#e5e7eb] px-3 py-2.5 text-[12px] font-medium text-[#374151] outline-none focus:border-[#2563eb]"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-5 border-t border-[#e5e7eb] pt-4">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleClear}
                className="rounded-xl px-3 py-2 text-[13px] font-bold text-[#6b7280] transition hover:bg-[#f9fafb] hover:text-[#374151]"
              >
                Clear all
              </button>

              <button
                type="button"
                onClick={handleApply}
                className="rounded-xl bg-[#2563eb] px-4 py-2 text-[13px] font-bold text-white transition hover:bg-[#1d4ed8]"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AssetFilters