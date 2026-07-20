import Card from '../ui/Card.jsx'

function PerformanceSummaryCard({ performance }) {
  return (
    <Card className="rounded-[16px] border border-[#e5e5e5] bg-white p-6">
      <h3 className="mb-2 font-extrabold text-[#111827]">Performance Score</h3>
      <div className="flex items-center gap-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#ecfdf5] text-[20px] font-black">
          {performance.score}
        </div>
        <div>
          <div className="text-[14px] font-extrabold text-[#10b981]">{performance.label}</div>
          <div className="text-[12px] text-[#5f6679]">{performance.description}</div>
        </div>
      </div>
    </Card>
  )
}

export default PerformanceSummaryCard
