import {useMemo, useState } from 'react'


function AssetDisposeModal({
  isOpen,
  onClose,
  onSubmit,
  submitting = false,
  requestError = '',
  assets = [],
}) {
  const [assetName, setAssetName] = useState('')
  const [assetId, setAssetId] = useState('')
  const [assetSearch, setAssetSearch] = useState('')
  const [isAssetDropdownOpen, setIsAssetDropdownOpen] = useState(false)
  const [reason, setReason] = useState('')

const assetNames = useMemo(() => {
  return [
    ...new Set(
      assets
        .map((asset) => asset.asset_type_name)
        .filter(Boolean),
    ),
  ]
}, [assets])

  const filteredAssets = useMemo(() => {
    return assets.filter((asset) => {
      const matchesName =
        !assetName || asset.asset_type_name === assetName

      const matchesSearch =
        !assetSearch ||
        asset.asset_tag
          .toLowerCase()
          .includes(assetSearch.toLowerCase())

      return matchesName && matchesSearch
    })
  }, [assets, assetName, assetSearch])

  const selectedAsset = assets.find(
  (asset) => String(asset.id) === String(assetId),
)

  const handleAssetNameChange = (value) => {
    setAssetName(value)
    setAssetId('')
    setAssetSearch('')
    setIsAssetDropdownOpen(false)
  }

  const handleAssetSelect = (asset) => {
    setAssetId(String(asset.id))
    setAssetSearch(asset.asset_tag)
    setIsAssetDropdownOpen(false)
    setAssetName(asset.asset_type_name)
  }

  const handleSubmit = async () => {
    if (!assetId || !reason.trim()) {
      return
    }

    await onSubmit?.({
      asset: Number(assetId),
      reason: reason.trim(),
    })
  }

  const handleCancel = () => {
    if (submitting) return

    setAssetName('')
    setAssetId('')
    setAssetSearch('')
    setIsAssetDropdownOpen(false)
    setReason('')

    onClose()
  }

  const isSubmitDisabled =
    !assetId ||
    !reason.trim() ||
    submitting

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[24px] bg-white p-8 shadow-lg">
        <h2 className="mb-6 border-b border-[#e5e7eb] pb-4 text-[24px] font-black text-[#111827]">
          Request Asset Disposal
        </h2>

        {requestError && (
          <div className="mb-6 rounded-[12px] border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-[14px] font-semibold text-[#dc2626]">
            {requestError}
          </div>
        )}

        <div className="space-y-6">
          {/* Asset Name */}
          <div>
            <label className="mb-3 block text-[14px] font-bold text-[#111827]">
              Asset Name
            </label>

            <select
              value={assetName}
              onChange={(event) =>
                handleAssetNameChange(event.target.value)
              }
              disabled={submitting}
              className="w-full rounded-[12px] border border-[#e5e7eb] bg-white px-4 py-3 text-[14px] font-semibold text-[#111827] outline-none transition-all focus:border-[#3b82f6] focus:ring-2 focus:ring-[#bfdbfe]/50"
            >
              <option value="">
                Select asset name
              </option>

              {assetNames.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Asset ID */}
          <div className="relative">
            <label className="mb-3 block text-[14px] font-bold text-[#111827]">
              Asset ID
            </label>

            <input
              type="text"
              value={assetSearch}
              onChange={(event) => {
                setAssetSearch(event.target.value)
                setAssetId('')
                setIsAssetDropdownOpen(true)
              }}
              onFocus={() => {
                if (assetName) {
                  setIsAssetDropdownOpen(true)
                }
              }}
              disabled={!assetName || submitting}
              placeholder={
                assetName
                  ? 'Search asset ID...'
                  : 'Select asset name first'
              }
              className="w-full rounded-[12px] border border-[#e5e7eb] bg-white px-4 py-3 text-[14px] font-semibold text-[#111827] outline-none transition-all placeholder:text-[#9ca3af] focus:border-[#3b82f6] focus:ring-2 focus:ring-[#bfdbfe]/50 disabled:cursor-not-allowed disabled:bg-[#f9fafb]"
            />

            {isAssetDropdownOpen && assetName && (
              <div className="absolute left-0 right-0 top-full z-10 mt-2 max-h-52 overflow-y-auto rounded-[12px] border border-[#e5e7eb] bg-white p-1 shadow-lg">
                {filteredAssets.length > 0 ? (
                  filteredAssets.map((asset) => (
                    <button
                      key={asset.id}
                      type="button"
                      onClick={() => handleAssetSelect(asset)}
                      className="flex w-full items-center justify-between rounded-[10px] px-4 py-3 text-left transition hover:bg-[#f3f4f6]"
                    >
                      <span className="text-[14px] font-semibold text-[#111827]">
                        {asset.asset_tag}
                      </span>

                      <span className="text-[12px] font-medium text-[#6b7280]">
                        {asset.asset_type_name}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-[13px] font-medium text-[#6b7280]">
                    No matching assets found.
                  </div>
                )}
              </div>
            )}

            {selectedAsset && (
              <p className="mt-2 text-[12px] font-medium text-[#6b7280]">
                Selected: {selectedAsset.asset_type_name}
              </p>
            )}
          </div>

          {/* Reason */}
          <div>
            <label className="mb-3 block text-[14px] font-bold text-[#111827]">
              Reason
            </label>

            <textarea
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              disabled={submitting}
              placeholder="Write reason ..."
              rows={4}
              className="w-full resize-none rounded-[12px] border border-[#e5e7eb] bg-white px-4 py-3 text-[14px] text-[#111827] outline-none transition-all focus:border-[#3b82f6] focus:ring-2 focus:ring-[#bfdbfe]/50"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <button
            type="button"
            onClick={handleCancel}
            disabled={submitting}
            className="flex-1 rounded-full bg-[#fee2e2] px-6 py-3 text-[14px] font-bold text-[#dc2626] transition-all hover:bg-[#fecaca] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className="flex-1 rounded-full bg-[#ccfbf1] px-6 py-3 text-[14px] font-bold text-[#0d9488] transition-all hover:bg-[#99f6e4] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting ? 'Submitting...' : 'Request Disposal'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AssetDisposeModal