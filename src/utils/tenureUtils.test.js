import { describe, expect, it } from 'vitest'
import { getCompanyTenure } from './tenureUtils.js'

const employee = (overrides = {}) => ({ joiningDate: '2022-08-15', employmentStatus: 'ACTIVE', ...overrides })

describe('getCompanyTenure', () => {
  it('calculates calendar years and months', () => {
    expect(getCompanyTenure(employee(), new Date('2024-11-20'))).toEqual({ years: 2, months: 3, label: '2 yrs 3 mos' })
  })
  it('handles exact anniversaries and incomplete years', () => {
    expect(getCompanyTenure(employee(), '2024-08-15')).toMatchObject({ years: 2, months: 0 })
    expect(getCompanyTenure(employee(), '2023-08-14')).toMatchObject({ years: 0, months: 11 })
  })
  it.each(['ACTIVE', 'ON_NOTICE'])('uses today for %s', (employmentStatus) => {
    expect(getCompanyTenure(employee({ employmentStatus }), '2024-08-15')?.years).toBe(2)
  })
  it('uses the required end dates for exit statuses', () => {
    expect(getCompanyTenure(employee({ employmentStatus: 'EXIT_PENDING', lastWorkingDate: '2024-02-15' }), '2026-01-01')?.label).toBe('1 yrs 6 mos')
    expect(getCompanyTenure(employee({ employmentStatus: 'EXITED', exitDate: '2024-02-15' }), '2026-01-01')?.label).toBe('1 yrs 6 mos')
  })
  it('returns null for missing, invalid, future, or incomplete exit dates', () => {
    expect(getCompanyTenure({ employmentStatus: 'ACTIVE' }, '2024-01-01')).toBeNull()
    expect(getCompanyTenure(employee({ joiningDate: 'invalid' }), '2024-01-01')).toBeNull()
    expect(getCompanyTenure(employee({ joiningDate: '2025-01-01' }), '2024-01-01')).toBeNull()
    expect(getCompanyTenure(employee({ employmentStatus: 'EXITED' }), '2024-01-01')).toBeNull()
  })
  it('uses the Asia/Kolkata calendar date at a UTC boundary', () => {
    expect(getCompanyTenure(employee({ joiningDate: '2024-08-15' }), new Date('2024-08-14T19:00:00Z'))?.years).toBe(0)
    expect(getCompanyTenure(employee({ joiningDate: '2023-08-15' }), new Date('2024-08-14T19:00:00Z'))?.years).toBe(1)
  })
  it('handles leap-year dates without special policy', () => {
    expect(getCompanyTenure(employee({ joiningDate: '2020-02-29' }), '2024-02-28')?.years).toBe(3)
    expect(getCompanyTenure(employee({ joiningDate: '2020-02-29' }), '2024-02-29')?.years).toBe(4)
  })
})
