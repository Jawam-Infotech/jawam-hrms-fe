export default function PerformanceScoreCard() {
  return (
    <div className="rounded-[20px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
      <h3 className="mb-6 text-[18px] font-extrabold text-[#111827]">Performance Score</h3>

      <div className="flex items-center gap-6">
        <div className="relative h-[110px] w-[110px] shrink-0">
          <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#e5e7eb" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="#10b981"
              strokeWidth="8"
              strokeDasharray={`${(85 / 100) * 263.9} 263.9`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[28px] font-black text-[#111827]">85%</span>
          </div>
        </div>

        <div>
          <p className="text-[18px] font-extrabold text-[#10b981]">Exceed Expectation</p>
          <p className="mt-1 text-[13px] text-[#6b7280]">Great Job! Keep up the consistent performance</p>
        </div>
      </div>
    </div>
  )
}

