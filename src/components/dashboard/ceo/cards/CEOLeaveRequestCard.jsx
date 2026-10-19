import ListSectionCard from '../../../ui/ListSectionCard.jsx'

function CEOLeaveRequestCard({
  requests = [],
  totalCount = 0,
  loading = false,
  onFooterClick,
}) {
  return (
    <ListSectionCard
      title="Leave Request"
      footerText={`View all Leave Request (${totalCount})`}
      onFooterClick={onFooterClick}
    >
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

                <p className="text-[12px] text-[#6b7280]">
                  {leave.leaveType}
                </p>
              </div>

              <p className="text-[12px] text-[#6b7280]">
                {leave.numberOfDays}{' '}
                {leave.numberOfDays === 1 ? 'Day' : 'Days'}
              </p>
            </div>
          ))
        )}
      </div>
    </ListSectionCard>
  )
}

export default CEOLeaveRequestCard
