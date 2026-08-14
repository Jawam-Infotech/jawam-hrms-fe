import { useContext } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import { UserContext } from '../../context/UserContext.jsx'
import AttendanceManagementPage from '../../components/attendance/AttendanceManagementPage.jsx'

function CEOAttendance() {
  const { user } = useContext(UserContext)

  return (
    <DashboardLayout>
      <AttendanceManagementPage
        user={user}
        scope="company"
        title="Company Attendance"
        subtitle="Monitor attendance across all employees."
        allowStatusEditing
      />
    </DashboardLayout>
  )
}

export default CEOAttendance
