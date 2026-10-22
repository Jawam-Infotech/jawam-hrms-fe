import { X } from 'lucide-react'
import { useState } from 'react'
import DatePicker from '../ui/DatePicker.jsx'
import FieldError from '../ui/FieldError.jsx'
import EmployeeSelector from './EmployeeSelector.jsx'
import { getApiErrorMessage } from '../../utils/apiErrorMessage.js'

const INITIAL_FORM = {
  employee: '',
  new_salary: '',
  annual_ctc: '',
  effective_date: '',
  reason: '',
}

function CreateSalaryRevisionModal({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  error = null,
}) {
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [fieldErrors, setFieldErrors] = useState({})
  const handleChange = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }))

    setFieldErrors((current) => ({
      ...current,
      [field]: undefined,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const errors = {}

    if (!formData.employee) {
      errors.employee = 'Employee is required.'
    }

    if (!formData.new_salary) {
      errors.new_salary = 'New salary is required.'
    }

    if (!formData.effective_date) {
      errors.effective_date = 'Effective date is required.'
    }

    if (!formData.reason.trim()) {
      errors.reason = 'Reason is required.'
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      return
    }

    await onSubmit({
      employee: formData.employee,
      monthly_salary: formData.new_salary,
      ...(formData.annual_ctc.trim() ? { annual_ctc: formData.annual_ctc.trim() } : {}),
      effective_from: formData.effective_date,
      reason: formData.reason.trim(),
    })
  }

  const getFormError = () => {
    if (!error) {
      return null
    }

    return getApiErrorMessage(error, 'Unable to create salary revision.')
  }

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-salary-revision-title"
    >
      <form
        onSubmit={handleSubmit}
        className="flex max-h-[calc(100vh-2rem)] w-full max-w-2xl flex-col overflow-visible rounded-[24px] bg-white shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 py-5">
          <div>
            <h2
              id="create-salary-revision-title"
              className="text-[22px] font-black text-[#111827]"
            >
              Create Salary Revision
            </h2>

            <p className="mt-1 text-[14px] text-[#6b7280]">
              Create a new salary revision for an employee.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            aria-label="Close salary revision form"
            className="rounded-full p-1 text-[#6b7280] transition hover:bg-[#f3f4f6] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Content */}
        <div className="min-h-0 flex-1 space-y-6 overflow-visible p-6">
          {/* API Error */}
          {getFormError() && (
            <div className="rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3">
              <p className="text-[14px] font-semibold text-[#b91c1c]">
                {getFormError()}
              </p>
            </div>
          )}

          {/* Employee */}
          <div>
            <label
              htmlFor="salary-revision-employee"
              className="mb-2 block text-[13px] font-bold uppercase tracking-wider text-[#6b7280]"
            >
              Employee <span className="text-red-500">*</span>
            </label>

            <EmployeeSelector
              id="salary-revision-employee"
              onChange={(employeeId) =>
                handleChange('employee', employeeId)
              }
              disabled={loading}
            />

            <FieldError message={fieldErrors.employee} />
          </div>

          {/* New Salary */}
          <div>
            <label
              htmlFor="salary-revision-new-salary"
              className="mb-2 block text-[13px] font-bold uppercase tracking-wider text-[#6b7280]"
            >
              New Salary <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <input
                id="salary-revision-new-salary"
                type="number"
                value={formData.new_salary}
                onChange={(event) =>
                  handleChange('new_salary', event.target.value)
                }
                placeholder="Enter new salary"
                inputMode="decimal"
                disabled={loading}
                className="min-h-11 w-full rounded-xl border border-[#d1d5db] bg-white px-4 py-2 text-[15px] font-semibold text-[#111827] outline-none transition placeholder:font-normal placeholder:text-[#9ca3af] focus:border-[#2563eb] disabled:cursor-not-allowed disabled:bg-[#f9fafb]"
              />
            </div>

            <FieldError message={fieldErrors.new_salary} />
          </div>

          {/* Effective Date */}
          <div>
            <label
              htmlFor="salary-revision-annual-ctc"
              className="mb-2 block text-[13px] font-bold uppercase tracking-wider text-[#6b7280]"
            >
              Annual CTC
            </label>

            <input
              id="salary-revision-annual-ctc"
              type="number"
              min="0"
              step="0.01"
              value={formData.annual_ctc}
              onChange={(event) => handleChange('annual_ctc', event.target.value)}
              placeholder="Enter annual CTC"
              inputMode="decimal"
              disabled={loading}
              className="min-h-11 w-full rounded-xl border border-[#d1d5db] bg-white px-4 py-2 text-[15px] font-semibold text-[#111827] outline-none transition placeholder:font-normal placeholder:text-[#9ca3af] focus:border-[#2563eb] disabled:cursor-not-allowed disabled:bg-[#f9fafb]"
            />

            <FieldError message={fieldErrors.annual_ctc} />
          </div>

          {/* Effective Date */}
          <div>
            <label
              className="mb-2 block text-[13px] font-bold uppercase tracking-wider text-[#6b7280]"
            >
              Effective Date <span className="text-red-500">*</span>
            </label>

            <DatePicker
              value={formData.effective_date}
              onChange={(value) =>
                handleChange('effective_date', value)
              }
              disabled={loading}
              ariaLabel="Effective date"
            />

            <FieldError message={fieldErrors.effective_date} />
          </div>

          {/* Request Reason */}
          <div>
            <label
              htmlFor="salary-revision-reason"
              className="mb-2 block text-[13px] font-bold uppercase tracking-wider text-[#6b7280]"
            >
              Reason <span className="text-red-500">*</span>
            </label>

            <textarea
              id="salary-revision-reason"
              value={formData.reason}
              onChange={(event) =>
                handleChange('reason', event.target.value)
              }
              rows={4}
              placeholder="Explain the reason for this salary revision"
              disabled={loading}
              className="w-full resize-none rounded-xl border border-[#d1d5db] bg-white px-4 py-3 text-[15px] font-medium text-[#111827] outline-none transition placeholder:font-normal placeholder:text-[#9ca3af] focus:border-[#2563eb] disabled:cursor-not-allowed disabled:bg-[#f9fafb]"
            />

            <FieldError message={fieldErrors.reason} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap justify-end gap-3 border-t border-[#e5e7eb] px-6 py-5">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-full px-5 py-2.5 text-[14px] font-bold text-[#4b5563] transition hover:bg-[#f3f4f6] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-[#2563eb] px-5 py-2.5 text-[14px] font-bold text-white transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Revision'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default CreateSalaryRevisionModal
