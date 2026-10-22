import ListSectionCard from '../../../ui/ListSectionCard.jsx'

const hiringOverview = [
  { label: 'Application Received', count: '(100)' },
  { label: 'Shortlisted', count: '(40)' },
  { label: 'Interview Scheduled', count: '(20)' },
  { label: 'Other Scheduled', count: '(10)' },
  { label: 'Joined', count: '(3)' },
  { label: 'Rejected Candidates', count: '(5)' },
]

function HiringOverviewCard({ onFooterClick }) {
  return (
    <ListSectionCard
      title="Hiring Overview"
      footerText="View Recruitment"
      onFooterClick={onFooterClick}
    >
      <div className="space-y-3">
        {hiringOverview.map((item) => (
          <div
            key={item.label}
            className="flex justify-between items-center pb-3 border-b border-[#e5e5e5] last:border-0"
          >
            <p className="text-[14px] text-[#111827]">{item.label}</p>
            <p className="text-[14px] font-semibold text-[#6b7280]">
              {item.count}
            </p>
          </div>
        ))}
      </div>
    </ListSectionCard>
  )
}

export default HiringOverviewCard
