import { useState, useMemo, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { UserContext } from '../../context/UserContext.jsx'
import { getMonthWeeks } from '../../utils/calendarGrid'
import { attendanceSummary, attendanceEntries, holidayDates, selectedDay } from '../../data/attendance'

function Attendance() {
  const navigate = useNavigate()
  const { user } = useContext(UserContext)
  const [currentDate, setCurrentDate] = useState(new Date())

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
          <div className="flex items-center gap-3">
            {user?.role === 'manager' && (
              <button
                type="button"
                onClick={() => navigate('/attendance/team')}
                className="inline-flex items-center justify-center rounded-full bg-[#3b82f6] px-6 py-3 text-[14px] font-extrabold text-white hover:bg-[#2563eb] transition-all"
              >
                Check Team Attendance
              </button>
            )}
            {user?.role === 'admin' && (
              <button
                type="button"
                onClick={() => navigate('/attendance/company')}
                className="inline-flex items-center justify-center rounded-full bg-[#3b82f6] px-6 py-3 text-[14px] font-extrabold text-white hover:bg-[#2563eb] transition-all"
              >
                Check Overall Attendance
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[18px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <p className="text-[14px] font-semibold text-[#6b7280]">Present Days</p>
            <p className="mt-4 text-[28px] font-black text-[#111827]">{attendanceSummary.presentDays}</p>
          </div>
          <div className="rounded-[18px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <p className="text-[14px] font-semibold text-[#6b7280]">Absent Days</p>
            <p className="mt-4 text-[28px] font-black text-[#ef4444]">{attendanceSummary.absentDays}</p>
          </div>
          <div className="rounded-[18px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <p className="text-[14px] font-semibold text-[#6b7280]">Late Arrival</p>
            <p className="mt-4 text-[28px] font-black text-[#f59e0b]">{attendanceSummary.lateArrival}</p>
          </div>
          <div className="rounded-[18px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <p className="text-[14px] font-semibold text-[#6b7280]">Attendance Rate</p>
            <p className="mt-4 text-[28px] font-black text-[#10b981]">{attendanceSummary.attendanceRate}%</p>
          </div>
        </div>

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
              <span className="h-3 w-3 rounded-full bg-[#10b981]" /> Present
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
                    const isHoliday = holidayDates.includes(dayNumber)
                    const entry = isCurrentMonth ? attendanceEntries[dayNumber] : null
                    const isSelected = isCurrentMonth && dayNumber === selectedDay
                    const isBlankDay = isWeekend || isHoliday

                    const cellClasses = [
                      'min-h-[120px] rounded-[22px] border border-transparent p-4 transition-all',
                      !isCurrentMonth && 'bg-[#f3f4f6] text-[#9ca3af]',
                      isCurrentMonth && 'bg-white',
                      isBlankDay && 'bg-[#fee2e2]/60 text-[#9ca3af]',
                      isSelected && 'ring-2 ring-[#2563eb]/40',
                    ]

                    return (
                      <div key={`${weekIndex}-${dayNumber}`} className={cellClasses.filter(Boolean).join(' ')}>
                        <div className="flex items-center justify-between mb-3">
                          <span className={`text-[14px] font-bold ${!isCurrentMonth ? 'text-[#9ca3af]' : 'text-[#111827]'}`}>{dayNumber}</span>
                          {entry?.status === 'Late' && (
                            <span className="rounded-full bg-[#fef3c7] px-2 py-1 text-[10px] font-bold text-[#b45309]">
                              Late
                            </span>
                          )}
                        </div>

                        {isCurrentMonth && entry && !isBlankDay ? (
                          <div className="space-y-2 text-[13px] text-[#374151]">
                            <div className="rounded-2xl bg-[#eff6ff] p-2 text-[#1d4ed8]">Check in: {entry.checkIn}</div>
                            <div className="rounded-2xl bg-[#fef2f2] p-2 text-[#b91c1c]">Check out: {entry.checkOut}</div>
                          </div>
                        ) : isCurrentMonth && !isBlankDay ? (
                          <div className="mt-4 text-[13px] font-semibold text-[#ef4444]">Absent</div>
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
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Attendance
