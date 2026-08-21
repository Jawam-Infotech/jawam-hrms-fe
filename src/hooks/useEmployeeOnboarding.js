import { useEffect, useMemo, useState } from 'react'
import {
  createEmployee,
  getManagers,
  updateEmployee,
  getEmployeeById,
  updateEmployeeRole,
} from '../services/employeeService.js'
import {
  buildCreateUserPayload,
  createInitialEmployeeFormValues,
  formatEmployeeFieldValue,
  getAssignableEmployeeRoleOptions,
  normalizeEmployeeRoleValue,
} from '../utils/employeeFormHelpers.js'
import { validateEmployeeForm } from '../utils/employeeValidators.js'


const DRAFT_STORAGE_KEY =
  'jawamhr-employee-onboarding-draft'


const BACKEND_FIELD_MAP = {
  email: 'email',
  first_name: 'firstName',
  last_name: 'lastName',
  phone: 'phone',
  password: 'password',
  role: 'role',
  date_of_birth: 'dateOfBirth',
  gender: 'gender',
  marital_status: 'maritalStatus',
  address: 'address',
  department: 'department',
  reporting_manager: 'reportingManager',
  employment_type: 'employmentType',
  employment_status: 'employmentStatus',
  joining_date: 'joiningDate',
  work_location: 'workLocation',
  shift: 'shift',
}


/*
 * =========================
 * DRAFT
 * =========================
 */

function loadDraft() {
  const rawDraft =
    window.localStorage.getItem(
      DRAFT_STORAGE_KEY,
    )

  if (!rawDraft) {
    return null
  }

  try {
    const draft = JSON.parse(rawDraft)

    const [
      firstName = '',
      ...restNameParts
    ] = String(
      draft.fullName || '',
    )
      .split(' ')
      .filter(Boolean)

    /*
     * Never restore sensitive
     * password values from a draft.
     */

    const safeDraft = {
      ...draft,
    }

    delete safeDraft.password
    delete safeDraft.temporaryPassword

    return {
      ...safeDraft,

      firstName:
        safeDraft.firstName ||
        firstName,

      lastName:
        safeDraft.lastName ||
        restNameParts.join(' '),

      phone:
        safeDraft.phone ||
        safeDraft.phoneNumber ||
        '',

      /*
       * Password must always start
       * empty when a draft is restored.
       */

      password: '',

      role:
        normalizeEmployeeRoleValue(
          safeDraft.role,
        ),
    }
  } catch {
    window.localStorage.removeItem(
      DRAFT_STORAGE_KEY,
    )

    return null
  }
}


/*
 * =========================
 * BACKEND ERRORS
 * =========================
 */

function parseBackendErrors(error) {
  const status =
    error?.response?.status

  const data =
    error?.response?.data

  if (
    !data ||
    typeof data !== 'object'
  ) {
    return {
      status,
      fieldErrors: {},
      message:
        'Something went wrong. Please try again.',
    }
  }

  const fieldErrors = {}
  let message = ''

  Object.entries(data).forEach(
    ([key, value]) => {
      if (
        [
          'detail',
          'message',
          'non_field_errors',
        ].includes(key)
      ) {
        const text =
          Array.isArray(value)
            ? value[0]
            : value

        message =
          message ||
          String(text || '')

        return
      }

      const mappedKey =
        BACKEND_FIELD_MAP[key] ||
        key

      if (Array.isArray(value)) {
        fieldErrors[mappedKey] =
          String(value[0] || '')
      } else if (
        typeof value === 'string'
      ) {
        fieldErrors[mappedKey] =
          value
      }
    },
  )

  if (!message) {
    message =
      status === 403
        ? 'You do not have permission to create this employee.'
        : status === 500
          ? 'Unable to create employee right now. Please try again.'
          : 'Please fix the highlighted fields and try again.'
  }

  return {
    status,
    fieldErrors,
    message,
  }
}


/*
 * =========================
 * HOOK
 * =========================
 */

function useEmployeeOnboarding({
  creatorRole = '',
  isEditMode = false,
  employeeId = null,
}) {
  const [formData, setFormData] =
    useState(() => {
      const baseState =
        createInitialEmployeeFormValues(
          creatorRole,
        )

      const draft =
        loadDraft()

      return draft
        ? {
            ...baseState,
            ...draft,
          }
        : baseState
    })

  const [
    touchedFields,
    setTouchedFields,
  ] = useState({})

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false)

  const [
    isDraftSaving,
    setIsDraftSaving,
  ] = useState(false)

  const [
    draftSavedAt,
    setDraftSavedAt,
  ] = useState(null)

  const [
    apiFieldErrors,
    setApiFieldErrors,
  ] = useState({})

  const [
    managerOptions,
    setManagerOptions,
  ] = useState([])

  const [
    submissionError,
    setSubmissionError,
  ] = useState('')

  const [
    isLoadingEmployee,
    setIsLoadingEmployee,
  ] = useState(false)

  const [
    originalRole,
    setOriginalRole,
  ] = useState('')

  const roleOptions =
    useMemo(
      () =>
        getAssignableEmployeeRoleOptions(
          creatorRole,
        ),
      [creatorRole],
    )

  const allowedRoleValues =
    useMemo(
      () =>
        roleOptions.map(
          (option) =>
            option.value,
        ),
      [roleOptions],
    )


  /*
   * =========================
   * LOAD MANAGERS
   * =========================
   */

  useEffect(() => {
    async function loadManagers() {
      try {
        const managers =
          await getManagers()

        setManagerOptions(
          managers.map(
            (manager) => ({
              value: manager.id,
              label: manager.label,
            }),
          ),
        )
      } catch (error) {
        console.error(
          'Failed to load managers:',
          error,
        )

        setManagerOptions([])
      }
    }

    loadManagers()
  }, [])


  /*
   * =========================
   * LOAD EMPLOYEE FOR EDIT
   * =========================
   */

  useEffect(() => {
    if (
      !isEditMode ||
      !employeeId
    ) {
      return
    }

    async function loadEmployee() {
      setIsLoadingEmployee(true)

      try {
        const employee =
          await getEmployeeById(
            employeeId,
          )

        setOriginalRole(
          employee.role || '',
        )

        setFormData(
          (current) => ({
            ...current,

            firstName:
              employee.first_name ||
              '',

            lastName:
              employee.last_name ||
              '',

            email:
              employee.email ||
              '',

            phone:
              employee.phone ||
              '',

            role:
              employee.role ||
              '',

            dateOfBirth:
              employee.date_of_birth ||
              '',

            gender:
              employee.gender ||
              '',

            maritalStatus:
              employee.marital_status ||
              '',

            address:
              employee.address ||
              '',

            department:
              employee.department ||
              '',

            designation:
              employee.designation ||
              '',

            reportingManager:
              employee.reporting_manager ||
              '',

            employmentType:
              employee.employment_type ||
              '',

            employmentStatus:
              employee.employment_status ||
              '',

            joiningDate:
              employee.date_of_joining ||
              '',

            workLocation:
              employee.work_location ||
              '',

            shift:
              employee.shift ||
              '',
          }),
        )
      } catch (error) {
        console.error(
          'Failed to load employee:',
          error,
        )
      } finally {
        setIsLoadingEmployee(false)
      }
    }

    loadEmployee()
  }, [
    isEditMode,
    employeeId,
    roleOptions,
  ])


  /*
   * =========================
   * VALIDATION
   * =========================
   */

  const errors =
    useMemo(
      () =>
        validateEmployeeForm(
          formData,
          allowedRoleValues,
          isEditMode,
        ),
      [
        allowedRoleValues,
        formData,
        isEditMode,
      ],
    )


  /*
   * =========================
   * FIELD HANDLING
   * =========================
   */

  const setFieldValue = (
    fieldName,
    value,
  ) => {
    setFormData(
      (current) => ({
        ...current,
        [fieldName]:
          formatEmployeeFieldValue(
            fieldName,
            value,
          ),
      }),
    )

    setApiFieldErrors(
      (current) => {
        if (
          !current[fieldName]
        ) {
          return current
        }

        const next = {
          ...current,
        }

        delete next[fieldName]

        return next
      },
    )

    setSubmissionError('')
  }


  const handleFieldChange = (
    event,
  ) => {
    const {
      name,
      value,
    } = event.target

    setFieldValue(
      name,
      value,
    )
  }


  const handleFieldBlur = (
    event,
  ) => {
    const {
      name,
    } = event.target

    setTouchedFields(
      (current) => ({
        ...current,
        [name]: true,
      }),
    )
  }


  const handleCheckboxChange = (
    event,
  ) => {
    const {
      name,
      checked,
    } = event.target

    setFormData(
      (current) => ({
        ...current,
        [name]: checked,
      }),
    )

    setSubmissionError('')
  }


  /*
   * =========================
   * ASSET
   * =========================
   */

  const handleAssetToggle = (
    assetKey,
  ) => {
    setFormData(
      (current) => ({
        ...current,

        assets: {
          ...current.assets,

          [assetKey]:
            !current.assets[
              assetKey
            ],
        },
      }),
    )
  }


  /*
   * =========================
   * PHOTO
   * =========================
   */

  const handlePhotoChange = (
    file,
  ) => {
    if (!file) {
      return
    }

    const previewUrl =
      URL.createObjectURL(file)

    setFormData(
      (current) => ({
        ...current,
        photoFile: file,
        photoName: file.name,
        photoPreviewUrl:
          previewUrl,
      }),
    )
  }


  /*
   * =========================
   * DOCUMENTS
   * =========================
   */

