const SPECIAL_CHARACTER_REGEX = /[!@#$%^&*()_+=\u005B\u005D{};':"\\|,.<>/?-]/

function getPasswordRequirements(password = '') {
  return {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: SPECIAL_CHARACTER_REGEX.test(password),
  }
}

function isPasswordValid(password = '', confirmPassword = '') {
  const requirements = getPasswordRequirements(password)

  return Object.values(requirements).every(Boolean) && password === confirmPassword
}

export { getPasswordRequirements, isPasswordValid }
