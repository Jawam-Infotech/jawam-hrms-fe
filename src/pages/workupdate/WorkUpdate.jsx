import { useState, useEffect } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import StatusBadge from '../../components/ui/StatusBadge.jsx'
import {
  getHRTasks,
  getHRUpdates,
  recordHRUpdate,
  addHRTask,
} from '../../utils/hrWorkUpdateStore.js'

function WorkUpdate() {
  const [tasks, setTasks] = useState(() => getHRTasks())
  const [updates, setUpdates] = useState(() => getHRUpdates())
  const [selectedTask, setSelectedTask] = useState(null)
  const [activeTab, setActiveTab] = useState('TASKS') // 'TASKS' | 'HISTORY'
  const [isAddInitiativeModalOpen, setIsAddInitiativeModalOpen] = useState(false)
  const [successBanner, setSuccessBanner] = useState('')

  const [formState, setFormState] = useState({
    todayContribution: '',
    todayWork: '',
    blockers: '',
    tomorrowPlan: '',
    status: 'In Progress',
    attachment: null,
  })

  // New self-directed initiative form
  const [newInitiativeForm, setNewInitiativeForm] = useState({
    name: '',
    department: 'HR Operations',
    priority: 'Medium',
    instructions: '',
  })

  const loadData = () => {
    setTasks(getHRTasks())
    setUpdates(getHRUpdates())
  }

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (
        !e.key ||
        e.key === 'jawam_hr_tasks_v1' ||
        e.key === 'jawam_hr_work_updates_v1'
      ) {
        loadData()
      }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const openModal = (task) => {
    setSelectedTask(task)
    setFormState({
      todayContribution: `${task.progress}%`,
      todayWork: `Updated ${task.name} activities and milestones.`,
      blockers: task.status === 'Blocked' ? 'Awaiting CEO / management approvals.' : '',
      tomorrowPlan: `Continue execution on ${task.name}.`,
      status: task.status || 'In Progress',
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

    const parsedProgress =
      parseInt(String(formState.todayContribution).replace(/[^0-9]/g, ''), 10) ||
      selectedTask.progress

    recordHRUpdate({
      taskId: selectedTask.id,
      taskName: selectedTask.name,
      department: selectedTask.department || 'HR Operations',
      progress: Math.min(100, Math.max(0, parsedProgress)),
      status: formState.status,
      todayContribution: formState.todayContribution,
      todayWork: formState.todayWork,
      blockers: formState.blockers,
      tomorrowPlan: formState.tomorrowPlan,
    })

    loadData()
    closeModal()

    setSuccessBanner(
      `Daily work update for "${selectedTask.name}" has been submitted directly to CEO Gaurav Pandey.`
    )
    setTimeout(() => {
      setSuccessBanner('')
    }, 6000)
  }

  const handleAddInitiative = (e) => {
    e.preventDefault()
    if (!newInitiativeForm.name.trim()) return

    addHRTask({
      name: newInitiativeForm.name.trim(),
      department: newInitiativeForm.department,
      priority: newInitiativeForm.priority,
      instructions: newInitiativeForm.instructions.trim(),
      assignedBy: 'Self (HR Initiative)',
    })

    loadData()
    setIsAddInitiativeModalOpen(false)
    setNewInitiativeForm({
      name: '',
      department: 'HR Operations',
      priority: 'Medium',
      instructions: '',
    })

    setSuccessBanner('New HR initiative added to your board.')
    setTimeout(() => {
      setSuccessBanner('')
    }, 5000)
  }

  const activeTasksCount = tasks.filter((t) => t.status !== 'Completed').length
  const completedCount = tasks.filter((t) => t.status === 'Completed').length
  const inProgressCount = tasks.filter((t) => t.status === 'In Progress').length
  const blockedCount = tasks.filter((t) => t.status === 'Blocked').length

  const stats = [
    { label: 'Assigned Task', value: `${activeTasksCount} Active`, color: 'text-[#3b82f6]', icon: '📌' },
    { label: 'Completed Task', value: `${completedCount}`, color: 'text-[#10b981]', icon: '✅' },
    { label: 'In Process Task', value: `${inProgressCount}`, color: 'text-[#f59e0b]', icon: '⏳' },
    { label: 'Blocked Task', value: `${blockedCount}`, color: 'text-[#ef4444]', icon: '🚫' },
  ]

  const formatUpdateDate = (isoString) => {
    if (!isoString) return 'Just now'
    try {
      const d = new Date(isoString)
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    } catch {
      return isoString
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[32px] font-black text-[#111827]">Work Update</h1>
            <p className="text-[16px] text-[#5f6679] mt-1">
              Submit your daily HR operations progress directly to CEO Gaurav Pandey
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsAddInitiativeModalOpen(true)}
              className="rounded-full bg-[#111827] px-6 py-2.5 text-xs font-black text-white hover:bg-black transition shadow-sm"
            >
              + Log HR Initiative
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {successBanner && (
          <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3.5 text-emerald-800 shadow-sm animate-fadeIn">
            <div className="flex items-center gap-3">
              <span className="text-lg">✅</span>
              <p className="text-xs font-bold">{successBanner}</p>
            </div>
            <button
              type="button"
              onClick={() => setSuccessBanner('')}
              className="text-emerald-700 hover:text-emerald-900 font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Metric Cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div className="rounded-2xl bg-[#eef2ff] p-3 text-[20px]">{stat.icon}</div>
                <div className="text-right">
                  <p className="text-[19px] font-semibold pr-4">{stat.label}</p>
                  <p className={`mt-3 text-[20px] pr-[65px] text-left font-black ${stat.color}`}>{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 border-b border-[#e5e7eb] pb-3">
          <button
            type="button"
            onClick={() => setActiveTab('TASKS')}
            className={`rounded-full px-5 py-2 text-xs font-black transition ${
              activeTab === 'TASKS'
                ? 'bg-[#3b82f6] text-white shadow-sm'
                : 'text-[#6b7280] hover:bg-[#f1f5f9]'
            }`}
          >
            Assigned HR Directives ({tasks.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('HISTORY')}
            className={`rounded-full px-5 py-2 text-xs font-black transition ${
              activeTab === 'HISTORY'
                ? 'bg-[#3b82f6] text-white shadow-sm'
                : 'text-[#6b7280] hover:bg-[#f1f5f9]'
            }`}
          >
            My Submission History ({updates.length})
          </button>
        </div>

        {/* Tab 1: Assigned Tasks Table */}
        {activeTab === 'TASKS' && (
          <div className="overflow-x-auto rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-[18px] font-black text-[#111827]">
                  Assigned HR Tasks &amp; Initiatives
                </h2>
                <p className="text-xs text-[#6b7280] mt-0.5">
                  Directives assigned by CEO Gaurav Pandey and ongoing HR operational tasks
                </p>
              </div>
            </div>

            <table className="min-w-full text-left text-[14px]">
              <thead>
                <tr className="border-b border-[#e5e7eb] text-[#6b7280]">
                  <th className="px-6 py-4 font-semibold">Task Name</th>
                  <th className="px-6 py-4 font-semibold">Department / Domain</th>
                  <th className="px-6 py-4 font-semibold">Assigned By</th>
                  <th className="px-6 py-4 font-semibold">Progress</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr key={task.id} className="border-b border-[#f1f5f9] hover:bg-[#f8fafc]">
                    <td className="px-6 py-4">
                      <p className="font-bold text-[#111827]">{task.name}</p>
                      {task.priority && (
                        <span
                          className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                            task.priority === 'High'
                              ? 'bg-rose-50 text-rose-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {task.priority} Priority
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-[#475569] font-medium">
                      {task.department || 'HR Operations'}
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-[#6b7280]">
                      {task.assignedBy || 'CEO Gaurav Pandey'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-[#111827] min-w-[32px]">
                          {task.progress}%
                        </span>
                        <div className="h-2 w-20 rounded-full bg-[#e5e7eb] overflow-hidden">
                          <div
                            className={`h-full ${
                              task.status === 'Completed'
                                ? 'bg-emerald-500'
                                : task.status === 'Blocked'
                                  ? 'bg-rose-500'
                                  : 'bg-blue-600'
                            }`}
                            style={{ width: `${task.progress}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={task.status} />
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => openModal(task)}
                        className="rounded-full bg-[#2563eb] px-5 py-2 text-[13px] font-bold text-white transition-all hover:bg-[#1d4ed8] shadow-sm"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Submission History */}
        {activeTab === 'HISTORY' && (
          <div className="space-y-4">
            {updates.length === 0 ? (
              <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-12 text-center text-xs text-[#9ca3af]">
                No daily updates logged yet. Update a task to record your daily submission to the CEO.
              </div>
            ) : (
              updates.map((upd) => (
                <div
                  key={upd.id}
                  className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between border-b border-[#f1f5f9] pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="rounded-full bg-[#e0e7ff] px-2.5 py-0.5 text-[11px] font-extrabold text-[#4338ca]">
                          {upd.department}
                        </span>
                        <StatusBadge status={upd.status} />
                        <span className="text-xs font-bold text-[#6b7280]">
                          {upd.progress}% Completed
                        </span>
                      </div>
                      <h3 className="mt-1.5 text-base font-black text-[#111827]">
                        {upd.taskName}
                      </h3>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-[#9ca3af]">
                        Reported {formatUpdateDate(upd.submittedAt)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl bg-[#f8fafc] p-4 border border-[#f1f5f9]">
                      <p className="text-xs font-black text-[#111827]">Today's Work Summary</p>
                      <p className="mt-1 text-xs text-[#4b5563]">
                        {upd.todayWork || upd.todayContribution || 'No summary entered.'}
                      </p>
                    </div>

                    <div className="rounded-2xl bg-[#f8fafc] p-4 border border-[#f1f5f9]">
                      <p className="text-xs font-black text-[#111827]">Tomorrow's Plan</p>
                      <p className="mt-1 text-xs text-[#4b5563]">
                        {upd.tomorrowPlan || 'No plan entered.'}
                      </p>
                    </div>
                  </div>

                  {upd.blockers && (
                    <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 p-3 text-xs text-red-700 font-medium">
                      <span className="font-black">⚠️ Blocker Flagged to CEO:</span>{' '}
                      {upd.blockers}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Modal: Update Task */}
        {selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <div className="max-w-[980px] w-full rounded-[30px] bg-white p-8 shadow-2xl">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-[#f1f5f9] pb-4">
                <div>
                  <h3 className="text-[24px] font-black text-[#111827]">Submit Work Update</h3>
                  <p className="text-[14px] text-[#6b7280] mt-1">
                    Your daily progress, accomplishments, and blockers are sent directly to CEO Gaurav Pandey.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-full border border-[#e5e7eb] px-4 py-2 text-[14px] font-semibold text-[#111827] hover:bg-[#f8fafc]"
                >
                  Close
                </button>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <div className="space-y-6 rounded-[24px] bg-[#f8fafc] p-6">
                  <div>
                    <p className="text-[14px] font-semibold text-[#111827]">Task / Initiative Name:</p>
                    <p className="mt-2 text-[16px] font-bold text-[#1e293b]">{selectedTask.name}</p>
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[#111827]">Department / Domain:</p>
                    <p className="mt-2 text-[16px] text-[#374151]">{selectedTask.department || 'HR Operations'}</p>
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[#111827]">Assigned By:</p>
                    <p className="mt-2 text-[16px] text-[#374151]">{selectedTask.assignedBy || 'CEO Gaurav Pandey'}</p>
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[#111827]">Previous Progress:</p>
                    <p className="mt-2 text-[16px] text-[#374151]">{selectedTask.progress}%</p>
                  </div>
                </div>

                <div className="space-y-6 rounded-[24px] bg-[#f8fafc] p-6">
                  <div>
                    <label className="text-[14px] font-semibold text-[#111827] block">
                      Today's Contribution (Progress %)
                    </label>
                    <input
                      type="text"
                      value={formState.todayContribution}
                      onChange={(event) => handleFieldChange('todayContribution', event.target.value)}
                      placeholder="e.g. 85%"
                      className="mt-2 h-12 w-full rounded-[18px] border border-[#d1d5db] bg-white px-4 text-[14px] text-[#111827] outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#bfdbfe]/50"
                    />
                  </div>
                  <div>
                    <label className="text-[14px] font-semibold text-[#111827] block">
                      Today's Work Summary
                    </label>
                    <textarea
                      value={formState.todayWork}
                      onChange={(event) => handleFieldChange('todayWork', event.target.value)}
                      rows={3}
                      placeholder="Detail the operational tasks completed today..."
                      className="mt-2 w-full rounded-[18px] border border-[#d1d5db] bg-white px-4 py-3 text-[14px] text-[#111827] outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#bfdbfe]/50"
                    />
                  </div>
                  <div>
                    <label className="text-[14px] font-semibold text-[#111827] block">
                      Attachments (Optional)
                    </label>
                    <input
                      type="file"
                      onChange={(event) => handleFieldChange('attachment', event.target.files?.[0] || null)}
                      className="mt-2 w-full rounded-[18px] border border-[#d1d5db] bg-white px-4 py-2.5 text-[14px] text-[#111827] outline-none focus:border-[#3b82f6]"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <div className="space-y-6 rounded-[24px] bg-[#f8fafc] p-6">
                  <div>
                    <label className="text-[14px] font-semibold text-[#ef4444] block">
                      Blockers / Issues (Flagged to CEO)
                    </label>
                    <input
                      type="text"
                      value={formState.blockers}
                      onChange={(event) => handleFieldChange('blockers', event.target.value)}
                      placeholder="Leave empty if none. Flagging an issue alerts CEO Gaurav Pandey."
                      className="mt-2 h-12 w-full rounded-[18px] border border-[#d1d5db] bg-white px-4 text-[14px] text-[#111827] outline-none focus:border-[#ef4444] focus:ring-2 focus:ring-[#fecaca]/50"
                    />
                  </div>
                  <div>
                    <label className="text-[14px] font-semibold text-[#111827] block">Tomorrow Plan</label>
                    <input
                      type="text"
                      value={formState.tomorrowPlan}
                      onChange={(event) => handleFieldChange('tomorrowPlan', event.target.value)}
                      placeholder="Key focus areas for tomorrow..."
                      className="mt-2 h-12 w-full rounded-[18px] border border-[#d1d5db] bg-white px-4 text-[14px] text-[#111827] outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#bfdbfe]/50"
                    />
                  </div>
                </div>

                <div className="space-y-6 rounded-[24px] bg-[#f8fafc] p-6">
                  <div>
                    <p className="text-[14px] font-semibold text-[#111827]">Current Status</p>
                    <div className="mt-3 flex flex-wrap gap-3">
                      {['In Progress', 'Completed', 'Blocked'].map((option) => (
                        <label
                          key={option}
                          className={`inline-flex cursor-pointer items-center gap-2.5 rounded-full border px-4 py-2.5 text-[13px] font-bold transition ${
                            formState.status === option
                              ? 'border-[#3b82f6] bg-[#eff6ff] text-[#1d4ed8]'
                              : 'border-[#d1d5db] bg-white text-[#374151]'
                          }`}
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

              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:justify-end border-t border-[#f1f5f9] pt-4">
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
                  className="rounded-full bg-[#10b981] px-8 py-3 text-[14px] font-bold text-white transition-all hover:bg-[#059669] shadow-sm"
                >
                  Submit Update to CEO
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Add HR Initiative */}
        {isAddInitiativeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg rounded-[28px] bg-white p-7 shadow-2xl">
              <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
                <div>
                  <h3 className="text-lg font-black text-[#111827]">
                    Log New HR Initiative / Task
                  </h3>
                  <p className="text-xs text-[#6b7280]">
                    Add an internal HR operational item to your daily board
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddInitiativeModalOpen(false)}
                  className="rounded-full p-2 text-[#9ca3af] hover:bg-[#f3f4f6]"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddInitiative} className="mt-5 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#111827]">
                    Initiative Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Annual Benefits &amp; Insurance Review"
                    value={newInitiativeForm.name}
                    onChange={(e) =>
                      setNewInitiativeForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="mt-1 w-full rounded-2xl border border-[#d1d5db] bg-white px-4 py-2.5 text-xs text-[#111827] outline-none focus:border-[#3b82f6]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#111827]">
                      Department / Domain
                    </label>
                    <select
                      value={newInitiativeForm.department}
                      onChange={(e) =>
                        setNewInitiativeForm((prev) => ({
                          ...prev,
                          department: e.target.value,
                        }))
                      }
                      className="mt-1 w-full rounded-2xl border border-[#d1d5db] bg-white px-3 py-2.5 text-xs text-[#111827] outline-none focus:border-[#3b82f6]"
                    >
                      <option value="HR Operations">HR Operations</option>
                      <option value="Recruitment">Recruitment</option>
                      <option value="HR Governance">HR Governance &amp; Policy</option>
                      <option value="Employee Engagement">Employee Engagement</option>
                      <option value="Payroll &amp; Compliance">Payroll &amp; Compliance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#111827]">
                      Priority
                    </label>
                    <select
                      value={newInitiativeForm.priority}
                      onChange={(e) =>
                        setNewInitiativeForm((prev) => ({
                          ...prev,
                          priority: e.target.value,
                        }))
                      }
                      className="mt-1 w-full rounded-2xl border border-[#d1d5db] bg-white px-3 py-2.5 text-xs text-[#111827] outline-none focus:border-[#3b82f6]"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#111827]">
                    Details / Scope
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter scope and key deliverables..."
                    value={newInitiativeForm.instructions}
                    onChange={(e) =>
                      setNewInitiativeForm((prev) => ({
                        ...prev,
                        instructions: e.target.value,
                      }))
                    }
                    className="mt-1 w-full rounded-2xl border border-[#d1d5db] bg-white px-4 py-2.5 text-xs text-[#111827] outline-none focus:border-[#3b82f6]"
                  />
                </div>

                <div className="mt-6 flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAddInitiativeModalOpen(false)}
                    className="rounded-full border border-[#e5e7eb] px-5 py-2.5 text-xs font-bold text-[#4b5563] hover:bg-[#f9fafb]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-full bg-[#111827] px-6 py-2.5 text-xs font-black text-white hover:bg-black"
                  >
                    Add to Board
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default WorkUpdate
