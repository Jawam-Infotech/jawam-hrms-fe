import { useNavigate } from 'react-router-dom'
import LearningLayout from '../../../layouts/LearningLayout'

const upcomingTrainings = Array.from({ length: 3 }, (_, index) => ({
  id: index + 1,
  title: 'UI/UX Advanced Principles',
  date: '18 June 2026 | 10:00 AM',
}))

const recentActivity = [
  { id: 1, icon: 'badge', title: 'Completed “Communication Skills”', detail: 'Today, 10:30 AM' },
  { id: 2, icon: 'play', title: 'Watched “UI/UX Advanced Principles”', detail: 'Yesterday, 04:15 PM' },
  { id: 3, icon: 'clipboard', title: 'Submitted Quiz “React Basics”', detail: '12 May 2025' },
  { id: 4, icon: 'chip', title: 'AI Interview Completed', detail: '10 May 2025' },
]

const scheduledInterviews = Array.from({ length: 4 }, (_, index) => ({ id: index + 1, title: 'React Basic', detail: '10 July 2026 | 10:00 AM' }))
const todaySchedule = [
  { id: 1, icon: 'badge', title: 'AI Mock Interview', detail: 'Role: UI/UX Designer' },
  { id: 2, icon: 'play', title: 'Assessment: HTML & CSS Basics', detail: 'Duration: 45 min' },
  { id: 3, icon: 'clipboard', title: 'UI/UX Advanced Principles Lesson 5', detail: 'Duration: 30 min' },
]

function Icon({ name, className = 'h-6 w-6' }) {
  const common = { className, fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, viewBox: '0 0 24 24', 'aria-hidden': true }
  const icons = {
    chart: <><path d="M4 19V10M10 19V5M16 19v-8M22 19H2" /><path d="M4 8h0M10 3h0M16 9h0" /></>,
    check: <><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16.5 8.5" /></>,
    star: <path d="m12 3 2.4 5 5.5.8-4 3.9.9 5.5-4.8-2.6-4.8 2.6.9-5.5-4-3.9 5.5-.8L12 3Z" />,
    fire: <path d="M13.8 2.5c.4 3-1 4.6-2.8 6.1.2-2-1-3.5-2.6-4.6C6.1 6.2 4 8.7 4 12.6A8 8 0 0 0 12 20a8 8 0 0 0 8-7.7c0-4.3-2.2-7.2-6.2-9.8Z" />,
    book: <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H11v16H6.5A2.5 2.5 0 0 0 4 21V5.5Z" /><path d="M20 5.5A2.5 2.5 0 0 0 17.5 3H13v16h4.5A2.5 2.5 0 0 1 20 21V5.5Z" /></>,
    chip: <><rect x="7" y="7" width="10" height="10" rx="1" /><path d="M9 1v3m6-3v3M9 20v3m6-3v3M1 9h3m-3 6h3m16-6h3m-3 6h3M10 10h4v4h-4z" /></>,
    library: <><path d="M5 5h14v14H5z" /><path d="M9 5V3h6v2M8 10h8M8 14h5" /></>,
    badge: <path d="m12 3 2.3 2.1 3.1-.2.8 3 2.5 1.9-1.5 2.7.6 3-2.9 1-1.6 2.6-2.8-1.2-2.8 1.2-1.6-2.6-2.9-1 .6-3-1.5-2.7L5.8 8l.8-3 3.1.2L12 3Z" />,
    play: <><circle cx="12" cy="12" r="9" /><path d="m10 8 6 4-6 4V8Z" /></>,
    clipboard: <><rect x="5" y="5" width="14" height="16" rx="2" /><path d="M9 5V3h6v2M8 10h8m-8 4h8" /></>,
  }
  return <svg {...common}>{icons[name]}</svg>
}

function SectionCard({ title, children, className = '' }) {
  return <section className={`rounded-[24px] border border-[#eef2f7] bg-white p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)] ${className}`}><h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#111827]">{title}</h2><div className="my-4 h-px bg-[#d5d5d5]" />{children}</section>
}

function DetailRow({ icon, title, detail, image = false }) {
  return <li className="flex items-center gap-3"><div className={image ? 'h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-[#252525]' : 'shrink-0 text-[#a1a7b2]'}>{image ? <img src="/images/figma.png" alt="Figma" className="h-full w-full object-cover" /> : <Icon name={icon} className="h-9 w-9" />}</div><div className="min-w-0"><p className="truncate text-base font-semibold leading-5 text-[#111827]">{title}</p><p className="text-[13px] leading-5 text-[#6b7280]">{detail}</p></div></li>
}

