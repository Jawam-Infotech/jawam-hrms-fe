import { useState } from 'react'

function AssetMaintenanceDetailsModal({
  isOpen,
  maintenance,
  canComplete,
  completing,
  onClose,
  onComplete,
}) {
  const [completionResult, setCompletionResult] = useState('')
  const [completionNote, setCompletionNote] = useState('')
  const [error, setError] = useState('')

  if (!isOpen || !maintenance) return null

  const asset = maintenance.asset || {}
  const status = maintenance.status || 'ACTIVE'

  const handleComplete = () => {
    if (!completionResult) {
      setError('Please select a maintenance completion result.')
      return
    }

    if (
      completionResult === 'NOT_FIXED' &&
      !completionNote.trim()
    ) {
      setError(
        'Completion note is required when the asset is not fixed.',
      )
      return
    }

    setError('')

    const payload = {
      completion_result: completionResult,
    }

    if (completionResult === 'NOT_FIXED') {
      payload.completion_note = completionNote.trim()
    }

    onComplete?.(payload)
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-[24px] bg-white p-8 shadow-lg">
        <div className="mb-6 flex items-start justify-between border-b border-[#e5e7eb] pb-4">
          <h2 className="text-[24px] font-black text-[#111827]">
            Maintenance Details
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close maintenance details"
            className="text-2xl text-[#6b7280]"
          >
            ×
          </button>
        </div>

        <div className="space-y-4 text-sm text-[#374151]">
          <p>
            <strong>Asset Name:</strong>{' '}
            {maintenance.asset_type_name ||
              maintenance.asset_name ||
              asset.asset_type_name ||
              '—'}
          </p>

          <p>
            <strong>Asset ID:</strong>{' '}
            {maintenance.asset_tag ||
              maintenance.asset_id ||
              asset.asset_tag ||
              maintenance.asset ||
              '—'}
          </p>

          <p>
            <strong>Reason:</strong>{' '}
            {maintenance.reason || '—'}
          </p>

          <p>
            <strong>Maintenance Started:</strong>{' '}
            {maintenance.started_at || maintenance.created_at
              ? new Date(
                  maintenance.started_at ||
                    maintenance.created_at,
                ).toLocaleString()
              : '—'}
          </p>

          <p>
            <strong>Current Status:</strong> {status}
          </p>
        </div>

        {canComplete && status === 'ACTIVE' && (
          <div className="mt-7 border-t border-[#e5e7eb] pt-6">
            <h3 className="text-[14px] font-extrabold text-[#111827]">
              Maintenance Completion
            </h3>

            <p className="mt-1 text-[13px] font-medium text-[#6b7280]">
              Select the final result of the maintenance.
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => {
                  setCompletionResult('FIXED')
                  setCompletionNote('')
                  setError('')
                }}
                className={`rounded-[16px] border px-5 py-4 text-left transition ${
                  completionResult === 'FIXED'
                    ? 'border-[#86efac] bg-[#f0fdf4]'
                    : 'border-[#e5e7eb] bg-white hover:border-[#bbf7d0] hover:bg-[#f8fafc]'
                }`}
              >
                <p className="text-[14px] font-bold text-[#111827]">
                  Fixed
                </p>

                <p className="mt-1 text-[12px] font-medium text-[#6b7280]">
                  The asset has been repaired successfully.
                </p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCompletionResult('NOT_FIXED')
                  setError('')
                }}
                className={`rounded-[16px] border px-5 py-4 text-left transition ${
                  completionResult === 'NOT_FIXED'
                    ? 'border-[#fca5a5] bg-[#fef2f2]'
                    : 'border-[#e5e7eb] bg-white hover:border-[#fecaca] hover:bg-[#f8fafc]'
                }`}
              >
                <p className="text-[14px] font-bold text-[#111827]">
                  Not Fixed
                </p>

                <p className="mt-1 text-[12px] font-medium text-[#6b7280]">
                  The asset could not be repaired and needs disposal review.
                </p>
              </button>
            </div>

            {completionResult === 'NOT_FIXED' && (
              <div className="mt-4">
                <label
                  htmlFor="completion-note"
                  className="text-[13px] font-bold text-[#374151]"
                >
                  Completion Note
                </label>

                <textarea
                  id="completion-note"
                  value={completionNote}
                  onChange={(event) => {
                    setCompletionNote(event.target.value)
                    setError('')
                  }}
                  rows={4}
                  placeholder="Enter reason/details for why the asset could not be fixed..."
                  className="mt-2 w-full rounded-[14px] border border-[#e5e7eb] px-4 py-3 text-sm font-medium text-[#374151] outline-none transition focus:border-[#99f6e4]"
                />
              </div>
            )}

            {error && (
              <p className="mt-3 text-[13px] font-semibold text-[#dc2626]">
                {error}
              </p>
            )}
          </div>
        )}

        <div className="mt-8 flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full bg-[#f3f4f6] px-6 py-3 text-sm font-bold text-[#374151]"
          >
            Close
          </button>

          {canComplete && status === 'ACTIVE' && (
            <button
              type="button"
              disabled={completing}
              onClick={handleComplete}
              className="flex-1 rounded-full bg-[#ccfbf1] px-6 py-3 text-sm font-bold text-[#0d9488] disabled:opacity-50"
            >
              {completing
                ? 'Updating...'
                : 'Update Status'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default AssetMaintenanceDetailsModal