import { useState } from 'react'
import { X } from 'lucide-react'
import Button from '../ui/Button.jsx'
import { getApiErrorMessage } from '../../utils/apiErrorMessage.js'

function GenerateSettlementModal({
  isOpen,
  loading,
  employeeLoading,
  employeeError,
  employees,
  onSearch,
  onClose,
  onGenerate,
  error,
}) {
  const [search, setSearch] = useState('')
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  if (!isOpen) return null

  const handleSearch = (event) => {
    const value = event.target.value
    setSearch(value)
    setSelectedEmployee(null)
    if (value.trim()) onSearch(value)
  }

  const submit = async (event) => {
    event.preventDefault()
    if (selectedEmployee) await onGenerate(selectedEmployee.id)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-labelledby="generate-settlement-title">
      <form onSubmit={submit} className="w-full max-w-xl rounded-[24px] bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 id="generate-settlement-title" className="text-[22px] font-black text-[#111827]">Generate Settlement</h2>
          <button type="button" onClick={onClose} disabled={loading} aria-label="Close" className="rounded-full p-1 text-[#6b7280] hover:bg-[#f3f4f6]"><X size={22} /></button>
        </div>
        <p className="mt-2 text-sm text-[#6b7280]">Search for an exited employee with a recorded last working date.</p>
        <input value={search} onChange={handleSearch} placeholder="Search employee" className="mt-5 w-full rounded-xl border border-[#d1d5db] px-4 py-3 text-sm outline-none focus:border-[#2563eb]" autoFocus />
        {employeeLoading && <p className="mt-4 text-sm text-[#6b7280]">Searching employees...</p>}
        {employeeError && <p className="mt-4 text-sm text-red-600">Unable to load employees. Please try again.</p>}
        {!employeeLoading && search.trim() && employees.length === 0 && <p className="mt-4 text-sm text-[#6b7280]">No eligible employees found.</p>}
        {employees.length > 0 && (
          <div className="mt-4 max-h-56 space-y-2 overflow-y-auto">
            {employees.map((employee) => (
              <button key={employee.id} type="button" onClick={() => setSelectedEmployee(employee)} className={`w-full rounded-xl border px-4 py-3 text-left ${selectedEmployee?.id === employee.id ? 'border-[#2563eb] bg-[#eff6ff]' : 'border-[#e5e7eb] hover:bg-[#f9fafb]'}`}>
                <span className="block text-sm font-bold text-[#111827]">{employee.name}</span>
                <span className="block text-xs text-[#6b7280]">Last working date: {employee.lastWorkingDate}</span>
              </button>
            ))}
          </div>
        )}
        {selectedEmployee && <p className="mt-4 rounded-xl bg-[#f3f4f6] px-4 py-3 text-sm font-semibold text-[#111827]">Selected: {selectedEmployee.name}</p>}
        {(error || employeeError) && <p className="mt-4 rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm font-semibold text-[#b91c1c]">{getApiErrorMessage(error || employeeError, 'Unable to generate settlement.')}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" onClick={onClose} disabled={loading} className="rounded-full border border-[#d1d5db] px-5 py-2.5 font-bold text-[#4b5563]">Cancel</Button>
          <Button type="submit" disabled={loading || !selectedEmployee} className="rounded-full bg-[#2563eb] px-5 py-2.5 font-bold text-white">{loading ? 'Generating...' : 'Generate Settlement'}</Button>
        </div>
      </form>
    </div>
  )
}

export default GenerateSettlementModal
