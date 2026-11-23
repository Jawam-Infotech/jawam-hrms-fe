import { useState, useEffect } from 'react'
import { getEmployees } from '../../../services/employeeService.js'

function StaffingModeConvertModal({
  isOpen,
  onClose,
  project,
  existingMembers = [],
  onConfirmConversion,
  onOpenAssignPm,
  isSubmitting = false,
  apiError = null,
}) {
  const [candidateList, setCandidateList] = useState([])
  const [selectedMemberId, setSelectedMemberId] = useState('')
  const [isLoadingCandidates, setIsLoadingCandidates] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError('')
      setSelectedMemberId('')
      setIsLoadingCandidates(true)
      getEmployees()
        .then((res) => {
          const list = Array.isArray(res) ? res : (res?.employees || res?.data || res?.results || [])
          const existingIds = new Set(
            existingMembers.map((m) => String(m.user_id || m.id).toLowerCase().trim())
          )
          const existingNames = new Set(
            existingMembers.map((m) => String(m.name || '').toLowerCase().trim())
          )
          const available = list.filter((e) => {
            const rawId = String(e.id || e.user_id || '').toLowerCase().trim()
            const rawName = String(e.name || `${e.firstName || ''} ${e.lastName || ''}`).toLowerCase().trim()
            const roleUpper = String(e.role || e.designation || e.position || '').trim().toUpperCase()

            // CEO and HR cannot be added to projects
            if (roleUpper === 'CEO' || roleUpper === 'HR') return false
            if (roleUpper.includes('CEO') || roleUpper.includes('HUMAN RESOURCE')) return false

            // Do not show members who are already in the project
            if (existingIds.has(rawId) || (rawName && existingNames.has(rawName))) return false

            return true
          })
          setCandidateList(available)
        })
        .catch(() => {
          setCandidateList([])
        })
        .finally(() => {
          setIsLoadingCandidates(false)
        })
    }
  }, [isOpen, existingMembers])

  if (!isOpen || !project) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedMemberId) {
      setError('Please select an active employee to add as the team member.')
      return
    }

    onConfirmConversion(Number(selectedMemberId))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[28px] bg-white p-7 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-4">
          <div>
            <h2 className="text-[20px] font-black text-[#111827]">Convert Solo Project to Team</h2>
            <p className="text-xs text-[#6b7280] mt-0.5">E08 POST — Expand initiative into multi-member collaborative structure</p>
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

        <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs text-blue-800">
          <p className="font-bold">Staffing Conversion Rule (E08):</p>
          <p className="mt-0.5">
            Converting from Solo to Team transitions the current single contributor to Primary PM and adds a second active team member to fulfill minimum team staffing requirements.
          </p>
        </div>

        {!existingMembers.some((m) => m.is_current_pm || m.isPm) && (
          <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs text-amber-900">
            <p className="font-bold flex items-center gap-1.5">
              <span>⚠️</span> Primary PM Designation Required First (U1)
            </p>
            <p className="mt-1 text-amber-800">
              Per backend rule, the single active contributor must be designated as the Primary PM before converting to Team.
            </p>
            {onOpenAssignPm && (
              <button
                type="button"
                onClick={() => {
                  onClose()
                  onOpenAssignPm()
                }}
                className="mt-2.5 inline-flex items-center gap-1 rounded-full bg-amber-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm hover:bg-amber-700 transition"
              >
                ★ Assign Solo Member as PM Now
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-[13px] font-bold text-[#111827] mb-1">
              Select Second Team Member <span className="text-[#ef4444]">*</span>
            </label>
            {isLoadingCandidates ? (
              <p className="text-xs text-gray-500 py-2">Loading candidate employees...</p>
            ) : (
              <select
                value={selectedMemberId}
                onChange={(e) => {
                  setSelectedMemberId(e.target.value)
                  setError('')
                }}
                disabled={isSubmitting}
                className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2.5 text-[14px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
              >
                <option value="">— Select an active employee —</option>
                {candidateList.map((c) => (
                  <option key={c.id || c.user_id} value={c.id || c.user_id}>
                    {c.name || `${c.firstName || ''} ${c.lastName || ''}`.trim()} ({c.role || c.designation || 'Staff'})
                  </option>
                ))}
              </select>
            )}
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-[#f1f5f9] pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-full border border-[#e5e7eb] px-5 py-2 text-[14px] font-semibold text-[#4b5563] hover:bg-[#f9fafb] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isLoadingCandidates}
              className="rounded-full bg-[#2563eb] px-6 py-2 text-[14px] font-semibold text-white shadow-sm hover:bg-[#1d4ed8] disabled:opacity-50"
            >
              {isSubmitting ? 'Converting...' : 'Convert to Team'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default StaffingModeConvertModal
