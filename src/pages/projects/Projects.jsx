import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import StatusBadge from '../../components/ui/StatusBadge.jsx'

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
  {/* Active Project */}
  <div className="rounded-[20px] border border-[#e5e7eb] bg-white p-4 shadow-sm lg:h-[120px]">
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#dbeafe]">
        <svg width="22" height="22" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.40039 25.4531C8.66931 25.4533 9.69727 26.4811 9.69727 27.75C9.69716 29.0189 8.66925 30.0467 7.40039 30.0469C6.13143 30.0469 5.10362 29.0189 5.10352 27.75C5.10352 26.481 6.13136 25.4531 7.40039 25.4531ZM14.7998 25.915H31.4502C32.4648 25.9151 33.2842 26.7354 33.2842 27.75C33.2841 28.7646 32.4648 29.584 31.4502 29.584H14.7998C13.7854 29.5838 12.9659 28.7644 12.9658 27.75C12.9658 26.7355 13.7853 25.9152 14.7998 25.915ZM9.51172 15.4043C9.91905 14.8201 10.6983 14.6527 11.3027 14.9922L11.4316 15.0742L11.4365 15.0684C12.0511 15.505 12.1957 16.3567 11.7637 16.9707L8.52637 21.5957C8.29201 21.9271 7.92615 22.1385 7.52051 22.1729C7.11445 22.2072 6.71432 22.0697 6.42871 21.7842L4.11621 19.4717C3.57884 18.9343 3.57899 18.0657 4.11621 17.5342C4.65367 17.0025 5.52229 16.997 6.05371 17.5342L7.19824 18.6787L7.21191 18.6914L7.22266 18.6768L9.51172 15.4043ZM18.5 16.665H31.4502C32.4648 16.6651 33.2842 17.4854 33.2842 18.5C33.2841 19.5146 32.4648 20.334 31.4502 20.334H18.5C17.4855 20.3339 16.6661 19.5145 16.666 18.5C16.666 17.4854 17.4854 16.6651 18.5 16.665ZM9.51758 6.14844C9.95202 5.52548 10.8095 5.37715 11.4268 5.81152C12.0496 6.246 12.198 7.10349 11.7637 7.7207L8.52637 12.3457C8.29201 12.6771 7.92615 12.8885 7.52051 12.9229C7.11446 12.9572 6.71432 12.8197 6.42871 12.5342L4.11621 10.2217C3.58459 9.68434 3.58462 8.81567 4.11621 8.27832C4.64765 7.74117 5.52211 7.74658 6.05957 8.27832L7.2168 9.43555L7.22754 9.4209L9.51758 6.14844ZM18.5 7.41504H31.4502C32.4648 7.41506 33.2842 8.23536 33.2842 9.25C33.2841 10.2646 32.4648 11.084 31.4502 11.084H18.5C17.4855 11.0839 16.6661 10.2645 16.666 9.25C16.666 8.2354 17.4854 7.41512 18.5 7.41504Z" fill="#3B82F6" stroke="#10B981" strokeWidth="0.03125"/>
        </svg>
      </div>
      <p className="text-[18px] font-bold text-[#111827]">Active Project</p>
    </div>
    <div className="pl-[60px]">
      <div className="mt-3 flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-[#3b82f6]" />
        <p className="text-[20px] font-bold text-[#3b82f6]">{stats.activeProjects}</p>
      </div>
    </div>
  </div>

  {/* Open Tasks */}
  <div className="rounded-[20px] border border-[#e5e7eb] bg-white p-4 shadow-sm lg:h-[120px]">
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#d1fae5]">
        <svg width="22" height="22" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M3.08398 8.86523C3.08398 8.22666 3.60166 7.70898 4.24023 7.70898H31.9902C32.6288 7.70898 33.1465 8.22666 33.1465 8.86523C33.1465 9.50381 32.6288 10.0215 31.9902 10.0215H4.24023C3.60166 10.0215 3.08398 9.50381 3.08398 8.86523ZM3.08398 15.0319C3.08398 14.3933 3.60166 13.8757 4.24023 13.8757H31.9902C32.6288 13.8757 33.1465 14.3933 33.1465 15.0319C33.1465 15.6705 32.6288 16.1882 31.9902 16.1882H4.24023C3.60166 16.1882 3.08398 15.6705 3.08398 15.0319ZM31.1597 19.516C31.6632 19.9088 31.753 20.6353 31.3603 21.1389L25.3478 28.8472C25.1332 29.1223 24.8059 29.2858 24.457 29.2921C24.1082 29.2985 23.7751 29.1469 23.5507 28.8798L20.3132 25.0256C19.9025 24.5366 19.9659 23.8073 20.4549 23.3966C20.9438 22.9858 21.6732 23.0492 22.0839 23.5382L24.4028 26.2988L29.5369 19.7166C29.9296 19.2131 30.6562 19.1233 31.1597 19.516ZM3.08398 21.1986C3.08398 20.56 3.60166 20.0423 4.24023 20.0423H15.0319C15.6705 20.0423 16.1882 20.56 16.1882 21.1986C16.1882 21.8371 15.6705 22.3548 15.0319 22.3548H4.24023C3.60166 22.3548 3.08398 21.8371 3.08398 21.1986ZM3.08398 27.3652C3.08398 26.7267 3.60166 26.209 4.24023 26.209H15.0319C15.6705 26.209 16.1882 26.7267 16.1882 27.3652C16.1882 28.0038 15.6705 28.5215 15.0319 28.5215H4.24023C3.60166 28.5215 3.08398 28.0038 3.08398 27.3652Z" fill="#10B981" stroke="#10B981" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      <p className="text-[18px] font-bold text-[#111827]">Open Tasks</p>
    </div>
    <div className="pl-[60px]">
      <div className="mt-3 flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-[#10b981]" />
        <p className="text-[20px] font-bold text-[#10b981]">{stats.openTasks}</p>
      </div>
    </div>
  </div>

  {/* Due this week */}
  <div className="rounded-[20px] border border-[#e5e7eb] bg-white p-4 lg:h-[120px] shadow-sm">
    <div className="flex items-center gap-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#fef3c7]">
        <svg width="22" height="22" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M3.46875 9.25C3.46875 8.61142 3.98642 8.09375 4.625 8.09375H32.375C33.0136 8.09375 33.5313 8.61142 33.5313 9.25C33.5313 9.88858 33.0136 10.4062 32.375 10.4062H4.625C3.98642 10.4062 3.46875 9.88858 3.46875 9.25ZM3.46875 15.4167C3.46875 14.7781 3.98642 14.2604 4.625 14.2604H32.375C33.0136 14.2604 33.5313 14.7781 33.5313 15.4167C33.5313 16.0552 33.0136 16.5729 32.375 16.5729H4.625C3.98642 16.5729 3.46875 16.0552 3.46875 15.4167ZM3.46875 21.5833C3.46875 20.9448 3.98642 20.4271 4.625 20.4271H16.9583C17.5969 20.4271 18.1146 20.9448 18.1146 21.5833C18.1146 22.2219 17.5969 22.7396 16.9583 22.7396H4.625C3.98642 22.7396 3.46875 22.2219 3.46875 21.5833ZM26.2267 22.2471C26.6597 21.876 27.2986 21.876 27.7316 22.2471L33.1275 26.8721C33.6123 27.2877 33.6685 28.0176 33.2529 28.5025C32.8373 28.9873 32.1074 29.0435 31.6225 28.6279L26.9792 24.6479L22.3358 28.6279C21.851 29.0435 21.121 28.9873 20.7054 28.5025C20.2899 28.0176 20.346 27.2877 20.8309 26.8721L26.2267 22.2471ZM3.46875 27.75C3.46875 27.1114 3.98642 26.5938 4.625 26.5938H16.9583C17.5969 26.5938 18.1146 27.1114 18.1146 27.75C18.1146 28.3886 17.5969 28.9063 16.9583 28.9063H4.625C3.98642 28.9063 3.46875 28.3886 3.46875 27.75Z" fill="#F59E0B" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      <p className="text-[18px] font-bold text-[#111827]">Due this week</p>
    </div>
    <div className="pl-[60px]">
      <div className="mt-3 flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-[#f59e0b]" />
        <p className="text-[20px] font-bold text-[#f59e0b]">{stats.dueThisWeek}</p>
      </div>
    </div>
  </div>

  {/* Completed task */}
  <div className="rounded-[20px] border border-[#e5e7eb] bg-white p-4 shadow-sm lg:h-[120px]">
    <div className="flex items-center gap-3 ">
      
      <div className="flex h-12 w-12  shrink-0 items-center justify-center rounded-full bg-[#fee2e2]">
        <svg width="22" height="22" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M3.46875 9.25C3.46875 8.61142 3.98642 8.09375 4.625 8.09375H32.375C33.0136 8.09375 33.5312 8.61142 33.5312 9.25C33.5312 9.88858 33.0136 10.4062 32.375 10.4062H4.625C3.98642 10.4062 3.46875 9.88858 3.46875 9.25ZM3.46875 15.4167C3.46875 14.7781 3.98642 14.2604 4.625 14.2604H32.375C33.0136 14.2604 33.5312 14.7781 33.5312 15.4167C33.5312 16.0552 33.0136 16.5729 32.375 16.5729H4.625C3.98642 16.5729 3.46875 16.0552 3.46875 15.4167ZM22.3074 19.9949C22.759 19.5434 23.491 19.5434 23.9426 19.9949L26.9792 23.0315L30.0157 19.9949C30.4673 19.5434 31.1994 19.5434 31.6509 19.9949C32.1025 20.4465 32.1025 21.1785 31.6509 21.6301L28.6143 24.6667L31.6509 27.7032C32.1025 28.1548 32.1025 28.8869 31.6509 29.3384C31.1994 29.79 30.4673 29.79 30.0157 29.3384L26.9792 26.3019L23.9426 29.3384C23.491 29.79 22.759 29.79 22.3074 29.3384C21.8559 28.8869 21.8559 28.1548 22.3074 27.7032L25.344 24.6667L22.3074 21.6301C21.8559 21.1785 21.8559 20.4465 22.3074 19.9949ZM3.46875 21.5833C3.46875 20.9448 3.98642 20.4271 4.625 20.4271H16.9583C17.5969 20.4271 18.1146 20.9448 18.1146 21.5833C18.1146 22.2219 17.5969 22.7396 16.9583 22.7396H4.625C3.98642 22.7396 3.46875 22.2219 3.46875 21.5833ZM3.46875 27.75C3.46875 27.1114 3.98642 26.5938 4.625 26.5938H16.9583C17.5969 26.5938 18.1146 27.1114 18.1146 27.75C18.1146 28.3886 17.5969 28.9063 16.9583 28.9063H4.625C3.98642 28.9063 3.46875 28.3886 3.46875 27.75Z" fill="#EF4444" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      
      <p className="text-[18px] font-bold text-[#111827]">Completed task</p>
    </div>
    <div className="pl-[60px]">
      <div className="mt-3 flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-[#ef4444]" />
        <p className="text-[20px] font-bold text-[#ef4444]">{stats.completedTask}</p>
      </div>
    </div>
  </div>
</div>














    <div className="space-y-6">
  <h2 className="text-[24px] font-black text-[#111827]">Projects</h2>
  <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
    {projectCards.map((project) => (
      <div key={project.id} className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4 pb-4">
          <h3 className="text-[18px] font-black text-[#111827]">{project.title}</h3>
          <span className={`rounded-full px-3 py-1 text-[12px] font-semibold ${project.tagColor}`}>{project.priority}</span>
        </div>
        <div className="border-t border-[#e5e7eb]" />
        <div className="space-y-2 py-4 text-[16px] text-[#6b7280]">
          <p><span className="font-semibold text-[#374151]">Progress:</span> {project.progress}%</p>
          <p><span className="font-semibold text-[#374151]">Due Date:</span> {project.dueDate}</p>
          <p><span className="font-semibold text-[#374151]">Team Lead:</span> {project.teamLead}</p>
        </div>
        <div className="border-t border-[#e5e7eb]" />
        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={() => navigate(`/projects/${project.id}`)}
            className="text-[14px] font-semibold text-[#2563eb] transition-colors hover:text-[#1d4ed8] hover:underline"
          >
            View Project
          </button>
        </div>
      </div>
    ))}
  </div>
</div>










        <div className="rounded-[30px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
          <h2 className="text-[20px] font-black text-[#111827] mb-6">Your Assigned Tasks</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-[16px]">
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
                      <StatusBadge status={task.status} />
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
