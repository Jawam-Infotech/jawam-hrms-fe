import DashboardCard from '../../common/DashboardCard.jsx'

function ActiveProjectsCard() {
  return (
    <DashboardCard>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-[#f0fdf4] flex items-center justify-center text-[24px]">
          📁
        </div>

        <div>
          <h3 className="text-[16px] font-extrabold text-[#111827]">
            Active Projects
          </h3>

          <p className="text-[14px] font-extrabold text-[#3b82f6]">
            5 Project
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between">
          <p className="text-[12px] text-[#5f6679]">Running</p>
          <p className="text-[14px] font-semibold text-[#111827]">4</p>
        </div>

        <div className="flex justify-between">
          <p className="text-[12px] text-[#5f6679]">Near Deadline</p>
          <p className="text-[14px] font-semibold text-[#111827]">1</p>
        </div>
      </div>
    </DashboardCard>
  )
}

export default ActiveProjectsCard
