import { XCircle, ClockAlert } from 'lucide-react'

function AttendanceReminderBanner({
  missedCheckouts = [],
  onSubmit,
  onDismiss,
}) {
  if (missedCheckouts.length === 0) {
    return null
  }

  const latestMissed = missedCheckouts[0]

  const formattedDate = new Date(latestMissed.date).toLocaleDateString(
    'en-US',
    {
      weekday: 'long',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }
  )

  return (
    <div className="rounded-[24px] border border-[#F59E0B] bg-[#FEF3C7] p-6 shadow-sm">
      <div className="flex items-start justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-[#F59E0B]/10 p-3">
            <ClockAlert size={28} className="text-[#D97706]" />
          </div>

          <div>
            <h3 className="text-[20px] font-black text-[#111827]">
              Attendance Reminder
            </h3>

            <p className="mt-2 text-[15px] text-[#4B5563]">
              You forgot to check out on{' '}
              <span className="font-bold">{formattedDate}</span>.
            </p>

            <p className="mt-1 text-[14px] text-[#6B7280]">
              Submit a correction request so HR can review and update your
              attendance.
            </p>

            <button
              onClick={() => onSubmit(latestMissed)}
              className="mt-5 rounded-full bg-[#2563EB] px-5 py-2.5 font-bold text-white transition hover:bg-[#1D4ED8]"
            >
              Submit Correction Request
            </button>
          </div>
        </div>

        <button
          onClick={onDismiss}
          className="text-[#9CA3AF] transition hover:text-[#6B7280]"
        >
          <XCircle size={22} />
        </button>
      </div>
    </div>
  )
}

export default AttendanceReminderBanner