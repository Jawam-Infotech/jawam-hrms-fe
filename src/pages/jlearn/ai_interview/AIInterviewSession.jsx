import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import LearningLayout from '../../../layouts/LearningLayout'

const starterCode = `// Add your answer below
// Explain how you would model a Product collection.

import mongoose, { Schema } from 'mongoose'

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
}, { timestamps: true })

export default mongoose.model('Product', productSchema)`

function CallIcon({ name, className = 'h-5 w-5' }) {
  const common = { className, fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, viewBox: '0 0 24 24', 'aria-hidden': true }
  const icons = {
    mic: <><path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3Z" /><path d="M6 11a6 6 0 0 0 12 0M12 17v4M8 21h8" /></>,
    video: <><rect x="3" y="6" width="12" height="12" rx="2" /><path d="m15 10 5-3v10l-5-3" /></>,
    phone: <path d="M7.2 3.5 4.8 5.2c-1.1.8-.8 3.6.7 6.7 1.5 3 4.1 5.8 6.8 6.9 2.7 1.1 5.3 1.1 6.2-.1l1.9-2.4-3.7-3-1.5 1.5c-1.2-.4-2.3-1.3-3.1-2.1-.8-.8-1.6-1.9-2-3.1l1.5-1.5-3-4.6Z" />,
    music: <><path d="M9 18V6l10-2v12" /><circle cx="6" cy="18" r="3" /><circle cx="16" cy="16" r="3" /></>,
    more: <><circle cx="5" cy="12" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="19" cy="12" r="1" fill="currentColor" /></>,
  }
  return <svg {...common}>{icons[name]}</svg>
}

function CallControl({ icon, label, danger = false, onClick }) {
  return <button type="button" onClick={onClick} aria-label={label} className={`grid h-11 w-11 place-items-center rounded-xl border transition ${danger ? 'border-[#f45b6c] bg-[#e95364] text-white hover:bg-[#da4052]' : 'border-[#394150] bg-[#121722] text-[#e5e7eb] hover:bg-[#232b39]'}`}><CallIcon name={icon} /></button>
}

