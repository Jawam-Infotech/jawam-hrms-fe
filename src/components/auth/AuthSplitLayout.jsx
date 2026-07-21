import LogoMark from './LogoMark'
import FeatureIcon from './FeatureIcon'
import DotGrid from './DotGrid'

const cardBase =
  'absolute flex w-[290px] min-h-[275px] translate-y-5 flex-col overflow-hidden rounded-[28px] px-[18px] pb-6 text-[30px] font-extrabold leading-[1.45] tracking-normal opacity-0 shadow-[9px_9px_10px_rgba(15,23,42,0.24)] max-[1220px]:w-[260px] max-[1220px]:min-h-[230px] max-[1220px]:text-[26px] max-[620px]:w-[42%] max-[620px]:min-h-[160px] max-[620px]:rounded-[22px] max-[620px]:px-3.5 max-[620px]:pb-[18px] max-[620px]:text-[clamp(15px,5.5vw,20px)] max-[620px]:leading-[1.42]'

function AuthSplitLayout({ title, subtitle, children, footer }) {
  return (
    <main className="flex min-h-screen flex-col bg-[#f5fbf8] text-[#020617] antialiased">
      <section className="mx-auto grid w-full max-w-[1440px] flex-1 grid-cols-[minmax(580px,1.2fr)_minmax(400px,0.8fr)] gap-8 items-center px-[16px] pt-11 pb-8 max-[1220px]:grid-cols-1 max-[1220px]:gap-6 max-[1220px]:p-7 max-[760px]:p-[18px] max-[620px]:p-3.5">
        <div className="relative min-h-[1080px] overflow-hidden rounded-[26px] bg-[#dbe7ef] max-[1220px]:min-h-[720px] max-[760px]:min-h-[640px] max-[760px]:rounded-[22px] max-[620px]:min-h-[560px] max-[380px]:min-h-[500px]">
          <img className="absolute inset-0 size-full object-cover" src="/images/login-bg.png" alt="" aria-hidden="true" />
          <span className="pointer-events-none absolute inset-0 animate-glass-shine bg-[linear-gradient(120deg,transparent_30%,rgba(255,255,255,0.22)_48%,transparent_66%)] motion-reduce:animate-none" aria-hidden="true" />

          <div className={`${cardBase} left-[16.5%] top-[108px] animate-card-enter justify-center bg-[#c7dcff] pt-[68px] text-[#030712] [animation-delay:0ms] max-[1220px]:left-[7%] max-[1220px]:top-[44px] max-[620px]:left-[5%] max-[620px]:top-[34px] max-[620px]:pt-12`}>
            <DotGrid position="top" />
            <p>Complete</p>
            <p>Workforce</p>
            <p>Management</p>
          </div>

          <div className={`${cardBase} left-[55%] top-[108px] animate-blue-card-one justify-center bg-[#3a7be0] pt-[64px] text-white max-[1220px]:right-[7%] max-[1220px]:left-auto max-[1220px]:top-[44px] max-[620px]:right-[5%] max-[620px]:top-[34px] max-[620px]:pt-12`}>
            <FeatureIcon type="lightning" />
            <p>Team</p>
            <p>Management</p>
          </div>

          <div className="absolute left-[16.5%] top-[420px] h-[270px] w-[290px] translate-y-5 animate-card-enter rounded-[28px] border border-white/60 bg-white/50 opacity-0 shadow-[9px_9px_10px_rgba(15,23,42,0.24)] backdrop-blur-[4px] [animation-delay:220ms] max-[1220px]:left-[7%] max-[1220px]:top-72 max-[1220px]:h-[200px] max-[1220px]:w-[260px] max-[620px]:left-[5%] max-[620px]:top-[240px] max-[620px]:h-[150px] max-[620px]:w-[42%] max-[620px]:rounded-[22px]" />
          <div className="absolute left-[55%] top-[420px] h-[270px] w-[290px] translate-y-5 animate-card-enter rounded-[28px] border border-white/60 bg-white/50 opacity-0 shadow-[9px_9px_10px_rgba(15,23,42,0.24)] backdrop-blur-[4px] [animation-delay:300ms] max-[1220px]:right-[7%] max-[1220px]:left-auto max-[1220px]:top-72 max-[1220px]:h-[200px] max-[1220px]:w-[260px] max-[620px]:right-[5%] max-[620px]:top-[240px] max-[620px]:h-[150px] max-[620px]:w-[42%] max-[620px]:rounded-[22px]" />

          <div className={`${cardBase} bottom-[62px] left-[16.5%] animate-card-enter justify-start bg-[#c7dcff] pt-5 text-[#030712] [animation-delay:300ms] max-[1220px]:bottom-12 max-[1220px]:left-[7%] max-[620px]:bottom-[34px] max-[620px]:left-[5%] max-[620px]:pt-12`}>
            <p>Inspire Teams,</p>
            <p>Lead Managers</p>
            <DotGrid position="bottom" />
          </div>

          <div className={`${cardBase} bottom-[62px] left-[55%] animate-blue-card-two justify-start bg-[#3a7be0] pt-[32px] text-white max-[1220px]:right-[7%] max-[1220px]:bottom-12 max-[1220px]:left-auto max-[620px]:right-[5%] max-[620px]:bottom-[34px] max-[620px]:pt-12`}>
            <FeatureIcon type="badge" />
            <p>Streamline</p>
            <p>Human Resource</p>
            <p>Management</p>
          </div>
        </div>

        <section className="relative z-10 ml-0 flex min-h-[780px] translate-y-5 animate-login-card flex-col items-center rounded-[24px] border-2 border-[#c8c8c8] bg-white px-[56px] pt-[48px] pb-[52px] opacity-0 max-[1220px]:ml-0 max-[1220px]:min-h-0 max-[1220px]:px-8 max-[1220px]:pt-12 max-[1220px]:pb-14 max-[760px]:rounded-3xl max-[760px]:px-5 max-[760px]:pt-10 max-[760px]:pb-[42px] max-[380px]:px-4 max-[380px]:pt-[34px] max-[380px]:pb-9">
          <LogoMark />

          <div className="mt-[40px] text-center max-[760px]:mt-11">
            <h1 className="m-0 text-[48px] leading-[1.08] font-black tracking-normal max-[760px]:text-[34px] max-[380px]:text-[30px]">
              {title}
            </h1>

            <p className="mt-2 mb-0 text-[28px] font-extrabold text-[#4b5563] max-[760px]:text-xl">
              {subtitle}
            </p>
          </div>

          {children}

          {footer}

        </section>
      </section>

      <footer className="min-h-[34px] bg-[#dde4e2] px-4 py-2 text-center text-base font-extrabold text-[#111]">
        © 2026 Jawam Infotech. All rights reserved.
      </footer>
    </main>
  )
}

export default AuthSplitLayout
