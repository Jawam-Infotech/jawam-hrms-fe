import ListSectionCard from '../../../ui/ListSectionCard.jsx'

const departmentPerformance = [
  { name: 'HR Department', percentage: 70 },
  { name: 'LINUX', percentage: 80 },
  { name: 'Engineering', percentage: 75 },
  { name: 'Backend', percentage: 65 },
  { name: 'Others', percentage: 60 },
]

function DepartmentPerformanceCard({ onFooterClick }) {
  return (
    <ListSectionCard
      title="Department Performance"
      footerText="View Employee Score"
      onFooterClick={onFooterClick}
    >
      <div className="space-y-4">
        {departmentPerformance.map((dept) => (
          <div key={dept.name}>
            <div className="flex justify-between mb-2">
              <p className="text-[14px] font-semibold text-[#111827]">
                {dept.name}
              </p>
              <p className="text-[14px] font-semibold text-[#111827]">
                {dept.percentage}%
              </p>
            </div>
            <div className="w-full h-3 bg-[#e5e7eb] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#3b82f6] to-[#10b981]"
                style={{ width: `${dept.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </ListSectionCard>
  )
}

export default DepartmentPerformanceCard
