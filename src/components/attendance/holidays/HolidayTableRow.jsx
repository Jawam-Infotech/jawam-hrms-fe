import Button from '../../ui/Button.jsx'
import { formatHolidayDate } from '../../../utils/holidayUtils.js'

function HolidayTableRow({ holiday, canManage, onEdit, onDelete }) {
  return (
    <tr className="border-b border-[#f3f4f6] transition hover:bg-[#f9fafb]">
      <td className="px-4 py-4 text-[14px] font-semibold text-[#111827]">
        {holiday.holidayName || '-'}
      </td>
      <td className="px-4 py-4 text-[14px] text-[#5f6679]">
        {formatHolidayDate(holiday.holidayDate)}
      </td>
      <td className="px-4 py-4 text-[14px] text-[#5f6679]">
        {holiday.createdBy || '-'}
      </td>
      <td className="px-4 py-4">
        {canManage ? (
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              onClick={() => onEdit(holiday)}
              className="rounded-full border border-[#d1d5db] bg-white px-4 py-2 text-[13px] font-semibold text-[#111827] transition hover:bg-[#f9fafb]"
            >
              Edit
            </Button>
            <Button
              type="button"
              onClick={() => onDelete(holiday)}
              className="rounded-full border border-[#fecaca] bg-[#fff1f2] px-4 py-2 text-[13px] font-semibold text-[#dc2626] transition hover:bg-[#ffe4e6]"
            >
              Delete
            </Button>
          </div>
        ) : (
          <span className="inline-flex rounded-full bg-[#dbeafe] px-3 py-1 text-[12px] font-semibold text-[#2563eb]">
            Read only
          </span>
        )}
      </td>
    </tr>
  )
}

export default HolidayTableRow
