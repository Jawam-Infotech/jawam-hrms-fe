import Card from '../../ui/Card.jsx'
import FormField from '../../auth/FormField.jsx'
import FieldError from '../../ui/FieldError.jsx'

const inputClass =
  'h-[48px] w-full rounded-[9px] border-2 border-[#dedede] bg-white px-[16px] text-[#111827] outline-none transition-[border-color,box-shadow] duration-[250ms] focus:border-[#3a7be0] focus:shadow-[0_0_0_4px_rgba(58,123,224,0.16)] max-[380px]:h-14'

function EmergencyContactSection({ formData, fieldError, onChange, onBlur }) {
  return (
    <Card className="rounded-[24px] border border-[#e5e5e5] bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-[18px] font-extrabold text-[#111827]">Emergency Contact</h3>
      <div className="grid gap-5 md:grid-cols-3">
        <FormField
          label="Name"
          id="emergencyName"
          type="text"
          value={formData.emergencyName}
          onChange={onChange}
          onBlur={onBlur}
          required
          placeholder="Enter name"
          className={inputClass}
        />
        <FormField
          label="Relation"
          id="emergencyRelation"
          type="text"
          value={formData.emergencyRelation}
          onChange={onChange}
          onBlur={onBlur}
          required
          placeholder="Enter relation"
          className={inputClass}
        />
        <FormField
          label="Mobile Number"
          id="emergencyMobileNumber"
          type="text"
          value={formData.emergencyMobileNumber}
          onChange={onChange}
          onBlur={onBlur}
          required
          placeholder="Enter mobile number"
          className={inputClass}
        />
      </div>

      <div className="mt-2 grid gap-4 md:grid-cols-3">
        <FieldError>{fieldError('emergencyName')}</FieldError>
        <FieldError>{fieldError('emergencyRelation')}</FieldError>
        <FieldError>{fieldError('emergencyMobileNumber')}</FieldError>
      </div>
    </Card>
  )
}

export default EmergencyContactSection
