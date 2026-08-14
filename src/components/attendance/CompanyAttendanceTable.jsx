import AttendanceEmptyState from './AttendanceEmptyState.jsx'
import CompanyAttendanceTableRow from './CompanyAttendanceTableRow.jsx'

function CompanyAttendanceTable({
  records = [],
  loading = false,
  scope = 'company',
  correctionRequestByAttendanceId = {},
  onViewCorrection,
}){
  return (
    <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
<h2 className="text-[20px] font-black text-[#111827]">
  {scope === 'team'
    ? 'Team Attendance Table'
    : 'Company Attendance Table'}
</h2>

<p className="mt-1 text-[14px] text-[#6b7280]">
  {scope === 'team'
    ? 'View attendance records for your team members.'
    : 'View attendance records across the organization.'}
</p>
        </div>
      </div>

      {loading ? (
        <div className="rounded-[18px] border border-dashed border-[#d1d5db] bg-[#f8fafc] px-6 py-10 text-center text-[14px] font-semibold text-[#6b7280]">
          Loading attendance records...
        </div>
      ) : records.length === 0 ? (
        <AttendanceEmptyState message="No attendance records found for the selected date." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1180px]">
            <thead>
              <tr className="border-b border-[#e5e7eb]">
                <th className="px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-wider text-[#6b7280]">
                  Employee
                </th>
                <th className="px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-wider text-[#6b7280]">
                  Department
                </th>
                <th className="px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-wider text-[#6b7280]">
                  Designation
                </th>
                <th className="px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-wider text-[#6b7280]">
                  Check In
                </th>
                <th className="px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-wider text-[#6b7280]">
                  Check Out
                </th>
                <th className="px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-wider text-[#6b7280]">
                  Break Duration
                </th>
                <th className="px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-wider text-[#6b7280]">
                  Attendance Status
                </th>
                <th className="px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-wider text-[#6b7280]">
                  Correction Request
                </th>
                <th className="px-4 py-3 text-right text-[12px] font-extrabold uppercase tracking-wider text-[#6b7280]">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <CompanyAttendanceTableRow
                  key={record.id}
                  record={record}
                  correctionRequest={correctionRequestByAttendanceId[record.id]}
                  onViewCorrection={onViewCorrection}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default CompanyAttendanceTable
