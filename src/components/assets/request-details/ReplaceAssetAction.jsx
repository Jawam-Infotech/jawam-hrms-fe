function ReplaceAssetAction({
  selectedAction,
  onSelectAction,
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <button
        type="button"
        onClick={() => onSelectAction('SEND_TO_MAINTENANCE')}
        className={`rounded-[18px] border px-6 py-5 text-left transition ${
          selectedAction === 'SEND_TO_MAINTENANCE'
            ? 'border-[#93c5fd] bg-[#eff6ff]'
            : 'border-[#e5e7eb] bg-white hover:border-[#bfdbfe] hover:bg-[#f8fafc]'
        }`}
      >
        <p className="text-[15px] font-bold text-[#111827]">
          Send to Maintenance
        </p>

        <p className="mt-2 text-[13px] font-medium leading-5 text-[#6b7280]">
          Mark the current asset as under maintenance.
        </p>
      </button>

      <button
        type="button"
        onClick={() => onSelectAction('RETURN_TO_POOL')}
        className={`rounded-[18px] border px-6 py-5 text-left transition ${
          selectedAction === 'RETURN_TO_POOL'
            ? 'border-[#86efac] bg-[#f0fdf4]'
            : 'border-[#e5e7eb] bg-white hover:border-[#bbf7d0] hover:bg-[#f8fafc]'
        }`}
      >
        <p className="text-[15px] font-bold text-[#111827]">
          Return to Pool
        </p>

        <p className="mt-2 text-[13px] font-medium leading-5 text-[#6b7280]">
          Return the current asset to the available pool.
        </p>
      </button>

      <button
        type="button"
        onClick={() => onSelectAction('CREATE_DISPOSAL_REQUEST')}
        className={`rounded-[18px] border px-6 py-5 text-left transition sm:col-span-2 ${
          selectedAction === 'CREATE_DISPOSAL_REQUEST'
            ? 'border-[#fca5a5] bg-[#fef2f2]'
            : 'border-[#e5e7eb] bg-white hover:border-[#fecaca] hover:bg-[#f8fafc]'
        }`}
      >
        <p className="text-[15px] font-bold text-[#111827]">
          Create Disposal Request
        </p>

        <p className="mt-2 text-[13px] font-medium leading-5 text-[#6b7280]">
          Create a disposal request for the current asset for CEO approval.
        </p>
      </button>
    </div>
  )
}

export default ReplaceAssetAction