import Card from '../ui/Card.jsx'

function EmployeeOtherInformation({ employee, title = 'Other Information' }) {
  const information = [
    {
      label: 'Employee ID',
      value: employee.employeeId || 'EMP-001',
    },
    {
      label: 'Department',
      value: employee.department || 'N/A',
    },
    {
      label: 'Reporting Manager',
      value: employee.reportingManager || 'N/A',
    },
    {
      label: 'Employment Type',
      value: employee.employmentType || 'Full Time',
    },
    {
      label: 'Employment Status',
      value: employee.employmentStatus || 'Active',
    },
    {
      label: 'Work Location',
      value: employee.workLocation || 'Indore',
    },
  ]

  return (
    <Card className="rounded-[16px] border border-[#e5e5e5] bg-white p-6">
      <h2 className="mb-6 text-xl font-bold text-[#111827]">
        {title}
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {information.map((item) => (
          <div key={item.label}>
            <p className="text-sm text-[#6b7280]">{item.label}</p>
            <p className="mt-1 font-semibold text-[#111827]">
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default EmployeeOtherInformation
