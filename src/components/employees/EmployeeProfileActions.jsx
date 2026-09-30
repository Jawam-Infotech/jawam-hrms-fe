import { SquarePen } from 'lucide-react'

function EmployeeProfileActions({
  permissions,
  employee,
  currentUserRole,
  onEdit,
}) {
  const isExited =
    String(employee?.employmentStatus || '').trim().toUpperCase() === 'EXITED'

  const isHrEditingCeo =
    String(currentUserRole || '').trim().toUpperCase() === 'HR' &&
    String(employee?.role || '').trim().toUpperCase() === 'CEO'

  return (
    <div className="ml-auto flex flex-wrap items-center gap-3">
      {permissions.employee.canEditProfile &&
        !isExited &&
        !isHrEditingCeo && (
          <button
            onClick={onEdit}
            className="flex items-center gap-2 rounded-lg bg-[#16a34a] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#15803d]"
          >
            <SquarePen size={18} />
            Edit Employee
          </button>
        )}
    </div>
  )
}

export default EmployeeProfileActions