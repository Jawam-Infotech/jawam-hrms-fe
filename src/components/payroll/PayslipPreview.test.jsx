// @vitest-environment jsdom

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import PayslipPreview from './PayslipPreview.jsx'

describe('PayslipPreview', () => {
  it('maps payroll detail attendance, employee, line items, totals, and dates', () => {
    render(<PayslipPreview onClose={vi.fn()} payroll={{
      employee_name: 'Kanishk Prashad',
      employee_code: 'EMP-000006',
      employee_department: 'Development',
      salary_month: '2026-09',
      payment_status: 'PAID',
      payment_date: '2026-10-06',
      created_at: '2026-10-01T10:00:00Z',
      current_version: {
        calculation_inputs: {
          date_of_joining: '2026-07-07',
          calendar_days: 30,
          working_days: 21,
          present_days: 0,
          late_days: 1,
          wfh_days: 0,
          paid_leave_days: 0,
          unpaid_leave_days: 4,
          half_days: 0,
          holiday_days: 1,
          weekly_off_days: 8,
          absent_days: 16,
        },
        calculation_results: { gross_salary: '100.00', total_deductions: '66.67', net_payable: '33.33' },
        items: [
          { item_type: 'MONTHLY_SALARY', description: 'Monthly Salary', amount: '100.00' },
          { item_type: 'GROSS', description: 'Gross Salary', amount: '100.00' },
          { item_type: 'LOP_DEDUCTION', description: 'LOP Deduction (20 days)', amount: '66.67' },
          { item_type: 'OTHER_EARNING', description: 'Incentive', amount: '5000.00' },
          { item_type: 'OTHER_DEDUCTION', description: 'Tea', amount: '200.00' },
          { item_type: 'PREVIOUS_MONTH_ADJUSTMENT', description: 'Previous month adjustment', amount: '2000.00' },
        ],
      },
    }} />)

    expect(screen.getByText('EMP-000006')).toBeTruthy()
    expect(screen.getByText('Development')).toBeTruthy()
    expect(screen.getByText('07 Jul 2026')).toBeTruthy()
    expect(screen.getByText('September 2026')).toBeTruthy()
    expect(screen.getAllByText('06 Oct 2026')).toHaveLength(2)
    expect(screen.queryByText('Attendance Summary')).toBeNull()
    expect(screen.getByText('Settlement Breakdown')).toBeTruthy()
    for (const value of ['Monthly Salary', 'Gross Salary', 'Loss of Pay', '₹33.33']) expect(screen.getByText(value)).toBeTruthy()
    expect(screen.getAllByText('Earning')).toHaveLength(4)
    expect(screen.getAllByText('Deduction')).toHaveLength(2)
    expect(screen.getByText('Incentive')).toBeTruthy()
    expect(screen.getByText('Tea')).toBeTruthy()
    expect(screen.getByText('Salary Adjustment')).toBeTruthy()
    expect(screen.getByText(/66\.67/)).toBeTruthy()
    expect(screen.getAllByText(/100\.00/).length).toBeGreaterThan(0)
  })
})
