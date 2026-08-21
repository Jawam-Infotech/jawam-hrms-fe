/*
 * =========================
 * LEAVE STATUS CONFIGURATION
 * =========================
 *
 * Single source of truth for
 * Leave Review status behavior.
 */

export const LEAVE_STATUS_CONFIG = {
  Pending: {
    badgeClass:
      'bg-[#fef3c7] text-[#b45309]',

    showBalance: true,
    showConflict: true,
    showPartialDates: false,

    actions: true,

    reviewerLabel: '',
    reviewDetailLabel: '',
    reviewDetailKey: '',
  },

  Accepted: {
    badgeClass:
      'bg-[#dcfce7] text-[#15803d]',

    showBalance: false,
    showConflict: false,
    showPartialDates: false,

    actions: false,

    reviewerLabel: 'Approved',
    reviewDetailLabel: 'Review Comment',
    reviewDetailKey: 'reviewComment',
  },

  Rejected: {
    badgeClass:
      'bg-[#fee2e2] text-[#b91c1c]',

    showBalance: false,
    showConflict: false,
    showPartialDates: false,

    actions: false,

    reviewerLabel: 'Rejected',
    reviewDetailLabel: 'Review Comment',
    reviewDetailKey: 'reviewComment',
  },

  'Partially Accepted': {
    badgeClass:
      'bg-[#ffedd5] text-[#c2410c]',

    showBalance: false,
    showConflict: false,
    showPartialDates: true,

    actions: false,

    reviewerLabel: 'Approved',
    reviewDetailLabel: 'Review Comment',
    reviewDetailKey: 'reviewComment',
  },

  'Cancellation Requested': {
    badgeClass:
      'bg-[#ffedd5] text-[#c2410c]',

    showBalance: false,
    showConflict: false,
    showPartialDates: false,

    actions: true,

    reviewerLabel: '',
    reviewDetailLabel: '',
    reviewDetailKey: '',
  },

  Cancelled: {
    badgeClass:
      'bg-[#fee2e2] text-[#b91c1c]',

    showBalance: false,
    showConflict: false,
    showPartialDates: false,

    actions: false,

    reviewerLabel: 'Cancelled',
    reviewDetailLabel: 'Cancellation Reason',
    reviewDetailKey: 'cancellationReason',
  },
}


/*
 * =========================
 * STATUS OPTIONS
 * =========================
 */

export const LEAVE_STATUSES = [
  'All',
  ...Object.keys(
    LEAVE_STATUS_CONFIG,
  ),
]


/*
 * =========================
 * LEAVE TYPES
 * =========================
 *
 * Temporary frontend catalog.
 *
 * Once the backend leave-type
 * endpoint is connected, the
 * API should become the source
 * of truth.
 */

export const LEAVE_TYPES = [
  'All',
  'Casual Leave',
  'Sick Leave',
  'Privilege Leave',
  'Maternity Leave',
  'Work From Home',
]


/*
 * =========================
 * REVIEW TABLE COLUMNS
 * =========================
 */

export const LEAVE_REVIEW_COLUMNS = [
  'Employee Name',
  'Leave Type',
  'Start Date',
  'End Date',
  'Number of Days',
  'Reason',
  'Status',
  'Action',
]


/*
 * =========================
 * SORT OPTIONS
 * =========================
 */

export const LEAVE_SORT_OPTIONS = [
  {
    value: 'newest',
    label: 'Newest first',
  },

  {
    value: 'oldest',
    label: 'Oldest first',
  },

  {
    value: 'employee',
    label: 'Employee name',
  },
]


/*
 * =========================
 * PAGINATION
 * =========================
 */

export const LEAVE_REVIEW_PAGE_SIZE = 10