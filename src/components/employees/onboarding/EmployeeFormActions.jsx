import Button from '../../ui/Button.jsx'

function EmployeeFormActions({ onCancel, isSubmitting }) {
  return (
    <div className="flex flex-col gap-3 rounded-[24px] border border-[#e5e5e5] bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-end">
      <Button
        type="button"
        onClick={onCancel}
        className="rounded-full bg-white px-6 py-2 text-[14px] font-extrabold text-[#111827] transition-all duration-200 hover:bg-[#f9fafb]"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={isSubmitting}
        className="rounded-full bg-[#3b82f6] px-6 py-2 text-[14px] font-extrabold text-white transition-all duration-200 hover:bg-[#2563eb] disabled:cursor-wait disabled:opacity-70"
      >
        {isSubmitting ? 'Creating...' : 'Create Employee'}
      </Button>
    </div>
  )
}

export default EmployeeFormActions
