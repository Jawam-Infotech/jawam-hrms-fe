import { describe, expect, it } from 'vitest'
import { buildFinalSettlementCorrectionPayload, normalizeAdjustmentDraft, normalizeComponentEntries, normalizeReferenceMonth } from './finalSettlementCorrection.js'

describe('final settlement correction helpers', () => {
  it('normalizes month-only adjustment dates', () => {
    expect(normalizeReferenceMonth('2026-08')).toBe('2026-08-01')
    expect(normalizeReferenceMonth('2026-08-15')).toBe('2026-08-01')
  })

  it('preserves adjustment metadata and optional idempotency keys when supplied', () => {
    expect(normalizeAdjustmentDraft([{ reference_month: '2026-08', direction: 'POSITIVE', amount: '1000.00', reason: 'Previous salary', supporting_reference: 'ADJ-1', idempotency_key: 'settlement-adjustment-1' }])).toEqual([{ reference_month: '2026-08-01', direction: 'POSITIVE', amount: '1000.00', reason: 'Previous salary', supporting_reference: 'ADJ-1', idempotency_key: 'settlement-adjustment-1' }])
  })

  it('omits optional adjustment fields when they are not supplied', () => {
    expect(normalizeAdjustmentDraft([{ reference_month: '2026-08-01', direction: 'NEGATIVE', amount: '50.00', reason: 'Deduction' }])).toEqual([{ reference_month: '2026-08-01', direction: 'NEGATIVE', amount: '50.00', reason: 'Deduction' }])
  })

  it('maps descriptions to reasons and does not retain a conflicting reason', () => {
    expect(normalizeComponentEntries([
      { amount: '200.00', description: '', reason: 'ok' },
      { amount: '100.00', description: 'Advance recovery', reason: 'old reason' },
      { amount: '50.00', reason: 'Legacy reason' },
    ])).toEqual([
      { amount: '200.00', reason: '' },
      { amount: '100.00', reason: 'Advance recovery' },
      { amount: '50.00', reason: 'Legacy reason' },
    ])
  })

  it('builds the exact submitted payload from item-shaped response entries', () => {
    const responseItems = [
      { id: 44, item_type: 'OTHER_EARNING', amount: '200.00', description: '', reason: 'ok' },
      { id: 45, item_type: 'OTHER_DEDUCTION', amount: '200.00', description: '', reason: 'ok' },
    ]
    expect(buildFinalSettlementCorrectionPayload({
      draft: {
        earnings: normalizeComponentEntries(responseItems.filter((item) => item.item_type === 'OTHER_EARNING')),
        deductions: normalizeComponentEntries(responseItems.filter((item) => item.item_type === 'OTHER_DEDUCTION')),
        adjustments: [],
      },
      editedCategories: new Set(['earnings', 'deductions']),
      pendingPreviousSalary: '0.00',
    })).toEqual({
      pending_previous_salary: '0.00',
      other_earnings: [{ amount: '200.00', reason: '' }],
      other_deductions: [{ amount: '200.00', reason: '' }],
      adjustments: [],
    })
  })

  it('builds the supported payload without adjustments when none are provided', () => {
    const existing = { earnings: [{ amount: '200', reason: 'Existing' }], deductions: [{ amount: '100', reason: 'Existing' }], adjustments: [{ amount: '50' }] }
    expect(buildFinalSettlementCorrectionPayload({ draft: { earnings: [{ amount: '300', reason: 'Updated' }], deductions: existing.deductions }, existingDraft: existing, editedCategories: new Set(['earnings']), pendingPreviousSalary: '500' })).toEqual({ pending_previous_salary: '500', other_earnings: [{ amount: '300', reason: 'Updated' }], other_deductions: existing.deductions })
  })

  it('keeps multiple earnings and deductions in their own payload sections', () => {
    expect(buildFinalSettlementCorrectionPayload({
      draft: {
        earnings: [{ amount: '200.00', reason: 'Bonus' }, { amount: '75.00', reason: 'Allowance' }],
        deductions: [{ amount: '100.00', reason: 'Advance recovery' }, { amount: '25.00', reason: 'Loan' }],
        adjustments: [],
      },
      editedCategories: new Set(['earnings', 'deductions']),
      pendingPreviousSalary: '0.00',
    })).toEqual({
      pending_previous_salary: '0.00',
      other_earnings: [{ amount: '200.00', reason: 'Bonus' }, { amount: '75.00', reason: 'Allowance' }],
      other_deductions: [{ amount: '100.00', reason: 'Advance recovery' }, { amount: '25.00', reason: 'Loan' }],
      adjustments: [],
    })
  })

  it('includes multiple normalized adjustments while preserving unchanged categories', () => {
    const adjustments = [
      { reference_month: '2026-08', direction: 'POSITIVE', amount: '1000.00', reason: 'Salary difference' },
      { reference_month: '2026-07-01', direction: 'NEGATIVE', amount: '50.00', reason: 'Recovery', supporting_reference: 'REF-2' },
    ]
    expect(buildFinalSettlementCorrectionPayload({ draft: { earnings: [], deductions: [], adjustments }, existingDraft: { earnings: [{ amount: '200', reason: 'Existing' }], deductions: [{ amount: '100', reason: 'Existing' }] }, pendingPreviousSalary: '500' })).toEqual({ pending_previous_salary: '500', other_earnings: [{ amount: '200', reason: 'Existing' }], other_deductions: [{ amount: '100', reason: 'Existing' }], adjustments: [{ reference_month: '2026-08-01', direction: 'POSITIVE', amount: '1000.00', reason: 'Salary difference' }, { reference_month: '2026-07-01', direction: 'NEGATIVE', amount: '50.00', reason: 'Recovery', supporting_reference: 'REF-2' }] })
  })
})
