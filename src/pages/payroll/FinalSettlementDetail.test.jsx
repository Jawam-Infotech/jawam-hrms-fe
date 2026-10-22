// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { adjustmentAmount, CorrectionDetailsModal, getSettlementCorrectionDraft, getSettlementSalaryMonth, SettlementCategoryModal, SettlementContent, settlementCategoryRecords } from './FinalSettlementDetail.jsx'
import { getLatestCorrectionRequest } from '../../utils/ceoCorrectionRequest.js'

const props = {
  loading: false,
  error: null,
  actionError: null,
  actionLoading: false,
  role: 'HR',
  onRetry: vi.fn(), onRegenerate: vi.fn(), onApprove: vi.fn(), onReject: vi.fn(), onPay: vi.fn(),
  onGetData: vi.fn(),
  onCorrection: vi.fn(), onHrCorrection: vi.fn(), onApplyHrCorrection: vi.fn(),
  onCancel: vi.fn(), onCreateReplacement: vi.fn(), cancellationLoading: false,
  statementLoading: false, statementError: null, onStatementDownload: vi.fn(),
  hrCorrectionDraft: { earnings: [], deductions: [], adjustments: [] },
  onViewCorrectionDetails: vi.fn(), onDetails: vi.fn(),
}

afterEach(cleanup)

describe('Final Settlement salary month mapping', () => {
  it('uses the nested current version salary month for CEO correction details', () => {
    const settlement = { employee_name: 'Rohit', current_version: { calculation_inputs: { salary_month: '2026-09' } } }
    expect(getSettlementSalaryMonth(settlement)).toBe('2026-09')
    render(<CorrectionDetailsModal isOpen settlement={{ ...settlement, ceo_correction_requests: [{ issues: [{ field_name: 'other_earnings' }] }] }} onClose={vi.fn()} />)
    expect(screen.getByText('2026-09')).toBeTruthy()
  })

  it('keeps the empty fallback when no salary month exists', () => {
    expect(getSettlementSalaryMonth({ current_version: { calculation_results: {} } })).toBeUndefined()
  })
})

describe('Final Settlement Get Data action', () => {
  it('is visible only to HR for DRAFT settlements', () => {
    render(<SettlementContent settlement={{ status: 'DRAFT' }} {...props} role="HR" />)
    expect(screen.getByRole('button', { name: 'Get Data' })).toBeTruthy()
    cleanup()
    render(<SettlementContent settlement={{ status: 'DRAFT' }} {...props} role="CEO" />)
    expect(screen.queryByRole('button', { name: 'Get Data' })).toBeNull()
    cleanup()
    render(<SettlementContent settlement={{ status: 'GENERATED' }} {...props} role="HR" />)
    expect(screen.queryByRole('button', { name: 'Get Data' })).toBeNull()
  })

  it('invokes the supplied regeneration handler and prevents duplicate clicks while loading', () => {
    const onGetData = vi.fn()
    const { rerender } = render(<SettlementContent settlement={{ status: 'DRAFT' }} {...props} onGetData={onGetData} role="HR" />)
    screen.getByRole('button', { name: 'Get Data' }).click()
    expect(onGetData).toHaveBeenCalledTimes(1)
    rerender(<SettlementContent settlement={{ status: 'DRAFT' }} {...props} onGetData={onGetData} actionLoading role="HR" />)
    expect(screen.getByRole('button', { name: 'Getting Data...' })).toHaveProperty('disabled', true)
  })
})

