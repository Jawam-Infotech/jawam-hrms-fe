export default function PerformanceScoreCard() {
  return (
    <div className="bg-white rounded-[16px] border border-[#e5e5e5] p-6 shadow-sm">
      <h3 className="text-[18px] font-extrabold text-[#111827] mb-6">Performance Score</h3>

      <div className="flex flex-col items-center">
        <div className="relative w-[140px] h-[140px] mb-4">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e5e5" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#10b981"
              strokeWidth="8"
              strokeDasharray={`${(85 / 100) * 282.7} 282.7`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[36px] font-black text-[#111827]">85%</span>
          </div>
        </div>

        <p className="text-[16px] font-extrabold text-[#10b981] mb-2">Exceed Expectation</p>
        <p className="text-[14px] text-[#5f6679] text-center">Great Job! Keep up the consistent performance</p>
      </div>
    </div>
  )
}
