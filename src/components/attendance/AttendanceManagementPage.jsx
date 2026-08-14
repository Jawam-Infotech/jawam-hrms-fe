import { useEffect, useMemo, useState } from 'react'
import AttendancePagination from './AttendancePagination.jsx'
import AttendanceTrendChart from '../shared/AttendanceTrendChart.jsx'
import CompanyAttendanceFilters from './CompanyAttendanceFilters.jsx'
import CompanyAttendanceTable from './CompanyAttendanceTable.jsx'
import useCompanyAttendancePage from '../../hooks/useCompanyAttendancePage.js'
import useCorrectionRequests from '../../hooks/useCorrectionRequests.js'
import { canReviewAttendanceCorrectionRequests } from '../../utils/getPermissions.js'
import CorrectionRequestReviewModal from './CorrectionRequestReviewModal.jsx'

function normalizeComparableId(value) {
  return String(value ?? '')
}

function normalizeDateOnly(value) {
  return String(value ?? '').slice(0, 10)
}

function normalizeCorrectionStatus(value) {
  return String(value ?? '').trim().toUpperCase()
}

function AttendanceManagementPage({
  user,
  scope = 'company',
  title,
  subtitle,
}) {
  const [selectedCorrectionRequest, setSelectedCorrectionRequest] =
    useState(null)
  const canReviewCorrectionRequests =
    canReviewAttendanceCorrectionRequests(user?.role)

  const {
    attendanceDate,
    setAttendanceDate,
    department,
    searchQuery,
    statusFilter,
    onDepartmentChange,
    onSearchQueryChange,
    onStatusFilterChange,
    availableDepartments,
    statusOptions,
    trendData,
    records,
    loading,
    error,
    currentPage,
    totalCount,
    totalPages,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    refreshAttendance,
  } = useCompanyAttendancePage(user, {
    scope,
  })

  const {
    allRequests,
    selectedRequest,
    loading: correctionRequestsLoading,
    detailLoading,
    actionLoading,
    actionError,
    allRequestsError,
    loadReviewRequests,
    loadRequestDetail,
    approveRequest,
    rejectRequest,
    clearSelectedRequest,
  } = useCorrectionRequests()

  /* Load the correction review queue only for authorized HR/CEO reviewers. */
  useEffect(() => {
    if (!canReviewCorrectionRequests) {
      return undefined
    }

    let cancelled = false

    queueMicrotask(() => {
      if (!cancelled) {
        void loadReviewRequests().catch(() => {})
      }
    })

    return () => {
      cancelled = true
    }
  }, [canReviewCorrectionRequests, loadReviewRequests])

  const handleViewCorrection = (selectedCorrection) => {
    setSelectedCorrectionRequest(selectedCorrection)

    void loadRequestDetail(
      selectedCorrection.correctionRequestId
    ).catch(() => {})
  }

  const handleApproveCorrection = async (requestId, payload) => {
    await approveRequest(requestId, payload)

    await loadReviewRequests()
    await refreshAttendance()

    handleCloseCorrection()
  }

  const handleRejectCorrection = async (requestId, payload) => {
    await rejectRequest(requestId, payload)

    await loadReviewRequests()
    await refreshAttendance()
    handleCloseCorrection()
  }

  const handleCloseCorrection = () => {
    setSelectedCorrectionRequest(null)
    clearSelectedRequest()
  }

  const correctionDataByUserId = useMemo(() => {
  const data = {}

  records.forEach((record) => {
    if (!record.userId) {
      return
    }

    const requestForRecord = allRequests.find(
      (correctionRequest) =>
        normalizeComparableId(correctionRequest?.user?.id) ===
          normalizeComparableId(record.userId) &&
        normalizeDateOnly(correctionRequest?.date) ===
          normalizeDateOnly(attendanceDate)
    )

    if (requestForRecord?.id !== undefined && requestForRecord?.id !== null) {
      data[record.id] = {
        status: normalizeCorrectionStatus(requestForRecord.status),
        requestId: requestForRecord.id,
        // The actionable endpoint is a queue, not the authorization source.
        // The UI determines its mode from centralized role permission and
        // request state; the API remains the final authorization authority.
        canReview:
          canReviewCorrectionRequests &&
          normalizeCorrectionStatus(requestForRecord.status) === 'PENDING',
      }
    }
  })

  return data
}, [
  records,
  allRequests,
  attendanceDate,
  canReviewCorrectionRequests,
])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[24px] font-extrabold text-[#111827]">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-1 text-[14px] font-medium text-[#6b7280]">
            {subtitle}
          </p>
        )}
      </div>

      {error && (
        <div className="rounded-[14px] border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-[14px] font-semibold text-[#b91c1c]">
          Failed to load attendance. Please try again.
        </div>
      )}

      {allRequestsError && (
        <div className="rounded-[14px] border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-[14px] font-semibold text-[#b91c1c]">
          Failed to load company correction requests. Attendance data is
          still available.
        </div>
      )}

      <CompanyAttendanceFilters
        attendanceDate={attendanceDate}
        department={department}
        departmentOptions={availableDepartments}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        statusOptions={statusOptions}
        onAttendanceDateChange={setAttendanceDate}
        onDepartmentChange={onDepartmentChange}
        onSearchQueryChange={onSearchQueryChange}
        onStatusFilterChange={onStatusFilterChange}
        onRefresh={refreshAttendance}
        loading={loading}
      />

      <AttendanceTrendChart
        weeklyData={trendData.weekly}
        monthlyData={trendData.monthly}
        loading={loading}
      />

      <CompanyAttendanceTable
        records={records}
        loading={loading || correctionRequestsLoading}
        scope={scope}
        correctionRequestByAttendanceId={correctionDataByUserId}
        onViewCorrection={handleViewCorrection}
      />

      <AttendancePagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        hasPrevious={currentPage > 1}
        hasNext={currentPage < totalPages}
        onPrevious={goToPreviousPage}
        onNext={goToNextPage}
        onPageChange={goToPage}
        itemLabel="attendance records"
      />

      {selectedCorrectionRequest && (
        <CorrectionRequestReviewModal
          key={selectedCorrectionRequest.correctionRequestId}
          isOpen
          onClose={handleCloseCorrection}
          correctionRequestId={
            selectedCorrectionRequest.correctionRequestId
          }
          correctionRequest={selectedRequest}
          loading={detailLoading}
          error={allRequestsError}
          actionLoading={actionLoading}
          actionError={actionError}
          onApprove={handleApproveCorrection}
          onReject={handleRejectCorrection}
          readOnly={!selectedCorrectionRequest.canReview}
        />
      )}
    </div>
  )
}

export default AttendanceManagementPage
