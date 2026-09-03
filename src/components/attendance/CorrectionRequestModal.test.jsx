import { describe, expect, it } from 'vitest'
import { getCorrectionDateLimits } from './CorrectionRequestModal.jsx'

describe('getCorrectionDateLimits', () => {
  it('returns today as the maximum allowed date', () => {
    const limits = getCorrectionDateLimits()

    const today = new Date()
    const expectedToday = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, '0'),
      String(today.getDate()).padStart(2, '0'),
    ].join('-')

    expect(limits.max).toBe(expectedToday)
  })

it('returns a minimum date before or equal to today', () => {
  const limits = getCorrectionDateLimits()

  expect(limits.min).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  expect(limits.max).toMatch(/^\d{4}-\d{2}-\d{2}$/)

  expect(new Date(limits.min).getTime()).toBeLessThanOrEqual(
    new Date(limits.max).getTime(),
  )
})

  it('returns valid HTML date input values', () => {
    const limits = getCorrectionDateLimits()

    expect(limits.min).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    expect(limits.max).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})