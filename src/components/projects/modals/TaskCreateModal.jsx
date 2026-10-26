import { useState } from 'react'
import CapacityBadge from '../ui/CapacityBadge.jsx'

function TaskCreateModal({ isOpen, onClose, projectMembers = [], onCreateTask, projectStatus = 'ACTIVE', isSolo = false }) {
  const [taskData, setTaskData] = useState({
    name: '',
    description: '',
    priority: 'Medium',
    dueDate: '',
    assigneeId: '',
  })
  const [errors, setErrors] = useState({})

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setTaskData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const newErrors = {}
    if (projectStatus !== 'ACTIVE') {
      newErrors.general = 'First Activation is needed! Please activate the project before assigning tasks.'
    }
    if (!taskData.name.trim()) newErrors.name = 'Task name is required'
    if (!taskData.dueDate) newErrors.dueDate = 'Due date is required'
    if (!taskData.assigneeId) newErrors.assigneeId = 'Assignee must be an active project member'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (projectStatus !== 'ACTIVE') {
      alert('First Activation is needed! Please activate the project before assigning tasks.')
      return
    }
    if (!validate()) return

    const selectedMember = projectMembers.find((m) => (m.id || m.name) === taskData.assigneeId)

    onCreateTask({
      id: `task-${Date.now()}`,
      name: taskData.name,
      description: taskData.description,
      priority: taskData.priority,
      dueDate: taskData.dueDate,
      assignee: selectedMember?.name || 'Assigned Member',
      assigneeId: selectedMember?.id || taskData.assigneeId,
      isIndependent: isSolo || selectedMember?.isIndependent || false,
      progress: 0,
      status: 'TODO',
      reworkCount: 0,
      createdAt: new Date().toISOString(),
    })

    setTaskData({
      name: '',
      description: '',
      priority: 'Medium',
      dueDate: '',
      assigneeId: '',
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[28px] bg-white p-8 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-4">
          <div>
            <h2 className="text-[20px] font-black text-[#111827]">Create Project Task</h2>
            <p className="text-xs text-[#6b7280] mt-1">Assign tasks strictly to active members of this project</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#9ca3af] hover:bg-[#f1f5f9] hover:text-[#111827]"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {errors.general && (
            <div className="rounded-xl border border-[#fed7aa] bg-[#fffbeb] p-3 text-xs font-semibold text-[#9a3412]">
              ⚠️ {errors.general}
            </div>
          )}
          <div>
            <label className="block text-[13px] font-bold text-[#111827] mb-1">
              Task Name <span className="text-[#ef4444]">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={taskData.name}
              onChange={handleChange}
              placeholder="e.g., Integrate Biometric Punch API"
              className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2 text-[14px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
            />
            {errors.name && <p className="mt-1 text-xs text-[#ef4444]">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-[13px] font-bold text-[#111827] mb-1">Description</label>
            <textarea
              name="description"
              value={taskData.description}
              onChange={handleChange}
              rows={2}
              placeholder="Task acceptance criteria and instructions..."
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
                className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2 text-[14px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
              />
              {errors.dueDate && <p className="mt-1 text-xs text-[#ef4444]">{errors.dueDate}</p>}
            </div>

            <div>
              <label className="block text-[13px] font-bold text-[#111827] mb-1">Priority</label>
              <select
                name="priority"
                value={taskData.priority}
                onChange={handleChange}
                className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2 text-[14px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-[#111827] mb-2">
              Assignee (Active Members) <span className="text-[#ef4444]">*</span>
            </label>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {projectMembers.map((member) => (
                <label
                  key={member.id || member.name}
                  className={`flex items-center justify-between rounded-xl border p-2.5 cursor-pointer transition ${
                    taskData.assigneeId === (member.id || member.name)
                      ? 'border-[#2563eb] bg-[#eff6ff]'
                      : 'border-[#e5e7eb] hover:bg-[#f8fafc]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="assigneeId"
                      value={member.id || member.name}
                      checked={taskData.assigneeId === (member.id || member.name)}
                      onChange={handleChange}
                      className="text-[#2563eb]"
                    />
                    <div>
                      <span className="text-[13px] font-bold text-[#111827]">{member.name}</span>
                      <span className="text-xs text-[#6b7280] ml-2">({member.projectRole || member.role || 'Member'})</span>
                    </div>
                  </div>
                  <CapacityBadge
                    activeTasks={member.activeTasks || 1}
                    projectCount={member.projectCount || 1}
                    showDetail={true}
                  />
                </label>
              ))}
              {projectMembers.length === 0 && (
                <p className="py-3 text-center text-xs text-[#ef4444]">
                  No members assigned to this project yet. Please add members first.
                </p>
              )}
            </div>
            {errors.assigneeId && <p className="mt-1 text-xs text-[#ef4444]">{errors.assigneeId}</p>}
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
              type="submit"
              disabled={projectMembers.length === 0}
              className="rounded-full bg-[#2563eb] px-6 py-2.5 text-[14px] font-semibold text-white shadow-sm hover:bg-[#1d4ed8]"
            >
              Assign Task
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskCreateModal
