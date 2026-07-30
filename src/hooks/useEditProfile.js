import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMyProfile, updateMyProfile } from '../services/profileService.js'
import { formatEmployeeFieldValue } from '../utils/employeeFormHelpers.js'
import { validateEmployeePersonalInformation } from '../utils/employeeValidators.js'
import { getApiErrorMessage } from '../utils/apiErrorMessage.js'

const editableFields = [
  'firstName',
  'lastName',
  'phone',
  'dateOfBirth',
  'gender',
  'maritalStatus',
  'address',
  'photoFile',
]

const initialFormData = {
  firstName: '',
  lastName: '',
  phone: '',
  dateOfBirth: '',
  gender: '',
  maritalStatus: '',
  address: '',
  photoFile: null,
  photoPreviewUrl: '',
  photoName: '',
}

const BACKEND_FIELD_MAP = {
  first_name: 'firstName',
  last_name: 'lastName',
  phone: 'phone',
  date_of_birth: 'dateOfBirth',
  gender: 'gender',
  marital_status: 'maritalStatus',
  address: 'address',
  profile_photo: 'photoFile',
  photo: 'photoFile',
}

function buildFormData(profile) {
  return {
    ...initialFormData,
    firstName: profile.firstName || '',
    lastName: profile.lastName || '',
    phone: profile.phone || '',
    dateOfBirth: profile.dateOfBirth || '',
    gender: profile.gender || '',
    maritalStatus: profile.maritalStatus || '',
    address: profile.address || '',
    photoPreviewUrl: profile.photoPreviewUrl || '',
  }
}

function normalizeComparableValue(value) {
  if (value instanceof File) return value.name
  return String(value ?? '').trim()
}

function getBackendFieldErrors(error) {
  const data = error?.response?.data
  const fieldErrors = {}
  let message = ''

  if (!data || typeof data !== 'object') {
    return {
      fieldErrors,
      message: getApiErrorMessage(error, 'Unable to update profile. Please try again.'),
    }
  }

  Object.entries(data).forEach(([key, value]) => {
    const text = Array.isArray(value) ? value.join(' ') : String(value || '')

    if (['detail', 'message', 'non_field_errors'].includes(key)) {
      message = message || text
      return
    }

    const mappedField = BACKEND_FIELD_MAP[key] || key
    if (editableFields.includes(mappedField)) {
      fieldErrors[mappedField] = text
    }
  })

  return {
    fieldErrors,
    message: message || (Object.keys(fieldErrors).length ? '' : 'Unable to update profile. Please try again.'),
  }
}

function useEditProfile(userId) {
  const navigate = useNavigate()
  const [formData, setFormData] = useState(initialFormData)
  const [initialData, setInitialData] = useState(initialFormData)
  const [touchedFields, setTouchedFields] = useState({})
  const [apiFieldErrors, setApiFieldErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [submissionError, setSubmissionError] = useState('')

  const loadProfile = useCallback(async () => {
    if (!userId) {
      setError('Unable to identify the logged-in user.')
      setLoading(false)
      return
    }

    setLoading(true)
    setError('')

    try {
      const profile = await getMyProfile(userId)
      const nextFormData = buildFormData(profile)
      setFormData(nextFormData)
      setInitialData(nextFormData)
    } catch (loadError) {
      setError(getApiErrorMessage(loadError, 'Failed to load profile.'))
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProfile()
  }, [loadProfile])

  const validationErrors = useMemo(
    () => validateEmployeePersonalInformation(formData),
    [formData]
  )

  const hasChanges = useMemo(
    () =>
      editableFields.some(
        (field) =>
          normalizeComparableValue(formData[field]) !== normalizeComparableValue(initialData[field])
      ),
    [formData, initialData]
  )

  const isFormValid = Object.keys(validationErrors).length === 0 && Object.keys(apiFieldErrors).length === 0
  const canSave = hasChanges && isFormValid && !isSaving

  const setFieldValue = (fieldName, value) => {
    setFormData((currentData) => ({
      ...currentData,
      [fieldName]: formatEmployeeFieldValue(fieldName, value),
    }))
    setApiFieldErrors((currentErrors) => {
      if (!currentErrors[fieldName]) return currentErrors
      const nextErrors = { ...currentErrors }
      delete nextErrors[fieldName]
      return nextErrors
    })
    setSubmissionError('')
  }

  const handleFieldChange = (event) => {
    const { name, value } = event.target
    setFieldValue(name, value)
  }

  const handleFieldBlur = (event) => {
    const { name } = event.target
    setTouchedFields((currentFields) => ({
      ...currentFields,
      [name]: true,
    }))
  }

  const handlePhotoChange = (file) => {
    if (!file) return

    setFormData((currentData) => ({
      ...currentData,
      photoFile: file,
      photoName: file.name,
      photoPreviewUrl: URL.createObjectURL(file),
    }))
    setApiFieldErrors((currentErrors) => {
      const nextErrors = { ...currentErrors }
      delete nextErrors.photoFile
      return nextErrors
    })
    setSubmissionError('')
  }

  const fieldError = (fieldName) => {
    if (apiFieldErrors[fieldName]) return apiFieldErrors[fieldName]
    return touchedFields[fieldName] ? validationErrors[fieldName] : ''
  }

  const cancelEdit = () => {
    navigate('/profile')
  }

  const submitProfile = async (event) => {
    event.preventDefault()

    const nextTouchedFields = editableFields.reduce((accumulator, field) => {
      accumulator[field] = true
      return accumulator
    }, {})
    setTouchedFields(nextTouchedFields)
    setApiFieldErrors({})
    setSubmissionError('')

    const nextValidationErrors = validateEmployeePersonalInformation(formData)
    if (Object.keys(nextValidationErrors).length > 0 || !hasChanges) return

    setIsSaving(true)

    try {
      await updateMyProfile(userId, formData)
      await loadProfile()
      navigate('/profile', {
        state: {
          successMessage: 'Profile updated successfully.',
        },
      })
    } catch (saveError) {
      const { fieldErrors, message } = getBackendFieldErrors(saveError)
      setApiFieldErrors(fieldErrors)
      setSubmissionError(message)
    } finally {
      setIsSaving(false)
    }
  }

  return {
    formData,
    loading,
    error,
    submissionError,
    isSaving,
    hasChanges,
    canSave,
    fieldError,
    refreshProfile: loadProfile,
    handleFieldChange,
    handleFieldBlur,
    handlePhotoChange,
    cancelEdit,
    submitProfile,
  }
}

export default useEditProfile
