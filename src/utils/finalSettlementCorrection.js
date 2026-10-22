function normalizeReferenceMonth(value) {
  const text = String(value ?? '').trim()
  if (!text) return ''
  const match = text.match(/^(\d{4})-(\d{2})(?:-\d{2})?$/)
  return match ? `${match[1]}-${match[2]}-01` : text
}

function normalizeAdjustmentDraft(adjustments = []) {
  return adjustments.map((adjustment) => ({
    reference_month: normalizeReferenceMonth(adjustment.reference_month),
    direction: adjustment.direction || '',
    amount: String(adjustment.amount ?? '').trim(),
    reason: String(adjustment.reason ?? '').trim(),
    ...(adjustment.supporting_reference !== undefined && adjustment.supporting_reference !== null
      ? { supporting_reference: String(adjustment.supporting_reference).trim() }
      : {}),
    ...(adjustment.idempotency_key !== undefined && adjustment.idempotency_key !== null
      ? { idempotency_key: String(adjustment.idempotency_key).trim() }
      : {}),
  }))
}

function normalizeComponentEntries(entries = []) {
  return entries.map(({ amount, reason, description }) => ({
    amount: String(amount ?? '').trim(),
    reason: description !== undefined
      ? String(description ?? '').trim()
      : String(reason ?? '').trim(),
  }))
}

function buildFinalSettlementCorrectionPayload({ draft, editedCategories = new Set(), existingDraft, pendingPreviousSalary }) {
  const current = draft || existingDraft || { earnings: [], deductions: [] }
  const existing = existingDraft || { earnings: [], deductions: [] }
  const payload = {
    pending_previous_salary: String(pendingPreviousSalary ?? '').trim(),
    other_earnings: normalizeComponentEntries(editedCategories.has('earnings') ? current.earnings : existing.earnings),
    other_deductions: normalizeComponentEntries(editedCategories.has('deductions') ? current.deductions : existing.deductions),
  }
  if (Array.isArray(current.adjustments)) {
    payload.adjustments = normalizeAdjustmentDraft(current.adjustments)
  }
  return payload
}

export { buildFinalSettlementCorrectionPayload, normalizeAdjustmentDraft, normalizeComponentEntries, normalizeReferenceMonth }
