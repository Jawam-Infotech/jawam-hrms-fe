import { describe, expect, it } from 'vitest'
import { NAV_CONFIG } from './navigation.js'

describe('announcement sidebar visibility', () => {
  it.each(['CEO', 'HR', 'TL', 'EMPLOYEE'])('%s does not include announcement management', (role) => {
    expect(NAV_CONFIG[role].some((item) => item.id === 'announcements')).toBe(false)
  })
  it('preserves existing dashboard entries', () => {
    expect(NAV_CONFIG.CEO[0]).toMatchObject({ id: 'dashboard', path: '/dashboard/ceo' })
    expect(NAV_CONFIG.HR[0]).toMatchObject({ id: 'dashboard', path: '/dashboard/hr' })
    expect(NAV_CONFIG.TL[0]).toMatchObject({ id: 'dashboard', path: '/dashboard/team-leader' })
    expect(NAV_CONFIG.EMPLOYEE[0]).toMatchObject({ id: 'dashboard', path: '/dashboard' })
  })
})
