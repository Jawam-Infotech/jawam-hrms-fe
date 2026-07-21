import DashboardLayout from '../../layouts/DashboardLayout'
import { useState } from 'react'
import DashboardModeToggle from '../../components/dashboard/common/DashboardModeToggle.jsx'
import EmployeeDashboardContent from '../../components/dashboard/employee/EmployeeDashboardContent.jsx'
import HRDashboardContent from '../../components/dashboard/hr/HRDashboardContent.jsx'

function HRDashboard() {
  const [dashboardMode, setDashboardMode] = useState('employee')

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <DashboardModeToggle
          mode={dashboardMode}
          onModeChange={setDashboardMode}
          options={[
            { value: 'employee', label: 'Employee Workspace' },
            { value: 'hr', label: 'HR Workspace' },
          ]}
        />
        {dashboardMode === 'employee' ? <EmployeeDashboardContent /> : <HRDashboardContent />}
      </div>
    </DashboardLayout>
  )
}

export default HRDashboard
