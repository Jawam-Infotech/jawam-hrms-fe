import { useCallback, useEffect, useRef, useState } from 'react'
import {
  getPayrolls,
  getPayrollById,
  approvePayroll,
  rejectPayroll,
  requestPayrollCorrection,
  applyPayrollCorrection,
  startPayrollCorrection,
  payPayroll,
  regeneratePayroll,
  requestPayrollCancellation,
  approvePayrollCancellation,
  rejectPayrollCancellation,
  createPayrollReplacement,
  getPayrollSettings,
  generatePayroll,
  approveLateGeneration,
} from '../../services/payrollService.js'

import { getEmployees } from '../../services/employeeService.js'


function usePayrollData(initialFilters = {}) {
  const [payrolls, setPayrolls] = useState([])
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  })

  const [payroll, setPayroll] = useState(null)
  const [settings, setSettings] = useState(null)
  const [employees, setEmployees] = useState([])

  const [filters, setFilters] = useState({ page: 1, ...initialFilters })

  const [loading, setLoading] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [approvalLoading, setApprovalLoading] = useState(false)
  const [settingsLoading, setSettingsLoading] = useState(false)
  const [employeesLoading, setEmployeesLoading] = useState(false)

  const [error, setError] = useState(null)
  const [detailError, setDetailError] = useState(null)
  const [approvalError, setApprovalError] = useState(null)
  const [rejectionLoading, setRejectionLoading] = useState(false)
  const [rejectionError, setRejectionError] = useState(null)
  const [cancellationLoading, setCancellationLoading] = useState(false)
  const [cancellationError, setCancellationError] = useState(null)
  const [correctionLoading, setCorrectionLoading] = useState(false)
  const [correctionError, setCorrectionError] = useState(null)
  const [regenerateLoading, setRegenerateLoading] = useState(false)
  const [regenerateError, setRegenerateError] = useState(null)
  const [settingsError, setSettingsError] = useState(null)
  const [employeesError, setEmployeesError] = useState(null)

  const [generateLoading, setGenerateLoading] = useState(false)
const [generateError, setGenerateError] = useState(null)
  const [lateGenerationLoading, setLateGenerationLoading] = useState(false)
const [lateGenerationError, setLateGenerationError] = useState(null)
  const listRequestRef = useRef(0)
  const detailRequestRef = useRef(0)

  useEffect(() => () => {
    listRequestRef.current += 1
    detailRequestRef.current += 1
  }, [])
const handleGeneratePayroll = useCallback(async (salaryMonth) => {
  setGenerateLoading(true)
  setGenerateError(null)

  try {
    const data = await generatePayroll(salaryMonth)

    return data
  } catch (requestError) {
    setGenerateError(requestError)
    throw requestError
  } finally {
    setGenerateLoading(false)
  }
}, [])

const clearGenerateError = useCallback(() => {
  setGenerateError(null)
}, [])

const handleApproveLateGeneration = useCallback(async (payload) => {
  setLateGenerationLoading(true)
  setLateGenerationError(null)

  try {
    return await approveLateGeneration(payload)
  } catch (requestError) {
    setLateGenerationError(requestError)
    throw requestError
  } finally {
    setLateGenerationLoading(false)
  }
}, [])

