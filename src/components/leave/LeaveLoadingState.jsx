function LeaveLoadingState() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="px-6 py-12 text-center text-[14px] font-semibold text-[#6b7280]"
    >
      Loading leave requests...
    </div>
  )
}

export default LeaveLoadingState