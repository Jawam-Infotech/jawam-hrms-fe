import { useMemo } from 'react'
import CapacityBadge from '../ui/CapacityBadge.jsx'

function ProjectMembersTable({
  members = [],
  tasks = [],
  onRemoveMember,
  onDeactivateMember,
  onActivateMember,
  onAssignPm,
  isCEO = false,
  canManage = false,
  projectStatus = 'PLANNED',
}) {
  // Deduplicate members per user, prioritizing active status and Primary PM role
  const displayMembers = useMemo(() => {
    const map = new Map()
    ;(members || []).forEach((m) => {
      const uid = String(m.user_id || m.id || m.name)
      if (!map.has(uid)) {
        map.set(uid, m)
      } else {
        const existing = map.get(uid)
        if (existing.is_active === false && m.is_active !== false) {
          map.set(uid, m)
        } else if (!existing.is_current_pm && m.is_current_pm) {
          map.set(uid, m)
        }
      }
    })
    return Array.from(map.values())
  }, [members])

  const getActiveTasksForMember = (member) => {
    const memberId = String(member.user_id || member.id || '')
    const memberName = String(member.name || '').toLowerCase()

    return (tasks || []).filter((t) => {
      const matchId = String(t.assignee_id || t.assigneeId || '') === memberId
      const matchName = String(t.assignee || '').toLowerCase() === memberName
      return (matchId || matchName) && !['COMPLETED', 'CANCELLED'].includes(t.status)
    }).length
  }

  const isClosedProject = ['CANCELLED', 'ARCHIVED'].includes(projectStatus)

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-[14px]">
        <thead>
          <tr className="border-b border-[#e5e7eb] text-[#6b7280]">
            <th className="px-4 py-3 font-semibold">Member Name</th>
            <th className="px-4 py-3 font-semibold">Project Role</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Capacity</th>
            <th className="px-4 py-3 font-semibold">Active Tasks</th>
            {canManage && <th className="px-4 py-3 font-semibold text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#f1f5f9]">
          {displayMembers.map((member) => {
            const activeInProject = getActiveTasksForMember(member)
            const isPm = Boolean(member.is_current_pm || member.isPm)
            const isActive = member.is_active !== false
            const roleUpper = String(member.projectRole || member.role || '').toUpperCase()
            const isExecutiveOrHr = roleUpper === 'CEO' || roleUpper === 'HR' || roleUpper.includes('CEO') || roleUpper.includes('HUMAN RESOURCE')

            return (
              <tr
                key={member.user_id || member.id || member.name}
                className={`transition-colors ${
                  isActive
                    ? 'hover:bg-[#f8fafc]'
                    : 'bg-gray-100/70 opacity-60 grayscale-[50%] hover:bg-gray-100'
                }`}
              >
                <td className="px-4 py-4">
                  <p className={`font-bold ${isActive ? 'text-[#111827]' : 'text-gray-500'}`}>
                    {member.name || `User #${member.user_id || member.id}`}
                  </p>
                  <p className="text-xs text-[#6b7280]">{member.role || 'Contributor'}</p>
                </td>

                <td className="px-4 py-4 font-medium text-[#374151]">
                  {isPm ? (
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        isActive
                          ? 'bg-[#fef3c7] text-[#b45309] border border-[#fde68a]'
                          : 'bg-gray-200 text-gray-500 border border-gray-300'
                      }`}
                    >
                      ★ Primary PM
                    </span>
                  ) : (
                    <span className={isActive ? 'text-[#374151]' : 'text-gray-400'}>
                      {member.projectRole || member.role || 'Team Member'}
                    </span>
                  )}
                </td>

                <td className="px-4 py-4">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      isActive
                        ? 'bg-[#dcfce7] text-[#15803d]'
                        : 'bg-gray-200 text-gray-600 border border-gray-300'
                    }`}
                  >
                    {isActive ? 'Active Member' : 'Deactivated'}
                  </span>
                </td>

                <td className="px-4 py-4">
                  <CapacityBadge
                    activeTasks={member.activeTasks || activeInProject || 0}
                    projectCount={member.projectCount || 1}
                    showDetail={false}
                  />
                </td>

                <td className={`px-4 py-4 text-xs font-bold ${isActive ? 'text-[#111827]' : 'text-gray-400'}`}>
                  {activeInProject} tasks
                </td>

                {canManage && (
                  <td className="px-4 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Assign Primary PM (CEO only, E04) */}
                      {!isClosedProject && isActive && !isPm && !isExecutiveOrHr && isCEO && onAssignPm && (
                        <button
                          type="button"
                          onClick={() => onAssignPm(member)}
                          className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors"
                          title="Assign as Primary PM"
                        >
                          ★ Make PM
                        </button>
                      )}

                      {/* Deactivation is refused on closed projects (E07) */}
                      {!isClosedProject && isActive && onDeactivateMember && (
                        <button
                          type="button"
                          onClick={() => onDeactivateMember(member)}
                          className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 hover:bg-amber-100"
                        >
                          Deactivate
                        </button>
                      )}

                      {!isClosedProject && !isActive && onActivateMember && (
                        <button
                          type="button"
                          onClick={() => onActivateMember(member)}
                          className="rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-100 transition-colors"
                        >
                          Activate
                        </button>
                      )}

                      {/* Permanent Removal / Deletion (E06) */}
                      {onRemoveMember && (
                        <button
                          type="button"
                          onClick={() => onRemoveMember(member)}
                          className="rounded-full bg-[#fef2f2] px-3 py-1 text-xs font-semibold text-[#dc2626] hover:bg-[#fee2e2] transition-colors"
                          title="Permanently remove member from project"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            )
          })}
          {displayMembers.length === 0 && (
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
