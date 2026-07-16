export default function StatCard({ icon, iconBg, label, value, valueColor, rows }) {
  return (
    <div className="rounded-[18px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-[24px]"
          style={{ backgroundColor: iconBg }}
        >
          {icon}
        </div>
        <div>
          <p className="text-[12px] text-[#6b7280]">{label}</p>
          <p className="text-[16px] font-extrabold" style={{ color: valueColor }}>{value}</p>
        </div>
      </div>
      <div className="space-y-2 text-[12px]">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between">
            <span className="text-[#6b7280]">{row.label}</span>
            <span className="font-semibold text-[#111827]">{row.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}