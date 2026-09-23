function AssetManagementSummary({ inventorySummary = [], loading }) {
  const totalAssets = inventorySummary.reduce(
    (total, asset) => total + (asset.total ?? 0),
    0,
  )

  const availableAssets = inventorySummary.reduce(
    (total, asset) => total + (asset.available_for_assignment ?? 0),
    0,
  )

  const maintenanceAssets = inventorySummary.reduce(
    (total, asset) => total + (asset.under_maintenance ?? 0),
    0,
  )

  const occupiedAssets = inventorySummary.reduce(
    (total, asset) =>
      total +
      Math.max(
        0,
        (asset.active ?? 0) - (asset.available_for_assignment ?? 0),
      ),
    0,
  )

  const summaryCards = [
    {
      title: 'Total Assets',
      value: totalAssets,
      description: 'All assets in the organization',
      valueClass: 'text-[#3b82f6]',
    },
    {
      title: 'Occupied Assets',
      value: occupiedAssets,
      description: 'Currently assigned to employees',
      valueClass: 'text-[#10b981]',
    },
    {
      title: 'Available Assets',
      value: availableAssets,
      description: 'Ready to be assigned',
      valueClass: 'text-[#6366f1]',
    },
    {
      title: 'Under Maintenance',
      value: maintenanceAssets,
      description: 'Currently under maintenance',
      valueClass: 'text-[#f59e0b]',
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {summaryCards.map((card) => (
        <div
          key={card.title}
          className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm"
        >
          <p className="text-[14px] font-semibold text-[#111827]">
            {card.title}
          </p>

          <p
            className={`mt-3 text-[30px] font-black ${card.valueClass}`}
          >
            {loading ? '—' : card.value}
          </p>

          <p className="mt-1 text-[12px] font-medium text-[#9ca3af]">
            {card.description}
          </p>
        </div>
      ))}
    </div>
  )
}

export default AssetManagementSummary