function SelectField({
  label,
  id,
  value,
  onChange,
  onBlur,
  required,
  options,
  placeholder,
  className,
}) {
  return (
    <div className="block">
      <label className="mb-[4px] block text-[18px] leading-[1.2] font-extrabold max-[760px]:text-lg" htmlFor={id}>
        {label}
        {required && <span className="ml-1 text-[#3b82f6]">*</span>}
      </label>
      <select
        className={className}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
      >
        {placeholder && (
          <option value="">
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

export default SelectField
