function filenameFromContentDisposition(headers, fallback) {
  const disposition = headers?.['content-disposition'] || ''
  const match = disposition.match(/filename\*?=(?:UTF-8''|")?([^;"]+)/i)
  return match?.[1] ? decodeURIComponent(match[1].trim()) : fallback
}

function downloadBlobResponse(response, fallbackFilename) {
  const url = URL.createObjectURL(response.data)
  const link = document.createElement('a')
  link.href = url
  link.download = filenameFromContentDisposition(response.headers, fallbackFilename)
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export { downloadBlobResponse, filenameFromContentDisposition }
