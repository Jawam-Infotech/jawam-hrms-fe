import { useState } from 'react'

function TLProjectRequestModal({ isOpen, onClose, onSubmitRequest, tlName }) {
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    priority: 'Medium',
    staffingMode: 'TEAM',
    justification: '',
  })
  const [errors, setErrors] = useState({})

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.projectName.trim()) newErrors.projectName = 'Project name is required'
    if (!formData.description.trim()) newErrors.description = 'Description is required'
    if (!formData.justification.trim()) newErrors.justification = 'Business justification is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    onSubmitRequest({
      id: `tlreq-${Date.now()}`,
      requestedBy: tlName || 'Team Leader',
      projectName: formData.projectName,
      description: formData.description,
      priority: formData.priority,
      staffingMode: formData.staffingMode,
      justification: formData.justification,
      status: 'PENDING_CEO_APPROVAL',
      submittedAt: new Date().toLocaleString(),
    })
    setFormData({ projectName: '', description: '', priority: 'Medium', staffingMode: 'TEAM', justification: '' })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-[28px] bg-white p-8 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-4">
          <div>
            <h2 className="text-[20px] font-black text-[#111827]">Request Project Creation</h2>
            <p className="text-xs text-[#6b7280] mt-1">
              This request will be sent to the CEO for approval. You cannot create until granted permission.
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

        {/* Governance reminder banner */}
        <div className="mt-4 rounded-[14px] border border-[#fef3c7] bg-[#fffbeb] px-4 py-3 text-xs text-[#92400e]">
          <span className="font-bold">Per Locked Rule:</span> A Team Leader cannot create projects unless the CEO explicitly grants project-creation permission. Submit this request — CEO will approve or deny.
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-[13px] font-bold text-[#111827] mb-1">
              Project Name <span className="text-[#ef4444]">*</span>
            </label>
            <input
              type="text"
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              placeholder="e.g., Customer Portal Redesign"
              className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2.5 text-[14px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
            />
            {errors.projectName && <p className="mt-1 text-xs text-[#ef4444]">{errors.projectName}</p>}
          </div>

          <div>
            <label className="block text-[13px] font-bold text-[#111827] mb-1">
              Description <span className="text-[#ef4444]">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={2}
              placeholder="Briefly describe the project scope and deliverables..."
              className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2.5 text-[14px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
            />
            {errors.description && <p className="mt-1 text-xs text-[#ef4444]">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
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
                <option value="TEAM">Standard Team</option>
                <option value="SOLO">Solo / Independent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-bold text-[#111827] mb-1">
              Business Justification <span className="text-[#ef4444]">*</span>
            </label>
            <textarea
              name="justification"
              value={formData.justification}
              onChange={handleChange}
              rows={2}
              placeholder="Why is this project needed? What is the business impact?"
              className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2.5 text-[14px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
            />
            {errors.justification && <p className="mt-1 text-xs text-[#ef4444]">{errors.justification}</p>}
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t border-[#f1f5f9] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[#e5e7eb] px-5 py-2.5 text-[14px] font-semibold text-[#4b5563] hover:bg-[#f9fafb]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-full bg-[#7c3aed] px-6 py-2.5 text-[14px] font-semibold text-white shadow-sm hover:bg-[#6d28d9]"
            >
              Submit to CEO for Approval
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TLProjectRequestModal
