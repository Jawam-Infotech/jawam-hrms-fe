function AssetsSummary({ summary }) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {/* Assigned Assets */}
      <div className="rounded-[18px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
        <div className="flex h-full flex-col">
          <p className="text-[14px] font-semibold text-[#6b7280]">
            Assigned Assets
          </p>

          <p className="mt-4 text-[28px] font-black text-[#2563eb]">
            {summary?.total_assigned ?? 0}
          </p>

          <p className="mt-1 text-[12px] font-medium text-[#6b7280]">
            Assets currently assigned to you
          </p>
        </div>
      </div>

      {/* Active Asset */}
      <div className="rounded-[18px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
        <div className="flex h-full flex-col">
          <p className="text-[14px] font-semibold text-[#6b7280]">
            Active Asset
          </p>

          <p className="mt-4 text-[28px] font-black text-[#10b981]">
            {summary?.by_status?.ACTIVE ?? 0}
          </p>

          <p className="mt-1 text-[12px] font-medium text-[#6b7280]">
            Assets currently active
          </p>
        </div>
      </div>

      {/* Pending Return */}
      <div className="rounded-[18px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
        <div className="flex h-full flex-col">
          <p className="text-[14px] font-semibold text-[#6b7280]">
            Pending Return
          </p>

          <p className="mt-4 text-[28px] font-black text-[#0ea5e9]">
            {0}
          </p>

          <p className="mt-1 text-[12px] font-medium text-[#6b7280]">
            Assets awaiting return
          </p>
        </div>
      </div>
    </div>
  )
}

export default AssetsSummary