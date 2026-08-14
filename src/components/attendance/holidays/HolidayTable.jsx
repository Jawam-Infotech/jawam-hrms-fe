import Card from '../../ui/Card.jsx'
import HolidayEmptyState from './HolidayEmptyState.jsx'
import HolidayTableRow from './HolidayTableRow.jsx'
import HolidayTableSkeleton from './HolidayTableSkeleton.jsx'

function HolidayTable({ holidays, loading, canManage, onEdit, onDelete }) {
  return (
    <Card className="rounded-[30px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-[20px] font-black text-[#111827]">Holiday Calendar</h2>
        <p className="mt-2 text-[14px] text-[#5f6679]">
          Maintain company holidays in one place.
        </p>
      </div>

      {loading ? (
        <HolidayTableSkeleton />
      ) : holidays.length === 0 ? (
        <HolidayEmptyState />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[840px]">
            <thead>
              <tr className="border-b border-[#e5e7eb]">
                <th className="px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-wider text-[#6b7280]">
                  Holiday Name
                </th>
                <th className="px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-wider text-[#6b7280]">
                  Holiday Date
                </th>
                <th className="px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-wider text-[#6b7280]">
                  Created By
                </th>
                <th className="px-4 py-3 text-left text-[12px] font-extrabold uppercase tracking-wider text-[#6b7280]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {holidays.map((holiday) => (
                <HolidayTableRow
                  key={holiday.id}
                  holiday={holiday}
                  canManage={canManage}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  )
}

export default HolidayTable
