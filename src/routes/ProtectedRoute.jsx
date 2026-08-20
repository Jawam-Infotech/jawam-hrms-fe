import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { UserContext } from '../context/UserContext.jsx'
import getPermissions from '../utils/getPermissions.js'

const roleToDashboard = {
  employee: '/dashboard',
  manager: '/dashboard/team-leader',
  hr: '/dashboard/hr',
  admin: '/dashboard/ceo',
  CEO: '/dashboard/ceo',
}

function hasPermission(permissionSet, permissionPath) {
  return permissionPath
    .split('.')
    .reduce((value, key) => value?.[key], permissionSet) === true
}

function ProtectedRoute({ children, allowedRoles, requiredPermission }) {
  const { user, isBootstrapping } = useContext(UserContext)

  if (isBootstrapping) {
    // avoid a flash-redirect to /login while we're still checking storage
    return null
  }

  if (!user.isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // logged in, but wrong role for this page — send them to their own dashboard
    return <Navigate to={roleToDashboard[user.role] || '/login'} replace />
  }

  if (
    requiredPermission &&
    !hasPermission(getPermissions(user.role), requiredPermission)
  ) {
    return <Navigate to={roleToDashboard[user.role] || '/login'} replace />
  }

  return children
}

export default ProtectedRoute
