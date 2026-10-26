import { useState } from 'react'

function ProjectHoldModal({ isOpen, onClose, projectTitle, onConfirmHold }) {
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!reason.trim()) {
      setError('A mandatory reason is required to place this project on hold.')
      return
    }
    onConfirmHold(reason.trim())
    setReason('')
    setError('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[28px] bg-white p-8 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-4">
          <div>
            <h2 className="text-[20px] font-black text-[#111827]">Place Project On Hold</h2>
            <p className="text-xs text-[#6b7280] mt-1">Workflow B — Temporary Pause of Work</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#9ca3af] hover:bg-[#f1f5f9] hover:text-[#111827]"
          >
            ✕
          </button>
        </div>

        <div className="mt-4 rounded-[14px] border border-[#fef3c7] bg-[#fffbeb] p-3 text-xs text-[#92400e]">
          <p className="font-bold">Workflow B Rule:</p>
          <p className="mt-0.5">
            Placing this project ON_HOLD pauses active task execution. Resuming will require re-verifying that PM and member staffing guards are still satisfied.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="rounded-xl border border-[#e5e7eb] bg-[#f8fafc] p-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#6b7280]">Project</p>
            <p className="text-[14px] font-bold text-[#111827] mt-0.5">{projectTitle}</p>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-[#111827] mb-1">
              Reason for Putting On Hold <span className="text-[#ef4444]">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value)
                setError('')
              }}
              rows={3}
              placeholder="e.g., Awaiting external API credentials from client; budget reallocation; or sprint pause..."
              className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2.5 text-[14px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
            />
            {error && <p className="mt-1 text-xs text-[#ef4444]">{error}</p>}
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-[#f1f5f9] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[#e5e7eb] px-5 py-2.5 text-[14px] font-semibold text-[#4b5563] hover:bg-[#f9fafb]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-[#f59e0b] px-6 py-2.5 text-[14px] font-semibold text-white shadow-sm hover:bg-[#d97706]"
            >
              Confirm Put On Hold
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProjectHoldModal
