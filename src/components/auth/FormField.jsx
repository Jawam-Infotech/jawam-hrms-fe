function FormField({
  label,
  id,
  type,
  value,
  onChange,
  onBlur,
  required,
  autoComplete,
  placeholder,
  className,
  rightElement,
}) {
  return (
    <div className={rightElement ? 'relative mb-[20px] block' : 'mb-5 block'}>
      <label className="mb-[4px] block text-[18px] leading-[1.2] font-extrabold max-[760px]:text-lg" htmlFor={id}>
        {label}
        {required && <span className="ml-1 text-[#3b82f6]">*</span>}
      </label>
      <input
        className={className}
        id={id}
        name={id}
        type={type}
        autoComplete={autoComplete}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
      {rightElement}
    </div>
  )
}

export default FormField
