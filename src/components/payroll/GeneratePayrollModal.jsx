import { X } from 'lucide-react'
import Button from '../ui/Button.jsx'
import { getApiErrorMessage } from '../../utils/apiErrorMessage.js'
import { getPreviousCalendarMonth } from '../../utils/payrollDate.js'

function GeneratePayrollModal({
  isOpen,
  onClose,
  onGenerate,
  loading = false,
  error = null,
}) {
  const salaryMonth = getPreviousCalendarMonth()

  const handleClose = () => {
    if (loading) {
      return
    }

    onClose()
  }

  const handleSubmit = async () => {
    if (
      !salaryMonth ||
      loading
    ) {
      return
    }

    await onGenerate(salaryMonth)
  }

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="generate-payroll-title"
    >
      <div className="w-full max-w-lg rounded-[24px] bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 py-5">
          <h2
            id="generate-payroll-title"
            className="text-[22px] font-black text-[#111827]"
          >
            Generate Payroll
          </h2>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Close generate payroll dialog"
            className="rounded-full p-1 text-[#6b7280] transition hover:bg-[#f3f4f6]"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-2 p-6">
          <label
            htmlFor="generate-payroll-salary-month"
            className="block text-[13px] font-bold uppercase tracking-wider text-[#6b7280]"
          >
            Salary Month
          </label>

          <div
  id="generate-payroll-salary-month"
  className="flex h-11 items-center rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 text-[15px] font-semibold text-[#111827]"
>
  {new Date(`${salaryMonth}-01T00:00:00`).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })}
</div>

          {error && (
            <div className="rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3">
              <p className="text-[14px] font-semibold text-[#b91c1c]">
                {getApiErrorMessage(error, 'Unable to generate payroll.')}
              </p>
            </div>
          )}

        </div>

        <div className="flex justify-end gap-3 border-t border-[#e5e7eb] px-6 py-5">
          <Button
            type="button"
            onClick={handleClose}
            disabled={loading}
            className="rounded-full px-5 py-2.5 text-[14px] font-bold text-[#4b5563] transition hover:bg-[#f3f4f6]"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={
              !salaryMonth ||
              loading
            }
            className="rounded-full bg-[#2563eb] px-5 py-2.5 text-[14px] font-bold text-white transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
              ? 'Generating...'
              : 'Generate Payroll'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default GeneratePayrollModal
