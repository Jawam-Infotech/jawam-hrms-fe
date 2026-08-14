import { useContext } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import { UserContext } from '../../context/UserContext.jsx'
import AttendanceManagementPage from '../../components/attendance/AttendanceManagementPage.jsx'

function TeamAttendance() {
  const { user } = useContext(UserContext)

  return (
    <DashboardLayout>
      <AttendanceManagementPage
        user={user}
        scope="team"
        title="Team Attendance"
        subtitle="Monitor attendance across your direct reports."
        allowStatusEditing={false}
      />
    </DashboardLayout>
  )
}

export default TeamAttendance
