import ListSectionCard from '../../../ui/ListSectionCard.jsx'

function ExpensesOverviewCard({ onFooterClick }) {
  return (
    <ListSectionCard
      title="Expenses Overview"
      footerText="View Expenses Report"
      onFooterClick={onFooterClick}
    >
      <div className="flex items-center justify-center">
        <div className="relative w-[200px] h-[200px]">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="8"
              strokeDasharray="94.25 282.7"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#ef4444"
              strokeWidth="8"
              strokeDasharray="47.12 282.7"
              strokeDashoffset="-94.25"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="8"
              strokeDasharray="47.12 282.7"
              strokeDashoffset="-141.37"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#10b981"
              strokeWidth="8"
              strokeDasharray="94.25 282.7"
              strokeDashoffset="-188.49"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-[24px] font-black text-[#111827]">100%</p>
          </div>
        </div>
      </div>
      <div className="mt-6 space-y-2 text-[12px]">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#f59e0b]" />
          <span>Electricity</span>
          <span className="text-[#6b7280]">₹10,00,00</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#ef4444]" />
          <span>Rent</span>
          <span className="text-[#6b7280]">₹7,50,00</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#3b82f6]" />
          <span>Internet</span>
          <span className="text-[#6b7280]">₹4,00,00</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#10b981]" />
          <span>Water</span>
          <span className="text-[#6b7280]">₹1,50,00</span>
        </div>
      </div>
    </ListSectionCard>
  )
}

export default ExpensesOverviewCard
