import OTPInput from '../OTPInput.jsx'

function OTPStep({ email, otp, setOtp, resendTimer, isLoading, onResendOTP, onSubmit }) {
  return (
    <form className="mt-[28px] w-full max-w-[480px]" onSubmit={onSubmit}>
      <div className="space-y-6">
        <div className="block">
          <label className="mb-[4px] block text-[18px] leading-[1.2] font-extrabold max-[760px]:text-lg" htmlFor="email">
            Email Address
          </label>
          <input
            className="h-[48px] w-full cursor-not-allowed rounded-[9px] border-2 border-[#dedede] bg-[#f5f5f5] px-[16px] text-[#111827] outline-none max-[380px]:h-14"
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
            onClick={onResendOTP}
            disabled={resendTimer > 0}
            className={`cursor-pointer border-0 bg-none p-0 transition duration-180 ${
              resendTimer > 0 ? 'cursor-not-allowed text-[#ccc]' : 'text-[#3b7cf3] hover:underline'
            }`}
          >
            Resend OTP {resendTimer > 0 ? `(00:${String(resendTimer).padStart(2, '0')})` : ''}
          </button>
        </div>
      </div>

      <button
        className="mx-auto mt-[28px] block h-12 w-[60%] min-w-[160px] cursor-pointer rounded-3xl border-0 bg-[#3d83f2] text-[18px] font-extrabold text-white transition duration-180 hover:scale-[1.02] hover:bg-[#2f74e3] active:scale-[0.99] active:bg-[#2867cc] disabled:cursor-wait disabled:opacity-60 disabled:hover:scale-100 max-[760px]:h-16 max-[760px]:w-full max-[760px]:rounded-[18px] max-[760px]:text-[26px]"
        type="submit"
        disabled={isLoading || otp.length !== 6}
      >
        {isLoading ? 'Verifying...' : 'Verify OTP'}
      </button>
    </form>
  )
}

export default OTPStep
