import DashboardCard from '../../common/DashboardCard.jsx'

const tasks = [
  { employee: 'Rajesh', active: 5, completed: 3, dueToday: 1 },
  { employee: 'Aman', active: 6, completed: 2, dueToday: 3 },
  { employee: 'Pradeep', active: 10, completed: 5, dueToday: 4 },
  { employee: 'Neha', active: 10, completed: 5, dueToday: 4 },
  { employee: 'Radhika', active: 10, completed: 5, dueToday: 4 },
]

function TeamLeaderTodaysTasksCard() {
  return (
    <DashboardCard>
      <h3 className="text-[18px] font-extrabold text-[#111827] mb-4">
        Today's Tasks
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-[14px]">
          <thead>
            <tr className="border-b border-[#e5e5e5]">
              <th className="text-left font-extrabold text-[#111827] pb-3">
                Employee
              </th>

              <th className="text-left font-extrabold text-[#111827] pb-3">
                Active
              </th>

              <th className="text-left font-extrabold text-[#111827] pb-3">
                Completed
              </th>

              <th className="text-left font-extrabold text-[#111827] pb-3">
                Due Today
              </th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((task, idx) => (
              <tr
                key={idx}
                className="border-b border-[#e5e5e5] hover:bg-[#f9fafb]"
              >
                <td className="py-3 font-semibold text-[#111827]">
                  {task.employee}
                </td>

                <td className="py-3 text-[#111827]">
                  {task.active}
                </td>

                <td className="py-3 text-[#111827]">
                  {task.completed}
                </td>

                <td className="py-3 text-[#111827]">
                  {task.dueToday}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        type="button"
        className="text-[#3b82f6] text-[14px] font-extrabold hover:underline mt-4"
      >
        View all Employees task
      </button>
    </DashboardCard>
  )
}

export default TeamLeaderTodaysTasksCard
