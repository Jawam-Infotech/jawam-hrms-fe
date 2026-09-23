function NewAssetAssignment({
  assetTypeName,
  availableAssets,
  selectedAsset,
  onSelectAsset,
}) {
  return (
    <div className="rounded-[16px] border border-[#e5e7eb] bg-[#f9fafb] p-5">
      <div>
        <h3 className="text-[16px] font-bold text-[#111827]">
          Assign Asset
        </h3>

        <p className="mt-1 text-[13px] font-medium text-[#6b7280]">
          Select an available {assetTypeName || 'asset'} to assign to this
          employee.
        </p>
      </div>

      <div className="mt-5 space-y-3">
        {availableAssets.map((asset) => {
          const isSelected = selectedAsset?.id === asset.id

          return (
            <button
              key={asset.id}
              type="button"
              onClick={() => onSelectAsset(asset)}
              className={`flex w-full items-center justify-between rounded-[14px] border px-4 py-4 text-left transition ${
                isSelected
                  ? 'border-[#0d9488] bg-[#f0fdfa]'
                  : 'border-[#e5e7eb] bg-white hover:border-[#d1d5db]'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    isSelected
                      ? 'border-[#0d9488]'
                      : 'border-[#d1d5db]'
                  }`}
                >
                  {isSelected && (
                    <div className="h-2.5 w-2.5 rounded-full bg-[#0d9488]" />
                  )}
                </div>

                <div>
                  <p className="text-[14px] font-bold text-[#111827]">
                    {asset.asset_tag}
                  </p>

                  <p className="mt-1 text-[12px] font-medium text-[#6b7280]">
                    Serial Number: {asset.serial_number}
                  </p>
                </div>
              </div>

              <span className="rounded-full bg-[#dcfce7] px-3 py-1.5 text-[11px] font-bold text-[#16a34a]">
                Available
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default NewAssetAssignment