export default function TodaysTasksCard() {
  const tasks = [
    { name: 'Dashboard UI', priority: 'High', date: '15 Jun 2026', status: 'In Progress' },
    { name: 'Leave Module', priority: 'Medium', date: '15 Jun 2026', status: 'In Progress' },
    { name: 'Wire framing', priority: 'Low', date: '15 Jun 2026', status: 'Completed' },
  ]

  return (
    <div className="bg-white rounded-[16px] border border-[#e5e5e5] p-6 shadow-sm col-span-2">
      <h3 className="text-[18px] font-extrabold text-[#111827] mb-4">Today's Tasks</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-[14px]">
          <thead>
            <tr className="border-b border-[#e5e5e5]">
              <th className="text-left font-extrabold text-[#111827] pb-3">Task Name</th>
              <th className="text-left font-extrabold text-[#111827] pb-3">Priority</th>
              <th className="text-left font-extrabold text-[#111827] pb-3">Due Date</th>
              <th className="text-left font-extrabold text-[#111827] pb-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, idx) => (
              <tr key={idx} className="border-b border-[#e5e5e5] hover:bg-[#f9fafb]">
                <td className="py-3 font-semibold text-[#111827]">{task.name}</td>
                <td className="py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-[12px] font-bold ${
                      task.priority === 'High'
                        ? 'bg-[#fee2e2] text-[#dc2626]'
                        : task.priority === 'Medium'
                        ? 'bg-[#fef3c7] text-[#f59e0b]'
                        : 'bg-[#d1fae5] text-[#059669]'
                    }`}
                  >
                    {task.priority}
                  </span>
                </td>
                <td className="py-3 text-[#5f6679]">{task.date}</td>
                <td className="py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-[12px] font-bold ${
                      task.status === 'In Progress'
                        ? 'bg-[#dbeafe] text-[#0284c7]'
                        : 'bg-[#d1fae5] text-[#059669]'
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
