import { useContext } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { UserContext } from '../../context/UserContext.jsx'
import AttendanceTrendChart from '../../components/shared/AttendanceTrendChart'
import AttendanceAlertsTable from '../../components/shared/AttendanceAlertsTable'
import { teamAttendanceSummary, attendanceAlerts } from '../../data/teamAttendance'

function TeamAttendance() {
  const { user } = useContext(UserContext)

  const handleExportAlerts = () => {
    // TODO: wire up to real export once services/ layer exists
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-[32px] font-black text-[#111827]">Team Attendance</h1>
            <p className="text-[16px] text-[#5f6679] mt-2">Check attendance month wise</p>
          </div>
          <div className="rounded-[18px] border border-[#e5e7eb] bg-white p-5 shadow-sm">
            <p className="text-[14px] text-[#6b7280]">Team Lead</p>
            <p className="mt-2 text-[20px] font-black text-[#111827]">{user.name}</p>
            <p className="text-[14px] text-[#6b7280] mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[18px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <p className="text-[14px] font-semibold text-[#6b7280]">Total Team Members</p>
            <p className="mt-4 text-[28px] font-black text-[#111827]">{teamAttendanceSummary.totalMembers}</p>
          </div>
          <div className="rounded-[18px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <p className="text-[14px] font-semibold text-[#6b7280]">Present Today</p>
            <p className="mt-4 text-[28px] font-black text-[#10b981]">{teamAttendanceSummary.presentToday}</p>
          </div>
          <div className="rounded-[18px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <p className="text-[14px] font-semibold text-[#6b7280]">Absent Today</p>
            <p className="mt-4 text-[28px] font-black text-[#ef4444]">{teamAttendanceSummary.absentToday}</p>
          </div>
          <div className="rounded-[18px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <p className="text-[14px] font-semibold text-[#6b7280]">Late Arrival</p>
            <p className="mt-4 text-[28px] font-black text-[#f59e0b]">{teamAttendanceSummary.lateArrival}</p>
          </div>
        </div>

        <AttendanceTrendChart />

        <AttendanceAlertsTable
          alerts={attendanceAlerts}
          variant="team"
          description="Check users with late, absent, or missing checkout events."
          onExport={handleExportAlerts}
        />
      </div>
    </DashboardLayout>
  )
}

export default TeamAttendance
