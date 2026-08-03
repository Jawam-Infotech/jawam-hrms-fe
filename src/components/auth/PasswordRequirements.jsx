function PasswordRequirementItem({ active, label }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`flex size-4 items-center justify-center rounded-full ${active ? 'bg-green-500' : 'bg-[#e5e5e5]'}`}>
        {active && <span className="text-xs text-white">✓</span>}
      </span>
      <span className={active ? 'text-green-600' : 'text-[#5f6679]'}>{label}</span>
    </div>
  )
}

function PasswordRequirements({ passwordRequirements, password, confirmPassword }) {
  return (
    <div className="space-y-2 text-[14px] font-semibold text-[#5f6679]">
      <p className="mb-2 font-extrabold">Password must contain:</p>
      <PasswordRequirementItem active={passwordRequirements.length} label="At least 8 characters" />
      <PasswordRequirementItem active={passwordRequirements.uppercase} label="One uppercase letter" />
      <PasswordRequirementItem active={passwordRequirements.number} label="One number" />
      <PasswordRequirementItem active={passwordRequirements.special} label="One special character" />

      {confirmPassword && password !== confirmPassword && (
        <p className="mt-2 text-sm font-medium text-red-500">Passwords do not match.</p>
      )}
    </div>
  )
}

export default PasswordRequirements
