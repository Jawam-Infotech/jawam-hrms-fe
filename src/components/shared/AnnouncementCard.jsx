export default function AnnouncementCard() {
  const announcements = [
    { title: 'New leave Policy Released', time: '2 min ago' },
    { title: 'New leave Policy Released', time: '2 min ago' },
  ]

  return (
    <div className="bg-white rounded-[16px] border border-[#e5e5e5] p-6 shadow-sm">
      <h3 className="text-[18px] font-extrabold text-[#111827] mb-4">Announcement</h3>

      <div className="space-y-3">
        {announcements.map((ann, idx) => (
          <div key={idx} className="pb-3 border-b border-[#e5e5e5] last:border-0">
            <p className="text-[14px] font-semibold text-[#111827]">{ann.title}</p>
            <p className="text-[12px] text-[#5f6679]">{ann.time}</p>
          </div>
        ))}
      </div>

      <button className="text-[#3b82f6] text-[14px] font-extrabold hover:underline mt-4">View All Announcement</button>
    </div>
  )
}
