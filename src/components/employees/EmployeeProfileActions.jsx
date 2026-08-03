import { SquarePen } from 'lucide-react'

function EmployeeProfileActions({
  permissions,
  onEdit,
}) {
  return (
    <div className="ml-auto flex flex-wrap items-center gap-3">
      {permissions.employee.canEditProfile && (
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