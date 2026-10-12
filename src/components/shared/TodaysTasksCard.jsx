export default function TodaysTasksCard() {
  const tasks = [
    { name: 'Dashboard UI', priority: 'High', date: '15 Jun 2026', status: 'In Progress' },
    { name: 'Leave Module', priority: 'Medium', date: '15 Jun 2026', status: 'In Progress' },
    { name: 'Wire framing', priority: 'Low', date: '15 Jun 2026', status: 'Completed' },
  ]

  return (
    <div className="rounded-[20px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-[18px] font-extrabold text-[#111827]">Today&apos;s Tasks</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-[14px]">
          <thead>
            <tr className="border-b border-[#f3f4f6]">
              <th className="pb-3 text-left font-extrabold text-[#111827]">Task Name</th>
              <th className="pb-3 text-left font-extrabold text-[#111827]">Priority</th>
              <th className="pb-3 text-left font-extrabold text-[#111827]">Due Date</th>
              <th className="pb-3 text-left font-extrabold text-[#111827]">Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, idx) => (
              <tr key={idx} className="border-b border-[#f3f4f6] last:border-0 hover:bg-[#f9fafb]">
                <td className="py-4 font-bold text-[#111827]">{task.name}</td>
                <td className="py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-[12px] font-bold ${
                      task.priority === 'High'
                        ? 'bg-[#fee2e2] text-[#ef4444]'
                        : task.priority === 'Medium'
                        ? 'bg-[#fef3c7] text-[#d97706]'
                        : 'bg-[#dcfce7] text-[#16a34a]'
                    }`}
                  >
                    {task.priority}
                  </span>
                </td>
                <td className="py-4 text-[#4b5563]">{task.date}</td>
                <td className="py-4">
                  <span
                    className={`rounded-full px-4 py-1.5 text-[12px] font-bold ${
                      task.status === 'In Progress'
                        ? 'bg-[#e0f2fe] text-[#0284c7]'
                        : 'bg-[#dcfce7] text-[#16a34a]'
                    }`}
                  >
                    {task.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

