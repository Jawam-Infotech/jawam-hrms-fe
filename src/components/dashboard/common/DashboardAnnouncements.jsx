import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import AnnouncementCard, { AnnouncementItem } from '../../shared/AnnouncementCard.jsx'
import AnnouncementListModal from './AnnouncementListModal.jsx'
import useAnnouncements from '../../../hooks/useAnnouncements.js'

function DashboardAnnouncements() {
  const announcementsState = useAnnouncements()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [carouselOrder, setCarouselOrder] = useState([])
  const [carouselOffset, setCarouselOffset] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  const [transitionEnabled, setTransitionEnabled] = useState(true)
  const trackRef = useRef(null)
  const announcements = useMemo(() => announcementsState.announcements || [], [announcementsState.announcements])
  const carouselEnabled = announcements.length > 3

  useEffect(() => {
    // Reset the circular order when the backend list changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCarouselOrder(announcements)
    setCarouselOffset(0)
    setTransitionEnabled(true)
  }, [announcements])

  useLayoutEffect(() => {
    if (transitionEnabled || carouselOffset !== 0) return undefined
    const track = trackRef.current
    if (!track) return undefined
    track.style.transition = 'none'
    track.style.transform = 'translate3d(0, 0px, 0)'
    void track.getBoundingClientRect()
    const frame = window.requestAnimationFrame(() => setTransitionEnabled(true))
    return () => window.cancelAnimationFrame(frame)
  }, [carouselOffset, carouselOrder, transitionEnabled])

  useEffect(() => {
    const mediaQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (!mediaQuery) return undefined
    const update = () => setPrefersReducedMotion(mediaQuery.matches)
    update()
    mediaQuery.addEventListener?.('change', update)
    return () => mediaQuery.removeEventListener?.('change', update)
  }, [])

  useEffect(() => {
    if (!carouselEnabled || isPaused || prefersReducedMotion) return undefined
    const timer = window.setInterval(() => {
      if (carouselOffset !== 0) return
      setTransitionEnabled(true)
      setCarouselOffset(-76)
    }, 3000)
    return () => window.clearInterval(timer)
  }, [announcements.length, carouselEnabled, carouselOffset, isPaused, prefersReducedMotion])

  const carouselItems = useMemo(() => {
    if (!carouselEnabled) return []
    return carouselOrder.length ? carouselOrder : announcements
  }, [announcements, carouselEnabled, carouselOrder])

  useEffect(() => {
    if (carouselOffset !== -76 || !carouselEnabled || prefersReducedMotion) return undefined
    const track = trackRef.current
    const reset = () => {
      setTransitionEnabled(false)
      setCarouselOrder((current) => [...current.slice(1), current[0]])
      setCarouselOffset(0)
    }
    if (track) track.addEventListener('transitionend', reset, { once: true })
    return () => track?.removeEventListener('transitionend', reset)
  }, [announcements.length, carouselEnabled, carouselOffset, prefersReducedMotion])

  const openModal = () => {
    setIsModalOpen(true)
    announcementsState.loadAllAnnouncements?.().catch(() => {})
  }

  const interactionProps = { onMouseEnter: () => setIsPaused(true), onMouseLeave: () => setIsPaused(false), onFocus: () => setIsPaused(true), onBlur: (event) => { if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false) } }

  return <>
    <div className="h-[360px] overflow-hidden" {...interactionProps}>
      {carouselEnabled ? <div className="flex h-full flex-col rounded-[20px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
        <div className="mb-4 flex shrink-0 items-center justify-between gap-3"><h3 className="text-[18px] font-extrabold text-[#111827]">Announcement</h3>{announcements.some((item) => !item.is_read) && <span className="rounded-full bg-[#e0f2fe] px-2 py-1 text-[11px] font-bold text-[#0369a1]">Unread</span>}</div>
        <div className="min-h-0 flex-1 overflow-hidden"><div ref={trackRef} className="will-change-transform" style={{ transform: `translate3d(0, ${prefersReducedMotion ? 0 : carouselOffset}px, 0)`, transition: transitionEnabled && !prefersReducedMotion ? 'transform 700ms ease-in-out' : 'none' }}>{carouselItems.map((announcement) => <AnnouncementItem key={`${announcement.id}-carousel`} announcement={announcement} />)}</div></div>
        <div className="mt-4 shrink-0 border-t border-[#f3f4f6] pt-3"><button type="button" onClick={openModal} className="text-[13px] font-bold text-[#3b82f6] hover:underline">View All Announcements</button></div>
      </div> : <AnnouncementCard announcements={announcements} loading={announcementsState.isLoading} error={announcementsState.error} onRetry={announcementsState.refreshAnnouncements} onViewAll={openModal} />}
    </div>
    <AnnouncementListModal isOpen={isModalOpen} announcements={announcementsState.allAnnouncements?.length ? announcementsState.allAnnouncements : announcementsState.announcements} loading={announcementsState.isAllLoading} error={announcementsState.allError} onRetry={announcementsState.loadAllAnnouncements} onClose={() => setIsModalOpen(false)} />
  </>
}

export default DashboardAnnouncements
