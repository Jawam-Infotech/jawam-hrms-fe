import { useState } from 'react'
import CapacityBadge from '../ui/CapacityBadge.jsx'

function ReplacePmModal({
  isOpen,
  onClose,
  currentPmName,
  projectMembers = [],
  onConfirmReplacement,
}) {
  const [selectedCandidateId, setSelectedCandidateId] = useState('')
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  if (!isOpen) return null

  // Candidates must be active members of this project and NOT the current PM
  const eligibleCandidates = projectMembers.filter(
    (m) => (m.name !== currentPmName) && (!m.isPm),
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedCandidateId) {
      setError('Please select an eligible project member to become the new PM.')
      return
    }
    if (!reason.trim()) {
      setError('A reason for the PM replacement is required for the audit record.')
      return
    }

    const candidate = eligibleCandidates.find((c) => (c.id === selectedCandidateId || c.name === selectedCandidateId))
    if (!candidate) {
      setError('Selected candidate is no longer eligible.')
      return
    }

    onConfirmReplacement({
      candidateId: candidate.id || candidate.name,
      candidateName: candidate.name,
      previousPm: currentPmName || 'Unassigned',
      reason: reason.trim(),
    })

    setSelectedCandidateId('')
    setReason('')
    setError('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[28px] bg-white p-8 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-4">
          <div>
            <h2 className="text-[20px] font-black text-[#111827]">Replace Primary PM</h2>
            <p className="text-xs text-[#6b7280] mt-1">Workflow C — Executive Leadership Reassignment</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#9ca3af] hover:bg-[#f1f5f9] hover:text-[#111827]"
          >
            ✕
          </button>
        </div>

        {/* Governance Alert Banner */}
        <div className="mt-4 rounded-[14px] border border-[#dbeafe] bg-[#eff6ff] p-3 text-xs text-[#1e40af]">
          <p className="font-bold">Workflow C Governance Rule:</p>
          <p className="mt-0.5">
            Only the CEO can replace the Primary PM. The candidate <strong>must be an active member of this project</strong>. This change will be recorded in the audit log and PM history.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Current PM Display */}
          <div className="rounded-xl border border-[#e5e7eb] bg-[#f8fafc] p-3.5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-[#6b7280]">Current Primary PM</p>
            <p className="text-[15px] font-black text-[#111827] mt-0.5">{currentPmName || 'Unassigned'}</p>
            <p className="text-xs text-[#9ca3af] mt-0.5">Will be stepped down to regular team member</p>
          </div>

          {/* Select Candidate */}
          <div>
            <label className="block text-[13px] font-bold text-[#111827] mb-2">
              Select New PM Candidate (from this project roster) <span className="text-[#ef4444]">*</span>
            </label>

            {eligibleCandidates.length > 0 ? (
              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                {eligibleCandidates.map((c) => (
                  <label
                    key={c.id || c.name}
                    className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition ${
                      selectedCandidateId === (c.id || c.name)
                        ? 'border-[#2563eb] bg-[#eff6ff]'
                        : 'border-[#e5e7eb] hover:bg-[#f8fafc]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="candidate"
                        value={c.id || c.name}
                        checked={selectedCandidateId === (c.id || c.name)}
                        onChange={() => {
                          setSelectedCandidateId(c.id || c.name)
                          setError('')
                        }}
                        className="text-[#2563eb] focus:ring-[#2563eb]"
                      />
                      <div>
                        <p className="text-[14px] font-bold text-[#111827]">{c.name}</p>
                        <p className="text-xs text-[#6b7280]">{c.projectRole || c.role || 'Member'}</p>
                      </div>
                    </div>
                    <CapacityBadge
                      activeTasks={c.activeTasks || 1}
                      projectCount={c.projectCount || 1}
                      showDetail={true}
                    />
                  </label>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-[#d1d5db] bg-[#f9fafb] p-4 text-center text-xs text-[#6b7280]">
                ⚠ No other eligible members found in this project. Please add members to the project first before initiating replacement.
              </div>
            )}
          </div>

          {/* Reason for Replacement */}
          <div>
            <label className="block text-[13px] font-bold text-[#111827] mb-1">
              Reason for Replacement <span className="text-[#ef4444]">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value)
                setError('')
              }}
              rows={2}
              placeholder="e.g., Workload reallocation, PM transition, or sprint leadership restructure..."
              className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2.5 text-[14px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
            />
          </div>

          {error && <p className="text-xs font-semibold text-[#ef4444]">{error}</p>}

          {/* Footer Buttons */}
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
              disabled={eligibleCandidates.length === 0}
              className={`rounded-full px-6 py-2.5 text-[14px] font-semibold text-white shadow-sm transition ${
                eligibleCandidates.length > 0
                  ? 'bg-[#2563eb] hover:bg-[#1d4ed8]'
                  : 'cursor-not-allowed bg-[#9ca3af]'
              }`}
            >
              Confirm Replacement
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReplacePmModal
