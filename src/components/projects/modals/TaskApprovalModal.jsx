import { useState, useEffect } from 'react'
import { projectsApi } from '../../../services/api/projects.api.js'

function TaskApprovalModal({
  isOpen,
  onClose,
  task,
  projectId = null,
  currentUser,
  isSolo = false,
  onApprove,
  onReject,
  onDownloadFile,
  isSubmitting = false,
  apiError = null,
}) {
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectBox, setShowRejectBox] = useState(false)
  const [error, setError] = useState('')
  const [submissionData, setSubmissionData] = useState(null)
  const [isLoadingSubmission, setIsLoadingSubmission] = useState(false)

  const targetProjectId = projectId || task?.projectId || task?.project_id || task?.project

  const handleClose = () => {
    setShowRejectBox(false)
    setRejectReason('')
    setError('')
    setSubmissionData(null)
    onClose()
  }

  // Fetch real completion submission details from backend workflow summary (E20)
  useEffect(() => {
    if (!isOpen || !task) return

    const projId = targetProjectId
    if (!projId || !task.id) return

    if (task.open_completion_submission && task.open_completion_submission.id) {
      return
    }

    let isMounted = true
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoadingSubmission(true)

    const fetchDetails = async () => {
      try {
        // E20: Get Task Workflow Summary
        try {
          const res = await projectsApi.getTaskWorkflow(projId, task.id)
          if (!isMounted) return
          const wData = res.data
          const foundSub = wData?.open_completion_submission || null

          if (foundSub) {
            setSubmissionData(foundSub)
            return
          }
        } catch (err) {
          console.warn('Failed to load workflow summary, trying work updates history fallback:', err)
        }

        // Fallback to E19: Work Updates History
        try {
          const uRes = await projectsApi.getWorkUpdates(projId, task.id)
          if (!isMounted) return
          const rawUpdates = Array.isArray(uRes.data) ? uRes.data : (uRes.data?.results || [])
          // Find update that has submission or 100% progress
          const targetUpdate =
            rawUpdates.find((u) => u.progress === 100 || u.completion_submission || u.submission_id) ||
            rawUpdates[0]
          if (targetUpdate) {
            setSubmissionData(targetUpdate.completion_submission || targetUpdate)
          }
        } catch (fallbackErr) {
          console.warn('Failed to load work updates fallback:', fallbackErr)
        }
      } finally {
        if (isMounted) {
          setIsLoadingSubmission(false)
        }
      }
    }

    fetchDetails()

    return () => {
      isMounted = false
    }
  }, [isOpen, task, targetProjectId])

  if (!isOpen || !task) return null

  // Zero Self-Approval Enforcement
  const isSoloTask = Boolean(isSolo) || Boolean(task.isIndependent)
  const isDirectApproval = isSoloTask && (task.status === 'DIRECT_APPROVAL_REQUIRED' || task.status === 'PENDING_CEO_APPROVAL')
  const isDirectNonCeo = isDirectApproval && currentUser?.role !== 'CEO'
  const submission = task.open_completion_submission || submissionData || null
  const submissionId = submission?.id || submission?.submission_id || task.submissionId || null
  const canDecide = submission?.can_decide === true

  const deliverableUrls =
    submission?.deliverable_urls ||
    submission?.deliverables ||
    (task.deliverable?.type === 'LINK' ? [task.deliverable.value] : [])

  const deliverableFiles =
    submission?.deliverable_files ||
    submission?.files ||
    []

  const handleConfirmReject = () => {
    if (!rejectReason.trim()) {
      setError('Rejection requires a mandatory explanation of required fixes.')
      return
    }
    if (!submissionId) {
      setError('Cannot reject: No active completion submission found for this task.')
      return
    }
    onReject({
      taskId: task.id,
      submissionId,
      reason: rejectReason.trim(),
    })
  }

  const handleConfirmApprove = () => {
    if (!submissionId) {
      setError('Cannot approve: No active completion submission found for this task.')
      return
    }
    onApprove({
      taskId: task.id,
      submissionId,
      reason: '',
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[28px] bg-white p-8 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-4">
          <div>
            <h2 className="text-[20px] font-black text-[#111827]">Review Deliverable</h2>
            <p className="text-xs text-[#6b7280] mt-1">{task.name || task.title} • Assigned to {task.assignee}</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="rounded-full p-2 text-[#9ca3af] hover:bg-[#f1f5f9] hover:text-[#111827] disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        {apiError && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
            {apiError}
          </div>
        )}

        {/* Direct CEO Oversight Block Warning for Non-CEO */}
        {isDirectNonCeo && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
            <p className="font-bold">Executive Direct Approval Required:</p>
            <p className="mt-1">
              This task was submitted under solo initiative governance (Direct Approval) and requires sign-off directly from the CEO.
            </p>
          </div>
        )}

        <div className="mt-5 space-y-4">
          {/* Routing Banner */}
          <div className="flex items-center justify-between rounded-xl bg-[#f8fafc] p-3 text-xs">
            <span className="text-[#6b7280]">Approval Route:</span>
            <span className="font-bold text-[#111827]">
              {submission?.routing || (isDirectApproval ? 'Direct PM Approval (CEO Oversight)' : 'Awaiting PM Approval (Team Review)')}
            </span>
          </div>

          {/* Submission Work Note */}
          {submission?.note && (
            <div className="rounded-xl bg-[#f8fafc] p-3.5 text-xs text-[#374151]">
              <span className="font-bold text-[#111827]">Assignee Submission Note:</span>
              <p className="mt-1 text-[#4b5563] italic">"{submission.note}"</p>
            </div>
          )}

          {/* Proof-of-Work Deliverable Display */}
          <div className="rounded-xl border border-[#e5e7eb] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-wider text-[#6b7280]">Submitted Deliverables</p>
              {isLoadingSubmission && (
                <div className="flex items-center gap-1.5 text-xs text-blue-600">
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                  <span>Loading artifacts...</span>
                </div>
              )}
            </div>

            {/* URL Links */}
            {deliverableUrls.length > 0 && (
              <div className="space-y-1.5">
                {deliverableUrls.map((url, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-lg bg-gray-50 p-2">
                    <span className="text-xs text-blue-600 truncate max-w-xs">{url}</span>
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded bg-blue-50 px-2 py-1 text-[11px] font-bold text-blue-600 hover:bg-blue-100"
                    >
                      Open Link ↗
                    </a>
                  </div>
                ))}
              </div>
            )}

            {/* Private Binary Files (E24 GET download) */}
            {deliverableFiles.length > 0 && (
              <div className="space-y-1.5 border-t border-gray-100 pt-2">
                <p className="text-[11px] font-semibold text-gray-700">Uploaded Files (Binary Stream Download):</p>
                {deliverableFiles.map((file) => (
                  <div key={file.id} className="flex items-center justify-between rounded-lg bg-gray-50 p-2">
                    <div>
                      <p className="text-xs font-bold text-gray-800">{file.original_name || file.name || 'Deliverable'}</p>
                      <p className="text-[10px] text-gray-500">
                        {Math.round((file.size_bytes || file.size || 0) / 1024)} KB • {file.content_type || file.mime_type || 'File'}
                      </p>
                    </div>
                    {onDownloadFile && (
                      <button
                        type="button"
                        onClick={() => onDownloadFile(submissionId, file.id, file.original_name || file.name)}
                        className="rounded bg-gray-200 px-2.5 py-1 text-[11px] font-semibold text-gray-800 hover:bg-gray-300"
                      >
                        Download ⬇
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {deliverableUrls.length === 0 && deliverableFiles.length === 0 && !task.deliverable && !isLoadingSubmission && (
              <p className="text-xs text-gray-400">No deliverable artifacts attached to this submission.</p>
            )}
          </div>

          {/* Task Info & Notes */}
          <div className="rounded-xl bg-[#f8fafc] p-4 text-[13px] space-y-1.5">
            <p><span className="font-semibold text-[#374151]">Task:</span> {task.name || task.title}</p>
            <p><span className="font-semibold text-[#374151]">Status:</span> {task.status}</p>
            {task.reworkCount > 0 && (
              <p className="text-[#e11d48] font-semibold">Previous Rejections: {task.reworkCount}</p>
            )}
          </div>

          {/* Rejection Note Box */}
          {showRejectBox && (
            <div className="rounded-xl border border-[#fed7aa] bg-[#fffbeb] p-4">
              <label className="block text-[13px] font-bold text-[#b45309] mb-1">
                Mandatory Rejection / Rework Feedback <span className="text-[#dc2626]">*</span>
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => {
                  setRejectReason(e.target.value)
                  if (error) setError('')
                }}
                disabled={isSubmitting}
                rows={2}
                placeholder="Explain required changes, failing tests, or missing criteria..."
                className="w-full rounded-[10px] border border-[#fde68a] bg-white px-3 py-2 text-[13px] text-[#111827] focus:border-[#b45309] focus:outline-none"
              />
              {error && <p className="mt-1 text-xs text-[#dc2626] font-medium">{error}</p>}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-end gap-3 border-t border-[#f1f5f9] pt-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="rounded-full border border-[#e5e7eb] px-5 py-2 text-[14px] font-semibold text-[#4b5563] hover:bg-[#f9fafb] disabled:opacity-50"
          >
            Cancel
          </button>

          {!showRejectBox ? (
            <>
              <button
                type="button"
                onClick={() => setShowRejectBox(true)}
                disabled={!canDecide || isSubmitting || isLoadingSubmission}
                className="rounded-full border border-[#fca5a5] bg-[#fef2f2] px-5 py-2 text-[14px] font-semibold text-[#dc2626] hover:bg-[#fee2e2] disabled:opacity-50"
              >
                Request Rework / Reject
              </button>
              <button
                type="button"
                disabled={!canDecide || isSubmitting || isLoadingSubmission || !submissionId}
                onClick={handleConfirmApprove}
                className={`rounded-full px-6 py-2 text-[14px] font-semibold text-white shadow-sm transition ${
                  !canDecide || !submissionId
                    ? 'cursor-not-allowed bg-[#9ca3af]'
                    : 'bg-[#10b981] hover:bg-[#059669]'
                } disabled:opacity-50`}
              >
                {isSubmitting ? 'Approving...' : 'Approve & Sign Off'}
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setShowRejectBox(false)}
                disabled={isSubmitting}
                className="rounded-full border border-[#e5e7eb] px-4 py-2 text-xs font-semibold text-[#6b7280] disabled:opacity-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleConfirmReject}
                disabled={!canDecide || isSubmitting || isLoadingSubmission || !submissionId}
                className="rounded-full bg-[#dc2626] px-5 py-2 text-[14px] font-semibold text-white hover:bg-[#b91c1c] disabled:opacity-50"
              >
                {isSubmitting ? 'Rejecting...' : 'Confirm Rejection'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default TaskApprovalModal
