import { paymentStatusClass } from '../../utils/finalSettlementPreview.js'

function PaymentStatusBadge({ status }) {
  const normalizedStatus = String(status || '—').toUpperCase()

  return (
    <span
      role="status"
      className={`inline-flex items-center rounded-full px-3 py-1 text-[12px] font-bold ${paymentStatusClass(normalizedStatus)}`}
    >
      {normalizedStatus}
    </span>
  )
}

export default PaymentStatusBadge
