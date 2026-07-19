function LoginFormField({ id, label, type = 'text', value, onChange, autoComplete, required, endAdornment }) {
  return (
    <div className="relative mb-5 block">
      <label className="mb-[4px] block text-[18px] leading-[1.2] font-extrabold max-[760px]:text-lg" htmlFor={id}>
        {label}
      </label>
      <input
        className={`h-[48px] w-full rounded-[9px] border-2 border-[#dedede] bg-white px-[16px] text-[#111827] outline-none transition-[border-color,box-shadow] duration-[250ms] focus:border-[#3a7be0] focus:shadow-[0_0_0_4px_rgba(58,123,224,0.16)] max-[380px]:h-14 ${endAdornment ? 'pr-14' : ''}`}
        id={id}
        type={type}
        autoComplete={autoComplete}
        required={required}
        value={value}
        onChange={onChange}
      />
      {endAdornment}
    </div>
  )
}

export default LoginFormField
