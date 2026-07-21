import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LearningLayout from '../../../layouts/LearningLayout'

const interviews = [
  { id: 1, date: '2026-06-21', time: '09:00', duration: 45, title: 'UI/UX Developer Interview', type: 'HR Round', color: 'bg-[#eaf3ff] text-[#2563eb] border-[#93c5fd]' },
  { id: 2, date: '2026-06-22', time: '10:30', duration: 60, title: 'React JS Mock Interview', type: 'Technical Round', color: 'bg-[#fff5e6] text-[#d97706] border-[#fcd34d]' },
  { id: 3, date: '2026-06-24', time: '14:00', duration: 45, title: 'UI/UX Portfolio Interview', type: 'Practice Interview', color: 'bg-[#e8faf4] text-[#059669] border-[#6ee7b7]' },
  { id: 4, date: '2026-06-25', time: '11:00', duration: 30, title: 'Frontend Skills Assessment', type: 'Technical Round', color: 'bg-[#f3e8ff] text-[#9333ea] border-[#d8b4fe]' },
  { id: 5, date: '2026-06-26', time: '15:30', duration: 45, title: 'Communication Skills Interview', type: 'HR Round', color: 'bg-[#ffeef0] text-[#e11d48] border-[#fda4af]' },
  { id: 6, date: '2026-06-27', time: '09:30', duration: 60, title: 'Advanced Principles Review', type: 'Practice Interview', color: 'bg-[#eaf3ff] text-[#2563eb] border-[#93c5fd]' },
]

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const timeSlots = Array.from({ length: 11 }, (_, index) => index + 7)

function formatKey(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function startOfWeek(date) {
  const start = new Date(date)
  start.setDate(date.getDate() - date.getDay())
  start.setHours(0, 0, 0, 0)
  return start
}

function addDays(date, days) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function formatTime(time) {
  const [hour, minute] = time.split(':').map(Number)
  const period = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${String(minute).padStart(2, '0')} ${period}`
}

function EventCard({ event, compact = false, onClick }) {
  return <button type="button" onClick={onClick} className={`w-full rounded-lg border p-2 text-left text-xs transition hover:brightness-95 ${event.color} ${compact ? 'mb-1' : ''}`}><p className="truncate font-semibold">{event.title}</p><p className="mt-0.5 opacity-80">{formatTime(event.time)} · {event.type}</p></button>
}

export default function LearningCalendar() {
  const navigate = useNavigate()
  const [view, setView] = useState('week')
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 5, 25))
  const [search, setSearch] = useState('')

  const filteredInterviews = useMemo(() => interviews.filter((interview) => interview.title.toLowerCase().includes(search.toLowerCase()) || interview.type.toLowerCase().includes(search.toLowerCase())), [search])
  const activeWeek = useMemo(() => Array.from({ length: 7 }, (_, index) => addDays(startOfWeek(selectedDate), index)), [selectedDate])
  const dayInterviews = filteredInterviews.filter((interview) => interview.date === formatKey(selectedDate))
  const monthDays = useMemo(() => {
    const monthStart = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
    return Array.from({ length: 42 }, (_, index) => addDays(startOfWeek(monthStart), index))
  }, [selectedDate])
  const title = view === 'day'
    ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
    : view === 'week'
      ? `${activeWeek[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${activeWeek[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
      : selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const moveDate = (amount) => setSelectedDate((date) => {
    const next = new Date(date)
    if (view === 'month') next.setMonth(next.getMonth() + amount)
    else next.setDate(next.getDate() + (view === 'week' ? amount * 7 : amount))
    return next
  })

  return (
    <LearningLayout>
      <div className="mx-auto max-w-[1400px] space-y-6">
        <header><h1 className="text-[28px] font-black text-[#111827]">Calendar</h1><p className="mt-1 text-sm text-[#6b7280]">Track your upcoming interviews and learning sessions.</p></header>

        <section className="rounded-[24px] border border-[#eef2f7] bg-white p-4 shadow-[0_20px_80px_rgba(15,23,42,0.08)] sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div className="flex items-center gap-2"><button type="button" onClick={() => moveDate(-1)} className="grid h-9 w-9 place-items-center rounded-lg bg-[#f8fafc] text-lg font-semibold text-[#374151] hover:bg-[#eef2f7]" aria-label="Previous period">‹</button><button type="button" onClick={() => setSelectedDate(new Date(2026, 5, 25))} className="rounded-lg bg-[#f8fafc] px-4 py-2 text-sm font-semibold text-[#374151] hover:bg-[#eef2f7]">Today</button><button type="button" onClick={() => moveDate(1)} className="grid h-9 w-9 place-items-center rounded-lg bg-[#f8fafc] text-lg font-semibold text-[#374151] hover:bg-[#eef2f7]" aria-label="Next period">›</button><span className="ml-2 text-sm font-semibold text-[#111827]">{title}</span></div><div className="flex flex-wrap items-center gap-4"><div className="flex rounded-xl bg-[#f8fafc] p-1">{['day', 'week', 'month'].map((option) => <button type="button" key={option} onClick={() => setView(option)} className={`rounded-lg px-4 py-2 text-sm font-semibold capitalize transition ${view === option ? 'bg-[#ef4444] text-white shadow-sm' : 'text-[#6b7280] hover:text-[#111827]'}`}>{option}</button>)}</div><label className="flex items-center gap-2 rounded-lg bg-[#f8fafc] px-3 py-2 text-sm text-[#6b7280]"><span aria-hidden="true">⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search interviews" className="w-40 bg-transparent outline-none placeholder:text-[#9ca3af]" /></label></div></div>

          <div className="mt-6">{view === 'day' && <DayView date={selectedDate} events={dayInterviews} onStart={() => navigate('/learning/ai-interviews/session')} />}{view === 'week' && <WeekView days={activeWeek} events={filteredInterviews} selectedDate={selectedDate} onStart={() => navigate('/learning/ai-interviews/session')} />}{view === 'month' && <MonthView days={monthDays} events={filteredInterviews} selectedDate={selectedDate} onSelectDate={(date) => { setSelectedDate(date); setView('day') }} />}</div>
        </section>
      </div>
    </LearningLayout>
  )
}

function DayView({ date, events, onStart }) {
  return <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]"><div className="overflow-hidden rounded-xl border border-[#e5e7eb]"><div className="border-b border-[#e5e7eb] bg-[#f8fafc] px-5 py-3 text-sm font-semibold text-[#111827]">{date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div><div className="divide-y divide-[#eef2f7]">{timeSlots.map((hour) => <div key={hour} className="grid min-h-20 grid-cols-[76px_minmax(0,1fr)]"><div className="border-r border-[#eef2f7] px-3 pt-3 text-xs text-[#6b7280]">{formatTime(`${String(hour).padStart(2, '0')}:00`)}</div><div className="p-2">{events.filter((event) => Number(event.time.slice(0, 2)) === hour).map((event) => <EventCard key={event.id} event={event} onClick={onStart} />)}</div></div>)}</div></div><UpcomingList events={events} onStart={onStart} /></div>
}

function WeekView({ days, events, selectedDate, onStart }) {
  return <div className="overflow-x-auto"><div className="min-w-[900px]"><div className="grid grid-cols-[56px_repeat(7,minmax(110px,1fr))] border border-[#e5e7eb]"><div className="bg-[#f8fafc]" />{days.map((day) => <div key={formatKey(day)} className={`border-l border-[#e5e7eb] px-3 py-2 ${formatKey(day) === formatKey(selectedDate) ? 'bg-[#eff6ff]' : 'bg-[#f8fafc]'}`}><p className="text-[11px] font-semibold uppercase text-[#6b7280]">{weekDays[day.getDay()]}</p><p className="text-xl font-semibold text-[#111827]">{day.getDate()}</p></div>)}{timeSlots.map((hour) => <div key={hour} className="contents"><div className="border-t border-[#e5e7eb] px-2 pt-3 text-right text-xs text-[#6b7280]">{formatTime(`${String(hour).padStart(2, '0')}:00`)}</div>{days.map((day) => <div key={`${formatKey(day)}-${hour}`} className={`min-h-20 border-l border-t border-[#e5e7eb] p-1 ${formatKey(day) === formatKey(selectedDate) ? 'bg-[#eff6ff]/60' : ''}`}>{events.filter((event) => event.date === formatKey(day) && Number(event.time.slice(0, 2)) === hour).map((event) => <EventCard key={event.id} event={event} compact onClick={onStart} />)}</div>)}</div>)}</div><div className="mt-4"><UpcomingList events={events.filter((event) => days.some((day) => event.date === formatKey(day)))} onStart={onStart} horizontal /></div></div></div>
}

function MonthView({ days, events, selectedDate, onSelectDate }) {
  return <div className="overflow-x-auto"><div className="min-w-[760px]"><div className="grid grid-cols-7 border-l border-t border-[#e5e7eb]">{weekDays.map((day) => <div key={day} className="border-b border-r border-[#e5e7eb] bg-[#f8fafc] px-3 py-2 text-xs font-semibold uppercase text-[#6b7280]">{day}</div>)}{days.map((day) => { const key = formatKey(day); const dayEvents = events.filter((event) => event.date === key); const isCurrentMonth = day.getMonth() === selectedDate.getMonth(); return <button type="button" key={key} onClick={() => onSelectDate(day)} className={`min-h-28 border-b border-r border-[#e5e7eb] p-2 text-left transition hover:bg-[#f8fafc] ${isCurrentMonth ? 'bg-white' : 'bg-[#f8fafc] text-[#9ca3af]'}`}><span className={`grid h-7 w-7 place-items-center rounded-full text-sm ${key === formatKey(selectedDate) ? 'bg-[#ef4444] font-semibold text-white' : ''}`}>{day.getDate()}</span><div className="mt-1 space-y-1">{dayEvents.slice(0, 2).map((event) => <span key={event.id} className={`block truncate rounded px-1.5 py-1 text-[10px] font-semibold ${event.color}`}>{formatTime(event.time)} {event.title}</span>)}</div></button> })}</div></div></div>
}

function UpcomingList({ events, onStart, horizontal = false }) {
  return <aside className={horizontal ? '' : 'rounded-xl border border-[#e5e7eb] p-4'}><h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#111827]">Upcoming Interviews</h2><div className={horizontal ? 'mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3' : 'mt-4 space-y-3'}>{events.length ? events.map((event) => <div key={event.id} className="rounded-xl bg-[#f8fafc] p-3"><p className="text-sm font-semibold text-[#111827]">{event.title}</p><p className="mt-1 text-xs text-[#6b7280]">{new Date(`${event.date}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {formatTime(event.time)} · {event.type}</p><button type="button" onClick={onStart} className="mt-3 rounded-full bg-[#e8faf4] px-3 py-1.5 text-xs font-semibold text-[#10a977]">Start Interview</button></div>) : <p className="rounded-xl bg-[#f8fafc] p-4 text-sm text-[#6b7280]">No interviews match your search.</p>}</div></aside>
}