describe('Final Settlement cancellation and replacement actions', () => {
  it.each(['GENERATED', 'HR_APPROVED', 'CEO_APPROVED'])('shows cancellation for CEO %s', (status) => {
    render(<SettlementContent settlement={{ status, payment_status: 'PENDING' }} {...props} role="CEO" />)
    expect(screen.getByRole('button', { name: 'Cancel Settlement' })).toBeTruthy()
  })

  it('does not show cancellation for HR, protected statuses, paid records, or populated payment dates', () => {
    for (const settlement of [
      { status: 'DRAFT' }, { status: 'HR_REJECTED' }, { status: 'CORRECTION_REQUIRED' },
      { status: 'PAYMENT_PENDING' }, { status: 'CANCELLED' },
      { status: 'CEO_APPROVED', payment_status: 'PAID' },
      { status: 'CEO_APPROVED', payment_status: 'PENDING', payment_date: '2026-10-15' },
    ]) {
      const { unmount } = render(<SettlementContent settlement={settlement} {...props} role="CEO" />)
      expect(screen.queryByRole('button', { name: 'Cancel Settlement' })).toBeNull()
      unmount()
    }
    render(<SettlementContent settlement={{ status: 'GENERATED', payment_status: 'PENDING' }} {...props} role="HR" />)
    expect(screen.queryByRole('button', { name: 'Cancel Settlement' })).toBeNull()
  })

  it('shows replacement only for a cancelled settlement and invokes the supplied handlers', async () => {
    render(<SettlementContent settlement={{ status: 'CANCELLED' }} {...props} role="CEO" />)
    expect(screen.getByRole('button', { name: 'Create Replacement' })).toBeTruthy()
    screen.getByRole('button', { name: 'Create Replacement' }).click()
    expect(props.onCreateReplacement).toHaveBeenCalled()
  })
})

describe('Final Settlement HR_REJECTED notice', () => {
  it('renders the HR rejection warning with its backend reason and no details action', () => {
    render(<SettlementContent settlement={{ status: 'HR_REJECTED', hr_rejection_reason: 'ok' }} {...props} />)
    expect(screen.queryByText('Settlement Rejected by HR')).toBeNull()
    expect(screen.getByText('Needs Changes')).toBeTruthy()
    expect(screen.getByText('HR Rejection Reason')).toBeTruthy()
    expect(screen.getByText('ok')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Make Changes' })).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'View Details' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Request Correction' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Approve Settlement' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Retry Calculation' })).toBeNull()
  })

  it.each(['CEO', 'Employee'])('hides Request Correction for %s', (role) => {
    render(<SettlementContent settlement={{ status: 'HR_REJECTED' }} {...props} role={role} />)
    expect(screen.queryByRole('button', { name: 'Request Correction' })).toBeNull()
  })

  it.each(['GENERATED', 'HR_APPROVED', 'CORRECTION_REQUIRED', 'PAYMENT_PENDING', 'PAID'])('does not render for %s', (status) => {
    render(<SettlementContent settlement={{ status }} {...props} />)
    expect(screen.queryByText('Settlement Rejected by HR')).toBeNull()
  })
})

