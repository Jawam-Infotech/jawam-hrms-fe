function CheckboxField({ label, checked, onChange, className = '', id }) {
  return (
    <label htmlFor={id} className={`inline-flex cursor-pointer items-center gap-2 ${className}`}>
      <input
        className="peer sr-only"
        id={id}
        name={id}
        type="checkbox"
        checked={checked}
        onChange={onChange}
      />
      <span className="relative size-[31px] flex-none rounded-[5px] border-2 border-[#9ca3af] bg-white transition duration-180 after:absolute after:top-1 after:left-[9px] after:h-[15px] after:w-2 after:rotate-45 after:scale-75 after:border-r-[3px] after:border-b-[3px] after:border-white after:opacity-0 after:transition peer-checked:border-[#3a7be0] peer-checked:bg-[#3a7be0] peer-checked:after:scale-100 peer-checked:after:opacity-100 peer-focus-visible:shadow-[0_0_0_4px_rgba(58,123,224,0.16)] peer-active:scale-95" aria-hidden="true" />
      <span>{label}</span>
    </label>
  )
}

export default CheckboxField
