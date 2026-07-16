import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'

const projectCards = [
  {
    id: 'hrms',
    title: 'HRMS',
    progress: 46,
    dueDate: '30/12/2026',
    teamLead: 'Naman K.',
    priority: 'High',
    tagColor: 'bg-[#fee2e2] text-[#b91c1c]',
  },
  {
    id: 'ims',
    title: 'IMS',
    progress: 46,
    dueDate: '30/12/2026',
    teamLead: 'Naman K.',
    priority: 'Medium',
    tagColor: 'bg-[#fef3c7] text-[#b45309]',
  },
  {
    id: 'jawam',
    title: 'Jawam Website',
    progress: 46,
    dueDate: '30/12/2026',
    teamLead: 'Naman K.',
    priority: 'High',
    tagColor: 'bg-[#fee2e2] text-[#b91c1c]',
  },
]

const assignedTasks = [
  { id: '1', name: 'Dashboard UI', project: 'HRMS', progress: 80, status: 'In Progress', priority: 'High', endDate: '10/06/2025', description: 'Dashboard design and implementation to match the new HRMS interface.', file: 'dashboard-specs.pdf' },
  { id: '2', name: 'Leave Module', project: 'Jawam Website', progress: 60, status: 'In Progress', priority: 'Medium', endDate: '15/06/2025', description: 'Develop leave request form, approval flow and history display.', file: 'leave-flow.pdf' },
  { id: '3', name: 'Wire framing', project: 'IMS Product', progress: 100, status: 'Completed', priority: 'Low', endDate: '01/06/2025', description: 'Complete wireframes for the IMS product screens.', file: 'ims-wireframes.pdf' },
  { id: '4', name: 'Wire framing', project: 'HRMS', progress: 40, status: 'Blocked', priority: 'High', endDate: '20/06/2025', description: 'Finalize wireframes for HRMS task assignment and reports.', file: 'hrms-wireframes.pdf' },
]

const statusClasses = {
  'In Progress': 'bg-[#dbeafe] text-[#0284c7]',
  Completed: 'bg-[#d1fae5] text-[#059669]',
  Blocked: 'bg-[#fee2e2] text-[#dc2626]',
}

function Projects() {
  const navigate = useNavigate()
  const [selectedTask, setSelectedTask] = useState(null)

  const stats = useMemo(
    () => ({
      activeProjects: projectCards.length,
      openTasks: assignedTasks.filter((task) => task.status === 'In Progress').length,
      dueThisWeek: 4,
      completedTask: assignedTasks.filter((task) => task.status === 'Completed').length,
    }),
    [],
  )

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-[32px] font-black text-[#111827]">Project Management</h1>
          <p className="text-[16px] text-[#5f6679] mt-2">Apply and track your leave requests</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <p className="text-[14px] font-semibold text-[#6b7280]">Active Project</p>
            <p className="mt-4 text-[28px] font-black text-[#111827]">{stats.activeProjects}</p>
          </div>
          <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <p className="text-[14px] font-semibold text-[#6b7280]">Open Tasks</p>
            <p className="mt-4 text-[28px] font-black text-[#10b981]">{stats.openTasks}</p>
          </div>
          <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <p className="text-[14px] font-semibold text-[#6b7280]">Due this week</p>
            <p className="mt-4 text-[28px] font-black text-[#f59e0b]">{stats.dueThisWeek}</p>
          </div>
          <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <p className="text-[14px] font-semibold text-[#6b7280]">Completed task</p>
            <p className="mt-4 text-[28px] font-black text-[#ef4444]">{stats.completedTask}</p>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-[24px] font-black text-[#111827]">Projects</h2>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projectCards.map((project) => (
              <div key={project.id} className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-[20px] font-black text-[#111827]">{project.title}</h3>
                    <p className="mt-4 text-[14px] text-[#6b7280]">Progress: {project.progress}%</p>
                    <p className="mt-2 text-[14px] text-[#6b7280]">Due Date: {project.dueDate}</p>
                    <p className="mt-2 text-[14px] text-[#6b7280]">Team Lead: {project.teamLead}</p>
                  </div>
                  <span className={`rounded-full px-3 py-2 text-[12px] font-semibold ${project.tagColor}`}>{project.priority}</span>
                </div>
                <button
                  type="button"
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="mt-6 inline-flex items-center rounded-full bg-[#f8fafc] px-4 py-2 text-[14px] font-semibold text-[#2563eb] transition-all hover:bg-[#e0efff]"
                >
                  View Project
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[30px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
          <h2 className="text-[20px] font-black text-[#111827] mb-6">Your Assigned Tasks</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-[14px]">
              <thead>
                <tr className="border-b border-[#e5e7eb] text-[#6b7280]">
                  <th className="px-6 py-4 font-semibold">Task Name</th>
                  <th className="px-6 py-4 font-semibold">Project</th>
                  <th className="px-6 py-4 font-semibold">Progress</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">View</th>
                </tr>
              </thead>
              <tbody>
                {assignedTasks.map((task) => (
                  <tr key={task.id} className="border-b border-[#f1f5f9] hover:bg-[#f8fafc]">
                    <td className="px-6 py-4 font-semibold text-[#111827]">{task.name}</td>
                    <td className="px-6 py-4 text-[#111827]">{task.project}</td>
                    <td className="px-6 py-4 text-[#111827]">{task.progress}%</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-[12px] font-bold ${statusClasses[task.status]}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => setSelectedTask(task)}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#eff6ff] text-[#2563eb] transition-all hover:bg-[#dbeafe]"
                        aria-label="View task details"
                      >
                        👁️
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="max-w-[800px] w-full rounded-[30px] bg-white p-8 shadow-2xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-[24px] font-black text-[#111827]">{selectedTask.name}</h3>
                <p className="text-[14px] text-[#6b7280] mt-2">{selectedTask.project} • {selectedTask.priority} priority</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                className="rounded-full border border-[#e5e7eb] px-4 py-2 text-[14px] font-semibold text-[#ef4444] hover:bg-[#fef2f2]"
              >
                Close
              </button>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-2">
              <div className="space-y-5 rounded-[24px] bg-[#f8fafc] p-6">
                <div>
                  <p className="text-[14px] font-semibold text-[#111827]">Task Name</p>
                  <p className="mt-2 text-[16px] text-[#374151]">{selectedTask.name}</p>
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#111827]">Project Name</p>
                  <p className="mt-2 text-[16px] text-[#374151]">{selectedTask.project}</p>
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#111827]">Priority</p>
                  <p className="mt-2 text-[16px] text-[#374151]">{selectedTask.priority}</p>
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#111827]">End Date</p>
                  <p className="mt-2 text-[16px] text-[#374151]">{selectedTask.endDate}</p>
                </div>
              </div>

              <div className="space-y-5 rounded-[24px] bg-[#f8fafc] p-6">
                <div>
                  <p className="text-[14px] font-semibold text-[#111827]">Description</p>
                  <p className="mt-2 text-[16px] text-[#374151]">{selectedTask.description}</p>
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-[#111827]">Attach File (if any)</p>
                  <p className="mt-2 text-[16px] text-[#374151]">{selectedTask.file}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}

export default Projects
