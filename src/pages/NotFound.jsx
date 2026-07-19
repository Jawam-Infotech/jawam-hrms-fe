import { useNavigate } from 'react-router-dom'

function NotFound() {
  const navigate = useNavigate()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f5fbf8] px-6 text-center text-[#020617]">
      <p className="text-[80px] font-black leading-none text-[#3a7be0]">404</p>
      <h1 className="text-[28px] font-extrabold">Page not found</h1>
      <p className="max-w-[440px] text-[16px] text-[#5f6679]">
        The page you're looking for doesn't exist or hasn't been built yet.
      </p>
      <button
        onClick={() => navigate('/')}
        className="mt-2 h-11 cursor-pointer rounded-3xl border-0 bg-[#3d83f2] px-8 text-[16px] font-extrabold text-white transition hover:bg-[#2f74e3]"
      >
        Go Home
      </button>
    </main>
  )
}

export default NotFound
