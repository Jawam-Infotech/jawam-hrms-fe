function RequestReason({ reason }) {
  return (
    <div>
      <h3 className="mb-3 text-[16px] font-bold text-[#111827]">
        Reason
      </h3>

      <div className="rounded-[14px] border border-[#e5e7eb] bg-[#f9fafb] px-4 py-4">
        <p className="text-[14px] font-medium leading-6 text-[#374151]">
          {reason || 'No reason provided.'}
        </p>
      </div>
    </div>
  )
}

export default RequestReason