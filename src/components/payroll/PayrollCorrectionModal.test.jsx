// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { afterEach, describe, expect, it, vi } from 'vitest'
import PayrollCorrectionModal from './PayrollCorrectionModal.jsx'

const payroll = {
  current_version: {
    earnings: [
      { id: 16, earning_type: 'OTHER', amount: '14345.00', reason: 'dasff' },
      { id: 17, earning_type: 'OTHER', amount: '500.00', reason: 'Travel' },
    ],
    deductions: [{ id: 16, deduction_type: 'OTHER', amount: '23123.00', reason: 'dfsf' }],
    adjustments: [{ id: 21, reference_month: '2026-07-01', direction: 'POSITIVE', amount: '4234.00', reason: 'Adjustment' }],
  },
}

function renderModal(onSubmit = vi.fn(), payrollData = payroll) {
  render(<PayrollCorrectionModal isOpen loading={false} error={null} payroll={payrollData} onCancel={vi.fn()} onSubmit={onSubmit} />)
  return onSubmit
}

describe('PayrollCorrectionModal record current values', () => {
  afterEach(cleanup)

  it('reinitializes adjustment rows when the parent draft changes', () => {
    function DraftHost({ draft }) {
      return <PayrollCorrectionModal key={JSON.stringify(draft)} isOpen loading={false} error={null} payroll={payroll} draft={draft} componentType="adjustments" mode="manual" draftOnly onCancel={vi.fn()} onSubmit={vi.fn()} onSaveDraft={vi.fn()} submitLabel="Save Changes" />
    }

    const { rerender } = render(<DraftHost draft={{ adjustments: [{ reference_month: '2025-08-01', direction: 'POSITIVE', amount: '200.00', reason: 'First' }] }} />)
    expect(screen.getByLabelText('adjustments amount')).toHaveValue('200.00')

    rerender(<DraftHost draft={{ adjustments: [{ reference_month: '2025-09-01', direction: 'NEGATIVE', amount: '75.00', reason: 'Latest' }, { reference_month: '2025-10-01', direction: 'POSITIVE', amount: '25.00', reason: 'Second latest' }] }} />)

    expect(screen.getAllByLabelText('adjustments amount').map((input) => input.value)).toEqual(['75.00', '25.00'])
    expect(screen.getAllByLabelText('adjustments reason').map((input) => input.value)).toEqual(['Latest', 'Second latest'])
  })

  it('shows the single deduction amount and requires a selection for multiple earnings', () => {
    renderModal()

    fireEvent.change(screen.getByLabelText('Field *'), { target: { value: 'other_deductions' } })
    expect(screen.getByLabelText('Current Value *')).toHaveValue('23123.00')

    fireEvent.change(screen.getByLabelText('Field *'), { target: { value: 'other_earnings' } })
    expect(screen.getByLabelText('Current Value *')).toHaveValue('')
    expect(screen.getByLabelText('Record *')).toBeInTheDocument()
  })

  it('defaults empty earnings and deductions to 0.00 without creating records', () => {
    renderModal(vi.fn(), { current_version: { earnings: [], deductions: [], adjustments: [] } })

    fireEvent.change(screen.getByLabelText('Field *'), { target: { value: 'other_earnings' } })
    expect(screen.getByLabelText('Current Value *')).toHaveValue('0.00')
    fireEvent.change(screen.getByLabelText('Field *'), { target: { value: 'other_deductions' } })
    expect(screen.getByLabelText('Current Value *')).toHaveValue('0.00')
    expect(screen.getByLabelText('Reason *')).toHaveValue('NA')
  })

  it('initializes newly added issues with an editable NA reason', () => {
    renderModal()
    fireEvent.click(screen.getByRole('button', { name: '+ Add Another Issue' }))
    expect(screen.getAllByLabelText('Reason *')).toHaveLength(2)
    expect(screen.getAllByLabelText('Reason *')[1]).toHaveValue('NA')
    fireEvent.change(screen.getAllByLabelText('Reason *')[1], { target: { value: 'Needs review' } })
    expect(screen.getAllByLabelText('Reason *')[1]).toHaveValue('Needs review')
  })

  it('uses the selected earnings record amount in the submitted payload', async () => {
    const onSubmit = renderModal()

    fireEvent.change(screen.getByLabelText('Field *'), { target: { value: 'other_earnings' } })
    fireEvent.change(screen.getByLabelText('Record *'), { target: { value: '17' } })
    expect(screen.getByLabelText('Current Value *')).toHaveValue('500.00')
    fireEvent.change(screen.getByLabelText('Expected Value *'), { target: { value: '600.00' } })
    fireEvent.change(screen.getByLabelText('Reason *'), { target: { value: 'Correct travel amount' } })
    fireEvent.click(screen.getByRole('button', { name: 'Request Correction' }))

    expect(onSubmit).toHaveBeenCalledWith({
      remarks: '',
      issues: [{
        field_name: 'other_earnings',
        current_value: '500.00',
        expected_value: '600.00',
        reason: 'Correct travel amount',
      }],
    })
  })

  it('shows complete adjustment details and submits its amount with the documented keys', () => {
    const onSubmit = renderModal()

    fireEvent.change(screen.getByLabelText('Field *'), { target: { value: 'previous_month_adjustment' } })

    const details = screen.getByLabelText('Adjustment details')
    expect(within(details).getByText('July 1, 2026')).toBeInTheDocument()
    expect(within(details).getByText('POSITIVE')).toBeInTheDocument()
    expect(within(details).getByText('4234.00')).toBeInTheDocument()
    expect(within(details).getByText('Adjustment')).toBeInTheDocument()
    expect(within(details).getByText('—')).toBeInTheDocument()
    expect(within(details).getByText('21')).toBeInTheDocument()
    expect(screen.getByLabelText('Current Value *')).toHaveValue('4234.00')
    fireEvent.change(screen.getByLabelText('Expected Value *'), { target: { value: '5000.00' } })
    fireEvent.change(screen.getByLabelText('Reason *'), { target: { value: 'Amount is incorrect' } })
    fireEvent.click(screen.getByRole('button', { name: 'Request Correction' }))

    expect(onSubmit).toHaveBeenCalledWith({
      remarks: '',
      issues: [{
        field_name: 'previous_month_adjustment',
        current_value: '4234.00',
        expected_value: '5000.00',
        reason: 'Amount is incorrect',
      }],
    })
  })

  it('submits adjustment months as the first day of the selected month', async () => {
    const onSubmit = vi.fn()
    render(
      <PayrollCorrectionModal
        isOpen
        loading={false}
        error={null}
        payroll={payroll}
        draft={{ adjustments: [{ reference_month: '2025-08-15', direction: 'POSITIVE', amount: '200.00', reason: 'Adjustment', supporting_reference: '' }] }}
        componentType="adjustments"
        mode="manual"
        onCancel={vi.fn()}
        onSubmit={onSubmit}
        submitLabel="Save Changes"
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Reference month' }))
    fireEvent.click(screen.getByRole('button', { name: '2025' }))
    fireEvent.click(screen.getByRole('button', { name: 'Aug' }))
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }))

    expect(onSubmit).toHaveBeenCalledWith({
      payload: {
        adjustments: [{
          reference_month: '2025-08-01',
          direction: 'POSITIVE',
          amount: '200.00',
          reason: 'Adjustment',
        }],
      },
    })
  })

  it('normalizes loaded and newly selected months for every adjustment row', () => {
    const onSaveDraft = vi.fn()
    render(
      <PayrollCorrectionModal
        isOpen
        loading={false}
        error={null}
        payroll={payroll}
        draft={{ adjustments: [{ reference_month: '2026-08-15', direction: 'POSITIVE', amount: '200.00', reason: 'First' }] }}
        componentType="adjustments"
        mode="manual"
        draftOnly
        onCancel={vi.fn()}
        onSubmit={vi.fn()}
        onSaveDraft={onSaveDraft}
        submitLabel="Save Changes"
      />,
    )

    expect(screen.getAllByRole('button', { name: 'Reference month' })[0]).toHaveTextContent('Aug 2026')
    fireEvent.click(screen.getByRole('button', { name: '+ Add Adjustment' }))
    fireEvent.click(screen.getAllByRole('button', { name: 'Reference month' })[1])
    fireEvent.click(screen.getByRole('button', { name: '2026' }))
    fireEvent.click(screen.getByRole('button', { name: 'Aug' }))
    fireEvent.change(screen.getAllByLabelText('Adjustment direction')[1], { target: { value: 'NEGATIVE' } })
    fireEvent.change(screen.getAllByLabelText('adjustments amount')[1], { target: { value: '50.00' } })
    fireEvent.change(screen.getAllByLabelText('adjustments reason')[1], { target: { value: 'Second' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }))

    expect(onSaveDraft).toHaveBeenCalledWith({ draft: { adjustments: [
      { reference_month: '2026-08-01', direction: 'POSITIVE', amount: '200.00', reason: 'First' },
      { reference_month: '2026-08-01', direction: 'NEGATIVE', amount: '50.00', reason: 'Second' },
    ] } })
  })

  it('initializes and submits all adjustment rows with metadata', async () => {
    const onSaveDraft = vi.fn()
    render(
      <PayrollCorrectionModal
        isOpen
        loading={false}
        error={null}
        payroll={payroll}
        draft={{ adjustments: [
          { reference_month: '2025-08-15', direction: 'POSITIVE', amount: '200.00', reason: 'First', supporting_reference: 'REF-1', idempotency_key: 'KEY-1' },
          { reference_month: '2025-07-01', direction: 'NEGATIVE', amount: '50.00', reason: 'Second', supporting_reference: 'REF-2', idempotency_key: 'KEY-2' },
        ] }}
        componentType="adjustments"
        mode="manual"
        draftOnly
        onCancel={vi.fn()}
        onSubmit={vi.fn()}
        onSaveDraft={onSaveDraft}
        submitLabel="Save Changes"
      />,
    )

    expect(screen.getAllByLabelText('adjustments amount')).toHaveLength(2)
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }))

    expect(onSaveDraft).toHaveBeenCalledWith({ draft: { adjustments: [
      { reference_month: '2025-08-01', direction: 'POSITIVE', amount: '200.00', reason: 'First', supporting_reference: 'REF-1', idempotency_key: 'KEY-1' },
      { reference_month: '2025-07-01', direction: 'NEGATIVE', amount: '50.00', reason: 'Second', supporting_reference: 'REF-2', idempotency_key: 'KEY-2' },
    ] } })
  })

  it.each([
    ['earnings', 'earnings amount', 'earnings reason'],
    ['deductions', 'deductions amount', 'deductions reason'],
    ['adjustments', 'adjustments amount', 'adjustments reason'],
  ])('emits an empty %s collection when its final entry is cleared', (componentType, amountLabel, reasonLabel) => {
    const onSaveDraft = vi.fn()
    render(
      <PayrollCorrectionModal
        isOpen
        loading={false}
        error={null}
        payroll={payroll}
        draft={{ [componentType]: [{ amount: '200.00', reason: 'Existing' }] }}
        componentType={componentType}
        mode="manual"
        draftOnly
        onCancel={vi.fn()}
        onSubmit={vi.fn()}
        onSaveDraft={onSaveDraft}
        submitLabel="Save Changes"
      />,
    )

    fireEvent.change(screen.getByLabelText(amountLabel), { target: { value: '' } })
    fireEvent.change(screen.getByLabelText(reasonLabel), { target: { value: '' } })
    fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }))

    expect(onSaveDraft).toHaveBeenCalledWith({ draft: { [componentType]: [] } })
  })

  it('removes the final adjustment without submitting before save', () => {
    const onSubmit = vi.fn()
    render(
      <PayrollCorrectionModal
        isOpen
        loading={false}
        error={null}
        payroll={payroll}
        draft={{ adjustments: [{ reference_month: '2025-08-01', direction: 'POSITIVE', amount: '200.00', reason: 'Existing' }] }}
        componentType="adjustments"
        mode="manual"
        onCancel={vi.fn()}
        onSubmit={onSubmit}
        submitLabel="Save Changes"
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Remove Adjustment' }))
    expect(screen.getByRole('button', { name: 'Add Adjustment' })).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('keeps adjustment data visible when a duplicate idempotency error is displayed', () => {
    render(
      <PayrollCorrectionModal
        isOpen
        loading={false}
        error={{ response: { status: 400, data: { detail: { idempotency_key: ['This key has already been used.'] } } } }}
        payroll={payroll}
        draft={{ adjustments: [{ reference_month: '2026-08-01', direction: 'POSITIVE', amount: '100.00', reason: 'Adjustment', supporting_reference: 'REF-1', idempotency_key: 'KEY-1' }] }}
        componentType="adjustments"
        mode="manual"
        draftOnly
        onCancel={vi.fn()}
        onSubmit={vi.fn()}
        onSaveDraft={vi.fn()}
        submitLabel="Save Changes"
      />,
    )

    expect(screen.getByText('This key has already been used.')).toBeInTheDocument()
    expect(screen.getByLabelText('adjustments amount')).toHaveValue('100.00')
    expect(screen.getByLabelText('adjustments reason')).toHaveValue('Adjustment')
    expect(screen.getByPlaceholderText('Supporting reference (optional)')).toHaveValue('REF-1')
  })
})
