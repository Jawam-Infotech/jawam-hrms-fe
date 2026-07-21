import Button from '../ui/Button.jsx'

function EmployeeActionBar({ employee, canEdit, onEdit }) {
  return (
    <div className="ml-auto flex gap-3" data-employee-id={employee.id}>
      {canEdit && (
        <Button className="rounded-full border border-[#e5e7eb] bg-white px-4 py-2 text-[14px] font-extrabold">
          View Work Updates
        </Button>
      )}
      <Button
        onClick={onEdit}
        className="rounded-full bg-[#3b82f6] px-4 py-2 text-[14px] font-extrabold text-white"
      >
        Assign Task
      </Button>
    </div>
  )
}

export default EmployeeActionBar
