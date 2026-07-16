import { useState, useContext } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { UserContext } from '../../context/UserContext'

const assignedAssets = [
  { id: 1, name: 'Laptop', dateFrom: '12/03/2026', status: 'Active' },
  { id: 2, name: 'Keyboard', dateFrom: '12/03/2026', status: 'Active' },
  { id: 3, name: 'Mouse', dateFrom: '12/03/2026', status: 'Active' },
  { id: 4, name: 'Laptop Charger', dateFrom: '12/03/2026', status: 'Active' },
]

const pastAssets = [
  { id: 1, name: 'Laptop', dateFrom: '12/03/2026', dateTo: '12/03/2026', type: 'Replaced' },
  { id: 2, name: 'Keyboard', dateFrom: '12/03/2026', dateTo: '12/03/2026', type: 'Return' },
  { id: 3, name: 'Mouse', dateFrom: '12/03/2026', dateTo: '12/03/2026', type: 'Replaced' },
  { id: 4, name: 'Laptop Charger', dateFrom: '12/03/2026', dateTo: '12/03/2026', type: 'Replaced' },
]

function RaiseAssetRequestModal({ isOpen, onClose, initialType = null }) {
  const [requestType, setRequestType] = useState(initialType || '')
  const [assetName, setAssetName] = useState('')
  const [reason, setReason] = useState('')
  const [attachment, setAttachment] = useState(null)

  const requestTypeOptions = ['Request Asset', 'Report Lost Asset', 'Return Asset', 'Replace Asset']

  const handleFileChange = (e) => {
    setAttachment(e.target.files[0])
  }

  const handleSubmit = () => {
    console.log({
      requestType,
      assetName,
      reason,
      attachment,
    })
    onClose()
  }

  const handleCancel = () => {
    setRequestType('')
    setAssetName('')
    setReason('')
    setAttachment(null)
    onClose()
  }

  const getModalTitle = () => {
    if (requestType === 'Request Asset') return 'Raise New Asset Request'
    if (requestType === 'Report Lost Asset') return 'Raise Asset Request'
    if (requestType === 'Return Asset') return 'Raise Asset Return Request'
    if (requestType === 'Replace Asset') return 'Raise Asset Request'
    return 'Raise Asset Request'
  }

  const getActionButtonLabel = () => {
    if (requestType === 'Request Asset') return 'Request asset'
    if (requestType === 'Report Lost Asset') return 'Report asset'
    if (requestType === 'Return Asset') return 'Return asset'
    if (requestType === 'Replace Asset') return 'Replace asset'
    return 'Submit'
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[24px] bg-white p-8 shadow-lg">
        <h2 className="mb-6 border-b border-[#e5e7eb] pb-4 text-[24px] font-black text-[#111827]">
          {getModalTitle()}
        </h2>

        <div className="space-y-6">
          {/* Request Type - only show if not pre-selected */}
          {!initialType && (
            <div>
              <label className="mb-3 block text-[14px] font-bold text-[#111827]">Request Type</label>
              <select
                value={requestType}
                onChange={(e) => setRequestType(e.target.value)}
                className="w-full rounded-[12px] border border-[#e5e7eb] bg-white px-4 py-3 text-[14px] font-semibold text-[#111827] outline-none transition-all focus:border-[#3b82f6] focus:ring-2 focus:ring-[#bfdbfe]/50"
              >
                <option value="">Select Request type</option>
                {requestTypeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Asset Name (shown for all types) */}
          {requestType && (
            <div>
              <label className="mb-3 block text-[14px] font-bold text-[#111827]">Asset name</label>
              <select
                value={assetName}
                onChange={(e) => setAssetName(e.target.value)}
                className="w-full rounded-[12px] border border-[#e5e7eb] bg-white px-4 py-3 text-[14px] font-semibold text-[#111827] outline-none transition-all focus:border-[#3b82f6] focus:ring-2 focus:ring-[#bfdbfe]/50"
              >
                <option value="">Select asset from the list</option>
                {assignedAssets.map((asset) => (
                  <option key={asset.id} value={asset.name}>
                    {asset.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Reason (shown for all types) */}
          {requestType && (
            <div>
              <label className="mb-3 block text-[14px] font-bold text-[#111827]">Reason</label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Write reason ..."
                className="w-full rounded-[12px] border border-[#e5e7eb] bg-white px-4 py-3 text-[14px] text-[#111827] outline-none transition-all focus:border-[#3b82f6] focus:ring-2 focus:ring-[#bfdbfe]/50"
                rows={4}
              />
            </div>
          )}

          {/* Attachment (shown only for Report Lost Asset) */}
          {requestType === 'Report Lost Asset' && (
            <div>
              <label className="mb-3 block text-[14px] font-bold text-[#111827]">Attachment</label>
              <label className="flex items-center gap-3 rounded-[12px] border border-[#e5e7eb] bg-white px-4 py-3 cursor-pointer transition-all hover:border-[#3b82f6]">
                <span className="text-[20px]">📎</span>
                <span className="text-[14px] font-semibold text-[#111827]">
                  {attachment ? attachment.name : 'Attach FIR Copy'}
                </span>
                <input type="file" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <button
            onClick={handleCancel}
            className="flex-1 rounded-full bg-[#fee2e2] px-6 py-3 text-[14px] font-bold text-[#dc2626] transition-all hover:bg-[#fecaca]"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!requestType || !assetName || !reason}
            className="flex-1 rounded-full bg-[#ccfbf1] px-6 py-3 text-[14px] font-bold text-[#0d9488] transition-all hover:bg-[#99f6e4] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {getActionButtonLabel()}
          </button>
        </div>
      </div>
    </div>
  )
}

function Assets() {
  const { user } = useContext(UserContext)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalInitialType, setModalInitialType] = useState(null)

  const openModal = (type = null) => {
    setModalInitialType(type)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setModalInitialType(null)
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[32px] font-black text-[#111827]">Assets</h1>
            <p className="text-[16px] text-[#5f6679] mt-2">View and manage your assigned assets.</p>
          </div>
          <button
            onClick={() => openModal()}
            className="rounded-full bg-[#3b82f6] px-6 py-3 text-[14px] font-bold text-white transition-all hover:bg-[#2563eb]"
          >
            Raise Asset Request
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-[18px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[14px] font-semibold text-[#6b7280]">Assigned Assets</p>
                <p className="mt-4 text-[28px] font-black text-[#2563eb]">
                  {assignedAssets.length}
                </p>
              </div>
              <div className="text-[28px]">📊</div>
            </div>
          </div>

          <div className="rounded-[18px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[14px] font-semibold text-[#6b7280]">Active Asset</p>
                <p className="mt-4 text-[28px] font-black text-[#10b981]">3</p>
              </div>
              <div className="text-[28px]">⭐</div>
            </div>
          </div>

          <div className="rounded-[18px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[14px] font-semibold text-[#6b7280]">Pending Return</p>
                <p className="mt-4 text-[28px] font-black text-[#0ea5e9]">1</p>
              </div>
              <div className="text-[28px]">💻</div>
            </div>
          </div>
        </div>

        {/* Assigned Assets Table */}
        <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-[20px] font-black text-[#111827]">Assigned Assets</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px] text-[#374151]">
              <thead className="border-b border-[#e5e7eb] text-[#6b7280]">
                <tr>
                  <th className="py-4 font-semibold">Asset Name</th>
                  <th className="py-4 font-semibold">Date from</th>
                  <th className="py-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {assignedAssets.map((asset) => (
                  <tr key={asset.id} className="border-b border-[#f3f4f6] hover:bg-[#f8fafc] transition-all">
                    <td className="py-4 font-semibold text-[#111827]">{asset.name}</td>
                    <td className="py-4 text-[#6b7280]">{asset.dateFrom}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <button
                          onClick={() => openModal('Replace Asset')}
                          className="rounded-full bg-[#fee2e2] px-3 py-2 text-[11px] font-semibold text-[#dc2626] transition-all hover:bg-[#fecaca] whitespace-nowrap"
                        >
                          Report Replacement
                        </button>
                        <button
                          onClick={() => openModal('Return Asset')}
                          className="rounded-full bg-[#ccfbf1] px-3 py-2 text-[11px] font-semibold text-[#0d9488] transition-all hover:bg-[#99f6e4] whitespace-nowrap"
                        >
                          Return Asset
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Past Assets Table */}
        <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
          <h2 className="mb-6 text-[20px] font-black text-[#111827]">Past Assets</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[14px] text-[#374151]">
              <thead className="border-b border-[#e5e7eb] text-[#6b7280]">
                <tr>
                  <th className="py-4 font-semibold">Asset Name</th>
                  <th className="py-4 font-semibold">Date from</th>
                  <th className="py-4 font-semibold">Date to</th>
                  <th className="py-4 font-semibold">Request type</th>
                </tr>
              </thead>
              <tbody>
                {pastAssets.map((asset) => (
                  <tr key={asset.id} className="border-b border-[#f3f4f6] hover:bg-[#f8fafc] transition-all">
                    <td className="py-4 font-semibold text-[#111827]">{asset.name}</td>
                    <td className="py-4 text-[#6b7280]">{asset.dateFrom}</td>
                    <td className="py-4 text-[#6b7280]">{asset.dateTo}</td>
                    <td className="py-4">
                      <span className="inline-flex items-center rounded-full bg-[#f3f4f6] px-3 py-1 text-[12px] font-semibold text-[#111827]">
                        {asset.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <RaiseAssetRequestModal
        isOpen={isModalOpen}
        onClose={closeModal}
        initialType={modalInitialType}
      />
    </DashboardLayout>
  )
}

export default Assets
