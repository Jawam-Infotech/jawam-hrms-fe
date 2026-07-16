import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LearningLayout from '../../../layouts/LearningLayout'

const assignedInterviews = [
  { id: 1, role: 'UI/UX Developer', assignedBy: 'HR Team', dueDate: '30 Jun 2026' },
  { id: 2, role: 'UI React JS Developer', assignedBy: 'CEO', dueDate: '15 Jul 2026' },
  { id: 3, role: 'UI/UX Advanced Principles', assignedBy: 'Team Lead', dueDate: '15 Jul 2026' },
  { id: 4, role: 'UI/UX Advanced Principles', assignedBy: 'HR Team', dueDate: '15 Jul 2026' },
]

const recentInterviews = [
  { id: 1, role: 'UI/UX Developer', date: '30 Jun 2026', score: '82%' },
  { id: 2, role: 'UI React JS Developer', date: '15 Jul 2026', score: '76%' },
  { id: 3, role: 'UI/UX Advanced Principles', date: '15 Jul 2026', score: '88%' },
  { id: 4, role: 'UI/UX Advanced Principles', date: '15 Jul 2026', score: '90%' },
]

function Icon({ name, className = 'h-6 w-6' }) {
  const common = { className, fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, viewBox: '0 0 24 24', 'aria-hidden': true }
  const paths = {
    chart: <><path d="M4 19V10M10 19V5M16 19v-8M22 19H2" /><path d="M4 8h0M10 3h0M16 9h0" /></>,
    check: <><circle cx="12" cy="12" r="9" /><path d="m8 12 2.5 2.5L16.5 8.5" /></>,
    star: <path d="m12 3 2.4 5 5.5.8-4 3.9.9 5.5-4.8-2.6-4.8 2.6.9-5.5-4-3.9 5.5-.8L12 3Z" />,
    fire: <path d="M13.8 2.5c.4 3-1 4.6-2.8 6.1.2-2-1-3.5-2.6-4.6C6.1 6.2 4 8.7 4 12.6A8 8 0 0 0 12 20a8 8 0 0 0 8-7.7c0-4.3-2.2-7.2-6.2-9.8Zm-4.2 13c0-2 1.4-3 2.6-4.6.5 1.4 1.5 2.1 2.2 3.2.4.7.5 1.4.3 2.1a3.1 3.1 0 0 1-5.1-.7Z" />,
    upload: <><path d="M12 15V4m0 0L8.5 7.5M12 4l3.5 3.5" /><path d="M5 12.5A4.5 4.5 0 0 0 5.5 21h13a4.5 4.5 0 0 0 .5-8.5 7 7 0 0 0-13.8 0H5Z" /></>,
  }
  return <svg {...common}>{paths[name]}</svg>
}

