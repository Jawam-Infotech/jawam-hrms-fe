
function ProjectAuditTimeline({ events = [] }) {
  if (events.length === 0) {
    return (
      <div className="py-8 text-center text-xs text-[#9ca3af]">
        No audit activity recorded yet.
      </div>
    );
  }

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:bottom-0 before:left-2 before:top-2 before:w-0.5 before:bg-[#e5e7eb]">
      {events.map((event) => (
        <div key={event.id || `${event.timestamp}-${event.action}`} className="relative group">
          {/* Circle indicator */}
          <div className="absolute -left-[29px] top-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#2563eb] shadow-sm" />

          <div className="rounded-2xl border border-[#f1f5f9] bg-[#f8fafc] p-4 transition hover:border-[#e2e8f0] hover:bg-white">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[13px] font-bold text-[#111827]">{event.action}</span>
              <span className="text-xs text-[#9ca3af]">{event.timestamp || 'Recently'}</span>
            </div>

            <p className="mt-1 text-xs text-[#4b5563]">
              <span className="font-semibold text-[#111827]">{event.actor || 'System'}</span>: {event.description}
            </p>

            {/* Regression note highlight */}
            {event.decreaseReason && (
              <div className="mt-2 rounded-xl border border-[#fed7aa] bg-[#fffbeb] p-2.5 text-xs text-[#9a3412]">
                <span className="font-bold">Regression Reason:</span> {event.decreaseReason}
              </div>
            )}

            {/* Rejection feedback highlight */}
            {event.rejectionReason && (
              <div className="mt-2 rounded-xl border border-[#fecdd3] bg-[#fff1f2] p-2.5 text-xs text-[#9f1239]">
                <span className="font-bold">Reviewer Feedback:</span> {event.rejectionReason}
              </div>
            )}

            {/* Deliverable preview link */}
            {event.deliverable && (
              <div className="mt-2 flex items-center gap-2 text-xs text-[#2563eb]">
                <span className="font-semibold text-[#374151]">Deliverable:</span>
                {event.deliverable.type === 'LINK' ? (
                  <a href={event.deliverable.value} target="_blank" rel="noreferrer" className="underline hover:text-[#1d4ed8]">
                    {event.deliverable.value} ↗
                  </a>
                ) : (
                  <span>{event.deliverable.value} (File)</span>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ProjectAuditTimeline
