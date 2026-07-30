import Card from '../../ui/Card.jsx'
import FormField from '../../auth/FormField.jsx'
import SelectField from '../../ui/SelectField.jsx'
import TextareaField from '../../ui/TextareaField.jsx'
import FieldError from '../../ui/FieldError.jsx'
import {
  EMPLOYEE_GENDER_OPTIONS,
  EMPLOYEE_MARITAL_STATUS_OPTIONS,
} from '../../../constants/employeeFormFields.js'

const inputClass =
  'h-[48px] w-full rounded-[9px] border-2 border-[#dedede] bg-white px-[16px] text-[#111827] outline-none transition-[border-color,box-shadow] duration-[250ms] focus:border-[#3a7be0] focus:shadow-[0_0_0_4px_rgba(58,123,224,0.16)] max-[380px]:h-14'

function PersonalInformationSection({ formData, fieldError, onChange, onBlur }) {
  return (
    <Card className="rounded-[24px] border border-[#e5e5e5] bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-[18px] font-extrabold text-[#111827]">Personal Information</h3>
      <div className="grid gap-5 md:grid-cols-2">
        <FormField
          label="First Name"
          id="firstName"
          type="text"
          value={formData.firstName}
          onChange={onChange}
          onBlur={onBlur}
          required
          placeholder="Enter first name"
          className={inputClass}
        />
        <FormField
          label="Last Name"
          id="lastName"
          type="text"
          value={formData.lastName}
          onChange={onChange}
          onBlur={onBlur}
          required
          placeholder="Enter last name"
          className={inputClass}
        />
        <FormField
          label="Official Email"
          id="email"
          type="email"
          value={formData.email}
          onChange={onChange}
          onBlur={onBlur}
          required
          placeholder="Enter official email"
          className={inputClass}
        />
        <FormField
          label="Phone Number"
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={onChange}
          onBlur={onBlur}
          required
          placeholder="Enter phone number"
          className={inputClass}
        />
        <FormField
          label="Date of Birth"
          id="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={onChange}
          onBlur={onBlur}
          className={inputClass}
        />
        <SelectField
          label="Gender"
          id="gender"
          value={formData.gender}
          onChange={onChange}
          placeholder="Select gender"
          options={EMPLOYEE_GENDER_OPTIONS}
          className={inputClass}
        />
        <SelectField
          label="Marital Status"
          id="maritalStatus"
          value={formData.maritalStatus}
          onChange={onChange}
          placeholder="Select marital status"
          options={EMPLOYEE_MARITAL_STATUS_OPTIONS}
          className={inputClass}
        />
        <TextareaField
          label="Address"
          id="address"
          value={formData.address}
          onChange={onChange}
          onBlur={onBlur}
          rows={4}
          placeholder="Enter address"
          className="min-h-[120px] w-full rounded-[9px] border-2 border-[#dedede] bg-white px-[16px] py-3 text-[#111827] outline-none transition-[border-color,box-shadow] duration-[250ms] focus:border-[#3a7be0] focus:shadow-[0_0_0_4px_rgba(58,123,224,0.16)]"
        />
      </div>

      <div className="mt-2 grid gap-4 md:grid-cols-2">
        <FieldError>{fieldError('firstName')}</FieldError>
        <FieldError>{fieldError('lastName')}</FieldError>
        <FieldError>{fieldError('email')}</FieldError>
        <FieldError>{fieldError('phone')}</FieldError>
      </div>
    </Card>
  )
}

export default PersonalInformationSection
