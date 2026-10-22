function PayrollSettingsModal({ isOpen, saving, onClose, children }) {
  if (!isOpen) return null
  return <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4"><div className="w-full max-w-2xl overflow-visible rounded-[24px] bg-white p-6 shadow-xl sm:p-8"><div className="mb-6 flex items-center justify-between border-b border-[#e5e7eb] pb-5"><h2 className="text-[22px] font-black text-[#111827]">Payroll Settings</h2><button type="button" onClick={onClose} disabled={saving} aria-label="Close Payroll Settings" className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-[#6b7280] hover:bg-[#f3f4f6] disabled:opacity-50">×</button></div><div className="space-y-6">{children}</div></div></div>
}
export default PayrollSettingsModal
