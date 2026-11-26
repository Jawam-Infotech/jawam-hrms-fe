import { useState, useEffect } from 'react'

function ProjectEditModal({ isOpen, onClose, project, onSave, isSubmitting = false, apiError = null }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    start_date: '',
    target_end_date: '',
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (project) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        name: project.name || project.title || '',
        description: project.description || '',
        start_date: project.start_date || project.startDate || '',
        target_end_date: project.target_end_date || project.targetEndDate || project.dueDate || '',
      })
      setErrors({})
    }
  }, [project, isOpen])

  if (!isOpen || !project) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}
    const trimmedName = formData.name.trim()
    if (!trimmedName) {
      newErrors.name = 'Project name is required'
    } else if (trimmedName.length > 150) {
      newErrors.name = 'Project name cannot exceed 150 characters'
    }

    if (formData.start_date && formData.target_end_date && formData.target_end_date < formData.start_date) {
      newErrors.target_end_date = 'The target end date cannot be before the start date.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate() || isSubmitting) return

    // Build payload with only modified/allowed keys
    const payload = {}
    if (formData.name.trim() !== (project.name || project.title)) {
      payload.name = formData.name.trim()
    }
    if (formData.description.trim() !== (project.description || '')) {
      payload.description = formData.description.trim()
    }
    if (formData.start_date && formData.start_date !== (project.start_date || project.startDate)) {
      payload.start_date = formData.start_date
    }
    if (formData.target_end_date && formData.target_end_date !== (project.target_end_date || project.targetEndDate || project.dueDate)) {
      payload.target_end_date = formData.target_end_date
    }

    if (Object.keys(payload).length === 0) {
      setErrors({ general: 'No project field value changed.' })
      return
    }

    onSave(payload)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[28px] bg-white p-7 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-4">
          <div>
            <h2 className="text-[20px] font-black text-[#111827]">Edit Project Information</h2>
            <p className="text-xs text-[#6b7280] mt-0.5">E03 PATCH — Update project metadata subset</p>
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

        {errors.general && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs font-semibold text-amber-800">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-[13px] font-bold text-[#111827] mb-1">
              Project Name <span className="text-[#ef4444]">*</span>
            </label>
            <input
              type="text"
              name="name"
              maxLength={150}
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2.5 text-[14px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
            />
            {errors.name && <p className="mt-1 text-xs text-[#ef4444]">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-[13px] font-bold text-[#111827] mb-1">Description</label>
            <textarea
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2.5 text-[14px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-[13px] font-bold text-[#111827] mb-1">Start Date</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2 text-[14px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[13px] font-bold text-[#111827] mb-1">Target End Date</label>
              <input
                type="date"
                name="target_end_date"
                value={formData.target_end_date}
                onChange={handleChange}
                disabled={isSubmitting}
                className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2 text-[14px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
              />
              {errors.target_end_date && <p className="mt-1 text-xs text-[#ef4444]">{errors.target_end_date}</p>}
            </div>
          </div>

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
              className="inline-flex items-center gap-2 rounded-full bg-[#2563eb] px-6 py-2 text-[14px] font-semibold text-white shadow-sm hover:bg-[#1d4ed8] disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProjectEditModal
