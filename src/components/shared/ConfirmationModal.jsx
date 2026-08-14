function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
  loadingText = 'Checking Out...',
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <h2 className="text-2xl font-black text-[#111827]">
          {title}
        </h2>

        <p className="mt-3 text-[15px] leading-7 text-[#5f6679]">
          {message}
        </p>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-full border border-[#d1d5db] px-6 py-2 font-bold hover:bg-gray-50"
          >
            {cancelText}
          </button>

          <button
          onClick={onConfirm}
          disabled={loading}
          className="rounded-full bg-[#ef4444] px-6 py-2 font-bold text-white hover:bg-[#dc2626]"
        >
          {loading ? loadingText : confirmText}
        </button>
      </div>
    </div>
    </div>
  )
}

export default ConfirmationModal
