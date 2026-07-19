import { useState, useContext } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { UserContext } from '../context/UserContext'
import { NAV_CONFIG } from '../config/navigation'

function DashboardLayout({ children }) {
  const { user, logout } = useContext(UserContext)
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [profileOpen, setProfileOpen] = useState(false)

  const menuItems = NAV_CONFIG[user.role] || []
  const location = useLocation()

  // Sidebar width/transform behavior:
  // - Desktop: expanded = 240px, collapsed = 80px (icons only)
  // - Small screens (<=760px): collapsed => fully hidden (-translate-x-full)
  const sidebarWidthClass = sidebarOpen
    ? 'w-[240px] max-[1220px]:w-[220px] max-[760px]:w-[200px] translate-x-0'
    : 'w-20 translate-x-0 max-[760px]:-translate-x-full'

  const handleLogout = () => {
    logout()
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
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`w-full flex items-center gap-3 ${sidebarOpen ? 'px-4 justify-start' : 'px-0 justify-center'} py-3 rounded-lg text-left text-[16px] font-semibold transition-all duration-200 ${
                    isActive ? 'bg-[#eef6ff] text-[#1e40af] shadow-sm' : 'hover:bg-[#f5fbf8]'
                  }`}
                >
                  <span className="text-xl w-6 flex-shrink-0 text-center">{item.icon}</span>
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
            <button className="p-2 hover:bg-[#f5fbf8] rounded-lg transition-all text-[20px]">🔔</button>

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
                  <button onClick={() => { setProfileOpen(false); navigate('/profile') }} className="w-full text-left px-4 py-2 hover:bg-[#f5fbf8]">My Profile</button>
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
      </main>
    </div>
  )
}

export default DashboardLayout
