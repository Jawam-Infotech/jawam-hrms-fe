import { useState } from 'react'

function TaskChangeRequestModal({
  isOpen,
  onClose,
  task,
  projectMembers = [],
  onSubmitRequest,
  isSubmitting = false,
  apiError = null,
}) {
  const [operation, setOperation] = useState('EXTEND_DEADLINE')
  const [newDueDate, setNewDueDate] = useState('')
  const [newAssigneeId, setNewAssigneeId] = useState('')
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  if (!isOpen || !task) return null

  const hasPendingRequest = Boolean(task.changeRequest || task.open_tcr)
  const eligibleMembers = (projectMembers || []).filter(
    (m) =>
      String(m.user_id || m.id) !== String(task.assignee_id || task.assigneeId) &&
      m.role !== 'HR' &&
      m.is_active !== false
  )

  const validate = () => {
    if (hasPendingRequest) {
      setError('A Task-Change Request is already pending on this task. Multiple concurrent requests are blocked (Revision 3.6).')
      return false
    }
    if (!reason.trim()) {
      setError('A mandatory reason is required for any Task-Change Request.')
      return false
    }
    if (operation === 'EXTEND_DEADLINE') {
      if (!newDueDate) {
        setError('Please select a new requested due date.')
        return false
      }
      if (task.due_date && newDueDate <= task.due_date) {
        setError('New due date must be later than the current due date.')
        return false
      }
    }
    if (operation === 'REASSIGN' && !newAssigneeId) {
      setError('Please select a replacement assignee from active members.')
      return false
    }
    setError('')
    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate() || isSubmitting) return

    const payload = {
      operation,
      reason: reason.trim(),
    }
    if (operation === 'EXTEND_DEADLINE') {
      payload.new_due_date = newDueDate
    }
    if (operation === 'REASSIGN') {
      payload.new_assignee_id = Number(newAssigneeId)
    }

    onSubmitRequest({
      taskId: task.id,
      payload,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[28px] bg-white p-8 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-4">
          <div>
            <h2 className="text-[20px] font-black text-[#111827]">Task-Change Request</h2>
            <p className="text-xs text-[#6b7280] mt-1">E22 POST — Request deadline extension, task deletion, or reassignment</p>
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

        {hasPendingRequest && (
          <div className="mt-4 rounded-xl border border-[#fed7aa] bg-[#fffbeb] p-3 text-xs text-[#b45309]">
            <p className="font-bold">Concurrency Protection (Revision 3.6, Decision 3):</p>
            <p className="mt-0.5">
              This task already has a pending change request under review. Simultaneous change requests are blocked until resolved.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-[13px] font-bold text-[#111827] mb-1">Request Operation</label>
            <select
              value={operation}
              onChange={(e) => setOperation(e.target.value)}
              disabled={isSubmitting || hasPendingRequest}
              className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2 text-[14px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
            >
              <option value="EXTEND_DEADLINE">Extend Deadline</option>
              <option value="DELETE_TASK">Delete / Cancel Task</option>
              <option value="REASSIGN">Reassign Task</option>
            </select>
          </div>

          {operation === 'EXTEND_DEADLINE' && (
            <div>
              <label className="block text-[13px] font-bold text-[#111827] mb-1">
                New Requested Due Date <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                disabled={isSubmitting || hasPendingRequest}
                className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2 text-[14px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
              />
              <p className="mt-1 text-[11px] text-[#6b7280]">Current due date: {task.due_date || task.dueDate || 'TBD'}</p>
            </div>
          )}

          {operation === 'REASSIGN' && (
            <div>
              <label className="block text-[13px] font-bold text-[#111827] mb-1">
                New Assignee (Active Project Member) <span className="text-[#ef4444]">*</span>
              </label>
              <select
                value={newAssigneeId}
                onChange={(e) => setNewAssigneeId(e.target.value)}
                disabled={isSubmitting || hasPendingRequest}
                className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2 text-[14px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
              >
                <option value="">— Select replacement assignee —</option>
                {eligibleMembers.map((m) => (
                  <option key={m.user_id || m.id} value={m.user_id || m.id}>
                    {m.name || `User #${m.user_id || m.id}`} ({m.role || 'Member'})
                  </option>
                ))}
              </select>
            </div>
          )}

          {operation === 'DELETE_TASK' && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-800">
              Approval will cancel the task, exclude it from the project denominator, and close any pending completion reviews (M1).
            </div>
          )}

          <div>
            <label className="block text-[13px] font-bold text-[#111827] mb-1">
              Mandatory Reason <span className="text-[#ef4444]">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isSubmitting || hasPendingRequest}
              rows={3}
              placeholder="Explain the necessity for this change request..."
              className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2 text-[14px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
            />
          </div>

          {error && <p className="text-xs text-red-600 font-medium">{error}</p>}

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
              disabled={isSubmitting || hasPendingRequest}
              className="rounded-full bg-[#2563eb] px-6 py-2 text-[14px] font-semibold text-white shadow-sm hover:bg-[#1d4ed8] disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskChangeRequestModal
