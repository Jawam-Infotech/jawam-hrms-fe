import Card from '../ui/Card.jsx'

function AttendanceSummaryCard({ attendance }) {
  return (
    <Card className="rounded-[16px] border border-[#e5e5e5] bg-white p-6">
      <h3 className="mb-2 font-extrabold text-[#111827]">Attendance this month</h3>
      <p className="text-[20px] font-black text-[#10b981]">{attendance.percentage}</p>
      <div className="mt-3 text-[12px] text-[#5f6679]">{attendance.details}</div>
    </Card>
  )
}

export default AttendanceSummaryCard
