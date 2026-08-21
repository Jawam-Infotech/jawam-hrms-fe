import {
  getLeaveTypes as getLeaveTypesApi,
  getLeaveSummary as getLeaveSummaryApi,
  getLeaveBalance as getLeaveBalanceApi,
  getMyLeaveRequests,
  getLeaveRequestById as getLeaveRequestByIdApi,
  createLeaveRequest,
  cancelLeave,
  getPendingLeaveRequests,
  getUpcomingLeaveRequests,
  approveLeaveRequest,
  rejectLeaveRequest,
  partiallyApproveLeave,
  approveLeaveCancellation as approveLeaveCancellationApi,
  rejectLeaveCancellation as rejectLeaveCancellationApi,
} from './api/leave.api.js'


const STATUS_MAP = {
  PENDING: 'Pending',
  APPROVED: 'Accepted',
  REJECTED: 'Rejected',
  PARTIALLY_APPROVED: 'Partially Accepted',
  CANCELLATION_REQUESTED: 'Cancellation Requested',
  CANCELLED: 'Cancelled',
}


/*
 * =========================
 * NORMALIZATION
 * =========================
 */

function getEmployeeName(user) {
  if (!user) return '--'

  return (
    `${user.first_name || ''} ${user.last_name || ''}`.trim() ||
    '--'
  )
}


function getReviewerName(reviewer) {
  if (!reviewer) return ''

  return `${reviewer.first_name || ''} ${
    reviewer.last_name || ''
  }`.trim()
}


function normalizeLeaveRequest(request) {
  if (!request) return null

  const approvedDates =
    request.approved_dates || []

  const rejectedDates =
    request.rejected_dates || []

  const isPartiallyApproved =
    request.status === 'PARTIALLY_APPROVED'


  /*
   * =========================
   * CONFLICT NORMALIZATION
   * =========================
   *
   * Backend:
   *
   * conflicts: [
   *   {
   *     date: '2026-08-24',
   *     employees_on_leave: 2,
   *     conflict_percentage: 33,
   *     level: 'medium'
   *   }
   * ]
   *
   * Frontend:
   *
   * conflicts: [
   *   {
   *     date: '2026-08-24',
   *     employeesOnLeave: 2,
   *     conflictPercentage: 33,
   *     level: 'medium'
   *   }
   * ]
   */

  const conflicts =
    Array.isArray(request.conflicts)
      ? request.conflicts.map(
          (conflict) => ({
            date: conflict.date,

            employeesOnLeave:
              Number.parseInt(
                conflict.employees_on_leave ?? 0,
                10,
              ),

            conflictPercentage:
              Number.parseFloat(
                conflict.conflict_percentage ?? 0,
              ),

            level:
              conflict.level || 'low',
          }),
        )
      : []


  return {
    ...request,

    /*
     * =========================
     * EMPLOYEE INFORMATION
     * =========================
     */

    employeeName:
      getEmployeeName(request.user),

    department:
      request.user?.department || '--',

    designation:
      request.user?.designation || '--',


    /*
     * =========================
     * LEAVE TYPE
     * =========================
     */

    leaveType:
      request.leave_type?.name || '--',

    leaveTypeCode:
      request.leave_type?.code || '',


      /*
 * =========================
 * AVAILABLE LEAVE BALANCE
 * =========================
 */

availableLeaveBalance:
  request.available_leave_balance == null
    ? null
    : Number.parseFloat(
        request.available_leave_balance,
      ),

    /*
     * =========================
     * DATES
     * =========================
     */

    startDate:
      request.start_date,

    endDate:
      request.end_date,


    /*
     * =========================
     * DAYS
     * =========================
     */

    numberOfDays:
      Number.parseFloat(
        request.days_count || 0,
      ),


    /*
     * =========================
     * DURATION
     * =========================
     */

    duration:
      request.half_day_period === 'NONE'
        ? 'Full Day'
        : request.half_day_period || '--',


    /*
     * =========================
     * STATUS
     * =========================
     */

    status:
      STATUS_MAP[request.status] ||
      request.status,


    /*
     * =========================
     * PARTIAL APPROVAL
     * =========================
     */

    approvedDates,

    rejectedDates,

    approvedDays:
      isPartiallyApproved
        ? approvedDates.length
        : Number.parseFloat(
            request.days_count || 0,
          ),

    rejectedDays:
      isPartiallyApproved
        ? rejectedDates.length
        : 0,

    displayDates:
      isPartiallyApproved
        ? approvedDates
        : [],


    /*
     * =========================
     * CONFLICT INFORMATION
     * =========================
     */

    conflicts,


    /*
     * =========================
     * REVIEWER
     * =========================
     */

    reviewedBy:
      getReviewerName(
        request.reviewed_by,
      ),

    reviewedOn:
      request.reviewed_at || '',

    reviewComment:
      request.review_note || '',
  }
}


