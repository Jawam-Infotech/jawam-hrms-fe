import { useParams, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { UserContext } from '../../context/UserContext.jsx'
import EmployeeProfileHeader from '../../components/employees/EmployeeProfileHeader.jsx'
import EmployeeActionBar from '../../components/employees/EmployeeActionBar.jsx'
import EmployeeOverviewCards from '../../components/employees/EmployeeOverviewCards.jsx'
import AccessRestricted from '../../components/employees/AccessRestricted.jsx'
import getPermissions from '../../utils/getPermissions.js'

function EmployeeProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(UserContext)
  const permissions = getPermissions(user.role)

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

  // For manager/hr/admin show placeholder details (in real app fetch by id)
  const employee = {
    id,
    name: 'Gaurav P',
    contact: '7900865789',
    email: 'gaurav@jawaminfotech.com',
    role: 'UI/UX Engineer',
    department: 'Development',
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <button onClick={() => navigate(-1)} className="text-[#6b7280] hover:underline">← Back to Employee</button>

        <div className="flex items-center gap-6">
          <EmployeeProfileHeader employee={employee} />
          <EmployeeActionBar
            employee={employee}
            canEdit={permissions.employee.canEditProfile}
            onEdit={() => navigate('/profile')}
          />
        </div>

        <EmployeeOverviewCards employee={employee} />
      </div>
    </DashboardLayout>
  )
}

export default EmployeeProfile
