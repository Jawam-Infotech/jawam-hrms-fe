import { useState } from 'react'

const REQUEST_TYPES = [
  'Request Asset',
  'Report Lost Asset',
  'Return Asset',
  'Replace Asset',
]

const REQUEST_TYPE_API_VALUES = {
  'Request Asset': 'REQUEST_ASSET',
  'Report Lost Asset': 'REPORT_LOST',
  'Return Asset': 'RETURN_ASSET',
  'Replace Asset': 'REPLACE_ASSET',
}

const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024

const ALLOWED_ATTACHMENT_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
]

function getInitialForm(
  initialType = null,
  initialAsset = null,
) {
  return {
    requestType: initialType || '',
    assetName:
      initialAsset?.asset_type_name ||
      initialAsset?.name ||
      '',
    assetId:
      initialAsset?.asset_tag ||
      initialAsset?.asset_id ||
      '',
    assetNumericId:
      initialAsset?.id || '',
    reason: '',
    attachments: [],
  }
}

function AssetRequestModal({
  isOpen,
  onClose,
  initialType = null,
  initialAsset = null,
  assignedAssets = [],
  assetTypes = [],
  onSubmit,
  submitting = false,
  requestError = '',
}) {
  const [form, setForm] = useState(
    getInitialForm(initialType, initialAsset),
  )

  const [attachmentError, setAttachmentError] =
    useState('')


  const {
    requestType,
    assetName,
    reason,
    attachments,
    assetId,
  } = form

  const handleChange = (
    field,
    value,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))
  }

  const handleRequestTypeChange = (
    value,
  ) => {
    setForm((current) => ({
      ...current,
      requestType: value,
      assetName: '',
      assetId: '',
      assetNumericId: '',
      attachments:
        value === 'Report Lost Asset'
          ? current.attachments
          : [],
    }))

    setAttachmentError('')
  }

  const handleAssetChange = (
    value,
  ) => {
    /*
     * =========================
     * REQUEST ASSET
     * =========================
     */

    if (
      requestType === 'Request Asset'
    ) {
      const selectedType =
        assetTypes.find(
          (type) =>
            String(type.id) ===
            String(value),
        )

      setForm((current) => ({
        ...current,
        assetName:
          selectedType?.name || '',
        assetId: value,
        assetNumericId: value,
      }))

      return
    }

    /*
     * =========================
     * ASSIGNED ASSET
     * =========================
     */

    const selectedAsset =
      assignedAssets.find(
        (asset) =>
          String(asset.id) ===
            String(value) ||
          String(asset.asset_tag) ===
            String(value) ||
          String(asset.asset_id) ===
            String(value),
      )

    setForm((current) => ({
      ...current,
      assetName:
        selectedAsset?.asset_type_name ||
        selectedAsset?.name ||
        selectedAsset?.asset_name ||
        '',
      assetId:
        selectedAsset?.asset_tag ||
        selectedAsset?.asset_id ||
        '',
      assetNumericId:
        selectedAsset?.id || '',
    }))
  }

  const handleFileChange = (
    event,
  ) => {
    const files = Array.from(
      event.target.files || [],
    )

    setAttachmentError('')

    if (!files.length) {
      return
    }

    setForm((current) => {
      const totalFiles =
        current.attachments.length +
        files.length

      if (totalFiles > 3) {
        setAttachmentError(
          'You can select a maximum of 3 files.',
        )

        return current
      }

      for (const file of files) {
        if (
          !ALLOWED_ATTACHMENT_TYPES.includes(
            file.type,
          )
        ) {
          setAttachmentError(
            'Invalid file type. Allowed: PDF, JPG, JPEG, PNG, WEBP, HEIC, HEIF.',
          )

          return current
        }

        if (
          file.size >
          MAX_ATTACHMENT_SIZE
        ) {
          setAttachmentError(
            'Each file must not exceed 10 MB.',
          )

          return current
        }
      }

      return {
        ...current,
        attachments: [
          ...current.attachments,
          ...files,
        ],
      }
    })

    /*
     * Reset the input so the user
     * can select another file later.
     */
    event.target.value = ''
  }
  const handleRemoveAttachment = (indexToRemove) => {
  setForm((current) => ({
    ...current,
    attachments: current.attachments.filter(
      (_, index) => index !== indexToRemove,
    ),
  }))

  setAttachmentError('')
}

  const handleSubmit = async () => {
    if (
      !requestType ||
      !assetName ||
      !reason.trim()
    ) {
      return
    }

    if (
      requestType ===
        'Report Lost Asset' &&
      attachments.length === 0
    ) {
      return
    }

    await onSubmit?.({
      requestType:
        REQUEST_TYPE_API_VALUES[
          requestType
        ],
      assetName,
      assetId: form.assetId,
      assetNumericId:
        form.assetNumericId,
      reason: reason.trim(),
      attachments,
    })
  }

  const handleCancel = () => {
    setForm(getInitialForm())
    setAttachmentError('')
    onClose()
  }

  const getModalTitle = () => {
    if (
      requestType ===
      'Request Asset'
    ) {
      return 'Raise New Asset Request'
    }

    if (
      requestType ===
      'Return Asset'
    ) {
      return 'Raise Asset Return Request'
    }

    return 'Raise Asset Request'
  }

  const getActionButtonLabel = () => {
    if (
      requestType ===
      'Request Asset'
    ) {
      return 'Request asset'
    }

    if (
      requestType ===
      'Report Lost Asset'
    ) {
      return 'Report asset'
    }

    if (
      requestType ===
      'Return Asset'
    ) {
      return 'Return asset'
    }

    if (
      requestType ===
      'Replace Asset'
    ) {
      return 'Replace asset'
    }

    return 'Submit'
  }

  const isSubmitDisabled =
    !requestType ||
    !assetName ||
    !reason.trim() ||
    (requestType ===
      'Report Lost Asset' &&
      attachments.length === 0) ||
    submitting

  if (!isOpen) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[24px] bg-white p-8 shadow-lg">

        <h2 className="mb-6 border-b border-[#e5e7eb] pb-4 text-[24px] font-black text-[#111827]">
          {getModalTitle()}
        </h2>

        {requestError && (
          <div className="rounded-[12px] border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-[14px] font-semibold text-[#dc2626]">
            {requestError}
          </div>
        )}

        <div className="space-y-6">

          {/* Request Type */}
          {!initialType && (
            <div>
              <label className="mb-3 block text-[14px] font-bold text-[#111827]">
                Request Type
              </label>

              <select
                value={requestType}
                onChange={(event) =>
                  handleRequestTypeChange(
                    event.target.value,
                  )
                }
                disabled={submitting}
                className="w-full rounded-[12px] border border-[#e5e7eb] bg-white px-4 py-3 text-[14px] font-semibold text-[#111827] outline-none transition-all focus:border-[#3b82f6] focus:ring-2 focus:ring-[#bfdbfe]/50"
              >
                <option value="">
                  Select Request type
                </option>

                {REQUEST_TYPES.map(
                  (type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type}
                    </option>
                  ),
                )}
              </select>
            </div>
          )}

          {/* Asset Name */}
          {requestType && (
            <div>
              <label className="mb-3 block text-[14px] font-bold text-[#111827]">
                Asset name
              </label>

              <select
                value={
                  requestType ===
                  'Request Asset'
                    ? form.assetId
                    : form.assetNumericId
                }
                onChange={(event) =>
                  handleAssetChange(
                    event.target.value,
                  )
                }
                disabled={
                  submitting ||
                  Boolean(initialAsset)
                }
                className="w-full rounded-[12px] border border-[#e5e7eb] bg-white px-4 py-3 text-[14px] font-semibold text-[#111827] outline-none transition-all focus:border-[#3b82f6] focus:ring-2 focus:ring-[#bfdbfe]/50"
              >
                <option value="">
                  Select asset from the list
                </option>

                {requestType ===
                'Request Asset'
                  ? assetTypes.map(
                      (type) => (
                        <option
                          key={type.id}
                          value={type.id}
                        >
                          {type.name}
                        </option>
                      ),
                    )
                  : assignedAssets.map(
                      (asset) => (
                        <option
                          key={asset.id}
                          value={asset.id}
                        >
                          {asset.asset_type_name ||
                            asset.name ||
                            asset.asset_name ||
                            'Unknown Asset'}
                          {' — '}
                          {asset.asset_tag ||
                            asset.asset_id ||
                            'No Asset ID'}
                        </option>
                      ),
                    )}
              </select>
            </div>
          )}

          {/* Asset ID */}
          {requestType &&
            requestType !==
              'Request Asset' &&
            form.assetId && (
              <div>
                <label className="mb-3 block text-[14px] font-bold text-[#111827]">
                  Asset ID
                </label>

                <div className="w-full rounded-[12px] border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3 text-[14px] font-semibold text-[#111827]">
                  {assetId}
                </div>
              </div>
            )}

          {/* Reason */}
          {requestType && (
            <div>
              <label className="mb-3 block text-[14px] font-bold text-[#111827]">
                Reason
              </label>

              <textarea
                value={reason}
                onChange={(event) =>
                  handleChange(
                    'reason',
                    event.target.value,
                  )
                }
                disabled={submitting}
                placeholder="Write reason ..."
                className="w-full rounded-[12px] border border-[#e5e7eb] bg-white px-4 py-3 text-[14px] text-[#111827] outline-none transition-all focus:border-[#3b82f6] focus:ring-2 focus:ring-[#bfdbfe]/50"
                rows={4}
              />
            </div>
          )}

          {/* Attachment */}
          {requestType ===
            'Report Lost Asset' && (
            <div>
              <label className="mb-3 block text-[14px] font-bold text-[#111827]">
                Attachment
              </label>

              {attachmentError && (
                <p className="mb-2 text-[12px] font-semibold text-[#dc2626]">
                  {attachmentError}
                </p>
              )}

              {/* Upload Box */}
              {attachments.length < 3 && (
                <label className="flex cursor-pointer items-center gap-3 rounded-[12px] border border-[#e5e7eb] bg-white px-4 py-3 transition-all hover:border-[#3b82f6]">
                  <span className="text-[20px]">
                    📎
                  </span>

                  <span className="text-[14px] font-semibold text-[#111827]">
                    Attach FIR / Supporting File
                  </span>

                  <input
                    type="file"
                    multiple
                    onChange={
                      handleFileChange
                    }
                    disabled={submitting}
                    className="hidden"
                  />
                </label>
              )}

              {/* Selected Files */}
              {attachments.length >
                0 && (
                <div className="mt-3 space-y-2">
                  {attachments.map(
                    (file, index) => (
                      <div
  key={`${file.name}-${index}`}
  className="flex items-center justify-between gap-3 rounded-[12px] border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3"
>
  <div className="flex min-w-0 items-center gap-3">
    <span className="text-[18px]">
      📄
    </span>

    <div className="min-w-0">
      <p className="truncate text-[13px] font-semibold text-[#111827]">
        {file.name}
      </p>

      <p className="mt-1 text-[11px] font-medium text-[#6b7280]">
        {(file.size / 1024 / 1024).toFixed(2)} MB
      </p>
    </div>
  </div>

  <button
    type="button"
    onClick={() =>
      handleRemoveAttachment(index)
    }
    disabled={submitting}
    className="shrink-0 text-[12px] font-bold text-[#dc2626] hover:underline disabled:cursor-not-allowed disabled:opacity-50"
  >
    Delete
  </button>
</div>
                    ),
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4">
          <button
            type="button"
            onClick={handleCancel}
            disabled={submitting}
            className="flex-1 rounded-full bg-[#fee2e2] px-6 py-3 text-[14px] font-bold text-[#dc2626] transition-all hover:bg-[#fecaca] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={
              isSubmitDisabled
            }
            className="flex-1 rounded-full bg-[#ccfbf1] px-6 py-3 text-[14px] font-bold text-[#0d9488] transition-all hover:bg-[#99f6e4] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting
              ? 'Submitting...'
              : getActionButtonLabel()}
          </button>
        </div>
      </div>
    </div>
  )
}

export default AssetRequestModal