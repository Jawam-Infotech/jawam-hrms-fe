import { useState } from 'react'

function TaskCancelModal({ isOpen, onClose, task, onCancelTask }) {
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  if (!isOpen || !task) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!reason.trim()) {
      setError('A mandatory reason is required to cancel or abandon a task.')
      return
    }

    onCancelTask(task.id, reason.trim())
    setReason('')
    setError('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[28px] bg-white p-7 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-4">
          <div>
            <h2 className="text-[18px] font-black text-[#111827]">Cancel Task</h2>
            <p className="text-xs text-[#6b7280] mt-0.5">{task.name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#9ca3af] hover:bg-[#f1f5f9] hover:text-[#111827]"
          >
            ✕
          </button>
        </div>

        {/* Section 6 Rule Banner */}
        <div className="mt-4 rounded-xl border border-[#fee2e2] bg-[#fff1f2] p-3 text-xs text-[#9f1239]">
          <p className="font-bold">Section 6 Denominator Rule:</p>
          <p className="mt-0.5">
            A cancelled task is abandoned or invalidated and is <strong>excluded from the project progress denominator</strong>.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-[13px] font-bold text-[#111827] mb-1">
              Reason for Cancellation <span className="text-[#ef4444]">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value)
                setError('')
              }}
              rows={3}
              placeholder="e.g., Feature deprecated by client, obsolete requirement, superseded by task-45..."
              className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2.5 text-[14px] text-[#111827] focus:border-[#ef4444] focus:outline-none"
            />
            {error && <p className="mt-1 text-xs text-[#ef4444] font-semibold">{error}</p>}
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-[#f1f5f9] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[#e5e7eb] px-5 py-2 text-[14px] font-semibold text-[#4b5563] hover:bg-[#f9fafb]"
            >
              Back
            </button>
            <button
              type="submit"
              className="rounded-full bg-[#dc2626] px-6 py-2 text-[14px] font-semibold text-white shadow-sm hover:bg-[#b91c1c]"
            >
              Cancel Task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskCancelModal
