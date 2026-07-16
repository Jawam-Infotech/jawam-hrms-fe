import { useState } from 'react'
import LearningLayout from '../../../layouts/LearningLayout'

function Icon({ name, className = 'h-6 w-6' }) {
  const common = { className, fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, viewBox: '0 0 24 24', 'aria-hidden': true }
  const icons = {
    chart: <><path d="M4 19V10M10 19V5M16 19v-8M22 19H2" /><path d="M4 8h0M10 3h0M16 9h0" /></>,
    check: <><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16.5 8.5" /></>,
    star: <path d="m12 3 2.4 5 5.5.8-4 3.9.9 5.5-4.8-2.6-4.8 2.6.9-5.5-4-3.9 5.5-.8L12 3Z" />,
    fire: <path d="M13.8 2.5c.4 3-1 4.6-2.8 6.1.2-2-1-3.5-2.6-4.6C6.1 6.2 4 8.7 4 12.6A8 8 0 0 0 12 20a8 8 0 0 0 8-7.7c0-4.3-2.2-7.2-6.2-9.8Z" />,
    crown: <path d="m4 7 4 3 4-6 4 6 4-3-2 10H6L4 7Zm2 13h12" />,
    message: <><path d="M5 5.5A4.5 4.5 0 0 1 9.5 1h5A4.5 4.5 0 0 1 19 5.5v5a4.5 4.5 0 0 1-4.5 4.5H10L5 20v-5.5A4.5 4.5 0 0 1 1 10V5.5h4Z" /><path d="M7.5 8h7M7.5 11h4" /></>,
    code: <path d="m8 8-4 4 4 4m8-8 4 4-4 4m-2-11-4 14" />,
  }
  return <svg {...common}>{icons[name]}</svg>
}

function SectionCard({ title, children, className = '' }) {
  return <section className={`rounded-[24px] border border-[#eef2f7] bg-white p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)] ${className}`}><h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#111827]">{title}</h2><div className="my-4 h-px bg-[#d5d5d5]" />{children}</section>
}

function StatCard({ value, label, icon, color, bg }) {
  return <div className="flex min-h-32 items-center gap-5 rounded-[18px] border border-[#eef2f7] bg-white p-5 shadow-[0_20px_45px_rgba(15,23,42,0.08)]"><div className={`grid h-15 w-15 shrink-0 place-items-center rounded-full ${bg} ${color}`}><Icon name={icon} className="h-8 w-8" /></div><div><p className="text-[22px] font-black leading-none text-[#111827]">{value}</p><p className={`mt-2 max-w-28 text-[13px] ${color}`}>{label}</p></div></div>
}

function MetricBar({ label, value, color }) {
  return <div className="grid grid-cols-[145px_minmax(120px,1fr)_42px] items-center gap-3 sm:grid-cols-[190px_minmax(120px,1fr)_42px]"><span className="text-sm text-[#6b7280]">{label}</span><div className="h-4 overflow-hidden rounded-full bg-[#f1f5f9]"><div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} /></div><span className="text-right text-sm font-semibold text-[#6b7280]">{value}%</span></div>
}

