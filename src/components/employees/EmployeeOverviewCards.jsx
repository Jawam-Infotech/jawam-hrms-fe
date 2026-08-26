import AttendanceSummaryCard from './AttendanceSummaryCard.jsx'
import useEmployeeAttendanceSummary from '../../hooks/useEmployeeAttendanceSummary.js'

function EmployeeOverviewCards({ employee }) {
  const {
    summary: attendanceSummary,
    loading: attendanceLoading,
    error: attendanceError,
  } = useEmployeeAttendanceSummary(employee?.id)

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
    <div className="grid grid-cols-1 gap-6">
      <AttendanceSummaryCard attendance={attendance} />
    </div>
  )
}

export default EmployeeOverviewCards