import { useState, useEffect } from 'react'

function TLProjectRequestModal({
  isOpen,
  onClose,
  onSubmitRequest,
  initialData = null,
  isSubmitting = false,
  apiError = null,
}) {
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    proposedStartDate: '',
    proposedTargetEndDate: '',
    priority: 'Medium',
    staffingMode: 'TEAM',
    justification: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setFormData({
          projectName: initialData.name || initialData.projectName || initialData.project_name || '',
          description: initialData.description || '',
          proposedStartDate: initialData.proposed_start_date || initialData.proposedStartDate || '',
          proposedTargetEndDate: initialData.proposed_target_end_date || initialData.proposedTargetEndDate || '',
          priority: initialData.priority || 'Medium',
          staffingMode: initialData.staffing_mode || initialData.staffingMode || 'TEAM',
          justification: initialData.justification || '',
        })
      } else {
        setFormData({
          projectName: '',
          description: '',
          proposedStartDate: '',
          proposedTargetEndDate: '',
          priority: 'Medium',
          staffingMode: 'TEAM',
          justification: '',
        })
      }
      setErrors({})
    }
  }, [isOpen, initialData])

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validate = () => {
    const newErrors = {}
    if (!formData.projectName.trim()) {
      newErrors.projectName = 'Project name is required'
    } else if (formData.projectName.trim().length > 150) {
      newErrors.projectName = 'Project name cannot exceed 150 characters'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    if (!formData.proposedStartDate) {
      newErrors.proposedStartDate = 'Proposed start date is mandatory'
    }
    if (!formData.proposedTargetEndDate) {
      newErrors.proposedTargetEndDate = 'Proposed target end date is mandatory'
    }
    if (
      formData.proposedStartDate &&
      formData.proposedTargetEndDate &&
      formData.proposedTargetEndDate < formData.proposedStartDate
    ) {
      newErrors.proposedTargetEndDate = 'Proposed end date cannot be earlier than proposed start date'
    }
    if (!formData.justification.trim()) {
      newErrors.justification = 'Business justification is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate() || isSubmitting) return
    onSubmitRequest({
      name: formData.projectName.trim(),
      project_name: formData.projectName.trim(),
      description: formData.description.trim(),
      proposed_start_date: formData.proposedStartDate,
      proposed_target_end_date: formData.proposedTargetEndDate,
      priority: formData.priority,
      staffing_mode: formData.staffingMode,
      justification: formData.justification.trim(),
      requestId: initialData?.id || null,
    })
  }

  const isEditing = Boolean(initialData?.id)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-[28px] bg-white p-8 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-4">
          <div>
            <h2 className="text-[20px] font-black text-[#111827]">
              {isEditing ? 'Edit Project Creation Request' : 'Request Project Creation'}
            </h2>
            <p className="text-xs text-[#6b7280] mt-1">
              {isEditing
                ? 'Update proposed dates and project scope for CEO review and clarification'
                : 'Submit a formal project proposal with proposed timeline to the CEO for approval'}
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

        {/* Return feedback note if editing */}
        {initialData?.rejection_reason || initialData?.return_reason || initialData?.clarification_note ? (
          <div className="mt-4 rounded-[14px] border border-amber-300 bg-amber-50 p-3 text-xs text-amber-900">
            <span className="font-bold">CEO Clarification Note:</span>{' '}
            {initialData.rejection_reason || initialData.return_reason || initialData.clarification_note}
          </div>
        ) : (
          <div className="mt-4 rounded-[14px] border border-[#fef3c7] bg-[#fffbeb] px-4 py-3 text-xs text-[#92400e]">
            <span className="font-bold">Governance Rule:</span> Team Leaders must submit project proposals with mandatory proposed dates for CEO evaluation and approval. Projects cannot be created without an approved request.
          </div>
        )}

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
              disabled={isSubmitting}
              className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2.5 text-[14px] text-[#111827] focus:border-[#2563eb] focus:outline-none disabled:bg-gray-50"
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
              disabled={isSubmitting}
              className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2.5 text-[14px] text-[#111827] focus:border-[#2563eb] focus:outline-none disabled:bg-gray-50"
            />
            {errors.description && <p className="mt-1 text-xs text-[#ef4444]">{errors.description}</p>}
          </div>

          {/* Mandatory Proposed Dates */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[13px] font-bold text-[#111827] mb-1">
                Proposed Start Date <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="date"
                name="proposedStartDate"
                value={formData.proposedStartDate}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2 text-[14px] text-[#111827] focus:border-[#2563eb] focus:outline-none disabled:bg-gray-50"
              />
              {errors.proposedStartDate && <p className="mt-1 text-xs text-[#ef4444]">{errors.proposedStartDate}</p>}
            </div>
            <div>
              <label className="block text-[13px] font-bold text-[#111827] mb-1">
                Proposed Target End Date <span className="text-[#ef4444]">*</span>
              </label>
              <input
                type="date"
                name="proposedTargetEndDate"
                value={formData.proposedTargetEndDate}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2 text-[14px] text-[#111827] focus:border-[#2563eb] focus:outline-none disabled:bg-gray-50"
              />
              {errors.proposedTargetEndDate && <p className="mt-1 text-xs text-[#ef4444]">{errors.proposedTargetEndDate}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[13px] font-bold text-[#111827] mb-1">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2 text-[14px] text-[#111827] focus:border-[#2563eb] focus:outline-none disabled:bg-gray-50"
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
                disabled={isSubmitting}
                className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2 text-[14px] text-[#111827] focus:border-[#2563eb] focus:outline-none disabled:bg-gray-50"
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
              disabled={isSubmitting}
              className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2.5 text-[14px] text-[#111827] focus:border-[#2563eb] focus:outline-none disabled:bg-gray-50"
            />
            {errors.justification && <p className="mt-1 text-xs text-[#ef4444]">{errors.justification}</p>}
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
              className="rounded-full bg-[#7c3aed] px-6 py-2.5 text-[14px] font-semibold text-white shadow-sm hover:bg-[#6d28d9] disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting...' : isEditing ? 'Resubmit for CEO Review' : 'Submit to CEO for Approval'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TLProjectRequestModal
