import EmployeeTableRow from './EmployeeTableRow.jsx'
import EmptyEmployeeState from './EmptyEmployeeState.jsx'

function EmployeeTable({
  employees,
  permissions,
  onEmployeeClick,
  onViewEmployee,
  onEditEmployee,
  user,
  canViewProfile = true,
}) {
  const normalizedRole = String(user?.role || '').trim().toUpperCase()
  const canonicalRole = normalizedRole === 'TEAM_LEAD'
    ? 'TL'
    : normalizedRole
  const showEmploymentStatus =
    canonicalRole === 'CEO' || canonicalRole === 'HR'

  const showActions = Boolean(
    permissions.employee.canViewProfile ||
    permissions.employee.canEditProfile
  )

  const columnCount =
    (showEmploymentStatus ? 7 : 6) +
    (showActions ? 1 : 0)

  return (
    <div className="overflow-x-auto rounded-[24px] border border-[#e5e5e5] bg-white shadow-sm">
      <table className="min-w-full border-separate border-spacing-0 text-left text-[14px]">
        <thead className="bg-[#f8fafc]">
          <tr>
            <th className="px-6 py-4 font-semibold text-[#111827]">
              Employee ID
            </th>

            <th className="px-6 py-4 font-semibold text-[#111827]">
              Employee Name
            </th>

            <th className="px-6 py-4 font-semibold text-[#111827]">
              Employee Mail ID
            </th>

            <th className="px-6 py-4 font-semibold text-[#111827]">
              Role
            </th>

            <th className="px-6 py-4 font-semibold text-[#111827]">
              Department
            </th>

            <th className="px-6 py-4 font-semibold text-[#111827]">
              Designation
            </th>

            {showEmploymentStatus && (
              <th className="px-6 py-4 font-semibold text-[#111827]">
                Employment Status
              </th>
            )}

            {showActions && (
              <th className="px-6 py-4 font-semibold text-[#111827]">
                Actions
              </th>
            )}
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
                permissions={permissions}
                onView={() => onViewEmployee(employee)}
                onEdit={() => onEditEmployee(employee)}
                showActions={showActions}
                showEmploymentStatus={showEmploymentStatus}
              />
            ))
          ) : (
            <EmptyEmployeeState colSpan={columnCount} />
          )}
        </tbody>
      </table>
    </div>
  )
}

export default EmployeeTable
