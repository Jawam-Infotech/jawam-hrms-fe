import Card from '../../ui/Card.jsx'
import FormField from '../../auth/FormField.jsx'
import SelectField from '../../ui/SelectField.jsx'
import CheckboxField from '../../ui/CheckboxField.jsx'
import FieldError from '../../ui/FieldError.jsx'
import { EMPLOYEE_ROLE_OPTIONS } from '../../../constants/employeeFormFields.js'

const inputClass =
  'h-[48px] w-full rounded-[9px] border-2 border-[#dedede] bg-white px-[16px] text-[#111827] outline-none transition-[border-color,box-shadow] duration-[250ms] focus:border-[#3a7be0] focus:shadow-[0_0_0_4px_rgba(58,123,224,0.16)] max-[380px]:h-14'

function SystemAccessSection({ formData, fieldError, onChange, onBlur, onCheckboxChange }) {
  return (
    <Card className="rounded-[24px] border border-[#e5e5e5] bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-[18px] font-extrabold text-[#111827]">System Access</h3>
      <div className="grid gap-5 md:grid-cols-2">
        <FormField
          label="Official Email"
          id="officialEmail"
          type="email"
          value={formData.officialEmail}
          onChange={onChange}
          onBlur={onBlur}
          required
          placeholder="Enter official email"
          className={inputClass}
        />
        <FormField
          label="Username"
          id="username"
          type="text"
          value={formData.username}
          onChange={onChange}
          onBlur={onBlur}
          required
          placeholder="Enter username"
          className={inputClass}
        />
        <SelectField
          label="Role"
          id="role"
          value={formData.role}
          onChange={onChange}
          required
          placeholder="Select role"
          options={EMPLOYEE_ROLE_OPTIONS}
          className={inputClass}
        />
        <FormField
          label="Temporary Password"
          id="temporaryPassword"
          type="text"
          value={formData.temporaryPassword}
          onChange={onChange}
          onBlur={onBlur}
          required
          placeholder="Enter temporary password"
          className={inputClass}
        />
      </div>

      <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-center">
        <CheckboxField
          id="forcePasswordReset"
          label="Force Password Reset"
          checked={formData.forcePasswordReset}
          onChange={onCheckboxChange}
        />
        <CheckboxField
          id="sendWelcomeEmail"
          label="Send Welcome Email"
          checked={formData.sendWelcomeEmail}
          onChange={onCheckboxChange}
        />
      </div>

      <div className="mt-2 grid gap-4 md:grid-cols-2">
        <FieldError>{fieldError('officialEmail')}</FieldError>
        <FieldError>{fieldError('username')}</FieldError>
        <FieldError>{fieldError('role')}</FieldError>
        <FieldError>{fieldError('temporaryPassword')}</FieldError>
      </div>
    </Card>
  )
}

export default SystemAccessSection
