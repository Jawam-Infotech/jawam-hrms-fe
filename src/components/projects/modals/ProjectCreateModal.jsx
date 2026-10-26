import { useState } from 'react'

// Candidate pool of employees eligible to be designated as Project Manager
const PM_CANDIDATES = [
  { id: 'emp-c1', name: 'Rajesh Singh', role: 'Senior Project Manager' },
  { id: 'emp-c2', name: 'Shivani k', role: 'Team Leader / Eligible PM' },
  { id: 'emp-c3', name: 'Kanishk Prashad', role: 'Software Engineer / Eligible PM' },
  { id: 'emp-c5', name: 'Brijesh Bisht', role: 'Backend Engineer' },
]

function ProjectCreateModal({ isOpen, onClose, onCreateProject, showPmAssignment = false }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    targetEndDate: '',
    priority: 'Medium',
    staffingMode: 'TEAM', // 'TEAM' or 'SOLO'
    assignedPmId: '',
    assignedPmName: '',
  })
  const [errors, setErrors] = useState({})

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const handlePmChange = (e) => {
    const pmId = e.target.value
    const pm = PM_CANDIDATES.find((p) => p.id === pmId)
    setFormData((prev) => ({
      ...prev,
      assignedPmId: pmId,
      assignedPmName: pm ? pm.name : '',
    }))
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Project name is required'
    if (!formData.description.trim()) newErrors.description = 'Project description is required'
    if (!formData.startDate) newErrors.startDate = 'Start date is required'
    if (!formData.targetEndDate) newErrors.targetEndDate = 'Target end date is required'
    if (formData.startDate && formData.targetEndDate && formData.targetEndDate < formData.startDate) {
      newErrors.targetEndDate = 'Target end date cannot be earlier than start date'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    // Build initial members list
    const initialMembers = []
    const isSolo = formData.staffingMode === 'SOLO'

    if (formData.assignedPmId && formData.assignedPmName) {
      const candidate = PM_CANDIDATES.find((p) => p.id === formData.assignedPmId)
      initialMembers.push({
        id: formData.assignedPmId,
        name: formData.assignedPmName,
        role: candidate ? candidate.role : (isSolo ? 'Independent Contributor' : 'Project Manager'),
        projectRole: isSolo ? 'Solo Contributor' : 'Project Manager',
        isPm: !isSolo,
        isIndependent: isSolo,
        activeTasks: 0,
        projectCount: 1,
        joinedAt: new Date().toISOString(),
      })
    }

    onCreateProject({
      ...formData,
      title: formData.name,
      primaryPm: isSolo ? 'CEO Oversight' : (formData.assignedPmName || null),
      members: initialMembers,
      membersCount: initialMembers.length,
      status: 'PLANNED', // All new projects strictly start in PLANNED status
      createdAt: new Date().toISOString(),
    })
    setFormData({ name: '', description: '', startDate: '', targetEndDate: '', priority: 'Medium', staffingMode: 'TEAM', assignedPmId: '', assignedPmName: '' })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-[28px] bg-white p-8 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-4">
          <div>
            <h2 className="text-[22px] font-black text-[#111827]">Create New Project</h2>
            <p className="text-xs text-[#6b7280] mt-1">Project will be initialized in PLANNED status</p>
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
          <div>
            <label className="block text-[13px] font-bold text-[#111827] mb-1">
              Project Name <span className="text-[#ef4444]">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., HRMS Payroll & Attendance Suite"
              className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2.5 text-[14px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
            />
            {errors.name && <p className="mt-1 text-xs text-[#ef4444]">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-[13px] font-bold text-[#111827] mb-1">
              Description <span className="text-[#ef4444]">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Outline project scope, objectives, and deliverables..."
              className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2.5 text-[14px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
            />
            {errors.description && <p className="mt-1 text-xs text-[#ef4444]">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[13px] font-bold text-[#111827] mb-1">
                Start Date <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2 text-[14px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
              />
              {errors.startDate && <p className="mt-1 text-xs text-[#ef4444]">{errors.startDate}</p>}
            </div>

            <div>
              <label className="block text-[13px] font-bold text-[#111827] mb-1">
                Target End Date <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="date"
                name="targetEndDate"
                value={formData.targetEndDate}
                onChange={handleChange}
                className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2 text-[14px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
              />
              {errors.targetEndDate && <p className="mt-1 text-xs text-[#ef4444]">{errors.targetEndDate}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[13px] font-bold text-[#111827] mb-1">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2 text-[14px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-[#111827] mb-1">Staffing Mode</label>
              <select
                name="staffingMode"
                value={formData.staffingMode}
                onChange={handleChange}
                className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2 text-[14px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
              >
                <option value="TEAM">Standard Team (Requires 1 PM + ≥1 Member)</option>
                <option value="SOLO">Solo / Independent (1 Member + CEO Oversight)</option>
              </select>
            </div>
          </div>

          {/* PM or Solo Contributor Assignment — CEO Only */}
          {showPmAssignment && (
            <div>
              <label className="block text-[13px] font-bold text-[#111827] mb-1">
                {formData.staffingMode === 'SOLO'
                  ? 'Assign Solo Contributor (Independent Member)'
                  : 'Assign Project Manager'} <span className="text-[#6b7280] font-normal">(optional — can also be assigned in project details)</span>
              </label>
              <select
                value={formData.assignedPmId}
                onChange={handlePmChange}
                className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2.5 text-[14px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
              >
                <option value="">
                  {formData.staffingMode === 'SOLO'
                    ? '— Select Solo Contributor —'
                    : '— No PM yet (assign later via Add Member) —'}
                </option>
                {PM_CANDIDATES.map((pm) => (
                  <option key={pm.id} value={pm.id}>
                    {pm.name} — {pm.role}
                  </option>
                ))}
              </select>
              {formData.assignedPmName && (
                <p className="mt-1 text-[11px] text-[#059669] font-medium">
                  {formData.staffingMode === 'SOLO'
                    ? `✓ ${formData.assignedPmName} will be designated as the Solo Contributor under CEO Oversight.`
                    : `✓ ${formData.assignedPmName} will be designated as PM for this project only. PM authority is project-isolated.`}
                </p>
              )}
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
              className="rounded-full bg-[#2563eb] px-6 py-2.5 text-[14px] font-semibold text-white shadow-sm hover:bg-[#1d4ed8]"
            >
              Create Project (PLANNED)
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProjectCreateModal
