import { useState, useMemo, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout'
import { UserContext } from '../../context/UserContext'

const employeeRecords = [
  { id: '101', name: 'Aman', email: 'aman@jawaminfotech.com', designation: 'Frontend Developer' },
  { id: '102', name: 'Pradeep', email: 'pradeep@jawaminfotech.com', designation: 'Frontend Developer' },
  { id: '103', name: 'Radhika', email: 'radhika@jawaminfotech.com', designation: 'Frontend Developer' },
  { id: '104', name: 'Neha', email: 'neha@jawaminfotech.com', designation: 'Frontend Developer' },
  { id: '105', name: 'Hemant', email: 'hemant@jawaminfotech.com', designation: 'Frontend Developer' },
]

function EmployeeModule() {
  const { user } = useContext(UserContext)
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')

  const filteredEmployees = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase()
    const filtered = employeeRecords.filter((employee) => {
      return (
        employee.id.includes(normalizedQuery) ||
        employee.name.toLowerCase().includes(normalizedQuery) ||
        employee.email.toLowerCase().includes(normalizedQuery) ||
        employee.designation.toLowerCase().includes(normalizedQuery)
      )
    })

    return filtered.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.id.localeCompare(b.id)
      }
      return b.id.localeCompare(a.id)
    })
  }, [searchQuery, sortOrder])

  const handleSortToggle = () => {
    setSortOrder((current) => (current === 'asc' ? 'desc' : 'asc'))
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-[32px] font-black text-[#111827]">Employee Module</h1>
            <p className="text-[16px] text-[#5f6679] mt-2">
              Need to connect with your colleagues. Search them by name.
            </p>
          </div>

          <button className="inline-flex items-center gap-2 rounded-full border border-[#e5e7eb] bg-white px-5 py-3 text-[14px] font-extrabold text-[#111827] transition-all duration-200 hover:border-[#cbd5e1] hover:bg-[#f8fafc]">
            <span>⚙️</span>
            Filter & Sort
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_auto]">
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[#9ca3af]">🔍</span>
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search employees..."
              className="h-12 w-full rounded-full border border-[#e5e7eb] bg-[#f8fafc] px-14 text-[14px] text-[#111827] outline-none transition-all duration-200 focus:border-[#3b82f6] focus:ring-2 focus:ring-[#bfdbfe]/50"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-full border border-[#e5e7eb] bg-white px-4 py-3 text-[14px] font-semibold text-[#111827]">
              Logged in as {user.name || 'User'}
            </div>
            <button
              type="button"
              onClick={handleSortToggle}
              className="rounded-full bg-[#3b82f6] px-5 py-3 text-[14px] font-extrabold text-white transition-all duration-200 hover:bg-[#2563eb]"
            >
              Sort by ID {sortOrder === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-[24px] border border-[#e5e5e5] bg-white shadow-sm">
          <table className="min-w-full border-separate border-spacing-0 text-left text-[14px]">
            <thead className="bg-[#f8fafc]">
              <tr>
                <th className="px-6 py-4 font-semibold text-[#111827]">Employee ID</th>
                <th className="px-6 py-4 font-semibold text-[#111827]">Employee Name</th>
                <th className="px-6 py-4 font-semibold text-[#111827]">Employee Mail ID</th>
                <th className="px-6 py-4 font-semibold text-[#111827]">Designation</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => {
                  const clickable = user?.role !== 'employee'
                  return (
                    <tr
                      key={employee.id}
                      {...(clickable
                        ? {
                            onClick: () => navigate(`/employees/${employee.id}`),
                            onKeyDown: (e) => {
                              if (e.key === 'Enter' || e.key === ' ') navigate(`/employees/${employee.id}`)
                            },
                            role: 'button',
                            tabIndex: 0,
                          }
                        : {}
                      )}
                      className={`border-t border-[#e5e5e5] ${clickable ? 'hover:bg-[#f9fafb] cursor-pointer' : ''}`}
                    >
                      <td className="px-6 py-5 font-semibold text-[#111827]">{employee.id}</td>
                      <td className="px-6 py-5 text-[#111827]">{employee.name}</td>
                      <td className="px-6 py-5 text-[#5f6679]">{employee.email}</td>
                      <td className="px-6 py-5 text-[#111827]">{employee.designation}</td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-[#6b7280]">
                    No employees found for the selected search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default EmployeeModule
