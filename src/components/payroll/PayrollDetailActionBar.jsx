import Button from '../ui/Button.jsx'
import DatePicker from '../ui/DatePicker.jsx'

function PayrollDetailActionBar({
  canApprove,
  canReject,
  canRequestCancellation,
  canRequestCorrection,
  canPay,
  canReviewCancellation,
  canCreateReplacement,
  canApplyCorrection,
  payrollStatus,
  correctionReady,
  payrollApprovalLoading,
  payrollRejectionLoading,
  payrollCorrectionLoading,
  cancellationLoading,
  paymentDate,
  onPaymentDateChange,
  onOpenApproval,
  onOpenRejection,
  onOpenCancellation,
  onApproveCancellation,
  onOpenCancellationRejection,
  onCreateReplacement,
  onOpenCorrection,
  onConfirmChanges,
  onPay,
}) {
  const hasActions = canApprove || canReject || canRequestCancellation || canRequestCorrection || canPay || canReviewCancellation || canCreateReplacement || (canApplyCorrection && ['GENERATED', 'HR_REJECTED', 'CORRECTION_REQUIRED'].includes(payrollStatus))
  if (!hasActions) return null

  return (
    <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
      {canPay && <div className="flex min-w-[230px] flex-col gap-1"><span className="text-[12px] font-bold uppercase tracking-wider text-[#6b7280]">Actual Payment Date</span><DatePicker value={paymentDate} onChange={onPaymentDateChange} disabled={payrollCorrectionLoading} ariaLabel="Actual payment date" placeholder="Select payment date" className="min-h-12 w-full px-4 text-[15px]" /></div>}
      <div className="flex flex-wrap items-end gap-3">
        {canApplyCorrection && !['GENERATED', 'HR_REJECTED', 'CORRECTION_REQUIRED'].includes(payrollStatus) && !correctionReady && <Button type="button" onClick={onConfirmChanges} disabled={payrollCorrectionLoading} className="rounded-full bg-[#2563eb] px-5 py-2.5 text-[14px] font-bold text-white">{payrollCorrectionLoading ? 'Saving...' : 'Confirm Changes'}</Button>}
        {canApprove && <Button type="button" onClick={onOpenApproval} disabled={payrollApprovalLoading} className="rounded-full bg-[#2563eb] px-5 py-2.5 text-[14px] font-bold text-white hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-50">Approve Payroll</Button>}
        {canReject && <Button type="button" onClick={onOpenRejection} disabled={payrollRejectionLoading} className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-bold text-white">Reject Payroll</Button>}
        {canRequestCancellation && <Button type="button" onClick={onOpenCancellation} disabled={cancellationLoading} className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-bold text-white">Cancel Payroll</Button>}
        {canReviewCancellation && <><Button type="button" onClick={onApproveCancellation} disabled={cancellationLoading} className="rounded-full bg-green-600 px-5 py-2.5 text-sm font-bold text-white">{cancellationLoading ? 'Approving...' : 'Approve Cancellation'}</Button><Button type="button" onClick={onOpenCancellationRejection} disabled={cancellationLoading} className="rounded-full bg-red-600 px-5 py-2.5 text-sm font-bold text-white">Reject Cancellation</Button></>}
        {canCreateReplacement && <Button type="button" onClick={onCreateReplacement} disabled={cancellationLoading} className="rounded-full bg-[#2563eb] px-5 py-2.5 text-[14px] font-bold text-white disabled:opacity-50">{cancellationLoading ? 'Creating...' : 'Create Replacement Payroll'}</Button>}
        {canRequestCorrection && <Button type="button" onClick={onOpenCorrection} className="rounded-full bg-amber-600 px-5 py-2.5 text-sm font-bold text-white">Request Correction</Button>}
        {canPay && <Button type="button" onClick={onPay} disabled={!paymentDate || payrollCorrectionLoading} className="rounded-full bg-[#16a34a] px-5 py-2.5 text-sm font-bold text-white">{payrollCorrectionLoading ? 'Paying...' : 'Mark as Paid'}</Button>}
      </div>
    </div>
  )
}

export default PayrollDetailActionBar
