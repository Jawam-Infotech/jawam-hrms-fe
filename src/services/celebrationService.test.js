import { describe, expect, it } from 'vitest'
import { getPersonalCelebrations, istDateKey } from './celebrationService.js'

const profile = {
  id: '12',
  name: 'Asha Sharma',
  dateOfBirth: '1995-11-23',
  dateOfJoining: '2022-11-23',
  employmentStatus: 'ACTIVE',
}

describe('celebrationService', () => {
  it('creates birthday and work anniversary celebrations independently', () => {
    const celebrations = getPersonalCelebrations(profile, '2026-11-23')
    expect(celebrations).toHaveLength(2)
    expect(celebrations[0]).toMatchObject({ type: 'BIRTHDAY', id: '12-BIRTHDAY-2026-11-23' })
    expect(celebrations[1]).toMatchObject({ type: 'WORK_ANNIVERSARY', completedYears: 4, id: '12-WORK_ANNIVERSARY-2026-11-23' })
  })

  it.each(['ACTIVE', 'ON_NOTICE'])('accepts %s employees', (employmentStatus) => {
    expect(getPersonalCelebrations({ ...profile, employmentStatus }, '2026-11-23')).toHaveLength(2)
  })

  it.each(['EXIT_PENDING', 'EXITED'])('excludes %s employees', (employmentStatus) => {
    expect(getPersonalCelebrations({ ...profile, employmentStatus }, '2026-11-23')).toEqual([])
  })

  it('safely returns no celebrations for missing or invalid dates', () => {
    expect(getPersonalCelebrations({ ...profile, dateOfBirth: '', dateOfJoining: 'invalid' }, '2026-11-23')).toEqual([])
    expect(getPersonalCelebrations({ ...profile, id: '' }, '2026-11-23')).toEqual([])
    expect(istDateKey(new Date('invalid'))).toBeNull()
  })
})
