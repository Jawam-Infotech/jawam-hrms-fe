const POSITIVE_TYPES = new Set(['EARNING', 'OTHER_EARNING', 'CURRENT_MONTH_SALARY', 'SALARY', 'INCENTIVE', 'POSITIVE'])
const NEGATIVE_TYPES = new Set(['DEDUCTION', 'OTHER_DEDUCTION', 'LOP_DEDUCTION', 'NEGATIVE', 'PREVIOUS_MONTH_DEDUCTION'])

export function classifySettlementItem(item) {
  const direction = String(item?.direction || '').trim().toUpperCase()
  const itemType = String(item?.item_type || item?.type || '').trim().toUpperCase()
  if (direction === 'POSITIVE' || direction === 'EARNING' || direction === 'CREDIT') return true
  if (direction === 'NEGATIVE' || direction === 'DEDUCTION' || direction === 'DEBIT') return false
  if (POSITIVE_TYPES.has(itemType)) return true
  if (NEGATIVE_TYPES.has(itemType)) return false
  const amount = Number(item?.amount ?? item?.value)
  return Number.isFinite(amount) ? amount >= 0 : true
}
