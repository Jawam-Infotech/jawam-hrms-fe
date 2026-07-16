import { useParams, useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { UserContext } from '../../context/UserContext'

function EmployeeProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useContext(UserContext)

  // Restrict: employees cannot view other employees' profiles
  if (user.role === 'employee') {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <button onClick={() => navigate(-1)} className="text-[#6b7280] hover:underline">← Back</button>
          <div className="bg-white rounded-[16px] p-6 border border-[#e5e5e5] text-center">
            <h2 className="text-[20px] font-extrabold text-[#111827]">Access Restricted</h2>
            <p className="text-[14px] text-[#5f6679] mt-2">You cannot view other employees' profiles.</p>
            <div className="mt-4">
              <button onClick={() => navigate('/profile')} className="px-4 py-2 rounded-full bg-[#3b82f6] text-white font-extrabold">Go to My Profile</button>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  // For manager/hr/admin show placeholder details (in real app fetch by id)
  const employee = {
    id,
    name: 'Gaurav P',
    contact: '7900865789',
    email: 'gaurav@jawaminfotech.com',
    role: 'UI/UX Engineer',
    department: 'Development',
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <button onClick={() => navigate(-1)} className="text-[#6b7280] hover:underline">← Back to Employee</button>

        <div className="flex items-center gap-6">
          <div className="w-28 h-28 rounded-full bg-[#e6f9f0] flex items-center justify-center text-[42px]">👨‍💻</div>
          <div>
            <h2 className="text-[28px] font-black text-[#111827]">{employee.name}</h2>
            <p className="text-[14px] text-[#5f6679]">Contact No :{employee.contact}</p>
            <p className="text-[14px] text-[#5f6679]">Email : {employee.email}</p>
            <p className="text-[14px] text-[#5f6679]">Role : {employee.role}</p>
            <p className="text-[14px] text-[#5f6679]">Department: {employee.department}</p>
          </div>
          <div className="ml-auto flex gap-3">
            <button className="px-4 py-2 rounded-full border border-[#e5e7eb] bg-white text-[14px] font-extrabold">View Work Updates</button>
            <button className="px-4 py-2 rounded-full bg-[#3b82f6] text-white text-[14px] font-extrabold">Assign Task</button>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 max-[760px]:grid-cols-1">
          <div className="bg-white rounded-[16px] p-6 border border-[#e5e5e5]">
            <h3 className="font-extrabold text-[#111827] mb-2">Attendance this month</h3>
            <p className="text-[20px] font-black text-[#10b981]">95%</p>
            <div className="mt-3 text-[12px] text-[#5f6679]">Present 22 • Absent 1 • Late N/A</div>
          </div>

          <div className="bg-white rounded-[16px] p-6 border border-[#e5e5e5]">
            <h3 className="font-extrabold text-[#111827] mb-2">Performance Score</h3>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-[#ecfdf5] flex items-center justify-center text-[20px] font-black">85%</div>
              <div>
                <div className="text-[14px] font-extrabold text-[#10b981]">Exceed Expectation</div>
                <div className="text-[12px] text-[#5f6679]">Great Job! Keep up the consistent performance</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[16px] p-6 border border-[#e5e5e5]">
            <h3 className="font-extrabold text-[#111827] mb-2">Active Projects</h3>
            <p className="text-[16px] font-extrabold text-[#3b82f6]">1 Project</p>
            <div className="text-[12px] text-[#5f6679] mt-2">Current Project: HRMS Dashboard • Completed Projects 4</div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default EmployeeProfile
