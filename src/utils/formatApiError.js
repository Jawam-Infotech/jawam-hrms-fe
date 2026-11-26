/**
 * Normalizes DRF backend error payloads into human-readable string feedback
 * suitable for direct rendering in UI banners and alerts.
 *
 * Handles:
 * - Direct business rule errors: {"detail": "Error message"}
 * - Field-level errors: {"target_end_date": ["The target end date cannot be before the start date."]}
 * - Nested detail errors: {"detail": {"field_name": ["error message"]}}
 * - Non-field errors: {"non_field_errors": ["Error"]}
 * - HTTP status codes: 400, 401, 403, 404, 429
 */
export function formatApiError(error, defaultMessage = 'An unexpected error occurred.') {
  const parsed = parseApiError(error, defaultMessage)
  return parsed.message
}

export function parseApiError(error, defaultMessage = 'An unexpected error occurred.') {
  if (!error) return { message: defaultMessage, fieldErrors: {}, status: null }

  const status = error.response?.status || null
  const data = error.response?.data

  // If server returns HTML or non-object
  if (!data || typeof data !== 'object') {
    if (status === 403) {
      return {
        message: 'You do not have permission to perform this action.',
        fieldErrors: {},
        status: 403,
      }
    }
    if (status === 404) {
      return { message: 'The requested resource was not found.', fieldErrors: {}, status: 404 }
    }
    return {
      message: error.message || defaultMessage,
      fieldErrors: {},
      status,
    }
  }

  // 1. Direct detail string: {"detail": "Business message"}
  if (typeof data.detail === 'string') {
    return {
      message: data.detail.trim(),
      fieldErrors: {},
      status,
    }
  }

  // 2. Nested field errors under detail: {"detail": {"name": ["Error"]}}
  // or direct object keys: {"name": ["Error"]}
  const rawFields = typeof data.detail === 'object' && data.detail !== null ? data.detail : data
  const fieldErrors = {}
  const messages = []

  for (const [key, val] of Object.entries(rawFields)) {
    if (key === 'detail' && typeof val === 'string') {
      messages.push(val)
      continue
    }

    if (Array.isArray(val) && val.length > 0) {
      const firstMsg = String(val[0]).trim()
      fieldErrors[key] = firstMsg
      if (key === 'non_field_errors') {
        messages.push(firstMsg)
      } else {
        messages.push(`${key}: ${firstMsg}`)
      }
    } else if (typeof val === 'string') {
      fieldErrors[key] = val.trim()
      if (key === 'non_field_errors') {
        messages.push(val.trim())
      } else {
        messages.push(`${key}: ${val.trim()}`)
      }
    }
  }

  const message = messages.length > 0 ? messages.join(' ') : defaultMessage

  return {
    message,
    fieldErrors,
    status,
  }
}

export default formatApiError
