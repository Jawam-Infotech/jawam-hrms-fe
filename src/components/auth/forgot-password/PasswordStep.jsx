import FormField from '../FormField.jsx'
import PasswordEye from '../PasswordEye.jsx'
import PasswordRequirements from '../PasswordRequirements.jsx'

const passwordInputClass =
  'h-[48px] w-full rounded-[9px] border-2 border-[#dedede] bg-white px-[16px] pr-14 text-[#111827] outline-none transition-[border-color,box-shadow] duration-[250ms] focus:border-[#3a7be0] focus:shadow-[0_0_0_4px_rgba(58,123,224,0.16)] max-[380px]:h-14'

function PasswordStep({
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  passwordRequirements,
  isPasswordValid,
  isLoading,
  onSubmit,
}) {
  return (
    <form className="mt-[28px] w-full max-w-[480px]" onSubmit={onSubmit}>
      <div className="space-y-5">
        <FormField
          label="Create Password"
          id="password"
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className={passwordInputClass}
          rightElement={
            <button
              className="absolute right-[14px] top-[42px] grid size-[28px] cursor-pointer place-items-center rounded-full border-0 bg-transparent p-0 text-[#d6d6d6] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[rgba(58,123,224,0.25)]"
              type="button"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((currentValue) => !currentValue)}
            >
              <PasswordEye showPassword={showPassword} />
            </button>
          }
        />

        <FormField
          label="Confirm Password"
          id="confirmPassword"
          type={showConfirmPassword ? 'text' : 'password'}
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          className={passwordInputClass}
          rightElement={
            <button
              className="absolute right-[14px] top-[42px] grid size-[28px] cursor-pointer place-items-center rounded-full border-0 bg-transparent p-0 text-[#d6d6d6] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[rgba(58,123,224,0.25)]"
              type="button"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showConfirmPassword}
              onClick={() => setShowConfirmPassword((currentValue) => !currentValue)}
            >
              <PasswordEye showPassword={showConfirmPassword} />
            </button>
          }
        />

        <PasswordRequirements
          password={password}
          confirmPassword={confirmPassword}
          passwordRequirements={passwordRequirements}
        />
      </div>

      <button
        className="mx-auto mt-[28px] block h-12 w-[60%] min-w-[160px] cursor-pointer rounded-3xl border-0 bg-[#3d83f2] text-[18px] font-extrabold text-white transition duration-180 hover:scale-[1.02] hover:bg-[#2f74e3] active:scale-[0.99] active:bg-[#2867cc] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100 max-[760px]:h-16 max-[760px]:w-full max-[760px]:rounded-[18px] max-[760px]:text-[26px]"
        type="submit"
        disabled={isLoading || !isPasswordValid}
      >
        {isLoading ? 'Resetting Password...' : 'Reset Password'}
      </button>
    </form>
  )
}

export default PasswordStep
