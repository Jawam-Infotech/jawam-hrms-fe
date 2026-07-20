import { useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'

const initialTasks = [
  { id: '1', name: 'Dashboard UI', project: 'HRMS', progress: 80, status: 'In Progress', updated: false },
  { id: '2', name: 'Leave Module', project: 'Jawam Website', progress: 60, status: 'In Progress', updated: false },
  { id: '3', name: 'Wire framing', project: 'IMS Product', progress: 100, status: 'Completed', updated: false },
  { id: '4', name: 'Wire framing', project: 'HRMS', progress: 40, status: 'Blocked', updated: false },
]

const statusBadges = {
  'In Progress': 'bg-[#dbeafe] text-[#0284c7]',
  Completed: 'bg-[#d1fae5] text-[#059669]',
  Blocked: 'bg-[#fee2e2] text-[#dc2626]',
}

const stats = [
  { label: 'Assigned Task', value: '8 Active', color: 'text-[#3b82f6]', icon: '📌' },
  { label: 'Completed Task', value: '3', color: 'text-[#10b981]', icon: '✅' },
  { label: 'In Process Task', value: '4', color: 'text-[#f59e0b]', icon: '⏳' },
  { label: 'Blocked Task', value: '1', color: 'text-[#ef4444]', icon: '🚫' },
]

function WorkUpdate() {
  const [tasks, setTasks] = useState(initialTasks)
  const [selectedTask, setSelectedTask] = useState(null)
  const [formState, setFormState] = useState({
    todayContribution: '',
    todayWork: '',
    blockers: '',
    tomorrowPlan: '',
    status: 'In Progress',
    attachment: null,
  })

  const openModal = (task) => {
    setSelectedTask(task)
    setFormState({
      todayContribution: `${task.progress}%`,
      todayWork: `Updated ${task.name} comments and progress.`,
      blockers: task.status === 'Blocked' ? 'Waiting for API integration.' : '',
      tomorrowPlan: `Continue work on ${task.name}.`,
      status: task.status,
      attachment: null,
    })
  }

  const closeModal = () => {
    setSelectedTask(null)
  }

  const handleFieldChange = (key, value) => {
    setFormState((current) => ({ ...current, [key]: value }))
  }

  const handleSaveUpdate = () => {
    if (!selectedTask) return
    setTasks((current) =>
      current.map((task) =>
        task.id === selectedTask.id
          ? {
              ...task,
              progress: Number(formState.todayContribution.replace('%', '')) || task.progress,
              status: formState.status,
              updated: true,
            }
          : task,
      ),
    )
    closeModal()
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-[32px] font-black text-[#111827]">Work Update</h1>
          <p className="text-[16px] text-[#5f6679] mt-2">Submit your daily progress</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div className="rounded-2xl bg-[#eef2ff] p-3 text-[20px]">{stat.icon}</div>
                <div className="text-right">
                  <p className="text-[14px] font-semibold text-[#6b7280]">{stat.label}</p>
                  <p className={`mt-3 text-[20px] font-black ${stat.color}`}>{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="overflow-x-auto rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-[18px] font-black text-[#111827]">Assigned Tasks</h2>
          <table className="min-w-full text-left text-[14px]">
            <thead>
              <tr className="border-b border-[#e5e7eb] text-[#6b7280]">
                <th className="px-6 py-4 font-semibold">Task Name</th>
                <th className="px-6 py-4 font-semibold">Project</th>
                <th className="px-6 py-4 font-semibold">Progress</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 font-semibold">Update</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id} className="border-b border-[#f1f5f9] hover:bg-[#f8fafc]">
                  <td className="px-6 py-4 font-semibold text-[#111827]">{task.name}</td>
                  <td className="px-6 py-4 text-[#111827]">{task.project}</td>
                  <td className="px-6 py-4 text-[#111827]">{task.progress}%</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex rounded-full px-3 py-1 text-[12px] font-bold ${statusBadges[task.status]}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      type="button"
                      onClick={() => openModal(task)}
                      className={`rounded-full px-4 py-2 text-[14px] font-bold transition-all ${
                        task.updated
                          ? 'bg-[#dbeafe] text-[#2563eb] hover:bg-[#bfdbfe]'
                          : 'bg-[#2563eb] text-white hover:bg-[#1d4ed8]'
                      }`}
                    >
                      {task.updated ? 'Updated' : 'Update'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
            <div className="max-w-[980px] w-full rounded-[30px] bg-white p-8 shadow-2xl">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-[24px] font-black text-[#111827]">Update Task</h3>
                  <p className="text-[14px] text-[#6b7280] mt-2">Submit the latest contribution for your task.</p>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-full border border-[#e5e7eb] px-4 py-2 text-[14px] font-semibold text-[#111827] hover:bg-[#f8fafc]"
                >
                  Close
                </button>
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-2">
                <div className="space-y-6 rounded-[24px] bg-[#f8fafc] p-6">
                  <div>
                    <p className="text-[14px] font-semibold text-[#111827]">Task Name:</p>
                    <p className="mt-2 text-[16px] text-[#374151]">{selectedTask.name}</p>
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[#111827]">Project Name:</p>
                    <p className="mt-2 text-[16px] text-[#374151]">{selectedTask.project}</p>
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[#111827]">Previous Progress:</p>
                    <p className="mt-2 text-[16px] text-[#374151]">{selectedTask.progress}%</p>
                  </div>
                </div>

                <div className="space-y-6 rounded-[24px] bg-[#f8fafc] p-6">
                  <div>
                    <label className="text-[14px] font-semibold text-[#111827] block">Today's Contribution</label>
                    <input
                      type="text"
                      value={formState.todayContribution}
                      onChange={(event) => handleFieldChange('todayContribution', event.target.value)}
                      className="mt-2 h-12 w-full rounded-[18px] border border-[#d1d5db] bg-white px-4 text-[14px] text-[#111827] outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#bfdbfe]/50"
                    />
                  </div>
                  <div>
                    <label className="text-[14px] font-semibold text-[#111827] block">Today's Work</label>
                    <textarea
                      value={formState.todayWork}
                      onChange={(event) => handleFieldChange('todayWork', event.target.value)}
                      rows={3}
                      className="mt-2 w-full rounded-[18px] border border-[#d1d5db] bg-white px-4 py-3 text-[14px] text-[#111827] outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#bfdbfe]/50"
                    />
                  </div>
                  <div>
                    <label className="text-[14px] font-semibold text-[#111827] block">Attachments (Optional)</label>
                    <input
                      type="file"
                      onChange={(event) => handleFieldChange('attachment', event.target.files?.[0] || null)}
                      className="mt-2 w-full rounded-[18px] border border-[#d1d5db] bg-white px-4 py-3 text-[14px] text-[#111827] outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#bfdbfe]/50"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <div className="space-y-6 rounded-[24px] bg-[#f8fafc] p-6">
                  <div>
                    <label className="text-[14px] font-semibold text-[#111827] block">Current Progress</label>
                    <p className="mt-2 text-[16px] text-[#374151]">{selectedTask.progress}%</p>
                  </div>
                  <div>
                    <label className="text-[14px] font-semibold text-[#111827] block">Blockers/Issues</label>
                    <input
                      type="text"
                      value={formState.blockers}
                      onChange={(event) => handleFieldChange('blockers', event.target.value)}
                      className="mt-2 h-12 w-full rounded-[18px] border border-[#d1d5db] bg-white px-4 text-[14px] text-[#111827] outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#bfdbfe]/50"
                    />
                  </div>
                  <div>
                    <label className="text-[14px] font-semibold text-[#111827] block">Tomorrow Plan</label>
                    <input
                      type="text"
                      value={formState.tomorrowPlan}
                      onChange={(event) => handleFieldChange('tomorrowPlan', event.target.value)}
                      className="mt-2 h-12 w-full rounded-[18px] border border-[#d1d5db] bg-white px-4 text-[14px] text-[#111827] outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#bfdbfe]/50"
                    />
                  </div>
                </div>

                <div className="space-y-6 rounded-[24px] bg-[#f8fafc] p-6">
                  <div>
                    <p className="text-[14px] font-semibold text-[#111827]">Status</p>
                    <div className="mt-3 flex flex-wrap gap-3">
                      {['In Progress', 'Completed', 'Blocked'].map((option) => (
                        <label
                          key={option}
                          className="inline-flex cursor-pointer items-center gap-3 rounded-full border border-[#d1d5db] bg-white px-4 py-3 text-[14px] font-semibold text-[#111827]"
                        >
                          <input
                            type="radio"
                            name="status"
                            value={option}
                            checked={formState.status === option}
                            onChange={(event) => handleFieldChange('status', event.target.value)}
                            className="h-4 w-4 accent-[#3b82f6]"
                          />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-full border border-[#fca5a5] bg-white px-8 py-3 text-[14px] font-bold text-[#ef4444] transition-all hover:bg-[#fef2f2]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveUpdate}
                  className="rounded-full bg-[#10b981] px-8 py-3 text-[14px] font-bold text-white transition-all hover:bg-[#059669]"
                >
                  Save Update
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default WorkUpdate
