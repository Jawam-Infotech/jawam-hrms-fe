import { useState } from 'react'

function TaskChangeRequestModal({
  isOpen,
  onClose,
  task,
  currentUser,
  projectMembers = [],
  onSubmitRequest,
}) {
  const [requestType, setRequestType] = useState('DEADLINE_EXTENSION')
  const [newDueDate, setNewDueDate] = useState('')
  const [newAssigneeId, setNewAssigneeId] = useState('')
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  if (!isOpen || !task) return null

  const hasPendingRequest = Boolean(task.changeRequest)
  const eligibleMembers = projectMembers.filter(
    (m) => m.name !== task.assignee && m.id !== task.assigneeId,
  )

  const validate = () => {
    if (hasPendingRequest) {
      setError('A task-change request is already pending on this task. Multiple concurrent requests are blocked.')
      return false
    }
    if (!reason.trim()) {
      setError('A mandatory reason is required for any task-change request.')
      return false
    }
    if (requestType === 'DEADLINE_EXTENSION' && !newDueDate) {
      setError('Please select a new requested due date.')
      return false
    }
    if (requestType === 'REASSIGNMENT' && !newAssigneeId) {
      setError('Please select a replacement assignee.')
      return false
    }
    setError('')
    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    onSubmitRequest({
      taskId: task.id,
      taskName: task.name,
      requestType,
      requestedChange: {
        dueDate: requestType === 'DEADLINE_EXTENSION' ? newDueDate : null,
        newAssignee: requestType === 'REASSIGNMENT' ? newAssigneeId : null,
      },
      reason: reason.trim(),
      requester: currentUser?.name || 'Assigned Member',
      submittedAt: new Date().toISOString(),
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[28px] bg-white p-8 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-4">
          <div>
            <h2 className="text-[20px] font-black text-[#111827]">Task-Change Request</h2>
            <p className="text-xs text-[#6b7280] mt-1">{task.name}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#9ca3af] hover:bg-[#f1f5f9] hover:text-[#111827]"
          >
            ✕
          </button>
        </div>

        {/* Concurrency Protection Warning Banner (Section 8.1) */}
        {hasPendingRequest && (
          <div className="mt-4 rounded-xl border border-[#fed7aa] bg-[#fffbeb] p-3 text-xs text-[#b45309]">
            <p className="font-bold">Concurrency Protection (Section 8.1):</p>
            <p className="mt-0.5">
              This task already has a pending change request under review. Duplicate or simultaneous change requests are blocked until the current request is resolved.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-[13px] font-bold text-[#111827] mb-1">Request Type</label>
            <select
              value={requestType}
              onChange={(e) => setRequestType(e.target.value)}
              className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2 text-[14px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
            >
              <option value="DEADLINE_EXTENSION">Request Due Date Extension</option>
              <option value="TASK_DELETION">Request Task Cancellation / Deletion</option>
              <option value="REASSIGNMENT">Request Assignee Reassignment</option>
            </select>
          </div>

          {requestType === 'DEADLINE_EXTENSION' && (
            <div>
              <label className="block text-[13px] font-bold text-[#111827] mb-1">
                New Requested Due Date <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2 text-[14px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
              />
              <p className="text-[11px] text-[#6b7280] mt-1">Current due date: {task.dueDate || 'None'}</p>
            </div>
          )}

          {requestType === 'REASSIGNMENT' && (
            <div>
              <label className="block text-[13px] font-bold text-[#111827] mb-1">
                Replacement Assignee <span className="text-[#ef4444]">*</span>
              </label>
              <select
                value={newAssigneeId}
                onChange={(e) => setNewAssigneeId(e.target.value)}
                className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2 text-[14px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
              >
                <option value="">Select an active member</option>
                {eligibleMembers.map((m) => (
                  <option key={m.id || m.name} value={m.name}>
                    {m.name} ({m.role || 'Member'})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-[#6b7280] mt-1">Current assignee: {task.assignee}</p>
            </div>
          )}

          {requestType === 'TASK_DELETION' && (
            <div className="rounded-xl border border-[#fee2e2] bg-[#fff1f2] p-3 text-xs text-[#9f1239]">
              <p className="font-bold">Task Cancellation Request</p>
              <p className="mt-0.5">
                If approved, the task will be marked CANCELLED and excluded from the project progress denominator.
              </p>
            </div>
          )}

          <div>
            <label className="block text-[13px] font-bold text-[#111827] mb-1">
              Justification / Reason <span className="text-[#ef4444]">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Why is this change necessary? Detail impediments or scope adjustments..."
              className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2 text-[13px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
            />
          </div>

          {error && <p className="text-xs text-[#dc2626] font-medium">{error}</p>}

          <div className="rounded-xl bg-[#f8fafc] p-3 text-[11px] text-[#6b7280]">
            Notice: Change requests route to TL & PM (for team members) or directly to CEO (for independent contributors). HR is excluded from reviewing task modifications.
          </div>

          <div className="mt-8 flex justify-end gap-3 border-t border-[#f1f5f9] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[#e5e7eb] px-5 py-2 text-[14px] font-semibold text-[#4b5563] hover:bg-[#f9fafb]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={hasPendingRequest}
              className={`rounded-full px-6 py-2 text-[14px] font-semibold text-white shadow-sm transition ${
                hasPendingRequest
                  ? 'cursor-not-allowed bg-[#9ca3af]'
                  : 'bg-[#2563eb] hover:bg-[#1d4ed8]'
              }`}
            >
              {hasPendingRequest ? 'Pending Request Exists' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskChangeRequestModal
