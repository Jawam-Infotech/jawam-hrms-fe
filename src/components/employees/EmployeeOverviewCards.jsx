import AttendanceSummaryCard from './AttendanceSummaryCard.jsx'
import PerformanceSummaryCard from './PerformanceSummaryCard.jsx'
import ProjectsSummaryCard from './ProjectsSummaryCard.jsx'
import useEmployeeAttendanceSummary from '../../hooks/useEmployeeAttendanceSummary.js'

function EmployeeOverviewCards({ employee }) {
  const { summary: attendanceSummary, loading: attendanceLoading, error: attendanceError } = useEmployeeAttendanceSummary(employee?.id)

  const attendance = attendanceSummary
    ? {
      percentage: `${attendanceSummary.attendance_rate ?? 0}%`,
      details: `Present ${attendanceSummary.present_days ?? 0} • Absent ${attendanceSummary.absent_days ?? 0} • Late ${attendanceSummary.late_arrival ?? 0}`,
    }
    : {
      percentage: '—',
      details: attendanceLoading
        ? 'Loading attendance summary...'
        : attendanceError
          ? 'Attendance summary unavailable.'
          : 'Attendance summary unavailable.',
    }

  return (
    <div className="grid grid-cols-3 gap-6 max-[760px]:grid-cols-1">
      <AttendanceSummaryCard attendance={attendance} />
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
