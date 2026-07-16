import { useState } from 'react'

export default function AttendanceAlertsTable({ alerts, variant = 'team', description, onExport }) {
  const [filterDepartment, setFilterDepartment] = useState('All')

  if (variant === 'org') {
    const departments = ['All', ...new Set(alerts.map((a) => a.department))]
    const filteredAlerts = filterDepartment === 'All' ? alerts : alerts.filter((a) => a.department === filterDepartment)

    return (
      <div className="rounded-[30px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-[20px] font-black text-[#111827]">Attendance Alerts</h2>
            <p className="text-[14px] text-[#6b7280]">{description}</p>
          </div>
          <select
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
            className="px-4 py-2 rounded-full border border-[#e5e7eb] bg-white text-[14px] font-semibold text-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#3b82f6]"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#e5e7eb]">
                <th className="px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-wider text-[#6b7280]">Employee</th>
                <th className="px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-wider text-[#6b7280]">Department</th>
                <th className="px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-wider text-[#6b7280]">Issue</th>
                <th className="px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-wider text-[#6b7280]">Reliability</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.map((alert) => (
                <tr key={alert.id} className="border-b border-[#f3f4f6] hover:bg-[#f9fafb] transition">
                  <td className="px-4 py-4 text-[14px] font-semibold text-[#111827]">{alert.name}</td>
                  <td className="px-4 py-4 text-[14px] text-[#6b7280]">{alert.department}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-[12px] font-semibold ${
                        alert.issue === 'Late'
                          ? 'bg-[#fef3c7] text-[#f59e0b]'
                          : alert.issue === 'Absent'
                          ? 'bg-[#fee2e2] text-[#ef4444]'
                          : 'bg-[#dbeafe] text-[#3b82f6]'
                      }`}
                    >
                      {alert.issue}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-[14px] font-semibold text-[#111827]">{alert.reliability}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  // Team variant
  return (
    <div className="rounded-[30px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-[20px] font-black text-[#111827]">Attendance Alerts</h2>
          <p className="text-[14px] text-[#6b7280]">{description}</p>
        </div>
        <button type="button" onClick={onExport} className="rounded-full bg-[#3b82f6] px-5 py-3 text-[14px] font-extrabold text-white hover:bg-[#2563eb] transition-all">
          Export alerts
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-[14px] text-[#111827]">
          <thead>
            <tr className="border-b border-[#e5e7eb] text-[#6b7280]">
              <th className="py-4">Employee ID</th>
              <th className="py-4">Employee Name</th>
              <th className="py-4">Issue</th>
              <th className="py-4">Attendance Reliability</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((alert) => (
              <tr key={alert.id} className="border-b border-[#e5e7eb] hover:bg-[#f9fafb]">
                <td className="py-4 font-semibold">{alert.id}</td>
                <td className="py-4">{alert.name}</td>
                <td className={`py-4 font-semibold ${alert.issue === 'Absent' ? 'text-[#ef4444]' : alert.issue === 'Late' ? 'text-[#f59e0b]' : 'text-[#10b981]'}`}>
                  {alert.issue}
                </td>
                <td className="py-4 text-[#6b7280]">{alert.reliability}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}