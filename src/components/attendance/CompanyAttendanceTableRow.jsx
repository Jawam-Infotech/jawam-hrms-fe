import { useMemo } from 'react'
import AttendanceStatusBadge from './AttendanceStatusBadge.jsx'

function formatCellValue(value) {
  return value || '-'
}

function CompanyAttendanceTableRow({ record, correctionRequest, onViewCorrection }) {
  const currentStatus = useMemo(
  () => String(record.displayStatus || record.finalStatus || '').toUpperCase(),
  [record.displayStatus, record.finalStatus]
)

  const currentStatusLabel = useMemo(() => {
    if (record.statusLabel && record.statusLabel !== '-') {
      return record.statusLabel
    }

    return currentStatus ? currentStatus.replaceAll('_', ' ') : 'Pending'
  }, [record.statusLabel, currentStatus])

  const correctionStatus = String(correctionRequest?.status || '')
    .trim()
    .toUpperCase()
  const correctionStatusLabel = correctionStatus === 'PENDING'
    ? 'Request Raised'
    : correctionStatus === 'APPROVED'
      ? 'Approved'
      : correctionStatus === 'REJECTED'
        ? 'Rejected'
        : 'No Request Raised'

  const correctionStatusClass = correctionStatus === 'PENDING'
    ? 'bg-[#fef3c7] text-[#b45309]'
    : correctionStatus === 'APPROVED'
      ? 'bg-[#dcfce7] text-[#15803d]'
      : correctionStatus === 'REJECTED'
        ? 'bg-[#fee2e2] text-[#b91c1c]'
        : 'bg-[#f3f4f6] text-[#6b7280]'

  return (
    <tr className="border-b border-[#f3f4f6] transition hover:bg-[#f9fafb]">
      <td className="px-4 py-4 text-[14px] font-semibold text-[#111827]">
        {formatCellValue(record.name)}
      </td>

      <td className="px-4 py-4 text-[14px] text-[#6b7280]">
        {formatCellValue(record.department)}
      </td>

      <td className="px-4 py-4 text-[14px] text-[#6b7280]">
        {formatCellValue(record.designation)}
      </td>

      <td className="px-4 py-4 text-[14px] text-[#111827]">
        {formatCellValue(record.checkIn)}
      </td>

      <td className="px-4 py-4 text-[14px] text-[#111827]">
        {formatCellValue(record.checkOut)}
      </td>

      <td className="px-4 py-4 text-[14px] text-[#111827]">
        {formatCellValue(record.breakDuration)}
      </td>

      <td className="px-4 py-4">
        <AttendanceStatusBadge status={currentStatus}>
          {currentStatusLabel}
        </AttendanceStatusBadge>
      </td>

      <td className="px-4 py-4">
        <span className={`inline-flex rounded-full px-2.5 py-1 text-[12px] font-bold ${correctionStatusClass}`}>
          {correctionStatusLabel}
        </span>
      </td>

      <td className="px-4 py-4 text-right">
        {correctionRequest?.requestId && (
          <button type="button" onClick={() => onViewCorrection?.({
            attendanceRecord: record,
            correctionRequestId: correctionRequest.requestId,
            canReview: correctionRequest.canReview,
          })} className="text-[13px] font-bold text-[#2563eb] transition hover:text-[#1d4ed8]">
            View
          </button>
        )}
      </td>
    </tr>
  )
}

export default CompanyAttendanceTableRow
