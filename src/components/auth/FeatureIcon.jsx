function FeatureIcon({ type }) {
  return (
    <span className="mb-[18px] grid size-16 place-items-center rounded-full bg-white max-[620px]:mb-3 max-[620px]:size-11" aria-hidden="true">
      {type === 'badge' ? (
        <svg className="size-[34px] fill-none stroke-[#3a7be0] stroke-[3] max-[620px]:size-6" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.2 12.5 10.1 15.4 16.8 8.7" />
        </svg>
      ) : (
        <svg className="size-[34px] fill-[#3a7be0] stroke-[#3a7be0] stroke-[3] max-[620px]:size-6" viewBox="0 0 24 24">
          <path d="M13 2.8 7.4 11.1h4.1L10.8 21.2 16.6 12.1h-4.1L13 2.8Z" />
        </svg>
      )}
    </span>
  )
}

export default FeatureIcon
