import { useCallback, useEffect, useMemo, useState } from 'react'
import { changePassword } from '../services/authService.js'
import { getEmployeeById, getManagers } from '../services/employeeService.js'
import { getApiErrorMessage } from '../utils/apiErrorMessage.js'
import { getPasswordRequirements, isPasswordValid } from '../utils/passwordValidation.js'

const initialPasswordForm = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
}

const initialFieldErrors = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  form: '',
}

function extractMessages(value) {
  if (typeof value === 'string') return [value]
  if (Array.isArray(value)) return value.flatMap(extractMessages)
  if (value && typeof value === 'object') return Object.values(value).flatMap(extractMessages)
  return []
}

function getFieldMessage(data, keys) {
  for (const key of keys) {
    const message = extractMessages(data?.[key]).join(' ')
    if (message) return message
  }

  return ''
}

function normalizeChangePasswordErrors(error) {
  const data = error?.response?.data
  const detail = extractMessages(data?.detail).join(' ')

  const fieldErrors = {
    ...initialFieldErrors,
    currentPassword: getFieldMessage(data, ['current_password', 'currentPassword']),
    newPassword: getFieldMessage(data, ['new_password', 'newPassword', 'password']),
    confirmPassword: getFieldMessage(data, ['confirm_password', 'confirmPassword']),
  }

  if (detail) {
    const normalizedDetail = detail.toLowerCase()

    if (normalizedDetail.includes('current')) {
      fieldErrors.currentPassword = detail
    } else if (normalizedDetail.includes('confirm') || normalizedDetail.includes('match')) {
      fieldErrors.confirmPassword = detail
    } else {
      fieldErrors.form = detail
    }
  }

  if (!fieldErrors.form && !fieldErrors.currentPassword && !fieldErrors.newPassword && !fieldErrors.confirmPassword) {
    fieldErrors.form = getApiErrorMessage(error, 'Unable to change password. Please try again.')
  }

  return fieldErrors
}

function useProfile(userId) {
  const [employee, setEmployee] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [passwordForm, setPasswordForm] = useState(initialPasswordForm)
  const [passwordErrors, setPasswordErrors] = useState(initialFieldErrors)
  const [passwordMessage, setPasswordMessage] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [isPasswordAccordionOpen, setIsPasswordAccordionOpen] = useState(false)

  const loadProfile = useCallback(async () => {
    if (!userId) {
      setLoading(false)
      setError('Unable to identify the logged-in user.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const [employeeData, managers] = await Promise.all([
        getEmployeeById(userId),
        getManagers(),
      ])

      const reportingManager = managers.find(
        (manager) => manager.id === employeeData.reporting_manager
      )

      setEmployee({
        ...employeeData,
        reportingManager: reportingManager?.label || 'N/A',
      })
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

  const passwordRequirements = useMemo(
    () => getPasswordRequirements(passwordForm.newPassword),
    [passwordForm.newPassword]
  )

  const canSubmitPasswordChange =
    Boolean(passwordForm.currentPassword) &&
    Boolean(passwordForm.newPassword) &&
    Boolean(passwordForm.confirmPassword) &&
    isPasswordValid(passwordForm.newPassword, passwordForm.confirmPassword)

  const updatePasswordField = (field, value) => {
    setPasswordForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }))
    setPasswordErrors((currentErrors) => ({
      ...currentErrors,
      [field]: '',
      form: '',
    }))
    setPasswordMessage('')
  }

  const submitPasswordChange = async (event) => {
    event.preventDefault()

    if (!canSubmitPasswordChange) return

    setIsChangingPassword(true)
    setPasswordErrors(initialFieldErrors)
    setPasswordMessage('')

    try {
      const response = await changePassword({
        current_password: passwordForm.currentPassword,
        new_password: passwordForm.newPassword,
        confirm_password: passwordForm.confirmPassword,
      })

      setPasswordForm(initialPasswordForm)
      setPasswordMessage(response?.detail || 'Password changed successfully.')
      setIsPasswordAccordionOpen(false)
    } catch (changeError) {
      setPasswordErrors(normalizeChangePasswordErrors(changeError))
    } finally {
      setIsChangingPassword(false)
    }
  }

  return {
    employee,
    loading,
    error,
    refreshProfile: loadProfile,
    passwordForm,
    passwordErrors,
    passwordMessage,
    passwordRequirements,
    canSubmitPasswordChange,
    isChangingPassword,
    isPasswordAccordionOpen,
    setIsPasswordAccordionOpen,
    updatePasswordField,
    submitPasswordChange,
  }
}

export default useProfile
