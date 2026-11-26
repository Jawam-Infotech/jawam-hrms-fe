import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { UserContext } from '../context/UserContext.jsx'
import { getAnnouncements, getUnreadAnnouncementCount, markAnnouncementAsRead } from '../services/announcementService.js'
import { normalizeAnnouncementList } from '../utils/announcementUtils.js'

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 20

function safeUnreadCount(response) {
  const value = typeof response === 'number' ? response : response?.unread_count
  const count = Number(value)
  return Number.isFinite(count) && count >= 0 ? count : 0
}

function useAnnouncements({ type = '', pageSize = DEFAULT_PAGE_SIZE, userId } = {}) {
  const context = useContext(UserContext)
  const identity = String(userId ?? context?.user?.id ?? 'anonymous')
  const [announcements, setAnnouncements] = useState([])
  const [count, setCount] = useState(0)
  const [next, setNext] = useState(null)
  const [previous, setPrevious] = useState(null)
  const [currentPage, setCurrentPage] = useState(DEFAULT_PAGE)
  const [activePageSize, setActivePageSize] = useState(pageSize)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [isUnreadCountLoading, setIsUnreadCountLoading] = useState(true)
  const [unreadCountError, setUnreadCountError] = useState(null)
  const [pendingReadIds, setPendingReadIds] = useState([])
  const [allAnnouncements, setAllAnnouncements] = useState([])
  const [isAllLoading, setIsAllLoading] = useState(false)
  const [allError, setAllError] = useState(null)
  const mountedRef = useRef(false)
  const identityRef = useRef(identity)
  const requestVersionRef = useRef(0)
  const unreadVersionRef = useRef(0)
  const readRequestsRef = useRef(new Map())
  const expiryTimerRef = useRef(null)
  const currentQueryRef = useRef({ type, page: DEFAULT_PAGE, page_size: pageSize })
  const initializedRef = useRef(false)
  const announcementsRef = useRef([])
  const allRequestRef = useRef(null)
  const allLoadedRef = useRef(false)

  const isCurrent = useCallback((requestIdentity, version) => (
    mountedRef.current && identityRef.current === requestIdentity && version === requestVersionRef.current
  ), [])

  const fetchUnreadCount = useCallback(async () => {
    const requestIdentity = identityRef.current
    const version = ++unreadVersionRef.current
    setIsUnreadCountLoading(true)
    setUnreadCountError(null)
    try {
      const response = await getUnreadAnnouncementCount()
      if (mountedRef.current && identityRef.current === requestIdentity && version === unreadVersionRef.current) setUnreadCount(safeUnreadCount(response))
      return response
    } catch (requestError) {
      if (mountedRef.current && identityRef.current === requestIdentity && version === unreadVersionRef.current) setUnreadCountError(requestError)
      throw requestError
    } finally {
      if (mountedRef.current && identityRef.current === requestIdentity && version === unreadVersionRef.current) setIsUnreadCountLoading(false)
    }
  }, [])

  const fetchAnnouncements = useCallback(async (params = {}) => {
    const query = {
      type: params.type !== undefined ? params.type : currentQueryRef.current.type,
      page: params.page ?? currentQueryRef.current.page,
      page_size: params.page_size ?? currentQueryRef.current.page_size,
    }
    const requestIdentity = identityRef.current
    const version = ++requestVersionRef.current
    currentQueryRef.current = query
    setIsLoading(true)
    setError(null)
    try {
      const requestParams = { page: query.page, page_size: query.page_size }
      if (query.type) requestParams.type = query.type
      const normalized = normalizeAnnouncementList(await getAnnouncements(requestParams))
      if (isCurrent(requestIdentity, version)) {
        setAnnouncements(normalized.results)
        announcementsRef.current = normalized.results
        setCount(normalized.count)
        setNext(normalized.next)
        setPrevious(normalized.previous)
        setCurrentPage(query.page)
        setActivePageSize(query.page_size)
      }
      return normalized
    } catch (requestError) {
      if (isCurrent(requestIdentity, version)) setError(requestError)
      throw requestError
    } finally {
      if (isCurrent(requestIdentity, version)) setIsLoading(false)
    }
  }, [isCurrent])

  const refreshAnnouncements = useCallback(() => fetchAnnouncements(currentQueryRef.current), [fetchAnnouncements])
  const goToPage = useCallback((page) => fetchAnnouncements({ ...currentQueryRef.current, page }), [fetchAnnouncements])
  const nextPage = useCallback(() => next ? goToPage(currentPage + 1) : Promise.resolve(null), [currentPage, goToPage, next])
  const previousPage = useCallback(() => previous && currentPage > DEFAULT_PAGE ? goToPage(currentPage - 1) : Promise.resolve(null), [currentPage, goToPage, previous])

  const loadAllAnnouncements = useCallback(() => {
    if (allRequestRef.current) return allRequestRef.current
    if (allLoadedRef.current) return Promise.resolve(allAnnouncements)
    const requestIdentity = identityRef.current
    const request = (async () => {
      setIsAllLoading(true)
      setAllError(null)
      try {
        let collected = [...announcementsRef.current]
        let page = currentQueryRef.current.page
        let hasNext = Boolean(next)
        while (hasNext) {
          page += 1
          const response = normalizeAnnouncementList(await getAnnouncements({
            type: currentQueryRef.current.type,
            page,
            page_size: currentQueryRef.current.page_size,
          }))
          if (!mountedRef.current || identityRef.current !== requestIdentity) return collected
          const existingIds = new Set(collected.map((item) => item.id))
          collected = [...collected, ...response.results.filter((item) => !existingIds.has(item.id))]
          hasNext = Boolean(response.next)
        }
        if (mountedRef.current && identityRef.current === requestIdentity) {
          allLoadedRef.current = true
          setAllAnnouncements(collected)
        }
        return collected
      } catch (requestError) {
        if (mountedRef.current && identityRef.current === requestIdentity) setAllError(requestError)
        throw requestError
      } finally {
        if (mountedRef.current && identityRef.current === requestIdentity) setIsAllLoading(false)
        if (allRequestRef.current === request) allRequestRef.current = null
      }
    })()
    allRequestRef.current = request
    return request
  }, [allAnnouncements, next])

  const markAsRead = useCallback(async (id) => {
    if (readRequestsRef.current.has(id)) return readRequestsRef.current.get(id)
    const requestIdentity = identityRef.current
    setPendingReadIds((ids) => ids.includes(id) ? ids : [...ids, id])
    const request = markAnnouncementAsRead(id)
      .then((response) => {
        if (mountedRef.current && identityRef.current === requestIdentity) {
          setAnnouncements((items) => items.map((item) => item.id === id ? { ...item, is_read: true } : item))
          return fetchUnreadCount().then(() => response)
        }
        return response
      })
      .finally(() => {
        readRequestsRef.current.delete(id)
        if (mountedRef.current && identityRef.current === requestIdentity) setPendingReadIds((ids) => ids.filter((itemId) => itemId !== id))
      })
    readRequestsRef.current.set(id, request)
    return request
  }, [fetchUnreadCount])

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      if (expiryTimerRef.current) window.clearTimeout(expiryTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (initializedRef.current && identityRef.current === identity && currentQueryRef.current.type === type && currentQueryRef.current.page_size === pageSize) return
    initializedRef.current = true
    identityRef.current = identity
    requestVersionRef.current += 1
    unreadVersionRef.current += 1
    readRequestsRef.current.clear()
    setAnnouncements([])
    setCount(0)
    setNext(null)
    setPrevious(null)
    setCurrentPage(DEFAULT_PAGE)
    setActivePageSize(pageSize)
    setUnreadCount(0)
    setPendingReadIds([])
    setAllAnnouncements([])
    setAllError(null)
    allRequestRef.current = null
    allLoadedRef.current = false
    announcementsRef.current = []
    currentQueryRef.current = { type, page: DEFAULT_PAGE, page_size: pageSize }
    void fetchAnnouncements(currentQueryRef.current).catch(() => {})
    void fetchUnreadCount().catch(() => {})
  }, [fetchAnnouncements, fetchUnreadCount, identity, pageSize, type])

  useEffect(() => {
    if (!mountedRef.current || !announcements.length) return undefined
    if (expiryTimerRef.current) window.clearTimeout(expiryTimerRef.current)
    const now = Date.now()
    const boundaries = announcements.flatMap((item) => [new Date(item.visible_from).getTime(), new Date(item.visible_until).getTime()]).filter((time) => Number.isFinite(time) && time > now)
    if (!boundaries.length) return undefined
    expiryTimerRef.current = window.setTimeout(() => {
      void refreshAnnouncements().catch(() => {})
      void fetchUnreadCount().catch(() => {})
    }, Math.max(1, Math.min(...boundaries) - now))
    return () => window.clearTimeout(expiryTimerRef.current)
  }, [announcements, fetchUnreadCount, refreshAnnouncements])

  return { announcements, allAnnouncements, isAllLoading, allError, count, next, previous, currentPage, pageSize: activePageSize, unreadCount, isLoading, isUnreadCountLoading, error, unreadCountError, pendingReadIds, fetchAnnouncements, refreshAnnouncements, fetchUnreadCount, markAsRead, goToPage, nextPage, previousPage, loadAllAnnouncements }
}

export default useAnnouncements
