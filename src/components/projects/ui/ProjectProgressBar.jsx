
function calculateProjectProgress(completedTasks = 0, totalActiveTasks = 0) {
  if (!totalActiveTasks || totalActiveTasks <= 0) return 0
  const percent = (completedTasks / totalActiveTasks) * 100
  return Math.min(100, Math.max(0, Math.round(percent)))
}

function ProjectProgressBar({
  completedTasks = 0,
  totalActiveTasks = 0,
  explicitPercentage = null,
  showFraction = true,
  size = 'md',
  className = '',
}) {
  const percentage = explicitPercentage !== null
    ? Math.min(100, Math.max(0, Math.round(explicitPercentage)))
    : calculateProjectProgress(completedTasks, totalActiveTasks)

  const heightClass = size === 'sm' ? 'h-1.5' : size === 'lg' ? 'h-3' : 'h-2'

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="text-[#374151]">{percentage}% Completed</span>
        {showFraction && (
          <span className="text-[#6b7280]">
            {completedTasks} / {totalActiveTasks} approved tasks
          </span>
        )}
      </div>
      <div className={`w-full overflow-hidden rounded-full bg-[#f1f5f9] ${heightClass}`}>
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            percentage === 100 ? 'bg-[#10b981]' : percentage > 50 ? 'bg-[#3b82f6]' : 'bg-[#f59e0b]'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default ProjectProgressBar
