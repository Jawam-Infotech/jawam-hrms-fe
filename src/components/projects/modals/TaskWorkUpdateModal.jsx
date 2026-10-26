import { useState } from 'react'

const BLOCKER_CATEGORIES = [
  'Dependencies / Upstream Deliverable',
  'Technical / Architectural Roadblock',
  'Access / Credentials / Permissions',
  'Client Clarification / Requirements Scope',
  'Environment / Infrastructure Issue',
  'Other Blocker',
]

function TaskWorkUpdateModal({ isOpen, onClose, task, onSubmitUpdate }) {
  const [progress, setProgress] = useState(task?.progress || 0)
  const [note, setNote] = useState('')
  const [decreaseReason, setDecreaseReason] = useState('')
  const [deliverableType, setDeliverableType] = useState('LINK') // 'LINK' or 'FILE'
  const [deliverableLink, setDeliverableLink] = useState('')
  const [deliverableFile, setDeliverableFile] = useState(null)
  const [isBlocked, setIsBlocked] = useState(task?.status === 'BLOCKED')
  const [blockerCategory, setBlockerCategory] = useState(task?.blocker?.category || BLOCKER_CATEGORIES[0])
  const [blockerReason, setBlockerReason] = useState(task?.blocker?.reason || '')
  const [errors, setErrors] = useState({})

  if (!isOpen || !task) return null

  const isDecreasing = progress < (task.progress || 0)
  const isCompletion = progress === 100
  const isQualityRisk = (task.reworkCount || 0) >= 3

  const validate = () => {
    const newErrors = {}
    if (!note.trim()) newErrors.note = 'Work update note is required'
    if (isDecreasing && !decreaseReason.trim()) {
      newErrors.decreaseReason = 'A mandatory explanation is required when progress decreases'
    }
    if (isBlocked && !blockerReason.trim()) {
      newErrors.blockerReason = 'A recorded explanation is required when work is blocked'
    }
    if (isCompletion && !isBlocked) {
      if (deliverableType === 'LINK' && !deliverableLink.trim()) {
        newErrors.deliverable = '100% completion requires a valid deliverable URL (PR, Figma, Doc)'
      } else if (deliverableType === 'FILE' && !deliverableFile) {
        newErrors.deliverable = '100% completion requires uploading a proof-of-work file'
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return

    const deliverable = isCompletion && !isBlocked
      ? {
          type: deliverableType,
          value: deliverableType === 'LINK' ? deliverableLink : deliverableFile?.name,
          submittedAt: new Date().toISOString(),
        }
      : null

    onSubmitUpdate({
      taskId: task.id,
      oldProgress: task.progress || 0,
      newProgress: progress,
      note,
      decreaseReason: isDecreasing ? decreaseReason : null,
      deliverable,
      isCompletion: isCompletion && !isBlocked,
      isIndependent: task.isIndependent || false,
      isBlocked,
      blockerCategory: isBlocked ? blockerCategory : null,
      blockerReason: isBlocked ? blockerReason.trim() : null,
    })

    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-[28px] bg-white p-8 shadow-2xl">
        <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-4">
          <div>
            <h2 className="text-[20px] font-black text-[#111827]">Submit Work Update</h2>
            <p className="text-xs text-[#6b7280] mt-1">{task.name} ({task.project || 'Project Task'})</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-[#9ca3af] hover:bg-[#f1f5f9] hover:text-[#111827]"
          >
            ✕
          </button>
        </div>

        {/* Reviewer Rejection Feedback Banner */}
        {task.rejectionFeedback && (
          <div className="mt-4 rounded-xl border border-[#fed7aa] bg-[#fffbeb] p-3.5 text-[#9a3412]">
            <p className="text-xs font-bold uppercase tracking-wider text-[#b45309]">
              TL / Reviewer Feedback ({task.reworkCount || 1} {task.reworkCount === 1 ? 'rejection' : 'rejections'}):
            </p>
            <p className="mt-1 text-xs font-medium text-[#78350f]">
              "{task.rejectionFeedback}"
            </p>
          </div>
        )}

        {/* 3-Rejection Quality Risk Warning Banner */}
        {isQualityRisk && (
          <div className="mt-4 rounded-xl border border-[#fecdd3] bg-[#fff1f2] p-4 text-[#9f1239]">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-[#e11d48] px-2.5 py-0.5 text-[11px] font-black uppercase text-white">
                QUALITY_RISK: {task.reworkCount} Rejections
              </span>
              <p className="text-xs font-bold">Quality Risk Threshold Exceeded</p>
            </div>
            <p className="mt-1.5 text-xs text-[#be123c]">
              Task has undergone {task.reworkCount} rejections. Schedule a sync meeting with the assignee before resubmission.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Progress Slider & Input */}
          <div>
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-bold text-[#111827]">
                Progress: <span className="text-[#2563eb] font-extrabold">{progress}%</span>
              </label>
              <span className="text-xs text-[#6b7280]">Previous: {task.progress || 0}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="mt-2 w-full accent-[#2563eb]"
            />
          </div>

          {/* Mandatory Reason for Progress Decrease */}
          {isDecreasing && (
            <div className="rounded-xl border border-[#fed7aa] bg-[#fffbeb] p-4">
              <label className="block text-[13px] font-bold text-[#b45309] mb-1">
                Reason for Progress Decrease <span className="text-[#dc2626]">*</span>
              </label>
              <textarea
                value={decreaseReason}
                onChange={(e) => {
                  setDecreaseReason(e.target.value)
                  if (errors.decreaseReason) setErrors((prev) => ({ ...prev, decreaseReason: '' }))
                }}
                rows={2}
                placeholder="Explain discovered bugs, blockers, or required rework..."
                className="w-full rounded-[10px] border border-[#fde68a] bg-white px-3 py-2 text-[13px] text-[#111827] focus:border-[#b45309] focus:outline-none"
              />
              {errors.decreaseReason && (
                <p className="mt-1 text-xs text-[#dc2626] font-medium">{errors.decreaseReason}</p>
              )}
            </div>
          )}

          {/* Section 6 Blocker Reporting */}
          <div className={`rounded-xl border p-4 transition ${isBlocked ? 'border-[#fca5a5] bg-[#fff1f2]' : 'border-[#e5e7eb] bg-[#f8fafc]'}`}>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isBlocked}
                onChange={(e) => {
                  setIsBlocked(e.target.checked)
                  if (!e.target.checked && errors.blockerReason) {
                    setErrors((prev) => ({ ...prev, blockerReason: '' }))
                  }
                }}
                className="h-4 w-4 rounded text-[#dc2626] focus:ring-[#dc2626]"
              />
              <span className="text-[13px] font-bold text-[#111827]">
                Work is Blocked (Cannot proceed)
              </span>
            </label>

            {isBlocked && (
              <div className="mt-3 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-[#991b1b] mb-1">
                    Blocker Category <span className="text-[#dc2626]">*</span>
                  </label>
                  <select
                    value={blockerCategory}
                    onChange={(e) => setBlockerCategory(e.target.value)}
                    className="w-full rounded-[10px] border border-[#fca5a5] bg-white px-3 py-2 text-xs text-[#111827] focus:border-[#dc2626] focus:outline-none"
                  >
                    {BLOCKER_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#991b1b] mb-1">
                    Blocker Explanation <span className="text-[#dc2626]">*</span>
                  </label>
                  <textarea
                    value={blockerReason}
                    onChange={(e) => {
                      setBlockerReason(e.target.value)
                      if (errors.blockerReason) setErrors((prev) => ({ ...prev, blockerReason: '' }))
                    }}
                    rows={2}
                    placeholder="Describe what is preventing progress (dependencies, credentials, client clarification)..."
                    className="w-full rounded-[10px] border border-[#fca5a5] bg-white px-3 py-2 text-xs text-[#111827] focus:border-[#dc2626] focus:outline-none"
                  />
                  {errors.blockerReason && (
                    <p className="mt-1 text-xs text-[#dc2626] font-medium">{errors.blockerReason}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Regular Work Update Note */}
          <div>
            <label className="block text-[13px] font-bold text-[#111827] mb-1">
              Work Update Notes <span className="text-[#ef4444]">*</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => {
                setNote(e.target.value)
                if (errors.note) setErrors((prev) => ({ ...prev, note: '' }))
              }}
              rows={2}
              placeholder="What changes or milestones were achieved today?"
              className="w-full rounded-[12px] border border-[#e5e7eb] px-4 py-2 text-[13px] text-[#111827] focus:border-[#2563eb] focus:outline-none"
            />
            {errors.note && <p className="mt-1 text-xs text-[#ef4444]">{errors.note}</p>}
          </div>

          {/* 100% Deliverable Proof-of-Work Gate */}
          {isCompletion && (
            <div className="rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] font-bold text-[#166534]">
                  Proof-of-Work Deliverable <span className="text-[#dc2626]">*</span>
                </span>
                <div className="flex items-center gap-2 text-xs">
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="deliverableType"
                      value="LINK"
                      checked={deliverableType === 'LINK'}
                      onChange={() => setDeliverableType('LINK')}
                      className="text-[#10b981]"
                    />
                    URL Link
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="deliverableType"
                      value="FILE"
                      checked={deliverableType === 'FILE'}
                      onChange={() => setDeliverableType('FILE')}
                      className="text-[#10b981]"
                    />
                    File Upload
                  </label>
                </div>
              </div>

              {deliverableType === 'LINK' ? (
                <input
                  type="url"
                  value={deliverableLink}
                  onChange={(e) => {
                    setDeliverableLink(e.target.value)
                    if (errors.deliverable) setErrors((prev) => ({ ...prev, deliverable: '' }))
                  }}
                  placeholder="https://github.com/org/repo/pull/42 or Figma URL"
                  className="w-full rounded-[10px] border border-[#86efac] bg-white px-3 py-2 text-[13px] text-[#111827] focus:border-[#16a34a] focus:outline-none"
                />
              ) : (
                <input
                  type="file"
                  onChange={(e) => {
                    setDeliverableFile(e.target.files[0] || null)
                    if (errors.deliverable) setErrors((prev) => ({ ...prev, deliverable: '' }))
                  }}
                  className="w-full rounded-[10px] border border-[#86efac] bg-white p-2 text-xs text-[#374151]"
                />
              )}

              {errors.deliverable && (
                <p className="mt-1.5 text-xs text-[#dc2626] font-medium">{errors.deliverable}</p>
              )}
              <p className="mt-1.5 text-[11px] text-[#15803d]">
                Notice: 100% does not auto-complete the task; it requests review from {task.isIndependent ? 'PM/CEO directly' : 'your Team Leader'}.
              </p>
            </div>
          )}

          <div className="mt-8 flex justify-end gap-3 border-t border-[#f1f5f9] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-[#e5e7eb] px-5 py-2 text-[14px] font-semibold text-[#4b5563] hover:bg-[#f9fafb]"
            >
              Cancel
            </button>
            {(() => {
              const hasArtifact = deliverableType === 'LINK'
                ? Boolean(deliverableLink.trim())
                : Boolean(deliverableFile)
              const isSubmitDisabled = isCompletion && !isBlocked && !hasArtifact

              return (
                <button
                  type="submit"
                  disabled={isSubmitDisabled}
                  title={isSubmitDisabled ? 'Section 7.2 Gate: 100% submission strictly requires a deliverable URL or file artifact' : ''}
                  className={`rounded-full px-6 py-2 text-[14px] font-semibold text-white shadow-sm transition ${
                    isSubmitDisabled
                      ? 'cursor-not-allowed bg-[#9ca3af]'
                      : isCompletion
                        ? 'bg-[#10b981] hover:bg-[#059669]'
                        : 'bg-[#2563eb] hover:bg-[#1d4ed8]'
                  }`}
                >
                  {isCompletion ? 'Submit for Approval (100%)' : 'Save Progress Update'}
                </button>
              )
            })()}
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskWorkUpdateModal
