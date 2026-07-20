import FormField from '../FormField.jsx'

const emailInputClass =
  'h-[48px] w-full rounded-[9px] border-2 border-[#dedede] bg-white px-[16px] text-[#111827] outline-none transition-[border-color,box-shadow] duration-[250ms] focus:border-[#3a7be0] focus:shadow-[0_0_0_4px_rgba(58,123,224,0.16)] max-[380px]:h-14'

function EmailStep({ email, setEmail, isLoading, onSubmit }) {
  return (
    <form className="mt-[28px] w-full max-w-[480px]" onSubmit={onSubmit}>
      <FormField
        label="Email Address"
        id="email"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className={emailInputClass}
      />

      <button
        className="mx-auto mt-[28px] block h-12 w-[60%] min-w-[160px] cursor-pointer rounded-3xl border-0 bg-[#3d83f2] text-[18px] font-extrabold text-white transition duration-180 hover:scale-[1.02] hover:bg-[#2f74e3] active:scale-[0.99] active:bg-[#2867cc] disabled:cursor-wait disabled:opacity-60 disabled:hover:scale-100 max-[760px]:h-16 max-[760px]:w-full max-[760px]:rounded-[18px] max-[760px]:text-[26px]"
        type="submit"
        disabled={isLoading}
      >
        {isLoading ? 'Sending...' : 'Send OTP'}
        {!isLoading && <span className="ml-2">→</span>}
      </button>
    </form>
  )
}

export default EmailStep
