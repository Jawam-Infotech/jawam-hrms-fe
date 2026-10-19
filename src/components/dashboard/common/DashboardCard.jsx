function DashboardCard({ children, className = '' }) {
  return (
    <div
      className={`bg-white rounded-[16px] border border-[#e5e5e5] p-6 shadow-sm ${className}`}
    >
      {children}
    </div>
  )
}

export default DashboardCard
