import { EMPLOYEE_DOCUMENT_TYPES, EMPLOYEE_ASSET_OPTIONS } from '../constants/employeeFormFields.js'

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

function createInitialEmployeeFormValues(employeeId = '') {
  return {
    fullName: '',
    employeeId,
    email: '',
    phoneNumber: '',
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
    role: 'employee',
    officialEmail: '',
    username: '',
    temporaryPassword: '',
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
    ['phoneNumber', 'accountNumber', 'annualCtc', 'monthlySalary'].includes(fieldName)
  ) {
    return rawValue.replace(/\D/g, '')
  }

  if (fieldName === 'ifscCode') {
    return rawValue.toUpperCase().replace(/\s+/g, '')
  }

  if (fieldName === 'employeeId') {
    return rawValue.replace(/\D/g, '')
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

function buildEmployeePayload(formData) {
  return {
    id: formData.employeeId,
    name: formData.fullName,
    email: formData.email,
    designation: formData.designation,
    phoneNumber: formData.phoneNumber,
    dateOfBirth: formData.dateOfBirth,
    gender: formData.gender,
    bloodGroup: formData.bloodGroup,
    maritalStatus: formData.maritalStatus,
    address: formData.address,
    department: formData.department,
    reportingManager: formData.reportingManager,
    employmentType: formData.employmentType,
    employmentStatus: formData.employmentStatus,
    joiningDate: formData.joiningDate,
    workLocation: formData.workLocation,
    shift: formData.shift,
    role: formData.role,
    officialEmail: formData.officialEmail,
    username: formData.username,
    temporaryPassword: formData.temporaryPassword,
    forcePasswordReset: formData.forcePasswordReset,
    sendWelcomeEmail: formData.sendWelcomeEmail,
    bankName: formData.bankName,
    accountNumber: formData.accountNumber,
    ifscCode: formData.ifscCode,
    branch: formData.branch,
    annualCtc: formData.annualCtc,
    monthlySalary: formData.monthlySalary,
    assets: formData.assets,
    documents: formData.documents,
    photoPreviewUrl: formData.photoPreviewUrl,
    photoName: formData.photoName,
  }
}

export {
  buildEmployeePayload,
  createInitialAssetState,
  createInitialDocumentState,
  createInitialEmployeeFormValues,
  formatCurrencyDisplayValue,
  formatEmployeeFieldValue,
  formatPhoneDisplayValue,
  generateEmployeeId,
}
