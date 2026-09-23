import { useEffect } from 'react'
import LostAssetAttachment from './request-details/LostAssetAttachment'

function MyAssetRequestDetailsModal({
  isOpen,
  request,
  onClose,
}) {
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, onClose])

  if (!isOpen || !request) return null

  const status = String(request.status || 'PENDING').toUpperCase()

  const requestType =
    request.request_type_display ||
    request.request_type ||
    '—'

  const getStatusClass = () => {
    switch (status) {
      case 'APPROVED':
        return 'bg-[#ccfbf1] text-[#0d9488]'

      case 'PROCESSING':
        return 'bg-[#dbeafe] text-[#2563eb]'

      case 'COMPLETED':
        return 'bg-[#dcfce7] text-[#16a34a]'

      case 'REJECTED':
        return 'bg-[#fee2e2] text-[#dc2626]'

      default:
        return 'bg-[#fef3c7] text-[#d97706]'
    }
  }

  const formatDate = (date) => {
    if (!date) return '—'

    return new Date(date).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="fixed inset-0 z-[9999] flex h-full w-full items-center justify-center overflow-hidden bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[24px] bg-white p-8 shadow-lg">

        {/* Header */}
        <div className="mb-6 flex items-start justify-between border-b border-[#e5e7eb] pb-5">
          <div>
            <h2 className="text-[24px] font-black text-[#111827]">
              Request Details
            </h2>

            <p className="mt-1 text-[13px] font-medium text-[#6b7280]">
              View your asset request information
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`rounded-full px-4 py-2 text-[12px] font-bold ${getStatusClass()}`}
            >
              {status}
            </span>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close request details"
              className="flex h-9 w-9 items-center justify-center rounded-full text-[#6b7280] transition hover:bg-[#f3f4f6] hover:text-[#111827]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 6l12 12M18 6L6 18"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Request Information */}
        <div className="space-y-6">

          <section>
            <h3 className="mb-4 text-[12px] font-extrabold uppercase tracking-wide text-[#6b7280]">
              Request Information
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

              <div className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-4">
                <p className="text-[12px] font-bold text-[#6b7280]">
                  Request ID
                </p>

                <p className="mt-1 text-[14px] font-bold text-[#111827]">
                  #{request.id ?? '—'}
                </p>
              </div>

              <div className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-4">
                <p className="text-[12px] font-bold text-[#6b7280]">
                  Asset Type
                </p>

                <p className="mt-1 text-[14px] font-bold text-[#111827]">
                  {request.asset_type_name || '—'}
                </p>
              </div>

              <div className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-4">
                <p className="text-[12px] font-bold text-[#6b7280]">
                  Request Type
                </p>

                <p className="mt-1 text-[14px] font-bold text-[#111827]">
                  {requestType}
                </p>
              </div>

              <div className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-4">
                <p className="text-[12px] font-bold text-[#6b7280]">
                  Requested At
                </p>

                <p className="mt-1 text-[14px] font-bold text-[#111827]">
                  {formatDate(request.created_at)}
                </p>
              </div>

            </div>
          </section>

          {/* Reason */}
          <section className="border-t border-[#e5e7eb] pt-5">
            <h3 className="mb-3 text-[12px] font-extrabold uppercase tracking-wide text-[#6b7280]">
              Reason
            </h3>

            <div className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-4">
              <p className="text-[14px] font-medium text-[#374151]">
                {request.reason || 'No reason provided.'}
              </p>
            </div>
          </section>

          {/* Review Information */}
          {(status === 'APPROVED' ||
            status === 'PROCESSING' ||
            status === 'COMPLETED' ||
            status === 'REJECTED') && (
            <section className="border-t border-[#e5e7eb] pt-5">
              <h3 className="mb-4 text-[12px] font-extrabold uppercase tracking-wide text-[#6b7280]">
                Review Information
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-4">
                  <p className="text-[12px] font-bold text-[#6b7280]">
                    Reviewed By
                  </p>

                  <p className="mt-1 text-[14px] font-bold text-[#111827]">
                    {request.reviewed_by_name || '—'}
                  </p>
                </div>

                <div className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-4">
                  <p className="text-[12px] font-bold text-[#6b7280]">
                    Reviewed At
                  </p>

                  <p className="mt-1 text-[14px] font-bold text-[#111827]">
                    {formatDate(request.reviewed_at)}
                  </p>
                </div>

              </div>

              <div className="mt-4">
                <p className="mb-2 text-[12px] font-bold text-[#6b7280]">
                  Review Note
                </p>

                <div className="rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3">
                  <p className="text-[14px] font-medium text-[#374151]">
                    {request.review_note ||
                      'No review note provided.'}
                  </p>
                </div>
              </div>
            </section>
          )}

        </div>
                  {String(request.request_type || '').toUpperCase() ===
  'REPORT_LOST' && (
  <section className="border-t border-[#e5e7eb] pt-5">
    <LostAssetAttachment request={request} />
  </section>
)}

        

      </div>
    </div>
  )
}

export default MyAssetRequestDetailsModal