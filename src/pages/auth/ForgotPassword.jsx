import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthSplitLayout from '../../components/auth/AuthSplitLayout.jsx'
import EmailStep from '../../components/auth/forgot-password/EmailStep.jsx'
import OTPStep from '../../components/auth/forgot-password/OTPStep.jsx'
import PasswordStep from '../../components/auth/forgot-password/PasswordStep.jsx'
import {
  requestOtp,
  resetPasswordOtp,
  verifyOtp,
} from '../../services/authService.js'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const RESEND_SECONDS = 30

function getApiMessage(error, fallbackMessage) {
  return (
    error?.response?.data?.detail ||
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    fallbackMessage
  )
}

function ForgotPassword() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  const passwordRequirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+=\u005B\u005D{};':"\\|,.<>/?-]/.test(password),
  }

  const isPasswordValid =
    Object.values(passwordRequirements).every(Boolean) && password === confirmPassword

  useEffect(() => {
    let interval

    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((currentValue) => currentValue - 1)
      }, 1000)
    }

    return () => clearInterval(interval)
  }, [resendTimer])

  const showStatusMessage = (type, text) => {
    setMessageType(type)
    setMessage(text)
  }

  const handleSendOTP = async (event) => {
    event.preventDefault()

    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail) {
      showStatusMessage('error', 'Email address is required.')
      return
    }

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      showStatusMessage('error', 'Enter a valid email address.')
      return
    }

    setIsLoading(true)
    setMessage('')
    setMessageType('')

    try {
      const response = await requestOtp({ email: normalizedEmail })
      setEmail(normalizedEmail)
      setOtp('')
      setStep(2)
      setResendTimer(RESEND_SECONDS)
      showStatusMessage('success', response?.message || 'OTP sent successfully.')
    } catch (error) {
      showStatusMessage('error', getApiMessage(error, 'Unable to send OTP. Please try again.'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (resendTimer === 0) {
      setIsLoading(true)
      setMessage('')
      setMessageType('')

      try {
        const response = await requestOtp({ email: email.trim().toLowerCase() })
        setOtp('')
        setResendTimer(RESEND_SECONDS)
        showStatusMessage('success', response?.message || 'OTP resent successfully.')
      } catch (error) {
        showStatusMessage('error', getApiMessage(error, 'Unable to resend OTP. Please try again.'))
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleVerifyOTP = async (event) => {
    event.preventDefault()

    if (otp.length !== 6) {
      showStatusMessage('error', 'Enter the 6-digit OTP.')
      return
    }

    setIsLoading(true)
    setMessage('')
    setMessageType('')

    try {
      const response = await verifyOtp({
        email: email.trim().toLowerCase(),
        otp,
      })
      setStep(3)
      showStatusMessage('success', response?.message || 'OTP verified successfully.')
    } catch (error) {
      showStatusMessage('error', getApiMessage(error, 'OTP verification failed. Please try again.'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreatePassword = async (event) => {
    event.preventDefault()

    if (!isPasswordValid) return

    setIsLoading(true)
    setMessage('')
    setMessageType('')

    try {
      const response = await resetPasswordOtp({
        email: email.trim().toLowerCase(),
        otp,
        password,
      })
      showStatusMessage('success', response?.message || 'Password reset successfully. Redirecting to login...')
      window.setTimeout(() => {
        navigate('/login')
      }, 900)
    } catch (error) {
      showStatusMessage('error', getApiMessage(error, 'Unable to reset password. Please try again.'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthSplitLayout
      title={step === 1 || step === 2 ? 'Forgot Password?' : 'Change Password'}
      subtitle={
        step === 1 || step === 2
          ? 'Enter your registered mail'
          : 'Create a strong password to secure your account'
      }
    >
      {message && (
        <div
          className={`mt-[28px] w-full max-w-[480px] rounded-[12px] border px-4 py-3 text-[14px] font-semibold ${
            messageType === 'error'
              ? 'border-[#f8d7da] bg-[#fdf2f2] text-[#842029]'
              : 'border-[#d1fae5] bg-[#ecfdf5] text-[#166534]'
          }`}
        >
          {message}
        </div>
      )}

      {step === 1 && <EmailStep email={email} setEmail={setEmail} isLoading={isLoading} onSubmit={handleSendOTP} />}

      {step === 2 && (
        <OTPStep
          email={email}
          otp={otp}
          setOtp={setOtp}
          resendTimer={resendTimer}
          isLoading={isLoading}
          onResendOTP={handleResendOTP}
          onSubmit={handleVerifyOTP}
        />
      )}

      {step === 3 && (
        <PasswordStep
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          showConfirmPassword={showConfirmPassword}
          setShowConfirmPassword={setShowConfirmPassword}
          passwordRequirements={passwordRequirements}
          isPasswordValid={isPasswordValid}
          isLoading={isLoading}
          onSubmit={handleCreatePassword}
        />
      )}

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
    </AuthSplitLayout>
  )
}

export default ForgotPassword
