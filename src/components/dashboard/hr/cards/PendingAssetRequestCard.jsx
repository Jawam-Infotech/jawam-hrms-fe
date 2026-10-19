import { useNavigate } from 'react-router-dom'
import DashboardCard from '../../common/DashboardCard.jsx'

const requests = [
  { name: 'Rajesh P', asset: 'Laptop', time: '1 day ago' },
  { name: 'Aman Bhatt', asset: 'Mouse And Keyboard', time: '2 day ago' },
  { name: 'Shubham Joshi', asset: 'Headphones', time: '3 days ago' },
]

function PendingAssetRequestCard() {
  const navigate = useNavigate()

  return (
    <DashboardCard>
      <h3 className="text-[18px] font-extrabold text-[#111827] mb-4">
        Pending Asset Request
      </h3>
      <div className="space-y-3">
        {requests.map((req, idx) => (
          <div
            key={idx}
            className="flex justify-between items-start pb-3 border-b border-[#e5e5e5] last:border-0"
          >
            <div>
              <p className="text-[14px] font-semibold text-[#111827]">
                {req.name}
              </p>
              <p className="text-[12px] text-[#5f6679]">{req.asset}</p>
            </div>
            <p className="text-[12px] text-[#5f6679]">{req.time}</p>
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={() => navigate('/assets')}
        className="text-[#3b82f6] text-[14px] font-extrabold hover:underline mt-4"
      >
        View All Request
      </button>
    </DashboardCard>
  )
}

export default PendingAssetRequestCard
