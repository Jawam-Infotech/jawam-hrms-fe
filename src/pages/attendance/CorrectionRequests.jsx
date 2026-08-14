import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import useCorrectionRequests from '../../hooks/useCorrectionRequests.js'
import CorrectionRequestModal from '../../components/attendance/CorrectionRequestModal.jsx'
import CorrectionRequestReviewModal from '../../components/attendance/CorrectionRequestReviewModal.jsx'

const formatDate = (date) => {
  if (!date) return '--'
  const parsedDate = new Date(`${date}T00:00:00`)
  return Number.isNaN(parsedDate.getTime()) ? '--' : new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).format(parsedDate)
}

const statusClass = {
  PENDING: 'bg-[#fef3c7] text-[#b45309]',
  APPROVED: 'bg-[#dcfce7] text-[#15803d]',
  REJECTED: 'bg-[#fee2e2] text-[#b91c1c]',
}

const getTodayDateInput = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function CorrectionRequests() {
  const navigate = useNavigate()
  const [showForm, setShowForm] = useState(false)
  const [selectedRequestId, setSelectedRequestId] = useState(null)
  const {
    requests,
    selectedRequest,
    loading,
    detailLoading,
    error,
    loadMyRequests,
    loadRequestDetail,
    clearSelectedRequest,
  } = useCorrectionRequests()

  useEffect(() => {
    void loadMyRequests().catch(() => {})
  }, [loadMyRequests])

  const handleView = (requestId) => {
    setSelectedRequestId(requestId)
    void loadRequestDetail(requestId).catch(() => {})
  }

  const handleCloseDetail = () => {
    setSelectedRequestId(null)
    clearSelectedRequest()
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <button type="button" onClick={() => navigate('/attendance')} className="text-[14px] font-semibold text-[#6b7280] hover:underline">← Back to Attendance</button>
            <h1 className="mt-3 text-[32px] font-black text-[#111827]">Correction Requests</h1>
            <p className="mt-2 text-[16px] text-[#5f6679]">Track correction requests you have submitted.</p>
          </div>
          <button type="button" onClick={() => setShowForm(true)} className="rounded-full bg-[#3b82f6] px-6 py-3 text-[14px] font-extrabold text-white transition hover:bg-[#2563eb]">Raise New Correction Request</button>
        </div>

        {error && <div className="rounded-[14px] border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-[14px] font-semibold text-[#b91c1c]">Failed to load correction requests. Please try again.</div>}

        <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-5 shadow-sm">
          {loading ? <div className="px-4 py-10 text-center text-[14px] font-semibold text-[#6b7280]">Loading correction requests...</div> : requests.length === 0 ? <div className="px-4 py-10 text-center text-[14px] font-semibold text-[#6b7280]">No correction requests found.</div> : (
            <div className="overflow-x-auto"><table className="w-full min-w-[680px]"><thead><tr className="border-b border-[#e5e7eb]"><Header>Date</Header><Header>Reason</Header><Header>Status</Header><Header align="right">View</Header></tr></thead><tbody>{requests.map((request) => <tr key={request.id} className="border-b border-[#f3f4f6] last:border-b-0"><Cell>{formatDate(request.date)}</Cell><Cell>{request.reason || 'Not provided'}</Cell><Cell><span className={`inline-flex rounded-full px-2.5 py-1 text-[12px] font-bold ${statusClass[request.status] || 'bg-[#f3f4f6] text-[#6b7280]'}`}>{request.status}</span></Cell><Cell align="right"><button type="button" onClick={() => handleView(request.id)} className="text-[13px] font-bold text-[#2563eb] transition hover:text-[#1d4ed8]">View</button></Cell></tr>)}</tbody></table></div>
          )}
        </div>

        <CorrectionRequestModal isOpen={showForm} initialDate={getTodayDateInput()} onClose={() => setShowForm(false)} onSubmitSuccess={() => { setShowForm(false); void loadMyRequests().catch(() => {}) }} />
        {selectedRequestId && <CorrectionRequestReviewModal isOpen correctionRequestId={selectedRequestId} correctionRequest={selectedRequest} loading={detailLoading} error={error} readOnly onClose={handleCloseDetail} />}
      </div>
    </DashboardLayout>
  )
}

function Header({ children, align = 'left' }) { return <th className={`px-4 py-3 text-${align} text-[12px] font-extrabold uppercase tracking-wider text-[#6b7280]`}>{children}</th> }
function Cell({ children, align = 'left' }) { return <td className={`px-4 py-4 text-${align} text-[14px] text-[#374151]`}>{children}</td> }

export default CorrectionRequests
