import { useEffect, useMemo, useRef, useState } from 'react'

const MONTHS = Array.from({ length: 12 }, (_, month) =>
  new Date(2020, month, 1).toLocaleString('en-US', { month: 'short' }),
)

function parseDate(value) {
  if (!value) return null
  const [year, month, day] = String(value).slice(0, 10).split('-').map(Number)
  if (!year || !month || !day) return null
  return new Date(year, month - 1, day)
}

function formatDate(date) {
  if (!date) return ''
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function sameDate(a, b) {
  return a && b && formatDate(a) === formatDate(b)
}

function DatePicker({
  value = '',
  onChange,
  onBlur,
  minDate,
  maxDate,
  disabledDates = [],
  isDateDisabled,
  disabled = false,
  className = '',
  placeholder = 'Select date',
  ariaLabel,
}) {
  const inputDate = parseDate(value)
  const today = new Date()
  const [open, setOpen] = useState(false)
  const [view, setView] = useState('day')
  const [month, setMonth] = useState(inputDate?.getMonth() ?? today.getMonth())
  const [year, setYear] = useState(inputDate?.getFullYear() ?? today.getFullYear())
  const [yearPageStart, setYearPageStart] = useState(
    Math.floor((inputDate?.getFullYear() ?? today.getFullYear()) / 12) * 12,
  )
  const rootRef = useRef(null)

  useEffect(() => {
    const close = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const minimum = parseDate(minDate)
  const maximum = parseDate(maxDate)
  const disabledSet = useMemo(() => new Set(disabledDates.map((date) => formatDate(parseDate(date)))), [disabledDates])
  const isDisabled = (date) => (
    (minimum && date < minimum) ||
    (maximum && date > maximum) ||
    disabledSet.has(formatDate(date)) ||
    isDateDisabled?.(formatDate(date))
  )

  const selectDate = (date) => {
    if (isDisabled(date)) return
    onChange?.(formatDate(date))
    setOpen(false)
  }

  const days = []
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  for (let index = 0; index < firstDay; index += 1) days.push(null)
  for (let day = 1; day <= daysInMonth; day += 1) days.push(new Date(year, month, day))

  const years = Array.from({ length: 12 }, (_, index) => yearPageStart + index)
  const earliestYear = minimum?.getFullYear()
  const latestYear = maximum?.getFullYear()
  const canGoPreviousYears = earliestYear === undefined || yearPageStart - 12 + 11 >= earliestYear
  const canGoNextYears = latestYear === undefined || yearPageStart + 12 <= latestYear
  const yearDisabled = (candidateYear) => {
    const start = new Date(candidateYear, 0, 1)
    const end = new Date(candidateYear, 11, 31)
    return (minimum && end < minimum) || (maximum && start > maximum)
  }
  const monthDisabled = (candidateMonth) => isDisabled(new Date(year, candidateMonth, 15)) && isDisabled(new Date(year, candidateMonth, 1))

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-label={ariaLabel || placeholder}
        disabled={disabled}
        onClick={() => {
          setOpen((current) => !current)
          setView('day')
        }}
        onBlur={onBlur}
        className={`flex min-h-11 w-full items-center justify-between rounded-xl border border-[#d1d5db] bg-white px-3 py-2 text-left text-[14px] text-[#111827] outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/20 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      >
        <span className={value ? '' : 'text-[#9ca3af]'}>{value || placeholder}</span>
        <span aria-hidden="true">📅</span>
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-[min(320px,calc(100vw-2rem))] min-w-[280px] rounded-2xl border border-[#e5e7eb] bg-white p-4 shadow-xl">
          {view === 'day' && (
            <>
              <div className="mb-3 flex items-center justify-between">
                <button type="button" className="rounded-lg px-2 py-1 text-lg hover:bg-[#eff6ff]" onClick={() => { const date = new Date(year, month - 1, 1); setYear(date.getFullYear()); setMonth(date.getMonth()) }} aria-label="Previous month">‹</button>
                <button type="button" className="rounded-lg px-3 py-1 font-bold hover:bg-[#eff6ff]" onClick={() => setView('year')}>{MONTHS[month]} {year}</button>
                <button type="button" className="rounded-lg px-2 py-1 text-lg hover:bg-[#eff6ff]" onClick={() => { const date = new Date(year, month + 1, 1); setYear(date.getFullYear()); setMonth(date.getMonth()) }} aria-label="Next month">›</button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-xs font-semibold text-[#6b7280]">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => <span key={day}>{day}</span>)}
                {days.map((date, index) => date ? (
                  <button key={formatDate(date)} type="button" disabled={isDisabled(date)} onClick={() => selectDate(date)} className={`h-9 rounded-lg text-sm ${sameDate(date, inputDate) ? 'bg-[#2563eb] text-white' : 'hover:bg-[#eff6ff]'} disabled:cursor-not-allowed disabled:text-[#cbd5e1]`}>
                    {date.getDate()}
                  </button>
                ) : <span key={`blank-${index}`} />)}
              </div>
              <div className="mt-3 flex justify-between border-t border-[#f1f5f9] pt-3 text-xs font-semibold">
                <button type="button" className="text-[#2563eb] hover:underline" onClick={() => selectDate(today)}>Today</button>
                <button type="button" className="text-[#6b7280] hover:underline" onClick={() => { onChange?.(''); setOpen(false) }}>Clear</button>
              </div>
            </>
          )}
          {view === 'year' && (
            <>
              <div className="mb-3 flex items-center justify-between font-bold">
                <span>Select Year</span>
                <button type="button" onClick={() => setView('day')} aria-label="Close year picker">×</button>
              </div>
              <div className="mb-3 flex items-center justify-between">
                <button type="button" disabled={!canGoPreviousYears} onClick={() => setYearPageStart((start) => start - 12)} className="rounded-lg px-2 py-1 text-lg hover:bg-[#eff6ff] disabled:cursor-not-allowed disabled:text-[#cbd5e1]" aria-label="Previous years">‹</button>
                <span className="text-sm font-bold text-[#374151]">{yearPageStart} – {yearPageStart + 11}</span>
                <button type="button" disabled={!canGoNextYears} onClick={() => setYearPageStart((start) => start + 12)} className="rounded-lg px-2 py-1 text-lg hover:bg-[#eff6ff] disabled:cursor-not-allowed disabled:text-[#cbd5e1]" aria-label="Next years">›</button>
              </div>
              <div className="grid grid-cols-3 gap-2">{years.map((candidate) => <button key={candidate} type="button" disabled={yearDisabled(candidate)} onClick={() => { setYear(candidate); setView('month') }} className={`rounded-lg px-2 py-3 text-sm ${candidate === year ? 'bg-[#2563eb] text-white' : 'hover:bg-[#eff6ff]'} disabled:text-[#cbd5e1]`}>{candidate}</button>)}</div>
            </>
          )}
          {view === 'month' && (
            <>
              <div className="mb-3 flex items-center justify-between font-bold"><button type="button" onClick={() => setView('year')} aria-label="Back to year picker">‹</button><span>{year}</span><button type="button" onClick={() => setView('day')} aria-label="Close month picker">×</button></div>
              <div className="grid grid-cols-3 gap-2">{MONTHS.map((label, candidate) => <button key={label} type="button" disabled={monthDisabled(candidate)} onClick={() => { setMonth(candidate); setView('day') }} className={`rounded-lg px-2 py-3 text-sm ${candidate === month ? 'bg-[#2563eb] text-white' : 'hover:bg-[#eff6ff]'} disabled:text-[#cbd5e1]`}>{label}</button>)}</div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default DatePicker
