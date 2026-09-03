import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

function formatNotificationTime(value) {
  if (!value) return ''

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ''
  }

  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function NotificationDropdown({
  notifications,
  loading,
  error,
  unreadCount,
  onMarkAsRead,
  onMarkAllAsRead,
  isMarkingAllRead,
  onClose,
  onDelete,
  deletingNotificationId,
  onClearAll,
  isClearingAll,
}) {
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [onClose])

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-12 z-50 w-[380px] overflow-hidden rounded-2xl border border-[#e5e7eb] bg-white shadow-xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#e5e7eb] px-4 py-3">
        <div>
          <h3 className="text-[16px] font-extrabold text-[#111827]">
            Notifications
          </h3>

          {unreadCount > 0 && (
            <p className="text-[12px] text-[#6b7280]">
              {unreadCount} unread
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={onMarkAllAsRead}
              disabled={isMarkingAllRead}
              className="text-[12px] font-bold text-[#3b82f6] hover:underline disabled:opacity-50"
            >
              {isMarkingAllRead ? 'Marking...' : 'Mark all as read'}
            </button>
          )}
          {notifications.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              disabled={isClearingAll}
              className="text-[12px] font-bold text-[#3b82f6] hover:underline disabled:opacity-50"
            >
              {isClearingAll ? 'Clearing...' : 'Clear All'}
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="max-h-[420px] overflow-y-auto">
        {loading && (
          <div className="space-y-3 p-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse space-y-2 rounded-xl bg-[#f8fafc] p-4"
              >
                <div className="h-4 w-3/4 rounded bg-gray-200" />
                <div className="h-3 w-full rounded bg-gray-100" />
                <div className="h-3 w-1/3 rounded bg-gray-100" />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="p-6 text-center text-[14px] text-red-600">
            Failed to load notifications.
          </div>
        )}

        {!loading && !error && notifications.length === 0 && (
          <div className="p-8 text-center">
            <div className="mb-2 text-[28px]">🔔</div>

            <p className="text-[14px] font-semibold text-[#374151]">
              No notifications
            </p>

            <p className="mt-1 text-[12px] text-[#9ca3af]">
              You're all caught up.
            </p>
          </div>
        )}

        {!loading &&
          !error &&
          notifications.map((notification) => (
            <div
              role="button"
              tabIndex={0}
              key={notification.id}
              onClick={() => {
                if (!notification.is_read) {
                  onMarkAsRead(notification.id)
                }
              }}
              className={`w-full border-b border-[#f1f5f9] px-4 py-4 text-left transition-colors hover:bg-[#f8fafc] ${
                notification.is_read ? 'bg-white' : 'bg-[#eff6ff]'
              }`}
            >
              <div className="flex gap-3">
                <span
                  className={`mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full ${
                    notification.is_read
                      ? 'bg-transparent'
                      : 'bg-[#3b82f6]'
                  }`}
                />

                <div className="min-w-0 flex-1">
                  <p
                    className={`text-[14px] leading-5 ${
                      notification.is_read
                        ? 'font-medium text-[#374151]'
                        : 'font-bold text-[#111827]'
                    }`}
                  >
                    {notification.message ||
                      'You have a new notification.'}
                  </p>

                  <p className="mt-1 text-[11px] text-[#9ca3af]">
                    {formatNotificationTime(notification.created_at)}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={deletingNotificationId === notification.id}
                  aria-label="Delete notification"
                  title="Delete notification"
                  onClick={(event) => {
                    event.stopPropagation()
                    if (deletingNotificationId !== notification.id) onDelete(notification.id)
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      event.stopPropagation()
                      if (deletingNotificationId !== notification.id) onDelete(notification.id)
                    }
                  }}
                  className="rounded-full p-1 text-[#9ca3af] hover:bg-[#fee2e2] hover:text-[#dc2626] focus:outline-none focus:ring-2 focus:ring-[#93c5fd]"
                >
                  <X size={15} />
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default NotificationDropdown
