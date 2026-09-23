import { ASSET_STATUS_CONFIG } from '../../constants/asset.js'

function AssetStatusBadge({ status }) {
  const normalizedStatus =
    String(status || 'Unknown').toUpperCase()

  const config =
    ASSET_STATUS_CONFIG[normalizedStatus]

  const badgeClass =
    config?.badgeClass ||
    'bg-[#f3f4f6] text-[#4b5563]'

  return (
    <span
      role="status"
      aria-label={`Asset status: ${normalizedStatus}`}
      className={`inline-flex items-center rounded-full px-3 py-1 text-[12px] font-bold ${badgeClass}`}
    >
      {normalizedStatus}
    </span>
  )
}

export default AssetStatusBadge