export default function LearningDashboard() {
  const navigate = useNavigate()
  const stats = [
    { label: 'Training Assigned', value: '12', icon: 'chart', color: 'text-[#4388ff]', bg: 'bg-[#eaf3ff]' },
    { label: 'Training Complete', value: '7', icon: 'check', color: 'text-[#ff9b13]', bg: 'bg-[#fff5e6]' },
    { label: 'Overall Performance', value: '78%', icon: 'star', color: 'text-[#08b8e7]', bg: 'bg-[#e8f9fe]' },
    { label: 'Day Streak', value: '14', icon: 'fire', color: 'text-[#ff8d22]', bg: 'bg-[#fff5e7]' },
  ]

  return (
    <LearningLayout>
      <div className="mx-auto max-w-[1400px] space-y-6">
        <header><h1 className="text-[28px] font-black text-[#111827]">Welcome Back, Gaurav</h1><p className="mt-1 text-sm text-[#6b7280]">Keep Learning, keep growing!</p></header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => <div key={stat.label} className="flex min-h-32 items-center gap-5 rounded-[18px] border border-[#eef2f7] bg-white p-5 shadow-[0_20px_45px_rgba(15,23,42,0.08)]"><div className={`grid h-15 w-15 shrink-0 place-items-center rounded-full ${stat.bg} ${stat.color}`}><Icon name={stat.icon} className="h-8 w-8" /></div><div><p className="text-[22px] font-black leading-none text-[#111827]">{stat.value}</p><p className={`mt-2 max-w-28 text-[13px] ${stat.color}`}>{stat.label}</p></div></div>)}
        </section>

        <div className="flex flex-wrap justify-end gap-4"><button onClick={() => navigate('/learning/my-learning')} className="flex items-center gap-3 rounded-full bg-[#eef6ff] px-4 py-2 text-sm font-semibold text-[#2563eb]"><Icon name="book" />Continue Learning</button><button onClick={() => navigate('/learning/ai-interviews')} className="flex items-center gap-3 rounded-full bg-[#fff7ed] px-4 py-2 text-sm font-semibold text-[#b45309]"><Icon name="chip" />Practice AI Interview</button><button onClick={() => navigate('/learning/library')} className="flex items-center gap-3 rounded-full bg-[#f3f4f6] px-4 py-2 text-sm font-semibold text-[#374151]"><Icon name="library" />Browse Library</button></div>

        <div className="grid gap-4 xl:grid-cols-[1.06fr_.78fr_1.1fr]">
          <SectionCard title="Learning Process"><div className="flex flex-col items-center gap-7 pt-1 sm:flex-row sm:justify-around"><div className="grid h-[180px] w-[180px] shrink-0 place-items-center rounded-full bg-[conic-gradient(#f59e0b_0_22%,#377df4_22%_68%,#0fbd83_68%_100%)]"><div className="grid h-[145px] w-[145px] place-items-center rounded-full bg-[#fff5e6] text-center"><span className="text-xl font-extrabold leading-6 text-[#121212]">78%<br />Completed</span></div></div><dl className="w-full max-w-[245px] space-y-4 text-base"><ProgressLabel label="Completed" value="7" color="text-[#4388ff]" /><ProgressLabel label="In Progress" value="5" color="text-[#10bd83]" /><ProgressLabel label="Not Started" value="3" color="text-[#ff9b13]" /><ProgressLabel label="Total" value="15" color="text-[#181818]" /></dl></div></SectionCard>
          <SectionCard title="Upcoming Trainings"><ul className="space-y-5">{upcomingTrainings.map((training) => <DetailRow key={training.id} image title={training.title} detail={training.date} />)}</ul><div className="mt-6 text-center"><button className="rounded-full bg-[#e9ecf2] px-5 py-2 text-sm font-bold text-[#17355f]">Go to Calender</button></div></SectionCard>
          <SectionCard title="Recent Activity"><ul className="space-y-5">{recentActivity.map((activity) => <DetailRow key={activity.id} {...activity} />)}</ul></SectionCard>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          <SectionCard title="Interview Scheduled"><ul className="space-y-5">{scheduledInterviews.map((item) => <DetailRow key={item.id} icon="play" {...item} />)}</ul></SectionCard>
          <SectionCard title="Today’s Schedule"><ul className="space-y-5">{todaySchedule.map((item) => <DetailRow key={item.id} {...item} />)}</ul><div className="mt-6 text-right"><button className="rounded-full bg-[#e9ecf2] px-5 py-2 text-sm font-bold text-[#17355f]">Go to Calender</button></div></SectionCard>
        </div>
      </div>
    </LearningLayout>
  )
}

function ProgressLabel({ label, value, color }) {
  return <div className="flex justify-between gap-4"><dt className={`font-bold ${color}`}>{label}</dt><dd className="text-[#8b929e]">{value}</dd></div>
}
