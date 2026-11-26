import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { UserContext } from '../context/UserContext.jsx'
import {
  createAnnouncement as createAnnouncementRequest,
  updateAnnouncement as updateAnnouncementRequest,
  deleteAnnouncement as deleteAnnouncementRequest,
} from '../services/announcementService.js'

function requireGeneralAnnouncement(announcement) {
  if (!announcement || typeof announcement !== 'object') throw new Error('A complete announcement is required.')
  if (announcement.id === undefined || announcement.id === null || String(announcement.id).trim() === '') throw new Error('Announcement ID is required.')
  if (announcement.type !== 'GENERAL') throw new Error('Only GENERAL announcements can be managed.')
  return announcement
}

function useAnnouncementManagement({ announcementState = {}, userId } = {}) {
  const context = useContext(UserContext)
  const identity = String(userId ?? context?.user?.id ?? 'anonymous')
  const mountedRef = useRef(false)
  const identityRef = useRef(identity)
  const createRequestRef = useRef(null)
  const updateRequestsRef = useRef(new Map())
  const deleteRequestsRef = useRef(new Map())
  const syncVersionRef = useRef(0)
  const announcementStateRef = useRef(announcementState)
  const [isCreating, setIsCreating] = useState(false)
  const [updatingAnnouncementIds, setUpdatingAnnouncementIds] = useState([])
  const [deletingAnnouncementIds, setDeletingAnnouncementIds] = useState([])
  const [mutationError, setMutationError] = useState(null)
  const [syncError, setSyncError] = useState(null)

  useEffect(() => {
    announcementStateRef.current = announcementState
  }, [announcementState])

  useEffect(() => {
    mountedRef.current = true
    const updateRequests = updateRequestsRef.current
    const deleteRequests = deleteRequestsRef.current
    return () => {
      mountedRef.current = false
      createRequestRef.current = null
      updateRequests.clear()
      deleteRequests.clear()
    }
  }, [])

  useEffect(() => {
    if (identityRef.current === identity) return
    identityRef.current = identity
    syncVersionRef.current += 1
    createRequestRef.current = null
    updateRequestsRef.current.clear()
    deleteRequestsRef.current.clear()
    setIsCreating(false)
    setUpdatingAnnouncementIds([])
    setDeletingAnnouncementIds([])
    setMutationError(null)
    setSyncError(null)
  }, [identity])

  const synchronize = useCallback(async ({ refreshUnread = false } = {}) => {
    const syncVersion = ++syncVersionRef.current
    const syncIdentity = identityRef.current
    let refreshed
    let listError = null
    try {
      refreshed = await announcementStateRef.current.refreshAnnouncements?.()
      if (!mountedRef.current || identityRef.current !== syncIdentity || syncVersion !== syncVersionRef.current) return { refreshed, error: null }
      const latestPage = announcementStateRef.current.currentPage ?? 1
      if (refreshed?.results?.length === 0 && latestPage > 1) {
        await announcementStateRef.current.goToPage?.(latestPage - 1)
      }
    } catch (error) {
      listError = error
    }

    let unreadError = null
    if (refreshUnread) {
      if (!mountedRef.current || identityRef.current !== syncIdentity || syncVersion !== syncVersionRef.current) return { refreshed, error: null }
      try {
        await announcementStateRef.current.fetchUnreadCount?.()
      } catch (error) {
        unreadError = error
      }
    }

    const synchronizationError = listError || unreadError
    if (mountedRef.current && identityRef.current === syncIdentity && syncVersion === syncVersionRef.current) {
      if (synchronizationError) setSyncError(synchronizationError)
      else setSyncError(null)
    }
    return { refreshed, error: synchronizationError }
  }, [])

  const createAnnouncement = useCallback((payload) => {
    if (createRequestRef.current) return createRequestRef.current
    const requestIdentity = identityRef.current
    setMutationError(null)
    setIsCreating(true)
    const request = createAnnouncementRequest(payload)
      .then(async (response) => {
        if (mountedRef.current && identityRef.current === requestIdentity) await synchronize({ refreshUnread: true })
        return response
      })
      .catch((error) => {
        if (mountedRef.current && identityRef.current === requestIdentity) setMutationError(error)
        throw error
      })
      .finally(() => {
        if (createRequestRef.current === request) createRequestRef.current = null
        if (mountedRef.current && identityRef.current === requestIdentity) setIsCreating(false)
      })
    createRequestRef.current = request
    return request
  }, [synchronize])

  const updateAnnouncement = useCallback((announcement, changes = {}) => {
    let validAnnouncement
    try {
      validAnnouncement = requireGeneralAnnouncement(announcement)
    } catch (error) {
      return Promise.reject(error)
    }
    const id = validAnnouncement.id
    if (updateRequestsRef.current.has(id)) return updateRequestsRef.current.get(id)
    const requestIdentity = identityRef.current
    const refreshUnread = Object.prototype.hasOwnProperty.call(changes, 'visible_from') || Object.prototype.hasOwnProperty.call(changes, 'visible_until')
    setMutationError(null)
    setUpdatingAnnouncementIds((ids) => ids.includes(id) ? ids : [...ids, id])
    const request = updateAnnouncementRequest(id, changes)
      .then(async (response) => {
        if (mountedRef.current && identityRef.current === requestIdentity) await synchronize({ refreshUnread })
        return response
      })
      .catch((error) => {
        if (mountedRef.current && identityRef.current === requestIdentity) setMutationError(error)
        throw error
      })
      .finally(() => {
        if (updateRequestsRef.current.get(id) === request) updateRequestsRef.current.delete(id)
        if (mountedRef.current && identityRef.current === requestIdentity) setUpdatingAnnouncementIds((ids) => ids.filter((itemId) => itemId !== id))
      })
    updateRequestsRef.current.set(id, request)
    return request
  }, [synchronize])

  const deleteAnnouncement = useCallback((announcement) => {
    let validAnnouncement
    try {
      validAnnouncement = requireGeneralAnnouncement(announcement)
    } catch (error) {
      return Promise.reject(error)
    }
    const id = validAnnouncement.id
    if (deleteRequestsRef.current.has(id)) return deleteRequestsRef.current.get(id)
    const requestIdentity = identityRef.current
    setMutationError(null)
    setDeletingAnnouncementIds((ids) => ids.includes(id) ? ids : [...ids, id])
    const request = deleteAnnouncementRequest(id)
      .then(async (response) => {
        if (mountedRef.current && identityRef.current === requestIdentity) await synchronize({ refreshUnread: true })
        return response
      })
      .catch((error) => {
        if (mountedRef.current && identityRef.current === requestIdentity) setMutationError(error)
        throw error
      })
      .finally(() => {
        if (deleteRequestsRef.current.get(id) === request) deleteRequestsRef.current.delete(id)
        if (mountedRef.current && identityRef.current === requestIdentity) setDeletingAnnouncementIds((ids) => ids.filter((itemId) => itemId !== id))
      })
    deleteRequestsRef.current.set(id, request)
    return request
  }, [synchronize])

  return { createAnnouncement, updateAnnouncement, deleteAnnouncement, isCreating, updatingAnnouncementIds, deletingAnnouncementIds, mutationError, syncError }
}

export default useAnnouncementManagement
