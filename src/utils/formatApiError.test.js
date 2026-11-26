import { describe, it, expect } from 'vitest'
import { formatApiError } from './formatApiError.js'

describe('formatApiError', () => {
  it('extracts detail string when present', () => {
    const error = {
      response: {
        data: {
          detail: 'A CANCELLED project is not archived (owner decision X3)',
        },
      },
    }
    expect(formatApiError(error)).toBe('A CANCELLED project is not archived (owner decision X3)')
  })

  it('formats field error object properly', () => {
    const error = {
      response: {
        data: {
          target_end_date: ['The target end date cannot be before the start date.'],
        },
      },
    }
    expect(formatApiError(error)).toBe('target_end_date: The target end date cannot be before the start date.')
  })

  it('formats non_field_errors array', () => {
    const error = {
      response: {
        data: {
          non_field_errors: ['Exactly one primary PM is required.'],
        },
      },
    }
    expect(formatApiError(error)).toBe('Exactly one primary PM is required.')
  })

  it('handles fallback string message on network error', () => {
    const error = new Error('Network Error')
    expect(formatApiError(error, 'Fallback message')).toBe('Network Error')
  })

  it('returns default fallback when error has no message', () => {
    expect(formatApiError({}, 'Action failed.')).toBe('Action failed.')
  })
})
