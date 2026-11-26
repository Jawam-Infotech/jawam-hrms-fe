import { useEffect, useRef } from 'react'
import AnnouncementCard from '../../shared/AnnouncementCard.jsx'

function AnnouncementListModal({ isOpen, announcements, loading, error, onRetry, onClose }) {
  const closeRef = useRef(null)
  const previousFocusRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return undefined
    previousFocusRef.current = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()
    const handleKeyDown = (event) => { if (event.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      if (previousFocusRef.current?.isConnected) previousFocusRef.current.focus()
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-labelledby="announcement-list-title">
    <div className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-[24px] bg-white shadow-xl">
      <div className="flex shrink-0 items-center justify-between border-b border-[#e5e7eb] p-6">
        <h2 id="announcement-list-title" className="text-2xl font-black text-[#091D3E]">All Announcements</h2>
        <button ref={closeRef} type="button" onClick={onClose} aria-label="Close announcements" className="rounded-full p-2 text-2xl text-[#6b7280] hover:bg-[#f3f4f6]">×</button>
      </div>
      <div className="min-h-0 overflow-y-auto p-6">
        <AnnouncementCard announcements={announcements} loading={loading} error={error} onRetry={onRetry} showViewAll={false} showHeading={false} />
    </div>
    </div>
  </div>
}

export default AnnouncementListModal