function PillButton({ children, onClick, variant = 'green' }) {
  const styles = variant === 'red'
    ? 'bg-[#fff0f0] text-[#ff5c5c] hover:bg-[#ffe4e4]'
    : 'bg-[#e8faf4] text-[#10bd83] hover:bg-[#d9f6ec]'
  return <button type="button" onClick={onClick} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${styles}`}>{children}</button>
}

export default function AIInterview() {
  const navigate = useNavigate()
  const fileInput = useRef(null)
  const [resume, setResume] = useState(null)
  const [form, setForm] = useState({ role: '', experience: '0', difficulty: '', type: '' })
  const [message, setMessage] = useState('')

  const updateField = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }))
  const resetForm = () => {
    setResume(null)
    setForm({ role: '', experience: '0', difficulty: '', type: '' })
    if (fileInput.current) fileInput.current.value = ''
    setMessage('')
  }
  const startInterview = () => {
    if (!form.role || !form.difficulty || !form.type) {
      setMessage('Select a job role, difficulty, and interview type to continue.')
      return
    }
    navigate('/learning/ai-interviews/session')
  }

  const statCards = [
    { label: 'Mock Interview Taken', value: '12', icon: 'chart', color: 'text-[#4388ff]', bg: 'bg-[#eaf3ff]' },
    { label: 'Average Score', value: '78%', icon: 'check', color: 'text-[#ff9b13]', bg: 'bg-[#fff5e6]' },
    { label: 'Best Score', value: '92%', icon: 'star', color: 'text-[#08b8e7]', bg: 'bg-[#e8f9fe]' },
    { label: 'Improvement Rate', value: '+15%', icon: 'fire', color: 'text-[#ff8d22]', bg: 'bg-[#fff5e7]' },
  ]

  return (
    <LearningLayout>
      <div className="mx-auto max-w-[1400px] space-y-6">
        <header>
          <h1 className="text-[28px] font-black text-[#111827]">AI Interview</h1>
          <p className="mt-1 text-sm text-[#6b7280]">Practice interviews with AI and improve your skills.</p>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {statCards.map((stat) => (
            <div key={stat.label} className="flex min-h-32 items-center gap-5 rounded-[18px] border border-[#eef2f7] bg-white p-5 shadow-[0_20px_45px_rgba(15,23,42,0.08)]">
              <div className={`grid h-15 w-15 shrink-0 place-items-center rounded-full ${stat.bg} ${stat.color}`}><Icon name={stat.icon} className="h-8 w-8" /></div>
              <div><p className="text-[22px] font-black leading-none text-[#111827]">{stat.value}</p><p className={`mt-2 max-w-28 text-[13px] ${stat.color}`}>{stat.label}</p></div>
            </div>
          ))}
        </section>

        <section className="rounded-[28px] bg-white p-4 shadow-[0_10px_30px_rgba(75,72,97,0.04)] sm:p-5">
          <h2 className={sectionTitleClass}>Start New Mock Interview</h2>
          <div className="my-4 h-px bg-[#d6d6d6]" />
          <div className="grid gap-5 xl:grid-cols-[325px_minmax(0,1fr)]">
            <label className="flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-[24px] border-2 border-dotted border-[#cbd0d9] bg-white px-5 text-center transition hover:border-[#61a0ff]" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); setResume(event.dataTransfer.files?.[0] ?? null) }}>
              <Icon name="upload" className="h-16 w-16 text-[#b7bbc3]" />
              <span className="mt-4 text-2xl font-bold text-[#151515]">Upload Your Resume</span>
              <span className="mt-3 max-w-[230px] text-base leading-5 text-[#282828]">{resume ? resume.name : 'Drag & Drop your file here PDF, DOCX (Max 5MB)'}</span>
              <span className="mt-5 rounded-full bg-[#e8faf4] px-4 py-2 text-sm font-bold text-[#12bb83]">Choose File</span>
              <input ref={fileInput} type="file" className="sr-only" accept=".pdf,.doc,.docx" onChange={(event) => setResume(event.target.files?.[0] ?? null)} />
            </label>

            <div className="rounded-[30px] bg-[#f8f8fc] p-5 shadow-[0_4px_5px_rgba(0,0,0,0.18)] sm:p-7">
              <div className="grid gap-x-7 gap-y-5 md:grid-cols-2">
                <Field label="Select Job Role"><select className={fieldControlClass} value={form.role} onChange={updateField('role')}><option value="">Search Job Role</option><option>UI/UX Developer</option><option>UI React JS Developer</option><option>Frontend Developer</option></select></Field>
                <Field label="Years of Experience"><input className={fieldControlClass} type="number" min="0" max="50" value={form.experience} onChange={updateField('experience')} /></Field>
                <Field label="Interview Difficulty"><select className={fieldControlClass} value={form.difficulty} onChange={updateField('difficulty')}><option value="">Select the Level of the Interview</option><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></Field>
                <Field label="Interview Type"><select className={fieldControlClass} value={form.type} onChange={updateField('type')}><option value="">Select Type of Interview</option><option>Technical</option><option>Behavioural</option><option>Mixed</option></select></Field>
              </div>
              <div className="mt-10 flex flex-wrap items-center justify-end gap-5"><PillButton variant="red" onClick={resetForm}>Reset</PillButton><PillButton onClick={startInterview}>Start Interview</PillButton></div>
              {message && <p role="status" className="mt-4 text-right text-sm font-medium text-[#10a977]">{message}</p>}
            </div>
          </div>
        </section>

        <InterviewTable title="Assigned Interviews" headings={['AI Interview', 'Assigned By', 'Due Date', 'Action']}>
          {assignedInterviews.map((interview) => <tr key={interview.id}><td className={primaryCellClass}>{interview.role}</td><td className={cellClass}>{interview.assignedBy}</td><td className={cellClass}>{interview.dueDate}</td><td className={cellClass}><PillButton onClick={() => navigate('/learning/ai-interviews/session')}>Start Interview</PillButton></td></tr>)}
        </InterviewTable>
        <InterviewTable title="Recent Interviews" headings={['AI Interview', 'Date', 'Percentage', 'Action']}>
          {recentInterviews.map((interview) => <tr key={interview.id}><td className={primaryCellClass}>{interview.role}</td><td className={cellClass}>{interview.date}</td><td className={cellClass}>{interview.score}</td><td className={cellClass}><PillButton onClick={() => navigate('/learning/ai-interviews/report')}>View Report</PillButton></td></tr>)}
        </InterviewTable>
      </div>
    </LearningLayout>
  )
}

function Field({ label, children }) {
  return <label className="block text-sm font-semibold text-[#111827]"><span className="mb-2 block">{label}</span>{children}</label>
}

function InterviewTable({ title, headings, children }) {
  return <section className="overflow-hidden rounded-[24px] border border-[#eef2f7] bg-white p-6 shadow-[0_20px_80px_rgba(15,23,42,0.08)]"><h2 className={sectionTitleClass}>{title}</h2><div className="my-4 h-px bg-[#d6d6d6]" /><div className="overflow-x-auto"><table className="w-full min-w-[720px] text-left"><thead><tr>{headings.map((heading) => <th key={heading} className="pb-3 text-sm font-medium text-[#6b7280]">{heading}</th>)}</tr></thead><tbody>{children}</tbody></table></div></section>
}

const sectionTitleClass = 'mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-[#111827]'
const fieldControlClass = 'h-11 w-full appearance-auto rounded-[9px] border border-[#d5d5d8] bg-white px-4 text-sm text-[#111827] outline-none transition focus:border-[#60a5fa] focus:ring-[3px] focus:ring-[#60a5fa]/20'
const cellClass = 'py-4 pr-4 text-sm text-[#6b7280]'
const primaryCellClass = `${cellClass} font-semibold text-[#111827]`
