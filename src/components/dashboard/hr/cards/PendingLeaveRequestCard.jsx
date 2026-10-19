import { useNavigate } from 'react-router-dom'
import DashboardCard from '../../common/DashboardCard.jsx'

function PendingLeaveRequestCard({ totalCount = 0, loading = false }) {
  const navigate = useNavigate()

  return (
    <DashboardCard>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-[#fef3c7] flex items-center justify-center text-[24px]">
          📋
        </div>
        <div>
          <h3 className="text-[16px] font-extrabold text-[#111827]">
            Pending Leave Request
          </h3>
          <p className="text-[14px] font-extrabold text-[#f59e0b]">
            ● {loading ? '...' : totalCount}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => navigate('/leave/review')}
        className="text-[#3b82f6] text-[14px] font-extrabold hover:underline"
      >
        Review Leaves
      </button>
    </DashboardCard>
  )
}

export default PendingLeaveRequestCard
