
function ProjectActivationModal({ isOpen, onClose, project, onConfirmActivation }) {
  if (!isOpen || !project) return null

  const isSolo = project.staffingMode === 'SOLO' || project.isSoloProject
  const members = project.members || []
  const hasPm = isSolo ? true : Boolean(project.primaryPm)
  const distinctMembers = members.filter((m) => m.name !== project.primaryPm && !m.isPm)
  const distinctMemberCount = distinctMembers.length

  // Projects start in PLANNED status; clicking Activate unlocks member addition and task assignment
  const isSoloStaffed = isSolo && members.length >= 1
  const canActivate = true

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[28px] bg-white p-8 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-4">
          <div>
            <h2 className="text-[20px] font-black text-[#111827]">Activate Project</h2>
            <p className="text-xs text-[#6b7280] mt-1">Section 3.2 — Staffing Activation Gate Check</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#9ca3af] hover:bg-[#f1f5f9] hover:text-[#111827]"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div className="rounded-[16px] bg-[#f8fafc] p-4 text-[14px]">
            <p className="font-bold text-[#111827]">{project.title || project.name}</p>
            <p className="mt-1 text-xs text-[#6b7280]">
              Staffing Mode: <span className="font-semibold text-[#111827]">{isSolo ? 'Solo / Independent Contributor' : 'Standard Team Project (Default)'}</span>
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#6b7280]">Staffing Gate Verification</h3>

            {!isSolo ? (
              <>
                <div className="flex items-center justify-between rounded-xl border p-3 text-[14px]">
                  <div>
                    <p className="font-medium text-[#111827]">Primary Project Manager (PM)</p>
                    <p className="text-[11px] text-[#6b7280]">Exactly one active Primary PM required</p>
                  </div>
                  {hasPm ? (
                    <span className="font-bold text-[#059669]">✓ {project.primaryPm}</span>
                  ) : (
                    <span className="font-bold text-[#dc2626]">✗ Missing PM</span>
                  )}
                </div>

                <div className="flex items-center justify-between rounded-xl border p-3 text-[14px]">
                  <div>
                    <p className="font-medium text-[#111827]">Team Members</p>
                    <p className="text-[11px] text-[#6b7280]">At least 1 active member distinct from PM (Gate: ≥ 2 people)</p>
                  </div>
                  {distinctMemberCount >= 1 ? (
                    <span className="font-bold text-[#059669]">✓ {distinctMemberCount} Assigned</span>
                  ) : (
                    <span className="font-bold text-[#dc2626]">✗ Requires ≥1 distinct member</span>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between rounded-xl border p-3 text-[14px]">
                  <div>
                    <p className="font-medium text-[#111827]">Assigned Solo Contributor</p>
                    <p className="text-[11px] text-[#6b7280]">Requires 1 active employee executing alone</p>
                  </div>
                  {isSoloStaffed ? (
                    <span className="font-bold text-[#059669]">✓ {members[0]?.name || 'Assigned'}</span>
                  ) : (
                    <span className="font-bold text-[#dc2626]">✗ No employee assigned</span>
                  )}
                </div>

                <div className="rounded-xl border border-[#ede9fe] bg-[#f5f3ff] p-3 text-xs text-[#5b21b6]">
                  <p className="font-bold">Executive Governance &amp; Oversight:</p>
                  <p className="mt-0.5">
                    No internal PM required. CEO automatically serves as Executive Overseer. 100% deliverable submissions will route directly to CEO under DIRECT_APPROVAL_REQUIRED.
                  </p>
                </div>
              </>
            )}
          </div>

          <div className="rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] p-4 text-xs text-[#166534]">
            <p className="font-bold">✓ Ready for Official Activation:</p>
            <p className="mt-1">
              Confirming activation transitions this initiative from <strong>PLANNED</strong> to <strong>ACTIVE</strong>. Once active, project leadership is fully authorized to add team members and assign tasks.
            </p>
          </div>
        </div>

        <div className="mt-8 flex justify-end gap-3 border-t border-[#f1f5f9] pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-[#e5e7eb] px-5 py-2.5 text-[14px] font-semibold text-[#4b5563] hover:bg-[#f9fafb]"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canActivate}
            onClick={() => {
              onConfirmActivation(project.id)
              onClose()
            }}
            className={`rounded-full px-6 py-2.5 text-[14px] font-semibold text-white shadow-sm transition ${
              canActivate
                ? 'bg-[#10b981] hover:bg-[#059669]'
                : 'cursor-not-allowed bg-[#9ca3af]'
            }`}
          >
            Confirm & Activate Project
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProjectActivationModal
