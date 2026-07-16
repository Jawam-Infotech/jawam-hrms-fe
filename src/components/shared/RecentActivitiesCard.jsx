const defaultActivities = [
  { title: 'Attendance Marked', time: '2 min ago' },
  { title: 'Attendance Marked', time: '2 min ago' },
  { title: 'Attendance Marked', time: '2 min ago' },
]

export default function RecentActivitiesCard({ activities = defaultActivities }) {
  return (
    <div className="bg-white rounded-[16px] border border-[#e5e5e5] p-6 shadow-sm col-span-2">
      <h3 className="text-[18px] font-extrabold text-[#111827] mb-4">Recent Activities</h3>

      <div className="space-y-3">
        {activities.map((activity, idx) => (
          <div key={idx} className="flex items-center justify-between pb-3 border-b border-[#e5e5e5] last:border-0">
            <div>
              <p className="text-[14px] font-semibold text-[#111827]">{activity.title}</p>
              {activity.desc && <p className="text-[12px] text-[#5f6679]">{activity.desc}</p>}
            </div>
            <p className="text-[12px] text-[#5f6679]">{activity.time}</p>
          </div>
        ))}
      </div>

      <button className="text-[#3b82f6] text-[14px] font-extrabold hover:underline mt-4">View All Activities</button>
    </div>
  )
}