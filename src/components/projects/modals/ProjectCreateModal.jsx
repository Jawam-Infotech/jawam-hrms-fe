import { useState, useEffect, useCallback } from 'react'
import { getEmployees } from '../../../services/employeeService.js'

function ProjectCreateModal({
  isOpen,
  onClose,
  onCreateProject,
  userRole = 'CEO',
  showPmAssignment = false,
  isSubmitting = false,
  apiError = null,
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    targetEndDate: '',
    staffingMode: 'TEAM', // 'TEAM' or 'SOLO'
    assignedPmId: '',
    assignedPmName: '',
  })
  const [candidates, setCandidates] = useState([])
  const [isLoadingPm, setIsLoadingPm] = useState(false)
  const [pmFetchError, setPmFetchError] = useState(null)
  const [errors, setErrors] = useState({})

  const loadCandidates = useCallback(async () => {
    setIsLoadingPm(true)
    setPmFetchError(null)
    try {
      const res = await getEmployees()
      const list = Array.isArray(res) ? res : (res?.employees || res?.data || res?.results || [])
      const eligible = list.filter((e) => {
        const roleUpper = String(e.role || e.designation || '').toUpperCase()
        return roleUpper !== 'HR' && roleUpper !== 'CEO'
      })
      setCandidates(eligible)
    } catch (err) {
      console.error('Failed to load candidate employees for PM assignment:', err)
      setPmFetchError('Failed to load employee list. Please check your network connection and retry.')
      setCandidates([])
    } finally {
      setIsLoadingPm(false)
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void loadCandidates()
    }
  }, [isOpen, loadCandidates])

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
    const pm = candidates.find((p) => String(p.user_id || p.id) === String(pmId))
    setFormData((prev) => ({
      ...prev,
      assignedPmId: pmId,
      assignedPmName: pm ? (pm.name || `${pm.first_name || ''} ${pm.last_name || ''}`.trim()) : '',
    }))
  }

  const validate = () => {
    const newErrors = {}
    const trimmedName = formData.name.trim()
    if (!trimmedName) {
      newErrors.name = 'Project name is required'
    } else if (trimmedName.length > 150) {
      newErrors.name = 'Project name cannot exceed 150 characters'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Project description is required'
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required'
    }

    if (!formData.targetEndDate) {
      newErrors.targetEndDate = 'Target end date is required'
    }

    if (formData.startDate && formData.targetEndDate && formData.targetEndDate < formData.startDate) {
      newErrors.targetEndDate = 'Target end date cannot be before the start date'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate() || isSubmitting) return

    onCreateProject({
      name: formData.name.trim(),
      description: formData.description.trim(),
      start_date: formData.startDate,
      target_end_date: formData.targetEndDate,
      startDate: formData.startDate,
      targetEndDate: formData.targetEndDate,
      staffing_mode: userRole === 'CEO' ? formData.staffingMode : 'TEAM',
      staffingMode: userRole === 'CEO' ? formData.staffingMode : 'TEAM',
      assignedPmId: formData.assignedPmId,
      assignedPmName: formData.assignedPmName,
    })
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
            disabled={isSubmitting}
            className="rounded-full p-2 text-[#9ca3af] hover:bg-[#f1f5f9] hover:text-[#111827] disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        {apiError && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 font-medium">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
              placeholder="e.g., HRMS Payroll & Attendance Suite"
              className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2.5 text-[14px] text-[#111827] focus:border-[#2563eb] focus:outline-none disabled:bg-gray-50"
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
              disabled={isSubmitting}
              rows={3}
              placeholder="Outline project scope, objectives, and deliverables..."
              className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2.5 text-[14px] text-[#111827] focus:border-[#2563eb] focus:outline-none disabled:bg-gray-50"
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
                disabled={isSubmitting}
                className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2 text-[14px] text-[#111827] focus:border-[#2563eb] focus:outline-none disabled:bg-gray-50"
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
                disabled={isSubmitting}
                className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2 text-[14px] text-[#111827] focus:border-[#2563eb] focus:outline-none disabled:bg-gray-50"
              />
              {errors.targetEndDate && <p className="mt-1 text-xs text-[#ef4444]">{errors.targetEndDate}</p>}
            </div>
          </div>

          <div>
            <div>
              <label className="block text-[13px] font-bold text-[#111827] mb-1">Staffing Mode</label>
              {userRole === 'CEO' ? (
                <select
                  name="staffingMode"
                  value={formData.staffingMode}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2 text-[14px] text-[#111827] focus:border-[#2563eb] focus:outline-none disabled:bg-gray-50"
                >
                  <option value="TEAM">Standard Team (Requires 1 PM + ≥1 Member)</option>
                  <option value="SOLO">Solo / Independent (1 Member + CEO Oversight)</option>
                </select>
              ) : (
                <div className="w-full rounded-[12px] border border-gray-200 bg-gray-50 px-4 py-2 text-[14px] text-gray-700">
                  Standard Team (TL creates Team projects only)
                </div>
              )}
            </div>
          </div>

          {/* PM or Solo Contributor Assignment — CEO Only */}
          {showPmAssignment && userRole === 'CEO' && (
            <div>
              <label className="block text-[13px] font-bold text-[#111827] mb-1">
                {formData.staffingMode === 'SOLO'
                  ? 'Assign Solo Contributor (Independent Member)'
                  : 'Assign Initial Project Manager'}{' '}
                <span className="text-[#6b7280] font-normal">(optional — can also be assigned in project details)</span>
              </label>
              {pmFetchError ? (
                <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-center">
                  <p className="text-xs text-red-700">{pmFetchError}</p>
                  <button
                    type="button"
                    onClick={loadCandidates}
                    className="mt-2 inline-flex items-center gap-1 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white shadow hover:bg-red-700"
                  >
                    ↻ Retry Loading
                  </button>
                </div>
              ) : isLoadingPm ? (
                <div className="w-full rounded-[12px] border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs text-gray-500">
                  <span className="inline-block h-3.5 w-3.5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent mr-2" />
                  Loading candidate employees...
                </div>
              ) : (
                <select
                  value={formData.assignedPmId}
                  onChange={handlePmChange}
                  disabled={isSubmitting}
                  className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2.5 text-[14px] text-[#111827] focus:border-[#2563eb] focus:outline-none disabled:bg-gray-50"
                >
                  <option value="">
                    {formData.staffingMode === 'SOLO'
                      ? '— Select Solo Contributor —'
                      : '— No PM yet (assign later via Add Member) —'}
                  </option>
                  {candidates.map((pm) => {
                    const id = pm.user_id || pm.id
                    const name = pm.name || `${pm.first_name || ''} ${pm.last_name || ''}`.trim() || `User #${id}`
                    const role = pm.designation || pm.role || 'Contributor'
                    return (
                      <option key={id} value={id}>
                        {name} — {role}
                      </option>
                    )
                  })}
                </select>
              )}
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
              disabled={isSubmitting}
              className="rounded-full border border-[#e5e7eb] px-5 py-2.5 text-[14px] font-semibold text-[#4b5563] hover:bg-[#f9fafb] disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-full bg-[#2563eb] px-6 py-2.5 text-[14px] font-semibold text-white shadow-sm hover:bg-[#1d4ed8] disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Creating Project...</span>
                </>
              ) : (
                'Create Project (PLANNED)'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProjectCreateModal
