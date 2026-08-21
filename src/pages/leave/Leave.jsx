import {
  useCallback,
  useContext,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'

import LeaveApplicationForm from '../../components/leave/LeaveApplicationForm.jsx'
import LeaveCancellationModal from '../../components/leave/LeaveCancellationModal.jsx'
import LeaveDetailsModal from '../../components/leave/LeaveDetailsModal.jsx'
import LeaveHistory from '../../components/leave/LeaveHistory.jsx'
import LeaveSummary from '../../components/leave/LeaveSummary.jsx'

import DashboardLayout from '../../layouts/DashboardLayout.jsx'

import { UserContext } from '../../context/UserContext.jsx'
import getPermissions from '../../utils/getPermissions.js'

import useLeave from '../../hooks/useLeave.js'


function Leave() {
  const { user } = useContext(UserContext)
  const navigate = useNavigate()


  /*
   * =========================
   * PERMISSIONS
   * =========================
   */

  const permissions = getPermissions(
    user?.role,
  )

  const canReview =
    permissions?.leave?.canReview === true


  /*
   * =========================
   * LEAVE DATA & ACTIONS
   * =========================
   */

  const {
    leaveTypes,
    summary,
    history,

    historyPagination,
    changeHistoryPage,

    leaveTypesLoading,
    summaryLoading,
    historyLoading,

    leaveTypesError,
    historyError,

    formState,
    handleFieldChange,
    handleApplyLeave,
    resetLeaveForm,

    applyLoading,
    applyError,

    cancellationRequest,
    cancellationLoading,
    handleCancelRequest,
    handleRequestCancellation,
    clearCancellationRequest,
  } = useLeave()


  /*
   * =========================
   * LOCAL UI STATE
   * =========================
   */

  const [
    selectedHistoryRequest,
    setSelectedHistoryRequest,
  ] = useState(null)


  /*
   * =========================
   * HANDLERS
   * =========================
   */

  const handleOpenReview = useCallback(() => {
    navigate('/leave/review')
  }, [navigate])


  const handleViewHistoryRequest =
    useCallback((request) => {
      setSelectedHistoryRequest(request)
    }, [])


  const handleCloseHistoryDetails =
    useCallback(() => {
      setSelectedHistoryRequest(null)
    }, [])


  const handleHistoryPageChange =
    useCallback(
      (page) => {
        void changeHistoryPage(page)
      },
      [changeHistoryPage],
    )


  /*
   * =========================
   * RENDER
   * =========================
   */

  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* =========================
            PAGE HEADER
        ========================== */}

        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

          <div>
            <h1 className="text-[32px] font-black text-[#111827]">
              Leave Management
            </h1>

            <p className="mt-2 text-[16px] text-[#5f6679]">
              Apply and track your leave requests
            </p>
          </div>


          {canReview && (
            <button
              type="button"
              onClick={handleOpenReview}
              className="rounded-full bg-[#3b82f6] px-5 py-2.5 text-[14px] font-extrabold text-white transition hover:bg-[#2563eb] focus:outline-none focus:ring-2 focus:ring-[#bfdbfe] focus:ring-offset-2"
            >
              Review Leave
            </button>
          )}

        </header>


        {/* =========================
            LEAVE SUMMARY
        ========================== */}

        <LeaveSummary
          summary={summary}
          loading={summaryLoading}
        />


        {/* =========================
            APPLY LEAVE
        ========================== */}

        <LeaveApplicationForm
          leaveTypes={leaveTypes}
          leaveTypesLoading={
            leaveTypesLoading
          }
          leaveTypesError={
            leaveTypesError
          }
          formState={formState}
          onFieldChange={
            handleFieldChange
          }
          onSubmit={
            handleApplyLeave
          }
          onCancel={
            resetLeaveForm
          }
          loading={
            applyLoading
          }
          error={
            applyError
          }
        />


        {/* =========================
            LEAVE HISTORY
        ========================== */}

        <LeaveHistory
          history={history}
          loading={historyLoading}
          error={historyError}
          onView={
            handleViewHistoryRequest
          }
          onCancel={
            handleCancelRequest
          }
          pagination={
            historyPagination
          }
          onPageChange={
            handleHistoryPageChange
          }
        />

      </div>


      {/* =========================
          LEAVE DETAILS MODAL
      ========================== */}

      {selectedHistoryRequest && (
        <LeaveDetailsModal
          request={
            selectedHistoryRequest
          }
          onClose={
            handleCloseHistoryDetails
          }
        />
      )}


      {/* =========================
          CANCELLATION MODAL
      ========================== */}

      {cancellationRequest && (
        <LeaveCancellationModal
          request={
            cancellationRequest
          }
          onClose={
            clearCancellationRequest
          }
          onConfirm={
            handleRequestCancellation
          }
          loading={
            cancellationLoading
          }
        />
      )}

    </DashboardLayout>
  )
}


export default Leave