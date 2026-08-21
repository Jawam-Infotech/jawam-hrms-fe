import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { UserContext } from '../../context/UserContext.jsx'
import getPermissions from '../../utils/getPermissions.js'
import Leave from './Leave.jsx'

function LeaveEntry() {
  const { user } = useContext(UserContext)
  const permissions = getPermissions(user.role)

  return permissions.leave.canApply ? <Leave /> : <Navigate to="/leave/review" replace />
}

export default LeaveEntry
