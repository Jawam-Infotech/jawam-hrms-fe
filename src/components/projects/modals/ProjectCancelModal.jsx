import { useState } from 'react'

function ProjectCancelModal({
  isOpen,
  onClose,
  projectTitle,
  mode = 'SOLO_CANCEL', // 'SOLO_CANCEL', 'TEAM_REQUEST', 'TEAM_REJECT'
  onConfirm,
  isSubmitting = false,
  apiError = null,
}) {
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  if (!isOpen) return null

  const titleMap = {
    SOLO_CANCEL: 'Cancel Project',
    TEAM_REQUEST: 'Request Team Project Cancellation',
    TEAM_REJECT: 'Reject Cancellation Request',
  }

  const descMap = {
    SOLO_CANCEL: 'E12 POST — CEO direct cancellation of project',
    TEAM_REQUEST: 'E27 POST — Primary PM submits cancellation request to CEO',
    TEAM_REJECT: 'E29 POST — CEO rejects team cancellation request',
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!reason.trim()) {
      setError('A mandatory recorded reason is required.')
      return
    }
    onConfirm(reason.trim())
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[28px] bg-white p-8 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-4">
          <div>
            <h2 className="text-[20px] font-black text-[#dc2626]">{titleMap[mode] || 'Cancel Project'}</h2>
            <p className="text-xs text-[#6b7280] mt-1">{descMap[mode] || 'Project cancellation governance'}</p>
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

        <div className="mt-4 rounded-[14px] border border-[#fecaca] bg-[#fef2f2] p-3 text-xs text-[#b91c1c]">
          <p className="font-bold">Permanent Audit Notice:</p>
          <p className="mt-0.5">
            A mandatory reason is required by the backend service. All actions are immutably recorded in the project audit history.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="rounded-xl border border-[#e5e7eb] bg-[#f8fafc] p-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#6b7280]">Project</p>
            <p className="text-[14px] font-bold text-[#111827] mt-0.5">{projectTitle}</p>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-[#111827] mb-1">
              Mandatory Reason <span className="text-[#ef4444]">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value)
                setError('')
              }}
              disabled={isSubmitting}
              rows={3}
              placeholder="State the official rationale (e.g. strategic pivot, client contract dissolved)..."
              className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2.5 text-[14px] text-[#111827] focus:border-[#ef4444] focus:outline-none"
            />
            {error && <p className="mt-1 text-xs text-[#ef4444]">{error}</p>}
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-[#f1f5f9] pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-full border border-[#e5e7eb] px-5 py-2.5 text-[14px] font-semibold text-[#4b5563] hover:bg-[#f9fafb] disabled:opacity-50"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full bg-[#dc2626] px-6 py-2.5 text-[14px] font-semibold text-white shadow-sm hover:bg-[#b91c1c] disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Confirm'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProjectCancelModal
