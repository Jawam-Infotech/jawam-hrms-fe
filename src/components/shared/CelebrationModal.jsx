import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

function CelebrationModal({
  isOpen,
  celebrationType,
  employeeName,
  completedYears,
  onClose,
}) {
  const dialogRef = useRef(null)
  const closeButtonRef = useRef(null)
  const previouslyFocusedRef = useRef(null)
  const wasOpenRef = useRef(false)

  useEffect(() => {
    const restoreFocus = () => {
      if (!wasOpenRef.current) return
      const previouslyFocused = previouslyFocusedRef.current
      if (previouslyFocused && document.contains(previouslyFocused) && typeof previouslyFocused.focus === 'function') {
        previouslyFocused.focus({ preventScroll: true })
      }
      previouslyFocusedRef.current = null
      wasOpenRef.current = false
    }

    if (!isOpen) {
      restoreFocus()
      return undefined
    }

    if (!wasOpenRef.current) {
      previouslyFocusedRef.current = document.activeElement
    }
    wasOpenRef.current = true
    closeButtonRef.current?.focus({ preventScroll: true })

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.()
      if (event.key !== 'Tab') return

      const focusableElements = dialogRef.current?.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (!focusableElements?.length) return

      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]
      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement.focus()
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault()
        firstElement.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    const dialogElement = dialogRef.current
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      if (!dialogElement?.isConnected) restoreFocus()
    }
  }, [isOpen, celebrationType, onClose])

  if (!isOpen) return null

  const isAnniversary = String(celebrationType || '').toUpperCase() === 'WORK_ANNIVERSARY'
  const displayName = employeeName || 'Team member'
  const years = Number(completedYears)
  const hasCompletedYears = Number.isFinite(years) && years >= 1
  const title = isAnniversary ? 'Happy Work Anniversary!' : 'Happy Birthday!'
  const message = isAnniversary
    ? 'Thank you for your dedication and valuable contributions to Jawam Infotech.'
    : 'Wishing you a wonderful birthday filled with happiness and success. Thank you for being a valued part of Jawam Infotech.'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#091D3E]/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="celebration-modal-title"
      aria-describedby="celebration-modal-message"
    >
      <div ref={dialogRef} className="relative w-full max-w-md rounded-3xl border border-[#B1E2F4] bg-[#F8FAFC] p-6 text-center shadow-2xl sm:p-8">
        <button
          ref={closeButtonRef}
          type="button"
          onClick={onClose}
          aria-label="Close celebration"
          className="absolute right-4 top-4 rounded-full p-2 text-[#091D3E] hover:bg-[#B1E2F4]/50 focus:outline-none focus:ring-2 focus:ring-[#04A3DA]"
        >
          <X size={20} />
        </button>

        <div aria-hidden="true" className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#B1E2F4] text-2xl">
          {isAnniversary ? '⭐' : '🎉'}
        </div>
        <h2 id="celebration-modal-title" className="text-2xl font-black text-[#091D3E]">
          {title}
        </h2>
        <p className="mt-3 text-lg font-bold text-[#04A3DA]">{displayName}</p>
        {isAnniversary && hasCompletedYears && (
          <p className="mt-3 font-semibold text-[#091D3E]">
            Congratulations on completing {years} years with us!
          </p>
        )}
        <p id="celebration-modal-message" className="mt-3 text-sm leading-6 text-[#475569]">
          {message}
        </p>
      </div>
    </div>
  )
}

export default CelebrationModal