const clearLateGenerationError = useCallback(() => {
  setLateGenerationError(null)
}, [])



  const fetchPayrolls = useCallback(async (nextFilters = filters) => {
    const requestId = listRequestRef.current + 1
    listRequestRef.current = requestId
    setLoading(true)
    setError(null)

    try {
      const data = await getPayrolls(nextFilters)

      if (listRequestRef.current !== requestId) return data
      setPayrolls(data.payrolls)
      setPagination({
        count: data.count,
        next: data.next,
        previous: data.previous,
      })

      return data
    } catch (requestError) {
      if (listRequestRef.current === requestId) setError(requestError)
      throw requestError
    } finally {
      if (listRequestRef.current === requestId) setLoading(false)
    }
  }, [filters])


  const fetchPayrollById = useCallback(async (payrollId) => {
    const requestId = detailRequestRef.current + 1
    detailRequestRef.current = requestId
    if (!payrollId) {
      return null
    }

    setDetailLoading(true)
    setDetailError(null)

    try {
      const data = await getPayrollById(payrollId)
      if (detailRequestRef.current !== requestId) return data
      setPayroll(data)

      return data
    } catch (requestError) {
      if (detailRequestRef.current === requestId) setDetailError(requestError)
      throw requestError
    } finally {
      if (detailRequestRef.current === requestId) setDetailLoading(false)
    }
  }, [])

  const handleApprovePayroll = useCallback(async (payrollId) => {
    setApprovalLoading(true)
    setApprovalError(null)

    try {
      const data = await approvePayroll(payrollId)
      setPayroll(data)
      return data
    } catch (requestError) {
      setApprovalError(requestError)
      throw requestError
    } finally {
      setApprovalLoading(false)
    }
  }, [])

  const handleRejectPayroll = useCallback(async (payrollId, payload) => {
    setRejectionLoading(true)
    setRejectionError(null)
    try {
      const data = await rejectPayroll(payrollId, payload)
      setPayroll(data)
      return data
    } catch (requestError) {
      setRejectionError(requestError)
      throw requestError
    } finally {
      setRejectionLoading(false)
    }
  }, [])

  const handleRequestPayrollCancellation = useCallback(async (payrollId, reason) => {
    setCancellationLoading(true)
    setCancellationError(null)
    try {
      const data = await requestPayrollCancellation(payrollId, reason)
      setPayroll(data)
      return data
    } catch (requestError) {
      setCancellationError(requestError)
      throw requestError
    } finally {
      setCancellationLoading(false)
    }
  }, [])

  const handleApprovePayrollCancellation = useCallback(async (payrollId) => {
    setCancellationLoading(true)
    setCancellationError(null)
    try {
      const data = await approvePayrollCancellation(payrollId)
      setPayroll(data)
      return data
    } catch (requestError) {
      setCancellationError(requestError)
      throw requestError
    } finally {
      setCancellationLoading(false)
    }
  }, [])

  const handleRejectPayrollCancellation = useCallback(async (payrollId, reason) => {
    const trimmedReason = typeof reason === 'string' ? reason.trim() : ''
    if (!trimmedReason) throw new Error('A cancellation rejection reason is required.')
    setCancellationLoading(true)
    setCancellationError(null)
    try {
      const data = await rejectPayrollCancellation(payrollId, { reason: trimmedReason })
      setPayroll(data)
      return data
    } catch (requestError) {
      setCancellationError(requestError)
      throw requestError
    } finally {
      setCancellationLoading(false)
    }
  }, [])

  const handleCreatePayrollReplacement = useCallback(async (payrollId) => {
    setCancellationLoading(true)
    setCancellationError(null)
    try {
      return await createPayrollReplacement(payrollId)
    } catch (requestError) {
      setCancellationError(requestError)
      throw requestError
    } finally {
      setCancellationLoading(false)
    }
  }, [])

  const handleRequestPayrollCorrection = useCallback(async (payrollId, payload) => {
    setCorrectionLoading(true)
    setCorrectionError(null)
    try {
      const data = await requestPayrollCorrection(payrollId, payload)
      setPayroll(data)
      return data
    } catch (requestError) {
      setCorrectionError(requestError)
      throw requestError
    } finally {
      setCorrectionLoading(false)
    }
  }, [])

  const handleApplyPayrollCorrection = useCallback(async (payrollId, payload) => {
    setCorrectionLoading(true)
    setCorrectionError(null)
    try {
      const data = await applyPayrollCorrection(payrollId, payload)
      setPayroll(data)
      return data
    } catch (requestError) {
      setCorrectionError(requestError)
      throw requestError
    } finally {
      setCorrectionLoading(false)
    }
  }, [])

  const handleStartPayrollCorrection = useCallback(async (payrollId, payload) => {
    setCorrectionLoading(true)
    setCorrectionError(null)
    try {
      const data = await startPayrollCorrection(payrollId, payload)
      setPayroll(data)
      return data
    } catch (requestError) {
      setCorrectionError(requestError)
      throw requestError
    } finally {
      setCorrectionLoading(false)
    }
  }, [])

  const handlePayPayroll = useCallback(async (payrollId, payload) => {
    setCorrectionLoading(true)
    setCorrectionError(null)
    try {
      const data = await payPayroll(payrollId, payload)
      setPayroll(data)
      return data
    } catch (requestError) {
      setCorrectionError(requestError)
      throw requestError
    } finally {
      setCorrectionLoading(false)
    }
  }, [])

  const handleRegeneratePayroll = useCallback(async (payrollId) => {
    setRegenerateLoading(true)
    setRegenerateError(null)
    try {
      const data = await regeneratePayroll(payrollId)
      setPayroll(data)
      return data
    } catch (requestError) {
      setRegenerateError(requestError)
      throw requestError
    } finally {
      setRegenerateLoading(false)
    }
  }, [])


  const fetchPayrollSettings = useCallback(async () => {
    setSettingsLoading(true)
    setSettingsError(null)

    try {
      const data = await getPayrollSettings()
      setSettings(data)

      return data
    } catch (requestError) {
      setSettingsError(requestError)
      throw requestError
    } finally {
      setSettingsLoading(false)
    }
  }, [])

  const fetchEmployees = useCallback(async (search = '') => {
  setEmployeesLoading(true)
  setEmployeesError(null)

  try {
    const data = await getEmployees({
      page: 1,
      search,
    })

    setEmployees(data.employees)

    return data
  } catch (requestError) {
    setEmployeesError(requestError)
    throw requestError
  } finally {
    setEmployeesLoading(false)
  }
}, [])


  const updateFilters = useCallback((nextFilters) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      ...nextFilters,
      page: 1,
    }))
  }, [])


  const changePage = useCallback((page) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      page,
    }))
  }, [])


  const refresh = useCallback(() => {
    return fetchPayrolls()
  }, [fetchPayrolls])




 return {
  payrolls,
  pagination,
  payroll,
  settings,
  employees,

  filters,

  loading,
  detailLoading,
  approvalLoading,
  rejectionLoading,
  correctionLoading,
  regenerateLoading,
  settingsLoading,
  employeesLoading,
  generateLoading,
  lateGenerationLoading,

  error,
  detailError,
  approvalError,
  rejectionError,
  correctionError,
  regenerateError,
  settingsError,
  employeesError,
  generateError,
  clearGenerateError,
  lateGenerationError,
  clearLateGenerationError,

  fetchPayrolls,
  fetchPayrollById,
  handleApprovePayroll,
  handleRejectPayroll,
  handleRequestPayrollCancellation,
  handleApprovePayrollCancellation,
  handleRejectPayrollCancellation,
  handleCreatePayrollReplacement,
  cancellationLoading,
  cancellationError,
  handleRequestPayrollCorrection,
  handleApplyPayrollCorrection,
  handleStartPayrollCorrection,
  handlePayPayroll,
  handleRegeneratePayroll,
  fetchPayrollSettings,
  fetchEmployees,
  handleGeneratePayroll,
  handleApproveLateGeneration,

  updateFilters,
  changePage,

  refresh,
}
}


export default usePayrollData
