import { useNavigate } from 'react-router-dom'
import DashboardCard from '../../common/DashboardCard.jsx'

const stages = [
  { label: 'Application Received', count: 100 },
  { label: 'Shortlisted', count: 40 },
  { label: 'Interview Scheduled', count: 20 },
  { label: 'Offer Scheduled', count: 10 },
  { label: 'Joined', count: 5 },
  { label: 'Backoff Candidates', count: 3 },
]

function RecruitmentActivityCard() {
  const navigate = useNavigate()

  return (
    <DashboardCard>
      <h3 className="text-[18px] font-extrabold text-[#111827] mb-4">
        Recruitment activity
      </h3>
      <div className="space-y-3">
        {stages.map((stage, idx) => (
          <div
            key={idx}
            className="flex justify-between items-center pb-3 border-b border-[#e5e5e5] last:border-0"
          >
            <p className="text-[14px] font-semibold text-[#111827]">
              {stage.label}
            </p>
            <p className="text-[12px] text-[#5f6679]">({stage.count})</p>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => navigate('/recruitment')}
        className="text-[#3b82f6] text-[14px] font-extrabold hover:underline mt-4"
      >
        View All Open Positions
      </button>
    </DashboardCard>
  )
}

export default RecruitmentActivityCard
