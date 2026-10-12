function LeaveReviewActionButtons({
  isPending,
  isCancellationRequested,
  canReviewCancellation,
  actionLoading,
  reviewAction,
  onReject,
  onOpenPartialApproval,
  onAccept,
  onRejectCancellation,
  onApproveCancellation,
}) {
  return (
    <>
      {/* NORMAL LEAVE ACTIONS */}
      {isPending && (
        <div className="flex flex-wrap justify-end gap-3 border-t border-[#e5e7eb] px-6 py-5">
          <button
            type="button"
            onClick={onReject}
            disabled={actionLoading}
            className="rounded-full border border-[#fecaca] px-5 py-2.5 text-[14px] font-bold text-[#dc2626] transition hover:bg-[#fef2f2] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {actionLoading && reviewAction === 'reject'
              ? 'Rejecting...'
              : 'Reject'}
          </button>

          <button
            type="button"
            onClick={onOpenPartialApproval}
            disabled={actionLoading}
            className="rounded-full bg-[#f97316] px-5 py-2.5 text-[14px] font-bold text-white transition hover:bg-[#ea580c] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Partial Accept
          </button>

          <button
            type="button"
            onClick={onAccept}
            disabled={actionLoading}
            className="rounded-full bg-[#16a34a] px-5 py-2.5 text-[14px] font-bold text-white transition hover:bg-[#15803d] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {actionLoading && reviewAction === 'accept'
              ? 'Accepting...'
              : 'Accept'}
          </button>
        </div>
      )}

      {/* CANCELLATION ACTIONS */}
      {isCancellationRequested && canReviewCancellation && (
        <div className="flex flex-wrap justify-end gap-3 border-t border-[#e5e7eb] px-6 py-5">
          <button
            type="button"
            onClick={onRejectCancellation}
            disabled={actionLoading}
            className="rounded-full border border-[#fecaca] px-5 py-2.5 text-[14px] font-bold text-[#dc2626] transition hover:bg-[#fef2f2] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {actionLoading && reviewAction === 'rejectCancellation'
              ? 'Rejecting...'
              : 'Reject Cancellation'}
          </button>

          <button
            type="button"
            onClick={onApproveCancellation}
            disabled={actionLoading}
            className="rounded-full bg-[#16a34a] px-5 py-2.5 text-[14px] font-bold text-white transition hover:bg-[#15803d] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {actionLoading && reviewAction === 'approveCancellation'
              ? 'Approving...'
              : 'Approve Cancellation'}
          </button>
        </div>
      )}
    </>
  )
}

export default LeaveReviewActionButtons
