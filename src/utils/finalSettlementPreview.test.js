import { describe, expect, it } from 'vitest'
import { finalSettlementAuthorizedBy, finalSettlementEmployeeFields, finalSettlementItemLabel } from './finalSettlementPreview.js'

describe('final settlement preview mappings', () => {
  it('maps internal item labels without changing custom descriptions', () => {
    expect(finalSettlementItemLabel({ item_type: 'CURRENT_MONTH_SALARY' })).toBe('Monthly Salary')
    expect(finalSettlementItemLabel({ item_type: 'LOP_DEDUCTION' })).toBe('Loss of Pay')
    expect(finalSettlementItemLabel({ item_type: 'PREVIOUS_MONTH_ADJUSTMENT' })).toBe('Salary Adjustment')
    expect(finalSettlementItemLabel({ description: 'Incentive' })).toBe('Incentive')
    expect(finalSettlementItemLabel({ description: 'Tea', item_type: 'OTHER_DEDUCTION' })).toBe('Tea')
  })

  it('maps employee and authorized-person fields with safe fallbacks', () => {
    expect(finalSettlementEmployeeFields({ employee: { department_name: 'Development', designation: 'Engineer', joining_date: '2026-07-07' } })).toEqual({ department: 'Development', designation: 'Engineer', employmentStartDate: '2026-07-07' })
    expect(finalSettlementEmployeeFields({ current_version: { employee_department: 'Development', calculation_inputs: { date_of_joining: '2026-07-07' } } })).toEqual({ department: 'Development', designation: undefined, employmentStartDate: '2026-07-07' })
    expect(finalSettlementEmployeeFields({ payroll: { employee_department: 'Development', current_version: { calculation_inputs: { date_of_joining: '2026-07-07' } } } })).toEqual({ department: 'Development', designation: undefined, employmentStartDate: '2026-07-07' })
    expect(finalSettlementEmployeeFields({})).toEqual({ department: undefined, designation: undefined, employmentStartDate: undefined })
    expect(finalSettlementAuthorizedBy({ authorized_by: { name: 'Priya Sharma' } })).toBe('Priya Sharma')
    expect(finalSettlementAuthorizedBy({ transaction_reference: 'TX-1', employee_name: 'Employee' })).toBeUndefined()
  })
})
