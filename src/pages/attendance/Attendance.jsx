import { useState, useMemo, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { UserContext } from '../../context/UserContext.jsx'
import { getMonthWeeks } from '../../utils/calendarGrid'
import AttendancePagination from '../../components/attendance/AttendancePagination.jsx'
import useAttendanceHistory from '../../hooks/useAttendanceHistory.js'
import useAttendance from '../../hooks/useAttendance.js'

function Attendance() {
  const navigate = useNavigate()
  const { user } = useContext(UserContext)
  const [currentDate, setCurrentDate] = useState(new Date())
  const canManageHolidays = user?.role === 'admin' || user?.role === 'hr'
  const {
    recordsByDay,
    calendar,
    holidayMap,
    summary,
    loading,
    error,
    currentPage,
    totalCount,
    totalPages,
    nextPage,
    previousPage,
    goToPage,
    goToNextPage,
    goToPreviousPage,
  } = useAttendanceHistory(currentDate)
   const { attendance } = useAttendance()

  const weeks = useMemo(
    () => getMonthWeeks(currentDate.getFullYear(), currentDate.getMonth()),
    [currentDate],
  )

  const handlePreviousMonth = () => {
    setCurrentDate((date) => new Date(date.getFullYear(), date.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate((date) => new Date(date.getFullYear(), date.getMonth() + 1, 1))
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[32px] font-black text-[#111827]">Attendance</h1>
            <p className="text-[16px] text-[#5f6679] mt-2">Check attendance month wise</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {user?.role === 'manager' && (
              <button
                type="button"
                onClick={() => navigate('/attendance/team')}
                className="inline-flex items-center justify-center rounded-full bg-[#3b82f6] px-6 py-3 text-[14px] font-extrabold text-white hover:bg-[#2563eb] transition-all"
              >
                Check Team Attendance
              </button>
            )}
            {(user?.role === 'admin' || user?.role === 'hr') && (
              <>
                <button
                  type="button"
                  onClick={() => navigate('/attendance/company')}
                  className="inline-flex items-center justify-center rounded-full bg-[#3b82f6] px-6 py-3 text-[14px] font-extrabold text-white hover:bg-[#2563eb] transition-all"
                >
                  Check Overall Attendance
                </button>
                {canManageHolidays && (
                  <button
                    type="button"
                    onClick={() => navigate('/attendance/holidays')}
                    className="inline-flex items-center justify-center rounded-full bg-[#3b82f6] px-6 py-3 text-[14px] font-extrabold text-white hover:bg-[#2563eb] transition-all"
                  >
                    Add Holidays
                  </button>
                )}
              </>
            )}
            {['employee', 'manager', 'hr'].includes(user?.role) && (
              <button type="button" onClick={() => navigate('/attendance/correction-requests')} className="inline-flex items-center justify-center rounded-full bg-[#3b82f6] px-6 py-3 text-[14px] font-extrabold text-white hover:bg-[#2563eb] transition-all">Track Correction Requests</button>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[18px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <p className="text-[14px] font-semibold text-[#6b7280]">Present Days</p>
            <p className="mt-4 text-[28px] font-black text-[#111827]">{loading ? '...' : summary.presentDays}</p>
          </div>
          <div className="rounded-[18px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <p className="text-[14px] font-semibold text-[#6b7280]">Absent Days</p>
            <p className="mt-4 text-[28px] font-black text-[#ef4444]">{loading ? '...' : summary.absentDays}</p>
          </div>
          <div className="rounded-[18px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <p className="text-[14px] font-semibold text-[#6b7280]">Late Arrival</p>
            <p className="mt-4 text-[28px] font-black text-[#f59e0b]">{loading ? '...' : summary.lateArrival}</p>
          </div>
          <div className="rounded-[18px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <p className="text-[14px] font-semibold text-[#6b7280]">Attendance Rate</p>
            <p className="mt-4 text-[28px] font-black text-[#10b981]">{loading ? '...' : `${summary.attendanceRate}%`}</p>
          </div>
        </div>

        {error && (
          <div className="rounded-[12px] border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-[14px] font-semibold text-[#b91c1c]">
            Failed to load attendance. Please try again.
          </div>
        )}

        <div className="rounded-[30px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handlePreviousMonth}
                className="grid h-11 w-11 place-items-center rounded-full border border-[#e5e7eb] text-[20px] text-[#111827] transition-all hover:border-[#cbd5e1]"
              >
                ‹
              </button>
              <div>
                <p className="text-[14px] text-[#6b7280]">{currentDate.toLocaleString('en-US', { month: 'long' })} {currentDate.getFullYear()}</p>
                <h2 className="text-[28px] font-black text-[#111827]">{currentDate.toLocaleString('en-US', { month: 'short' })}, {currentDate.getFullYear()}</h2>
              </div>
              <button
                type="button"
                onClick={handleNextMonth}
                className="grid h-11 w-11 place-items-center rounded-full border border-[#e5e7eb] text-[20px] text-[#111827] transition-all hover:border-[#cbd5e1]"
              >
                ›
              </button>
            </div>
            <div className="inline-flex items-center gap-3 rounded-full border border-[#e5e7eb] bg-[#f8fafc] px-4 py-3 text-[14px] font-semibold text-[#111827]">
<span className={`h-3 w-3 rounded-full ${
  attendance?.todayStatus === 'PRESENT' || attendance?.todayStatus === 'LATE'
    ? 'bg-[#10b981]'
    : attendance?.todayStatus === 'HALF_DAY'
      ? 'bg-[#f59e0b]'
      : attendance?.todayStatus === 'ABSENT'
        ? 'bg-[#ef4444]'
        : attendance?.todayStatus === 'HOLIDAY'
          ? 'bg-[#3b82f6]'
          : 'bg-[#9ca3af]'
}`} />
{attendance?.todayStatus === 'NOT_CHECKED_IN'
  ? 'Not Checked In'
  : attendance?.todayStatus?.replaceAll('_', ' ') || 'Not Checked In'}
</div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <div className="grid min-w-[720px] grid-cols-7 gap-2 rounded-[24px] bg-[#f8fafc] p-4 text-[13px] font-semibold text-[#6b7280]">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="text-center">{day}</div>
              ))}
            </div>

            <div className="grid min-w-[720px] gap-2 rounded-[24px] p-2">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="grid grid-cols-7 gap-2">
                  {week.map((date) => {
                    const isCurrentMonth = date.getMonth() === currentDate.getMonth()
                    const dayNumber = date.getDate()
                    const isWeekend = date.getDay() === 0 || date.getDay() === 6
                    const dateKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`
const calendarEntry = isCurrentMonth ? calendar.find((item) => item.date === dateKey) : null
const holiday = isCurrentMonth ? holidayMap[dateKey] : null
const entry = isCurrentMonth ? recordsByDay[dayNumber] : null

                    const isSelected = false
                    const isHoliday = calendarEntry?.status === 'HOLIDAY' || Boolean(holiday)

                    const cellClasses = [
                      'group relative min-h-[120px] rounded-[22px] border border-transparent p-4 transition-all',
                      !isCurrentMonth && 'bg-[#f3f4f6] text-[#9ca3af]',
                      isCurrentMonth && 'bg-white',
                      isWeekend && !isHoliday && 'bg-[#f8fafc] text-[#9ca3af]',
                      isHoliday && 'border-[#bbf7d0] bg-[#f0fdf4] text-[#14532d] shadow-[inset_0_0_0_1px_rgba(34,197,94,0.08)]',
                      isSelected && 'ring-2 ring-[#2563eb]/40',
                    ]

                    return (
                      <div key={`${weekIndex}-${dayNumber}`} className={cellClasses.filter(Boolean).join(' ')}>
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-[14px] font-bold ${!isCurrentMonth ? 'text-[#9ca3af]' : 'text-[#111827]'}`}>{dayNumber}</span>
                          
                          {isHoliday && (
  <span className="rounded-full bg-[#dcfce7] px-2 py-1 text-[10px] font-bold text-[#166534]">
    {holiday?.holidayName || 'Holiday'}
  </span>
)}
                        </div>

{isCurrentMonth && calendarEntry && calendarEntry.status !== 'UPCOMING' ? (
    <div className="space-y-2 text-[13px] text-[#374151]">
    {entry && (
      <>
        <div className="rounded-2xl bg-[#eff6ff] p-2 text-[#1d4ed8]">Check in: {entry.checkIn}</div>
        <div className="rounded-2xl bg-[#fef2f2] p-2 text-[#b91c1c]">Check out: {entry.checkOut}</div>
      </>
    )}<div className={`rounded-2xl p-2 ${
  calendarEntry.status === 'PRESENT' || calendarEntry.status === 'LATE'
    ? 'bg-[#d1fae5] text-[#10b981]'
    : calendarEntry.status === 'ABSENT'
      ? 'bg-[#fee2e2] text-[#ef4444]'
      : calendarEntry.status === 'HALF_DAY'
        ? 'bg-[#fed7aa] text-[#ea580c]'
        : calendarEntry.status === 'HOLIDAY'
          ? 'bg-[#dbeafe] text-[#3b82f6]'
          : 'bg-[#f3f4f6] text-[#6b7280]'
}`}>
Status: {calendarEntry.status === 'PENDING' ? 'Not Checked In' : calendarEntry.status.replaceAll('_', ' ')}
</div>
    
  </div>
) : (
  <div className="min-h-[50px]" />
)}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>

          <AttendancePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            hasPrevious={Boolean(previousPage)}
            hasNext={Boolean(nextPage)}
            onPrevious={goToPreviousPage}
            onNext={goToNextPage}
            onPageChange={goToPage}
            itemLabel="attendance records"
          />
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Attendance
