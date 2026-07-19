import { useNavigate } from 'react-router-dom'
import LoginMarketingPanel, { LogoMark } from './components/LoginMarketingPanel'
import LoginForm from './components/LoginForm'

const roleToDashboard = {
  employee: '/dashboard',
  manager: '/dashboard/team-leader',
  hr: '/dashboard/hr',
  admin: '/dashboard/ceo',
}

function LoginPage() {
  const navigate = useNavigate()

  const handleLoginSuccess = (loggedInUser) => {
    navigate(roleToDashboard[loggedInUser.role] || '/dashboard')
  }

  return (
    <main className="flex min-h-screen flex-col bg-[#f5fbf8] text-[#020617] antialiased">
      <section
        className="mx-auto grid w-full max-w-[1440px] flex-1 grid-cols-[minmax(580px,1.2fr)_minmax(400px,0.8fr)] gap-8 items-center px-[16px] pt-11 pb-8 max-[1220px]:grid-cols-1 max-[1220px]:gap-6 max-[1220px]:p-7 max-[760px]:p-[18px] max-[620px]:p-3.5"
        aria-label="JAWAM HR login"
      >
        <LoginMarketingPanel />

        <section className="relative z-10 ml-0 flex min-h-[780px] translate-y-5 animate-login-card flex-col items-center rounded-[24px] border-2 border-[#c8c8c8] bg-white px-[56px] pt-[48px] pb-[52px] opacity-0 max-[1220px]:ml-0 max-[1220px]:min-h-0 max-[1220px]:px-8 max-[1220px]:pt-12 max-[1220px]:pb-14 max-[760px]:rounded-3xl max-[760px]:px-5 max-[760px]:pt-10 max-[760px]:pb-[42px] max-[380px]:px-4 max-[380px]:pt-[34px] max-[380px]:pb-9">
          <LogoMark />

          <div className="mt-[40px] text-center max-[760px]:mt-11">
            <h1 className="m-0 text-[48px] leading-[1.08] font-black tracking-normal max-[760px]:text-[34px] max-[380px]:text-[30px]">Welcome Back</h1>
            <p className="mt-2 mb-0 text-[28px] font-extrabold text-[#4b5563] max-[760px]:text-xl">Please enter your details</p>
          </div>

          <LoginForm
            onLoginSuccess={handleLoginSuccess}
            onNavigateToForgotPassword={() => navigate('/forgot-password')}
          />

          <p className="mt-[28px] mb-0 text-center text-[22px] leading-[1.1] font-extrabold max-[760px]:text-xl">
            Need help accessing your account?
            <span className="block">Contact HR</span>
          </p>
        </section>
      </section>

      <footer className="min-h-[34px] bg-[#dde4e2] px-4 py-2 text-center text-base font-extrabold text-[#111]">© 2026 Jawam Infotech. All rights reserved.</footer>
    </main>
  )
}

export default LoginPage
