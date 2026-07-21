import AttendanceSummaryCard from './AttendanceSummaryCard.jsx'
import PerformanceSummaryCard from './PerformanceSummaryCard.jsx'
import ProjectsSummaryCard from './ProjectsSummaryCard.jsx'

function EmployeeOverviewCards({ employee }) {
  return (
    <div className="grid grid-cols-3 gap-6 max-[760px]:grid-cols-1">
      <AttendanceSummaryCard
        attendance={{
          percentage: '95%',
          details: 'Present 22 • Absent 1 • Late N/A',
        }}
      />
      <PerformanceSummaryCard
        performance={{
          score: '85%',
          label: 'Exceed Expectation',
          description: 'Great Job! Keep up the consistent performance',
        }}
      />
      <ProjectsSummaryCard
        projects={{
          active: '1 Project',
          details: `Current Project: ${employee.department === 'Development' ? 'HRMS Dashboard' : 'HRMS Dashboard'} • Completed Projects 4`,
        }}
      />
    </div>
  )
}

export default EmployeeOverviewCards
