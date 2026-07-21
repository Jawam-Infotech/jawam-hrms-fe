import { useContext } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { UserContext } from '../../context/UserContext.jsx'
import AttendanceTrendChart from '../../components/shared/AttendanceTrendChart'
import AttendanceAlertsTable from '../../components/shared/AttendanceAlertsTable'
import { companyAttendanceSummary, allEmployeeAttendance, companyAttendanceAlerts } from '../../data/companyAttendance'

function CEOAttendance() {
  const { user } = useContext(UserContext)

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-[32px] font-black text-[#111827]">Company Attendance</h1>
            <p className="text-[16px] text-[#5f6679] mt-2">Monitor all employee attendance across departments</p>
          </div>
          <div className="rounded-[18px] border border-[#e5e7eb] bg-white p-5 shadow-sm">
            <p className="text-[14px] text-[#6b7280]">CEO</p>
            <p className="mt-2 text-[20px] font-black text-[#111827]">{user.name}</p>
            <p className="text-[14px] text-[#6b7280] mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[18px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <p className="text-[14px] font-semibold text-[#6b7280]">Total Employees</p>
            <p className="mt-4 text-[28px] font-black text-[#111827]">{companyAttendanceSummary.totalEmployees}</p>
          </div>
          <div className="rounded-[18px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <p className="text-[14px] font-semibold text-[#6b7280]">Present Today</p>
            <p className="mt-4 text-[28px] font-black text-[#10b981]">{companyAttendanceSummary.presentToday}</p>
          </div>
          <div className="rounded-[18px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <p className="text-[14px] font-semibold text-[#6b7280]">Absent Today</p>
            <p className="mt-4 text-[28px] font-black text-[#ef4444]">{companyAttendanceSummary.absent}</p>
          </div>
          <div className="rounded-[18px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <p className="text-[14px] font-semibold text-[#6b7280]">Late Arrival</p>
            <p className="mt-4 text-[28px] font-black text-[#f59e0b]">{companyAttendanceSummary.late}</p>
          </div>
        </div>

        <AttendanceTrendChart />

        <AttendanceAlertsTable
          alerts={companyAttendanceAlerts}
          variant="org"
          description="Check employees with late, absent, or missing checkout events across all departments."
        />

        <div className="rounded-[30px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
          <h2 className="text-[20px] font-black text-[#111827] mb-6">Today's Attendance Status</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#e5e7eb]">
                  <th className="px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-wider text-[#6b7280]">Name</th>
                  <th className="px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-wider text-[#6b7280]">Department</th>
                  <th className="px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-wider text-[#6b7280]">Status</th>
                  <th className="px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-wider text-[#6b7280]">Check In</th>
                  <th className="px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-wider text-[#6b7280]">Check Out</th>
                  <th className="px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-wider text-[#6b7280]">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {allEmployeeAttendance.map((emp, idx) => (
                  <tr key={idx} className="border-b border-[#f3f4f6] hover:bg-[#f9fafb] transition">
                    <td className="px-4 py-4 text-[14px] font-semibold text-[#111827]">{emp.name}</td>
                    <td className="px-4 py-4 text-[14px] text-[#6b7280]">{emp.department}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-[12px] font-semibold ${
                          emp.status === 'Present'
                            ? 'bg-[#d1fae5] text-[#10b981]'
                            : emp.status === 'Late'
                            ? 'bg-[#fef3c7] text-[#f59e0b]'
                            : 'bg-[#fee2e2] text-[#ef4444]'
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-[14px] text-[#111827]">{emp.checkIn}</td>
                    <td className="px-4 py-4 text-[14px] text-[#111827]">{emp.checkOut}</td>
                    <td className="px-4 py-4 text-[14px] text-[#6b7280]">{emp.attendance}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default CEOAttendance
