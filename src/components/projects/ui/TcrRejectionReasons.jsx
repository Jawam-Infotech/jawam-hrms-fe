import { useEffect, useState } from 'react'
import { projectsApi } from '../../../services/api/projects.api.js'

// The reason a Task-Change Request was rejected. The only source is the change-request endpoint, which returns
// rejection_reason only for viewers the backend authorizes (D-37). A null value means the viewer may not see it, or the
// request was not rejected, so nothing is shown. This component never infers a permission and never reads task rows.

const OPERATION_LABELS = {
  EXTEND_DEADLINE: 'Deadline extension',
  DELETE_TASK: 'Task deletion',
  REASSIGN: 'Reassignment',
}

function TcrRejectionReasons({ projectId, taskId }) {
  const [rows, setRows] = useState(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    let active = true
    if (!projectId || !taskId) return undefined
    projectsApi
      .getChangeRequests(projectId, taskId)
      .then((res) => {
        if (active) setRows(Array.isArray(res?.data) ? res.data : [])
      })
      .catch(() => {
        if (active) setFailed(true)
      })
    return () => {
      active = false
    }
  }, [projectId, taskId])

  if (failed || !rows) return null

  const reasons = rows.filter((row) => row.state === 'REJECTED' && row.rejection_reason)
  if (reasons.length === 0) return null

  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 space-y-2" data-testid="tcr-rejection-reasons">
      <p className="text-xs font-bold uppercase tracking-wider text-rose-900">Change request rejected</p>
      {reasons.map((row) => (
        <p key={row.id} className="text-xs text-rose-900">
          <span className="font-semibold">{OPERATION_LABELS[row.operation] || 'Change request'}:</span>{' '}
          {row.rejection_reason}
        </p>
      ))}
    </div>
  )
}

export default TcrRejectionReasons
