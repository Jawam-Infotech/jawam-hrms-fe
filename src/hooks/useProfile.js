import { useMemo, useState } from 'react'
import { changePassword } from '../services/authService.js'
import useEmployeeProfileData from './useEmployeeProfileData.js'
import { getApiErrorMessage } from '../utils/apiErrorMessage.js'
import {
  getPasswordRequirements,
  isPasswordValid,
} from '../utils/passwordValidation.js'

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
  if (typeof value === 'string') {
    return [value]
  }

  if (Array.isArray(value)) {
    return value.flatMap(extractMessages)
  }

  if (value && typeof value === 'object') {
    return Object.values(value).flatMap(extractMessages)
  }

  return []
}

function getFieldMessage(data, keys) {
  for (const key of keys) {
    const message = extractMessages(
      data?.[key],
    ).join(' ')

    if (message) {
      return message
    }
  }

  return ''
}

function normalizeChangePasswordErrors(error) {
  const data = error?.response?.data

  const detail = extractMessages(
    data?.detail,
  ).join(' ')

  const fieldErrors = {
    ...initialFieldErrors,

    currentPassword:
      getFieldMessage(
        data,
        [
          'current_password',
          'currentPassword',
        ],
      ),

    newPassword:
      getFieldMessage(
        data,
        [
          'new_password',
          'newPassword',
          'password',
        ],
      ),

    confirmPassword:
      getFieldMessage(
        data,
        [
          'confirm_password',
          'confirmPassword',
        ],
      ),
  }

  if (detail) {
    const normalizedDetail =
      detail.toLowerCase()

    if (
      normalizedDetail.includes(
        'current',
      )
    ) {
      fieldErrors.currentPassword =
        detail
    } else if (
      normalizedDetail.includes(
        'confirm',
      ) ||
      normalizedDetail.includes(
        'match',
      )
    ) {
      fieldErrors.confirmPassword =
        detail
    } else {
      fieldErrors.form = detail
    }
  }

  if (
    !fieldErrors.form &&
    !fieldErrors.currentPassword &&
    !fieldErrors.newPassword &&
    !fieldErrors.confirmPassword
  ) {
    fieldErrors.form =
      getApiErrorMessage(
        error,
        'Unable to change password. Please try again.',
      )
  }

  return fieldErrors
}

function useProfile(userId) {
  /*
   * =========================
   * EMPLOYEE PROFILE DATA
   * =========================
   *
   * Employee/profile fetching is
   * handled by the shared hook.
   */
  const {
    employee,
    loading,
    error,
    refreshProfile,
  } = useEmployeeProfileData(userId)

  /*
   * =========================
   * PASSWORD STATE
   * =========================
   */

  const [passwordForm, setPasswordForm] =
    useState(initialPasswordForm)

  const [passwordErrors, setPasswordErrors] =
    useState(initialFieldErrors)

  const [passwordMessage, setPasswordMessage] =
    useState('')

  const [isChangingPassword, setIsChangingPassword] =
    useState(false)

  const [
    isPasswordAccordionOpen,
    setIsPasswordAccordionOpen,
  ] = useState(false)

  /*
   * =========================
   * PASSWORD VALIDATION
   * =========================
   */

  const passwordRequirements = useMemo(
    () =>
      getPasswordRequirements(
        passwordForm.newPassword,
      ),
    [passwordForm.newPassword],
  )

  const canSubmitPasswordChange =
    Boolean(
      passwordForm.currentPassword,
    ) &&
    Boolean(
      passwordForm.newPassword,
    ) &&
    Boolean(
      passwordForm.confirmPassword,
    ) &&
    isPasswordValid(
      passwordForm.newPassword,
      passwordForm.confirmPassword,
    )

  /*
   * =========================
   * PASSWORD FIELD UPDATE
   * =========================
   */

  const updatePasswordField = (
    field,
    value,
  ) => {
    setPasswordForm(
      (currentForm) => ({
        ...currentForm,
        [field]: value,
      }),
    )

    setPasswordErrors(
      (currentErrors) => ({
        ...currentErrors,
        [field]: '',
        form: '',
      }),
    )

    setPasswordMessage('')
  }

  /*
   * =========================
   * CHANGE PASSWORD
   * =========================
   */

  const submitPasswordChange =
    async (event) => {
      event.preventDefault()

      if (!canSubmitPasswordChange) {
        return
      }

      setIsChangingPassword(true)
      setPasswordErrors(
        initialFieldErrors,
      )
      setPasswordMessage('')

      try {
        const response =
          await changePassword({
            current_password:
              passwordForm.currentPassword,

            new_password:
              passwordForm.newPassword,

            confirm_password:
              passwordForm.confirmPassword,
          })

        setPasswordForm(
          initialPasswordForm,
        )

        setPasswordMessage(
          response?.detail ||
            'Password changed successfully.',
        )

        setIsPasswordAccordionOpen(
          false,
        )
      } catch (changeError) {
        setPasswordErrors(
          normalizeChangePasswordErrors(
            changeError,
          ),
        )
      } finally {
        setIsChangingPassword(false)
      }
    }

  /*
   * =========================
   * PUBLIC API
   * =========================
   */

  return {
    employee,
    loading,
    error,

    refreshProfile,

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