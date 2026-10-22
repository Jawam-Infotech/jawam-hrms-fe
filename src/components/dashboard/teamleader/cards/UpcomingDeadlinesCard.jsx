import DashboardCard from '../../common/DashboardCard.jsx'

const deadlines = [
  {
    name: 'IMS Software',
    progress: '78%',
    dueIn: 'Due in 2 days',
  },
  {
    name: 'HRMS Software',
    progress: '80%',
    dueIn: 'Due in 5 days',
  },
  {
    name: 'Website Redesigning',
    progress: '70%',
    dueIn: 'Due in 7 days',
  },
]

function UpcomingDeadlinesCard() {
  return (
    <DashboardCard>
      <h3 className="text-[18px] font-extrabold text-[#111827] mb-4">
        Upcoming Deadlines
      </h3>

      <div className="space-y-4">
        {deadlines.map((deadline, idx) => (
          <div
            key={idx}
            className="pb-4 border-b border-[#e5e5e5] last:border-0"
          >
            <div className="flex justify-between items-center mb-2">
              <p className="text-[14px] font-semibold text-[#111827]">
                {deadline.name}
              </p>

              <p className="text-[12px] text-[#5f6679]">
                {deadline.dueIn}
              </p>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex-1 h-2 bg-[#e5e5e5] rounded-full mr-2">
                <div
                  className="h-2 bg-[#3b82f6] rounded-full"
                  style={{ width: deadline.progress }}
                />
              </div>

              <p className="text-[12px] font-semibold text-[#111827]">
                {deadline.progress}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="text-[#3b82f6] text-[14px] font-extrabold hover:underline mt-4"
      >
        View All Announcement
      </button>
    </DashboardCard>
  )
}

export default UpcomingDeadlinesCard
