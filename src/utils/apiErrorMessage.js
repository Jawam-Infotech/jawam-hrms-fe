function extractFirstString(value) {
  if (typeof value === 'string') {
    return value.trim()
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const message = extractFirstString(item)
      if (message) {
        return message
      }
    }
  }

  if (value && typeof value === 'object') {
    for (const nestedValue of Object.values(value)) {
      const message = extractFirstString(nestedValue)
      if (message) {
        return message
      }
    }
  }

  return ''
}

function getApiErrorMessage(error, fallbackMessage = 'Something went wrong. Please try again.') {
  const candidates = [
    error?.response?.data?.detail,
    error?.response?.data?.message,
    error?.response?.data?.error,
    error?.message,
  ]

  for (const candidate of candidates) {
    const message = extractFirstString(candidate)
    if (message) {
      return message
    }
  }

  return fallbackMessage
}

export { getApiErrorMessage }
