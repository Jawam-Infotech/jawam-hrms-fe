import { useNavigate } from 'react-router-dom'
import DashboardCard from '../../common/DashboardCard.jsx'

function InterviewTodayCard() {
  const navigate = useNavigate()

  return (
    <DashboardCard>
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-[#dbeafe] flex items-center justify-center text-[24px]">
          ☁️
        </div>
        <div>
          <h3 className="text-[16px] font-extrabold text-[#111827]">
            Interview Today
          </h3>
          <p className="text-[14px] font-extrabold text-[#3b82f6]">5</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-[12px] text-[#5f6679] mb-1">Remaining</p>
          <p className="text-[16px] font-extrabold text-[#111827]">3</p>
        </div>
        <div>
          <p className="text-[12px] text-[#5f6679] mb-1">Completed</p>
          <p className="text-[16px] font-extrabold text-[#111827]">2</p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => navigate('/recruitment')}
        className="text-[#3b82f6] text-[14px] font-extrabold hover:underline mt-3"
      >
        Review Candidates
      </button>
    </DashboardCard>
  )
}

export default InterviewTodayCard
