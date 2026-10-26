import { useState } from 'react'

function ProjectClosureModal({
  isOpen,
  onClose,
  project,
  isCEO = true,
  onRequestClosure,
  onApproveClosure,
  onRejectClosure,
}) {
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectBox, setShowRejectBox] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen || !project) return null

  const tasks = project.tasks || []
  const nonCancelledTasks = tasks.filter((t) => t.status !== 'CANCELLED')
  const incompleteTasks = nonCancelledTasks.filter((t) => t.status !== 'COMPLETED')
  const pendingTcrs = tasks.filter((t) => Boolean(t.changeRequest))
  const cancelledTasks = tasks.filter((t) => t.status === 'CANCELLED')

  const guardsPass = nonCancelledTasks.length > 0 && incompleteTasks.length === 0 && pendingTcrs.length === 0

  const handleConfirmReject = () => {
    if (!rejectReason.trim()) {
      setError('Please provide a mandatory decision reason for rejecting project closure.')
      return
    }
    onRejectClosure(project.id, rejectReason.trim())
    setRejectReason('')
    setShowRejectBox(false)
    setError('')
    onClose()
  }

  const handleApprove = () => {
    onApproveClosure(project.id)
    onClose()
  }

  const handleRequest = () => {
    if (onRequestClosure) onRequestClosure(project.id)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-[28px] bg-white p-7 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-4">
          <div>
            <h2 className="text-[20px] font-black text-[#111827]">
              {guardsPass ? 'Review Project Closure' : 'Project Completion Blocked'}
            </h2>
            <p className="text-xs text-[#6b7280] mt-0.5">Workflow F — Executive Project Completion Approval</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#9ca3af] hover:bg-[#f1f5f9] hover:text-[#111827]"
          >
            ✕
          </button>
        </div>

        {/* Workflow F Branch 1: GUARDS FAIL */}
        {!guardsPass ? (
          <div className="mt-5 space-y-4">
            <div className="rounded-xl border border-[#fecaca] bg-[#fef2f2] p-4 text-xs text-[#991b1b]">
              <p className="font-bold text-[13px] text-[#b91c1c]">🛑 Guards Failed — Cannot Close Project</p>
              <p className="mt-1 text-[#7f1d1d]">
                Section 9 Prerequisites enforce that every non-cancelled task must be approved COMPLETED and zero pending change requests must exist.
              </p>
            </div>

            {/* Actionable Error Reasons */}
            <div className="space-y-3">
              <p className="text-xs font-bold uppercase tracking-wider text-[#374151]">Actionable Block Reasons:</p>

              {nonCancelledTasks.length === 0 && (
                <div className="rounded-xl border border-[#fed7aa] bg-[#fffbeb] p-3 text-xs text-[#b45309]">
                  ⚠ <strong>No Tasks:</strong> This project has zero tasks defined. Create and complete deliverables first.
                </div>
              )}

              {incompleteTasks.length > 0 && (
                <div className="rounded-xl border border-[#fed7aa] bg-[#fffbeb] p-3 text-xs text-[#b45309]">
                  <p className="font-bold">
                    Incomplete Tasks ({incompleteTasks.length} non-cancelled tasks not completed):
                  </p>
                  <ul className="mt-1.5 list-disc list-inside space-y-1 text-[#92400e]">
                    {incompleteTasks.map((t) => (
                      <li key={t.id}>
                        <span className="font-semibold">{t.name}</span> — currently{' '}
                        <span className="font-mono text-[11px] underline">{t.status}</span> ({t.assignee})
                      </li>
                    ))}
                  </ul>
                  <p className="mt-1.5 text-[11px] text-[#78350f]">
                    * Note: Cancelled tasks are excluded from the completion predicate.
                  </p>
                </div>
              )}

              {pendingTcrs.length > 0 && (
                <div className="rounded-xl border border-[#fed7aa] bg-[#fffbeb] p-3 text-xs text-[#b45309]">
                  <p className="font-bold">
                    Pending Task-Change Requests ({pendingTcrs.length} unresolved):
                  </p>
                  <ul className="mt-1.5 list-disc list-inside space-y-1 text-[#92400e]">
                    {pendingTcrs.map((t) => (
                      <li key={t.id}>
                        <span className="font-semibold">{t.name}</span>: Pending {t.changeRequest?.type} requested by {t.changeRequest?.requester}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-1.5 text-[11px] text-[#78350f]">
                    Resolve or reject all pending TCRs before requesting closure.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end border-t border-[#f1f5f9] pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-[#111827] px-6 py-2 text-[14px] font-semibold text-white shadow hover:bg-black"
              >
                Understood, Return to Project
              </button>
            </div>
          </div>
        ) : (
          /* Workflow F Branch 2: GUARDS PASS */
          <div className="mt-5 space-y-4">
            {/* Prerequisite Verification Checklist */}
            <div className="rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] p-4 text-xs text-[#166534] space-y-1">
              <p className="font-bold text-[13px]">✓ Workflow F Completion Prerequisites Met:</p>
              <p className="flex items-center gap-1.5">
                <span>✔</span> Every non-cancelled task is approved COMPLETED ({nonCancelledTasks.length} tasks; {cancelledTasks.length} cancelled excluded).
              </p>
              <p className="flex items-center gap-1.5">
                <span>✔</span> Zero pending Task-Change Requests (0 pending).
              </p>
            </div>

            {/* CEO Reviews Project Deliverables */}
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#374151] mb-2">
                CEO Deliverables Review ({nonCancelledTasks.length} Tasks)
              </p>
              <div className="max-h-48 overflow-y-auto rounded-xl border border-[#e5e7eb] divide-y divide-[#f1f5f9]">
                {nonCancelledTasks.map((t) => (
                  <div key={t.id} className="p-3 text-xs flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#111827]">{t.name}</p>
                      <p className="text-[#6b7280]">Assignee: {t.assignee}</p>
                    </div>
                    {t.deliverable ? (
                      t.deliverable.type === 'LINK' ? (
                        <a
                          href={t.deliverable.value}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-full bg-[#eff6ff] px-2.5 py-1 text-[11px] font-bold text-[#2563eb] hover:bg-[#dbeafe]"
                        >
                          Deliverable Link ↗
                        </a>
                      ) : (
                        <span className="rounded-full bg-[#f1f5f9] px-2.5 py-1 text-[11px] font-semibold text-[#4b5563]">
                          File: {t.deliverable.value}
                        </span>
                      )
                    ) : (
                      <span className="text-[#9ca3af] text-[11px]">Deliverable Verified</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Rejection Form Input */}
            {showRejectBox && (
              <div className="rounded-xl border border-[#fed7aa] bg-[#fffbeb] p-3.5">
                <label className="block text-xs font-bold text-[#b45309] mb-1">
                  Mandatory Decision Reason for Rejection <span className="text-[#dc2626]">*</span>
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => {
                    setRejectReason(e.target.value)
                    if (error) setError('')
                  }}
                  rows={2}
                  placeholder="Explain incomplete criteria or deliverables requiring revision..."
                  className="w-full rounded-[10px] border border-[#fde68a] bg-white px-3 py-2 text-xs text-[#111827] focus:border-[#b45309] focus:outline-none"
                />
                {error && <p className="mt-1 text-xs text-[#dc2626] font-medium">{error}</p>}
                <p className="mt-1 text-[11px] text-[#92400e]">
                  Rejection retains ACTIVE status and records the decision reason in the audit log.
                </p>
              </div>
            )}

            {/* Footer Decision Buttons */}
            <div className="mt-6 flex justify-end gap-3 border-t border-[#f1f5f9] pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-[#e5e7eb] px-5 py-2 text-[14px] font-semibold text-[#4b5563] hover:bg-[#f9fafb]"
              >
                Cancel
              </button>

              {isCEO ? (
                !showRejectBox ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowRejectBox(true)}
                      className="rounded-full border border-[#fca5a5] bg-[#fff1f2] px-5 py-2 text-[14px] font-semibold text-[#dc2626] hover:bg-[#fee2e2]"
                    >
                      Reject & Retain ACTIVE
                    </button>
                    <button
                      type="button"
                      onClick={handleApprove}
                      className="rounded-full bg-[#10b981] px-6 py-2 text-[14px] font-semibold text-white shadow-sm hover:bg-[#059669]"
                    >
                      Approve & Mark COMPLETED
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={() => setShowRejectBox(false)}
                      className="rounded-full border border-[#e5e7eb] px-4 py-2 text-xs font-semibold text-[#6b7280]"
                    >
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={handleConfirmReject}
                      className="rounded-full bg-[#dc2626] px-5 py-2 text-[14px] font-semibold text-white hover:bg-[#b91c1c]"
                    >
                      Confirm Rejection
                    </button>
                  </>
                )
              ) : (
                <button
                  type="button"
                  onClick={handleRequest}
                  className="rounded-full bg-[#f59e0b] px-6 py-2 text-[14px] font-semibold text-white shadow-sm hover:bg-[#d97706]"
                >
                  Submit Completion Request to CEO
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectClosureModal
