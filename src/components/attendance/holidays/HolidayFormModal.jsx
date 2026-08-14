import Button from '../../ui/Button.jsx'

function HolidayFormModal({
  isOpen,
  mode = 'add',
  values,
  saving = false,
  onChange,
  onSubmit,
  onClose,
}) {
  if (!isOpen) {
    return null
  }

  const isEditMode = mode === 'edit'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <form
        className="w-full max-w-xl rounded-[24px] bg-white p-8 shadow-lg"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit()
        }}
      >
        <div className="mb-6 border-b border-[#e5e7eb] pb-4">
          <h2 className="text-[24px] font-black text-[#111827]">
            {isEditMode ? 'Edit Holiday' : 'Add Holiday'}
          </h2>
          <p className="mt-2 text-[14px] text-[#5f6679]">
            {isEditMode
              ? 'Update the holiday details below.'
              : 'Create a new holiday for the company calendar.'}
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="mb-3 block text-[14px] font-bold text-[#111827]" htmlFor="holidayName">
              Holiday Name <span className="text-[#3b82f6]">*</span>
            </label>
            <input
              id="holidayName"
              name="holidayName"
              type="text"
              value={values.holidayName}
              onChange={(event) => onChange('holidayName', event.target.value)}
              placeholder="Enter holiday name"
              className="w-full rounded-[12px] border border-[#e5e7eb] bg-white px-4 py-3 text-[14px] font-semibold text-[#111827] outline-none transition-all focus:border-[#3b82f6] focus:ring-2 focus:ring-[#bfdbfe]/50"
            />
          </div>

          <div>
            <label className="mb-3 block text-[14px] font-bold text-[#111827]" htmlFor="holidayDate">
              Holiday Date <span className="text-[#3b82f6]">*</span>
            </label>
            <input
              id="holidayDate"
              name="holidayDate"
              type="date"
              value={values.holidayDate}
              onChange={(event) => onChange('holidayDate', event.target.value)}
              className="w-full rounded-[12px] border border-[#e5e7eb] bg-white px-4 py-3 text-[14px] font-semibold text-[#111827] outline-none transition-all focus:border-[#3b82f6] focus:ring-2 focus:ring-[#bfdbfe]/50"
            />
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-end gap-3">
          <Button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-full border border-[#d1d5db] bg-white px-6 py-3 text-[14px] font-bold text-[#111827] transition hover:bg-[#f9fafb] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={saving}
            className="rounded-full bg-[#3b82f6] px-6 py-3 text-[14px] font-bold text-white transition hover:bg-[#2563eb] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? 'Saving...' : isEditMode ? 'Update Holiday' : 'Save Holiday'}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default HolidayFormModal
