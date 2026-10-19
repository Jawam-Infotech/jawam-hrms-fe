import ListSectionCard from '../../../ui/ListSectionCard.jsx'

const upcomingInterviews = [
  {
    name: 'Interview Scheduled',
    time: '8:31 AM',
    date: 'Tomorrow at 09:00 AM',
  },
  {
    name: 'Interview Scheduled',
    time: '9:30 PM',
    date: 'Tomorrow at 09:30 AM',
  },
  {
    name: 'Interview Scheduled',
    time: '10:00 AM',
    date: 'Tomorrow at 10:00 AM',
  },
]

function UpcomingInterviewsCard({ onFooterClick }) {
  return (
    <ListSectionCard
      title="Upcoming Interviews"
      footerText="View All Interviews"
      onFooterClick={onFooterClick}
    >
      <div className="space-y-3">
        {upcomingInterviews.map((interview, idx) => (
          <div
            key={idx}
            className="pb-3 border-b border-[#e5e5e5] last:border-0"
          >
            <p className="text-[14px] font-semibold text-[#111827]">
              {interview.name}
            </p>
            <p className="text-[12px] text-[#6b7280] mt-1">
              {interview.date}
            </p>
          </div>
        ))}
      </div>
    </ListSectionCard>
  )
}

export default UpcomingInterviewsCard
