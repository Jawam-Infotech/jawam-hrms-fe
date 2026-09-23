function RequestModalActions({
  mode,
  selectedAsset,
  onReject,
  onApprove,
  onBack,
  onAssignAsset,
  onContinue,
}) {
  if (mode === 'ASSIGN_ASSET') {
    return (
      <div className="mt-8 flex gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 rounded-full bg-[#f3f4f6] px-6 py-3 text-[14px] font-bold text-[#374151] transition-all hover:bg-[#e5e7eb]"
        >
          Back
        </button>

        <button
          type="button"
          disabled={!selectedAsset}
          onClick={onAssignAsset}
          className={`flex-1 rounded-full px-6 py-3 text-[14px] font-bold transition-all ${
            selectedAsset
              ? 'bg-[#ccfbf1] text-[#0d9488] hover:bg-[#99f6e4]'
              : 'cursor-not-allowed bg-[#e5e7eb] text-[#9ca3af]'
          }`}
        >
          Assign Asset
        </button>
      </div>
    )
  }

  if (mode === 'REPLACE_PROCESSING') {
    return (
      <div className="mt-8 flex gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 rounded-full bg-[#f3f4f6] px-6 py-3 text-[14px] font-bold text-[#374151] transition-all hover:bg-[#e5e7eb]"
        >
          Back
        </button>

        <button
          type="button"
          onClick={onContinue}
          className="flex-1 rounded-full bg-[#ccfbf1] px-6 py-3 text-[14px] font-bold text-[#0d9488] transition-all hover:bg-[#99f6e4]"
        >
          Continue
        </button>
      </div>
    )
  }

  if (mode === 'PROCESSING') {
    return (
      <div className="mt-8 flex gap-4">
        <button
          type="button"
          onClick={onBack}
          className="flex-1 rounded-full bg-[#f3f4f6] px-6 py-3 text-[14px] font-bold text-[#374151] transition-all hover:bg-[#e5e7eb]"
        >
          Close
        </button>

        <button
          type="button"
          onClick={onApprove}
          className="flex-1 rounded-full bg-[#ccfbf1] px-6 py-3 text-[14px] font-bold text-[#0d9488] transition-all hover:bg-[#99f6e4]"
        >
          Approve
        </button>
      </div>
    )
  }

  if (mode === 'PENDING_COMPLETE') {
    return (
      <div className="mt-8 flex gap-4">
        <button
          type="button"
          onClick={onReject}
          className="flex-1 rounded-full bg-[#fee2e2] px-6 py-3 text-[14px] font-bold text-[#dc2626] transition-all hover:bg-[#fecaca]"
        >
          Reject
        </button>

        <button
          type="button"
          onClick={onApprove}
          className="flex-1 rounded-full bg-[#ccfbf1] px-6 py-3 text-[14px] font-bold text-[#0d9488] transition-all hover:bg-[#99f6e4]"
        >
          Approve & Complete
        </button>
      </div>
    )
  }

  if (mode === 'REPLACE_PENDING') {
    return (
      <div className="mt-8 flex gap-4">
        <button
          type="button"
          onClick={onReject}
          className="flex-1 rounded-full bg-[#fee2e2] px-6 py-3 text-[14px] font-bold text-[#dc2626] transition-all hover:bg-[#fecaca]"
        >
          Reject
        </button>

        <button
          type="button"
          onClick={onApprove}
          className="flex-1 rounded-full bg-[#ccfbf1] px-6 py-3 text-[14px] font-bold text-[#0d9488] transition-all hover:bg-[#99f6e4]"
        >
          Process
        </button>
      </div>
    )
  }

  if (mode === 'PENDING') {
    return (
      <div className="mt-8 flex gap-4">
        <button
          type="button"
          onClick={onReject}
          className="flex-1 rounded-full bg-[#fee2e2] px-6 py-3 text-[14px] font-bold text-[#dc2626] transition-all hover:bg-[#fecaca]"
        >
          Reject
        </button>

        <button
          type="button"
          onClick={onApprove}
          className="flex-1 rounded-full bg-[#ccfbf1] px-6 py-3 text-[14px] font-bold text-[#0d9488] transition-all hover:bg-[#99f6e4]"
        >
          Approve
        </button>
      </div>
    )
  }

  // Inventory Request - Pending
  if (mode === 'INVENTORY_PENDING') {
    return (
      <div className="mt-8 flex gap-4">
        <button
          type="button"
          onClick={onReject}
          className="flex-1 rounded-full bg-[#fee2e2] px-6 py-3 text-[14px] font-bold text-[#dc2626] transition-all hover:bg-[#fecaca]"
        >
          Reject
        </button>

        <button
          type="button"
          onClick={onApprove}
          className="flex-1 rounded-full bg-[#ccfbf1] px-6 py-3 text-[14px] font-bold text-[#0d9488] transition-all hover:bg-[#99f6e4]"
        >
          Approve
        </button>

        <button
          type="button"
          onClick={onBack}
          className="flex-1 rounded-full bg-[#f3f4f6] px-6 py-3 text-[14px] font-bold text-[#374151] transition-all hover:bg-[#e5e7eb]"
        >
          Close
        </button>
      </div>
    )
  }

  return null
}

export default RequestModalActions