import { useState } from 'react'

function InventoryRequestModal({
  isOpen,
  onClose,
  assetTypes,
  onSubmit,
  submitting,
  error,
}) {
  const [assetType, setAssetType] = useState('')
  const [quantity, setQuantity] = useState('')
  const [reason, setReason] = useState('')
  const [quantityError, setQuantityError] = useState('')
  const [reasonError, setReasonError] = useState('')

  if (!isOpen) return null

  const handleSubmit = (event) => {
  event.preventDefault()

  let hasError = false

  if (!assetType) {
    hasError = true
  }

  const numericQuantity = Number(quantity)

  if (
    !quantity ||
    !Number.isInteger(numericQuantity) ||
    numericQuantity < 1
  ) {
    setQuantityError(
      'Quantity must be a whole number greater than 0.',
    )
    hasError = true
  } else {
    setQuantityError('')
  }

  if (!reason.trim()) {
    setReasonError('Reason is required.')
    hasError = true
  } else {
    setReasonError('')
  }

  if (hasError) {
    return
  }

  onSubmit({
    asset_type: Number(assetType),
    quantity: numericQuantity,
    reason: reason.trim(),
  })
}

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#111827]">
              Request New Asset
            </h2>
            <p className="mt-1 text-sm text-[#6b7280]">
              Request assets for organizational inventory.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl text-[#6b7280] transition hover:text-[#111827]"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#111827]">
              Asset Type
            </label>

            <select
              value={assetType}
              onChange={(event) => setAssetType(event.target.value)}
              required
              className="w-full rounded-xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm outline-none focus:border-[#3b82f6]"
            >
              <option value="">Select asset type</option>

              {assetTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#111827]">
              Quantity
            </label>

            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(event) => {
  const value = event.target.value

  setQuantity(value)

  if (!value) {
    setQuantityError('')
    return
  }

  const numericValue = Number(value)

  if (!Number.isInteger(numericValue) || numericValue < 1) {
    setQuantityError('Quantity must be a whole number greater than 0.')
  } else {
    setQuantityError('')
  }
}}
              required
              placeholder="Enter quantity"
              className="w-full rounded-xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm outline-none focus:border-[#3b82f6]"
            />
            {quantityError && (
  <p className="mt-2 text-sm font-medium text-red-600">
    {quantityError}
  </p>
)}
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#111827]">
              Reason
            </label>

            <textarea
              value={reason}
onChange={(event) => {
  const value = event.target.value

  setReason(value)

  if (!value.trim()) {
    setReasonError('')
    return
  }

  setReasonError('')
}}              required
              rows={4}
              placeholder="Why are these assets required?"
              className="w-full resize-none rounded-xl border border-[#e5e7eb] bg-white px-4 py-3 text-sm outline-none focus:border-[#3b82f6]"
            />
            {reasonError && (
  <p className="mt-2 text-sm font-medium text-red-600">
    {reasonError}
  </p>
)}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="rounded-full bg-[#f3f4f6] px-6 py-3 text-sm font-bold text-[#111827] transition hover:bg-[#e5e7eb]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting || assetTypes.length === 0}
              className="rounded-full bg-[#3b82f6] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#2563eb] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default InventoryRequestModal