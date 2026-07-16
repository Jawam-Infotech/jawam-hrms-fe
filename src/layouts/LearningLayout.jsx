import { useNavigate, useLocation } from 'react-router-dom'

export default function LearningLayout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()

  const menu = [
    { id: 'overview', label: 'Overview', icon: '🏠', path: '/learning' },
    { id: 'my-learning', label: 'My Learning', icon: '📚', path: '/learning/my-learning' },
    { id: 'library', label: 'Training Library', icon: '📖', path: '/learning/library' },
    { id: 'ai', label: 'AI Interviews', icon: '🤖', path: '/learning/ai-interviews' },
    { id: 'calendar', label: 'Calendar', icon: '🗓️', path: '/learning/calendar' },
    { id: 'report', label: 'Report', icon: '📈', path: '/learning/report' },
  ]

  return (
    <div className="flex min-h-screen bg-[#f3f4f6]">
      <aside className="fixed top-0 left-0 h-screen w-64 flex flex-col bg-white border-r border-slate-200 p-5">
        <div className="mb-8">
          <img src="/images/logo-placeholder.png" alt="logo" className="w-28" />
        </div>

        <nav className="flex-1 space-y-2">
          {menu.map((m) => {
            const isActive = m.path === '/learning'
              ? location.pathname === '/learning'
              : location.pathname.startsWith(m.path)

            return (
              <button
                key={m.id}
                onClick={() => navigate(m.path)}
                className={`w-full flex items-center gap-3 py-2 rounded-md text-left transition-all duration-200 ${
                  isActive ? 'bg-[#eef6ff] text-[#1e40af]' : 'text-[#111827] hover:bg-[#f8fafc]'
                }`}
              >
                <span className="text-lg">{m.icon}</span>
                <span className="font-semibold">{m.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="mt-4">
          <button onClick={() => navigate('/dashboard')} className="w-full flex items-center gap-3 py-3 rounded-md text-[#ef4444] hover:bg-[#fff1f1]">
            <span>⬅️</span>
            <span>Back to Jawam HR</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 min-h-screen ml-64">
        <div className="sticky top-0 z-30 bg-white border-b border-[#e5e5e5] px-8 py-4 flex items-center justify-between max-[760px]:px-4 mb-6">
          <div className="flex items-center gap-4"> 
            <button className="p-3 hover:bg-[#f5fbf8] rounded-xl transition-all text-[22px]">
              ☰
            </button>
            <div>
              <div className="font-semibold text-sm text-[#5f6679]">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="p-2 hover:bg-[#f5f7fb] rounded-lg transition-all text-[20px]">🔔</button>
            <div className="flex items-center gap-3 pl-4 border-l border-[#e5e5e5]">
              <div className="text-right">
                <div className="font-semibold">Gaurav P</div>
                <div className="text-[12px] text-[#5f6679]">UI/UX Designer</div>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#3a7be0] text-white flex items-center justify-center font-bold">G</div>
            </div>
          </div>
        </div>

        <div className="p-8">{children}</div>
      </main>
    </div>
  )
}
