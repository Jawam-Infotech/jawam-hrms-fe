function EmployeeProfileHeader({ employee, hideMissingSensitiveFields = false }) {
  const avatarInitial = employee.name?.charAt(0)?.toUpperCase() || 'U'
  const contactNumber = employee.phone
  const joiningDate = employee.joiningDate || employee.date_of_joining
  const shouldShowContactNumber = !hideMissingSensitiveFields || Boolean(contactNumber)
  const shouldShowJoiningDate = !hideMissingSensitiveFields || Boolean(joiningDate)

  return (
    <div className="flex items-center gap-6 rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm max-[760px]:flex-col max-[760px]:items-start">
      <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#e6f9f0] text-[42px] font-black text-[#10b981]">
        {employee.avatar || employee.photo ? (
          <img
            src={employee.avatar || employee.photo}
            alt={`${employee.name} avatar`}
            className="size-full object-cover"
          />
        ) : (
          avatarInitial
        )}
      </div>
      <div>
        <h2 className="text-[28px] font-black text-[#111827]">{employee.name}</h2>
        <p className="mt-1 text-[16px] font-semibold text-[#3b82f6]">{employee.designation || 'N/A'}</p>
        <div className="mt-4 grid gap-x-8 gap-y-2 text-[14px] text-[#5f6679] sm:grid-cols-2">
          <p><span className="font-semibold text-[#111827]">Role:</span> {employee.role || 'N/A'}</p>
          {shouldShowContactNumber && (
            <p><span className="font-semibold text-[#111827]">Contact No:</span> {contactNumber || 'N/A'}</p>
          )}
          <p><span className="font-semibold text-[#111827]">Email:</span> {employee.email || 'N/A'}</p>
          {shouldShowJoiningDate && (
            <p><span className="font-semibold text-[#111827]">Date of Joining:</span> {joiningDate || 'N/A'}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default EmployeeProfileHeader
