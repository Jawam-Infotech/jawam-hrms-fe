export function getMediaUrl(path) {
  if (!path) return ''

  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('blob:')
  ) {
    return path
  }

  const baseUrl = import.meta.env.VITE_API_BASE_URL

  if (!baseUrl) {
    return path
  }

  try {
    const apiUrl = new URL(baseUrl)

    return `${apiUrl.origin}/${path.replace(/^\//, '')}`
  } catch {
    return path
  }
}