describe('Final Settlement CEO correction request mapping', () => {
  it('renders only the most recent backend CEO correction request in the compact layout', () => {
    render(<CorrectionDetailsModal isOpen settlement={{ employee_name: 'Rohit Bhatt', salary_month: '2026-09', ceo_correction_requests: [{ id: 10, remarks: 'Please fix deductions', created_at: '2026-10-15T12:00:00Z', issues: [{ field_name: 'other_deductions', current_value: 300, expected_value: 22, reason: 'Incorrect deduction' }] }, { id: 9, remarks: 'Fix earnings', created_at: '2026-10-14T12:00:00Z', issues: [{ field_name: 'other_earnings', current_value: 200, expected_value: 222, reason: 'Incorrect earning' }] }] }} onClose={vi.fn()} />)

    expect(screen.getByText('Rohit Bhatt')).toBeTruthy()
    expect(screen.getByText('2026-09')).toBeTruthy()
    expect(screen.getByText('Other Deductions')).toBeTruthy()
    expect(screen.getByText('300')).toBeTruthy()
    expect(screen.getByText('22')).toBeTruthy()
    expect(screen.getByText('Incorrect deduction')).toBeTruthy()
    expect(screen.queryByText('Fix earnings')).toBeNull()
    expect(screen.queryByText('Incorrect earning')).toBeNull()
  })

  it('shows the empty state only when correction requests are absent', () => {
    render(<CorrectionDetailsModal isOpen settlement={{ ceo_correction_requests: [] }} onClose={vi.fn()} />)
    expect(screen.getByText('No correction issues were provided by the backend.')).toBeTruthy()
  })

  it('shows the HR correction warning and actions for CORRECTION_REQUIRED', () => {
    render(<SettlementContent settlement={{ status: 'CORRECTION_REQUIRED' }} {...props} />)

    expect(screen.getByText('Correction Required')).toBeTruthy()
    expect(screen.getByText('Review the requested correction and apply the required changes.')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'View Details' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Make Changes' })).toBeTruthy()
  })

  it('uses populated CEO request issues when the legacy field is empty', () => {
    const request = getLatestCorrectionRequest({
      correction_issues: [],
      ceo_correction_requests: [{
        id: 13,
        remarks: 'dfdsf',
        created_at: '2026-10-15T12:05:57.226194+05:30',
        issues: [{ field_name: 'other_earnings', current_value: '0.00', expected_value: '2222', reason: 'ok' }],
      }],
    })

    expect(request.remarks).toBe('dfdsf')
    expect(request.issues).toEqual([{ field_name: 'other_earnings', current_value: '0.00', expected_value: '2222', reason: 'ok' }])
  })

  it('selects the latest populated request and supports multiple issues', () => {
    const request = getLatestCorrectionRequest({
      ceo_correction_requests: [
        { created_at: '2026-10-15T10:00:00+05:30', issues: [{ field_name: 'other_earnings' }] },
        { created_at: '2026-10-15T12:00:00+05:30', issues: [{ field_name: 'other_deductions' }, { field_name: 'previous_month_adjustment' }] },
      ],
    })

    expect(request.issues).toHaveLength(2)
    expect(request.issues[0].field_name).toBe('other_deductions')
  })

  it('returns no request when all correction requests lack usable issues', () => {
    expect(getLatestCorrectionRequest({ ceo_correction_requests: [{ issues: [] }] })).toBeNull()
  })
})

describe('Final Settlement CEO payment controls', () => {
  it('shows the official statement download only for HR and CEO paid settlements', () => {
    const paidSettlement = { id: 12, employee_code: 'EMP-000006', status: 'CEO_APPROVED', payment_status: 'PAID' }
    render(<SettlementContent settlement={paidSettlement} {...props} role="HR" />)
    expect(screen.getByRole('button', { name: 'Download Settlement Statement' })).toBeTruthy()

    cleanup()
    render(<SettlementContent settlement={paidSettlement} {...props} role="CEO" />)
    expect(screen.getByRole('button', { name: 'Download Settlement Statement' })).toBeTruthy()

    cleanup()
    render(<SettlementContent settlement={{ ...paidSettlement, payment_status: 'PENDING' }} {...props} role="CEO" />)
    expect(screen.queryByRole('button', { name: 'Download Settlement Statement' })).toBeNull()
  })

  it('shows payment controls only for CEO_APPROVED settlements with pending payment', () => {
    render(<SettlementContent settlement={{ status: 'CEO_APPROVED', payment_status: 'PENDING' }} {...props} role="CEO" />)

    expect(screen.getByText('Actual Payment Date')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Actual payment date' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Mark as Paid' })).toBeTruthy()
    expect(screen.queryByRole('button', { name: 'Request Correction' })).toBeNull()
  })

  it('does not show payment controls for paid settlements', () => {
    render(<SettlementContent settlement={{ status: 'CEO_APPROVED', payment_status: 'PAID' }} {...props} role="CEO" />)

    expect(screen.queryByText('Actual Payment Date')).toBeNull()
    expect(screen.queryByRole('button', { name: 'Mark as Paid' })).toBeNull()
  })
})

describe('Final Settlement adjustment data loading', () => {
  const fallbackAdjustment = {
    reference_month: '2026-08-01',
    direction: 'NEGATIVE',
    amount: '3434.00',
    reason: 'Previous salary correction',
    supporting_reference: 'ADJ-1',
    idempotency_key: 'settlement-adjustment-1',
  }

  it('loads adjustments from calculation inputs and preserves their metadata', () => {
    const settlement = { current_version: { calculation_inputs: { previous_month_adjustments: [fallbackAdjustment] } } }
    const draft = getSettlementCorrectionDraft(settlement)

    expect(draft.adjustments).toEqual([fallbackAdjustment])
    expect(adjustmentAmount(settlement)).toBe(-3434)
  })

  it('prefers current version adjustments over calculation-input fallbacks', () => {
    const settlement = {
      current_version: {
        adjustments: [{ ...fallbackAdjustment, amount: '100.00', direction: 'POSITIVE' }],
        calculation_inputs: { previous_month_adjustments: [fallbackAdjustment] },
      },
    }

    expect(getSettlementCorrectionDraft(settlement).adjustments[0].amount).toBe('100.00')
    expect(adjustmentAmount(settlement)).toBe(100)
  })

  it.each(['HR_REJECTED', 'CORRECTION_REQUIRED'])('displays the loaded adjustment total for %s', (status) => {
    const settlement = { status, current_version: { calculation_inputs: { previous_month_adjustments: [fallbackAdjustment] } } }
    render(<SettlementContent settlement={settlement} {...props} hrCorrectionDraft={getSettlementCorrectionDraft(settlement)} />)

    expect(screen.getByText('-₹3,434.00')).toBeTruthy()
  })
})

describe('Final Settlement backend calculation totals', () => {
  it('formats previous month adjustments with two decimal places', () => {
    render(<SettlementContent settlement={{ current_version: { adjustments: [{ amount: '1111', direction: 'POSITIVE' }] } }} {...props} />)
    expect(screen.getByText('1111.00')).toBeTruthy()
  })

  it('renders gross salary and total deductions from calculation results', () => {
    render(<SettlementContent settlement={{ current_version: { calculation_results: { gross_salary: '9333.33', total_deductions: '123.45' } } }} {...props} />)

    expect(screen.getByText('9333.33')).toBeTruthy()
    expect(screen.getByText('123.45')).toBeTruthy()
  })

  it('renders zero totals and leaves missing totals as em dashes', () => {
    const { unmount } = render(<SettlementContent settlement={{ current_version: { calculation_results: { gross_salary: '0.00', total_deductions: 0 } } }} {...props} />)
    expect(screen.getAllByText('0.00').length).toBeGreaterThan(0)
    expect(screen.getAllByText('0').length).toBeGreaterThan(0)
    unmount()

    render(<SettlementContent settlement={{ current_version: { calculation_results: {} } }} {...props} />)
    expect(screen.getAllByText('—').length).toBeGreaterThan(0)
  })
})

describe('Final Settlement earnings and deductions details', () => {
  const items = [
    { id: 112, item_type: 'OTHER_EARNING', direction: 'POSITIVE', amount: '200.00', description: 'ok' },
    { id: 113, item_type: 'OTHER_DEDUCTION', direction: 'NEGATIVE', amount: '200.00', description: 'ok' },
  ]

  it('maps current version items into both detail categories without direction rows', () => {
    const settlement = { current_version: { items } }
    expect(settlementCategoryRecords(settlement, 'earnings')).toEqual([items[0]])
    expect(settlementCategoryRecords(settlement, 'deductions')).toEqual([items[1]])

    render(<SettlementCategoryModal category={{ key: 'earnings', label: 'Other Earnings' }} items={[items[0]]} onClose={vi.fn()} />)
    expect(screen.getByText('₹200.00')).toBeTruthy()
    expect(screen.getByText('ok')).toBeTruthy()
    expect(screen.queryByText('POSITIVE')).toBeNull()
    cleanup()

    render(<SettlementCategoryModal category={{ key: 'deductions', label: 'Other Deductions' }} items={[items[1]]} onClose={vi.fn()} />)
    expect(screen.getByText('₹200.00')).toBeTruthy()
    expect(screen.getByText('ok')).toBeTruthy()
    expect(screen.queryByText('NEGATIVE')).toBeNull()
  })

  it('supports multiple items and missing descriptions', () => {
    render(<SettlementCategoryModal category={{ key: 'earnings', label: 'Other Earnings' }} items={[items[0], { id: 114, item_type: 'OTHER_EARNING', amount: '50.50' }]} onClose={vi.fn()} />)
    expect(screen.getByText('₹200.00')).toBeTruthy()
    expect(screen.getByText('₹50.50')).toBeTruthy()
    expect(screen.getAllByText('—').length).toBeGreaterThan(0)
  })
})
