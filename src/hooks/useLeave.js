import useLeaveApplication from './useLeaveApplication.js'
import useLeaveCancellation from './useLeaveCancellation.js'
import useLeaveData from './useLeaveData.js'


function useLeave() {
  /*
   * =========================
   * LEAVE DATA
   * =========================
   */

  const {
    leaveTypes,
    summary,
    leaveBalances,
    history,

    historyPagination,
    changeHistoryPage,

    leaveTypesLoading,
    summaryLoading,
    balanceLoading,
    historyLoading,

    leaveTypesError,
    summaryError,
    balanceError,
    historyError,

    refresh,
  } = useLeaveData()


  /*
   * =========================
   * LEAVE APPLICATION
   * =========================
   */

  const {
    formState,
    handleFieldChange,
    handleApplyLeave,
    resetLeaveForm,

    validationErrors,
    requestedDays,

    applyLoading,
    applyError,
  } = useLeaveApplication(refresh)


  /*
   * =========================
   * LEAVE CANCELLATION
   * =========================
   */

  const {
    cancellationRequest,
    cancellationLoading,

    handleCancelRequest,
    handleRequestCancellation,
    clearCancellationRequest,
  } = useLeaveCancellation(refresh)


  /*
   * =========================
   * PUBLIC API
   * =========================
   *
   * This hook acts as the public
   * interface for the Leave module.
   *
   * Leave.jsx should not need to know
   * how the internal hooks are split.
   */

  return {
    /*
     * =========================
     * LEAVE DATA
     * =========================
     */

    leaveTypes,
    summary,
    leaveBalances,
    history,

    /*
     * Leave history pagination
     */

    historyPagination,
    changeHistoryPage,


    /*
     * =========================
     * LOADING STATES
     * =========================
     */

    leaveTypesLoading,
    summaryLoading,
    balanceLoading,
    historyLoading,

    applyLoading,
    cancellationLoading,


    /*
     * =========================
     * ERRORS
     * =========================
     */

    leaveTypesError,
    summaryError,
    balanceError,
    historyError,

    applyError,


    /*
     * =========================
     * LEAVE APPLICATION
     * =========================
     */

    formState,

    handleFieldChange,

    handleApplyLeave,

    resetLeaveForm,

    validationErrors,

    requestedDays,


    /*
     * =========================
     * LEAVE CANCELLATION
     * =========================
     */

    cancellationRequest,

    handleCancelRequest,

    handleRequestCancellation,

    clearCancellationRequest,


    /*
     * =========================
     * DATA REFRESH
     * =========================
     */

    refresh,
  }
}


export default useLeave