// @vitest-environment jsdom

import { renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import useLatestPaidPayroll, { selectLatestPaidPayroll } from './useLatestPaidPayroll.js'

const { getPayrolls } = vi.hoisted(() => ({ getPayrolls: vi.fn() }))
vi.mock('../../services/payrollService.js', () => ({ getPayrolls }))

beforeEach(() => getPayrolls.mockReset())

describe('selectLatestPaidPayroll', () => {
  it('filters by employee before selecting the latest paid salary month', () => {
    const selected = selectLatestPaidPayroll([
      { id: 1, employee_id: 10, salary_month: '2026-10', payment_status: 'PAID' },
      { id: 2, employee_id: 11, salary_month: '2026-12', payment_status: 'PAID' },
      { id: 3, employee_id: 10, salary_month: '2026-09', payment_status: 'PAID' },
      { id: 4, employee_id: 10, salary_month: '2026-11', payment_status: 'PENDING' },
    ], 10)

    expect(selected).toMatchObject({ id: 1, employee_id: 10, salary_month: '2026-10' })
  })

  it('requests only paid payrolls and follows pagination to preserve latest selection', async () => {
    getPayrolls
      .mockResolvedValueOnce({
        payrolls: [{ id: 1, employee_id: 10, salary_month: '2026-09', payment_status: 'PAID' }],
        next: '/payroll/?page=2',
      })
      .mockResolvedValueOnce({
        payrolls: [{ id: 2, employee_id: 10, salary_month: '2026-10', payment_status: 'PAID' }],
        next: null,
      })

    const { result } = renderHook(() => useLatestPaidPayroll(10))

    await waitFor(() => expect(result.current.payroll?.id).toBe(2))
    expect(getPayrolls).toHaveBeenNthCalledWith(1, { page: 1, employee: 10, payment_status: 'PAID' })
    expect(getPayrolls).toHaveBeenNthCalledWith(2, { page: 2, employee: 10, payment_status: 'PAID' })
  })

  it('reports malformed responses instead of silently treating them as empty', async () => {
    getPayrolls.mockResolvedValue({ next: null })
    const { result } = renderHook(() => useLatestPaidPayroll(10))

    await waitFor(() => expect(result.current.error?.message).toBe('Invalid payroll response.'))
    expect(result.current.payroll).toBeNull()
  })
})
