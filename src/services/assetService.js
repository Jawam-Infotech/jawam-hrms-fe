import {
  getMyAssets,
  getAssets,
  getAssetById,
  getAssetAssignments,
  createAssetAssignment,
  getMyAssetHistory,
  getMyAssetSummary,
  getAssetTypes,
  getMyAssetRequests,
  createAssetRequest,
  getAllAssetRequests,
  getAssetRequestById,
  processAssetRequest,
  approveAssetRequest,
  rejectAssetRequest,
  cancelAssetRequest,
  uploadAssetRequestAttachment,
getAssetRequestAttachments,
getAssetRequestAttachmentById,
  getInventorySummary,
  getMaintenanceAssets,
  createMaintenance,
  createDisposalRequest,
  getMaintenanceById,
  completeMaintenance,
  createInventoryRequest,
  getInventoryRequests,
  getInventoryRequestById,
  approveInventoryRequest,
  rejectInventoryRequest,
  receiveInventoryRequest,
  getDisposalRequests,
  getDisposalRequestById,
  approveDisposalRequest,
  rejectDisposalRequest,
} from './api/assets.api'
const normalizeResponse = (response) => response?.data ?? response

export const fetchMyAssets = async () => {
  const response = await getMyAssets()
  return normalizeResponse(response)
}

export const fetchAssets = async (params) => {
  const response = await getAssets(params)

  return normalizeResponse(response)
}

export const fetchAssetById = async (assetId) => {
  const response = await getAssetById(assetId)
  return normalizeResponse(response)
}

export const fetchAssetAssignments = async (params = {}) => {
  const response = await getAssetAssignments({
    ...params,
    page: 1,
    page_size: 100,
  })

  const normalizedResponse = normalizeResponse(response)

  return Array.isArray(normalizedResponse)
    ? normalizedResponse
    : normalizedResponse?.results || []
}

export const createAssetAssignmentById = async (payload) => {
  const response = await createAssetAssignment(payload)
  return normalizeResponse(response)
}

export const fetchMyAssetHistory = async () => {
  const response = await getMyAssetHistory()
  return normalizeResponse(response)
}

export const fetchMyAssetSummary = async () => {
  const response = await getMyAssetSummary()
  return normalizeResponse(response)
}

export const fetchAssetTypes = async () => {
  const response = await getAssetTypes()
  return normalizeResponse(response)
}

export const fetchMyAssetRequests = async (params) => {
  const response = await getMyAssetRequests(params)
  return normalizeResponse(response)
}

export const submitAssetRequest = async (payload) => {
  const response = await createAssetRequest(payload)
  return normalizeResponse(response)
}

export const fetchInventoryRequests = async (params) => {
  const response = await getInventoryRequests(params)

  return normalizeResponse(response)
}

export const fetchInventoryRequestById = async (requestId) => {
  const response = await getInventoryRequestById(requestId)
  return normalizeResponse(response)
}

export const approveInventoryRequestById = async (
  requestId,
  payload,
) => {
  const response = await approveInventoryRequest(
    requestId,
    payload,
  )

  return normalizeResponse(response)
}

export const rejectInventoryRequestById = async (
  requestId,
  payload,
) => {
  const response =
    await rejectInventoryRequest(
      requestId,
      payload,
    )

  return normalizeResponse(response)
}

export const receiveInventoryRequestById = async (requestId) => {
  const response = await receiveInventoryRequest(requestId)

  return normalizeResponse(response)
}

export const fetchAllAssetRequests = async (params) => {
  const response = await getAllAssetRequests(params)
  return normalizeResponse(response)

}

export const fetchAssetRequestById = async (requestId) => {
  const response = await getAssetRequestById(requestId)

  return normalizeResponse(response)
}

export const processAssetRequestById = async (
  requestId,
) => {
  const response = await processAssetRequest(
    requestId,
  )

  return normalizeResponse(response)
}

export const approveAssetRequestById = async (requestId, payload) => {
  const response = await approveAssetRequest(requestId, payload)

  return normalizeResponse(response)
}

export const rejectAssetRequestById = async (requestId, payload) => {
  const response = await rejectAssetRequest(requestId, payload)

  return normalizeResponse(response)
}

export const cancelAssetRequestById = async (requestId) => {
  const response = await cancelAssetRequest(requestId)

  return normalizeResponse(response)
}

export const uploadAssetRequestAttachmentById = async (
  requestId,
  formData,
) => {
  const response = await uploadAssetRequestAttachment(
    requestId,
    formData,
  )
  return normalizeResponse(response)
}

export const fetchAssetRequestAttachments = async (
  requestId,
) => {
  const response =
    await getAssetRequestAttachments(requestId)
  return normalizeResponse(response)
}

export const fetchAssetRequestAttachmentById = async (
  requestId,
  attachmentId,
) => {
  const response =
    await getAssetRequestAttachmentById(
      requestId,
      attachmentId,
    )
  return normalizeResponse(response)
}

export const fetchInventorySummary = async () => {
  const response = await getInventorySummary()
  return normalizeResponse(response)
}
export const fetchMaintenanceAssets = async (params) => {

  const response = await getMaintenanceAssets(params)

  return normalizeResponse(response)

}

export const submitMaintenance = async (payload) =>
  normalizeResponse(await createMaintenance(payload))

export const fetchMaintenanceById = async (maintenanceId) =>
  normalizeResponse(await getMaintenanceById(maintenanceId))

export const completeMaintenanceById = async (
  maintenanceId,
  payload,
) =>
  normalizeResponse(
    await completeMaintenance(maintenanceId, payload),
  )

export const submitInventoryRequest = async (payload) => {
  const response = await createInventoryRequest(payload)
  return normalizeResponse(response)
}

export const submitDisposalRequest = async (payload) => {
  const response = await createDisposalRequest(payload)

  return normalizeResponse(response)
}

export const fetchDisposalRequests = async (params = {}) => {
  const response = await getDisposalRequests(params)
  return normalizeResponse(response)
}

export const fetchAllDisposalRequests = async (params = {}) => {
  const firstResponse = await getDisposalRequests({
    ...params,
    page: 1,
  })

  const firstPage = normalizeResponse(firstResponse)

  const records = Array.isArray(firstPage)
    ? [...firstPage]
    : [...(firstPage?.results || [])]

  let nextPage = Array.isArray(firstPage)
    ? null
    : firstPage?.next

  let page = 1

  while (nextPage) {
    page += 1

    const response = await getDisposalRequests({
      ...params,
      page,
    })

    const normalizedPage = normalizeResponse(response)

    records.push(
      ...(Array.isArray(normalizedPage)
        ? normalizedPage
        : normalizedPage?.results || []),
    )

    nextPage = Array.isArray(normalizedPage)
      ? null
      : normalizedPage?.next
  }

  return records
}

export const fetchDisposalRequestById = async (requestId) => {
  const response = await getDisposalRequestById(requestId)
  return normalizeResponse(response)
}

export const approveDisposalRequestById = async (
  requestId,
  payload,
) => {
  const response = await approveDisposalRequest(
    requestId,
    payload,
  )

  return normalizeResponse(response)
}

export const rejectDisposalRequestById = async (
  requestId,
  payload,
) => {
  const response = await rejectDisposalRequest(
    requestId,
    payload,
  )

  return normalizeResponse(response)
}