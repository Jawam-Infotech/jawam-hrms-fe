import Button from '../../ui/Button.jsx'

function EmployeeFormActions({ onCancel, isSubmitting, isEditMode }) {
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
        className="inline-flex items-center gap-2 rounded-full bg-[#3b82f6] px-6 py-2 text-[14px] font-extrabold text-white transition-all duration-200 hover:bg-[#2563eb] disabled:cursor-wait disabled:opacity-70"
      >
        {isSubmitting && (
          <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden="true" />
        )}
        {isSubmitting ? isEditMode ? 'Updating...' : 'Creating...' : isEditMode ? 'Update Employee' : 'Create Employee'}
      </Button>
    </div>
  )
}

export default EmployeeFormActions
