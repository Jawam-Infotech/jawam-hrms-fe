import EmployeeTableRow from './EmployeeTableRow.jsx'
import EmptyEmployeeState from './EmptyEmployeeState.jsx'

function EmployeeTable({ employees, onEmployeeClick, canViewProfile = true }) {
  return (
    <div className="overflow-x-auto rounded-[24px] border border-[#e5e5e5] bg-white shadow-sm">
      <table className="min-w-full border-separate border-spacing-0 text-left text-[14px]">
        <thead className="bg-[#f8fafc]">
          <tr>
            <th className="px-6 py-4 font-semibold text-[#111827]">Employee ID</th>
            <th className="px-6 py-4 font-semibold text-[#111827]">Employee Name</th>
            <th className="px-6 py-4 font-semibold text-[#111827]">Employee Mail ID</th>
            <th className="px-6 py-4 font-semibold text-[#111827]">Designation</th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map((employee) => (
              <EmployeeTableRow
                key={employee.id}
                employee={employee}
                clickable={canViewProfile}
                onClick={() => onEmployeeClick(employee.id)}
              />
            ))
          ) : (
            <EmptyEmployeeState />
          )}
        </tbody>
      </table>
    </div>
  )
}

export default EmployeeTable
