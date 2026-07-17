import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { UserContext } from '../context/UserContext'

const roleToDashboard = {
  employee: '/dashboard',
  manager: '/dashboard/team-leader',
  hr: '/dashboard/hr',
  admin: '/dashboard/ceo',
}

function ProtectedRoute({ children, allowedRoles }) {
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

  return children
}

export default ProtectedRoute