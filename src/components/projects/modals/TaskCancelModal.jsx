import { useState } from 'react'

function TaskCancelModal({
  isOpen,
  onClose,
  task,
  onCancelTask,
  isSubmitting = false,
  apiError = null,
}) {
  const [reason, setReason] = useState('')

  if (!isOpen || !task) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onCancelTask(task.id, reason.trim())
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[28px] bg-white p-7 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-4">
          <div>
            <h2 className="text-[18px] font-black text-[#111827]">Cancel Task</h2>
            <p className="text-xs text-[#6b7280] mt-0.5">{task.title || task.name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="rounded-full p-2 text-[#9ca3af] hover:bg-[#f1f5f9] hover:text-[#111827] disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        {apiError && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
            {apiError}
          </div>
        )}

        <div className="mt-4 rounded-xl border border-[#fee2e2] bg-[#fff1f2] p-3 text-xs text-[#9f1239]">
          <p className="font-bold">E34 / M1 Rule:</p>
          <p className="mt-0.5">
            Cancelling this task closes any open completion reviews and pending TCRs on this task. The task is excluded from the project progress denominator.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-[13px] font-bold text-[#111827] mb-1">
              Cancellation Reason <span className="text-[#6b7280] font-normal">(optional)</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isSubmitting}
              rows={3}
              placeholder="e.g., Feature deprecated by client, obsolete requirement..."
              className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2.5 text-[14px] text-[#111827] focus:border-[#ef4444] focus:outline-none"
            />
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-[#f1f5f9] pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-full border border-[#e5e7eb] px-5 py-2 text-[14px] font-semibold text-[#4b5563] hover:bg-[#f9fafb] disabled:opacity-50"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-[#dc2626] px-6 py-2 text-[14px] font-semibold text-white shadow-sm hover:bg-[#b91c1c] disabled:opacity-50"
            >
              {isSubmitting ? 'Cancelling...' : 'Cancel Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskCancelModal
