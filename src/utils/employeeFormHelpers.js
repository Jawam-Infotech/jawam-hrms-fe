import { EMPLOYEE_DOCUMENT_TYPES, EMPLOYEE_ASSET_OPTIONS, EMPLOYEE_ROLE_OPTIONS } from '../constants/employeeFormFields.js'

function generateEmployeeId(employees = []) {
  const numericIds = employees
    .map((employee) => Number.parseInt(employee.id, 10))
    .filter((value) => Number.isFinite(value))

  const nextId = numericIds.length > 0 ? Math.max(...numericIds) + 1 : 101
  return String(nextId)
}

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
    manager: 'TL',
    'team lead': 'TL',
    tl: 'TL',
    hr: 'HR',
    admin: 'CEO',
    ceo: 'CEO',
  }

  return roleMap[lowerRole] || normalizedRole
}

function getAssignableEmployeeRoleOptions(creatorRole = '') {
  const normalizedRole = String(creatorRole || '').trim().toLowerCase()

  const allowedRoleValues =
    normalizedRole === 'admin'
      ? ['EMPLOYEE', 'TL', 'HR', 'CEO']
      : normalizedRole === 'hr'
        ? ['EMPLOYEE', 'TL']
        : ['EMPLOYEE']

  return EMPLOYEE_ROLE_OPTIONS.filter((option) => allowedRoleValues.includes(option.value))
}

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

function buildCreateUserPayload(formData, isEditMode = false)  {
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
    ['employment_status', formData.employmentStatus],['date_of_joining', formData.joiningDate],
    ['work_location', formData.workLocation],
    ['shift', formData.shift],
  ]

  optionalFields.forEach(([key, value]) => {
    if (String(value ?? '').trim()) {
      payload[key] = value
    }
  })

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
  formatPhoneDisplayValue,
  generateEmployeeId,
  getAssignableEmployeeRoleOptions,
  getDefaultEmployeeRole,
  normalizeEmployeeRoleValue,
}
