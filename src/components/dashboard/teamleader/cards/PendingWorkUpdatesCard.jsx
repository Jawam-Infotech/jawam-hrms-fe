import DashboardCard from '../../common/DashboardCard.jsx'

function PendingWorkUpdatesCard() {
  return (
    <DashboardCard>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-[#dbeafe] flex items-center justify-center text-[24px]">
          📝
        </div>

        <div>
          <h3 className="text-[16px] font-extrabold text-[#111827]">
            Pending Work Updates
          </h3>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <p className="text-[12px] text-[#5f6679]">Pending</p>
          <p className="text-[14px] font-semibold text-[#111827]">3</p>
        </div>

        <div className="flex justify-between">
          <p className="text-[12px] text-[#5f6679]">Submitted</p>
          <p className="text-[14px] font-semibold text-[#111827]">15</p>
        </div>
      </div>

      <button
        type="button"
        className="text-[#3b82f6] text-[14px] font-extrabold hover:underline mt-3"
      >
        Review Updates
      </button>
    </DashboardCard>
  )
}

export default PendingWorkUpdatesCard
