import { useState } from 'react'
import LoginFormField from './LoginFormField'

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

function PasswordInput({ id = 'password', label = 'Password', value, onChange }) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <LoginFormField
      id={id}
      label={label}
      type={showPassword ? 'text' : 'password'}
      autoComplete="current-password"
      required
      value={value}
      onChange={onChange}
      endAdornment={
        <button
          className="absolute right-[14px] bottom-[12px] grid size-[28px] cursor-pointer place-items-center rounded-full border-0 bg-transparent p-0 text-[#d6d6d6] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[rgba(58,123,224,0.25)]"
          type="button"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          aria-pressed={showPassword}
          onClick={() => setShowPassword((current) => !current)}
        >
          <PasswordEye showPassword={showPassword} />
        </button>
      }
    />
  )
}

export default PasswordInput
