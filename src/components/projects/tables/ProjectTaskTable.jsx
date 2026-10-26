import StatusBadge from '../../ui/StatusBadge.jsx'

function ProjectTaskTable({
  tasks = [],
  currentUser,
  isPM = false,
  onOpenUpdateModal,
  onOpenApprovalModal,
  onOpenChangeRequestModal,
  onOpenChangeReviewModal,
  onOpenReopenModal,
  onOpenCancelModal,
}) {
  const isPendingReview = (status) => [
    'PENDING_TL_REVIEW',
    'PENDING_PM_APPROVAL',
    'DIRECT_APPROVAL_REQUIRED',
    'PENDING_CEO_APPROVAL',
  ].includes(status)

  const isCEO = currentUser?.role === 'CEO'
  const isTL = currentUser?.role === 'TL'

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-[14px]">
        <thead>
          <tr className="border-b border-[#e5e7eb] text-[#6b7280]">
            <th className="px-4 py-3 font-semibold">Task Name</th>
            <th className="px-4 py-3 font-semibold">Assignee</th>
            <th className="px-4 py-3 font-semibold">Progress</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Due Date</th>
            <th className="px-4 py-3 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#f1f5f9]">
          {tasks.map((task) => {
            const isAssignee = currentUser && (
              currentUser.id === task.assigneeId ||
              currentUser.name?.trim().toLowerCase() === task.assignee?.trim().toLowerCase()
            )
            const canReview = isPendingReview(task.status) && (isCEO || isPM || isTL) && !isAssignee
            const canReviewTCR = Boolean(task.changeRequest) && (isCEO || isPM || isTL) && currentUser?.name?.toLowerCase() !== task.changeRequest.requester?.toLowerCase()

            const isOverdue = (() => {
              if (!task.dueDate || task.status === 'COMPLETED' || task.status === 'CANCELLED') return false
              let due
              if (task.dueDate.includes('/')) {
                const parts = task.dueDate.split('/')
                if (parts.length === 3) {
                  due = new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]), 23, 59, 59)
                }
              } else if (task.dueDate.includes('-')) {
                due = new Date(task.dueDate)
                due.setHours(23, 59, 59, 999)
              }
              return due && !isNaN(due.getTime()) && due.getTime() < Date.now()
            })()

            return (
              <tr key={task.id} className="hover:bg-[#f8fafc] transition-colors">
                <td className="px-4 py-4">
                  <p className="font-bold text-[#111827]">{task.name}</p>
                  {task.description && (
                    <p className="text-xs text-[#6b7280] truncate max-w-xs">{task.description}</p>
                  )}
                  {task.status === 'BLOCKED' && (
                    <div className="mt-1.5 rounded-lg border border-[#fca5a5] bg-[#fff1f2] p-1.5 text-[11px] text-[#991b1b]">
                      <span className="font-bold">🛑 Blocked ({task.blocker?.category || 'Blocker'}):</span>{' '}
                      <span>{task.blocker?.reason || task.description || 'Blocker recorded'}</span>
                    </div>
                  )}
                  {task.changeRequest && (
                    <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-lg border border-[#fed7aa] bg-[#fffbeb] px-2 py-0.5 text-[11px] text-[#b45309]">
                      <span className="font-bold">📝 TCR Pending:</span>
                      <span>
                        {task.changeRequest.type === 'DEADLINE_EXTENSION'
                          ? 'Deadline Extension'
                          : task.changeRequest.type === 'TASK_DELETION'
                            ? 'Task Deletion'
                            : 'Reassignment'}
                      </span>
                      <StatusBadge status={task.changeRequest.status} className="!text-[10px] !py-0 !px-1.5" />
                    </div>
                  )}
                  {task.status === 'IN_PROGRESS' && task.reworkCount > 0 && task.reworkCount < 3 && (
                    <div className="mt-1.5 rounded-lg border border-[#fed7aa] bg-[#fffbeb] p-2 text-xs text-[#9a3412]">
                      <span className="font-bold">❌ Rejected ({task.reworkCount} {task.reworkCount === 1 ? 'time' : 'times'}):</span>{' '}
                      <span>{task.rejectionFeedback || 'Rework requested by reviewer. Progress set to 85%.'}</span>
                    </div>
                  )}
                  {task.status === 'IN_PROGRESS' && task.reworkCount >= 3 && (
                    <div className="mt-1.5 rounded-lg border border-[#fca5a5] bg-[#fff1f2] p-2 text-xs text-[#991b1b]">
                      <div className="flex items-center gap-1.5">
                        <span className="rounded bg-[#e11d48] px-2 py-0.5 text-[10px] font-bold text-white">
                          QUALITY RISK: {task.reworkCount} Rejections
                        </span>
                      </div>
                      <p className="mt-1 font-semibold text-[#be123c]">
                        Task has undergone {task.reworkCount} rejections. Schedule a sync meeting with the assignee before resubmission.
                      </p>
                      {task.rejectionFeedback && (
                        <p className="mt-0.5 text-[11px] text-[#7f1d1d]">
                          Latest feedback: "{task.rejectionFeedback}"
                        </p>
                      )}
                    </div>
                  )}
                  {task.status === 'PENDING_PM_APPROVAL' && (
                    <div className="mt-1.5 rounded-lg border border-[#bfdbfe] bg-[#eff6ff] p-2 text-xs text-[#1e40af]">
                      <span className="font-bold">✓ Stage 1 Passed:</span> Approved by TL. Awaiting PM final sign-off.
                    </div>
                  )}
                  {isOverdue && (
                    <div className="mt-1.5 rounded-lg border border-[#fca5a5] bg-[#fff1f2] p-2 text-xs text-[#991b1b]">
                      <span className="font-bold">⏰ Overdue Alert:</span> Due date passed ({task.dueDate}). Task remains incomplete.
                    </div>
                  )}
                </td>

                <td className="px-4 py-4">
                  <p className="font-semibold text-[#111827]">
                    {task.assignee} {isAssignee && <span className="text-[#2563eb] text-xs font-normal">(You)</span>}
                  </p>
                  <span className="text-[11px] text-[#6b7280]">
                    {task.isIndependent ? 'Independent Contributor' : 'Team Member'}
                  </span>
                </td>

                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-16 rounded-full bg-[#f1f5f9] overflow-hidden">
                      <div
                        className={`h-full ${task.progress === 100 ? 'bg-[#10b981]' : 'bg-[#2563eb]'}`}
                        style={{ width: `${task.progress || 0}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-[#374151]">{task.progress || 0}%</span>
                  </div>
                </td>

                <td className="px-4 py-4">
                  <StatusBadge status={task.status} />
                </td>

                <td className="px-4 py-4 text-[#374151]">
                  <div className="flex items-center gap-1.5">
                    <span className={isOverdue ? 'font-bold text-[#dc2626]' : ''}>
                      {task.dueDate || 'No date'}
                    </span>
                    {isOverdue && (
                      <span className="rounded-full border border-[#fca5a5] bg-[#fff1f2] px-2 py-0.5 text-[10px] font-bold text-[#dc2626]">
                        OVERDUE
                      </span>
                    )}
                  </div>
                </td>

                <td className="px-4 py-4 text-right">
                  {currentUser?.role === 'HR' ? (
                    <span className="text-xs font-semibold text-[#9ca3af] bg-[#f8fafc] px-3 py-1 rounded-full border border-[#e5e7eb]">
                      Read-Only
                    </span>
                  ) : (
                    <div className="flex items-center justify-end gap-2">
                      {/* Work Update Button: Only for the assignee working on the task (CEO only reviews, reopens, or cancels) */}
                      {!isCEO && isAssignee && task.status !== 'COMPLETED' && task.status !== 'CANCELLED' && onOpenUpdateModal && (
                        <button
                          type="button"
                          onClick={() => onOpenUpdateModal(task)}
                          className="rounded-full bg-[#eff6ff] px-3 py-1.5 text-xs font-semibold text-[#2563eb] hover:bg-[#dbeafe]"
                        >
                          Update Progress
                        </button>
                      )}

                      {/* Review Deliverable Button: When pending approval */}
                      {canReview && (
                        <button
                          type="button"
                          onClick={() => onOpenApprovalModal(task)}
                          className="rounded-full bg-[#ecfdf5] px-3 py-1.5 text-xs font-bold text-[#059669] hover:bg-[#d1fae5]"
                        >
                          Review
                        </button>
                      )}

                      {/* Reopen Completed Task Button: Authorized for CEO & PM */}
                      {task.status === 'COMPLETED' && (isCEO || isPM) && onOpenReopenModal && (
                        <button
                          type="button"
                          onClick={() => onOpenReopenModal(task)}
                          className="rounded-full bg-[#fef3c7] px-3 py-1.5 text-xs font-bold text-[#b45309] hover:bg-[#fde68a]"
                          title="Reopen task to TODO with recorded reason"
                        >
                          Reopen Task
                        </button>
                      )}

                      {/* Cancel Task Button: Authorized for CEO & PM on non-completed tasks */}
                      {task.status !== 'COMPLETED' && task.status !== 'CANCELLED' && (isCEO || isPM) && onOpenCancelModal && (
                        <button
                          type="button"
                          onClick={() => onOpenCancelModal(task)}
                          className="rounded-full border border-[#fecdd3] bg-[#fff1f2] px-2.5 py-1.5 text-xs font-semibold text-[#e11d48] hover:bg-[#ffe4e6]"
                          title="Cancel task (exclude from project progress denominator)"
                        >
                          Cancel
                        </button>
                      )}

                      {/* Review Task-Change Request Button: When pending review */}
                      {canReviewTCR && onOpenChangeReviewModal && (
                        <button
                          type="button"
                          onClick={() => onOpenChangeReviewModal(task)}
                          className="rounded-full bg-[#fef3c7] px-3 py-1.5 text-xs font-bold text-[#b45309] hover:bg-[#fde68a] border border-[#fde68a]"
                          title="Review pending scope or schedule change request"
                        >
                          Review TCR
                        </button>
                      )}

                      {/* Change Request Button: Only for the assignee to request changes */}
                      {!isCEO && isAssignee && task.status !== 'COMPLETED' && task.status !== 'CANCELLED' && onOpenChangeRequestModal && (
                        <button
                          type="button"
                          disabled={Boolean(task.changeRequest)}
                          onClick={() => onOpenChangeRequestModal(task)}
                          className={`rounded-full px-2.5 py-1.5 text-xs font-medium transition ${
                            task.changeRequest
                              ? 'cursor-not-allowed border border-[#e5e7eb] bg-[#f3f4f6] text-[#9ca3af]'
                              : 'border border-[#e5e7eb] text-[#4b5563] hover:bg-[#f1f5f9]'
                          }`}
                          title={
                            task.changeRequest
                              ? 'A change request is already pending review (Concurrency Protection)'
                              : 'Request deadline extension, reassignment, or deletion'
                          }
                        >
                          {task.changeRequest ? 'TCR Pending' : 'TCR'}
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            )
          })}
          {tasks.length === 0 && (
            <tr>
              <td colSpan="6" className="py-8 text-center text-xs text-[#9ca3af]">
                No tasks defined in this project yet. Use &quot;Add Task&quot; above to create work units.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default ProjectTaskTable
