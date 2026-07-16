import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

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

function OTPInput({ value, onChange }) {
  const inputsRef = useRef([])

  const handleChange = (index, val) => {
    if (/^\d?$/.test(val)) {
      const newOtp = value.split('')
      newOtp[index] = val
      onChange(newOtp.join(''))

      if (val && index < 5) {
        inputsRef.current[index + 1]?.focus()
      }
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  return (
    <div className="flex justify-center gap-3 max-[380px]:gap-2">
      {[...Array(6)].map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          type="text"
          maxLength="1"
          value={value[i] || ''}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className="h-[48px] w-[40px] rounded-[9px] border-2 border-[#dedede] bg-white text-center text-[20px] font-extrabold text-[#111827] outline-none transition-[border-color,box-shadow] duration-[250ms] focus:border-[#3a7be0] focus:shadow-[0_0_0_4px_rgba(58,123,224,0.16)] max-[380px]:h-12 max-[380px]:w-9 max-[380px]:text-base"
        />
      ))}
    </div>
  )
}

function PasswordEye({ showPassword }) {
  const iconClass = 'absolute inset-0 size-full fill-none stroke-current stroke-[1.8] transition-opacity duration-200'

  return (
    <span className="relative block size-[30px] text-[#d6d6d6]" aria-hidden="true">
      <svg className={`${iconClass} ${showPassword ? 'opacity-0' : 'opacity-100'}`} viewBox="0 0 24 24">
        <path d="M2.8 12s3.2-5.7 9.2-5.7S21.2 12 21.2 12 18 17.7 12 17.7 2.8 12 2.8 12Z" />
        <circle cx="12" cy="12" r="2.4" />
      </svg>
      <svg className={`${iconClass} ${showPassword ? 'opacity-100' : 'opacity-0'}`} viewBox="0 0 24 24">
        <path d="m4.2 4.2 15.6 15.6" />
        <path d="M9.9 5.1A9.5 9.5 0 0 1 12 4.9c6 0 9.2 7.1 9.2 7.1a15.7 15.7 0 0 1-2.6 3.5" />
        <path d="M14.2 14.4A3 3 0 0 1 9.6 9.8" />
        <path d="M6.4 6.8A15.9 15.9 0 0 0 2.8 12s3.2 7.1 9.2 7.1c1.3 0 2.5-.3 3.5-.8" />
      </svg>
    </span>
  )
}

