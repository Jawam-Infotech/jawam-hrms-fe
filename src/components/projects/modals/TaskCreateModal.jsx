import { useState } from 'react'

function TaskCreateModal({
  isOpen,
  onClose,
  projectMembers = [],
  onCreateTask,
  projectStatus = 'ACTIVE',
  isSubmitting = false,
  apiError = null,
}) {
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    dueDate: '',
    assigneeId: '',
  })
  const [errors, setErrors] = useState({})

  if (!isOpen) return null

  const activeMembers = (projectMembers || []).filter((m) => {
    const roleUpper = String(m.role || m.projectRole || '').toUpperCase()
    return m.is_active !== false && roleUpper !== 'CEO' && roleUpper !== 'HR'
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setTaskData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const newErrors = {}
    if (projectStatus !== 'ACTIVE') {
      newErrors.general = 'Project must be in ACTIVE status before tasks can be created.'
    }
    const trimmedTitle = taskData.title.trim()
    if (!trimmedTitle) {
      newErrors.title = 'Task title is required'
    } else if (trimmedTitle.length > 150) {
      newErrors.title = 'Task title cannot exceed 150 characters'
    }
    if (!taskData.dueDate) newErrors.dueDate = 'Due date is required'
    if (!taskData.assigneeId) newErrors.assigneeId = 'Assignee must be an active project member'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate() || isSubmitting) return

    const selectedMember = activeMembers.find(
      (m) => String(m.user_id || m.id) === String(taskData.assigneeId)
    )

    onCreateTask({
      title: taskData.title.trim(),
      description: taskData.description.trim(),
      assignee_id: Number(taskData.assigneeId),
      assignee_name: selectedMember?.name || '',
      due_date: taskData.dueDate,
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[28px] bg-white p-8 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-4">
          <div>
            <h2 className="text-[20px] font-black text-[#111827]">Create Project Task</h2>
            <p className="text-xs text-[#6b7280] mt-1">E30 POST — Assign task to active project member</p>
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

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {errors.general && (
            <div className="rounded-xl border border-[#fed7aa] bg-[#fffbeb] p-3 text-xs font-semibold text-[#9a3412]">
              ⚠️ {errors.general}
            </div>
          )}
          <div>
            <label className="block text-[13px] font-bold text-[#111827] mb-1">
              Task Title <span className="text-[#ef4444]">*</span>
            </label>
            <input
              type="text"
              name="title"
              maxLength={150}
              value={taskData.title}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="e.g., Deliver OAuth authentication module"
              className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2.5 text-[14px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
            />
            {errors.title && <p className="mt-1 text-xs text-[#ef4444]">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-[13px] font-bold text-[#111827] mb-1">Description</label>
            <textarea
              name="description"
              rows={3}
              value={taskData.description}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Optional task scope and acceptance criteria..."
              className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2 text-[14px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[13px] font-bold text-[#111827] mb-1">
                Due Date <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="date"
                name="dueDate"
                value={taskData.dueDate}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2 text-[14px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
              />
              {errors.dueDate && <p className="mt-1 text-xs text-[#ef4444]">{errors.dueDate}</p>}
            </div>

            <div>
              <label className="block text-[13px] font-bold text-[#111827] mb-1">
                Assignee <span className="text-[#ef4444]">*</span>
              </label>
              <select
                name="assigneeId"
                value={taskData.assigneeId}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2 text-[14px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
              >
                <option value="">— Select active member —</option>
                {activeMembers.map((m) => (
                  <option key={m.user_id || m.id} value={m.user_id || m.id}>
                    {m.name || `User #${m.user_id || m.id}`} ({m.role || 'Member'})
                  </option>
                ))}
              </select>
              {errors.assigneeId && <p className="mt-1 text-xs text-[#ef4444]">{errors.assigneeId}</p>}
            </div>
          </div>

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
              disabled={isSubmitting}
              className="rounded-full bg-[#2563eb] px-6 py-2.5 text-[14px] font-semibold text-white shadow-sm hover:bg-[#1d4ed8] disabled:opacity-50"
            >
              {isSubmitting ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskCreateModal
