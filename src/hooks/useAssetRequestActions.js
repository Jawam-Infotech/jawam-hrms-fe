import { useCallback, useState } from 'react'
import {
  fetchAssetRequestById,
  fetchAssetById,
  rejectAssetRequestById,
  approveAssetRequestById,
  processAssetRequestById,
  fetchAssets,
  fetchAssetAssignments,
} from '../services/assetService'

function useAssetRequestActions({
  pagination,
  onRefresh,
}) {
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [availableAssets, setAvailableAssets] = useState([])
  const [oldAssetRequest, setOldAssetRequest] = useState(null)
  const [actionError, setActionError] = useState('')
  const [selectedOldAssetAction, setSelectedOldAssetAction] =
    useState(null)

  const [assignmentsCache, setAssignmentsCache] =
    useState(null)

  const getAssignments = useCallback(async () => {
    if (assignmentsCache) {
      return assignmentsCache
    }

    const assignmentsResponse =
      await fetchAssetAssignments()

    const assignments = Array.isArray(
      assignmentsResponse,
    )
      ? assignmentsResponse
      : assignmentsResponse?.results ?? []

    setAssignmentsCache(assignments)

    return assignments
  }, [assignmentsCache])

  const getAvailableAssets = useCallback(
    async (assetTypeId, excludedAssetId = null) => {
      const assetsResponse = await fetchAssets({
        asset_type: assetTypeId,
        status: 'ACTIVE',
      })

      const assets = Array.isArray(assetsResponse)
        ? assetsResponse
        : assetsResponse?.results ?? []

      const assignments = await getAssignments()

      const assignedAssetIds = new Set(
        assignments
          .filter(
            (assignment) =>
              String(
                assignment.status || '',
              ).toUpperCase() === 'ACTIVE',
          )
          .map((assignment) =>
            Number(
              assignment.asset?.id ??
                assignment.asset,
            ),
          )
          .filter(Number.isFinite),
      )

      return assets.filter((asset) => {
        const assetType =
          asset.asset_type?.id ??
          asset.asset_type

        const assetId = Number(asset.id)

        return (
          String(
            asset.status || '',
          ).toUpperCase() === 'ACTIVE' &&
          Number(assetType) ===
            Number(assetTypeId) &&
          !assignedAssetIds.has(assetId) &&
          (excludedAssetId === null ||
            assetId !== Number(excludedAssetId))
        )
      })
    },
    [getAssignments],
  )

  const handleViewRequest = async (request) => {
    try {
      setActionError('')

      const requestDetails =
        await fetchAssetRequestById(request.id)

      if (
        requestDetails.request_type ===
          'REQUEST_ASSET' ||
        requestDetails.request_type ===
          'REPLACE_ASSET'
      ) {
        const currentAsset =
          requestDetails.request_type ===
          'REPLACE_ASSET'
            ? await fetchAssetById(
                requestDetails.asset,
              )
            : null

        const requestAssetTypeId =
          requestDetails.request_type ===
          'REPLACE_ASSET'
            ? currentAsset?.asset_type?.id ??
              currentAsset?.asset_type
            : requestDetails.asset_type?.id ??
              requestDetails.asset_type

        const available =
          await getAvailableAssets(
            requestAssetTypeId,
            requestDetails.asset,
          )

        setAvailableAssets(available)
      } else {
        setAvailableAssets([])
      }

      setSelectedRequest(requestDetails)
    } catch (err) {
      console.error(
        'Failed to fetch asset request details:',
        err,
      )
    }
  }

  const handleRejectRequest = async (request) => {
    try {
      setActionError('')

      await rejectAssetRequestById(request.id, {
        comment: request.comment,
      })

      await onRefresh?.(
        pagination?.page || 1,
      )

      setSelectedRequest(null)
    } catch (err) {
      console.error(
        'Failed to reject asset request:',
        err,
      )

      setActionError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          err?.message ||
          'Unable to reject the asset request.',
      )
    }
  }

  const handleApproveRequest = async (
    request = selectedRequest,
  ) => {
    try {
      setActionError('')

      let payload

      if (
        request.request_type === 'REQUEST_ASSET' &&
        String(
          request.status || '',
        ).toUpperCase() === 'PENDING'
      ) {
        const reviewNote = String(
          request.review_note || '',
        ).trim()

        payload = reviewNote
          ? { comment: reviewNote }
          : undefined
      } else if (
        request.request_type === 'REQUEST_ASSET' &&
        String(
          request.status || '',
        ).toUpperCase() === 'APPROVED'
      ) {
        payload = request.asset_id
          ? { asset_id: request.asset_id }
          : undefined
      } else if (
        request.request_type ===
        'REPLACE_ASSET'
      ) {
        const reviewNote = String(
          request.review_note || '',
        ).trim()

        payload = {
          asset_id: request.asset_id,
          old_asset_disposition:
            request.old_asset_disposition,
          ...(reviewNote
            ? { comment: reviewNote }
            : {}),
        }
      } else if (
        request.request_type ===
          'RETURN_ASSET' ||
        request.request_type ===
          'REPORT_LOST'
      ) {
        const reviewNote = String(
          request.review_note || '',
        ).trim()

        payload = reviewNote
          ? { comment: reviewNote }
          : undefined
      } else {
        payload = undefined
      }

      const response =
        await approveAssetRequestById(
          request.id,
          payload,
        )

      setAssignmentsCache(null)

      if (
        request.request_type ===
        'REQUEST_ASSET'
      ) {
        const assetTypeId =
          response.asset_type?.id ??
          response.asset_type

        const available =
          await getAvailableAssets(
            assetTypeId,
          )

        setAvailableAssets(available)
      }

      if (
        request.request_type ===
        'REPLACE_ASSET'
      ) {
        await onRefresh?.(
          pagination?.page || 1,
        )

        setSelectedRequest(null)
        setOldAssetRequest(null)
        setSelectedOldAssetAction(null)

        return
      }

      await onRefresh?.(
        pagination?.page || 1,
      )

      if (
        request.request_type ===
          'REQUEST_ASSET' &&
        String(
          request.status || '',
        ).toUpperCase() === 'PENDING'
      ) {
        setSelectedRequest(response)
        return
      }

      setSelectedRequest(null)
      setOldAssetRequest(null)
    } catch (err) {
      console.error(
        'Failed to approve asset request:',
        err,
      )

      console.error(
        'API error response:',
        err?.response?.data,
      )

      setActionError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          err?.message ||
          'Unable to approve the asset request.',
      )
    }
  }

  const handleProcessRequest = async (
    request,
  ) => {
    try {
      setActionError('')

      const response =
        await processAssetRequestById(
          request.id,
        )

      const processedRequest = {
        ...response,
      }

      await onRefresh?.(
        pagination?.page || 1,
      )

      if (
        request.request_type ===
        'REPLACE_ASSET'
      ) {
        setOldAssetRequest(null)
        setSelectedOldAssetAction(null)
      }

      setSelectedRequest(processedRequest)

      return processedRequest
    } catch (err) {
      console.error(
        'Failed to process asset request:',
        err,
      )

      setActionError(
        err?.response?.data?.detail ||
          err?.response?.data?.message ||
          err?.message ||
          'Unable to process the asset request.',
      )

      throw err
    }
  }

  const handleCloseRequestDetails = () => {
    setActionError('')
    setSelectedRequest(null)
  }

  const handleOpenOldAssetAction = (
    request,
  ) => {
    setActionError('')
    setSelectedRequest(null)

    setOldAssetRequest({
      ...request,
    })
  }

  const handleCloseOldAssetAction = () => {
    setActionError('')
    setOldAssetRequest(null)
    setSelectedOldAssetAction(null)
    setSelectedRequest(null)
  }

  const handleFinalReplacementApproval =
    async () => {
      if (
        !oldAssetRequest?.replacement_asset_id ||
        !selectedOldAssetAction
      ) {
        return
      }

      await handleApproveRequest({
        ...oldAssetRequest,
        asset_id:
          oldAssetRequest.replacement_asset_id,
        old_asset_disposition:
          selectedOldAssetAction,
      })
    }

  return {
    selectedRequest,
    availableAssets,
    oldAssetRequest,
    actionError,
    selectedOldAssetAction,
    setSelectedOldAssetAction,
    handleViewRequest,
    handleRejectRequest,
    handleApproveRequest,
    handleProcessRequest,
    handleCloseRequestDetails,
    handleOpenOldAssetAction,
    handleCloseOldAssetAction,
    handleFinalReplacementApproval,
  }
}

export default useAssetRequestActions