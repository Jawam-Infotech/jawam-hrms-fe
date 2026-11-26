import DashboardLayout from '../../layouts/DashboardLayout'
import EmployeeDashboardContent from '../../components/dashboard/employee/EmployeeDashboardContent.jsx'
import DashboardCelebrationCoordinator from '../../components/dashboard/common/DashboardCelebrationCoordinator.jsx'

function EmployeeDashboard() {
  return (
    <DashboardLayout>
      <DashboardCelebrationCoordinator />
      <EmployeeDashboardContent />
    </DashboardLayout>
  )
}

export default EmployeeDashboard
