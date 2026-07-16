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

  const getMinHeightForDay = (dayEntries) => {
    if (dayEntries.length === 0) return 200
    const maxEnd = Math.max(...dayEntries.map((e) => e.computedStart + e.duration))
    const hourHeight = 32
    const totalHeight = (maxEnd - 10) * hourHeight + 32
    return Math.max(200, totalHeight)
  }

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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
            <div>
              <label className="block text-[13px] font-semibold text-[#6b7280] mb-2">Date</label>
              <input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} className="w-full rounded-[10px] border border-[#e5e7eb] px-3 py-2" />
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-[#6b7280] mb-2">Project</label>
              <select value={formProject} onChange={(e) => setFormProject(e.target.value)} className="w-full rounded-[10px] border border-[#e5e7eb] px-3 py-2">
                <option value="">Select Project</option>
                <option value="Website Redesign">Website Redesign</option>
                <option value="Mobile App">Mobile App</option>
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-semibold text-[#6b7280] mb-2">Task</label>
              <select value={formTask} onChange={(e) => setFormTask(e.target.value)} className="w-full rounded-[10px] border border-[#e5e7eb] px-3 py-2">
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
            <div className="md:col-span-2 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-semibold text-[#6b7280] mb-2">Hours</label>
                <input type="number" min="0" value={formHours} onChange={(e) => setFormHours(e.target.value)} placeholder="0" className="w-full rounded-[10px] border border-[#e5e7eb] px-3 py-2" />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[#6b7280] mb-2">Minutes</label>
                <input type="number" min="0" max="59" value={formMinutes} onChange={(e) => setFormMinutes(e.target.value)} placeholder="0" className="w-full rounded-[10px] border border-[#e5e7eb] px-3 py-2" />
              </div>
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-[13px] font-semibold text-[#6b7280] mb-2">Description</label>
            <input value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="Enter Description" className="w-full rounded-[10px] border border-[#e5e7eb] px-3 py-2" />
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <button onClick={handleReset} className="rounded-full bg-[#fee2e2] px-4 py-2 text-[#dc2626] font-semibold">Reset</button>
            <button onClick={handleSave} className="rounded-full bg-[#10b981] px-4 py-2 text-white font-semibold">Save Entry</button>
          </div>
        </div>

        {/* Calendar Area */}
        <div className="rounded-[24px] border border-[#eef2f7] bg-white p-4 shadow-[0_20px_80px_rgba(15,23,42,0.08)] sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => moveDate(-1)} className="grid h-9 w-9 place-items-center rounded-lg bg-[#f8fafc] text-lg font-semibold text-[#374151] hover:bg-[#eef2f7]" aria-label="Previous period">‹</button>
              <button type="button" onClick={goToToday} className="rounded-lg bg-[#f8fafc] px-4 py-2 text-sm font-semibold text-[#374151] hover:bg-[#eef2f7]">Today</button>
              <button type="button" onClick={() => moveDate(1)} className="grid h-9 w-9 place-items-center rounded-lg bg-[#f8fafc] text-lg font-semibold text-[#374151] hover:bg-[#eef2f7]" aria-label="Next period">›</button>
              <span className="ml-2 text-sm font-semibold text-[#111827]">{title}</span>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex rounded-xl bg-[#f8fafc] p-1">
                {['day', 'week'].map((option) => (
                  <button
                    type="button"
                    key={option}
                    onClick={() => setView(option)}
                    className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize transition ${view === option ? 'bg-[#10b981] text-white shadow-sm' : 'text-[#6b7280] hover:text-[#111827]'}`}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {view === 'day' && (
                <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="rounded-lg border border-[#e5e7eb] bg-[#f8fafc] px-3 py-2 text-sm text-[#374151]" />
              )}
            </div>
          </div>

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
    <div className="overflow-hidden rounded-xl border border-[#e5e7eb]">
      <div className="grid grid-cols-[76px_minmax(0,1fr)]">
        <div className="border-r border-[#eef2f7] bg-[#f8fafc]" />
        <div className="border-b border-[#e5e7eb] bg-[#f8fafc] px-5 py-3 text-sm font-semibold text-[#111827]">Schedule</div>
      </div>
      <div className="relative">
        <div className="grid grid-cols-[76px_minmax(0,1fr)]">
          <div>
            {rows.map((hour) => (
              <div key={hour} className="border-r border-t border-[#eef2f7] px-3 pt-2 text-xs text-[#6b7280]" style={{ height: hourHeight }}>
                {formatTimeLabel(hour)}
              </div>
            ))}
          </div>
          <div className="relative">
            {rows.map((hour) => (
              <div key={hour} className="border-t border-[#eef2f7]" style={{ height: hourHeight }} />
            ))}
            <div className="absolute inset-0 p-1">
              {entries.map((entry) => {
                const top = (entry.computedStart - TIMELINE_START) * hourHeight
                const height = Math.max(28, entry.duration * hourHeight)
                return (
                  <div
                    key={entry.id}
                    style={{ top: `${top}px`, height: `${height}px`, left: '8px', right: '8px' }}
                    className={`absolute rounded-lg border p-2 text-xs ${getColorForProject(entry.project)}`}
                  >
                    <p className="truncate font-semibold">{entry.project}</p>
                    <p className="mt-0.5 opacity-80">{entry.task} · {entry.duration.toFixed(2)} hrs</p>
                    <p className="mt-0.5 opacity-70">{formatTimeFromHours(entry.computedStart)}</p>
                  </div>
                )
              })}
              {entries.length === 0 && (
                <div className="grid h-full place-items-center text-sm text-[#9ca3af]">No entries logged for this day.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function WeekCalendar({ weekDates, entriesByDate, selectedDate }) {
  const weekDayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const hourHeight = 32
  const maxHeight = Math.max(200, ...weekDates.map((d) => {
    const dayEntries = entriesByDate[d] || []
    if (dayEntries.length === 0) return 200
    const maxEnd = Math.max(...dayEntries.map((e) => e.computedStart + e.duration))
    return Math.max(200, (maxEnd - TIMELINE_START) * hourHeight + 32)
  }))

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[900px] overflow-hidden rounded-xl border border-[#e5e7eb]">
        <div className="grid grid-cols-7 border-b border-[#e5e7eb]">
          {weekDates.map((d, i) => (
            <div key={d} className={`border-l border-[#e5e7eb] px-3 py-2 first:border-l-0 ${d === selectedDate ? 'bg-[#eff6ff]' : 'bg-[#f8fafc]'}`}>
              <p className="text-[11px] font-semibold uppercase text-[#6b7280]">{weekDayLabels[i]}</p>
              <p className="text-xl font-semibold text-[#111827]">{new Date(`${d}T00:00:00`).getDate()}</p>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7" style={{ minHeight: maxHeight }}>
          {weekDates.map((d) => {
            const dayEntries = entriesByDate[d] || []
            return (
              <div key={d} className={`relative border-l border-[#e5e7eb] p-1 first:border-l-0 ${d === selectedDate ? 'bg-[#eff6ff]/40' : ''}`}>
                {dayEntries.map((entry) => {
                  const top = (entry.computedStart - TIMELINE_START) * hourHeight
                  const height = Math.max(20, entry.duration * hourHeight)
                  return (
                    <div
                      key={entry.id}
                      style={{ top: `${top}px`, height: `${height}px`, left: '4px', right: '4px' }}
                      className={`absolute rounded-lg border p-1.5 text-[11px] ${getColorForProject(entry.project)}`}
                    >
                      <p className="truncate font-semibold">{entry.project}</p>
                      <p className="truncate opacity-80">{entry.task} · {entry.duration.toFixed(2)}h</p>
                      <p className="opacity-70">{formatTimeFromHours(entry.computedStart)}</p>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}