const defaultActivities = [
  { title: 'Attendance Marked', desc: 'Clock in at 09:05 AM', time: '2 min ago' },
  { title: 'Attendance Marked', desc: 'Clock in at 09:05 AM', time: '2 min ago' },
  { title: 'Attendance Marked', desc: 'Clock in at 09:05 AM', time: '2 min ago' },
  { title: 'Attendance Marked', desc: 'Clock in at 09:05 AM', time: '2 min ago' },
]

export default function RecentActivitiesCard({ activities = defaultActivities }) {
  return (
    <div className="flex flex-col justify-between rounded-[20px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
      <div>
        <h3 className="mb-4 text-[18px] font-extrabold text-[#111827]">Recent Activities</h3>

        <div className="space-y-4">
          {activities.map((activity, idx) => (
            <div key={idx} className="flex items-start justify-between border-b border-[#f3f4f6] pb-3 last:border-0 last:pb-0">
              <div>
                <p className="text-[14px] font-bold text-[#111827]">{activity.title}</p>
                {activity.desc && <p className="mt-0.5 text-[12px] text-[#6b7280]">{activity.desc}</p>}
              </div>
              <span className="text-[12px] text-[#9ca3af]">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 border-t border-[#f3f4f6] pt-3">
        <a href="#activities" className="text-[13px] font-bold text-[#3b82f6] hover:underline">
          View All Activities
        </a>
      </div>
    </div>
  )
}