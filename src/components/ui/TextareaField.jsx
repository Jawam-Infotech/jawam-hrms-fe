function TextareaField({
  label,
  id,
  value,
  onChange,
  onBlur,
  required,
  rows = 3,
  placeholder,
  className,
}) {
  return (
    <div className="block">
      <label className="mb-[4px] block text-[18px] leading-[1.2] font-extrabold max-[760px]:text-lg" htmlFor={id}>
        {label}
        {required && <span className="ml-1 text-[#3b82f6]">*</span>}
      </label>
      <textarea
        className={className}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        rows={rows}
        placeholder={placeholder}
      />
    </div>
  )
}

export default TextareaField
