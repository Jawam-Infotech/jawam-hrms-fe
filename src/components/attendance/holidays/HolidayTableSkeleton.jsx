function HolidayTableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-[1.4fr_1fr_1fr_0.8fr] gap-4 rounded-[18px] border border-[#e5e7eb] bg-white px-4 py-4 animate-pulse max-[760px]:grid-cols-1"
        >
          <div className="h-4 rounded-full bg-[#e5e7eb]" />
          <div className="h-4 rounded-full bg-[#e5e7eb]" />
          <div className="h-4 rounded-full bg-[#e5e7eb]" />
          <div className="h-4 rounded-full bg-[#e5e7eb]" />
        </div>
      ))}
    </div>
  )
}

export default HolidayTableSkeleton
