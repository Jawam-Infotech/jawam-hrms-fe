import CapacityBadge from '../ui/CapacityBadge.jsx'

function ProjectMembersTable({
  members = [],
  tasks = [],
  onRemoveMember,
  canManage = false,
  projectStatus = 'PLANNED',
  isSolo = false,
}) {
  const isProjectActive = projectStatus === 'ACTIVE'
  const isDropBelowStaffingBlocked = isProjectActive && (
    (isSolo && members.length <= 1) ||
    (!isSolo && members.length <= 2)
  )

  const getActiveTasksForMember = (member) => {
    return tasks.filter(
      (t) => (t.assigneeId === member.id || t.assignee === member.name) &&
             t.status !== 'COMPLETED' &&
             t.status !== 'CANCELLED',
    ).length
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-[14px]">
        <thead>
          <tr className="border-b border-[#e5e7eb] text-[#6b7280]">
            <th className="px-4 py-3 font-semibold">Member Name</th>
            <th className="px-4 py-3 font-semibold">Project Role</th>
            <th className="px-4 py-3 font-semibold">Structure</th>
            <th className="px-4 py-3 font-semibold">Company Capacity</th>
            <th className="px-4 py-3 font-semibold">Active In Project</th>
            {canManage && <th className="px-4 py-3 font-semibold text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#f1f5f9]">
          {members.map((member) => {
            const activeInProject = getActiveTasksForMember(member)
            const hasActiveTasks = activeInProject > 0
            const isPmMember = Boolean(member.isPm)
            const isPmRemovalBlocked = isProjectActive && isPmMember
            const isStaffingGateBlocked = isDropBelowStaffingBlocked

            const isBlocked = isPmRemovalBlocked || hasActiveTasks || isStaffingGateBlocked

            let blockReason = ''
            let buttonLabel = 'Remove'

            if (isPmRemovalBlocked) {
              blockReason = "Primary PM cannot be removed directly from an active project. Use 'Replace PM' to assign an eligible successor first."
              buttonLabel = 'PM Protected'
            } else if (hasActiveTasks) {
              blockReason = 'Cannot remove member with active tasks. Reassign or complete all tasks first to prevent orphaned work.'
              buttonLabel = `Active Tasks (${activeInProject})`
            } else if (isStaffingGateBlocked) {
              blockReason = isSolo
                ? 'Cannot remove member: solo project requires 1 assigned employee.'
                : 'Cannot remove member: active team project requires at least 2 distinct members (1 Primary PM + 1 team member).'
              buttonLabel = 'Min Staffing'
            }

            return (
              <tr key={member.id || member.name} className="hover:bg-[#f8fafc] transition-colors">
                <td className="px-4 py-4">
                  <p className="font-bold text-[#111827]">{member.name}</p>
                  <p className="text-xs text-[#6b7280]">{member.role || 'Contributor'}</p>
                </td>

                <td className="px-4 py-4 font-medium text-[#374151]">
                  {member.isPm ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#fef3c7] px-2.5 py-0.5 text-xs font-bold text-[#b45309] border border-[#fde68a]">
                      ★ Primary PM
                    </span>
                  ) : (
                    <span>{member.projectRole || 'Team Member'}</span>
                  )}
                </td>

                <td className="px-4 py-4">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    member.isIndependent
                      ? 'bg-[#fed7aa] text-[#c2410c]'
                      : 'bg-[#e0e7ff] text-[#4338ca]'
                  }`}>
                    {member.isIndependent ? 'Independent (Direct)' : 'Under Team Lead'}
                  </span>
                </td>

                <td className="px-4 py-4">
                  <CapacityBadge
                    activeTasks={member.activeTasks || 1}
                    projectCount={member.projectCount || 1}
                    showDetail={false}
                  />
                </td>

                <td className="px-4 py-4 text-xs font-bold text-[#111827]">
                  {activeInProject} tasks
                </td>

                {canManage && (
                  <td className="px-4 py-4 text-right">
                    <button
                      type="button"
                      disabled={isBlocked}
                      onClick={() => onRemoveMember(member.id || member.name)}
                      title={isBlocked ? blockReason : 'Remove from project roster'}
                      className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                        isBlocked
                          ? 'cursor-not-allowed bg-[#f3f4f6] text-[#9ca3af] border border-[#e5e7eb]'
                          : 'bg-[#fef2f2] text-[#dc2626] hover:bg-[#fee2e2]'
                      }`}
                    >
                      {buttonLabel}
                    </button>
                  </td>
                )}
              </tr>
            )
          })}
          {members.length === 0 && (
            <tr>
              <td colSpan={canManage ? 6 : 5} className="py-8 text-center text-xs text-[#9ca3af]">
                No members assigned to this project yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export default ProjectMembersTable
