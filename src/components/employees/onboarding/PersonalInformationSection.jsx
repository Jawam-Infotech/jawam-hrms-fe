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
          label="Full Name"
          id="fullName"
          type="text"
          value={formData.fullName}
          onChange={onChange}
          onBlur={onBlur}
          required
          placeholder="Enter full name"
          className={inputClass}
        />
        <FormField
          label="Employee ID"
          id="employeeId"
          type="text"
          value={formData.employeeId}
          onChange={onChange}
          onBlur={onBlur}
          required
          placeholder="Auto generated"
          className={inputClass}
        />
        <FormField
          label="Email"
          id="email"
          type="email"
          value={formData.email}
          onChange={onChange}
          onBlur={onBlur}
          required
          placeholder="Enter email"
          className={inputClass}
        />
        <FormField
          label="Phone Number"
          id="phoneNumber"
          type="tel"
          value={formData.phoneNumber}
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
          required
          className={inputClass}
        />
        <SelectField
          label="Gender"
          id="gender"
          value={formData.gender}
          onChange={onChange}
          required
          placeholder="Select gender"
          options={EMPLOYEE_GENDER_OPTIONS}
          className={inputClass}
        />
        <SelectField
          label="Marital Status"
          id="maritalStatus"
          value={formData.maritalStatus}
          onChange={onChange}
          required
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
          required
          rows={4}
          placeholder="Enter address"
          className="min-h-[120px] w-full rounded-[9px] border-2 border-[#dedede] bg-white px-[16px] py-3 text-[#111827] outline-none transition-[border-color,box-shadow] duration-[250ms] focus:border-[#3a7be0] focus:shadow-[0_0_0_4px_rgba(58,123,224,0.16)]"
        />
      </div>

      <div className="mt-2 grid gap-4 md:grid-cols-2">
        <FieldError>{fieldError('fullName')}</FieldError>
        <FieldError>{fieldError('employeeId')}</FieldError>
        <FieldError>{fieldError('email')}</FieldError>
        <FieldError>{fieldError('phoneNumber')}</FieldError>
        <FieldError>{fieldError('dateOfBirth')}</FieldError>
        <FieldError>{fieldError('gender')}</FieldError>
        <FieldError>{fieldError('maritalStatus')}</FieldError>
        <FieldError>{fieldError('address')}</FieldError>
      </div>
    </Card>
  )
}

export default PersonalInformationSection
