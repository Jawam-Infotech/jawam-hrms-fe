import { useState } from 'react'

function ReplacePmModal({
  isOpen,
  onClose,
  currentPmName,
  projectMembers = [],
  initialCandidateId = null,
  onConfirmReplacement,
  isSubmitting = false,
  apiError = null,
}) {
  const [selectedCandidateId, setSelectedCandidateId] = useState('')
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  if (!isOpen) return null

  // Candidates must be active members of this project, not current PM, and not CEO or HR
  const eligibleCandidates = (projectMembers || []).filter(
    (m) => {
      const roleUpper = String(m.role || '').toUpperCase()
      return (
        !m.is_current_pm &&
        !m.isPm &&
        m.name !== currentPmName &&
        m.is_active !== false &&
        roleUpper !== 'HR' &&
        roleUpper !== 'CEO'
      )
    }
  )

  const effectiveCandidateId =
    selectedCandidateId ||
    (initialCandidateId
      ? String(initialCandidateId)
      : eligibleCandidates.length === 1
        ? String(eligibleCandidates[0].user_id || eligibleCandidates[0].id)
        : '')

  const handleClose = () => {
    setSelectedCandidateId('')
    setReason('')
    setError('')
    onClose()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!effectiveCandidateId) {
      setError('Please select an eligible project member to become the new PM.')
      return
    }

    const candidate = eligibleCandidates.find(
      (c) => String(c.user_id || c.id) === String(effectiveCandidateId)
    )
    if (!candidate) {
      setError('Selected candidate is no longer eligible.')
      return
    }

    onConfirmReplacement({
      userId: Number(candidate.user_id || candidate.id),
      reason: reason.trim(),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[28px] bg-white p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-4">
          <div>
            <h2 className="text-[20px] font-black text-[#111827]">Assign / Replace Primary PM</h2>
            <p className="text-xs text-[#6b7280] mt-1">E04 POST — Executive PM Designation</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
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

        {/* Governance Alert Banner */}
        <div className="mt-4 rounded-[14px] border border-[#dbeafe] bg-[#eff6ff] p-3 text-xs text-[#1e40af]">
          <p className="font-bold">E04 Governance Rule:</p>
          <p className="mt-0.5">
            CEO designation only. The candidate <strong>must be an active member of this project</strong> and cannot be HR.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Current PM Display */}
          <div className="rounded-xl border border-[#e5e7eb] bg-[#f8fafc] p-3.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#6b7280]">Current Primary PM</p>
            <p className="text-[15px] font-black text-[#111827] mt-0.5">{currentPmName || 'Unassigned'}</p>
          </div>

          {/* Select Candidate */}
          <div>
            <label className="block text-[13px] font-bold text-[#111827] mb-2">
              Select New PM Candidate (from this project roster) <span className="text-[#ef4444]">*</span>
            </label>

            {eligibleCandidates.length > 0 ? (
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {eligibleCandidates.map((c) => {
                  const cId = String(c.user_id || c.id)
                  const isSelected = effectiveCandidateId === cId
                  return (
                    <label
                      key={cId}
                      className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition ${
                        isSelected
                          ? 'border-[#2563eb] bg-[#eff6ff]'
                          : 'border-[#e5e7eb] hover:bg-[#f8fafc]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="candidateId"
                          value={cId}
                          checked={isSelected}
                          onChange={() => {
                            setSelectedCandidateId(cId)
                            setError('')
                          }}
                          className="h-4 w-4 text-[#2563eb] focus:ring-[#2563eb]"
                        />
                        <div>
                          <p className="text-[14px] font-bold text-[#111827]">{c.name || `User #${cId}`}</p>
                          <p className="text-xs text-[#6b7280]">Current Role: {c.role || 'Member'}</p>
                        </div>
                      </div>
                    </label>
                  )
                })}
              </div>
            ) : (
              <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
                No other eligible active members on this project. Add a member first to assign them as PM.
              </p>
            )}
          </div>

          {/* Reason Input */}
          <div>
            <label className="block text-[13px] font-bold text-[#111827] mb-1">
              Assignment Reason <span className="text-[#6b7280] font-normal">(optional)</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value)
                setError('')
              }}
              disabled={isSubmitting}
              rows={2}
              placeholder="e.g., Promoted, project leadership handover, designated project lead..."
              className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2 text-[14px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
            />
            {error && <p className="mt-1 text-xs text-[#ef4444]">{error}</p>}
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-[#f1f5f9] pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded-full border border-[#e5e7eb] px-5 py-2.5 text-[14px] font-semibold text-[#4b5563] hover:bg-[#f9fafb] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || eligibleCandidates.length === 0}
              className="rounded-full bg-[#2563eb] px-6 py-2.5 text-[14px] font-semibold text-white shadow-sm hover:bg-[#1d4ed8] disabled:opacity-50"
            >
              {isSubmitting ? 'Assigning...' : 'Designate Primary PM'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReplacePmModal
