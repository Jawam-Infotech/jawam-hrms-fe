import { useState } from 'react'

import DashboardLayout from '../../layouts/DashboardLayout.jsx'

import LeavePageHeader from '../../components/leave/LeavePageHeader.jsx'
import LeaveTable from '../../components/leave/LeaveTable.jsx'
import LeaveToolbar from '../../components/leave/LeaveToolbar.jsx'
import LeaveReviewDetails from '../../components/leave/LeaveReviewDetails.jsx'
import UpcomingLeavesTable from '../../components/leave/UpcomingLeavesTable.jsx'
import LeavePagination from '../../components/leave/LeavePagination.jsx'

import useLeaveReview from '../../hooks/useLeaveReview.js'
import useUpcomingLeave from '../../hooks/useUpcomingLeave.js'


function LeaveReview() {
  /*
   * =========================
   * ACTIVE SECTION
   * =========================
   *
   * This controls which section is
   * displayed in the review page.
   *
   * REQUESTS
   * CANCELLATIONS
   * UPCOMING
   */

  const [
    activeSection,
    setActiveSection,
  ] = useState('REQUESTS')


  /*
   * =========================
   * REVIEW QUEUE
   * =========================
   *
   * useLeaveReview only handles
   * actionable review queues:
   *
   * PENDING
   * CANCELLATION_REQUESTED
   */

  const {
    requests,
    loading,
    error,

    search,
    status,
    leaveType,
    sortBy,

    setSearch,
    setStatus,
    setLeaveType,
    setSortBy,

    selectedRequest,
    selectRequest,
    clearSelectedRequest,

    setQueueStatus,

    actionLoading,
    actionError,

    acceptRequest,
    rejectRequest,
    partiallyAcceptRequest,

    approveCancellationRequest,
    rejectCancellationRequest,
  } = useLeaveReview()


  /*
   * =========================
   * UPCOMING LEAVES
   * =========================
   *
   * Completely separate from the
   * review queue.
   *
   * Backend endpoint:
   *
   * GET /leave/upcoming/
   */

  const {
    requests: upcomingLeaves,
    loading: upcomingLoading,
    error: upcomingError,
    pagination: upcomingPagination,
    changePage: changeUpcomingPage,
  } = useUpcomingLeave()

  const handleViewUpcomingLeave = (
  request,
) => {
  selectRequest(request)
}

  /*
   * =========================
   * SECTION HANDLERS
   * =========================
   */

  const handleRequestsSection = () => {
    setActiveSection('REQUESTS')

    setQueueStatus('PENDING')
  }


  const handleCancellationsSection = () => {
    setActiveSection(
      'CANCELLATIONS',
    )

    setQueueStatus(
      'CANCELLATION_REQUESTED',
    )
  }


  const handleUpcomingSection = () => {
    setActiveSection('UPCOMING')

    /*
     * Important:
     *
     * Do NOT call setQueueStatus('UPCOMING').
     *
     * Upcoming Leaves uses its own
     * backend endpoint and hook.
     */
  }


  /*
   * =========================
   * SELECTED REQUEST ACTIONS
   * =========================
   */

  const handleAccept = async (
    payload,
  ) => {
    if (!selectedRequest) {
      return
    }

    await acceptRequest(
      selectedRequest.id,
      payload,
    )
  }


  const handleReject = async (
    payload,
  ) => {
    if (!selectedRequest) {
      return
    }

    await rejectRequest(
      selectedRequest.id,
      payload,
    )
  }


  const handlePartialAccept =
    async (payload) => {
      if (!selectedRequest) {
        return
      }

      await partiallyAcceptRequest(
        selectedRequest.id,
        payload,
      )
    }


  const handleApproveCancellation =
    async () => {
      if (!selectedRequest) {
        return
      }

      await approveCancellationRequest(
        selectedRequest.id,
      )
    }


  const handleRejectCancellation =
    async () => {
      if (!selectedRequest) {
        return
      }

      await rejectCancellationRequest(
        selectedRequest.id,
      )
    }


  /*
   * =========================
   * RENDER
   * =========================
   */

  return (
    <DashboardLayout>
      <div className="space-y-6">

        {/* =========================
            PAGE HEADER
            ========================= */}

        <LeavePageHeader />


        {/* =========================
            REVIEW SECTIONS
            ========================= */}

        <div
          className="flex w-fit flex-wrap rounded-xl bg-[#f3f4f6] p-1"
          role="tablist"
          aria-label="Leave review sections"
        >

          {/* =========================
              LEAVE REQUESTS
              ========================= */}

          <button
            type="button"
            role="tab"
            aria-selected={
              activeSection === 'REQUESTS'
            }
            onClick={
              handleRequestsSection
            }
            className={`rounded-lg px-5 py-2.5 text-[14px] font-bold transition ${
              activeSection === 'REQUESTS'
                ? 'bg-white text-[#111827] shadow-sm'
                : 'text-[#6b7280] hover:text-[#111827]'
            }`}
          >
            Leave Requests
          </button>


          {/* =========================
              CANCELLATION REQUESTS
              ========================= */}

          <button
            type="button"
            role="tab"
            aria-selected={
              activeSection ===
              'CANCELLATIONS'
            }
            onClick={
              handleCancellationsSection
            }
            className={`rounded-lg px-5 py-2.5 text-[14px] font-bold transition ${
              activeSection ===
              'CANCELLATIONS'
                ? 'bg-white text-[#111827] shadow-sm'
                : 'text-[#6b7280] hover:text-[#111827]'
            }`}
          >
            Cancellation Requests
          </button>


          {/* =========================
              UPCOMING LEAVES
              ========================= */}

          <button
            type="button"
            role="tab"
            aria-selected={
              activeSection ===
              'UPCOMING'
            }
            onClick={
              handleUpcomingSection
            }
            className={`rounded-lg px-5 py-2.5 text-[14px] font-bold transition ${
              activeSection === 'UPCOMING'
                ? 'bg-white text-[#111827] shadow-sm'
                : 'text-[#6b7280] hover:text-[#111827]'
            }`}
          >
            Upcoming Leaves
          </button>

        </div>


        {/* =====================================================
            UPCOMING LEAVES
            ===================================================== */}

        {activeSection ===
        'UPCOMING' ? (
          <section
            aria-labelledby="upcoming-leaves-title"
            className="space-y-4"
          >

            {/* HEADER */}

            <div>
              <h2
                id="upcoming-leaves-title"
                className="text-[20px] font-black text-[#111827]"
              >
                Upcoming Leaves
              </h2>

              <p className="mt-1 text-[14px] text-[#6b7280]">
                Approved leaves scheduled
                for the upcoming period.
              </p>
            </div>


            {/* ERROR */}

            {upcomingError && (
              <div
                role="alert"
                className="rounded-[14px] border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-[14px] font-semibold text-[#b91c1c]"
              >
                Failed to load upcoming
                leaves. Please try again.
              </div>
            )}


            {/* TABLE */}

            <UpcomingLeavesTable
              requests={
                upcomingLeaves
              }
              loading={
                upcomingLoading
              }
              onView={
              handleViewUpcomingLeave
              }
            />


            {/* PAGINATION */}

            <LeavePagination
              page={
                upcomingPagination.page
              }
              count={
                upcomingPagination.count
              }
              pageSize={
                upcomingPagination.pageSize
              }
              next={
                upcomingPagination.next
              }
              previous={
                upcomingPagination.previous
              }
              loading={
                upcomingLoading
              }
              onPageChange={
                changeUpcomingPage
              }
            />

          </section>
        ) : (
          /*
           * =====================================================
           * REVIEW QUEUES
           * =====================================================
           */

          <>

            {/* =========================
                LOAD ERROR
                ========================= */}

            {error && (
              <div
                role="alert"
                className="rounded-[14px] border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-[14px] font-semibold text-[#b91c1c]"
              >
                Failed to load leave
                requests. Please try
                again.
              </div>
            )}


            {/* =========================
                FILTER TOOLBAR
                ========================= */}

            <LeaveToolbar
              search={search}
              status={status}
              leaveType={leaveType}
              sortBy={sortBy}
              onSearchChange={
                setSearch
              }
              onStatusChange={
                setStatus
              }
              onLeaveTypeChange={
                setLeaveType
              }
              onSortChange={
                setSortBy
              }
            />


            {/* =========================
                REQUEST TABLE
                ========================= */}

            <LeaveTable
              requests={requests}
              loading={loading}
              onView={
                selectRequest
              }
            />

          </>
        )}


        {/* =====================================================
            REVIEW DETAILS MODAL
            ===================================================== */}

        {selectedRequest && (
          <LeaveReviewDetails
            request={
              selectedRequest
            }
            onClose={
              clearSelectedRequest
            }

            actionLoading={
              actionLoading
            }

            actionError={
              actionError
            }

            onAccept={
              handleAccept
            }

            onReject={
              handleReject
            }

            onPartiallyAccept={
              handlePartialAccept
            }

            onApproveCancellation={
              handleApproveCancellation
            }

            onRejectCancellation={
              handleRejectCancellation
            }
          />
        )}

      </div>
    </DashboardLayout>
  )
}


export default LeaveReview