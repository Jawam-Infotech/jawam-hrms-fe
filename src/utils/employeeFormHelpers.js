import { EMPLOYEE_DOCUMENT_TYPES, EMPLOYEE_ASSET_OPTIONS, EMPLOYEE_ROLE_OPTIONS } from '../constants/employeeFormFields.js'


function createInitialDocumentState() {
  return EMPLOYEE_DOCUMENT_TYPES.reduce((accumulator, documentType) => {
    accumulator[documentType.key] = {
      file: null,
      fileName: '',
      previewUrl: '',
      status: 'Pending',
    }
    return accumulator
  }, {})
}

function createInitialAssetState() {
  return EMPLOYEE_ASSET_OPTIONS.reduce((accumulator, asset) => {
    accumulator[asset.key] = false
    return accumulator
  }, {})
}

function normalizeEmployeeRoleValue(role = '') {
  const normalizedRole = String(role || '').trim()
  const lowerRole = normalizedRole.toLowerCase()
  const roleMap = {
    employee: 'EMPLOYEE',
    'team lead': 'TL',
    hr: 'HR',
    ceo: 'CEO',
  }

  return roleMap[lowerRole] || normalizedRole
}

function formatEmployeeRoleLabel(role = '') {
  const normalizedRole = normalizeEmployeeRoleValue(role)
  return (
    EMPLOYEE_ROLE_OPTIONS.find((option) => option.value === normalizedRole)?.label ||
    normalizedRole ||
    '-'
  )
}
function getAssignableEmployeeRoleOptions(
  creatorRole = '',
  isEditMode = false,
  originalRole = ''
) {
  const normalizedCreatorRole =
    normalizeEmployeeRoleValue(creatorRole)

  const normalizedOriginalRole =
    normalizeEmployeeRoleValue(originalRole)

  // CEO can assign/change any supported role.
  if (normalizedCreatorRole === 'CEO') {
    return EMPLOYEE_ROLE_OPTIONS.filter((option) =>
      ['EMPLOYEE', 'TL', 'HR', 'CEO'].includes(option.value)
    )
  }

  // HR can create EMPLOYEE/TEAM_LEAD.
  // During edit, HR can only change EMPLOYEE -> TEAM_LEAD.
  if (normalizedCreatorRole === 'HR') {
    if (isEditMode) {
      if (normalizedOriginalRole === 'EMPLOYEE') {
        return EMPLOYEE_ROLE_OPTIONS.filter((option) =>
          ['EMPLOYEE', 'TL'].includes(option.value)
        )
      }

      // Existing TEAM_LEAD/HR/CEO cannot be changed by HR.
      return EMPLOYEE_ROLE_OPTIONS.filter(
        (option) => option.value === normalizedOriginalRole
      )
    }

    return EMPLOYEE_ROLE_OPTIONS.filter((option) =>
      ['EMPLOYEE', 'TL'].includes(option.value)
    )
  }

  // Other roles can only assign EMPLOYEE.
  return EMPLOYEE_ROLE_OPTIONS.filter(
    (option) => option.value === 'EMPLOYEE'
  )
}
getAssignableEmployeeRoleOptions

function getDefaultEmployeeRole(creatorRole = '') {
  return getAssignableEmployeeRoleOptions(creatorRole)[0]?.value || 'EMPLOYEE'
}

function createInitialEmployeeFormValues(creatorRole = '') {
  return {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    maritalStatus: '',
    address: '',
    photoFile: null,
    photoPreviewUrl: '',
    photoName: '',
    department: '',
    designation: '',
    reportingManager: '',
    employmentType: '',
    employmentStatus: '',
    joiningDate: '',
    exitDate: '',
    workLocation: '',
    shift: '',
    role: getDefaultEmployeeRole(creatorRole),
    password: '',
    forcePasswordReset: true,
    sendWelcomeEmail: true,
    bankName: '',
    accountNumber: '',
    ifscCode: '',
    branch: '',
    annualCtc: '',
    monthlySalary: '',
    documents: createInitialDocumentState(),
    assets: createInitialAssetState(),
  }
}

function formatEmployeeFieldValue(fieldName, value) {
  const rawValue = String(value ?? '')

  if (
    ['phone', 'accountNumber', 'annualCtc', 'monthlySalary'].includes(fieldName)
  ) {
    return rawValue.replace(/\D/g, '')
  }

  if (fieldName === 'ifscCode') {
    return rawValue.toUpperCase().replace(/\s+/g, '')
  }

  return rawValue
}

function formatPhoneDisplayValue(value) {
  return String(value ?? '')
    .replace(/\D/g, '')
    .slice(0, 10)
}

function formatCurrencyDisplayValue(value) {
  return String(value ?? '').replace(/\D/g, '')
}

function buildCreateUserPayload(formData, isEditMode = false) {
  const payload = {
    email: formData.email,
    first_name: formData.firstName,
    last_name: formData.lastName,
    phone: formData.phone,
    role: normalizeEmployeeRoleValue(formData.role),
  }

  if (!isEditMode || formData.password?.trim()) {
    payload.password = formData.password
  }

  const optionalFields = [
    ['date_of_birth', formData.dateOfBirth],
    ['gender', formData.gender],
    ['marital_status', formData.maritalStatus],
    ['address', formData.address],
    ['department', formData.department],
    ['designation', formData.designation],
    ['reporting_manager', formData.reportingManager],
    ['employment_type', formData.employmentType],
    ['employment_status', formData.employmentStatus],
    ['date_of_joining', formData.joiningDate],
    ['exit_date', formData.exitDate],
    ['work_location', formData.workLocation],
    ['shift', formData.shift],
  ]

  optionalFields.forEach(([key, value]) => {
    if (String(value ?? '').trim()) {
      payload[key] = value
    }
  })

  // Employee photo upload
  if (formData.photoFile) {
    const multipartPayload = new FormData()

    Object.entries(payload).forEach(([key, value]) => {
      multipartPayload.append(key, value)
    })

    multipartPayload.append('photo', formData.photoFile)

    return multipartPayload
  }

  return payload
}

function buildEmployeePayload(formData) {
  return buildCreateUserPayload(formData)
}

export {
  buildEmployeePayload,
  buildCreateUserPayload,
  createInitialAssetState,
  createInitialDocumentState,
  createInitialEmployeeFormValues,
  formatCurrencyDisplayValue,
  formatEmployeeFieldValue,
  formatEmployeeRoleLabel,
  formatPhoneDisplayValue,
  getAssignableEmployeeRoleOptions,
  getDefaultEmployeeRole,
  normalizeEmployeeRoleValue,
}
