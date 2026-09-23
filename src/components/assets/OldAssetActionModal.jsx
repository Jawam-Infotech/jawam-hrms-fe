import ReplaceAssetAction from './request-details/ReplaceAssetAction'

function OldAssetActionModal({
  isOpen,
  selectedAction,
  onSelectAction,
  onClose,
  onContinue,
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[10000] flex h-full w-full items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-3xl rounded-[28px] bg-white p-8 shadow-lg">

        {/* Header */}
        <div className="mb-7 flex items-start justify-between border-b border-[#e5e7eb] pb-6">
          <div>
            <h2 className="text-[28px] font-black text-[#111827]">
              Old Asset Action
            </h2>

            <p className="mt-2 text-[14px] font-medium text-[#6b7280]">
              Choose what should happen to the employee&apos;s current asset
              after replacement.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close old asset action"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[28px] leading-none text-[#6b7280] transition hover:bg-[#f3f4f6] hover:text-[#111827]"
          >
            ×
          </button>
        </div>

        {/* Action Selection */}
        <div className="border-b border-[#e5e7eb] pb-7">
          <h3 className="text-[18px] font-extrabold text-[#111827]">
            Select Action
          </h3>

          <p className="mt-1 text-[14px] font-medium text-[#6b7280]">
            Choose what should happen to the employee&apos;s current asset
            after replacement.
          </p>

          <div className="mt-5">
            <ReplaceAssetAction
              selectedAction={selectedAction}
              onSelectAction={onSelectAction}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-7 flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full bg-[#f3f4f6] px-6 py-3 text-[14px] font-bold text-[#374151] transition hover:bg-[#e5e7eb]"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!selectedAction}
            onClick={onContinue}
            className="flex-1 rounded-full bg-[#ccfbf1] px-6 py-3 text-[14px] font-bold text-[#0d9488] transition hover:bg-[#99f6e4] disabled:cursor-not-allowed disabled:bg-[#e5e7eb] disabled:text-[#9ca3af]"
          >
            Approve Replacement
          </button>
        </div>
      </div>
    </div>
  )
}

export default OldAssetActionModal