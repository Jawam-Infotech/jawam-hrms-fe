import { useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'

const projectData = {
  hrms: {
    title: 'HRMS',
    priority: 'High',
    progress: 85,
    status: 'On Track',
    assigned: 7,
    completed: 3,
    blocked: 2,
    dueDate: '30 Jun 2025',
    daysRemaining: 4,
    teamMembers: [
      { name: 'Amit Raj', role: 'UI/UX Role' },
      { name: 'Rajesh Singh', role: 'Project Manager' },
      { name: 'Naman Singh', role: 'Developer' },
      { name: 'Brijesh Bisht', role: 'Tester' },
    ],
    activity: [
      'Neha updated Employee Module (80%)',
      'Neha updated Employee Module (80%)',
      'Neha updated Employee Module (80%)',
      'Neha updated Employee Module (80%)',
    ],
    resources: [
      { name: 'HRMS BRD.pdf', category: 'Requirement', uploadedBy: 'Rajesh Singh', date: '12/05/2026' },
      { name: 'Wireframe.fig', category: 'Design', uploadedBy: 'Gaurav', date: '12/05/2026' },
      { name: 'Sprint_note.pdf', category: 'Meeting', uploadedBy: 'Rajesh Singh', date: '12/05/2026' },
      { name: 'API Docs.pdf', category: 'Technical', uploadedBy: 'Naman', date: '12/05/2026' },
    ],
    tasks: [
      { name: 'Dashboard UI', progress: 80, status: 'In Progress' },
      { name: 'Leave Module', progress: 60, status: 'In Progress' },
      { name: 'Wire framing', progress: 100, status: 'Completed' },
      { name: 'Wire framing', progress: 40, status: 'Blocked' },
    ],
  },
}

const statusClasses = {
  'In Progress': 'bg-[#dbeafe] text-[#0284c7]',
  Completed: 'bg-[#d1fae5] text-[#059669]',
  Blocked: 'bg-[#fee2e2] text-[#dc2626]',
}

function ProjectDetails() {
  const navigate = useNavigate()
  const { projectId } = useParams()
  const project = projectData[projectId] || projectData.hrms

  const stats = useMemo(
    () => ({
      progress: project.progress,
      assigned: project.assigned,
      completed: project.completed,
      blocked: project.blocked,
      dueDate: project.dueDate,
      daysRemaining: project.daysRemaining,
    }),
    [project],
  )

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <button
          type="button"
          onClick={() => navigate('/projects')}
          className="inline-flex items-center gap-2 rounded-full border border-[#e5e7eb] bg-white px-4 py-2 text-[14px] font-semibold text-[#111827] hover:bg-[#f8fafc]"
        >
          ← Back to Your Projects
        </button>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-[32px] font-black text-[#111827]">{project.title}</h1>
            <p className="text-[16px] text-[#5f6679] mt-2">Project Overview</p>
          </div>
          <span className="rounded-full bg-[#fee2e2] px-4 py-2 text-[14px] font-semibold text-[#b91c1c]">Priority: {project.priority}</span>
        </div>

        <div className="grid gap-6 xl:grid-cols-3">
          <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <p className="text-[14px] font-semibold text-[#6b7280]">Progress</p>
            <div className="mt-6 flex items-center gap-4">
              <div className="relative h-28 w-28 rounded-full bg-[#f3f4f6]">
                <div className="absolute inset-0 flex items-center justify-center text-[24px] font-black text-[#111827]">{stats.progress}%</div>
                <div className="absolute inset-0 rounded-full border-[12px] border-[#d1fae5]" />
              </div>
              <p className="text-[14px] text-[#6b7280]">Project is on track. {stats.progress} of 5 tasks completed.</p>
            </div>
          </div>

          <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <p className="text-[14px] font-semibold text-[#6b7280]">My Contribution</p>
            <p className="mt-6 text-[28px] font-black text-[#10b981]">30%</p>
            <div className="mt-4 grid gap-3 text-[14px] text-[#374151]">
              <div className="flex items-center justify-between">
                <span>Assigned</span>
                <span>{stats.assigned}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Completed</span>
                <span>{stats.completed}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Blocked</span>
                <span>{stats.blocked}</span>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <p className="text-[14px] font-semibold text-[#6b7280]">Priority</p>
            <div className="mt-6 space-y-3 text-[14px] text-[#374151]">
              <div className="rounded-[18px] border border-[#e5e7eb] bg-[#f8fafc] p-4">
                <p className="font-semibold text-[#111827]">Due Date</p>
                <p className="mt-2">{stats.dueDate}</p>
              </div>
              <div className="rounded-[18px] border border-[#e5e7eb] bg-[#f8fafc] p-4">
                <p className="font-semibold text-[#111827]">Days Remaining</p>
                <p className="mt-2">{stats.daysRemaining}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <h2 className="text-[18px] font-black text-[#111827]">Team Members</h2>
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full text-left text-[14px]">
                <tbody>
                  {project.teamMembers.map((member) => (
                    <tr key={member.name} className="border-b border-[#f1f5f9] last:border-0">
                      <td className="px-4 py-4 font-semibold text-[#111827]">{member.name}</td>
                      <td className="px-4 py-4 text-[#374151]">{member.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <h2 className="text-[18px] font-black text-[#111827]">Recent Activity</h2>
            <div className="mt-6 space-y-3 text-[14px] text-[#374151]">
              {project.activity.map((item, index) => (
                <div key={index} className="rounded-[18px] border border-[#e5e7eb] bg-[#f8fafc] p-4">
                  <p>{item}</p>
                  <p className="mt-2 text-[12px] text-[#6b7280]">2 min ago</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-[18px] font-black text-[#111827]">Project Resources</h2>
            <button className="rounded-full bg-[#eff6ff] px-4 py-2 text-[14px] font-semibold text-[#2563eb] hover:bg-[#dbeafe]">Upload Document</button>
          </div>
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left text-[14px]">
              <thead>
                <tr className="border-b border-[#e5e7eb] text-[#6b7280]">
                  <th className="px-4 py-4 font-semibold">File Name</th>
                  <th className="px-4 py-4 font-semibold">Category</th>
                  <th className="px-4 py-4 font-semibold">Uploaded by</th>
                  <th className="px-4 py-4 font-semibold">Date</th>
                  <th className="px-4 py-4 font-semibold">View</th>
                </tr>
              </thead>
              <tbody>
                {project.resources.map((resource) => (
                  <tr key={resource.name} className="border-b border-[#f1f5f9] last:border-0">
                    <td className="px-4 py-4 text-[#111827]">{resource.name}</td>
                    <td className="px-4 py-4 text-[#374151]">{resource.category}</td>
                    <td className="px-4 py-4 text-[#374151]">{resource.uploadedBy}</td>
                    <td className="px-4 py-4 text-[#374151]">{resource.date}</td>
                    <td className="px-4 py-4 text-[#2563eb]">👁️</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
          <h2 className="text-[18px] font-black text-[#111827]">Your Assigned Tasks</h2>
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left text-[14px]">
              <thead>
                <tr className="border-b border-[#e5e7eb] text-[#6b7280]">
                  <th className="px-4 py-4 font-semibold">Task Name</th>
                  <th className="px-4 py-4 font-semibold">Progress</th>
                  <th className="px-4 py-4 font-semibold">Status</th>
                  <th className="px-4 py-4 font-semibold">View</th>
                </tr>
              </thead>
              <tbody>
                {project.tasks.map((task) => (
                  <tr key={task.name} className="border-b border-[#f1f5f9] last:border-0">
                    <td className="px-4 py-4 text-[#111827]">{task.name}</td>
                    <td className="px-4 py-4 text-[#374151]">{task.progress}%</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-[12px] font-bold ${statusClasses[task.status]}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-[#2563eb]">👁️</td>
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

export default ProjectDetails
