function DotGrid({ position }) {
  return (
    <span
      className={`absolute h-[110px] w-[184px] bg-[radial-gradient(circle,#8db7f8_0_5px,transparent_5.5px)] bg-[length:40px_40px] max-[620px]:h-[76px] max-[620px]:w-[110px] max-[620px]:bg-[radial-gradient(circle,#8db7f8_0_3.5px,transparent_4px)] max-[620px]:bg-[length:26px_26px] ${
        position === 'top'
          ? 'right-[22px] top-2 max-[620px]:right-3'
          : 'bottom-[-8px] left-[92px] max-[620px]:left-[46px]'
      }`}
      aria-hidden="true"
    />
  )
}

export default DotGrid
