const typeDetails = {
  GENERAL: { label: 'General', indicator: '📢', classes: 'bg-white' },
  BIRTHDAY: { label: 'Birthday', indicator: '🎉', classes: 'bg-[#B1E2F4]/40' },
  ANNIVERSARY: { label: 'Work Anniversary', indicator: '⭐', classes: 'bg-[#F8FAFC]' },
}

function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

function announcementKey(announcement) {
  return announcement.id ?? [announcement.type, announcement.employee_name, announcement.created_at, announcement.body].filter(Boolean).join('-')
}

function announcementContent(announcement) {
  const type = String(announcement.type || 'GENERAL').toUpperCase()
  const details = typeDetails[type] || typeDetails.GENERAL
  const employeeName = announcement.employee_name || 'team member'
  const fallbackTitle = type === 'BIRTHDAY' ? `Happy Birthday, ${employeeName}!` : type === 'ANNIVERSARY' ? `Happy Work Anniversary, ${employeeName}!` : 'Announcement'
  return { ...details, title: announcement.title || fallbackTitle }
}

function AnnouncementItem({ announcement, cloneKey }) {
  const content = announcementContent(announcement)
  return <div key={cloneKey || announcementKey(announcement)} className={`min-h-[76px] h-[76px] overflow-hidden border-b border-[#f3f4f6] pb-3 last:border-0 last:pb-0 ${content.classes} ${announcement.is_read ? 'opacity-75' : ''}`}>
    <div className="flex min-w-0 items-start justify-between gap-3">
      <div className="flex min-w-0 items-start gap-2"><span aria-hidden="true">{content.indicator}</span><div className="min-w-0"><p className="break-words text-[14px] font-bold text-[#111827]">{content.title}</p><p className="mt-1 text-[11px] font-semibold text-[#3b82f6]">{content.label}</p></div></div>
      <span className="flex shrink-0 items-center gap-2 text-[12px] text-[#9ca3af]">{!announcement.is_read && <span className="h-2 w-2 rounded-full bg-[#04A3DA]" aria-label="Unread" />}{formatDate(announcement.created_at || announcement.occurrence_date)}</span>
    </div>
    {announcement.body && <p className="mt-1 break-words text-[12px] text-[#6b7280]">{announcement.body}</p>}
  </div>
}

export default function AnnouncementCard({ announcements = [], loading = false, error = '', onRetry, onViewAll, showViewAll = true, showHeading = true }) {
  return (
    <div className="flex flex-col justify-between rounded-[20px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
      <div>
        <div className={showHeading ? 'mb-4 flex items-center justify-between gap-3' : 'flex items-center justify-end gap-3'}>
          {showHeading && <h3 className="text-[18px] font-extrabold text-[#111827]">Announcement</h3>}
          {announcements.some((item) => !item.is_read) && <span className="rounded-full bg-[#e0f2fe] px-2 py-1 text-[11px] font-bold text-[#0369a1]">Unread</span>}
        </div>
        <div className="space-y-4">
          {loading && <p className="text-[12px] text-[#6b7280]">Loading announcements...</p>}
          {!loading && error && <div className="space-y-2"><p className="text-[12px] font-semibold text-[#b91c1c]">Unable to load announcements.</p>{onRetry && <button type="button" onClick={onRetry} className="text-[12px] font-bold text-[#0369a1] hover:underline">Retry</button>}</div>}
          {!loading && !error && !announcements.length && <p className="text-[12px] text-[#6b7280]">No announcements available.</p>}
          {!loading && !error && announcements.map((announcement) => {
            return <AnnouncementItem key={announcementKey(announcement)} announcement={announcement} />
          })}
        </div>
      </div>
      {showViewAll && <div className="mt-4 border-t border-[#f3f4f6] pt-3"><button type="button" onClick={onViewAll} className="text-[13px] font-bold text-[#3b82f6] hover:underline">View All Announcements</button></div>}
    </div>
  )
}

export { AnnouncementItem }
