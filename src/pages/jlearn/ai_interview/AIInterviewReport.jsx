import { useNavigate } from 'react-router-dom'
import LearningLayout from '../../../layouts/LearningLayout'

const otherInterviews = [
  { id: 1, role: 'UI/UX Developer', date: '30 Jun 2026', score: '82%' },
  { id: 2, role: 'UI React JS Developer', date: '15 Jul 2026', score: '76%' },
  { id: 3, role: 'UI/UX Advanced Principles', date: '15 Jul 2026', score: '88%' },
  { id: 4, role: 'UI/UX Advanced Principles', date: '15 Jul 2026', score: '90%' },
]

function Icon({ name, className = 'h-6 w-6' }) {
  const common = { className, fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, viewBox: '0 0 24 24', 'aria-hidden': true }
  const icons = {
    chart: <><path d="M4 19V10M10 19V5M16 19v-8M22 19H2" /><path d="M4 8h0M10 3h0M16 9h0" /></>,
    check: <><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16.5 8.5" /></>,
    star: <path d="m12 3 2.4 5 5.5.8-4 3.9.9 5.5-4.8-2.6-4.8 2.6.9-5.5-4-3.9 5.5-.8L12 3Z" />,
    fire: <path d="M13.8 2.5c.4 3-1 4.6-2.8 6.1.2-2-1-3.5-2.6-4.6C6.1 6.2 4 8.7 4 12.6A8 8 0 0 0 12 20a8 8 0 0 0 8-7.7c0-4.3-2.2-7.2-6.2-9.8Z" />,
  }
  return <svg {...common}>{icons[name]}</svg>
}

function ScoreCard({ value, label, icon, color, bg }) {
  return <div className="flex min-h-32 items-center gap-5 rounded-[18px] border border-[#eef2f7] bg-white p-5 shadow-[0_20px_45px_rgba(15,23,42,0.08)]"><div className={`grid h-15 w-15 shrink-0 place-items-center rounded-full ${bg} ${color}`}><Icon name={icon} className="h-8 w-8" /></div><div><p className="text-[22px] font-black leading-none text-[#111827]">{value}</p><p className={`mt-2 max-w-32 text-[13px] ${color}`}>{label}</p></div></div>
}

function FeedbackCard({ title, children, className = '' }) {
  return <section className={`rounded-[24px] border border-[#eef2f7] bg-white p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)] ${className}`}><h2 className="text-lg font-semibold text-[#111827]">{title}</h2><div className="my-4 h-px bg-[#d5d5d5]" />{children}</section>
}

export default function AIInterviewReport() {
  const navigate = useNavigate()
  const scoreCards = [
    { value: '84%', label: 'Overall Score', icon: 'chart', color: 'text-[#4388ff]', bg: 'bg-[#eaf3ff]' },
    { value: '78%', label: 'Technical Score', icon: 'check', color: 'text-[#ff9b13]', bg: 'bg-[#fff5e6]' },
    { value: '92%', label: 'Communication Score', icon: 'star', color: 'text-[#08b8e7]', bg: 'bg-[#e8f9fe]' },
    { value: '90%', label: 'Confidence Score', icon: 'fire', color: 'text-[#ff8d22]', bg: 'bg-[#fff5e7]' },
  ]

  return (
    <LearningLayout>
      <div className="mx-auto max-w-[1400px] space-y-6">
        <header><h1 className="text-[28px] font-black text-[#111827]">AI Interview Report</h1><p className="mt-1 text-sm text-[#6b7280]">Practice interviews with AI and improve your skills.</p></header>

        <section className="grid gap-7 text-base text-[#111827] md:grid-cols-2">
          <div className="space-y-1"><p><strong>Interview :</strong> UI/UX Developer</p><p><strong>Date :</strong> 15 June 2026</p><p><strong>Duration :</strong> 45 min</p><p><strong>Resume Used :</strong> Resume.pdf</p></div>
          <div className="space-y-1"><p><strong>Status :</strong> <span className="font-semibold text-[#10b981]">Passed</span></p><p><strong>Overall Score :</strong> 84%</p><p><strong>Interview Type :</strong> HR Round</p><p><strong>Level :</strong> Medium</p></div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{scoreCards.map((card) => <ScoreCard key={card.label} {...card} />)}</section>

        <div className="grid gap-4 xl:grid-cols-[.9fr_1fr_1.9fr]">
          <FeedbackCard title="Strengths"><ul className="list-disc space-y-1 pl-5 text-sm text-[#374151]"><li>Consistent Work Updates</li><li>Strong Project Contribution</li><li>Excellent Attendance</li><li>Good Communication</li><li>Quick Learner</li></ul></FeedbackCard>
          <FeedbackCard title="Areas of Improvement"><ul className="list-disc space-y-1 pl-5 text-sm text-[#374151]"><li>Focus on Task Prioritisation</li><li>Better Time Estimation</li><li>Increase Documentation Quality</li></ul></FeedbackCard>
          <FeedbackCard title="Final Recommendation"><p className="text-sm leading-6 text-[#374151]">You demonstrate strong UI/UX fundamentals and communicate your ideas clearly. To perform even better in future interviews, focus on accessibility standards and strengthen your problem-solving explanations with real project examples.</p></FeedbackCard>
        </div>

        <section className="overflow-hidden rounded-[24px] border border-[#eef2f7] bg-white p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)]"><h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-[#111827]">Other Interviews</h2><div className="my-4 h-px bg-[#d5d5d5]" /><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left"><thead><tr className="text-sm text-[#6b7280]"><th className="pb-3 font-medium">AI Interview</th><th className="pb-3 font-medium">Date</th><th className="pb-3 font-medium">Percentage</th><th className="pb-3 font-medium">Action</th></tr></thead><tbody>{otherInterviews.map((interview) => <tr key={interview.id}><td className="py-4 pr-4 text-sm font-semibold text-[#111827]">{interview.role}</td><td className="py-4 pr-4 text-sm text-[#6b7280]">{interview.date}</td><td className="py-4 pr-4 text-sm text-[#6b7280]">{interview.score}</td><td className="py-4"><button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="rounded-full bg-[#e8faf4] px-4 py-2 text-sm font-semibold text-[#10bd83]">View Report</button></td></tr>)}</tbody></table></div><div className="mt-4"><button type="button" onClick={() => navigate('/learning/ai-interviews')} className="text-sm font-semibold text-[#2563eb]">← Back to AI Interviews</button></div></section>
      </div>
    </LearningLayout>
  )
}
