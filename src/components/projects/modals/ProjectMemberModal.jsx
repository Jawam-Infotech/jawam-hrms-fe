import { useState } from 'react'
import CapacityBadge from '../ui/CapacityBadge.jsx'

// Candidate pool for project assignment with simulated live capacity
const CANDIDATE_MEMBERS = [
  { id: 'emp-sk', name: 'Shivani k', role: 'Team Leader', activeTasks: 2, projectCount: 2 },
  { id: 'emp-kp', name: 'Kanishk Prashad', role: 'Frontend Developer', activeTasks: 2, projectCount: 1 },
  { id: 'emp-1', name: 'Aarav Sharma', role: 'UI/UX Designer', activeTasks: 1, projectCount: 1 },
  { id: 'emp-2', name: 'Priya Verma', role: 'Frontend Developer', activeTasks: 4, projectCount: 2 },
  { id: 'emp-3', name: 'Rahul Patel', role: 'Backend Engineer', activeTasks: 8, projectCount: 3 },
  { id: 'emp-4', name: 'Brijesh Bisht', role: 'Backend Engineer', activeTasks: 2, projectCount: 1 },
]

function ProjectMemberModal({ isOpen, onClose, onAddMember, existingMemberIds = [], isSolo = false, projectStatus = 'ACTIVE' }) {
  const [selectedCandidateId, setSelectedCandidateId] = useState('')
  const [memberRole, setMemberRole] = useState(isSolo ? 'INDEPENDENT' : 'TEAM_MEMBER')

  if (!isOpen) return null

  const availableCandidates = CANDIDATE_MEMBERS.filter(
    (c) => !existingMemberIds.includes(c.id) && !existingMemberIds.includes(c.name),
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    if (projectStatus !== 'ACTIVE') {
      alert('First Activation is needed! Please activate the project before adding members.')
      return
    }
    if (!selectedCandidateId) return

    const candidate = CANDIDATE_MEMBERS.find((c) => c.id === selectedCandidateId)
    if (!candidate) return

    onAddMember({
      ...candidate,
      projectRole: isSolo ? 'Independent Contributor' : (memberRole === 'PM' ? 'Project Manager' : candidate.role),
      isIndependent: isSolo || memberRole === 'INDEPENDENT',
      isPm: !isSolo && memberRole === 'PM',
      joinedAt: new Date().toISOString(),
    })

    setSelectedCandidateId('')
    onClose()
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
            className="rounded-full p-2 text-[#9ca3af] hover:bg-[#f1f5f9] hover:text-[#111827]"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {projectStatus !== 'ACTIVE' && (
            <div className="rounded-xl border border-[#fed7aa] bg-[#fffbeb] p-3 text-xs font-semibold text-[#9a3412]">
              ⚠️ First Activation is needed! You cannot add members while project is in {projectStatus} status. Please activate the project first.
            </div>
          )}
          <div>
            <label className="block text-[13px] font-bold text-[#111827] mb-2">
              Select Employee (with live capacity) <span className="text-[#ef4444]">*</span>
            </label>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {availableCandidates.map((candidate) => (
                <label
                  key={candidate.id}
                  className={`flex items-center justify-between rounded-xl border p-3 cursor-pointer transition ${
                    selectedCandidateId === candidate.id
                      ? 'border-[#2563eb] bg-[#eff6ff]'
                      : 'border-[#e5e7eb] hover:bg-[#f8fafc]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="selectedCandidate"
                      value={candidate.id}
                      checked={selectedCandidateId === candidate.id}
                      onChange={() => setSelectedCandidateId(candidate.id)}
                      className="text-[#2563eb] focus:ring-[#2563eb]"
                    />
                    <div>
                      <p className="text-[14px] font-bold text-[#111827]">{candidate.name}</p>
                      <p className="text-xs text-[#6b7280]">{candidate.role}</p>
                    </div>
                  </div>
                  <CapacityBadge
                    activeTasks={candidate.activeTasks}
                    projectCount={candidate.projectCount}
                    showDetail={true}
                  />
                </label>
              ))}
              {availableCandidates.length === 0 && (
                <p className="py-4 text-center text-xs text-[#9ca3af]">All candidate employees are already added.</p>
              )}
            </div>
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

          <div className="mt-8 flex justify-end gap-3 border-t border-[#f1f5f9] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[#e5e7eb] px-5 py-2.5 text-[14px] font-semibold text-[#4b5563] hover:bg-[#f9fafb]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedCandidateId}
              className={`rounded-full px-6 py-2.5 text-[14px] font-semibold text-white shadow-sm transition ${
                selectedCandidateId
                  ? 'bg-[#2563eb] hover:bg-[#1d4ed8]'
                  : 'cursor-not-allowed bg-[#9ca3af]'
              }`}
            >
              {isSolo ? (existingMemberIds.length === 0 ? 'Assign to Project' : 'Add Contributor') : 'Add to Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProjectMemberModal
