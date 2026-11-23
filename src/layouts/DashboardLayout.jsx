import { useState, useContext, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { UserContext } from '../context/UserContext'
import { NAV_CONFIG } from '../config/navigation'
import useNotifications from '../hooks/useNotifications.js'
import NotificationDropdown from '../components/notifications/NotificationDropdown.jsx'
import {
  NOTIF_POPUP_EVENT,
  NOTIF_STORAGE_KEY,
  NOTIF_BC_CHANNEL,
  isNotificationTargetingUser,
} from '../utils/projectNotificationService.js'
//import { UserContext } from '../context/UserContext.jsx'

function DashboardLayout({ children }) {
  const { user, logout } = useContext(UserContext)
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [activeToast, setActiveToast] = useState(null)

const {
  notifications,
  unreadCount,
  loading: notificationsLoading,
  error: notificationsError,
  isMarkingAllRead,
  markAsRead,
  markAllAsRead,
  removeNotification,
  deletingNotificationId,
  clearAll,
  isClearingAll,
} = useNotifications()

  // Listen for real-time notification popups targeted to the active user
  useEffect(() => {
    let timer = null

    const triggerPopupForUser = (notif) => {
      if (!notif) return
      // Only pop up if targeted to this logged-in user
      if (!isNotificationTargetingUser(notif, user)) return

      setActiveToast(notif)
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        setActiveToast(null)
      }, 7000)
    }

    const handleWindowPopup = (event) => {
      triggerPopupForUser(event.detail)
    }

    let bc = null
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        bc = new BroadcastChannel(NOTIF_BC_CHANNEL)
        bc.onmessage = (event) => {
          triggerPopupForUser(event.data)
        }
      }
    } catch (e) {
      console.error(e)
    }

    // On mount or user change: check for any recent unread task assignment targeted to this user that hasn't popped up yet in this browser session
    try {
      const raw = localStorage.getItem(NOTIF_STORAGE_KEY)
      if (raw) {
        const stored = JSON.parse(raw)
        const unreadTaskNotif = stored.find(
          (n) =>
            !n.is_read &&
            isNotificationTargetingUser(n, user) &&
            (n.title?.includes('Task Assigned') || n.title?.includes('New Task')) &&
            !sessionStorage.getItem(`jawam_shown_toast_${n.id}`)
        )
        if (unreadTaskNotif) {
          sessionStorage.setItem(`jawam_shown_toast_${unreadTaskNotif.id}`, 'true')
          triggerPopupForUser(unreadTaskNotif)
        }
      }
    } catch (e) {
      console.error(e)
    }

    window.addEventListener(NOTIF_POPUP_EVENT, handleWindowPopup)
    return () => {
      if (bc) bc.close()
      window.removeEventListener(NOTIF_POPUP_EVENT, handleWindowPopup)
      if (timer) clearTimeout(timer)
    }
  }, [user])

  const menuItems = NAV_CONFIG[user.role] || []
  const location = useLocation()

  // Sidebar width/transform behavior:
  // - Desktop: expanded = 240px, collapsed = 80px (icons only)
  // - Small screens (<=760px): collapsed => fully hidden (-translate-x-full)
  const sidebarWidthClass = sidebarOpen
    ? 'w-[240px] max-[1220px]:w-[220px] max-[760px]:w-[200px] translate-x-0'
    : 'w-20 translate-x-0 max-[760px]:-translate-x-full'

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen bg-[#f5fbf8]">
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-white border-r border-slate-200 shadow-[4px_0_20px_rgba(15,23,42,0.04)] transition-all duration-300 z-40 ${
          sidebarWidthClass
        }`}
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <div className="mb-8 flex items-center gap-2">
            <img
              src="/images/logo-placeholder.png"
              alt="JAWAM HR"
              className={`${sidebarOpen ? 'w-[120px]' : 'w-8 h-8'} object-contain transition-all duration-200`}
            />
          </div>

          {/* Menu Items */}
          <nav className="flex-1 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path)
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full flex items-center gap-3 ${sidebarOpen ? 'px-4 justify-start' : 'px-0 justify-center'} py-3 rounded-lg text-left text-[16px] font-semibold transition-all duration-200 ${
                    isActive ? 'bg-[#eef6ff] text-[#1e40af] shadow-sm' : 'hover:bg-[#f5fbf8]'
                  }`}
                >
                  <span className="text-xl w-6 flex-shrink-0 text-center">
                    {typeof Icon === 'function' ? <Icon /> : Icon}
                  </span>
                  {sidebarOpen && <span className="text-[#111827]">{item.label}</span>}
                </button>
              )
            })}
          </nav>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 ${sidebarOpen ? 'px-4 justify-start' : 'px-0 justify-center'} py-3 rounded-lg text-[#ef4444] font-semibold text-[16px] hover:bg-[#fee2e2] transition-all duration-200`}
          >
            <span>🚪</span>
            {sidebarOpen && <span>Log Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-[240px]' : 'ml-20'} max-[1220px]:ml-[220px] max-[760px]:ml-0`}>
        {/* Top Bar */}
        <div className="sticky top-0 z-30 bg-white border-b border-[#e5e5e5] px-8 py-4 flex items-center justify-between max-[760px]:px-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-3 hover:bg-[#f5fbf8] rounded-xl transition-all text-[22px]"
            >
              ☰
            </button>
            <div className="relative hidden md:block">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-[#9ca3af]">🔍</span>
              <input
                type="text"
                placeholder="Search..."
                className="h-10 w-72 rounded-full border border-[#e5e7eb] bg-[#f8fafc] pl-10 pr-4 text-[14px] text-[#111827] outline-none transition-all duration-200 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#bfdbfe]/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Date */}
            <div className="text-[14px] font-semibold text-[#5f6679]">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>

            {/* Notifications */}
<div className="relative">
  <button
    type="button"
    onClick={() =>
      setNotificationsOpen((current) => !current)
    }
    className="relative rounded-lg p-2 text-[20px] transition-all hover:bg-[#f5fbf8]"
    aria-label="Notifications"
    aria-expanded={notificationsOpen}
  >
    🔔

    {unreadCount > 0 && (
      <span className="absolute -right-1 -top-1 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#ef4444] px-1 text-[10px] font-bold text-white">
        {unreadCount > 99 ? '99+' : unreadCount}
      </span>
    )}
  </button>

  {notificationsOpen && (
    <NotificationDropdown
      notifications={notifications}
      loading={notificationsLoading}
      error={notificationsError}
      unreadCount={unreadCount}
      onMarkAsRead={markAsRead}
      onMarkAllAsRead={markAllAsRead}
      onDelete={removeNotification}
      deletingNotificationId={deletingNotificationId}
      onClearAll={clearAll}
      isClearingAll={isClearingAll}
      isMarkingAllRead={isMarkingAllRead}
      onClose={() => setNotificationsOpen(false)}
    />
  )}
</div>

            {/* User Profile (click to open menu) */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen((s) => !s)}
                className="flex items-center gap-2 pl-4 border-l border-[#e5e5e5] bg-transparent p-2 rounded-md hover:bg-[#f5fbf8]"
                aria-expanded={profileOpen}
              >
                <div className="text-right">
                  <div className="text-[14px] font-semibold text-[#111827]">{user.name}</div>
                  <div className="text-[12px] text-[#5f6679]">{user.role?.toUpperCase()}</div>
                </div>
                <div className="w-8 h-8 rounded-full bg-[#3a7be0] text-white flex items-center justify-center font-bold">
                  {user.name?.charAt(0) || 'U'}
                </div>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-[#e5e5e5] z-50">
                  <button onClick={() => { setProfileOpen(false); navigate('/profile') }} className="w-full text-left px-4 py-2 hover:bg-[#f5fbf8]">Profile</button>
                  <button onClick={() => { setProfileOpen(false); navigate('/settings') }} className="w-full text-left px-4 py-2 hover:bg-[#f5fbf8]">Settings</button>
                  <button onClick={() => { setProfileOpen(false); navigate('/helpdesk') }} className="w-full text-left px-4 py-2 hover:bg-[#f5fbf8]">Helpdesk</button>
                  <div className="border-t border-[#f1f1f1]" />
                  <button onClick={() => { setProfileOpen(false); handleLogout() }} className="w-full text-left px-4 py-2 text-[#ef4444] hover:bg-[#fff1f1]">Log Out</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="p-8 max-[760px]:p-4">{children}</div>

        {/* Real-time Activity Notification Toast Popup */}
        {activeToast && (
          <div
            onClick={() => {
              if (activeToast.link) navigate(activeToast.link)
              setActiveToast(null)
            }}
            className="fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl bg-white p-4 shadow-2xl border border-blue-200 cursor-pointer hover:shadow-blue-100 transition animate-in slide-in-from-bottom-5 duration-200"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-lg flex-shrink-0">
                {activeToast.type === 'success' ? '✅' : activeToast.type === 'warning' ? '⚠️' : activeToast.type === 'error' ? '❌' : '🔔'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                    {activeToast.title || 'Activity Alert'}
                  </p>
                  {activeToast.targetRole && activeToast.targetRole !== 'ALL' && (
                    <span className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 border border-blue-200">
                      Target: {activeToast.targetRole}
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs font-semibold text-gray-900 leading-snug">
                  {activeToast.message}
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveToast(null)
                }}
                className="text-gray-400 hover:text-gray-600 rounded-full p-1 transition"
                title="Dismiss"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default DashboardLayout
