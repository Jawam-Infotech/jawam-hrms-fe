import ListSectionCard from '../../../ui/ListSectionCard.jsx'

const upcomingMeetings = [
  { name: 'Meeting Scheduled', time: '10:00 PM', status: 'Next Meeting' },
  { name: 'Meeting Scheduled', time: '12:30 PM', status: 'Next Meeting' },
  { name: 'Meeting Scheduled', time: '02:00 PM', status: 'Next Meeting' },
  { name: 'EOD Scheduled', time: '5:45 PM', status: 'EOD End of Day' },
]

function UpcomingMeetingsCard({ onFooterClick }) {
  return (
    <ListSectionCard
      title="Upcoming Meetings"
      footerText="Check Calendar"
      onFooterClick={onFooterClick}
    >
      <div className="space-y-3">
        {upcomingMeetings.map((meeting, idx) => (
          <div
            key={idx}
            className="flex justify-between items-start pb-3 border-b border-[#e5e5e5] last:border-0"
          >
            <div>
              <p className="text-[14px] font-semibold text-[#111827]">
                {meeting.name}
              </p>
              <p className="text-[12px] text-[#6b7280] mt-1">
                {meeting.time}
              </p>
            </div>
            <p className="text-[12px] text-[#6b7280]">{meeting.status}</p>
          </div>
        ))}
      </div>
    </ListSectionCard>
  )
}

export default UpcomingMeetingsCard
