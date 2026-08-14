import permissions from '../constants/permissions.js'

function getPermissions(role) {
  const normalizedRole = String(role || '').trim().toUpperCase()
  const roleMap = {
    CEO: 'CEO',
    ADMIN: 'CEO',
    HR: 'HR',
    TEAM_LEAD: 'TEAM_LEAD',
    MANAGER: 'TEAM_LEAD',
    EMPLOYEE: 'EMPLOYEE',
  }

  const permissionKey = roleMap[normalizedRole] || 'EMPLOYEE'
  return permissions[permissionKey]
}

function canReviewAttendanceCorrectionRequests(role) {
  return Boolean(
    getPermissions(role)?.attendance?.canReviewCorrectionRequests,
  )
}

export default getPermissions
export { canReviewAttendanceCorrectionRequests }
