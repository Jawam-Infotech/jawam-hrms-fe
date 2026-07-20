import Card from '../../ui/Card.jsx'
import FormField from '../../auth/FormField.jsx'
import FieldError from '../../ui/FieldError.jsx'

const inputClass =
  'h-[48px] w-full rounded-[9px] border-2 border-[#dedede] bg-white px-[16px] text-[#111827] outline-none transition-[border-color,box-shadow] duration-[250ms] focus:border-[#3a7be0] focus:shadow-[0_0_0_4px_rgba(58,123,224,0.16)] max-[380px]:h-14'

function PayrollInformationSection({ formData, fieldError, onChange, onBlur }) {
  return (
    <Card className="rounded-[24px] border border-[#e5e5e5] bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-[18px] font-extrabold text-[#111827]">Payroll Information</h3>
      <div className="grid gap-5 md:grid-cols-2">
        <FormField label="Bank Name" id="bankName" type="text" value={formData.bankName} onChange={onChange} onBlur={onBlur} required placeholder="Enter bank name" className={inputClass} />
        <FormField label="Account Number" id="accountNumber" type="text" value={formData.accountNumber} onChange={onChange} onBlur={onBlur} required placeholder="Enter account number" className={inputClass} />
        <FormField label="IFSC Code" id="ifscCode" type="text" value={formData.ifscCode} onChange={onChange} onBlur={onBlur} required placeholder="Enter IFSC code" className={inputClass} />
        <FormField label="Branch" id="branch" type="text" value={formData.branch} onChange={onChange} onBlur={onBlur} required placeholder="Enter branch" className={inputClass} />
        <FormField label="Annual CTC" id="annualCtc" type="text" value={formData.annualCtc} onChange={onChange} onBlur={onBlur} required placeholder="Enter annual CTC" className={inputClass} />
        <FormField label="Monthly Salary" id="monthlySalary" type="text" value={formData.monthlySalary} onChange={onChange} onBlur={onBlur} required placeholder="Enter monthly salary" className={inputClass} />
      </div>

      <div className="mt-2 grid gap-4 md:grid-cols-2">
        <FieldError>{fieldError('bankName')}</FieldError>
        <FieldError>{fieldError('accountNumber')}</FieldError>
        <FieldError>{fieldError('ifscCode')}</FieldError>
        <FieldError>{fieldError('branch')}</FieldError>
        <FieldError>{fieldError('annualCtc')}</FieldError>
        <FieldError>{fieldError('monthlySalary')}</FieldError>
      </div>
    </Card>
  )
}

export default PayrollInformationSection