function ForgotPasswordLayout() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1) // 1: email, 2: otp, 3: password
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)

  // Password validation
  const passwordRequirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  }

  const isPasswordValid =
    Object.values(passwordRequirements).every(Boolean) && password === confirmPassword

  useEffect(() => {
    let interval
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [resendTimer])

  const handleSendOTP = (e) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setStep(2)
      setResendTimer(30)
      setIsLoading(false)
    }, 900)
  }

  const handleResendOTP = () => {
    if (resendTimer === 0) {
      setResendTimer(30)
      setOtp('')
    }
  }

  const handleVerifyOTP = (e) => {
    e.preventDefault()
    setIsLoading(true)

    setTimeout(() => {
      setStep(3)
      setIsLoading(false)
    }, 900)
  }

  const handleCreatePassword = (e) => {
    e.preventDefault()
    if (!isPasswordValid) return

    setIsLoading(true)

    setTimeout(() => {
      navigate('/login')
      setIsLoading(false)
    }, 900)
  }

  return (
    <main className="flex min-h-screen flex-col bg-[#f5fbf8] text-[#020617] antialiased">
      <section
        className="mx-auto grid w-full max-w-[1440px] flex-1 grid-cols-[minmax(580px,1.2fr)_minmax(400px,0.8fr)] gap-8 items-center px-[16px] pt-11 pb-8 max-[1220px]:grid-cols-1 max-[1220px]:gap-6 max-[1220px]:p-7 max-[760px]:p-[18px] max-[620px]:p-3.5"
        aria-label="JAWAM HR forgot password"
      >
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
              {step === 1 || step === 2 ? 'Forgot Password?' : 'Change Password'}
            </h1>
            <p className="mt-2 mb-0 text-[28px] font-extrabold text-[#4b5563] max-[760px]:text-xl">
              {step === 1 || step === 2
                ? 'Enter your registered mail'
                : 'Create a strong password to secure your account'}
            </p>
          </div>

          <form className="mt-[28px] w-full max-w-[480px]" onSubmit={step === 1 ? handleSendOTP : step === 2 ? handleVerifyOTP : handleCreatePassword}>
            {/* Step 1: Email */}
            {step === 1 && (
              <div className="mb-5 block">
                <label className="mb-[4px] block text-[18px] leading-[1.2] font-extrabold max-[760px]:text-lg" htmlFor="email">Email Address</label>
                <input
                  className="h-[48px] w-full rounded-[9px] border-2 border-[#dedede] bg-white px-[16px] text-[#111827] outline-none transition-[border-color,box-shadow] duration-[250ms] focus:border-[#3a7be0] focus:shadow-[0_0_0_4px_rgba(58,123,224,0.16)] max-[380px]:h-14"
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </div>
            )}

            {/* Step 2: OTP */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="block">
                  <label className="mb-[4px] block text-[18px] leading-[1.2] font-extrabold max-[760px]:text-lg" htmlFor="email">Email Address</label>
                  <input
                    className="h-[48px] w-full rounded-[9px] border-2 border-[#dedede] bg-[#f5f5f5] px-[16px] text-[#111827] outline-none cursor-not-allowed max-[380px]:h-14"
                    id="email"
                    type="email"
                    value={email}
                    disabled
                  />
                </div>

                <div className="block">
                  <label className="mb-4 block text-[18px] leading-[1.2] font-extrabold max-[760px]:text-lg">Enter OTP</label>
                  <OTPInput value={otp} onChange={setOtp} />
                </div>

                <div className="text-center text-[14px] font-extrabold text-[#5f6679]">
                  Didn't receive OTP?{' '}
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={resendTimer > 0}
                    className={`cursor-pointer border-0 bg-none p-0 transition duration-180 ${
                      resendTimer > 0
                        ? 'text-[#ccc] cursor-not-allowed'
                        : 'text-[#3b7cf3] hover:underline'
                    }`}
                  >
                    Resend OTP {resendTimer > 0 ? `(00:${String(resendTimer).padStart(2, '0')})` : ''}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Change Password */}
            {step === 3 && (
              <div className="space-y-5">
                <div className="relative block">
                  <label className="mb-[4px] block text-[18px] leading-[1.2] font-extrabold max-[760px]:text-lg" htmlFor="password">Create Password</label>
                  <input
                    className="h-[48px] w-full rounded-[9px] border-2 border-[#dedede] bg-white px-[16px] pr-14 text-[#111827] outline-none transition-[border-color,box-shadow] duration-[250ms] focus:border-[#3a7be0] focus:shadow-[0_0_0_4px_rgba(58,123,224,0.16)] max-[380px]:h-14"
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <button
                    className="absolute right-[14px] top-[42px] grid size-[28px] cursor-pointer place-items-center rounded-full border-0 bg-transparent p-0 text-[#d6d6d6] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[rgba(58,123,224,0.25)]"
                    type="button"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showPassword}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <PasswordEye showPassword={showPassword} />
                  </button>
                </div>

                <div className="relative block">
                  <label className="mb-[4px] block text-[18px] leading-[1.2] font-extrabold max-[760px]:text-lg" htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    className="h-[48px] w-full rounded-[9px] border-2 border-[#dedede] bg-white px-[16px] pr-14 text-[#111827] outline-none transition-[border-color,box-shadow] duration-[250ms] focus:border-[#3a7be0] focus:shadow-[0_0_0_4px_rgba(58,123,224,0.16)] max-[380px]:h-14"
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                  />
                  <button
                    className="absolute right-[14px] top-[42px] grid size-[28px] cursor-pointer place-items-center rounded-full border-0 bg-transparent p-0 text-[#d6d6d6] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[rgba(58,123,224,0.25)]"
                    type="button"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showConfirmPassword}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <PasswordEye showPassword={showConfirmPassword} />
                  </button>
                </div>

                <div className="space-y-2 text-[14px] font-semibold text-[#5f6679]">
                  <p className="mb-2 font-extrabold">Password must contain:</p>
                  <div className="flex items-center gap-2">
                    <span className={`size-4 rounded-full flex items-center justify-center ${passwordRequirements.length ? 'bg-green-500' : 'bg-[#e5e5e5]'}`}>
                      {passwordRequirements.length && <span className="text-white text-xs">✓</span>}
                    </span>
                    <span className={passwordRequirements.length ? 'text-green-600' : 'text-[#5f6679]'}>At least 8 characters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`size-4 rounded-full flex items-center justify-center ${passwordRequirements.uppercase ? 'bg-green-500' : 'bg-[#e5e5e5]'}`}>
                      {passwordRequirements.uppercase && <span className="text-white text-xs">✓</span>}
                    </span>
                    <span className={passwordRequirements.uppercase ? 'text-green-600' : 'text-[#5f6679]'}>One uppercase letter</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`size-4 rounded-full flex items-center justify-center ${passwordRequirements.number ? 'bg-green-500' : 'bg-[#e5e5e5]'}`}>
                      {passwordRequirements.number && <span className="text-white text-xs">✓</span>}
                    </span>
                    <span className={passwordRequirements.number ? 'text-green-600' : 'text-[#5f6679]'}>One number</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`size-4 rounded-full flex items-center justify-center ${passwordRequirements.special ? 'bg-green-500' : 'bg-[#e5e5e5]'}`}>
                      {passwordRequirements.special && <span className="text-white text-xs">✓</span>}
                    </span>
                    <span className={passwordRequirements.special ? 'text-green-600' : 'text-[#5f6679]'}>One special character</span>
                  </div>
                </div>
              </div>
            )}

            {/* Button */}
            <button
              className="mx-auto mt-[28px] block h-12 w-[60%] min-w-[160px] cursor-pointer rounded-3xl border-0 bg-[#3d83f2] text-[18px] font-extrabold text-white transition duration-180 hover:scale-[1.02] hover:bg-[#2f74e3] active:scale-[0.99] active:bg-[#2867cc] disabled:cursor-wait disabled:opacity-60 disabled:hover:scale-100 max-[760px]:h-16 max-[760px]:w-full max-[760px]:rounded-[18px] max-[760px]:text-[26px]"
              type="submit"
              disabled={isLoading || (step === 2 && otp.length !== 6) || (step === 3 && !isPasswordValid)}
            >
              {isLoading ? (step === 1 ? 'Sending...' : step === 2 ? 'Verifying...' : 'Creating...') : (step === 1 ? 'Send OTP' : step === 2 ? 'Verify OTP' : 'Create Password')}
              {step !== 3 && !isLoading && <span className="ml-2">→</span>}
            </button>
          </form>

          <p className="mt-[28px] mb-0 text-center text-[16px] leading-[1.1] font-extrabold text-[#5f6679] max-[760px]:text-lg">
            Remember Your password.{' '}
            <button
              onClick={() => navigate('/login')}
              className="cursor-pointer border-0 bg-none p-0 text-[#3b7cf3] transition duration-180 hover:underline"
            >
              Sign In
            </button>
          </p>

          <p className="mt-6 mb-0 text-center text-[22px] leading-[1.1] font-extrabold max-[760px]:text-xl">
            Need help accessing your account?
            <span className="block">Contact HR</span>
          </p>
        </section>
      </section>

      <footer className="min-h-[34px] bg-[#dde4e2] px-4 py-2 text-center text-base font-extrabold text-[#111]">© 2026 Jawam Infotech. All rights reserved.</footer>
    </main>
  )
}

export default ForgotPasswordLayout
