import {useContext, useState } from 'react'
import { UserContext } from '../../context/UserContext'
import DashboardLayout from '../../layouts/DashboardLayout'

import AssetsHeader from '../../components/assets/AssetsHeader'
import AssetsSummary from '../../components/assets/AssetsSummary'
import AssignedAssetsTable from '../../components/assets/AssignedAssetsTable'
import AssetRequestModal from '../../components/assets/AssetRequestModal'
import AssetRequestStatusTable from '../../components/assets/AssetRequestStatusTable'
import MyAssetRequestDetailsModal from '../../components/assets/MyAssetRequestDetailsModal'
import useAssets from '../../hooks/useAssets'
import {
  uploadAssetRequestAttachmentById,
} from '../../services/assetService'
import { useNavigate } from 'react-router-dom'




function Assets() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalInitialType, setModalInitialType] = useState(null)
  const [selectedAsset, setSelectedAsset] = useState(null)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const { user } = useContext(UserContext)
  const navigate = useNavigate()

const canManageAssets =
  user?.role === 'HR' || user?.role === 'CEO'
  const {
  assignedAssets,
  summary,
  assetTypes,
  assetRequests,
  assetRequestsPagination,
  requestFilters,
  loadAssetRequests,
  handleRequestFiltersChange,
  resetRequestFilters,
  loading,
  error,
  requestSubmitting,
  requestError,
  clearRequestError,
  raiseAssetRequest,
  refreshAssets,
} = useAssets()

  const openModal = (type = null, asset = null) => {
    clearRequestError()
    setModalInitialType(type)
    setSelectedAsset(asset)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setModalInitialType(null)
    setSelectedAsset(null)
  }

  const handleRaiseRequest = () => {
    openModal()
  }

  const handleReturnAsset = (asset) => {
    openModal('Return Asset', asset)
  }

  const handleReplaceAsset = (asset) => {
    openModal('Replace Asset', asset)
  }

  const handleManageAssets = () => {
  navigate('/assets/manage')
}

  const handleSubmitRequest = async (payload) => {
  const requestPayload = {
    request_type: payload.requestType,
    reason: payload.reason,
  }

  if (payload.requestType === 'REQUEST_ASSET') {
    requestPayload.asset_type = payload.assetId
  }

  if (payload.requestType === 'REPLACE_ASSET') {
    requestPayload.asset = payload.assetNumericId
  } else if (
    payload.requestType === 'RETURN_ASSET' ||
    payload.requestType === 'REPORT_LOST'
  ) {
    requestPayload.asset = payload.assetNumericId
  }

  if (
  payload.requestType === 'REPORT_LOST' &&
  payload.attachments?.length
) {
  requestPayload.attachment_reference =
    payload.attachments
      .map((file) => file.name)
      .join(', ')
}

const createdRequest =
  await raiseAssetRequest(requestPayload)

if (
  payload.requestType === 'REPORT_LOST' &&
  payload.attachments?.length &&
  createdRequest?.id
) {
  for (const file of payload.attachments) {
    const formData = new FormData()

    formData.append(
      'file',
      file,
    )

    await uploadAssetRequestAttachmentById(
      createdRequest.id,
      formData,
    )
  }
}

closeModal()
}

if (loading) {
  return (
    <DashboardLayout>
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-[16px] font-semibold text-[#6b7280]">
          Loading assets...
        </p>
      </div>
    </DashboardLayout>
  )
}

if (error) {
  return (
    <DashboardLayout>
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-[16px] font-semibold text-[#dc2626]">
            {error}
          </p>

          <button
            type="button"
            onClick={refreshAssets}
            className="mt-4 rounded-full bg-[#3b82f6] px-5 py-2 text-[14px] font-bold text-white transition-all hover:bg-[#2563eb]"
          >
            Try Again
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <AssetsHeader
          onRaiseRequest={handleRaiseRequest}
          onManageAssets={handleManageAssets}
          showManageAssets={canManageAssets}
        />

        <AssetsSummary summary={summary} />

        <AssignedAssetsTable
          assets={assignedAssets}
          onReturnAsset={handleReturnAsset}
          onReplaceAsset={handleReplaceAsset}
        />


        
        <AssetRequestStatusTable
  requests={assetRequests}
  loading={loading}
  pagination={assetRequestsPagination}
  assetTypes={assetTypes}
  filters={requestFilters}
  onFiltersChange={handleRequestFiltersChange}
  onResetFilters={resetRequestFilters}
  onPageChange={(page) =>
    loadAssetRequests(page, requestFilters)
  }
  onViewRequest={(request) => setSelectedRequest(request)}
/>
{isModalOpen && (
  <AssetRequestModal
    isOpen
    onClose={closeModal}
    onSubmit={handleSubmitRequest}
    assignedAssets={assignedAssets}
    assetTypes={assetTypes}
    initialType={modalInitialType}
    initialAsset={selectedAsset}
    submitting={requestSubmitting}
    requestError={requestError}
  />
)}
      </div>

      <MyAssetRequestDetailsModal
  isOpen={Boolean(selectedRequest)}
  request={selectedRequest}
  onClose={() => setSelectedRequest(null)}
/>
    </DashboardLayout>
  )
}

export default Assets
