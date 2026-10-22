import DashboardCard from '../../common/DashboardCard.jsx'

const events = [
  { name: 'Product Demo', date: '18 Jun 2026' },
  { name: 'Sync Review', date: '19 Jun 2026' },
  { name: 'Team Meeting', date: '18 Jun 2026' },
  { name: 'Team Meeting', date: '18 Jun 2026' },
  { name: 'Team Meeting', date: '18 Jun 2026' },
]

function UpcomingTeamEventsCard() {
  return (
    <DashboardCard>
      <h3 className="text-[18px] font-extrabold text-[#111827] mb-4">
        Upcoming Team Events
      </h3>

      <div className="space-y-3">
        {events.map((event, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center pb-3 border-b border-[#e5e5e5] last:border-0"
          >
            <p className="text-[14px] font-semibold text-[#111827]">
              {event.name}
            </p>

            <p className="text-[12px] text-[#5f6679]">
              {event.date}
            </p>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="text-[#3b82f6] text-[14px] font-extrabold hover:underline mt-4"
      >
        View All Events
      </button>
    </DashboardCard>
  )
}

export default UpcomingTeamEventsCard
