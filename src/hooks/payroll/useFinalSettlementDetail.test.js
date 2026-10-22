// @vitest-environment jsdom

import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import useFinalSettlementDetail from './useFinalSettlementDetail.js'
import * as settlementService from '../../services/settlementService.js'

vi.mock('../../services/settlementService.js', () => ({
  applySettlementCorrection: vi.fn(),
  approveSettlement: vi.fn(),
  getSettlementById: vi.fn(),
  paySettlement: vi.fn(),
  regenerateSettlement: vi.fn(),
  rejectSettlement: vi.fn(),
  requestSettlementCorrection: vi.fn(),
  requestSettlementCeoCorrection: vi.fn(),
}))

describe('useFinalSettlementDetail rejection action', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    settlementService.getSettlementById.mockResolvedValue({ id: 'settlement-1', status: 'HR_REJECTED' })
    settlementService.rejectSettlement.mockResolvedValue({ status: 'HR_REJECTED' })
  })

  it('trims the reason and refreshes the settlement after success', async () => {
    const { result } = renderHook(() => useFinalSettlementDetail('settlement-1'))

    await act(async () => {
      await result.current.reject('  Incorrect LOP calculation  ')
    })

    expect(settlementService.rejectSettlement).toHaveBeenCalledWith(
      'settlement-1',
      { reason: 'Incorrect LOP calculation' },
    )
    expect(settlementService.getSettlementById).toHaveBeenCalledWith('settlement-1')
    expect(result.current.settlement).toEqual({ id: 'settlement-1', status: 'HR_REJECTED' })
  })

  it.each(['', '   ', null])('rejects an empty reason (%j) without sending a request', async (reason) => {
    const { result } = renderHook(() => useFinalSettlementDetail('settlement-1'))

    await act(async () => {
      await expect(result.current.reject(reason)).rejects.toThrow('A rejection reason is required.')
    })

    expect(settlementService.rejectSettlement).not.toHaveBeenCalled()
    expect(settlementService.getSettlementById).not.toHaveBeenCalled()
    expect(result.current.actionError).toEqual(new Error('A rejection reason is required.'))
  })

  it('propagates service failures without refreshing or reporting success', async () => {
    const serviceError = new Error('Request failed')
    settlementService.rejectSettlement.mockRejectedValue(serviceError)
    const { result } = renderHook(() => useFinalSettlementDetail('settlement-1'))

    await act(async () => {
      await expect(result.current.reject('Valid reason')).rejects.toBe(serviceError)
    })

    expect(settlementService.getSettlementById).not.toHaveBeenCalled()
    expect(result.current.actionError).toBe(serviceError)
    expect(result.current.actionLoading).toBe(false)
  })

  it('submits HR correction remarks through the settlement correction flow and refreshes', async () => {
    settlementService.requestSettlementCorrection.mockResolvedValue({ status: 'CORRECTION_REQUIRED' })
    const { result } = renderHook(() => useFinalSettlementDetail('settlement-1'))

    await act(async () => {
      await result.current.requestHrCorrection({ remarks: '  Correct the settlement calculation  ' })
    })

    expect(settlementService.requestSettlementCorrection).toHaveBeenCalledWith(
      'settlement-1',
      { remarks: '  Correct the settlement calculation  ' },
    )
    expect(settlementService.getSettlementById).toHaveBeenCalledWith('settlement-1')
  })

  it('propagates duplicate adjustment idempotency errors without refreshing or retrying', async () => {
    const duplicateError = {
      response: { status: 400, data: { detail: { idempotency_key: ['This key has already been used.'] } } },
    }
    settlementService.applySettlementCorrection.mockRejectedValue(duplicateError)
    const { result } = renderHook(() => useFinalSettlementDetail('settlement-1'))
    const payload = {
      pending_previous_salary: '0.00',
      other_earnings: [],
      other_deductions: [],
      adjustments: [{ reference_month: '2026-08-01', direction: 'POSITIVE', amount: '100.00', reason: 'Adjustment', idempotency_key: 'KEY-1' }],
    }

    await act(async () => {
      await expect(result.current.applyHrCorrection(payload)).rejects.toBe(duplicateError)
    })

    expect(settlementService.applySettlementCorrection).toHaveBeenCalledTimes(1)
    expect(settlementService.getSettlementById).not.toHaveBeenCalled()
    expect(result.current.correctionError).toBe(duplicateError)
    expect(result.current.correctionLoading).toBe(false)
  })
})
