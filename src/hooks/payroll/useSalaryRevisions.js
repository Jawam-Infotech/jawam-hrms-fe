import { useCallback, useState } from 'react'
import {
  getSalaryRevisions,
  createSalaryRevision,
  getSalaryRevisionById,
  approveSalaryRevision,
  rejectSalaryRevision,
} from '../../services/payrollService.js'


function useSalaryRevisions() {
  const [revisions, setRevisions] = useState([])
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    page: 1,
  })

  const [revision, setRevision] = useState(null)

  const [loading, setLoading] = useState(false)
  const [detailLoading, setDetailLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const [error, setError] = useState(null)
  const [detailError, setDetailError] = useState(null)
  const [actionError, setActionError] = useState(null)


  const fetchRevisions = useCallback(async (filters = {}) => {
    setLoading(true)
    setError(null)

    try {
      const data = await getSalaryRevisions(filters)

      setRevisions(data.revisions)
      setPagination({
        count: data.count,
        next: data.next,
        previous: data.previous,
        page: filters.page || 1,
      })

      return data
    } catch (requestError) {
      setError(requestError)
      throw requestError
    } finally {
      setLoading(false)
    }
  }, [])


  const fetchRevisionById = useCallback(async (revisionId) => {
    if (!revisionId) {
      return null
    }

    setDetailLoading(true)
    setDetailError(null)

    try {
      const data = await getSalaryRevisionById(revisionId)

      setRevision(data)

      return data
    } catch (requestError) {
      setDetailError(requestError)
      throw requestError
    } finally {
      setDetailLoading(false)
    }
  }, [])


  const handleCreateRevision = useCallback(async (payload) => {
    setActionLoading(true)
    setActionError(null)

    try {
      const data = await createSalaryRevision(payload)

      return data
    } catch (requestError) {
      setActionError(requestError)
      throw requestError
    } finally {
      setActionLoading(false)
    }
  }, [])


  const handleApproveRevision = useCallback(async (revisionId, reason) => {
    setActionLoading(true)
    setActionError(null)

    try {
      const data = await approveSalaryRevision(revisionId, reason)

      setRevision(data)

      return data
    } catch (requestError) {
      setActionError(requestError)
      throw requestError
    } finally {
      setActionLoading(false)
    }
  }, [])


  const handleRejectRevision = useCallback(async (revisionId, reason) => {
    setActionLoading(true)
    setActionError(null)

    try {
      const data = await rejectSalaryRevision(
        revisionId,
        reason,
      )

      setRevision(data)

      return data
    } catch (requestError) {
      setActionError(requestError)
      throw requestError
    } finally {
      setActionLoading(false)
    }
  }, [])


  const clearRevision = useCallback(() => {
    setRevision(null)
    setDetailError(null)
  }, [])


  const clearRevisionActionError = useCallback(() => {
    setActionError(null)
  }, [])


  return {
    revisions,
    pagination,
    revision,

    loading,
    detailLoading,
    actionLoading,

    error,
    detailError,
    actionError,

    fetchRevisions,
    fetchRevisionById,

    handleCreateRevision,
    handleApproveRevision,
    handleRejectRevision,

    clearRevision,
    clearRevisionActionError,
  }
}


export default useSalaryRevisions
