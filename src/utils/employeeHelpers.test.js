import { describe, expect, it } from 'vitest'
import { getEmployeeDisplayId } from './employeeHelpers.js'

describe('getEmployeeDisplayId', () => {
  it('uses the backend employee_id when available', () => {
    expect(
      getEmployeeDisplayId({
        employee_id: 'EMP-123',
        employeeId: 'EMP-999',
      }),
    ).toBe('EMP-123')
  })

  it('supports the frontend employeeId field', () => {
    expect(
      getEmployeeDisplayId({
        employeeId: 'EMP-456',
      }),
    ).toBe('EMP-456')
  })

  it('returns an empty string when no employee ID exists', () => {
    expect(getEmployeeDisplayId({})).toBe('')
  })

  it('does not generate a fake employee ID', () => {
    expect(getEmployeeDisplayId({})).not.toBe('EMP-001')
  })
})