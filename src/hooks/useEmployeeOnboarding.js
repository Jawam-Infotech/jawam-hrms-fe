import { useMemo, useState } from 'react'
import { createEmployee, generateEmployeeId, getEmployees, uploadDocument } from '../services/employeeService.js'
import { buildEmployeePayload, createInitialEmployeeFormValues, formatEmployeeFieldValue } from '../utils/employeeFormHelpers.js'
import { validateEmployeeForm } from '../utils/employeeValidators.js'

const DRAFT_STORAGE_KEY = 'jawamhr-employee-onboarding-draft'

function loadDraft() {
  const rawDraft = window.localStorage.getItem(DRAFT_STORAGE_KEY)
  if (!rawDraft) {
    return null
  }

  try {
    return JSON.parse(rawDraft)
  } catch {
    window.localStorage.removeItem(DRAFT_STORAGE_KEY)
    return null
  }
}

function useEmployeeOnboarding() {
  const [employeeId] = useState(() => generateEmployeeId())
  const [formData, setFormData] = useState(() => {
    const baseState = createInitialEmployeeFormValues(employeeId)
    const draft = loadDraft()

    return draft ? { ...baseState, ...draft, employeeId: baseState.employeeId } : baseState
  })
  const [touchedFields, setTouchedFields] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDraftSaving, setIsDraftSaving] = useState(false)
  const [draftSavedAt, setDraftSavedAt] = useState(null)

  const errors = useMemo(
    () => validateEmployeeForm(formData, getEmployees()),
    [formData]
  )

  const setFieldValue = (fieldName, value) => {
    setFormData((current) => ({
      ...current,
      [fieldName]: formatEmployeeFieldValue(fieldName, value),
    }))
  }

  const handleFieldChange = (event) => {
    const { name, value } = event.target
    setFieldValue(name, value)
  }

  const handleFieldBlur = (event) => {
    const { name } = event.target
    setTouchedFields((current) => ({ ...current, [name]: true }))
  }

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target
    setFormData((current) => ({ ...current, [name]: checked }))
  }

  const handleAssetToggle = (assetKey) => {
    setFormData((current) => ({
      ...current,
      assets: {
        ...current.assets,
        [assetKey]: !current.assets[assetKey],
      },
    }))
  }

  const handlePhotoChange = (file) => {
    if (!file) {
      return
    }

    const previewUrl = URL.createObjectURL(file)
    setFormData((current) => ({
      ...current,
      photoFile: file,
      photoName: file.name,
      photoPreviewUrl: previewUrl,
    }))
  }

  const handleDocumentChange = (documentKey, file) => {
    if (!file) {
      return
    }

    const uploadedDocument = uploadDocument(documentKey, file)
    setFormData((current) => ({
      ...current,
      documents: {
        ...current.documents,
        [documentKey]: uploadedDocument,
      },
    }))
  }

  const handleDocumentPreview = (documentKey) => {
    const document = formData.documents[documentKey]
    if (document?.previewUrl) {
      window.open(document.previewUrl, '_blank', 'noopener,noreferrer')
    }
  }

  const saveDraft = () => {
    setIsDraftSaving(true)

    const draft = {
      ...formData,
      photoFile: null,
      documents: Object.fromEntries(
        Object.entries(formData.documents).map(([key, value]) => [
          key,
          {
            file: null,
            fileName: value.fileName,
            previewUrl: value.previewUrl,
            status: value.status,
          },
        ])
      ),
    }

    window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft))
    setDraftSavedAt(new Date())
    setIsDraftSaving(false)
    return draft
  }

  const resetForm = () => {
    const nextEmployeeId = generateEmployeeId(getEmployees())
    setFormData(createInitialEmployeeFormValues(nextEmployeeId))
    setTouchedFields({})
    setDraftSavedAt(null)
    window.localStorage.removeItem(DRAFT_STORAGE_KEY)
  }

  const submitEmployee = async () => {
    const nextErrors = validateEmployeeForm(formData, getEmployees())
    setTouchedFields(
      Object.keys(formData).reduce((accumulator, key) => {
        accumulator[key] = true
        return accumulator
      }, {})
    )

    if (Object.keys(nextErrors).length > 0) {
      return { ok: false, errors: nextErrors }
    }

    setIsSubmitting(true)
    try {
      const createdEmployee = createEmployee(buildEmployeePayload(formData))
      window.localStorage.removeItem(DRAFT_STORAGE_KEY)
      return { ok: true, employee: createdEmployee }
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFieldTouched = (fieldName) => Boolean(touchedFields[fieldName])
  const fieldError = (fieldName) => (isFieldTouched(fieldName) ? errors[fieldName] : '')

  return {
    formData,
    errors,
    fieldError,
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
    employeeId,
  }
}

export default useEmployeeOnboarding
