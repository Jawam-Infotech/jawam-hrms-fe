import { getProfileByUserId, updateProfileByUserId } from './api/profile.api.js'
import { getEmployeeDisplayId } from '../utils/employeeHelpers.js'

function normalizeDateInputValue(value) {
  return String(value || '').slice(0, 10)
}

function normalizeProfile(profile = {}) {
  const firstName = String(profile.first_name || profile.firstName || '').trim()
  const lastName = String(profile.last_name || profile.lastName || '').trim()
  const name =
    [firstName, lastName].filter(Boolean).join(' ') ||
    String(profile.name || '').trim() ||
    '-'

  return {
    ...profile,
    id: String(profile.user_id ?? profile.id ?? '').trim(),
    employeeId: getEmployeeDisplayId(profile),
    firstName,
    lastName,
    name,
    phone: profile.phone || profile.contact_number || profile.contactNumber || '',
    countryCode: profile.country_code || profile.countryCode || '',
    dateOfBirth: normalizeDateInputValue(profile.date_of_birth || profile.dateOfBirth),
    gender: profile.gender || '',
    maritalStatus: profile.marital_status || profile.maritalStatus || '',
    address: profile.address || '',
    dateOfJoining: normalizeDateInputValue(profile.date_of_joining || profile.dateOfJoining),
    exitDate: normalizeDateInputValue(profile.exit_date || profile.exitDate),
    bankAccountHolderName: profile.bank_account_holder_name || profile.bankAccountHolderName || '',
    bankName: profile.bank_name || profile.bankName || '',
    accountNumber: profile.bank_account_number || profile.accountNumber || '',
    ifscCode: profile.bank_ifsc_code || profile.ifscCode || '',
    photoPreviewUrl: profile.profile_photo || profile.photo || profile.avatar || '',
    employmentStatus: profile.employment_status || profile.employmentStatus || '',
  }
}

function buildEditProfilePayload(formData) {
  const textPayload = {
    first_name: formData.firstName,
    last_name: formData.lastName,
    phone: formData.phone,
    country_code: formData.countryCode,
    date_of_birth: formData.dateOfBirth || '',
    gender: formData.gender || '',
    marital_status: formData.maritalStatus || '',
    address: formData.address || '',
    bank_account_holder_name:
    formData.bankAccountHolderName || '',
    bank_name: formData.bankName || '',
    bank_account_number: formData.accountNumber || '',
    bank_ifsc_code: formData.ifscCode || '',
  }

  if (!formData.photoFile) {
    return textPayload
  }

  const multipartPayload = new FormData()
  Object.entries(textPayload).forEach(([key, value]) => {
    multipartPayload.append(key, value)
  })
  multipartPayload.append('profile_photo', formData.photoFile)

  return multipartPayload
}

async function getMyProfile(userId) {
  const profile = await getProfileByUserId(userId)
  return normalizeProfile(profile)
}

async function updateMyProfile(userId, formData) {
  const payload = buildEditProfilePayload(formData)
  const profile = await updateProfileByUserId(userId, payload)
  return normalizeProfile(profile)
}

export { getMyProfile, updateMyProfile }
