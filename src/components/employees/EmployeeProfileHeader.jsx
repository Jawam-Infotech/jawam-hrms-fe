function EmployeeProfileHeader({ employee }) {
  return (
    <div className="flex items-center gap-6">
      <div className="flex h-28 w-28 items-center justify-center rounded-full bg-[#e6f9f0] text-[42px]">
        👨‍💻
      </div>
      <div>
        <h2 className="text-[28px] font-black text-[#111827]">{employee.name}</h2>
        <p className="text-[14px] text-[#5f6679]">Contact No :{employee.contact}</p>
        <p className="text-[14px] text-[#5f6679]">Email : {employee.email}</p>
        <p className="text-[14px] text-[#5f6679]">Role : {employee.role}</p>
        <p className="text-[14px] text-[#5f6679]">Department: {employee.department}</p>
      </div>
    </div>
  )
}

export default EmployeeProfileHeader
