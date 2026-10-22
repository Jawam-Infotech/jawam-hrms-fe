import { beforeEach, describe, expect, it, vi } from 'vitest'
import api from './axios.js'
import { paySettlement, rejectSettlement, requestSettlementCeoCorrection } from './settlements.api.js'

vi.mock('./axios.js', () => ({ default: { post: vi.fn() } }))

describe('requestSettlementCeoCorrection', () => {
  beforeEach(() => vi.clearAllMocks())

  it('sends the exact correction payload as the JSON body', async () => {
    api.post.mockResolvedValue({ data: { id: 1 } })
    const payload = {
      issues: [{ field_name: 'monthly_salary', current_value: 30000, expected_value: 32000, reason: 'Updated salary' }],
    }

    await requestSettlementCeoCorrection('settlement-1', payload)

    expect(api.post).toHaveBeenCalledWith('payroll/settlements/settlement-1/ceo-correction/', {
      remarks: '',
      issues: payload.issues,
    })
  })

  it('rejects correction requests without complete issues', async () => {
    await expect(requestSettlementCeoCorrection('settlement-1', { remarks: 'note' })).rejects.toThrow('At least one complete correction issue is required.')
    expect(api.post).not.toHaveBeenCalled()
  })
})

describe('rejectSettlement', () => {
  beforeEach(() => vi.clearAllMocks())

  it('sends the rejection reason to the settlement rejection endpoint', async () => {
    api.post.mockResolvedValue({ data: { id: 1, status: 'HR_REJECTED' } })
    const payload = { reason: 'Incorrect LOP calculation' }

    await rejectSettlement('settlement-1', payload)

    expect(api.post).toHaveBeenCalledWith(
      'payroll/settlements/settlement-1/reject/',
      payload,
    )
  })
})

describe('paySettlement', () => {
  beforeEach(() => vi.clearAllMocks())

  it('sends the actual payment date required by the settlement API', async () => {
    api.post.mockResolvedValue({ data: { id: 'settlement-1', payment_status: 'PAID' } })

    await paySettlement('settlement-1', { actual_payment_date: '2026-10-07' })

    expect(api.post).toHaveBeenCalledWith(
      'settlements/settlement-1/pay/',
      { actual_payment_date: '2026-10-07' },
    )
  })
})
