import { describe, expect, it } from 'vitest'
import { roleToDashboard } from './roles.js'

describe('roleToDashboard', () => {
  it('routes CEO to the CEO dashboard', () => {
    expect(roleToDashboard.CEO).toBe('/dashboard/ceo')
  })

  it('routes HR to the HR dashboard', () => {
    expect(roleToDashboard.HR).toBe('/dashboard/hr')
  })

  it('routes TL to the team leader dashboard', () => {
    expect(roleToDashboard.TL).toBe('/dashboard/team-leader')
  })

  it('routes EMPLOYEE to the employee dashboard', () => {
    expect(roleToDashboard.EMPLOYEE).toBe('/dashboard')
  })
})
