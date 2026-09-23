import { useCallback, useState } from 'react'
import {
  fetchAssets,
  fetchAssetAssignments,
} from '../services/assetService'

function useAssetPool() {
  const [assets, setAssets] = useState([])

  const loadAssets = useCallback(async (force = false) => {
    if (!force && assets.length > 0) {
      return
    }

    const [assetsResponse, assignmentsResponse] = await Promise.all([
      fetchAssets({
        status: 'ACTIVE',
        page_size: 100,
      }),
      fetchAssetAssignments(),
    ])

    const activePoolAssets = Array.isArray(assetsResponse)
      ? assetsResponse
      : assetsResponse?.results || []

    const assignments = Array.isArray(assignmentsResponse)
      ? assignmentsResponse
      : assignmentsResponse?.results || []

    const assignedAssetIds = new Set(
  assignments
    .filter(
      (assignment) =>
        String(assignment.status || '').toUpperCase() ===
        'ACTIVE',
    )
    .map((assignment) =>
      Number(
        assignment.asset?.id ??
          assignment.asset_id ??
          assignment.asset,
      ),
    )
    .filter(Number.isFinite),
)
    setAssets(
  activePoolAssets.filter(
    (asset) => !assignedAssetIds.has(Number(asset.id)),
  ),
)
  }, [assets.length])

  return {
    assets,
    loadAssets,
  }
}

export default useAssetPool