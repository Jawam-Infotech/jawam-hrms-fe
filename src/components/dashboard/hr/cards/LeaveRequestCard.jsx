import { useNavigate } from 'react-router-dom'
import DashboardCard from '../../common/DashboardCard.jsx'

function LeaveRequestCard({ requests = [], totalCount = 0, loading = false }) {
  const navigate = useNavigate()

  return (
    <DashboardCard>
      <h3 className="text-[18px] font-extrabold text-[#111827] mb-4">
        Leave Request
      </h3>

      <div className="space-y-3">
        {loading ? (
          <p className="text-[14px] text-[#6b7280]">
            Loading leave requests...
          </p>
        ) : requests.length === 0 ? (
          <p className="text-[14px] text-[#6b7280]">
            No pending leave requests.
          </p>
        ) : (
          requests.map((leave) => (
            <div
              key={leave.id}
              className="flex justify-between items-start pb-3 border-b border-[#e5e5e5] last:border-0"
            >
              <div>
                <p className="text-[14px] font-semibold text-[#111827]">
                  {leave.employeeName}
                </p>

                <p className="text-[12px] text-[#5f6679]">
                  {leave.leaveType}
                </p>
              </div>

              <p className="text-[12px] text-[#5f6679]">
                {leave.numberOfDays}{' '}
                {leave.numberOfDays === 1 ? 'Day' : 'Days'}
              </p>
            </div>
          ))
        )}
      </div>

      <button
        type="button"
        onClick={() => navigate('/leave/review')}
        className="text-[#3b82f6] text-[14px] font-extrabold hover:underline mt-4"
      >
        View all Leave Request ({totalCount})
      </button>
    </DashboardCard>
  )
}

export default LeaveRequestCard