export default function Report() {
  const [activeLearning, setActiveLearning] = useState('Assigned')
  const stats = [
    { value: '12', label: 'Course Completed', icon: 'chart', color: 'text-[#4388ff]', bg: 'bg-[#eaf3ff]' },
    { value: '78%', label: 'Interview Score', icon: 'check', color: 'text-[#ff9b13]', bg: 'bg-[#fff5e6]' },
    { value: '92%', label: 'Learning Hour', icon: 'star', color: 'text-[#08b8e7]', bg: 'bg-[#e8f9fe]' },
    { value: '+15%', label: 'Assigned Courses', icon: 'fire', color: 'text-[#ff8d22]', bg: 'bg-[#fff5e7]' },
  ]
  const learningProgress = [
    { label: 'In Progress', value: '142', share: '25%', color: 'bg-[#f59e0b]', text: 'text-[#f59e0b]', note: 'Courses currently being worked on.' },
    { label: 'Completed', value: '340', share: '24%', color: 'bg-[#10b981]', text: 'text-[#10b981]', note: 'Courses finished successfully.' },
    { label: 'Assigned', value: '590', share: '51%', color: 'bg-[#0ea5d7]', text: 'text-[#0ea5d7]', note: 'Total courses assigned to you.' },
  ]
  const skillGroups = [
    { label: 'Leadership', value: '2', icon: 'crown', color: 'text-[#f04444]', bar: 'bg-[#f04444]', note: 'Leadership courses completed' },
    { label: 'Soft Skill', value: '5', icon: 'message', color: 'text-[#f7a30b]', bar: 'bg-[#f7a30b]', note: 'Communication and collaboration skills' },
    { label: 'Technical', value: '12', icon: 'code', color: 'text-[#12b981]', bar: 'bg-[#12b981]', note: 'Technical courses and certifications' },
  ]
  const selectedLearning = learningProgress.find((item) => item.label === activeLearning)

  return (
    <LearningLayout>
      <div className="mx-auto max-w-[1400px] space-y-6">
        <header><h1 className="text-[28px] font-black text-[#111827]">Report</h1><p className="mt-1 text-sm text-[#6b7280]">Check your growth analytics</p></header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map((stat) => <StatCard key={stat.label} {...stat} />)}</section>

        <div className="grid gap-4 xl:grid-cols-[360px_minmax(0,1fr)]">
          <SectionCard title="Learning Progress">
            <div className="mx-auto grid h-[250px] w-[250px] place-items-center rounded-full bg-[conic-gradient(#0ea5d7_0_51%,#f59e0b_51%_76%,#10b981_76%_100%)] p-[48px] shadow-inner transition duration-300 hover:scale-[1.03]">
              <div className="grid h-full w-full place-items-center rounded-full bg-white p-4 text-center"><div><p className={`text-2xl font-black ${selectedLearning.text}`}>{selectedLearning.share}</p><p className="mt-1 text-sm font-semibold text-[#111827]">{selectedLearning.label}</p><p className="mt-1 text-xs text-[#6b7280]">{selectedLearning.value} courses</p></div></div>
            </div>
            <ul className="mt-7 space-y-4 text-sm">
              {learningProgress.map((item) => <Legend key={item.label} {...item} active={activeLearning === item.label} onHover={() => setActiveLearning(item.label)} />)}
            </ul>
            <p className="mt-5 rounded-xl bg-[#f8fafc] p-3 text-xs text-[#6b7280]">{selectedLearning.note}</p>
          </SectionCard>

          <div className="space-y-4">
            <SectionCard title="AI Interview Performance"><div className="space-y-5"><MetricBar label="Communication" value={92} color="bg-[#f04444]" /><MetricBar label="Technical" value={85} color="bg-[#4388ff]" /><MetricBar label="Confidence" value={90} color="bg-[#08a8d8]" /><MetricBar label="Problem Solving" value={80} color="bg-[#10b981]" /><MetricBar label="Overall Performance" value={75} color="bg-[#f59e0b]" /></div></SectionCard>
            <SectionCard title="Skill Growth"><div className="grid grid-cols-[70px_1fr_1.65fr] gap-2">{skillGroups.map((skill) => <div key={skill.label} className={`h-14 rounded-2xl ${skill.bar}`} />)}</div><div className="mt-7 grid gap-5 sm:grid-cols-3">{skillGroups.map((skill) => <div key={skill.label}><p className="text-sm text-[#6b7280]">{skill.label}</p><div className="mt-3 flex items-center gap-2 font-semibold text-[#111827]"><Icon name={skill.icon} className={`h-7 w-7 ${skill.color}`} />{skill.value}</div><p className="mt-2 text-xs text-[#6b7280]">{skill.note}</p></div>)}</div></SectionCard>
          </div>
        </div>
      </div>
    </LearningLayout>
  )
}

function Legend({ color, label, value, active, onHover }) {
  return <li><button type="button" onMouseEnter={onHover} onFocus={onHover} onClick={onHover} className={`flex w-full items-center justify-between rounded-lg p-2 text-left transition ${active ? 'bg-[#f8fafc]' : 'hover:bg-[#f8fafc]'} focus:bg-[#f8fafc] focus:outline-none`}><span className="flex items-center gap-3 font-semibold text-[#6b7280]"><i className={`inline-block h-2.5 w-2.5 rounded-full ${color}`} />{label}</span><span className="text-[#9ca3af]">{value}</span></button></li>
}
