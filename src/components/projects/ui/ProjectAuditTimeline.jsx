import { useEffect, useState } from 'react'
import { projectsApi } from '../../../services/api/projects.api.js'
import { formatApiError } from '../../../utils/formatApiError.js'

// The audit timeline. It loads GET projects/<id>/audit/. The backend decides which events the viewer may see, and each
// entry already carries only the allowlisted details. This component shows only what the backend returns. It does not
// filter by role and never displays a reason field.

const PAGE_SIZE = 20

const AUDIT_ACTION_OPTIONS = [
  ['', 'All actions'],
  ['PROJECT_CREATED', 'Project created'],
  ['PROJECT_UPDATED', 'Project updated'],
  ['PROJECT_ACTIVATED', 'Project activated'],
  ['PROJECT_ON_HOLD', 'Project on hold'],
  ['PROJECT_RESUMED', 'Project resumed'],
  ['PROJECT_CANCELLED', 'Project cancelled'],
  ['PROJECT_ARCHIVED', 'Project archived'],
  ['CLOSURE_REQUESTED', 'Closure requested'],
  ['CLOSURE_APPROVED', 'Closure approved'],
  ['PM_ASSIGNED', 'PM assigned'],
  ['PM_REPLACED', 'PM replaced'],
  ['MEMBER_ADDED', 'Member added'],
  ['MEMBER_REMOVED', 'Member removed'],
  ['MEMBER_DEACTIVATED', 'Member deactivated'],
  ['TASK_CREATED', 'Task created'],
  ['TASK_UPDATED', 'Task updated'],
  ['TASK_CANCELLED', 'Task cancelled'],
  ['TASK_REASSIGNED', 'Task reassigned'],
  ['COMPLETION_SUBMITTED', 'Completion submitted'],
  ['COMPLETION_APPROVED', 'Completion approved'],
  ['COMPLETION_REJECTED', 'Completion rejected'],
  ['CHANGE_REQUESTED', 'Change requested'],
  ['CHANGE_APPROVED', 'Change approved'],
  ['CHANGE_REJECTED', 'Change rejected'],
  ['CANCELLATION_REQUESTED', 'Cancellation requested'],
  ['CANCELLATION_APPROVED', 'Cancellation approved'],
  ['CANCELLATION_REJECTED', 'Cancellation rejected'],
]

// Labels for the allowlisted detail keys. Keys outside this list are never shown.
const DETAIL_LABELS = {
  operation: 'Operation',
  outcome: 'Outcome',
  routing: 'Routing',
  stage: 'Stage',
  status: 'Status',
  old_status: 'Previous status',
  new_status: 'New status',
  task_id: 'Task',
  new_due_date: 'New due date',
  new_assignee_id: 'New assignee',
  new_approver_id: 'New approver',
  old_approver_id: 'Previous approver',
  staffing_mode: 'Staffing mode',
}

function formatAction(action) {
  return String(action || '').replace(/_/g, ' ').toLowerCase().replace(/^\w/, (c) => c.toUpperCase())
}

function formatTimestamp(value) {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? String(value || '') : date.toLocaleString()
}

function detailLines(details) {
  return Object.entries(details || {})
    .filter(([key]) => Object.prototype.hasOwnProperty.call(DETAIL_LABELS, key))
    .map(([key, value]) => `${DETAIL_LABELS[key]}: ${value === null ? '—' : String(value)}`)
}

function ProjectAuditTimeline({ projectId }) {
  const [action, setAction] = useState('')
  const [page, setPage] = useState(1)
  const [reloadKey, setReloadKey] = useState(0)
  const [state, setState] = useState({ status: 'loading', events: [], hasNext: false, hasPrevious: false, error: '' })

  useEffect(() => {
    let active = true
    projectsApi
      .getAuditTimeline(projectId, { page, page_size: PAGE_SIZE, action: action || undefined })
      .then((res) => {
        if (!active) return
        const data = res?.data || {}
        const events = Array.isArray(data.results) ? data.results : []
        setState({
          status: events.length === 0 ? 'empty' : 'ready',
          events,
          hasNext: Boolean(data.next),
          hasPrevious: Boolean(data.previous),
          error: '',
        })
      })
      .catch((err) => {
        if (!active) return
        if (err?.response?.status === 403) {
          setState({ status: 'forbidden', events: [], hasNext: false, hasPrevious: false, error: '' })
          return
        }
        setState({
          status: 'error',
          events: [],
          hasNext: false,
          hasPrevious: false,
          error: formatApiError(err, 'Could not load the audit timeline.'),
        })
      })
    return () => {
      active = false
    }
  }, [projectId, page, action, reloadKey])

  const onActionChange = (value) => {
    setAction(value)
    setPage(1)
  }

  return (
    <div className="space-y-4" data-testid="project-audit-timeline">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <label className="text-xs font-semibold text-[#374151]">
          Action{' '}
          <select
            aria-label="Filter by action"
            value={action}
            onChange={(e) => onActionChange(e.target.value)}
            className="ml-2 rounded-xl border border-[#e5e7eb] bg-white px-2 py-1 text-xs"
          >
            {AUDIT_ACTION_OPTIONS.map(([value, label]) => (
              <option key={value || 'all'} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {state.status === 'loading' && (
        <div className="py-8 text-center text-xs text-[#9ca3af]">Loading audit timeline…</div>
      )}

      {state.status === 'forbidden' && (
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-6 text-center text-xs text-[#64748b]">
          Your role does not have access to this project&apos;s audit timeline.
        </div>
      )}

      {state.status === 'error' && (
        <div className="rounded-2xl border border-[#fecdd3] bg-[#fff1f2] p-4 text-xs text-[#9f1239]">
          <p>{state.error}</p>
          <button
            type="button"
            onClick={() => setReloadKey((key) => key + 1)}
            className="mt-2 rounded-full border border-[#fca5a5] bg-white px-3 py-1 font-semibold"
          >
            Retry
          </button>
        </div>
      )}

      {state.status === 'empty' && (
        <div className="py-8 text-center text-xs text-[#9ca3af]">
          {action ? 'No audit events match this filter.' : 'No audit activity recorded yet.'}
        </div>
      )}

      {state.status === 'ready' && (
        <ol className="space-y-3">
          {state.events.map((event) => (
            <li key={event.id} className="rounded-2xl border border-[#f1f5f9] bg-[#f8fafc] p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-[13px] font-bold text-[#111827]">{formatAction(event.action)}</span>
                <time className="text-xs text-[#9ca3af]" dateTime={event.created_at}>
                  {formatTimestamp(event.created_at)}
                </time>
              </div>
              <p className="mt-1 text-xs text-[#4b5563]">
                <span className="font-semibold text-[#111827]">{event.actor?.name || 'Unknown'}</span>
                {' · '}
                {event.entity_type}
              </p>
              {detailLines(event.details).length > 0 && (
                <ul className="mt-2 space-y-0.5 text-xs text-[#4b5563]">
                  {detailLines(event.details).map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ol>
      )}

      {(state.status === 'ready' || state.status === 'empty') && (
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={!state.hasPrevious}
            className="rounded-full border border-[#e5e7eb] px-3 py-1 text-xs font-semibold disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-xs text-[#6b7280]">Page {page}</span>
          <button
            type="button"
            onClick={() => setPage((p) => p + 1)}
            disabled={!state.hasNext}
            className="rounded-full border border-[#e5e7eb] px-3 py-1 text-xs font-semibold disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

export default ProjectAuditTimeline
