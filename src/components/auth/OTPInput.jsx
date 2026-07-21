import { useRef } from 'react'
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
export default OTPInput