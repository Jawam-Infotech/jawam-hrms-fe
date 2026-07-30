import EmployeePagination from '../../components/employees/EmployeePagination.jsx'
import { useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { UserContext } from '../../context/UserContext.jsx'
import EmployeeHeader from '../../components/employees/EmployeeHeader.jsx'
import EmployeeSearch from '../../components/employees/EmployeeSearch.jsx'
import EmployeeToolbar from '../../components/employees/EmployeeToolbar.jsx'
import EmployeeTable from '../../components/employees/EmployeeTable.jsx'
import useEmployees from '../../hooks/useEmployees.js'
import getPermissions from '../../utils/getPermissions.js'
import EmployeeModuleSkeleton from '../../components/employees/EmployeeModuleSkeleton'

function EmployeeModule() {
  const { user } = useContext(UserContext)
  const location = useLocation()
  const navigate = useNavigate()
  const permissions = getPermissions(user.role)
const {
  filteredEmployees,
  loading,
  error,

  searchQuery,
  setSearchQuery,

  sortOrder,
  toggleSort,

  roleFilter,
  setRoleFilter,

  departmentFilter,
  setDepartmentFilter,

  resetFilters,

  // Pagination
  currentPage,
  totalCount,
  totalPages,
  nextPage,
  previousPage,
  goToPage,
  goToNextPage,
  goToPreviousPage,
} = useEmployees()
const successMessage = location.state?.successMessage || ''
if (loading) {
  return (
    <DashboardLayout>
      <EmployeeModuleSkeleton />
    </DashboardLayout>
  )
}
if (error) {
  return (
    <DashboardLayout>
      <div className="flex items-center justify-center py-20">
        <p className="text-red-600">
          Failed to load employees. Please try again.
        </p>
      </div>
    </DashboardLayout>
  )
}

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {successMessage && (
          <div className="rounded-[12px] border border-[#d1fae5] bg-[#ecfdf5] px-4 py-3 text-[#166534]">
            {successMessage}
          </div>
        )}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <EmployeeHeader />
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <EmployeeSearch value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} />
          <EmployeeToolbar sortOrder={sortOrder} onSortToggle={toggleSort} roleFilter={roleFilter} onRoleChange={setRoleFilter} departmentFilter={departmentFilter} onDepartmentChange={setDepartmentFilter}   onResetFilters={resetFilters}/> 
        </div>

        <EmployeeTable
          employees={filteredEmployees}
          user={user}
          onEmployeeClick={(employeeId) => navigate(`/employees/${employeeId}`)}
          permissions={permissions}
          onViewEmployee={(employee) => navigate(`/employees/${employee.id}`)}
          onEditEmployee={(employee) => {
            navigate(`/employees/${employee.id}/edit`)
}}
  canViewProfile={permissions.employee.canViewProfile}
/>
<EmployeePagination
  currentPage={currentPage}
  totalPages={totalPages}
  totalCount={totalCount}
  hasPrevious={Boolean(previousPage)}
  hasNext={Boolean(nextPage)}
  onPrevious={goToPreviousPage}
  onNext={goToNextPage}
  onPageChange={goToPage}
/>
      </div>
    </DashboardLayout>
  )
}

export default EmployeeModule
