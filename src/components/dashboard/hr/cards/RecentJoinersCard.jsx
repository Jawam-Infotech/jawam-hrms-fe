import { useNavigate } from 'react-router-dom'
import DashboardCard from '../../common/DashboardCard.jsx'

function RecentJoinersCard() {
  const navigate = useNavigate()

  return (
    <DashboardCard>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-[#ede9fe] flex items-center justify-center text-[24px]">
          👥
        </div>
        <div>
          <h3 className="text-[16px] font-extrabold text-[#111827]">
            Recent Joiners
          </h3>
          <p className="text-[14px] font-extrabold text-[#3b82f6]">
            3 Joiners
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-[12px] text-[#5f6679] mb-1">Joined</p>
          <p className="text-[16px] font-extrabold text-[#111827]">1</p>
        </div>
        <div>
          <p className="text-[12px] text-[#5f6679] mb-1">Future joiners</p>
          <p className="text-[16px] font-extrabold text-[#111827]">2</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => navigate('/employees')}
        className="text-[#3b82f6] text-[14px] font-extrabold hover:underline mt-3"
      >
        View All Joiners
      </button>
    </DashboardCard>
  )
}

export default RecentJoinersCard
