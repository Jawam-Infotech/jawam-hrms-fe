import { useState, useEffect } from 'react'

function MemberActionModal({
  isOpen,
  onClose,
  actionType = 'REMOVE', // 'REMOVE' (E06) or 'DEACTIVATE' (E07)
  member,
  projectMembers = [],
  incompleteTasks = [],
  onConfirm,
  isSubmitting = false,
  apiError = null,
}) {
  const [reason, setReason] = useState('')
  const [decisions, setDecisions] = useState({})
  const [replacementPmId, setReplacementPmId] = useState('')
  const [replacementReason, setReplacementReason] = useState('')
  const [errors, setErrors] = useState({})

  const isRemove = actionType === 'REMOVE'
  const isPm = Boolean(member?.is_current_pm || member?.isPm)

  // Eligible replacement PMs (must be an active member other than the person being removed)
  const eligibleReplacementPms = (projectMembers || []).filter(
    (m) => (m.user_id || m.id) !== (member?.user_id || member?.id) && m.role !== 'HR'
  )

  // Eligible task reassignment targets (other active members)
  const eligibleAssignees = (projectMembers || []).filter(
    (m) => (m.user_id || m.id) !== (member?.user_id || member?.id)
  )

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setReason('')
      setReplacementPmId('')
      setReplacementReason('')
      setErrors({})

      // Initialize default decisions for any incomplete tasks
      const initialDecisions = {}
      ;(incompleteTasks || []).forEach((t) => {
        initialDecisions[t.id] = {
          action: 'reassign',
          assignee_id: eligibleAssignees[0]?.user_id || eligibleAssignees[0]?.id || '',
          reason: '',
        }
      })
      setDecisions(initialDecisions)
    }
  }, [isOpen, member]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen || !member) return null

  const handleDecisionChange = (taskId, field, value) => {
    setDecisions((prev) => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        [field]: value,
      },
    }))
  }

  const validate = () => {
    const newErrors = {}

    if (isPm) {
      if (!replacementPmId) {
        newErrors.replacementPmId = 'Removing/deactivating the Primary PM requires selecting a replacement PM.'
      }
      if (!replacementReason.trim()) {
        newErrors.replacementReason = 'A reason for replacing the PM is required.'
      }
    }

    // Validate incomplete task decisions
    incompleteTasks.forEach((t) => {
      const d = decisions[t.id]
      if (!d || !d.action) {
        newErrors[`task_${t.id}`] = `Task "${t.title || t.name}" requires a decision.`
      } else if (d.action === 'reassign' && !d.assignee_id) {
        newErrors[`task_${t.id}`] = `Task "${t.title || t.name}" requires an assignee for reassignment.`
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate() || isSubmitting) return

    const decisionsList = incompleteTasks.map((t) => {
      const d = decisions[t.id]
      const item = {
        task_id: Number(t.id),
        action: d.action,
      }
      if (d.action === 'reassign') {
        item.assignee_id = Number(d.assignee_id)
      }
      if (d.reason?.trim()) {
        item.reason = d.reason.trim()
      }
      return item
    })

    const payload = {
      reason: reason.trim() || (isRemove ? 'Permanently removed from project' : 'Deactivated in project'),
      decisions: decisionsList,
    }

    if (isPm && replacementPmId) {
      payload.replacement_pm_id = Number(replacementPmId)
      payload.replacement_reason = replacementReason.trim()
    }

    onConfirm({
      userId: member.user_id || member.id,
      payload,
      actionType,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[28px] bg-white p-7 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-4">
          <div>
            <h2 className="text-[20px] font-black text-[#111827]">
              {isRemove ? 'Delete Member from Project' : 'Deactivate Project Member'}
            </h2>
            <p className="text-xs text-[#6b7280] mt-0.5">
              {isRemove ? 'Permanently remove this member from the project roster' : 'E07 POST — Inactive status transition'}
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

        {/* Member Profile Banner */}
        <div className="mt-4 rounded-xl bg-[#f8fafc] border border-[#e5e7eb] p-3.5 flex items-center justify-between">
          <div>
            <p className="text-sm font-bold text-[#111827]">{member.name || `User #${member.user_id}`}</p>
            <p className="text-xs text-[#6b7280]">Role: {member.role || 'Member'} {isPm ? '• Primary PM' : ''}</p>
          </div>
          <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
            isRemove ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
          }`}>
            {isRemove ? 'Permanent Delete' : 'Deactivation'}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Reason Input */}
          <div>
            <label className="block text-[13px] font-bold text-[#111827] mb-1">
              {isRemove ? 'Reason for Deletion' : 'Deactivation Reason'}{' '}
              <span className="text-[#6b7280] font-normal">(optional)</span>
            </label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isSubmitting}
              placeholder={isRemove ? 'Optional reason for the audit trail...' : 'Optional reason for deactivation...'}
              className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2.5 text-[14px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
            />
            {errors.reason && <p className="mt-1 text-xs text-[#ef4444]">{errors.reason}</p>}
          </div>

          {/* PM Replacement (if member is Primary PM) */}
          {isPm && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 space-y-3">
              <p className="text-xs font-bold text-amber-900 uppercase">Primary PM Successor Required</p>
              <div>
                <label className="block text-xs font-semibold text-amber-800 mb-1">Select Replacement PM *</label>
                <select
                  value={replacementPmId}
                  onChange={(e) => setReplacementPmId(e.target.value)}
                  disabled={isSubmitting}
                  className="w-full rounded-lg border border-amber-300 bg-white px-3 py-2 text-xs text-gray-800"
                >
                  <option value="">— Select replacement PM —</option>
                  {eligibleReplacementPms.map((m) => (
                    <option key={m.user_id || m.id} value={m.user_id || m.id}>
                      {m.name || `User #${m.user_id || m.id}`} ({m.role})
                    </option>
                  ))}
                </select>
                {errors.replacementPmId && <p className="mt-1 text-xs text-red-600">{errors.replacementPmId}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-amber-800 mb-1">Replacement Reason *</label>
                <input
                  type="text"
                  value={replacementReason}
                  onChange={(e) => setReplacementReason(e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Reason for designating this replacement PM..."
                  className="w-full rounded-lg border border-amber-300 bg-white px-3 py-2 text-xs text-gray-800"
                />
                {errors.replacementReason && <p className="mt-1 text-xs text-red-600">{errors.replacementReason}</p>}
              </div>
            </div>
          )}

          {/* Incomplete Tasks Decisions */}
          {incompleteTasks.length > 0 && (
            <div className="space-y-3 border-t border-[#f1f5f9] pt-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wider text-[#374151]">
                  Incomplete Tasks ({incompleteTasks.length} Require Decisions)
                </p>
                <span className="text-[11px] text-[#6b7280]">Per Section 5.6 &amp; 9.4A</span>
              </div>

              <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                {incompleteTasks.map((task) => (
                  <div key={task.id} className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-900">{task.title || task.name}</span>
                      <span className="text-[10px] rounded bg-gray-200 px-1.5 py-0.5">{task.status}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] text-gray-600 mb-0.5">Action</label>
                        <select
                          value={decisions[task.id]?.action || 'reassign'}
                          onChange={(e) => handleDecisionChange(task.id, 'action', e.target.value)}
                          className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs"
                        >
                          <option value="reassign">Reassign to Member</option>
                          <option value="cancel">Cancel Task (M1)</option>
                        </select>
                      </div>

                      {decisions[task.id]?.action === 'reassign' && (
                        <div>
                          <label className="block text-[11px] text-gray-600 mb-0.5">New Assignee *</label>
                          <select
                            value={decisions[task.id]?.assignee_id || ''}
                            onChange={(e) => handleDecisionChange(task.id, 'assignee_id', e.target.value)}
                            className="w-full rounded border border-gray-300 bg-white px-2 py-1 text-xs"
                          >
                            <option value="">— Select assignee —</option>
                            {eligibleAssignees.map((m) => (
                              <option key={m.user_id || m.id} value={m.user_id || m.id}>
                                {m.name || `User #${m.user_id || m.id}`}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                    {errors[`task_${task.id}`] && (
                      <p className="text-[11px] text-red-600">{errors[`task_${task.id}`]}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

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
              disabled={isSubmitting}
              className={`rounded-full px-6 py-2 text-[14px] font-semibold text-white shadow-sm disabled:opacity-50 ${
                isRemove ? 'bg-red-600 hover:bg-red-700' : 'bg-amber-600 hover:bg-amber-700'
              }`}
            >
              {isSubmitting ? 'Processing...' : isRemove ? 'Permanently Delete Member' : 'Confirm Deactivation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default MemberActionModal
