function getLatestCorrectionRequest(settlement) {
  if (Array.isArray(settlement?.correction_issues) && settlement.correction_issues.length > 0) {
    return { issues: settlement.correction_issues, remarks: settlement.correction_remarks || settlement.remarks }
  }
  const requests = Array.isArray(settlement?.ceo_correction_requests) ? settlement.ceo_correction_requests : []
  return requests
    .filter((request) => Array.isArray(request?.issues) && request.issues.length > 0)
    .reduce((latest, request) => {
      if (!latest) return request
      return new Date(request.created_at || 0).getTime() > new Date(latest.created_at || 0).getTime() ? request : latest
    }, null)
}

export { getLatestCorrectionRequest }
