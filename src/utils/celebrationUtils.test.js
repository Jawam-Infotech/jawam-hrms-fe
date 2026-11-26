import { describe, expect, it } from 'vitest'
import { getCompletedYears, isBirthdayToday, isEligibleForCelebration, isWorkAnniversaryToday } from './celebrationUtils.js'

describe('celebration date utilities', () => {
  it('matches birthdays by month and day', () => {
    expect(isBirthdayToday('1990-11-23', '2026-11-23')).toBe(true)
    expect(isBirthdayToday('1990-11-23', '2026-11-24')).toBe(false)
  })

  it('uses the India calendar date for timestamp values', () => {
    expect(isBirthdayToday('1990-11-23', '2026-11-22T18:30:00.000Z')).toBe(true)
    expect(isBirthdayToday('1990-11-23', '2026-11-22T18:29:59.000Z')).toBe(false)
  })

  it('returns false for missing or invalid birthday dates', () => {
    expect(isBirthdayToday('', '2026-11-23')).toBe(false)
    expect(isBirthdayToday('not-a-date', '2026-11-23')).toBe(false)
    expect(isBirthdayToday('1990-02-30', '2026-11-23')).toBe(false)
  })

  it('calculates fully completed years without subtracting calendar years only', () => {
    expect(getCompletedYears('2023-11-23', '2026-11-22')).toBe(2)
    expect(getCompletedYears('2023-11-23', '2026-11-23')).toBe(3)
    expect(getCompletedYears('2023-11-23', '2027-01-01')).toBe(3)
    expect(getCompletedYears('2027-11-23', '2026-11-23')).toBe(0)
  })

  it('returns zero for missing or invalid joining dates', () => {
    expect(getCompletedYears('', '2026-11-23')).toBe(0)
    expect(getCompletedYears('invalid', '2026-11-23')).toBe(0)
    expect(getCompletedYears('2023-02-30', '2026-11-23')).toBe(0)
  })

  it('recognizes only completed work anniversaries on their anniversary date', () => {
    expect(isWorkAnniversaryToday('2023-11-23', '2026-11-23')).toBe(true)
    expect(isWorkAnniversaryToday('2023-11-23', '2026-11-22')).toBe(false)
    expect(isWorkAnniversaryToday('2026-11-23', '2026-11-23')).toBe(false)
  })

  it('handles celebration eligibility case-insensitively', () => {
    expect(isEligibleForCelebration('ACTIVE')).toBe(true)
    expect(isEligibleForCelebration('on_notice')).toBe(true)
    expect(isEligibleForCelebration('EXIT_PENDING')).toBe(false)
    expect(isEligibleForCelebration('EXITED')).toBe(false)
    expect(isEligibleForCelebration('')).toBe(false)
  })
})
