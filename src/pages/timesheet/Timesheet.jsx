import { useState, useMemo } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'

function formatDateISO(date) {
  return date.toISOString().slice(0, 10)
}

function addDays(date, days) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

function getWeekDates(centerDate) {
  const d = new Date(centerDate)
  const day = d.getDay() // 0 Sun - 6 Sat
  // Start from Monday (1)
  const monday = addDays(d, (day === 0 ? -6 : 1 - day))
  return Array.from({ length: 7 }).map((_, i) => formatDateISO(addDays(monday, i)))
}

function formatTimeFromHours(hours) {
  const hour = Math.floor(hours)
  const minute = Math.round((hours - hour) * 60)
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

function formatTimeLabel(hours) {
  const hour = Math.floor(hours)
  const minute = Math.round((hours - hour) * 60)
  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${String(minute).padStart(2, '0')} ${period}`
}

function formatDayLabel(dateStr) {
  return new Date(`${dateStr}T00:00:00`).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}

const PROJECT_COLORS = [
  'bg-[#eaf3ff] text-[#2563eb] border-[#93c5fd]',
  'bg-[#e8faf4] text-[#059669] border-[#6ee7b7]',
  'bg-[#fff5e6] text-[#d97706] border-[#fcd34d]',
  'bg-[#f3e8ff] text-[#9333ea] border-[#d8b4fe]',
  'bg-[#ffeef0] text-[#e11d48] border-[#fda4af]',
]

function getColorForProject(project) {
  let hash = 0
  for (let i = 0; i < project.length; i += 1) hash = (hash + project.charCodeAt(i)) % PROJECT_COLORS.length
  return PROJECT_COLORS[hash]
}

const TIMELINE_START = 10
const TIMELINE_HOURS = 10 // 10:00 - 20:00

export default function Timesheet() {
  const [view, setView] = useState('day') // 'day' or 'week'
  const [selectedDate, setSelectedDate] = useState(formatDateISO(new Date()))
  const [entries, setEntries] = useState([])

  const projectTasks = {
    'Website Redesign': ['Design', 'Meeting', 'Review', 'Testing'],
    'Mobile App': ['Development', 'Meeting', 'QA', 'Planning'],
  }

  // form state
  const [formDate, setFormDate] = useState(selectedDate)
  const [formProject, setFormProject] = useState('')
  const [formTask, setFormTask] = useState('')
  const [formHours, setFormHours] = useState('')
  const [formMinutes, setFormMinutes] = useState('0')
  const [formDescription, setFormDescription] = useState('')

  const availableTasks = formProject ? projectTasks[formProject] || [] : []

  const weekDates = useMemo(() => getWeekDates(selectedDate), [selectedDate])

  const handleReset = () => {
    setFormDate(selectedDate)
    setFormProject('')
    setFormTask('')
    setFormHours('')
    setFormMinutes('0')
    setFormDescription('')
  }

  const handleSave = () => {
    const hourValue = parseInt(formHours, 10) || 0
    const minuteValue = parseInt(formMinutes, 10) || 0
    if (!formDate || !formProject || !formTask || (hourValue === 0 && minuteValue === 0)) return
    const duration = hourValue + minuteValue / 60
    const newEntry = {
      id: Date.now(),
      date: formDate,
      project: formProject,
      task: formTask,
      duration,
      description: formDescription,
    }
    setEntries((s) => [...s, newEntry])
    handleReset()
  }

  const entriesForDay = entries.filter((e) => e.date === selectedDate)

  const scheduleEntries = (dayEntries) => {
    let currentStart = 10
    return dayEntries.map((entry) => {
      const start = currentStart
      currentStart += entry.duration
      return {
        ...entry,
        computedStart: start,
      }
    })
  }

  const scheduledDayEntries = useMemo(() => scheduleEntries(entriesForDay), [entriesForDay])

  const entriesByDate = useMemo(() => {
    const map = {}
    weekDates.forEach((d) => (map[d] = []))
    entries.forEach((e) => {
      if (map[e.date]) map[e.date].push(e)
    })
    Object.keys(map).forEach((date) => {
      map[date] = scheduleEntries(map[date])
    })
    return map
  }, [entries, weekDates])

  const moveDate = (amount) => {
    if (view === 'week') {
      setSelectedDate(formatDateISO(addDays(new Date(selectedDate), amount * 7)))
    } else {
      setSelectedDate(formatDateISO(addDays(new Date(selectedDate), amount)))
    }
  }

  const goToToday = () => setSelectedDate(formatDateISO(new Date()))

  const title = view === 'day'
    ? formatDayLabel(selectedDate)
    : `${new Date(`${weekDates[0]}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${new Date(`${weekDates[6]}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-[32px] font-black text-[#111827]">Timesheet</h1>
          <p className="text-[16px] text-[#5f6679] mt-2">Log and manage project hours worked during a selected period.</p>
        </div>









{/* Add Entry Card */}
<div className="rounded-[18px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
  <h2 className="mb-4 text-[18px] font-bold text-[#111827]">Add Entry</h2>
  <div className="border-t border-[#e5e7eb] mb-6" />

  <div className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
    <div>
      <label className="block text-[14px] font-bold text-[#111827] mb-2">Date</label>
      <div className="relative">
        <input
          type="date"
          value={formDate}
          onChange={(e) => setFormDate(e.target.value)}
          className="w-full rounded-[10px] border border-[#e5e7eb] px-3 py-2.5"
        />
      </div>
    </div>

    <div>
      <label className="block text-[14px] font-bold text-[#111827] mb-2">Project</label>
      <select
        value={formProject}
        onChange={(e) => setFormProject(e.target.value)}
        className="w-full rounded-[10px] border border-[#e5e7eb] px-3 py-2.5"
      >
        <option value="">Select Project</option>
        <option value="Website Redesign">Website Redesign</option>
        <option value="Mobile App">Mobile App</option>
      </select>
    </div>

    <div>
      <label className="block text-[14px] font-bold text-[#111827] mb-2">Task</label>
      <select
        value={formTask}
        onChange={(e) => setFormTask(e.target.value)}
        className="w-full rounded-[10px] border border-[#e5e7eb] px-3 py-2.5"
      >
        <option value="">Select Task</option>
        {availableTasks.length > 0 ? (
          availableTasks.map((task) => (
            <option key={task} value={task}>{task}</option>
          ))
        ) : (
          <>
            <option value="Design">Design</option>
            <option value="Development">Development</option>
            <option value="Meeting">Meeting</option>
            <option value="Review">Review</option>
          </>
        )}
      </select>
    </div>

    <div>
      <label className="block text-[14px] font-bold text-[#111827] mb-2">Hours</label>
      <select
        value={formHours}
        onChange={(e) => setFormHours(e.target.value)}
        className="w-full rounded-[10px] border border-[#e5e7eb] px-3 py-2.5"
      >
        <option value="">Select Hours</option>
        {Array.from({ length: 24 }, (_, i) => i).map((h) => (
          <option key={h} value={h}>{h}</option>
        ))}
      </select>
    </div>
  </div>

  <div className="mt-6">
    <label className="block text-[14px] font-bold text-[#111827] mb-2">Description</label>
    <input
      value={formDescription}
      onChange={(e) => setFormDescription(e.target.value)}
      placeholder="Enter Description"
      className="w-full rounded-[10px] border border-[#e5e7eb] px-3 py-2.5"
    />
  </div>

  <div className="mt-6 flex justify-end gap-3">
    <button onClick={handleReset} className="rounded-full bg-[#fee2e2] px-5 py-2 text-[#dc2626] font-semibold">
      Reset
    </button>
    <button onClick={handleSave} className="rounded-full bg-[#d1fae5] px-5 py-2 text-[#059669] font-semibold">
      Save Entry
    </button>
  </div>
</div>








<div className="rounded-[24px] border border-[#eef2f7] bg-white p-4 shadow-[0_20px_80px_rgba(15,23,42,0.08)] sm:p-6">
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => moveDate(-1)}
        className="grid h-9 w-9 place-items-center rounded-full border border-[#d1d5db] bg-white text-lg font-bold text-[#374151] hover:bg-[#f8fafc]"
      >
        ‹
      </button>
      <span className="text-base font-bold text-[#111827]">{title}</span>
      <button
        type="button"
        onClick={() => moveDate(1)}
        className="grid h-9 w-9 place-items-center rounded-full border border-[#d1d5db] bg-white text-lg font-bold text-[#374151] hover:bg-[#f8fafc]"
      >
        ›
      </button>
      <button
        type="button"
        onClick={goToToday}
        className="rounded-full border border-[#d1d5db] bg-white px-3 py-1 text-xs font-semibold text-[#374151] hover:bg-[#f8fafc]"
      >
        Today
      </button>
    </div>

    <div className="flex rounded-full bg-[#e2e8f0] p-1">
      {['day', 'week'].map((option) => (
        <button
          type="button"
          key={option}
          onClick={() => setView(option)}
          className={`rounded-full px-8 py-1.5 text-sm font-semibold capitalize transition ${
            view === option
              ? 'bg-white text-[#111827] shadow-sm'
              : 'text-[#475569] hover:text-[#111827]'
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  </div>

  {view === 'day' && selectedDate && (() => {
    const [year, month, day] = selectedDate.split('-').map(Number);
    const localDate = new Date(year, month - 1, day);
    return (
      <div className="mt-6 flex items-center gap-2">
        <div className="flex flex-col items-center gap-1">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-[#9ca3af]">
            {localDate.toLocaleDateString('en-US', { weekday: 'short' })}
          </span>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-[#ef4444] text-[15px] font-bold text-white">
            {localDate.getDate()}
          </span>
        </div>
      </div>
    );
  })()}

  <div className="mt-6">
    {view === 'day' ? (
      <DayCalendar entries={scheduledDayEntries} />
    ) : (
      <WeekCalendar weekDates={weekDates} entriesByDate={entriesByDate} selectedDate={selectedDate} />
    )}
  </div>
</div>






      </div>
    </DashboardLayout>
  )
}
function DayCalendar({ entries }) {
  const hourHeight = 64
  const rows = Array.from({ length: TIMELINE_HOURS }, (_, i) => TIMELINE_START + i)

  return (
    <div className="grid grid-cols-[64px_minmax(0,1fr)]">
      <div>
        {rows.map((hour, i) => (
          <div key={hour} className="pr-3 text-right" style={{ height: hourHeight }}>
            <p className="text-xs text-[#9ca3af]">{formatTimeLabel(hour)}</p>
            {i === 0 && <p className="text-[10px] text-[#c1c8d3]">GMT+1</p>}
          </div>
        ))}
      </div>
      <div className="relative">
        {rows.map((hour) => (
          <div key={hour} className="border-t border-[#eef2f7]" style={{ height: hourHeight }} />
        ))}
        <div className="absolute inset-0">
          {entries.map((entry) => {
            const top = (entry.computedStart - TIMELINE_START) * hourHeight
            const height = Math.max(28, entry.duration * hourHeight)
            return (
              <div
                key={entry.id}
                style={{ top: `${top}px`, height: `${height}px`, left: '4px', right: '4px' }}
                className={`absolute rounded-xl border-2 bg-white p-3 ${getColorForProject(entry.project)}`}
              >
                <p className="truncate text-[15px] font-semibold text-[#111827]">{entry.project}</p>
                <p className="mt-0.5 truncate text-sm text-[#6b7280]">{entry.task}</p>
                <p className="mt-0.5 text-xs font-medium text-[#059669]">
                  {formatTimeFromHours(entry.computedStart)} - {formatTimeFromHours(entry.computedStart + entry.duration)}
                </p>
              </div>
            )
          })}
          {entries.length === 0 && (
            <div className="grid h-full place-items-center text-sm text-[#9ca3af]">No entries logged for this day.</div>
          )}
        </div>
      </div>
    </div>
  )
}

function WeekCalendar({ weekDates, entriesByDate }) {
  const weekDayLabels = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
  const hourHeight = 64
  const rows = Array.from({ length: TIMELINE_HOURS }, (_, i) => TIMELINE_START + i)
  const todayStr = new Date().toISOString().slice(0, 10)

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[900px] grid grid-cols-[64px_repeat(7,minmax(0,1fr))]">
        {/* Header row */}
        <div />
        {weekDates.map((d, i) => {
          const isToday = d === todayStr
          return (
            <div key={d} className="pb-3 text-center">
              <p className="text-[11px] font-medium uppercase tracking-wide text-[#9ca3af]">
                {weekDayLabels[i]}
              </p>
              {isToday ? (
                <span className="mt-1 inline-grid h-7 w-7 place-items-center rounded-full bg-[#ef4444] text-sm font-semibold text-white">
                  {new Date(`${d}T00:00:00`).getDate()}
                </span>
              ) : (
                <p className="mt-1 text-[15px] font-medium text-[#374151]">
                  {new Date(`${d}T00:00:00`).getDate()}
                </p>
              )}
            </div>
          )
        })}

        {/* Hour rows + grid lines */}
        <div>
          {rows.map((hour, i) => (
            <div key={hour} className="pr-3 text-right" style={{ height: hourHeight }}>
              <p className="text-xs text-[#9ca3af]">{formatTimeLabel(hour)}</p>
              {i === 0 && <p className="text-[10px] text-[#c1c8d3]">GMT+1</p>}
            </div>
          ))}
        </div>

        {weekDates.map((d) => {
          const dayEntries = entriesByDate[d] || []
          return (
            <div key={d} className="relative border-l border-[#eef2f7] first:border-l-0">
              {rows.map((hour) => (
                <div key={hour} className="border-t border-[#eef2f7]" style={{ height: hourHeight }} />
              ))}
              <div className="absolute inset-0">
                {dayEntries.map((entry) => {
                  const top = (entry.computedStart - TIMELINE_START) * hourHeight
                  const height = Math.max(24, entry.duration * hourHeight)
                  return (
                    <div
                      key={entry.id}
                      style={{ top: `${top}px`, height: `${height}px`, left: '3px', right: '3px' }}
                      className={`absolute rounded-lg border-2 bg-white p-2 text-[11px] ${getColorForProject(entry.project)}`}
                    >
                      <p className="truncate font-semibold text-[#111827]">{entry.project}</p>
                      <p className="truncate text-[#6b7280]">{entry.task}</p>
                      <p className="text-[#059669]">{formatTimeFromHours(entry.computedStart)}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
  

