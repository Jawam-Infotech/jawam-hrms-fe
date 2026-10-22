
export function finalSettlementEmployeeFields(settlement) {
  const employee =
    settlement?.employee ||
    settlement?.employee_details ||
    {}

  const version = settlement?.current_version || {}
  const inputs = version.calculation_inputs || {}

  const payroll =
    settlement?.payroll ||
    settlement?.payroll_record ||
    settlement?.payroll_detail ||
    {}

  const payrollVersion = payroll.current_version || {}
  const payrollInputs = payrollVersion.calculation_inputs || {}
  const payrollEmployee = payroll.employee || {}

  const department =
    settlement?.employee_department ||
    settlement?.department_name ||
    settlement?.department ||
    version.employee_department ||
    version.department_name ||
    inputs.employee_department ||
    inputs.department_name ||
    inputs.department ||
    employee.department_name ||
    employee.department ||
    payroll.employee_department ||
    payroll.department_name ||
    payroll.department ||
    payrollEmployee.department_name ||
    payrollEmployee.department ||
    payrollEmployee.department?.name ||
    payrollEmployee.department?.department_name

  const employmentStartDate =
    inputs.date_of_joining ||
    inputs.joining_date ||
    inputs.employment_start_date ||
    version.date_of_joining ||
    version.joining_date ||
    payrollInputs.date_of_joining ||
    payrollInputs.joining_date ||
    payrollInputs.employment_start_date ||
    payroll.date_of_joining ||
    payroll.joining_date ||
    payroll.employment_start_date ||
    settlement?.date_of_joining ||
    settlement?.joining_date ||
    settlement?.employment_start_date ||
    payrollEmployee.date_of_joining ||
    payrollEmployee.joining_date ||
    payrollEmployee.employment_start_date ||
    employee.date_of_joining ||
    employee.joining_date ||
    employee.employment_start_date

  return {
    department:
      typeof department === 'object'
        ? department?.name || department?.department_name || '—'
        : department,
    designation:
      settlement?.employee_designation ||
      settlement?.designation_name ||
      settlement?.designation ||
      employee.designation_name ||
      employee.designation,
    employmentStartDate,
  }
}

export function finalSettlementAuthorizedBy(settlement) {
  const authorized = settlement?.authorized_by || settlement?.approved_by || settlement?.authorized_person
  if (typeof authorized === 'string') return authorized
  return authorized?.name || authorized?.full_name
}

export function paymentStatusClass(status) {
  const normalizedStatus = String(status || '').toUpperCase()
  if (normalizedStatus === 'PAID') return 'bg-[#dcfce7] text-[#166534]'
  if (normalizedStatus === 'PENDING') return 'bg-[#fef3c7] text-[#b45309]'
  return 'bg-[#f3f4f6] text-[#6b7280]'
}
const ITEM_LABELS = {
  CURRENT_MONTH_SALARY: 'Monthly Salary',
  LOP_DEDUCTION: 'Loss of Pay',
  PREVIOUS_MONTH_ADJUSTMENT: 'Salary Adjustment',
}

export function finalSettlementItemLabel(item) {
  const itemType = String(item?.item_type || '').toUpperCase()
  return ITEM_LABELS[itemType] || item?.description || item?.name || item?.label || item?.item_type || 'Settlement item'
}
