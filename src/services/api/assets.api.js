import api from './axios'

import { ASSETS_ENDPOINTS } from './endpoints'

export const getMyAssets = () =>
  api.get(ASSETS_ENDPOINTS.me)

export const getMyAssetHistory = () =>
  api.get(ASSETS_ENDPOINTS.history)

export const getMyAssetSummary = () =>
  api.get(ASSETS_ENDPOINTS.summary)

export const getAssetTypes = () =>
  api.get(ASSETS_ENDPOINTS.types)

export const getMyAssetRequests = (params) =>
  api.get(ASSETS_ENDPOINTS.requests, { params })

export const createAssetRequest = (payload) =>
  api.post(ASSETS_ENDPOINTS.requests, payload)

// Manage Assets
export const getAllAssetRequests = (params) =>
  api.get(ASSETS_ENDPOINTS.allRequests, { params })

export const getAssetRequestById = (requestId) =>
  api.get(ASSETS_ENDPOINTS.requestById(requestId))

export const processAssetRequest = (requestId) =>
  api.post(
    ASSETS_ENDPOINTS.processRequest(requestId),
  )

export const approveAssetRequest = (requestId, payload) =>
  api.post(ASSETS_ENDPOINTS.approveRequest(requestId), payload)

export const rejectAssetRequest = (requestId, payload) =>
  api.post(ASSETS_ENDPOINTS.rejectRequest(requestId), payload)

export const cancelAssetRequest = (requestId) =>
  api.post(ASSETS_ENDPOINTS.cancelRequest(requestId))

// Asset Request Attachments
export const uploadAssetRequestAttachment = (
  requestId,
  formData,
) =>
  api.post(
    ASSETS_ENDPOINTS.requestAttachments(requestId),
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  )

export const getAssetRequestAttachments = (
  requestId,
) =>
  api.get(
    ASSETS_ENDPOINTS.requestAttachments(requestId),
  )

export const getAssetRequestAttachmentById = (
  requestId,
  attachmentId,
) =>
  api.get(
    ASSETS_ENDPOINTS.requestAttachmentById(
      requestId,
      attachmentId,
    ),
  )

export const getInventorySummary = () =>
  api.get(ASSETS_ENDPOINTS.inventorySummary)

export const getMaintenanceAssets = (params) =>

  api.get(ASSETS_ENDPOINTS.maintenance, { params })

export const createMaintenance = (payload) =>
  api.post(ASSETS_ENDPOINTS.maintenance, payload)

export const getMaintenanceById = (maintenanceId) =>
  api.get(ASSETS_ENDPOINTS.maintenanceById(maintenanceId))

export const completeMaintenance = (maintenanceId, payload) =>
  api.post(
    ASSETS_ENDPOINTS.completeMaintenance(maintenanceId),
    payload,
  )

  export const createDisposalRequest = (payload) =>
  api.post(ASSETS_ENDPOINTS.disposalRequests, payload)

export const createInventoryRequest = (payload) =>
  api.post(ASSETS_ENDPOINTS.inventoryRequests, payload)

export const getInventoryRequests = (params) =>
  api.get(ASSETS_ENDPOINTS.inventoryRequests, { params })

export const getInventoryRequestById = (requestId) =>
  api.get(`${ASSETS_ENDPOINTS.inventoryRequests}${requestId}/`)

export const getAssets = (params) =>
  api.get(ASSETS_ENDPOINTS.assets, { params })

export const getAssetById = (assetId) =>
  api.get(ASSETS_ENDPOINTS.assetById(assetId))

export const getAssetAssignments = (params) =>
  api.get(ASSETS_ENDPOINTS.assignments, { params })

export const createAssetAssignment = (payload) =>
  api.post(ASSETS_ENDPOINTS.assignments, payload)

export const getDisposalRequests = (params) =>
  api.get(ASSETS_ENDPOINTS.disposalRequests, { params })

export const getDisposalRequestById = (requestId) =>
  api.get(`${ASSETS_ENDPOINTS.disposalRequests}${requestId}/`)

export const approveDisposalRequest = (requestId, payload) =>
  api.post(
    ASSETS_ENDPOINTS.approveDisposal(requestId),
    payload,
  )

export const rejectDisposalRequest = (
  requestId,
  payload,
) =>
  api.post(
    ASSETS_ENDPOINTS.rejectDisposal(requestId),
    payload,
  )

export const approveInventoryRequest = (requestId, payload) =>
  api.post(
    ASSETS_ENDPOINTS.approveInventoryRequest(requestId),
    payload,)

export const rejectInventoryRequest = (
  requestId,
  payload,
) =>
  api.post(
    ASSETS_ENDPOINTS.rejectInventoryRequest(
      requestId,
    ),
    payload,
  )

  export const receiveInventoryRequest = (requestId) =>
  api.post(
    ASSETS_ENDPOINTS.receiveInventory(requestId),
  )