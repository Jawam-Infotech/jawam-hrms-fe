import { useCallback, useRef, useState } from 'react'
import { applySettlementCorrection, approveSettlement, cancelSettlement, createSettlementReplacement, downloadSettlementStatement, getSettlementById, paySettlement, regenerateSettlement, rejectSettlement, requestSettlementCorrection, requestSettlementCeoCorrection } from '../../services/settlementService.js'

function useFinalSettlementDetail(settlementId) {
  const [settlement, setSettlement] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState(null)
  const [correctionLoading, setCorrectionLoading] = useState(false)
  const [correctionError, setCorrectionError] = useState(null)
  const [cancellationLoading, setCancellationLoading] = useState(false)
  const [cancellationError, setCancellationError] = useState(null)
  const [statementLoading, setStatementLoading] = useState(false)
  const [statementError, setStatementError] = useState(null)
  const requestRef = useRef(0)

  const fetchSettlement = useCallback(async () => {
    if (!settlementId) {
      setSettlement(null)
      return null
    }

    const requestId = requestRef.current + 1
    requestRef.current = requestId
    setSettlement(null)
    setLoading(true)
    setError(null)

    try {
      const data = await getSettlementById(settlementId)
      if (requestRef.current !== requestId) return null
      setSettlement(data)
      return data
    } catch (requestError) {
      if (requestRef.current === requestId) setError(requestError)
      throw requestError
    } finally {
      if (requestRef.current === requestId) setLoading(false)
    }
  }, [settlementId])

  const runAction = useCallback(async (action) => {
    setActionLoading(true)
    setActionError(null)
    try {
      await action()
      return await fetchSettlement()
    } catch (requestError) {
      setActionError(requestError)
      throw requestError
    } finally {
      setActionLoading(false)
    }
  }, [fetchSettlement])

  const regenerate = useCallback(() => runAction(() => regenerateSettlement(settlementId)), [runAction, settlementId])

  const getData = useCallback(() => runAction(() => regenerateSettlement(settlementId)), [runAction, settlementId])

  const downloadStatement = useCallback(async () => {
    if (statementLoading || !settlementId) return
    setStatementLoading(true)
    setStatementError(null)
    try {
      return await downloadSettlementStatement(settlementId)
    } catch (requestError) {
      setStatementError(requestError)
      throw requestError
    } finally {
      setStatementLoading(false)
    }
  }, [settlementId, statementLoading])

  const approve = useCallback(() => runAction(() => approveSettlement(settlementId)), [runAction, settlementId])
  const reject = useCallback((reason) => runAction(() => {
    const trimmedReason = typeof reason === 'string' ? reason.trim() : ''
    if (!trimmedReason) {
      throw new Error('A rejection reason is required.')
    }
    return rejectSettlement(settlementId, { reason: trimmedReason })
  }), [runAction, settlementId])
  const pay = useCallback((payload) => runAction(() => paySettlement(settlementId, payload)), [runAction, settlementId])
  const cancel = useCallback(async (reason) => {
    setCancellationLoading(true)
    setCancellationError(null)
    try {
      await cancelSettlement(settlementId, reason)
      return await fetchSettlement()
    } catch (requestError) {
      setCancellationError(requestError)
      throw requestError
    } finally {
      setCancellationLoading(false)
    }
  }, [fetchSettlement, settlementId])
  const createReplacement = useCallback(async () => {
    setCancellationLoading(true)
    setCancellationError(null)
    try {
      return await createSettlementReplacement(settlementId)
    } catch (requestError) {
      setCancellationError(requestError)
      throw requestError
    } finally {
      setCancellationLoading(false)
    }
  }, [settlementId])
  const requestCorrection = useCallback((payload) => runAction(() => requestSettlementCeoCorrection(settlementId, payload)), [runAction, settlementId])
  const requestHrCorrection = useCallback(async (payload) => {
    setCorrectionLoading(true)
    setCorrectionError(null)
    try {
      await requestSettlementCorrection(settlementId, payload)
      return await fetchSettlement()
    } catch (requestError) {
      setCorrectionError(requestError)
      throw requestError
    } finally {
      setCorrectionLoading(false)
    }
  }, [fetchSettlement, settlementId])
  const applyHrCorrection = useCallback(async (payload) => {
    setCorrectionLoading(true)
    setCorrectionError(null)
    try {
      await applySettlementCorrection(settlementId, payload)
      return await fetchSettlement()
    } catch (requestError) {
      setCorrectionError(requestError)
      throw requestError
    } finally {
      setCorrectionLoading(false)
    }
  }, [fetchSettlement, settlementId])

  return { settlement, loading, error, actionLoading, actionError, correctionLoading, correctionError, cancellationLoading, cancellationError, statementLoading, statementError, fetchSettlement, regenerate, getData, downloadStatement, approve, reject, pay, cancel, createReplacement, requestCorrection, requestHrCorrection, applyHrCorrection, refresh: fetchSettlement }
}

export default useFinalSettlementDetail
