function RequestInformation({ request, requestType, status }) {
  const formatDate = (date) => {
    if (!date) return '—'

    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  return (
    <div>
      <h3 className="mb-4 text-[16px] font-bold text-[#111827]">
        Request Information
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-[14px] border border-[#e5e7eb] bg-[#f9fafb] p-4">
          <p className="text-[12px] font-semibold text-[#6b7280]">
            Request By
          </p>

          <p className="mt-1 text-[14px] font-bold text-[#111827]">
            {request.requested_by_name ||
              request.requested_by ||
              '—'}
          </p>
        </div>

        <div className="rounded-[14px] border border-[#e5e7eb] bg-[#f9fafb] p-4">
          <p className="text-[12px] font-semibold text-[#6b7280]">
            Request Date
          </p>

          <p className="mt-1 text-[14px] font-bold text-[#111827]">
            {formatDate(request.created_at)}
          </p>
        </div>

        <div className="rounded-[14px] border border-[#e5e7eb] bg-[#f9fafb] p-4">
          <p className="text-[12px] font-semibold text-[#6b7280]">
            Request Type
          </p>

          <p className="mt-1 text-[14px] font-bold text-[#111827]">
            {requestType || '—'}
          </p>
        </div>

        <div className="rounded-[14px] border border-[#e5e7eb] bg-[#f9fafb] p-4">
          <p className="text-[12px] font-semibold text-[#6b7280]">
            Asset Name
          </p>

          <p className="mt-1 text-[14px] font-bold text-[#111827]">
            {request.asset_type_name ||
              request.asset_name ||
              '—'}
          </p>
        </div>

        <div className="rounded-[14px] border border-[#e5e7eb] bg-[#f9fafb] p-4">
          <p className="text-[12px] font-semibold text-[#6b7280]">
            Asset ID
          </p>

          <p className="mt-1 text-[14px] font-bold text-[#111827]">
            {request.asset_tag ||
              request.asset_id ||
              request.asset ||
              '—'}
          </p>
        </div>

        <div className="rounded-[14px] border border-[#e5e7eb] bg-[#f9fafb] p-4">
          <p className="text-[12px] font-semibold text-[#6b7280]">
            Status
          </p>

          <p className="mt-1 text-[14px] font-bold text-[#111827]">
            {status}
          </p>
        </div>
      </div>
    </div>
  )
}

export default RequestInformation