import FormField from '../auth/FormField.jsx'
import EmployeePhotoUpload from '../employees/onboarding/EmployeePhotoUpload.jsx'
import FieldError from '../ui/FieldError.jsx'
import SelectField from '../ui/SelectField.jsx'
import TextareaField from '../ui/TextareaField.jsx'
import {
  EMPLOYEE_GENDER_OPTIONS,
  EMPLOYEE_MARITAL_STATUS_OPTIONS,
} from '../../constants/employeeFormFields.js'

const inputClass =
  'h-[48px] w-full rounded-[9px] border-2 border-[#dedede] bg-white px-[16px] text-[#111827] outline-none transition-[border-color,box-shadow] duration-[250ms] focus:border-[#3a7be0] focus:shadow-[0_0_0_4px_rgba(58,123,224,0.16)] max-[380px]:h-14'

function EditProfilePersonalForm({
  formData,
  fieldError,
  onChange,
  onBlur,
  onPhotoChange,
}) {
  const fullName = [formData.firstName, formData.lastName].filter(Boolean).join(' ')

  return (
    <div className="space-y-6">
      <div className="rounded-[24px] border border-[#e5e5e5] bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-[18px] font-extrabold text-[#111827]">Profile Photo</h2>
        <EmployeePhotoUpload
          previewUrl={formData.photoPreviewUrl}
          name={fullName || 'User'}
          onChange={onPhotoChange}
        />
        <FieldError>{fieldError('photoFile')}</FieldError>
      </div>

      <div className="rounded-[24px] border border-[#e5e5e5] bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-[18px] font-extrabold text-[#111827]">Personal Information</h2>

        <div className="grid gap-5 md:grid-cols-2">
          <div>
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
            <FieldError>{fieldError('firstName')}</FieldError>
          </div>

          <div>
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
            <FieldError>{fieldError('lastName')}</FieldError>
          </div>

          <div>
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
            <FieldError>{fieldError('phone')}</FieldError>
          </div>

          <div>
            <FormField
              label="Date of Birth"
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={onChange}
              onBlur={onBlur}
              className={inputClass}
            />
            <FieldError>{fieldError('dateOfBirth')}</FieldError>
          </div>

          <div>
            <SelectField
              label="Gender"
              id="gender"
              value={formData.gender}
              onChange={onChange}
              onBlur={onBlur}
              placeholder="Select gender"
              options={EMPLOYEE_GENDER_OPTIONS}
              className={inputClass}
            />
            <FieldError>{fieldError('gender')}</FieldError>
          </div>

          <div>
            <SelectField
              label="Marital Status"
              id="maritalStatus"
              value={formData.maritalStatus}
              onChange={onChange}
              onBlur={onBlur}
              placeholder="Select marital status"
              options={EMPLOYEE_MARITAL_STATUS_OPTIONS}
              className={inputClass}
            />
            <FieldError>{fieldError('maritalStatus')}</FieldError>
          </div>

          <div className="md:col-span-2">
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
            <FieldError>{fieldError('address')}</FieldError>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditProfilePersonalForm
