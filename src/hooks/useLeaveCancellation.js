import { useCallback, useState } from 'react'

import {
  requestLeaveCancellation,
} from '../services/leaveService.js'


function useLeaveCancellation(refresh) {
  /*
   * =========================
   * STATE
   * =========================
   */

  const [
    cancellationRequest,
    setCancellationRequest,
  ] = useState(null)

  const [
    cancellationLoading,
    setCancellationLoading,
  ] = useState(false)

  const [
    cancellationError,
    setCancellationError,
  ] = useState('')


  /*
   * =========================
   * CANCEL PENDING LEAVE
   * =========================
   *
   * PENDING → CANCELLED
   *
   * Pending leaves do not need the
   * cancellation modal.
   */

  const cancelPendingLeave =
    useCallback(
      async (entry) => {
        if (!entry?.id) {
          throw new Error(
            'Leave request ID is required.',
          )
        }

        try {
          setCancellationLoading(true)
          setCancellationError('')

          await requestLeaveCancellation(
            entry.id,
          )

          await refresh()
        } catch (error) {
          console.error(
            'Failed to cancel pending leave:',
            error,
          )

          const message =
            error?.message ||
            'Unable to cancel this leave request.'

          setCancellationError(message)

          throw error
        } finally {
          setCancellationLoading(false)
        }
      },
      [refresh],
    )


  /*
   * =========================
   * OPEN CANCELLATION FLOW
   * =========================
   *
   * Determines which cancellation
   * workflow should be used.
   */

  const handleCancelRequest =
    useCallback(
      (entry) => {
        if (!entry?.id) {
          return
        }

        setCancellationError('')


        /*
         * These statuses cannot
         * be cancelled again.
         */

        if (
          entry.status === 'Rejected' ||
          entry.status === 'Cancelled' ||
          entry.status ===
            'Cancellation Requested'
        ) {
          return
        }


        /*
         * Approved and partially
         * approved leaves require
         * cancellation approval.
         */

        if (
          entry.status === 'Accepted' ||
          entry.status ===
            'Partially Accepted'
        ) {
          setCancellationRequest({
            ...entry,
            cancellationReason: '',
          })

          return
        }


        /*
         * Pending leaves can be
         * cancelled directly.
         */

        if (
          entry.status === 'Pending'
        ) {
          void cancelPendingLeave(entry)
        }
      },
      [cancelPendingLeave],
    )


  /*
   * =========================
   * REQUEST CANCELLATION
   * =========================
   *
   * Accepted / Partially Accepted
   *
   * → Cancellation Requested
   */

  const handleRequestCancellation =
    useCallback(
      async ({
        cancellationReason = '',
      } = {}) => {
        if (!cancellationRequest?.id) {
          return
        }

        const trimmedReason =
          cancellationReason.trim()

        if (!trimmedReason) {
          throw new Error(
            'A cancellation reason is required.',
          )
        }

        try {
          setCancellationLoading(true)
          setCancellationError('')

          /*
           * The current service contract only
           * accepts the leave request ID.
           *
           * Keep the reason available in the
           * UI workflow until the backend
           * contract is implemented.
           */

          await requestLeaveCancellation(
            cancellationRequest.id,
          )

          await refresh()

          setCancellationRequest(null)
        } catch (error) {
          console.error(
            'Failed to request leave cancellation:',
            error,
          )

          const message =
            error?.message ||
            'Unable to request leave cancellation.'

          setCancellationError(message)

          throw error
        } finally {
          setCancellationLoading(false)
        }
      },
      [
        cancellationRequest,
        refresh,
      ],
    )


  /*
   * =========================
   * CLEAR CANCELLATION
   * =========================
   */

  const clearCancellationRequest =
    useCallback(() => {
      if (cancellationLoading) {
        return
      }

      setCancellationRequest(null)
      setCancellationError('')
    }, [cancellationLoading])


  /*
   * =========================
   * RETURN PUBLIC API
   * =========================
   */

  return {
    cancellationRequest,
    cancellationLoading,
    cancellationError,

    handleCancelRequest,
    handleRequestCancellation,
    clearCancellationRequest,
  }
}


export default useLeaveCancellation