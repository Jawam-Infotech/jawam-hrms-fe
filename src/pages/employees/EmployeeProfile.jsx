import { useParams, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { UserContext } from '../../context/UserContext.jsx'
import EmployeeProfileHeader from '../../components/employees/EmployeeProfileHeader.jsx'
import EmployeeProfileActions from '../../components/employees/EmployeeProfileActions.jsx'
import EmployeeOverviewCards from '../../components/employees/EmployeeOverviewCards.jsx'
import AccessRestricted from '../../components/employees/AccessRestricted.jsx'
import getPermissions from '../../utils/getPermissions.js'
import EmployeeOtherInformation from '../../components/employees/EmployeeOtherInformation.jsx'
import EmployeeDocuments from '../../components/employees/EmployeeDocuments.jsx'
import EmployeeAssets from '../../components/employees/EmployeeAssets.jsx'
import useEmployeeProfile from '../../hooks/useEmployeeProfile.js'
import EmployeeProfileSkeleton from '../../components/employees/EmployeeProfileSkeleton.jsx'

function EmployeeProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(UserContext)
  const permissions = getPermissions(user.role)
  const {
    employee,
    loading,
    error,
  } = useEmployeeProfile(id)

  // Restrict: employees cannot view other employees' profiles
  
  if (!permissions.employee.canViewProfile) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <button onClick={() => navigate(-1)} className="text-[#6b7280] hover:underline">← Back</button>
          <AccessRestricted
            title="Access Restricted"
            message="You cannot view other employees' profiles."
            buttonText="Go to My Profile"
            onBack={() => navigate('/profile')}
          />
        </div>
      </DashboardLayout>
    )
  }

if (loading) {
  return (
    <DashboardLayout>
    <EmployeeProfileSkeleton />
</DashboardLayout>
  )
}
if (error) {
  return (
    <DashboardLayout>
      <div className="p-6 text-red-600">{error}</div>
    </DashboardLayout>
  )
}
if (!employee) {
  return (
    <DashboardLayout>
      <div className="p-6">Employee not found.</div>
    </DashboardLayout>
  )
}

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <button onClick={() => navigate(-1)} className="text-[#6b7280] hover:underline">← Back to Employee</button>

        <div className="flex items-center gap-6">
          <EmployeeProfileHeader employee={employee} hideMissingSensitiveFields />
          <EmployeeProfileActions
            employee={employee}
            permissions={permissions}
            onEdit={() => navigate(`/employees/${employee.id}/edit`)}
            onAssignTask={() => {}}
            onViewWorkUpdates={() => {}}
          />
        </div>
        {permissions.employee.canViewEmploymentDetails && (
          <EmployeeOtherInformation employee={employee} />
        )}
        <EmployeeOverviewCards employee={employee} />

        {permissions.employee.canViewDocuments && (
  <EmployeeDocuments
    documents={employee.documents || []}
/>
)}
        {permissions.employee.canViewAssets && (
  <EmployeeAssets assets={employee.assets || []} />
)}
        

      </div>
    </DashboardLayout>
  )
}

export default EmployeeProfile
