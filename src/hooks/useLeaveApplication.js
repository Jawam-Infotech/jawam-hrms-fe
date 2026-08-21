import {
  useCallback,
  useMemo,
  useState,
} from 'react'

import { applyLeave } from '../services/leaveService.js'

import {
  calculateLeaveDays,
} from '../utils/leaveUtils.js'


/*
 * =========================
 * CONSTANTS
 * =========================
 */

const INITIAL_FORM_STATE = {
  leaveType: '',
  startDate: '',
  endDate: '',
  duration: 'Full Day',
  reason: '',
}


const HALF_DAY_PERIOD_MAP = {
  'Full Day': 'NONE',
  'First Half': 'FIRST_HALF',
  'Second Half': 'SECOND_HALF',
}


/*
 * =========================
 * VALIDATION
 * =========================
 */

function validateLeaveForm(formState) {
  const errors = {}

  const {
    leaveType,
    startDate,
    endDate,
    duration,
    reason,
  } = formState

  /*
   * Leave type
   */
  if (!String(leaveType || '').trim()) {
    errors.leaveType =
      'Please select a leave type.'
  }

  /*
   * Start date
   */
  if (!startDate) {
    errors.startDate =
      'Please select a start date.'
  }

  /*
   * End date
   */
  if (!endDate) {
    errors.endDate =
      'Please select an end date.'
  }

  /*
   * Date range
   */
  if (startDate && endDate) {
    if (endDate < startDate) {
      errors.endDate =
        'End date cannot be before the start date.'
    }
  }

  /*
   * Half-day leave must be
   * for a single date.
   */
  if (
    duration !== 'Full Day' &&
    startDate &&
    endDate &&
    startDate !== endDate
  ) {
    errors.duration =
      'Half-day leave can only be applied for one day.'
  }

  /*
   * Reason
   */
  if (!String(reason || '').trim()) {
    errors.reason =
      'Please provide a reason for your leave.'
  }

  return errors
}


/*
 * =========================
 * HOOK
 * =========================
 */

function useLeaveApplication(refresh) {
  /*
   * =========================
   * FORM STATE
   * =========================
   */

  const [
    formState,
    setFormState,
  ] = useState(INITIAL_FORM_STATE)


  /*
   * =========================
   * VALIDATION STATE
   * =========================
   */

  const [
    validationErrors,
    setValidationErrors,
  ] = useState({})


  /*
   * =========================
   * SUBMISSION STATE
   * =========================
   */

  const [
    applyLoading,
    setApplyLoading,
  ] = useState(false)


  const [
    applyError,
    setApplyError,
  ] = useState('')


  /*
   * =========================
   * REQUESTED DAYS
   * =========================
   *
   * Full Day:
   *
   * 1 date  = 1 day
   * 3 dates = 3 days
   *
   * Half Day:
   *
   * 1 date = 0.5 day
   */

  const requestedDays = useMemo(() => {
    const {
      startDate,
      endDate,
      duration,
    } = formState

    if (!startDate || !endDate) {
      return 0
    }

    const totalDays =
      calculateLeaveDays(
        startDate,
        endDate,
      )

    if (totalDays <= 0) {
      return 0
    }

    if (duration !== 'Full Day') {
      return 0.5
    }

    return totalDays
  }, [formState])


  /*
   * =========================
   * FIELD CHANGE
   * =========================
   */

  const handleFieldChange = useCallback(
    (name, value) => {
      setFormState((previous) => ({
        ...previous,
        [name]: value,
      }))

      /*
       * Clear validation error for
       * the field currently being edited.
       */
      setValidationErrors(
        (previous) => {
          if (!previous[name]) {
            return previous
          }

          const next = {
            ...previous,
          }

          delete next[name]

          return next
        },
      )

      /*
       * Clear general API error
       * when the user edits the form.
       */
      setApplyError('')
    },
    [],
  )


  /*
   * =========================
   * APPLY LEAVE
   * =========================
   */

  const handleApplyLeave = useCallback(
    async () => {
      /*
       * Prevent duplicate submissions.
       */
      if (applyLoading) {
        return {
          ok: false,
          reason: 'submission_in_progress',
        }
      }

      /*
       * Validate form before
       * making an API request.
       */
      const errors =
        validateLeaveForm(
          formState,
        )

      if (
        Object.keys(errors).length > 0
      ) {
        setValidationErrors(errors)

        setApplyError(
          'Please correct the highlighted fields before applying.',
        )

        return {
          ok: false,
          reason: 'validation',
          errors,
        }
      }

      try {
        setApplyLoading(true)
        setApplyError('')
        setValidationErrors({})


        /*
         * =========================
         * BACKEND PAYLOAD
         * =========================
         *
         * The attachment is intentionally
         * not sent because the current
         * backend contract does not
         * support file upload.
         */

        const payload = {
          leave_type:
            formState.leaveType,

          start_date:
            formState.startDate,

          end_date:
            formState.endDate,

          half_day_period:
            HALF_DAY_PERIOD_MAP[
              formState.duration
            ],

          reason:
            formState.reason.trim(),

          document_reference: '',
        }


        /*
         * Create leave request.
         */
        await applyLeave(payload)


        /*
         * Refresh all leave data from
         * the backend after success.
         */
        await refresh()


        /*
         * Reset only after both
         * API submission and refresh
         * have completed successfully.
         */
        setFormState(
          INITIAL_FORM_STATE,
        )

        setValidationErrors({})
        setApplyError('')


        return {
          ok: true,
        }
      } catch (error) {
        console.error(
          'Failed to apply leave:',
          error,
        )

        const message =
          error?.message ||
          'Unable to apply for leave.'

        setApplyError(message)

        return {
          ok: false,
          reason: 'api',
          error,
        }
      } finally {
        setApplyLoading(false)
      }
    },
    [
      applyLoading,
      formState,
      refresh,
    ],
  )


  /*
   * =========================
   * RESET FORM
   * =========================
   */

  const resetLeaveForm =
    useCallback(() => {
      setFormState(
        INITIAL_FORM_STATE,
      )

      setValidationErrors({})
      setApplyError('')
    }, [])


  /*
   * =========================
   * RETURN
   * =========================
   */

  return {
    /*
     * Form
     */
    formState,

    handleFieldChange,

    resetLeaveForm,


    /*
     * Validation
     */
    validationErrors,

    requestedDays,


    /*
     * Submission
     */
    handleApplyLeave,

    applyLoading,

    applyError,
  }
}


export default useLeaveApplication