import {
  ACCOUNT_NUMBER_REGEX,
  EMAIL_REGEX,
  IFSC_REGEX,
  PHONE_REGEX,
  SALARY_REGEX,
  TEMP_PASSWORD_MIN_LENGTH,
} from '../constants/employeeValidationRules.js'

function validateEmployeeForm(formData, existingEmployees = []) {
  const errors = {}

  const requiredPairs = [
    ['fullName', 'Full name is required.'],
    ['employeeId', 'Employee ID is required.'],
    ['email', 'Email is required.'],
    ['phoneNumber', 'Phone number is required.'],
    ['dateOfBirth', 'Date of birth is required.'],
    ['gender', 'Gender is required.'],
    ['maritalStatus', 'Marital status is required.'],
    ['address', 'Address is required.'],
    ['department', 'Department is required.'],
    ['designation', 'Designation is required.'],
    ['reportingManager', 'Reporting manager is required.'],
    ['employmentType', 'Employment type is required.'],
    ['employmentStatus', 'Employment status is required.'],
    ['joiningDate', 'Joining date is required.'],
    ['workLocation', 'Work location is required.'],
    ['shift', 'Shift is required.'],
    ['role', 'Role is required.'],
    ['officialEmail', 'Official email is required.'],
    ['username', 'Username is required.'],
    ['temporaryPassword', 'Temporary password is required.'],
    ['bankName', 'Bank name is required.'],
    ['accountNumber', 'Account number is required.'],
    ['ifscCode', 'IFSC code is required.'],
    ['branch', 'Branch is required.'],
    ['annualCtc', 'Annual CTC is required.'],
    ['monthlySalary', 'Monthly salary is required.'],
  ]

  requiredPairs.forEach(([field, message]) => {
    if (!String(formData[field] ?? '').trim()) {
      errors[field] = message
    }
  })

  if (formData.email && !EMAIL_REGEX.test(formData.email)) {
    errors.email = 'Enter a valid email address.'
  }

  if (formData.officialEmail && !EMAIL_REGEX.test(formData.officialEmail)) {
    errors.officialEmail = 'Enter a valid official email address.'
  }

  if (formData.phoneNumber && !PHONE_REGEX.test(formData.phoneNumber)) {
    errors.phoneNumber = 'Enter a valid 10-digit phone number.'
  }

  if (formData.accountNumber && !ACCOUNT_NUMBER_REGEX.test(formData.accountNumber)) {
    errors.accountNumber = 'Enter a valid account number.'
  }

  if (formData.ifscCode && !IFSC_REGEX.test(formData.ifscCode)) {
    errors.ifscCode = 'Enter a valid IFSC code.'
  }

  if (formData.annualCtc && !SALARY_REGEX.test(formData.annualCtc)) {
    errors.annualCtc = 'Enter a valid annual CTC.'
  }

  if (formData.monthlySalary && !SALARY_REGEX.test(formData.monthlySalary)) {
    errors.monthlySalary = 'Enter a valid monthly salary.'
  }

  if (
    formData.temporaryPassword &&
    String(formData.temporaryPassword).length < TEMP_PASSWORD_MIN_LENGTH
  ) {
    errors.temporaryPassword = `Temporary password must be at least ${TEMP_PASSWORD_MIN_LENGTH} characters.`
  }

  const normalizedEmail = String(formData.email || '').trim().toLowerCase()
  if (
    normalizedEmail &&
    existingEmployees.some((employee) => String(employee.email || '').trim().toLowerCase() === normalizedEmail)
  ) {
    errors.email = 'This email is already in use.'
  }

  const normalizedEmployeeId = String(formData.employeeId || '').trim()
  if (
    normalizedEmployeeId &&
    existingEmployees.some((employee) => String(employee.id || '').trim() === normalizedEmployeeId)
  ) {
    errors.employeeId = 'This Employee ID already exists.'
  }

  return errors
}

export { validateEmployeeForm }
