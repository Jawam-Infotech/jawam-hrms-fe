import { useState, useContext } from 'react'
import { UserContext } from '../../../context/UserContext'
import LoginFormField from './LoginFormField'
import PasswordInput from './PasswordInput'

function LoginForm({ onLoginSuccess, onNavigateToForgotPassword }) {
  const { login } = useContext(UserContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setIsLoading(true)

    try {
      const loggedInUser = await login(email.trim().toLowerCase(), password)
      onLoginSuccess(loggedInUser)
    } catch (error) {
      setErrorMessage(
        error.response?.data?.detail || 'Invalid email or password. Please try again.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form className="mt-[28px] w-full max-w-[480px]" onSubmit={handleSubmit}>
      {errorMessage && (
        <div className="mb-5 rounded-[12px] border border-[#f8d7da] bg-[#fdf2f2] px-4 py-3 text-[#842029]">
          {errorMessage}
        </div>
      )}

      <LoginFormField
        id="email"
        label="Email Address"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
      />

      <PasswordInput value={password} onChange={(event) => setPassword(event.target.value)} />

      <div className="flex items-center justify-between gap-[16px] text-[16px] font-extrabold text-[#5f6679] max-[760px]:flex-col max-[760px]:items-start max-[760px]:text-lg">
        <label className="inline-flex cursor-pointer items-center gap-2">
          <input
            className="peer sr-only"
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
          />
          <span className="relative size-[31px] flex-none rounded-[5px] border-2 border-[#9ca3af] bg-white transition duration-180 after:absolute after:top-1 after:left-[9px] after:h-[15px] after:w-2 after:rotate-45 after:scale-75 after:border-r-[3px] after:border-b-[3px] after:border-white after:opacity-0 after:transition peer-checked:border-[#3a7be0] peer-checked:bg-[#3a7be0] peer-checked:after:scale-100 peer-checked:after:opacity-100 peer-focus-visible:shadow-[0_0_0_4px_rgba(58,123,224,0.16)] peer-active:scale-95" aria-hidden="true" />
          <span className="max-[380px]:text-base">Remember Me</span>
        </label>
        <button
          type="button"
          onClick={onNavigateToForgotPassword}
          className="cursor-pointer border-0 bg-none p-0 text-[#3b7cf3] transition duration-180 hover:underline max-[380px]:text-base"
        >
          Forgot Password?
        </button>
      </div>

      <button
        className="mx-auto mt-[28px] block h-12 w-[60%] min-w-[160px] cursor-pointer rounded-3xl border-0 bg-[#3d83f2] text-[18px] font-extrabold text-white transition duration-180 hover:scale-[1.02] hover:bg-[#2f74e3] active:scale-[0.99] active:bg-[#2867cc] disabled:cursor-wait disabled:opacity-80 disabled:hover:scale-100 max-[760px]:h-16 max-[760px]:w-full max-[760px]:rounded-[18px] max-[760px]:text-[26px]"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? 'Signing In...' : 'Sign In'}
      </button>
    </form>
  )
}

export default LoginForm
