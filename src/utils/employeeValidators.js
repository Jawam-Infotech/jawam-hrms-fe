import {
  EMAIL_REGEX,
  PHONE_REGEX,
  TEMP_PASSWORD_MIN_LENGTH,
} from '../constants/employeeValidationRules.js'

function validateEmployeeForm(formData, allowedRoleValues = [], isEditMode = false) {
  const errors = {}

  const requiredPairs = [
    ['email', 'Email is required.'],
    ['firstName', 'First name is required.'],
    ['lastName', 'Last name is required.'],
    ['phone', 'Phone number is required.'],
    ['role', 'Role is required.'],
  ]
  if (!isEditMode) {
    requiredPairs.push(['password', 'Password is required.'])
  }

  requiredPairs.forEach(([field, message]) => {
    if (!String(formData[field] ?? '').trim()) {
      errors[field] = message
    }
  })

  if (formData.email && !EMAIL_REGEX.test(formData.email)) {
    errors.email = 'Enter a valid email address.'
  }

  if (formData.phone && !PHONE_REGEX.test(formData.phone)) {
    errors.phone = 'Enter a valid 10-digit phone number.'
  }

  if (
  !isEditMode &&
  formData.password &&
  String(formData.password).length < TEMP_PASSWORD_MIN_LENGTH
) {
  errors.password = `Password must be at least ${TEMP_PASSWORD_MIN_LENGTH} characters.`
}


  if (allowedRoleValues.length > 0 && formData.role && !allowedRoleValues.includes(formData.role)) {
    errors.role = 'Select a valid role.'
  }

  return errors
}

function validateEmployeePersonalInformation(formData) {
  const errors = {}

  if (!String(formData.firstName ?? '').trim()) {
    errors.firstName = 'First name is required.'
  }

  if (!String(formData.lastName ?? '').trim()) {
    errors.lastName = 'Last name is required.'
  }

  if (!String(formData.phone ?? '').trim()) {
    errors.phone = 'Phone number is required.'
  }

  if (formData.phone && !PHONE_REGEX.test(formData.phone)) {
    errors.phone = 'Enter a valid 10-digit phone number.'
  }

  return errors
}

export { validateEmployeeForm, validateEmployeePersonalInformation }
