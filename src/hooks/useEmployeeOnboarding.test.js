import { describe, expect, it } from 'vitest'
import { parseBackendErrors } from './useEmployeeOnboarding.js'

describe('parseBackendErrors', () => {
  it('maps nested detail field errors without stringifying the detail object', () => {
    const result = parseBackendErrors({
      response: {
        status: 400,
        data: { detail: { employment_status: ['Cannot transition employment status from ACTIVE to EXITED.'] } },
      },
    })

    expect(result).toEqual({
      status: 400,
      fieldErrors: { employmentStatus: 'Cannot transition employment status from ACTIVE to EXITED.' },
      message: '',
    })
  })

  it('preserves general detail messages', () => {
    expect(parseBackendErrors({ response: { status: 403, data: { detail: 'Not authorized.' } } })).toEqual({
      status: 403,
      fieldErrors: {},
      message: 'Not authorized.',
    })
  })

  it('uses a fallback for unexpected failures', () => {
    expect(parseBackendErrors({ request: {} })).toEqual({
      status: undefined,
      fieldErrors: {},
      message: 'Something went wrong. Please try again.',
    })
  })
})
