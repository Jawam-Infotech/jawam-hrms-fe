function EmployeeTableRow({ employee, clickable, onClick }) {
  return (
    <tr
      onClick={clickable ? onClick : undefined}
      onKeyDown={
        clickable
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                onClick?.()
              }
            }
          : undefined
      }
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      className={`border-t border-[#e5e5e5] ${clickable ? 'cursor-pointer hover:bg-[#f9fafb]' : ''}`}
    >
      <td className="px-6 py-5 font-semibold text-[#111827]">{employee.id}</td>
      <td className="px-6 py-5 text-[#111827]">{employee.name}</td>
      <td className="px-6 py-5 text-[#5f6679]">{employee.email}</td>
      <td className="px-6 py-5 text-[#111827]">{employee.designation}</td>
    </tr>
  )
}

export default EmployeeTableRow
