import DashboardCard from '../../common/DashboardCard.jsx'

const positions = [
  { label: 'UI/UX Developer', count: 3 },
  { label: 'ROR Developer', count: 1 },
  { label: 'Full Stack Developer', count: 3 },
  { label: 'HR Executive', count: 2 },
  { label: 'Front End Developer', count: 8 },
  { label: 'Project Manager', count: 3 },
]

function ActivePositionsCard() {
  return (
    <DashboardCard>
      <h3 className="text-[18px] font-extrabold text-[#111827] mb-4">
        Active Positions
      </h3>
      <div className="space-y-3">
        {positions.map((position, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center pb-3 border-b border-[#e5e5e5] last:border-0"
          >
            <p className="text-[14px] font-semibold text-[#111827]">
              {position.label}
            </p>
            <p className="text-[12px] text-[#5f6679]">({position.count})</p>
          </div>
        ))}
      </div>
    </DashboardCard>
  )
}

export default ActivePositionsCard
