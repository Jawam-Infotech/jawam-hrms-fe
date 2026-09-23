import {
  useEffect,
  useState,
} from 'react'

import {
  fetchAssetRequestAttachments,
} from '../../../services/assetService'

function LostAssetAttachment({ request }) {
  const [attachments, setAttachments] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadAttachments = async () => {
      if (!request?.id) return

      try {
        setLoading(true)

        const response =
          await fetchAssetRequestAttachments(
            request.id,
          )

        setAttachments(
          Array.isArray(response)
            ? response
            : response?.results || [],
        )
      } catch (error) {
        console.error(
          'Failed to load attachments:',
          error,
        )
      } finally {
        setLoading(false)
      }
    }

    loadAttachments()
  }, [request?.id])

  return (
    <div>
      <h3 className="mb-3 text-[16px] font-bold text-[#111827]">
        Attachment
      </h3>

      {loading && (
        <p className="text-[12px] font-medium text-[#6b7280]">
          Loading attachment...
        </p>
      )}

      {!loading &&
        attachments.map((attachment) => (
          <div
            key={attachment.id}
            className="mb-2 flex items-center justify-between rounded-[14px] border border-[#e5e7eb] bg-[#f9fafb] px-4 py-4"
          >
            <div className="flex items-center gap-3">
              <span className="text-[20px]">
                📎
              </span>

              <div>
                <p className="text-[14px] font-bold text-[#111827]">
                  {attachment.original_filename}
                </p>

                <p className="mt-1 text-[12px] font-medium text-[#6b7280]">
                  Supporting document
                  {attachment.file_size
                    ? ` • ${(attachment.file_size / 1024 / 1024).toFixed(2)} MB`
                    : ''}
                </p>
              </div>
            </div>

            {attachment.download_url && (
              <button
                type="button"
                onClick={() =>
                  window.open(
                    attachment.download_url,
                    '_blank',
                    'noopener,noreferrer',
                  )
                }
                className="text-[13px] font-bold text-[#2563eb] hover:underline"
              >
                View
              </button>
            )}
          </div>
        ))}

      {!loading && attachments.length === 0 && (
        <p className="text-[12px] font-medium text-[#6b7280]">
          No attachment available.
        </p>
      )}
    </div>
  )
}

export default LostAssetAttachment