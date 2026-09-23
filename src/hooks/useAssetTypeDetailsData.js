import { useMemo } from 'react'

function useAssetTypeDetailsData({
  assets,
  assignments,
  disposalRequests,
  employeeNames,
}) {
  const assignmentByAssetId = useMemo(() => {
    const map = new Map()

    assignments.forEach((assignment) => {
      const assetId =
        assignment?.asset?.id ??
        assignment?.asset

      if (
        assetId !== null &&
        assetId !== undefined
      ) {
        map.set(String(assetId), assignment)
      }
    })

    return map
  }, [assignments])

  const pendingDisposalAssetIds = useMemo(() => {
    return new Set(
      disposalRequests
        .filter(
          (request) =>
            String(
              request?.status || '',
            ).toUpperCase() === 'PENDING',
        )
        .map((request) =>
          String(request?.asset),
        )
        .filter(Boolean),
    )
  }, [disposalRequests])

  const enrichedAssets = useMemo(() => {
    return assets.map((asset) => {
      const assignment =
        assignmentByAssetId.get(
          String(asset.id),
        )

      const employeeId =
        assignment?.employee

      return {
        ...asset,
        assignment,
        pendingDisposal:
          pendingDisposalAssetIds.has(
            String(asset.id),
          ),
        assignedTo: assignment
          ? employeeNames[
              String(employeeId)
            ] || '—'
          : '—',
      }
    })
  }, [
    assets,
    assignmentByAssetId,
    pendingDisposalAssetIds,
    employeeNames,
  ])

 const filteredAssets = enrichedAssets

  const summary = useMemo(() => {
    const activeAssets = enrichedAssets.filter(
      (asset) =>
        String(
          asset.status || '',
        ).toUpperCase() === 'ACTIVE' &&
        !asset.pendingDisposal,
    )

    return {
      total: enrichedAssets.length,

      occupied: activeAssets.filter(
        (asset) => Boolean(asset.assignment),
      ).length,

      available: activeAssets.filter(
        (asset) => !asset.assignment,
      ).length,

      maintenance: enrichedAssets.filter(
        (asset) =>
          String(
            asset.status || '',
          ).toUpperCase() ===
          'UNDER_MAINTENANCE',
      ).length,
    }
  }, [enrichedAssets])

  return {
    assignmentByAssetId,
    pendingDisposalAssetIds,
    enrichedAssets,
    filteredAssets,
    summary,
  }
}

export default useAssetTypeDetailsData