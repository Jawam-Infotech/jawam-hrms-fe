import Pagination from '../ui/Pagination.jsx'
import { EMPLOYEE_PAGE_SIZE } from '../../constants/pagination.js'

function EmployeePagination(props) {
  return (
    <Pagination
      {...props}
      pageSize={EMPLOYEE_PAGE_SIZE}
      itemLabel="employees"
    />
  )
}

export default EmployeePagination