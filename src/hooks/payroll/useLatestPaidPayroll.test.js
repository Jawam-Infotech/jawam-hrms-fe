import { describe, expect, it } from 'vitest'
import { selectLatestPaidPayroll } from './useLatestPaidPayroll.js'

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
})
