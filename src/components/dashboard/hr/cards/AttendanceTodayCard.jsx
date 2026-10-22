import DashboardCard from '../../common/DashboardCard.jsx'

function AttendanceTodayCard() {
  return (
    <DashboardCard>
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-full bg-[#d1fae5] flex items-center justify-center text-[24px]">
          ⏱️
        </div>
        <div>
          <h3 className="text-[16px] font-extrabold text-[#111827]">
            Attendance Today
          </h3>
          <p className="text-[14px] font-extrabold text-[#10b981]">● 95%</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="text-[12px] text-[#5f6679] mb-1">Present</p>
          <p className="text-[18px] font-extrabold text-[#111827]">95</p>
        </div>
        <div>
          <p className="text-[12px] text-[#5f6679] mb-1">Absent</p>
          <p className="text-[18px] font-extrabold text-[#111827]">5</p>
        </div>
        <div>
          <p className="text-[12px] text-[#5f6679] mb-1">Late</p>
          <p className="text-[18px] font-extrabold text-[#111827]">9</p>
        </div>
      </div>
    </DashboardCard>
  )
}

export default AttendanceTodayCard
