import { useState, useMemo } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'

const leaveTypes = [
  { value: 'Casual Leave', label: 'Casual Leave (CL)' },
  { value: 'Sick Leave', label: 'Sick Leave (SL)' },
  { value: 'Privilege Leave', label: 'Privilege Leave (PL)' },
  { value: 'Maternity Leave', label: 'Maternity Leave (ML)' },
  { value: 'Work From Home', label: 'Work From Home (WFH)' },
]

const durationOptions = ['Full Day', 'First Half', 'Second Half']

const initialHistory = [
  { id: '1', date: '12/05/2026', leaveType: 'Casual Leave', days: 5, reason: 'Family Marriage', status: 'Pending' },
  { id: '2', date: '12/03/2026', leaveType: 'Casual Leave', days: 4, reason: 'Urgent Work', status: 'Accepted' },
  { id: '3', date: '12/01/2026', leaveType: 'Sick Leave', days: 1, reason: 'Urgent Work', status: 'Rejected' },
]

const statusStyles = {
  Pending: 'bg-[#fef3c7] text-[#b45309]',
  Accepted: 'bg-[#d1fae5] text-[#059669]',
  Rejected: 'bg-[#fee2e2] text-[#dc2626]',
}

function Leave() {
  const [formState, setFormState] = useState({
    leaveType: 'Casual Leave',
    startDate: '',
    endDate: '',
    duration: 'Full Day',
    reason: 'Type your reason here...',
    attachment: null,
  })
  const [history, setHistory] = useState(initialHistory)

  const summary = useMemo(() => ({
    available: 4,
    approved: history.filter((item) => item.status === 'Accepted').length,
    inProcess: history.filter((item) => item.status === 'Pending').length,
    rejected: history.filter((item) => item.status === 'Rejected').length,
  }), [history])

  const handleFieldChange = (name, value) => {
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleApplyLeave = () => {
    const newEntry = {
      id: String(history.length + 1),
      date: formState.startDate || 'N/A',
      leaveType: formState.leaveType,
      days: formState.duration === 'Full Day' ? 1 : 0.5,
      reason: formState.reason,
      status: 'Pending',
    }
    setHistory((current) => [newEntry, ...current])
    setFormState({
      leaveType: 'Casual Leave',
      startDate: '',
      endDate: '',
      duration: 'Full Day',
      reason: 'Type your reason here...',
      attachment: null,
    })
  }

  const handleCancel = () => {
    setFormState({
      leaveType: 'Casual Leave',
      startDate: '',
      endDate: '',
      duration: 'Full Day',
      reason: 'Waiting for API integration.',
      attachment: null,
    })
  }

  const handleDelete = (id) => {
    setHistory((current) => current.filter((item) => item.id !== id))
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-[32px] font-black text-[#111827]">Leave Management</h1>
          <p className="text-[16px] text-[#5f6679] mt-2">Apply and track your leave requests</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <p className="text-[14px] font-semibold text-[#6b7280]">Available Leaves</p>
            <p className="mt-4 text-[28px] font-black text-[#111827]">{summary.available}</p>
          </div>
          <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <p className="text-[14px] font-semibold text-[#6b7280]">Approved Leaves</p>
            <p className="mt-4 text-[28px] font-black text-[#10b981]">{summary.approved}</p>
          </div>
          <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <p className="text-[14px] font-semibold text-[#6b7280]">In Process Leave</p>
            <p className="mt-4 text-[28px] font-black text-[#f59e0b]">{summary.inProcess}</p>
          </div>
          <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <p className="text-[14px] font-semibold text-[#6b7280]">Rejected Leaves</p>
            <p className="mt-4 text-[28px] font-black text-[#ef4444]">{summary.rejected}</p>
          </div>
        </div>

        <div className="rounded-[30px] border border-[#e5e7eb] bg-white p-8 shadow-sm">
          <h2 className="text-[22px] font-black text-[#111827]">Apply Leave</h2>
          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            <div className="space-y-4">
              <label className="block text-[14px] font-semibold text-[#111827]">Leave Type</label>
              <select
                value={formState.leaveType}
                onChange={(event) => handleFieldChange('leaveType', event.target.value)}
                className="h-12 w-full rounded-[18px] border border-[#d1d5db] bg-[#f8fafc] px-4 text-[14px] text-[#111827] outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#bfdbfe]/50"
              >
                {leaveTypes.map((type) => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-4">
              <label className="block text-[14px] font-semibold text-[#111827]">Start Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={formState.startDate}
                  onChange={(event) => handleFieldChange('startDate', event.target.value)}
                  className="h-12 w-full rounded-[18px] border border-[#d1d5db] bg-white px-4 pr-12 text-[14px] text-[#111827] outline-none transition-all duration-200 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#bfdbfe]/50"
                />
                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#6b7280] text-lg">📅</span>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-[14px] font-semibold text-[#111827]">End Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={formState.endDate}
                  onChange={(event) => handleFieldChange('endDate', event.target.value)}
                  className="h-12 w-full rounded-[18px] border border-[#d1d5db] bg-white px-4 pr-12 text-[14px] text-[#111827] outline-none transition-all duration-200 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#bfdbfe]/50"
                />
                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-[#6b7280] text-lg">📅</span>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-[14px] font-semibold text-[#111827]">Duration</label>
              <select
                value={formState.duration}
                onChange={(event) => handleFieldChange('duration', event.target.value)}
                className="h-12 w-full rounded-[18px] border border-[#d1d5db] bg-[#f8fafc] px-4 text-[14px] text-[#111827] outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#bfdbfe]/50"
              >
                {durationOptions.map((duration) => (
                  <option key={duration} value={duration}>{duration}</option>
                ))}
              </select>
            </div>

            <div className="space-y-4 xl:col-span-2">
              <label className="block text-[14px] font-semibold text-[#111827]">Reason</label>
              <textarea
                value={formState.reason}
                onChange={(event) => handleFieldChange('reason', event.target.value)}
                rows={3}
                className="w-full rounded-[18px] border border-[#d1d5db] bg-[#f8fafc] px-4 py-3 text-[14px] text-[#111827] outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#bfdbfe]/50"
              />
            </div>

            <div className="space-y-4 xl:col-span-2">
              <label className="block text-[14px] font-semibold text-[#111827]">Attachments (Optional)</label>
              <input
                type="file"
                onChange={(event) => handleFieldChange('attachment', event.target.files?.[0] || null)}
                className="w-full rounded-[18px] border border-[#d1d5db] bg-[#f8fafc] px-4 py-3 text-[14px] text-[#111827] outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#bfdbfe]/50"
              />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="rounded-full border border-[#fca5a5] bg-white px-7 py-3 text-[14px] font-bold text-[#ef4444] transition-all hover:bg-[#fef2f2]"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApplyLeave}
              className="rounded-full bg-[#10b981] px-7 py-3 text-[14px] font-bold text-white transition-all hover:bg-[#059669]"
            >
              Apply leave
            </button>
          </div>
        </div>

        <div className="rounded-[30px] border border-[#e5e7eb] bg-white p-8 shadow-sm">
          <h2 className="text-[20px] font-black text-[#111827]">Leave History</h2>
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left text-[14px]">
              <thead>
                <tr className="border-b border-[#e5e7eb] text-[#6b7280]">
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Leave Type</th>
                  <th className="px-6 py-4 font-semibold">Days</th>
                  <th className="px-6 py-4 font-semibold">Reason</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {history.map((entry) => (
                  <tr key={entry.id} className="border-b border-[#f1f5f9] hover:bg-[#f8fafc]">
                    <td className="px-6 py-4 text-[#111827]">{entry.date}</td>
                    <td className="px-6 py-4 text-[#111827]">{entry.leaveType}</td>
                    <td className="px-6 py-4 text-[#111827]">{entry.days}</td>
                    <td className="px-6 py-4 text-[#111827]">{entry.reason}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-[12px] font-bold ${statusStyles[entry.status]}`}>
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => handleDelete(entry.id)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#fee2e2] text-[#dc2626] transition-all hover:bg-[#fecaca]"
                        aria-label="Delete leave entry"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Leave
