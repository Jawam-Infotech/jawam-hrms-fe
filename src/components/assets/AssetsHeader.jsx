function AssetsHeader({
  onRaiseRequest,
  onManageAssets,
  showManageAssets = false,
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-[32px] font-black text-[#111827]">
          Assets
        </h1>

        <p className="mt-2 text-[16px] text-[#5f6679]">
          View and manage your assigned assets.
        </p>
      </div>

      <div className="flex items-center gap-3">
        {showManageAssets && (
          <button
            type="button"
            onClick={onManageAssets}
            className="rounded-full border border-[#3b82f6] bg-white px-6 py-3 text-[14px] font-bold text-[#2563eb] transition-all hover:bg-[#eff6ff]"
          >
            Manage Assets
          </button>
        )}

        <button
          type="button"
          onClick={onRaiseRequest}
          className="rounded-full bg-[#3b82f6] px-6 py-3 text-[14px] font-bold text-white transition-all hover:bg-[#2563eb]"
        >
          Raise Asset Request
        </button>
      </div>
    </div>
  )
}

export default AssetsHeader