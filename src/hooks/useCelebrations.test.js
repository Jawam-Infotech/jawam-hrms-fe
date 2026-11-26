// @vitest-environment jsdom

import { act, renderHook } from '@testing-library/react'
import { createElement } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { UserContext } from '../context/UserContext.jsx'
import { shownCelebrations } from './useCelebrations.js'
import useCelebrations from './useCelebrations.js'

vi.mock('../services/profileService.js', () => ({
  getMyProfile: vi.fn(),
}))

import { getMyProfile } from '../services/profileService.js'

const profile = (id, overrides = {}) => ({
  id,
  name: `Employee ${id}`,
  dateOfBirth: '1995-11-23',
  dateOfJoining: '2022-11-23',
  employmentStatus: 'ACTIVE',
  ...overrides,
})

function wrapperFor(user) {
  return function Wrapper({ children }) {
    return createElement(UserContext.Provider, { value: { user } }, children)
  }
}

async function flushPromises() {
  await act(async () => {
    await Promise.resolve()
    await Promise.resolve()
  })
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-11-23T18:29:00.000Z'))
  shownCelebrations.clear()
  getMyProfile.mockReset()
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('useCelebrations integration', () => {
  it('queues birthday and anniversary independently', async () => {
    getMyProfile.mockResolvedValue(profile('1'))
    const { result } = renderHook(() => useCelebrations(), { wrapper: wrapperFor({ id: '1' }) })

    await flushPromises()
    expect(result.current.activeCelebration?.type).toBe('BIRTHDAY')
    act(() => result.current.closeCelebration())
    expect(result.current.activeCelebration?.type).toBe('WORK_ANNIVERSARY')
    act(() => result.current.closeCelebration())
    expect(result.current.activeCelebration).toBeNull()
  })

  it('ignores an old profile response after the current request wins', async () => {
    let resolveA
    let resolveB
    getMyProfile
      .mockImplementationOnce(() => new Promise((resolve) => { resolveA = resolve }))
      .mockImplementationOnce(() => new Promise((resolve) => { resolveB = resolve }))

    let currentUser = { id: 'A' }
    function Wrapper({ children }) {
      return createElement(UserContext.Provider, { value: { user: currentUser } }, children)
    }
    const { result, rerender } = renderHook(() => useCelebrations(), { wrapper: Wrapper })
    currentUser = { id: 'B' }
    rerender()
    expect(result.current.activeCelebration).toBeNull()
    resolveB(profile('B'))
    await flushPromises()
    expect(result.current.activeCelebration?.employeeId).toBe('B')
    resolveA(profile('A'))
    await act(async () => {})
    expect(result.current.activeCelebration?.employeeId).toBe('B')
  })

  it('recalculates at IST midnight without refetching the profile', async () => {
    getMyProfile.mockResolvedValue(profile('1', { dateOfBirth: '1995-11-24', dateOfJoining: '2022-11-24' }))
    const { result } = renderHook(() => useCelebrations(), { wrapper: wrapperFor({ id: '1' }) })
    await flushPromises()
    expect(result.current.activeCelebration).toBeNull()
    expect(getMyProfile).toHaveBeenCalledTimes(1)

    await act(async () => { vi.advanceTimersByTime(60 * 1000) })
    expect(result.current.activeCelebration?.celebrationDate).toBe('2026-11-24')
    expect(getMyProfile).toHaveBeenCalledTimes(1)
  })

  it('cleans the midnight timer when unmounted', () => {
    getMyProfile.mockResolvedValue(profile('1'))
    const { unmount } = renderHook(() => useCelebrations(), { wrapper: wrapperFor({ id: '1' }) })
    expect(vi.getTimerCount()).toBeGreaterThan(0)
    unmount()
    expect(vi.getTimerCount()).toBe(0)
  })

  it('does not display invalid or ineligible profiles', async () => {
    getMyProfile.mockResolvedValue(profile('1', { dateOfBirth: 'invalid', employmentStatus: 'EXITED' }))
    const { result } = renderHook(() => useCelebrations(), { wrapper: wrapperFor({ id: '1' }) })
    await flushPromises()
    expect(result.current.loading).toBe(false)
    expect(result.current.activeCelebration).toBeNull()
  })
})
