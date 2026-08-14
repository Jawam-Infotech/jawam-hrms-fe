function AttendanceStatusTable({
  title = "Today's Attendance Status",
  records = [],
}) {
  const today = new Date().toLocaleDateString('en-CA')
  const todayRecords = records.filter((record) => record.rawDate === today)

  return (
    <div className="rounded-[30px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-[20px] font-black text-[#111827]">{title}</h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#e5e7eb]">
              <th className="px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-wider text-[#6b7280]">
                Employee
              </th>
              <th className="px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-wider text-[#6b7280]">
                Status
              </th>
              <th className="px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-wider text-[#6b7280]">
                Check In
              </th>
              <th className="px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-wider text-[#6b7280]">
                Check Out
              </th>
              <th className="px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-wider text-[#6b7280]">
                Break
              </th>
              <th className="px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-wider text-[#6b7280]">
                Working Hours
              </th>
            </tr>
          </thead>

          <tbody>
            {todayRecords.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-[#6b7280]">
                  No attendance records found.
                </td>
              </tr>
            ) : (
              todayRecords.map((record) => (
                <tr key={record.id} className="border-b border-[#f3f4f6] hover:bg-[#f9fafb]">
                  <td className="px-4 py-4 font-semibold">{record.name}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-[12px] font-semibold ${
                        record.finalStatus === 'PRESENT'
                          ? 'bg-[#d1fae5] text-[#10b981]'
                          : record.finalStatus === 'LATE'
                          ? 'bg-[#fef3c7] text-[#f59e0b]'
                          : record.finalStatus === 'HALF_DAY'
                          ? 'bg-[#dbeafe] text-[#2563eb]'
                          : record.finalStatus === 'ABSENT'
                          ? 'bg-[#fee2e2] text-[#ef4444]'
                          : 'bg-[#f3f4f6] text-[#6b7280]'
                      }`}
                    >
                      {record.statusLabel}
                    </span>
                  </td>
                  <td className="px-4 py-4">{record.checkIn}</td>
                  <td className="px-4 py-4">{record.checkOut}</td>
                  <td className="px-4 py-4">{record.breakDuration}</td>
                  <td className="px-4 py-4">{record.effectiveWorkingDuration}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AttendanceStatusTable
