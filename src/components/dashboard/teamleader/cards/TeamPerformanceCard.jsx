import DashboardCard from '../../common/DashboardCard.jsx'

function TeamPerformanceCard() {
  return (
    <DashboardCard>
      <h3 className="text-[18px] font-extrabold text-[#111827] mb-6">
        Team Performance
      </h3>

      <div className="flex flex-col items-center">
        <div className="relative w-[140px] h-[140px] mb-4">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e5e5e5"
              strokeWidth="8"
            />

            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="8"
              strokeDasharray={`${(62 / 100) * 282.7} 282.7`}
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[36px] font-black text-[#111827]">
              62%
            </span>
          </div>
        </div>

        <p className="text-[14px] font-extrabold text-[#f59e0b] mb-2">
          Needs Improvement
        </p>

        <p className="text-[12px] text-[#5f6679] text-center">
          Focus on completing tasks on time and achieving goals.
        </p>

        <button
          type="button"
          className="text-[#3b82f6] text-[14px] font-extrabold hover:underline mt-4"
        >
          View Employee Score
        </button>
      </div>
    </DashboardCard>
  )
}

export default TeamPerformanceCard
