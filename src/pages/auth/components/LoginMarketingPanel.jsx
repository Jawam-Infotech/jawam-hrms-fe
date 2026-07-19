function LogoMark() {
  return (
    <img
      src="/images/logo-placeholder.png"
      alt="JawamHR Logo"
      className="h-auto w-[268px] max-w-[60%] object-contain max-[760px]:w-[200px] max-[760px]:max-w-[80%]"
    />
  )
}

function FeatureIcon({ type }) {
  return (
    <span className="mb-[18px] grid size-16 place-items-center rounded-full bg-white max-[620px]:mb-3 max-[620px]:size-11" aria-hidden="true">
      {type === 'badge' ? (
        <svg className="size-[34px] fill-none stroke-[#3a7be0] stroke-[3] max-[620px]:size-6" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.2 12.5 10.1 15.4 16.8 8.7" />
        </svg>
      ) : (
        <svg className="size-[34px] fill-[#3a7be0] stroke-[#3a7be0] stroke-[3] max-[620px]:size-6" viewBox="0 0 24 24">
          <path d="M13 2.8 7.4 11.1h4.1L10.8 21.2 16.6 12.1h-4.1L13 2.8Z" />
        </svg>
      )}
    </span>
  )
}

function DotGrid({ position }) {
  return (
    <span
      className={`absolute h-[110px] w-[184px] bg-[radial-gradient(circle,#8db7f8_0_5px,transparent_5.5px)] bg-[length:40px_40px] max-[620px]:h-[76px] max-[620px]:w-[110px] max-[620px]:bg-[radial-gradient(circle,#8db7f8_0_3.5px,transparent_4px)] max-[620px]:bg-[length:26px_26px] ${
        position === 'top'
          ? 'right-[22px] top-2 max-[620px]:right-3'
          : 'bottom-[-8px] left-[92px] max-[620px]:left-[46px]'
      }`}
      aria-hidden="true"
    />
  )
}

const cardBase =
  'absolute flex w-[290px] min-h-[275px] translate-y-5 flex-col overflow-hidden rounded-[28px] px-[18px] pb-6 text-[30px] font-extrabold leading-[1.45] tracking-normal opacity-0 shadow-[9px_9px_10px_rgba(15,23,42,0.24)] max-[1220px]:w-[260px] max-[1220px]:min-h-[230px] max-[1220px]:text-[26px] max-[620px]:w-[42%] max-[620px]:min-h-[160px] max-[620px]:rounded-[22px] max-[620px]:px-3.5 max-[620px]:pb-[18px] max-[620px]:text-[clamp(15px,5.5vw,20px)] max-[620px]:leading-[1.42]'

function LoginMarketingPanel() {
  return (
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
  )
}

export { LogoMark }
export default LoginMarketingPanel
