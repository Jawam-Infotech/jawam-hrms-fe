import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { UserContext } from '../../context/UserContext.jsx'
import EmployeeHeader from '../../components/employees/EmployeeHeader.jsx'
import EmployeeSearch from '../../components/employees/EmployeeSearch.jsx'
import EmployeeToolbar from '../../components/employees/EmployeeToolbar.jsx'
import EmployeeTable from '../../components/employees/EmployeeTable.jsx'
import useEmployees from '../../hooks/useEmployees.js'
import getPermissions from '../../utils/getPermissions.js'
import { getEmployees } from '../../services/employeeService.js'

function EmployeeModule() {
  const { user } = useContext(UserContext)
  const navigate = useNavigate()
  const permissions = getPermissions(user.role)
  const { filteredEmployees, searchQuery, setSearchQuery, sortOrder, toggleSort } = useEmployees(getEmployees())

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <EmployeeHeader />
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <EmployeeSearch value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} />
          <EmployeeToolbar user={user} sortOrder={sortOrder} onSortToggle={toggleSort} />
        </div>

        <EmployeeTable
          employees={filteredEmployees}
          user={user}
          onEmployeeClick={(employeeId) => navigate(`/employees/${employeeId}`)}
          canViewProfile={permissions.employee.canViewProfile}
        />
      </div>
    </DashboardLayout>
  )
}

export default EmployeeModule
