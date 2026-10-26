
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useFinalSettlementData from '../../hooks/payroll/useFinalSettlementData.js'
import { UserContext } from '../../context/UserContext.jsx'
import GenerateSettlementModal from '../../components/payroll/GenerateSettlementModal.jsx'
import PaymentStatusBadge from '../../components/payroll/PaymentStatusBadge.jsx'

function FinalSettlement() {
  const navigate = useNavigate()
  const { user } = useContext(UserContext)
  const [isGenerateOpen, setIsGenerateOpen] = useState(false)
  const {
    settlements,
    loading,
    error,
    fetchSettlements,
    eligibleEmployees,
    employeeLoading,
    employeeError,
    fetchEligibleEmployees,
    createLoading,
    createError,
    handleCreateSettlement,
    handleRegenerateSettlement,
  } = useFinalSettlementData()

  const canGenerateSettlement = String(user?.role || '').trim().toUpperCase() === 'HR'

  const handleGenerate = async (employeeId) => {
    let created
    try {
      created = await handleCreateSettlement(employeeId)
    } catch {
      // The hook stores the error for the modal.
      return
    }
    const settlementId = created?.id
    if (settlementId === undefined || settlementId === null) return
    try {
      await handleRegenerateSettlement(settlementId)
    } catch {
      // Keep the created settlement and let its detail page expose retry calculation.
    }
    await fetchSettlements()
    setIsGenerateOpen(false)
    navigate('/payroll/settlements/' + settlementId)
  }

  useEffect(() => {
    fetchSettlements().catch(() => {
      // The hook stores the error for the UI.
    })
  }, [fetchSettlements])

  const columns = [
    'Employee Name',
    'Last Working Day',
    'Status',
    'Payment Status',
    'Payment Date',
    'Action',
  ]

  return (
    <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
      <div className="mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-[20px] font-black text-[#111827]">Final Settlement</h2>
            <p className="mt-2 text-[14px] text-[#6b7280]">View and manage employee final settlement records.</p>
          </div>
          {canGenerateSettlement && <button type="button" onClick={() => setIsGenerateOpen(true)} className="rounded-full bg-[#2563eb] px-5 py-2.5 text-sm font-bold text-white">Generate Settlement</button>}
        </div>
      </div>

      {loading && (
        <div className="py-12 text-center text-[14px] text-[#6b7280]">
          Loading settlement records...
        </div>
      )}

      {!loading && error && (
        <div className="py-12 text-center">
          <p className="text-[14px] text-red-600">
            Unable to load settlement records. Please try again.
          </p>

          <button
            type="button"
            onClick={() => fetchSettlements().catch(() => {})}
            className="mt-4 rounded-lg bg-[#04A3DA] px-4 py-2 text-sm font-semibold text-white"
          >
            Retry
          </button>
        </div>
      )}

      {!loading && !error && settlements.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-[14px] text-[#374151]">
            <thead className="border-b border-[#e5e7eb] text-[#6b7280]">
              <tr>
                {columns.map((column) => (
                  <th key={column} className="py-4 font-semibold">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {settlements.map((settlement) => (
                <tr
                  key={settlement.id}
                  className="border-b border-[#e5e7eb]"
                >
                  <td className="py-4">
                    {settlement.employee_name || '—'}
                  </td>
                  <td className="py-4">
                    {settlement.last_working_date || '—'}
                  </td>
                  <td className="py-4">
                    {settlement.status || '—'}
                  </td>
                  <td className="py-4">
                    <PaymentStatusBadge status={settlement.payment_status} />
                  </td>
                  <td className="py-4">
                    {settlement.actual_payment_date || settlement.payment_date || '—'}
                  </td>
                  <td className="py-4"><button type="button" onClick={() => navigate('/payroll/settlements/' + settlement.id)} className="rounded-full bg-[#e5e7eb] px-4 py-2 text-[12px] font-semibold text-[#374151]">View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && settlements.length === 0 && (
        <div className="py-12 text-center">
          <h3 className="text-[16px] font-bold text-[#111827]">
            No settlement records available
          </h3>
          <p className="mt-2 text-[14px] text-[#6b7280]">
            Settlement records will appear here when available.
          </p>
        </div>
      )}

      {canGenerateSettlement && <GenerateSettlementModal
        key={isGenerateOpen ? 'open' : 'closed'}
        isOpen={isGenerateOpen}
        loading={createLoading}
        employeeLoading={employeeLoading}
        employeeError={employeeError}
        employees={eligibleEmployees}
        onSearch={fetchEligibleEmployees}
        onClose={() => setIsGenerateOpen(false)}
        onGenerate={handleGenerate}
        error={createError}
      />}
    </div>
  )
}

export default FinalSettlement
