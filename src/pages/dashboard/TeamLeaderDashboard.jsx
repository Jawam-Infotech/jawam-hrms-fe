import { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import DashboardModeToggle from '../../components/dashboard/common/DashboardModeToggle.jsx'
import EmployeeDashboardContent from '../../components/dashboard/employee/EmployeeDashboardContent.jsx'
import TeamLeaderDashboardContent from '../../components/dashboard/teamleader/TeamLeaderDashboardContent.jsx'

function TeamLeaderDashboard() {
  const [dashboardMode, setDashboardMode] = useState('employee')

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <DashboardModeToggle
          mode={dashboardMode}
          onModeChange={setDashboardMode}
          options={[
            { value: 'employee', label: 'Employee Workspace' },
            { value: 'teamleader', label: 'Team Leader Workspace' },
          ]}
        />

        {dashboardMode === 'employee' ? <EmployeeDashboardContent /> : <TeamLeaderDashboardContent />}
      </div>
    </DashboardLayout>
  )
}

export default TeamLeaderDashboard
