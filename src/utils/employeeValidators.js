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
    if (
    ['ON_NOTICE', 'EXIT_PENDING'].includes(formData.employmentStatus) &&
    !String(formData.lastWorkingDate ?? '').trim()
  ) {
    errors.lastWorkingDate = 'Last working date is required.'
  }

  if (
    formData.employmentStatus === 'EXITED' &&
    !String(formData.exitDate ?? '').trim()
  ) {
    errors.exitDate = 'Exit date is required.'
  }

  const hasMonthlySalary = String(formData.monthlySalary ?? '').trim()
  const hasAnnualCtc = String(formData.annualCtc ?? '').trim()
  const hasSalary = hasMonthlySalary || hasAnnualCtc

  const isValidPositiveDecimal = (value) => /^\d+(?:\.\d+)?$/.test(value) && BigInt(value.replace('.', '').replace(/^0+(?=\d)/, '')) > 0n

  const decimalParts = (value) => {
    const [whole, fraction = ''] = value.split('.')
    return {
      integer: BigInt(whole),
      fraction,
    }
  }

  const decimalsEqual = (left, right) => {
    const leftParts = decimalParts(left)
    const rightParts = decimalParts(right)
    const scale = Math.max(leftParts.fraction.length, rightParts.fraction.length)
    const scaleValue = 10n ** BigInt(scale)
    const leftValue = leftParts.integer * scaleValue + BigInt(leftParts.fraction.padEnd(scale, '0') || 0)
    const rightValue = rightParts.integer * scaleValue + BigInt(rightParts.fraction.padEnd(scale, '0') || 0)
    return leftValue === rightValue
  }

  if (!isEditMode && hasSalary) {
    if (hasMonthlySalary && !isValidPositiveDecimal(hasMonthlySalary)) {
      errors.monthlySalary = 'Enter a valid positive monthly salary.'
    }

    if (hasAnnualCtc && !isValidPositiveDecimal(hasAnnualCtc)) {
      errors.annualCtc = 'Enter a valid positive annual CTC.'
    }
  }

  if (hasSalary && !hasMonthlySalary) {
    errors.monthlySalary = 'Monthly salary is required when annual CTC is provided.'
  }

  if (hasSalary && !hasAnnualCtc) {
    errors.annualCtc = 'Annual CTC is required when monthly salary is provided.'
  }

  if (hasSalary && !String(formData.joiningDate ?? '').trim()) {
    errors.joiningDate = 'Joining date is required when salary information is provided.'
  }

  if (
    !isEditMode &&
    hasMonthlySalary &&
    hasAnnualCtc &&
    isValidPositiveDecimal(hasMonthlySalary) &&
    isValidPositiveDecimal(hasAnnualCtc)
  ) {
    const monthlyParts = decimalParts(hasMonthlySalary)
    const expectedAnnual = {
      integer: monthlyParts.integer * 12n,
      fraction: monthlyParts.fraction,
    }
    const expectedAnnualValue = `${expectedAnnual.integer}.${expectedAnnual.fraction}`

    if (!decimalsEqual(hasAnnualCtc, expectedAnnualValue)) {
      errors.annualCtc = 'Annual CTC must equal monthly salary multiplied by 12.'
    }
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
