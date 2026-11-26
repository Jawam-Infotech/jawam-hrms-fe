// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import EmployeeProfileHeader from './EmployeeProfileHeader.jsx'

afterEach(cleanup)

describe('EmployeeProfileHeader tenure', () => {
  it('shows tenure while hiding Date of Joining for restricted profile views', () => {
    render(<EmployeeProfileHeader employee={{ name: 'Asha Sharma', joiningDate: '2022-01-01', employmentStatus: 'ACTIVE' }} hideMissingSensitiveFields hideJoiningDate showTenure />)
    expect(screen.getByText('Tenure:').parentElement.textContent).toMatch(/yrs|mos/)
    expect(screen.queryByText(/Date of Joining:/)).toBeNull()
  })

  it('handles missing joining dates gracefully', () => {
    render(<EmployeeProfileHeader employee={{ name: 'Asha Sharma' }} showTenure />)
    expect(screen.getByText('Tenure:').parentElement.textContent).toContain('N/A')
  })
})
