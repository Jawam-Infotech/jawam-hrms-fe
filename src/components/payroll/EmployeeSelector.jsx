import { useState } from 'react'
import usePayrollEmployeeSelector from '../../hooks/payroll/usePayrollEmployeeSelector.js'

function EmployeeSelector({
  onChange,
  disabled = false,
}) {
  const {
    employees,
    search,
    handleSearchChange,
    loading,
    error,
  } = usePayrollEmployeeSelector()

  const [selectedEmployee, setSelectedEmployee] = useState(null)

  const getEmployeeName = (employee) => {
    if (employee.name) {
      return employee.name
    }

    const fullName = [
      employee.first_name,
      employee.last_name,
    ]
      .filter(Boolean)
      .join(' ')

    return fullName || employee.email || employee.id
  }

  const handleSelect = (employee) => {
    setSelectedEmployee(employee)
    onChange(employee.id)

    // Clear the search so the dropdown disappears.
    handleSearchChange('')
  }

  const handleInputChange = (event) => {
    const value = event.target.value

    // User is searching for another employee.
    if (selectedEmployee) {
      setSelectedEmployee(null)
      onChange('')
    }

    handleSearchChange(value)
  }

  return (
    <div className="relative">
      <input
        type="text"
        value={
          selectedEmployee
            ? getEmployeeName(selectedEmployee)
            : search
        }
        onChange={handleInputChange}
        placeholder="Search employee by name, ID or email"
        disabled={disabled}
        autoComplete="off"
        className="min-h-11 w-full rounded-xl border border-[#d1d5db] bg-white px-4 py-2 text-[15px] font-semibold text-[#111827] outline-none transition placeholder:font-normal placeholder:text-[#9ca3af] focus:border-[#2563eb] disabled:cursor-not-allowed disabled:bg-[#f9fafb]"
      />

      {loading && (
        <div className="mt-2 text-[13px] font-medium text-[#6b7280]">
          Searching employees...
        </div>
      )}

      {!loading && search.trim() && employees.length > 0 && (
        <div className="absolute left-0 right-0 z-50 mt-2 max-h-60 overflow-y-auto rounded-xl border border-[#e5e7eb] bg-white shadow-lg">
          {employees.map((employee) => (
            <button
              key={employee.id}
              type="button"
              onClick={() => handleSelect(employee)}
              className="w-full border-b border-[#f3f4f6] px-4 py-3 text-left transition last:border-b-0 hover:bg-[#f9fafb]"
            >
              <p className="text-[14px] font-bold text-[#111827]">
                {getEmployeeName(employee)}
              </p>

              <p className="mt-1 text-[12px] font-medium text-[#6b7280]">
                {employee.employee_id || employee.id}
                {employee.email ? ` • ${employee.email}` : ''}
              </p>
            </button>
          ))}
        </div>
      )}

      {!loading &&
        search.trim() &&
        employees.length === 0 &&
        !error && (
          <div className="mt-2 rounded-xl border border-[#e5e7eb] bg-[#f9fafb] px-4 py-3">
            <p className="text-[13px] font-medium text-[#6b7280]">
              No employees found.
            </p>
          </div>
        )}

      {error && (
        <div className="mt-2 rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3">
          <p className="text-[13px] font-medium text-[#b91c1c]">
            Unable to load employees. Please try again.
          </p>
        </div>
      )}
    </div>
  )
}

export default EmployeeSelector