export default function AIInterviewSession() {
  const navigate = useNavigate()
  const [code, setCode] = useState(starterCode)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const elapsed = '01:23'

  const finishInterview = () => {
    setShowConfirmation(false)
    navigate('/learning/ai-interviews/report')
  }

  return (
    <LearningLayout>
      <div className="mx-auto max-w-[1400px] space-y-6">
        <header><h1 className="text-[28px] font-black text-[#111827]">AI Interview</h1><p className="mt-1 text-sm text-[#6b7280]">Practice interviews with AI and improve your skills.</p></header>

        <section className="overflow-hidden rounded-[24px] border border-[#1c2430] bg-black p-3 shadow-[0_20px_80px_rgba(15,23,42,0.2)] sm:p-5">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 text-sm text-[#e5e7eb]"><div className="flex items-center gap-3"><span className="h-6 w-6 animate-pulse rounded-full bg-[#4388ff] shadow-[0_0_0_5px_rgba(67,136,255,0.16)]" /><span>Joy Banks, Iwobi (You)</span></div><div className="flex items-center gap-3"><CallControl icon="music" label="Audio settings" /><span className="rounded-lg border border-[#394150] bg-[#121722] px-3 py-2 text-xs font-semibold text-[#f4f4f5]"><i className="mr-2 inline-block h-2 w-2 rounded-full bg-[#e95364]" />LIVE {elapsed}</span><button type="button" onClick={() => setShowConfirmation(true)} className="rounded-lg border border-[#394150] bg-[#121722] px-4 py-2 text-sm font-semibold text-white hover:bg-[#232b39]">End</button></div></div>

          <div className="relative flex min-h-[440px] items-center justify-center overflow-hidden rounded-[20px] bg-[radial-gradient(circle_at_48%_28%,#f7c9b3_0_5%,#d38d73_13%,#1f2732_35%,#111827_70%)] sm:min-h-[570px]">
            <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,.14),transparent_30%,rgba(0,0,0,.4))]" />
            <div className="relative grid h-52 w-52 place-items-center rounded-full border-[10px] border-white/20 bg-gradient-to-b from-[#e9b58e] to-[#8e5747] shadow-2xl"><div className="grid h-36 w-36 place-items-center rounded-full bg-[#f6c5a5] text-5xl">👩🏻</div></div>
            <div className="absolute bottom-4 left-4 rounded-md bg-black/70 px-3 py-2 text-xs font-semibold text-white">Rita B (You)</div>
            <div className="absolute bottom-4 right-4 h-28 w-40 overflow-hidden rounded-xl border-2 border-white/70 bg-[linear-gradient(135deg,#71b6db,#f3c3a9_55%,#4d815a)] shadow-lg"><div className="grid h-full place-items-center text-3xl">👤</div><span className="absolute bottom-2 left-2 rounded bg-black/70 px-2 py-1 text-[10px] text-white">Joy B</span></div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4"><div className="flex items-center gap-3"><CallControl icon="mic" label="Mute microphone" /><CallControl icon="video" label="Toggle camera" /><CallControl icon="more" label="More call options" /></div><div className="flex items-center gap-3"><CallControl icon="music" label="Audio settings" /><CallControl icon="more" label="More options" /><CallControl icon="phone" label="Finish interview" danger onClick={() => setShowConfirmation(true)} /></div></div>
        </section>

        <section className="overflow-hidden rounded-[18px] border border-[#30343b] bg-[#1e1e1e] shadow-[0_20px_60px_rgba(15,23,42,0.18)]"><div className="flex items-center gap-1 border-b border-[#30343b] bg-[#272727] px-3 text-xs text-[#d4d4d4]"><span className="border-b-2 border-[#4388ff] bg-[#1e1e1e] px-4 py-3">index.js</span><span className="px-4 py-3 text-[#9ca3af]">README.md</span><span className="px-4 py-3 text-[#9ca3af]">.gitignore</span></div><div className="grid grid-cols-[46px_minmax(0,1fr)] font-mono text-sm leading-6"><div className="select-none bg-[#252526] py-4 pr-3 text-right text-[#858585]">{Array.from({ length: 18 }, (_, index) => <div key={index}>{index + 1}</div>)}</div><textarea value={code} onChange={(event) => setCode(event.target.value)} spellCheck="false" aria-label="Interview code editor" className="min-h-[410px] resize-y bg-[#1e1e1e] p-4 font-mono text-sm leading-6 text-[#d4d4d4] outline-none" /></div><div className="flex justify-end border-t border-[#30343b] bg-[#272727] px-4 py-2 text-xs text-[#9ca3af]">JavaScript&nbsp;&nbsp; UTF-8&nbsp;&nbsp; 2 spaces</div></section>

        <div className="flex justify-end"><button type="button" onClick={() => setShowConfirmation(true)} className="rounded-full bg-[#ef4444] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#dc2626]">Finish Interview</button></div>
      </div>

      {showConfirmation && <div role="dialog" aria-modal="true" aria-labelledby="finish-title" className="fixed inset-0 z-50 grid place-items-center bg-[#0f172a]/50 p-4"><div className="w-full max-w-md rounded-[24px] bg-white p-6 shadow-2xl"><h2 id="finish-title" className="text-lg font-semibold text-[#111827]">Finish your interview?</h2><p className="mt-3 text-sm leading-6 text-[#6b7280]">Are you sure you want to finish your interview? Your responses and code will be submitted for evaluation.</p><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setShowConfirmation(false)} className="rounded-full border border-[#cbd5e1] px-4 py-2 text-sm font-semibold text-[#374151] hover:bg-[#f8fafc]">Continue Interview</button><button type="button" onClick={finishInterview} className="rounded-full bg-[#ef4444] px-4 py-2 text-sm font-semibold text-white hover:bg-[#dc2626]">Yes, Finish Interview</button></div></div></div>}
    </LearningLayout>
  )
}
