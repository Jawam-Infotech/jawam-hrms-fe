import { useNavigate } from 'react-router-dom'

function AssetManagementHeader({
  onRequestNewAsset,
  onUnderMaintenance,
  onAssetDispose,
}) {
  const navigate = useNavigate()

  return (
    <div className="space-y-4">
      {/* Back Arrow */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        aria-label="Back to Assets"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e5e7eb] bg-white text-[#111827] transition hover:bg-[#f3f4f6]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Header */}
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-[28px] font-black text-[#111827]">
            Manage Assets
          </h1>

          <p className="mt-2 text-[14px] font-medium text-[#6b7280]">
            View all assets over the organization
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {onRequestNewAsset && (
            <button
              type="button"
              onClick={onRequestNewAsset}
              className="rounded-full bg-[#3b82f6] px-6 py-3 text-[14px] font-bold text-white transition hover:bg-[#2563eb]"
            >
              Request New Asset
            </button>
          )}

          {onUnderMaintenance && (
            <button
              type="button"
              onClick={onUnderMaintenance}
              className="rounded-full bg-[#f3f4f6] px-6 py-3 text-[14px] font-bold text-[#111827] transition hover:bg-[#e5e7eb]"
            >
              Under Maintenance
            </button>
          )}

          {onAssetDispose && (
            <button
              type="button"
              onClick={onAssetDispose}
              className="rounded-full bg-[#fee2e2] px-6 py-3 text-[14px] font-bold text-[#ef4444] transition hover:bg-[#fecaca]"
            >
              Asset Dispose
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default AssetManagementHeader