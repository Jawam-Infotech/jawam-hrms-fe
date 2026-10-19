export default function AnnouncementCard() {
  const announcements = [
    {
      title: 'New leave Policy Released',
      subtitle: 'Great Job! Keep up the consistent performance',
      time: '2 min ago',
    },
    {
      title: 'New leave Policy Released',
      subtitle: 'Great Job! Keep up the consistent performance',
      time: '2 min ago',
    },
  ]

  return (
    <div className="flex flex-col justify-between rounded-[20px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
      <div>
        <h3 className="mb-4 text-[18px] font-extrabold text-[#111827]">Announcement</h3>

        <div className="space-y-4">
          {announcements.map((ann, idx) => (
            <div key={idx} className="border-b border-[#f3f4f6] pb-3 last:border-0 last:pb-0">
              <div className="flex items-center justify-between">
                <p className="text-[14px] font-bold text-[#111827]">{ann.title}</p>
                <span className="text-[12px] text-[#9ca3af]">{ann.time}</span>
              </div>
              <p className="mt-1 text-[12px] text-[#6b7280]">{ann.subtitle}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 border-t border-[#f3f4f6] pt-3">
        <a href="#announcements" className="text-[13px] font-bold text-[#3b82f6] hover:underline">
          View All Announcement
        </a>
      </div>
    </div>
  )
}

