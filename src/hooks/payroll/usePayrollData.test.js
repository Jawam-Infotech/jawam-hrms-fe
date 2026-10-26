// @vitest-environment jsdom

import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import usePayrollData from './usePayrollData.js'

const { calls, service } = vi.hoisted(() => ({
  calls: [],
  service: {
  getPayrolls: vi.fn(),
  getPayrollById: vi.fn(),
  approvePayroll: vi.fn(),
  rejectPayroll: vi.fn(),
  requestPayrollCorrection: vi.fn(),
  applyPayrollCorrection: vi.fn(),
  startPayrollCorrection: vi.fn(),
  payPayroll: vi.fn(),
  regeneratePayroll: vi.fn(),
  getPayrollSettings: vi.fn(),
  generatePayroll: vi.fn(),
  approveLateGeneration: vi.fn(),
  },
}))

vi.mock('../../services/payrollService.js', () => service)
vi.mock('../../services/employeeService.js', () => ({
  getEmployees: vi.fn().mockResolvedValue({ employees: [] }),
}))

describe('usePayrollData payroll correction workflow', () => {
  beforeEach(() => {
    calls.length = 0
    Object.values(service).forEach((mock) => mock.mockReset())
    service.startPayrollCorrection.mockImplementation(async (...args) => {
      calls.push(['start', ...args])
      return { status: 'CORRECTION_REQUIRED' }
    })
    service.applyPayrollCorrection.mockImplementation(async (...args) => {
      calls.push(['apply', ...args])
      return { status: 'GENERATED' }
    })
    service.payPayroll.mockResolvedValue({ status: 'PAID', payment_date: '2026-10-09' })
  })

  it('exposes separate transition and APPLY requests with the exact payloads', async () => {
    const { result } = renderHook(() => usePayrollData())
    const applyPayload = {
      earnings: [{ amount: '1000.00', reason: 'Bonus' }],
      deductions: [{ amount: '250.00', reason: 'Recovery' }],
      adjustments: [{
        reference_month: '2026-08-01',
        direction: 'POSITIVE',
        amount: '500.00',
        reason: 'Shortfall',
        supporting_reference: 'ADJ-100',
      }],
    }

    await act(async () => {
      await result.current.handleStartPayrollCorrection('9', { remarks: 'Review payroll' })
      await result.current.handleApplyPayrollCorrection('9', applyPayload)
    })

    expect(calls).toEqual([
      ['start', '9', { remarks: 'Review payroll' }],
      ['apply', '9', applyPayload],
    ])
  })

  it('supports direct APPLY for rejected/correction-required states', async () => {
    const { result } = renderHook(() => usePayrollData())
    const payload = { deductions: [{ amount: '10.00', reason: 'Test' }] }

    await act(async () => {
      await result.current.handleApplyPayrollCorrection('10', payload)
    })

    expect(service.startPayrollCorrection).not.toHaveBeenCalled()
    expect(service.applyPayrollCorrection).toHaveBeenCalledWith('10', payload)
  })

  it('passes the payment date unchanged to the payment service', async () => {
    const { result } = renderHook(() => usePayrollData())

    await act(async () => {
      await result.current.handlePayPayroll('11', { actual_payment_date: '2026-10-09' })
    })

    expect(service.payPayroll).toHaveBeenCalledWith('11', {
      actual_payment_date: '2026-10-09',
    })
  })

  it('does not let an older payroll list response replace a newer one', async () => {
    let resolveFirst
    let resolveSecond
    service.getPayrolls
      .mockImplementationOnce(() => new Promise((resolve) => { resolveFirst = resolve }))
      .mockImplementationOnce(() => new Promise((resolve) => { resolveSecond = resolve }))

    const { result } = renderHook(() => usePayrollData())

    let firstRequest
    let secondRequest
    await act(async () => {
      firstRequest = result.current.fetchPayrolls({ page: 1, salary_month: '2026-09' })
      secondRequest = result.current.fetchPayrolls({ page: 1, salary_month: '2026-10' })
    })

    await act(async () => {
      resolveSecond({ payrolls: [{ id: 2 }], count: 1, next: null, previous: null })
      await secondRequest
    })
    await waitFor(() => expect(result.current.payrolls).toEqual([{ id: 2 }]))

    await act(async () => {
      resolveFirst({ payrolls: [{ id: 1 }], count: 1, next: null, previous: null })
      await firstRequest
    })

    expect(result.current.payrolls).toEqual([{ id: 2 }])
  })

  it('does not let an older payroll detail response replace the selected record', async () => {
    let resolveFirst
    let resolveSecond
    service.getPayrollById
      .mockImplementationOnce(() => new Promise((resolve) => { resolveFirst = resolve }))
      .mockImplementationOnce(() => new Promise((resolve) => { resolveSecond = resolve }))

    const { result } = renderHook(() => usePayrollData())
    let firstRequest
    let secondRequest
    await act(async () => {
      firstRequest = result.current.fetchPayrollById(1)
      secondRequest = result.current.fetchPayrollById(2)
    })

    await act(async () => {
      resolveSecond({ id: 2 })
      await secondRequest
    })
    await waitFor(() => expect(result.current.payroll).toEqual({ id: 2 }))

    await act(async () => {
      resolveFirst({ id: 1 })
      await firstRequest
    })

    expect(result.current.payroll).toEqual({ id: 2 })
  })
})
