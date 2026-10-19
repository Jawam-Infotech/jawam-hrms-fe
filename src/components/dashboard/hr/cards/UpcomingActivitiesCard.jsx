import { useNavigate } from 'react-router-dom'
import DashboardCard from '../../common/DashboardCard.jsx'

const activities = [
  {
    title: 'Interview Scheduled',
    desc: 'Rajesh K (Full Stack Developer)',
    time: '11:30 AM',
  },
  {
    title: 'Interview Scheduled',
    desc: 'Ronit (ROR Developer)',
    time: '12:30 PM',
  },
  {
    title: 'Fun Friday',
    desc: 'Organize games or events of the employees',
    time: 'This Friday',
  },
  {
    title: 'Meeting with Director',
    desc: 'Clock in at 09:05 AM',
    time: '16/05/2026',
  },
]

function UpcomingActivitiesCard() {
  const navigate = useNavigate()

  return (
    <DashboardCard>
      <h3 className="text-[18px] font-extrabold text-[#111827] mb-4">
        Upcoming Activities
      </h3>
      <div className="space-y-3">
        {activities.map((activity, idx) => (
          <div
            key={idx}
            className="flex justify-between items-start pb-3 border-b border-[#e5e5e5] last:border-0"
          >
            <div>
              <p className="text-[14px] font-semibold text-[#111827]">
                {activity.title}
              </p>
              <p className="text-[12px] text-[#5f6679]">{activity.desc}</p>
            </div>
            <p className="text-[12px] text-[#5f6679]">{activity.time}</p>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => navigate('/learning/calendar')}
        className="text-[#3b82f6] text-[14px] font-extrabold hover:underline mt-4"
      >
        View All Activities
      </button>
    </DashboardCard>
  )
}

export default UpcomingActivitiesCard
