import Pagination from '../ui/Pagination.jsx'
import { ATTENDANCE_PAGE_SIZE } from '../../constants/attendance.js'

function AttendancePagination({
  itemLabel = 'attendance records',
  pageSize = ATTENDANCE_PAGE_SIZE,
  ...rest
}) {
  return (
    <Pagination
      {...rest}
      pageSize={pageSize}
      itemLabel={itemLabel}
    />
  )
}

export default AttendancePagination

