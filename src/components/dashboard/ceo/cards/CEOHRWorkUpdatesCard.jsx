import { useState, useEffect } from 'react'
import StatusBadge from '../../../ui/StatusBadge.jsx'
import {
  getHRTasks,
  getHRUpdates,
  addHRTask,
} from '../../../../utils/hrWorkUpdateStore.js'

function CEOHRWorkUpdatesCard() {
  const [tasks, setTasks] = useState(() => getHRTasks())
  const [updates, setUpdates] = useState(() => getHRUpdates())
  const [activeTab, setActiveTab] = useState('UPDATES') // 'UPDATES' | 'TASKS'
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
  const [selectedUpdate, setSelectedUpdate] = useState(null)

  // Form state for assigning new task to HR
  const [newTaskForm, setNewTaskForm] = useState({
    name: '',
    department: 'HR Operations',
    priority: 'High',
    dueDate: '',
    instructions: '',
  })
  const [formError, setFormError] = useState('')

  const reloadData = () => {
    setTasks(getHRTasks())
    setUpdates(getHRUpdates())
  }

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (
        !e.key ||
        e.key === 'jawam_hr_work_updates_v1' ||
        e.key === 'jawam_hr_tasks_v1'
      ) {
        reloadData()
      }
    }
    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [])

  const handleOpenAssignModal = () => {
    setNewTaskForm({
      name: '',
      department: 'HR Operations',
      priority: 'High',
      dueDate: '',
      instructions: '',
    })
    setFormError('')
    setIsAssignModalOpen(true)
  }

  const handleAssignTaskSubmit = (e) => {
    e.preventDefault()
    if (!newTaskForm.name.trim()) {
      setFormError('Please enter a task or initiative title.')
      return
    }

    addHRTask({
      name: newTaskForm.name.trim(),
      department: newTaskForm.department,
      priority: newTaskForm.priority,
      dueDate: newTaskForm.dueDate,
      instructions: newTaskForm.instructions.trim(),
      assignedBy: 'CEO Gaurav Pandey',
    })

    reloadData()
    setIsAssignModalOpen(false)
  }

  const totalTasks = tasks.length
  const completedCount = tasks.filter((t) => t.status === 'Completed').length
  const inProgressCount = tasks.filter((t) => t.status === 'In Progress').length
  const blockedCount = tasks.filter((t) => t.status === 'Blocked').length

  const formatDate = (isoString) => {
    if (!isoString) return 'Recent'
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
    <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#f1f5f9] pb-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eef2ff] text-[20px]">
              📋
            </div>
            <div>
              <h2 className="text-[18px] font-black text-[#111827]">
                HR Operations &amp; Work Updates
              </h2>
              <p className="text-xs text-[#6b7280]">
                Direct reports &amp; operational submissions from HR (Rohit Bhatt)
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenAssignModal}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3b82f6] px-5 py-2.5 text-xs font-black text-white transition hover:bg-[#2563eb] shadow-sm"
        >
          <span>+</span>
          <span>Assign Task to HR</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-2xl bg-[#f8fafc] p-3 text-center border border-[#f1f5f9]">
          <p className="text-[11px] font-bold text-[#6b7280] uppercase tracking-wider">
            Total Initiatives
          </p>
          <p className="mt-1 text-[20px] font-black text-[#111827]">{totalTasks}</p>
        </div>
        <div className="rounded-2xl bg-[#eff6ff] p-3 text-center border border-[#dbeafe]">
          <p className="text-[11px] font-bold text-[#2563eb] uppercase tracking-wider">
            In Progress
          </p>
          <p className="mt-1 text-[20px] font-black text-[#2563eb]">
            {inProgressCount}
          </p>
        </div>
        <div className="rounded-2xl bg-[#ecfdf5] p-3 text-center border border-[#a7f3d0]">
          <p className="text-[11px] font-bold text-[#059669] uppercase tracking-wider">
            Completed
          </p>
          <p className="mt-1 text-[20px] font-black text-[#059669]">
            {completedCount}
          </p>
        </div>
        <div
          className={`rounded-2xl p-3 text-center border ${
            blockedCount > 0
              ? 'bg-[#fef2f2] border-[#fecaca] text-[#dc2626]'
              : 'bg-[#f8fafc] border-[#f1f5f9] text-[#6b7280]'
          }`}
        >
          <p className="text-[11px] font-bold uppercase tracking-wider">
            Blockers / Issues
          </p>
          <p className="mt-1 text-[20px] font-black">{blockedCount}</p>
        </div>
      </div>

      {/* Tab Controls */}
      <div className="mt-5 flex gap-2 border-b border-[#f1f5f9] pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('UPDATES')}
          className={`rounded-xl px-4 py-2 text-xs font-black transition ${
            activeTab === 'UPDATES'
              ? 'bg-[#111827] text-white shadow-sm'
              : 'text-[#6b7280] hover:bg-[#f1f5f9]'
          }`}
        >
          Daily Updates Feed ({updates.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('TASKS')}
          className={`rounded-xl px-4 py-2 text-xs font-black transition ${
            activeTab === 'TASKS'
              ? 'bg-[#111827] text-white shadow-sm'
              : 'text-[#6b7280] hover:bg-[#f1f5f9]'
          }`}
        >
          Assigned Directives ({tasks.length})
        </button>
      </div>

      {/* Tab 1: Updates Feed */}
      {activeTab === 'UPDATES' && (
        <div className="mt-4 space-y-3 max-h-[360px] overflow-y-auto pr-1">
          {updates.length === 0 ? (
            <p className="py-8 text-center text-xs text-[#9ca3af]">
              No work updates recorded yet. Updates submitted by HR will appear here in real time.
            </p>
          ) : (
            updates.map((upd) => (
              <div
                key={upd.id}
                className="rounded-2xl border border-[#e5e7eb] bg-white p-4 transition hover:border-[#bfdbfe] hover:shadow-sm"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-[#e0e7ff] px-2.5 py-0.5 text-[10px] font-extrabold text-[#4338ca]">
                        {upd.department}
                      </span>
                      <StatusBadge status={upd.status} />
                      <span className="text-xs font-bold text-[#6b7280]">
                        {upd.progress}% Progress
                      </span>
                    </div>

                    <h4 className="mt-1.5 text-sm font-bold text-[#111827]">
                      {upd.taskName}
                    </h4>

                    <p className="mt-1 text-xs text-[#4b5563] line-clamp-2">
                      <strong className="font-semibold text-[#111827]">
                        Today's Work:
                      </strong>{' '}
                      {upd.todayWork || upd.todayContribution || 'No description entered.'}
                    </p>

                    {upd.blockers && (
                      <div className="mt-2 rounded-xl border border-red-200 bg-red-50 p-2 text-xs text-red-700">
                        <span className="font-black">⚠️ Blocker Flagged:</span>{' '}
                        {upd.blockers}
                      </div>
                    )}
                  </div>

                  <div className="text-right flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2">
                    <span className="text-[11px] font-semibold text-[#9ca3af]">
                      {formatDate(upd.submittedAt)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setSelectedUpdate(upd)}
                      className="text-xs font-bold text-[#2563eb] hover:underline"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Assigned Tasks List */}
      {activeTab === 'TASKS' && (
        <div className="mt-4 space-y-3 max-h-[360px] overflow-y-auto pr-1">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between rounded-2xl border border-[#e5e7eb] bg-white p-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-[#f1f5f9] px-2.5 py-0.5 text-[10px] font-bold text-[#475569]">
                    {task.department}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold ${
                      task.priority === 'High'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {task.priority || 'Medium'} Priority
                  </span>
                </div>
                <h4 className="mt-1 text-sm font-bold text-[#111827]">
                  {task.name}
                </h4>
                <p className="text-[11px] text-[#6b7280]">
                  Assigned by {task.assignedBy || 'CEO Gaurav Pandey'} •{' '}
                  {task.assignedDate || 'Oct 2026'}
                </p>
              </div>

              <div className="text-right">
                <StatusBadge status={task.status} />
                <p className="mt-1 text-xs font-black text-[#111827]">
                  {task.progress}%
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal 1: Assign Task to HR */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[28px] bg-white p-7 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
              <div>
                <h3 className="text-lg font-black text-[#111827]">
                  Assign Directive / Task to HR
                </h3>
                <p className="text-xs text-[#6b7280] mt-0.5">
                  Direct assignment to HR (Rohit Bhatt) from CEO Gaurav Pandey
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAssignModalOpen(false)}
                className="rounded-full p-2 text-[#9ca3af] hover:bg-[#f3f4f6]"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAssignTaskSubmit} className="mt-5 space-y-4">
              {formError && (
                <div className="rounded-xl bg-red-50 p-2.5 text-xs font-bold text-red-600">
                  {formError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#111827]">
                  Task / Directive Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Conduct Q4 Employee Performance Review Cycle"
                  value={newTaskForm.name}
                  onChange={(e) =>
                    setNewTaskForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="mt-1 w-full rounded-2xl border border-[#d1d5db] bg-white px-4 py-2.5 text-xs text-[#111827] outline-none focus:border-[#3b82f6] focus:ring-2 focus:ring-[#bfdbfe]/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#111827]">
                    Department / Domain
                  </label>
                  <select
                    value={newTaskForm.department}
                    onChange={(e) =>
                      setNewTaskForm((prev) => ({
                        ...prev,
                        department: e.target.value,
                      }))
                    }
                    className="mt-1 w-full rounded-2xl border border-[#d1d5db] bg-white px-3 py-2.5 text-xs text-[#111827] outline-none focus:border-[#3b82f6]"
                  >
                    <option value="HR Operations">HR Operations</option>
                    <option value="Recruitment">Recruitment / Talent</option>
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
                    value={newTaskForm.priority}
                    onChange={(e) =>
                      setNewTaskForm((prev) => ({
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
                  Due Date (Optional)
                </label>
                <input
                  type="date"
                  value={newTaskForm.dueDate}
                  onChange={(e) =>
                    setNewTaskForm((prev) => ({ ...prev, dueDate: e.target.value }))
                  }
                  className="mt-1 w-full rounded-2xl border border-[#d1d5db] bg-white px-4 py-2 text-xs text-[#111827] outline-none focus:border-[#3b82f6]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#111827]">
                  Executive Directive / Instructions
                </label>
                <textarea
                  rows={3}
                  placeholder="Outline key deliverables, expectations, or required outcomes..."
                  value={newTaskForm.instructions}
                  onChange={(e) =>
                    setNewTaskForm((prev) => ({
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
                  onClick={() => setIsAssignModalOpen(false)}
                  className="rounded-full border border-[#e5e7eb] px-5 py-2.5 text-xs font-bold text-[#4b5563] hover:bg-[#f9fafb]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-full bg-[#2563eb] px-6 py-2.5 text-xs font-black text-white hover:bg-[#1d4ed8]"
                >
                  Assign Directive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: View Update Details */}
      {selectedUpdate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-[28px] bg-white p-7 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-3">
              <div>
                <h3 className="text-lg font-black text-[#111827]">
                  HR Work Update Details
                </h3>
                <p className="text-xs text-[#6b7280]">
                  Submitted by {selectedUpdate.submittedBy} on{' '}
                  {formatDate(selectedUpdate.submittedAt)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUpdate(null)}
                className="rounded-full p-2 text-[#9ca3af] hover:bg-[#f3f4f6]"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div className="rounded-2xl bg-[#f8fafc] p-4 border border-[#f1f5f9]">
                <p className="text-xs text-[#6b7280]">Initiative / Task</p>
                <h4 className="text-base font-black text-[#111827]">
                  {selectedUpdate.taskName}
                </h4>
                <div className="mt-2 flex items-center gap-2">
                  <span className="rounded-full bg-[#e0e7ff] px-2 py-0.5 text-[10px] font-extrabold text-[#4338ca]">
                    {selectedUpdate.department}
                  </span>
                  <StatusBadge status={selectedUpdate.status} />
                  <span className="text-xs font-black text-[#111827]">
                    {selectedUpdate.progress}% Completed
                  </span>
                </div>
              </div>

              <div>
                <p className="text-xs font-black text-[#111827]">
                  Today's Contribution &amp; Progress
                </p>
                <p className="mt-1 rounded-xl bg-white p-3 text-xs text-[#374151] border border-[#e5e7eb]">
                  {selectedUpdate.todayWork || selectedUpdate.todayContribution || 'No details entered.'}
                </p>
              </div>

              {selectedUpdate.blockers && (
                <div>
                  <p className="text-xs font-black text-red-600">
                    ⚠️ Blockers / Issues Requiring Action
                  </p>
                  <p className="mt-1 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-bold text-red-700">
                    {selectedUpdate.blockers}
                  </p>
                </div>
              )}

              {selectedUpdate.tomorrowPlan && (
                <div>
                  <p className="text-xs font-black text-[#111827]">
                    Tomorrow's Plan
                  </p>
                  <p className="mt-1 rounded-xl bg-white p-3 text-xs text-[#374151] border border-[#e5e7eb]">
                    {selectedUpdate.tomorrowPlan}
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedUpdate(null)}
                className="rounded-full bg-[#111827] px-6 py-2.5 text-xs font-black text-white hover:bg-black"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CEOHRWorkUpdatesCard