const handleDocumentChange = async (
  documentKey,
  file,
) => {
  if (!file) return

  // Temporary frontend-only preview.
  // Backend API for document upload is not available yet.
  setFormData((currentData) => ({
    ...currentData,
    documents: {
      ...currentData.documents,
      [documentKey]: {
        file,
        fileName: file.name,
        previewUrl:
          URL.createObjectURL(file),
        status: 'Ready',
        key: documentKey,
      },
    },
  }))
}


  const handleDocumentPreview = (
    documentKey,
  ) => {
    const document =
      formData.documents[
        documentKey
      ]

    if (
      document?.previewUrl
    ) {
      window.open(
        document.previewUrl,
        '_blank',
        'noopener,noreferrer',
      )
    }
  }


  /*
   * =========================
   * SAVE DRAFT
   * =========================
   */

  const saveDraft = () => {
    setIsDraftSaving(true)

    const draft = {
      ...formData,

      /*
       * Never persist the password
       * in localStorage.
       */

      password: undefined,

      photoFile: null,

      documents:
        Object.fromEntries(
          Object.entries(
            formData.documents,
          ).map(
            ([key, value]) => [
              key,
              {
                file: null,
                fileName:
                  value.fileName,
                previewUrl:
                  value.previewUrl,
                status:
                  value.status,
              },
            ],
          ),
        ),
    }

    /*
     * Remove any sensitive password
     * values before serialization.
     */

    delete draft.password
    delete draft.temporaryPassword

    window.localStorage.setItem(
      DRAFT_STORAGE_KEY,
      JSON.stringify(draft),
    )

    setDraftSavedAt(
      new Date(),
    )

    setIsDraftSaving(false)

    return draft
  }


  /*
   * =========================
   * RESET FORM
   * =========================
   */

  const resetForm = () => {
    setFormData(
      createInitialEmployeeFormValues(
        creatorRole,
      ),
    )

    setTouchedFields({})
    setDraftSavedAt(null)
    setApiFieldErrors({})
    setSubmissionError('')

    window.localStorage.removeItem(
      DRAFT_STORAGE_KEY,
    )
  }


  /*
   * =========================
   * SUBMIT EMPLOYEE
   * =========================
   */

  const submitEmployee =
    async () => {
      const nextErrors =
        validateEmployeeForm(
          formData,
          allowedRoleValues,
          isEditMode,
        )

      setTouchedFields(
        Object.keys(
          formData,
        ).reduce(
          (
            accumulator,
            key,
          ) => {
            accumulator[key] = true
            return accumulator
          },
          {},
        ),
      )

      setApiFieldErrors({})
      setSubmissionError('')

      if (
        Object.keys(
          nextErrors,
        ).length > 0
      ) {


        return {
          ok: false,
          errors: nextErrors,
        }
      }

      setIsSubmitting(true)

      try {
        const payload =
          buildCreateUserPayload(
            formData,
            isEditMode,
          )


        let employee

        if (isEditMode) {
          employee =
            await updateEmployee(
              employeeId,
              payload,
            )

          if (
            originalRole !==
            formData.role
          ) {


            await updateEmployeeRole(
              employeeId,
              formData.role,
            )
          }
        } else {
          employee =
            await createEmployee(
              payload,
            )
        }

        window.localStorage.removeItem(
          DRAFT_STORAGE_KEY,
        )

        return {
          ok: true,
          employee,
          message: isEditMode
            ? 'Employee updated successfully.'
            : 'Employee created successfully.',
        }
      } catch (error) {
        const {
          status,
          fieldErrors,
          message,
        } =
          parseBackendErrors(
            error,
          )

        setApiFieldErrors(
          fieldErrors,
        )

        setSubmissionError(
          Object.keys(
            fieldErrors,
          ).length > 0
            ? ''
            : message,
        )

        return {
          ok: false,
          status,
          errors:
            fieldErrors,
          message,
        }
      } finally {
        setIsSubmitting(false)
      }
    }


  /*
   * =========================
   * FIELD ERROR
   * =========================
   */

  const isFieldTouched = (
    fieldName,
  ) =>
    Boolean(
      touchedFields[fieldName],
    )


  const fieldError = (
    fieldName,
  ) => {
    if (
      apiFieldErrors[fieldName]
    ) {
      return apiFieldErrors[
        fieldName
      ]
    }

    return isFieldTouched(
      fieldName,
    )
      ? errors[fieldName]
      : ''
  }


  /*
   * =========================
   * PUBLIC API
   * =========================
   */

  return {
    formData,
    managerOptions,
    isLoadingEmployee,
    errors,
    fieldError,
    roleOptions,
    submissionError,

    handleFieldChange,
    handleFieldBlur,
    handleCheckboxChange,
    handleAssetToggle,
    handlePhotoChange,
    handleDocumentChange,
    handleDocumentPreview,

    saveDraft,
    resetForm,

    submitEmployee,

    isSubmitting,
    isDraftSaving,
    draftSavedAt,
  }
}


export default useEmployeeOnboarding