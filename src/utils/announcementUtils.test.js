import { describe, expect, it } from 'vitest'
import { isAnnouncementVisibleAt, normalizeAnnouncement, normalizeAnnouncementList, serializeISTDateTime, serializeISTInputDateTime, validateVisibilityWindow } from './announcementUtils.js'

describe('announcement utilities', () => {
  it('preserves backend announcement fields and pagination metadata', () => {
    const item = { type: 'ANNIVERSARY', employee_name: 'Asha', body: 'Well done.' }
    expect(normalizeAnnouncement(item)).toEqual(item)
    expect(normalizeAnnouncementList({ count: 1, next: '/next', previous: null, results: [item] })).toMatchObject({ count: 1, next: '/next', results: [item] })
  })

  it('serializes timestamps with the IST offset', () => {
    expect(serializeISTDateTime('2026-11-23T18:30:00.000Z')).toBe('2026-11-24T00:00:00+05:30')
  })

  it('interprets datetime-local values as Asia/Kolkata wall-clock time', () => {
    expect(serializeISTInputDateTime('2026-11-26T10:30')).toBe('2026-11-26T10:30:00+05:30')
  })

  it('validates visibility and applies inclusive/exclusive boundaries', () => {
    const announcement = { visible_from: '2026-11-24T00:00:00+05:30', visible_until: '2026-11-27T00:00:00+05:30' }
    expect(validateVisibilityWindow(announcement.visible_from, announcement.visible_until)).toBe(true)
    expect(validateVisibilityWindow(announcement.visible_until, announcement.visible_from)).toBe(false)
    expect(isAnnouncementVisibleAt(announcement, announcement.visible_from)).toBe(true)
    expect(isAnnouncementVisibleAt(announcement, announcement.visible_until)).toBe(false)
  })
})