function normalizeLeaveResponse(response) {
  if (!response) {
    return response
  }

  if (Array.isArray(response.results)) {
    return {
      ...response,

      results:
        response.results.map(
          normalizeLeaveRequest,
        ),
    }
  }

  if (Array.isArray(response)) {
    return response.map(
      normalizeLeaveRequest,
    )
  }

  return normalizeLeaveRequest(
    response,
  )
}


/*
 * =========================
 * EMPLOYEE LEAVE
 * =========================
 */

async function getLeaveRequests(
  params = {},
) {
  const response =
    await getMyLeaveRequests(params)

  return normalizeLeaveResponse(
    response,
  )
}


async function getLeaveRequestById(
  requestId,
) {
  const response =
    await getLeaveRequestByIdApi(
      requestId,
    )

  return normalizeLeaveRequest(
    response,
  )
}


async function applyLeave(payload) {
  const response =
    await createLeaveRequest(
      payload,
    )

  return normalizeLeaveRequest(
    response,
  )
}


async function requestLeaveCancellation(
  requestId,
) {
  const response =
    await cancelLeave(requestId)

  return normalizeLeaveRequest(
    response,
  )
}


/*
 * =========================
 * REVIEWER LEAVE
 * =========================
 */

async function getPendingRequests(
  params = {},
) {
  const response =
    await getPendingLeaveRequests(
      params,
    )

  return normalizeLeaveResponse(
    response,
  )
}


async function getUpcomingRequests(
  params = {},
) {
  const response =
    await getUpcomingLeaveRequests(
      params,
    )

  return normalizeLeaveResponse(
    response,
  )
}


async function approveLeave(
  requestId,
  { reviewComment = '' } = {},
) {
  const response =
    await approveLeaveRequest(
      requestId,
      {
        note: reviewComment.trim(),
      },
    )

  return normalizeLeaveRequest(
    response,
  )
}


async function rejectLeave(
  requestId,
  { reviewComment } = {},
) {
  if (
    !String(
      reviewComment || '',
    ).trim()
  ) {
    throw new Error(
      'A review comment is required to reject a leave request.',
    )
  }

  const response =
    await rejectLeaveRequest(
      requestId,
      {
        note: reviewComment.trim(),
      },
    )

  return normalizeLeaveRequest(
    response,
  )
}


async function partiallyAcceptLeave(
  requestId,
  { approvedDates } = {},
) {
  if (
    !Array.isArray(approvedDates) ||
    approvedDates.length === 0
  ) {
    throw new Error(
      'Select at least one approved date.',
    )
  }

  await partiallyApproveLeave(
    requestId,
    {
      approved_dates:
        approvedDates,
    },
  )

  /*
   * Partial approval endpoint does not
   * return the complete Leave object.
   */

  const updatedRequest =
    await getLeaveRequestByIdApi(
      requestId,
    )

  return normalizeLeaveRequest(
    updatedRequest,
  )
}


/*
 * =========================
 * CANCELLATION REVIEW
 * =========================
 */

async function approveLeaveCancellation(
  requestId,
) {
  const response =
    await approveLeaveCancellationApi(
      requestId,
    )

  return normalizeLeaveRequest(
    response,
  )
}


async function rejectLeaveCancellation(
  requestId,
) {
  const response =
    await rejectLeaveCancellationApi(
      requestId,
    )

  return normalizeLeaveRequest(
    response,
  )
}


/*
 * =========================
 * LEAVE CATALOG / SUMMARY
 * =========================
 */

async function getLeaveTypes() {
  return getLeaveTypesApi()
}


async function getLeaveSummary() {
  return getLeaveSummaryApi()
}


async function getLeaveBalance(
  params = {},
) {
  return getLeaveBalanceApi(params)
}


/*
 * =========================
 * PUBLIC API
 * =========================
 */

export {
  getLeaveTypes,
  getLeaveSummary,
  getLeaveBalance,

  getLeaveRequests,
  getLeaveRequestById,

  applyLeave,
  requestLeaveCancellation,

  getPendingRequests,
  getUpcomingRequests,

  approveLeave,
  rejectLeave,
  partiallyAcceptLeave,

  approveLeaveCancellation,
  rejectLeaveCancellation,
}