import { useState, useEffect, useCallback } from 'react'
import CapacityBadge from '../ui/CapacityBadge.jsx'
import { getEmployees } from '../../../services/employeeService.js'

function ProjectMemberModal({
  isOpen,
  onClose,
  onAddMember,
  existingMemberIds = [],
  isSolo = false,
  projectStatus = 'ACTIVE',
  isSubmitting = false,
  apiError = null,
}) {
  const [candidates, setCandidates] = useState([])
  const [selectedCandidateId, setSelectedCandidateId] = useState('')
  const [memberRole, setMemberRole] = useState(isSolo ? 'INDEPENDENT' : 'TEAM_MEMBER')
  const [isLoading, setIsLoading] = useState(false)
  const [fetchError, setFetchError] = useState(null)
  const [error, setError] = useState('')

  const loadEmployeeCandidates = useCallback(async () => {
    setIsLoading(true)
    setFetchError(null)

    const existingSet = new Set(
      existingMemberIds.map((id) => String(id).toLowerCase().trim())
    )

    try {
      const res = await getEmployees()
      const apiList = Array.isArray(res) ? res : (res?.employees || res?.data || res?.results || [])

      // Silently exclude CEO and HR users, and already added members
      const eligible = apiList.filter((e) => {
        const rawId = String(e.user_id || e.id || '').trim().toLowerCase()
        const name = String(e.name || '').trim().toLowerCase()
        const roleUpper = String(e.role || e.designation || '').trim().toUpperCase()

        // CEO and HR cannot be added to projects
        if (roleUpper === 'CEO' || roleUpper === 'HR') return false

        // Do not show members who are already in the project
        if (existingSet.has(rawId) || existingSet.has(name)) return false

        return true
      })

      setCandidates(eligible)
    } catch (err) {
      console.error('Failed to load employee directory:', err)
      setFetchError('Failed to load employee directory. Please check your network connection and retry.')
      setCandidates([])
    } finally {
      setIsLoading(false)
    }
  }, [existingMemberIds])

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setError('')
      setSelectedCandidateId('')
      void loadEmployeeCandidates()
    }
  }, [isOpen, loadEmployeeCandidates])

  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!selectedCandidateId) {
      setError('Please select an employee to add.')
      return
    }

    const candidate = candidates.find(
      (c) => String(c.user_id || c.id) === String(selectedCandidateId)
    )
    if (!candidate) {
      setError('Selected employee is no longer available.')
      return
    }

    const candidateRole = String(candidate?.role || '').toUpperCase()
    if (candidateRole === 'CEO' || candidateRole === 'HR') {
      setError('Executive leadership (CEO) and HR personnel cannot be added as project members.')
      return
    }

    onAddMember({
      ...candidate,
      userId: candidate.user_id || candidate.id,
      user_id: candidate.user_id || candidate.id,
      projectRole: isSolo
        ? 'Independent Contributor'
        : memberRole === 'PM'
        ? 'Project Manager'
        : candidate.role || 'Member',
      isIndependent: isSolo || memberRole === 'INDEPENDENT',
      isPm: !isSolo && memberRole === 'PM',
      joinedAt: new Date().toISOString(),
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[28px] bg-white p-8 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-4">
          <div>
            <h2 className="text-[20px] font-black text-[#111827]">
              {isSolo
                ? existingMemberIds.length === 0
                  ? 'Assign Solo Contributor'
                  : 'Add Independent Contributor'
                : 'Add Project Member'}
            </h2>
            <p className="text-xs text-[#6b7280] mt-1">
              {isSolo
                ? 'Designate an independent contributor under direct CEO oversight (no PM/TL required)'
                : 'Select an employee and configure reporting structure'}
            </p>
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

        {projectStatus === 'PLANNED' && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
            Project is in PLANNED status. Adding members here prepares the roster for activation.
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="block text-[13px] font-bold text-[#111827] mb-2">
              Select Employee <span className="text-[#ef4444]">*</span>
            </label>

            {fetchError ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
                <p className="text-xs font-semibold text-red-700">{fetchError}</p>
                <button
                  type="button"
                  onClick={loadEmployeeCandidates}
                  className="mt-2.5 inline-flex items-center gap-1 rounded-full bg-red-600 px-4 py-1.5 text-xs font-bold text-white shadow hover:bg-red-700 transition"
                >
                  ↻ Retry Loading Employees
                </button>
              </div>
            ) : isLoading ? (
              <div className="py-6 text-center text-xs text-gray-500">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent mr-2" />
                Loading employee directory...
              </div>
            ) : candidates.length > 0 ? (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {candidates.map((candidate) => {
                  const candidateId = String(candidate.user_id || candidate.id)
                  const isSelected = String(selectedCandidateId) === candidateId
                  const displayName =
                    candidate.name ||
                    `${candidate.firstName || ''} ${candidate.lastName || ''}`.trim() ||
                    `User #${candidateId}`

                  return (
                    <label
                      key={candidateId}
                      className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition ${
                        isSelected
                          ? 'border-[#2563eb] bg-[#eff6ff]'
                          : 'border-[#e5e7eb] hover:bg-[#f8fafc]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="selectedCandidate"
                          value={candidateId}
                          checked={isSelected}
                          onChange={() => {
                            setSelectedCandidateId(candidateId)
                            setError('')
                          }}
                          className="h-4 w-4 text-[#2563eb] focus:ring-[#2563eb]"
                        />
                        <div>
                          <p className="text-[14px] font-bold text-[#111827]">{displayName}</p>
                          <p className="text-xs text-[#6b7280]">
                            {candidate.designation || candidate.role || 'Staff'}
                            {candidate.email ? ` • ${candidate.email}` : ''}
                          </p>
                        </div>
                      </div>
                      <CapacityBadge
                        activeTasks={candidate.activeTasks ?? 1}
                        projectCount={candidate.projectCount ?? 1}
                        showDetail={false}
                      />
                    </label>
                  )
                })}
              </div>
            ) : (
              <p className="py-4 text-center text-xs text-[#9ca3af]">
                All candidate employees are already added.
              </p>
            )}

            {error && <p className="mt-1 text-xs text-[#ef4444]">{error}</p>}
          </div>

          {isSolo && (
            <div className="rounded-xl border border-[#ddd6fe] bg-[#f5f3ff] p-3 text-xs text-[#5b21b6]">
              <span className="font-bold">⚡ Direct Executive Assignment:</span> This contributor will be added as an <strong>Independent Contributor</strong> under direct CEO oversight. All work deliverables and changes route directly to the CEO.
            </div>
          )}

          {!isSolo && (
            <div>
              <label className="block text-[13px] font-bold text-[#111827] mb-1">
                Project Assignment Structure <span className="text-[#ef4444]">*</span>
              </label>
              <select
                value={memberRole}
                onChange={(e) => setMemberRole(e.target.value)}
                className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2.5 text-[14px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
              >
                <option value="TEAM_MEMBER">Team Member (Working under Team Lead review)</option>
                <option value="INDEPENDENT">Independent Contributor (Direct PM/CEO Approval)</option>
                <option value="PM">Designate as Project Manager (PM)</option>
              </select>
              <p className="mt-1 text-[11px] text-[#6b7280]">
                {memberRole === 'TEAM_MEMBER' && '100% deliverables route to assigned TL for review, then PM for sign-off.'}
                {memberRole === 'INDEPENDENT' && '100% deliverables route directly to PM (or CEO) with status DIRECT_APPROVAL_REQUIRED.'}
                {memberRole === 'PM' && 'Primary leadership for this project. Authority is isolated to this project only.'}
              </p>
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3 border-t border-[#f1f5f9] pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-full border border-[#e5e7eb] px-5 py-2.5 text-[14px] font-semibold text-[#4b5563] hover:bg-[#f9fafb] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isLoading || !selectedCandidateId}
              className="rounded-full bg-[#2563eb] px-6 py-2.5 text-[14px] font-semibold text-white shadow-sm hover:bg-[#1d4ed8] disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Add Member to Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProjectMemberModal
