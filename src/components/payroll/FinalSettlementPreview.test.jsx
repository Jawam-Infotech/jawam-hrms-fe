// @vitest-environment jsdom

import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import FinalSettlementPreview from './FinalSettlementPreview.jsx'

describe('FinalSettlementPreview', () => {
  it('renders employee fields from the linked payroll record', () => {
    render(<FinalSettlementPreview isOpen onClose={vi.fn()} settlement={{
      employee_name: 'Rohit Bhatt',
      payroll: {
        employee_department: 'HR',
        current_version: { calculation_inputs: { date_of_joining: '2026-06-01' } },
      },
      current_version: { items: [], calculation_results: { net_payable: '0.00' } },
    }} />)

    expect(screen.getByText('HR')).toBeTruthy()
    expect(screen.getByText('01 Jun 2026')).toBeTruthy()
  })

  it('uses dashes when employee fields are unavailable', () => {
    render(<FinalSettlementPreview isOpen onClose={vi.fn()} settlement={{ current_version: { items: [] } }} />)
    expect(screen.getAllByText('—').length).toBeGreaterThan(0)
  })
})
