import { Eye, Pencil } from 'lucide-react'

function EmployeeActions({ permissions, onView, onEdit }) {
  return (
    <div className="flex items-center gap-2">
      {permissions.employee.canViewProfile && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onView?.()
          }}
          className="rounded-lg p-2 text-[#5f6679] transition-colors hover:bg-[#f3f4f6] hover:text-[#2563eb]"
          title="View Employee"
        >
          <Eye size={18} />
        </button>
      )}

      {permissions.employee.canEditProfile && (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onEdit?.()
          }}
          className="rounded-lg p-2 text-[#5f6679] transition-colors hover:bg-[#f3f4f6] hover:text-[#16a34a]"
          title="Edit Employee"
        >
          <Pencil size={18} />
        </button>
      )}
    </div>
  )
}

export default EmployeeActions