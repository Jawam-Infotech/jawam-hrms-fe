import { useCallback, useMemo, useState } from 'react'
import {
  createHoliday,
  deleteHoliday,
  updateHoliday,
} from '../services/holidayService.js'
import useHolidayCatalog from './useHolidayCatalog.js'
import { toHolidayInputDate } from '../utils/holidayUtils.js'

const DEFAULT_FORM_STATE = {
  holidayName: '',
  holidayDate: '',
}

function useHolidayManagement(user) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formMode, setFormMode] = useState('add')
  const [formState, setFormState] = useState(DEFAULT_FORM_STATE)
  const [selectedHolidayId, setSelectedHolidayId] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)

  const [saving, setSaving] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [actionError, setActionError] = useState(null)

  const {
    holidays,
    loading,
    error: catalogError,
    refreshHolidays,
  } = useHolidayCatalog()

  const userRole = user?.role
  const userName = user?.name

  const canManage = useMemo(() => {
    const role = String(userRole || '').toLowerCase()

    return role === 'admin' || role === 'hr'
  }, [userRole])

  const openAddHoliday = useCallback(() => {
    setFormMode('add')
    setSelectedHolidayId(null)
    setFormState(DEFAULT_FORM_STATE)
    setActionError(null)
    setIsFormOpen(true)
  }, [])

  const openEditHoliday = useCallback((holiday) => {
    setFormMode('edit')
    setSelectedHolidayId(holiday.id)
    setActionError(null)

    setFormState({
      holidayName: holiday.holidayName || '',
      holidayDate: toHolidayInputDate(
        holiday.holidayDate
      ),
    })

    setIsFormOpen(true)
  }, [])

  const closeForm = useCallback(() => {
    setIsFormOpen(false)
    setFormMode('add')
    setSelectedHolidayId(null)
    setFormState(DEFAULT_FORM_STATE)
    setActionError(null)
  }, [])

  const handleFormChange = useCallback(
    (field, value) => {
      setFormState((current) => ({
        ...current,
        [field]: value,
      }))
    },
    []
  )

  const handleFormSubmit = useCallback(
    async () => {
      const holidayName =
        formState.holidayName.trim()

      const holidayDate =
        formState.holidayDate

      if (!holidayName || !holidayDate) {
        return { ok: false }
      }

      setSaving(true)
      setActionError(null)

      try {
        if (formMode === 'add') {
          await createHoliday({
            holidayName,
            holidayDate,
            createdBy:
              userName || 'HR Team',
          })
        } else {
          await updateHoliday(
            selectedHolidayId,
            {
              holidayName,
              holidayDate,
            }
          )
        }

        await refreshHolidays()
        closeForm()

        return { ok: true }
      } catch (err) {
        setActionError(
          err.message ||
            'Failed to save holiday.'
        )

        return {
          ok: false,
          error: err,
        }
      } finally {
        setSaving(false)
      }
    },
    [
      closeForm,
      formMode,
      formState.holidayDate,
      formState.holidayName,
      refreshHolidays,
      selectedHolidayId,
      userName,
    ]
  )

  const openDeleteHoliday = useCallback(
    (holiday) => {
      setDeleteTarget(holiday)
      setActionError(null)
    },
    []
  )

  const closeDeleteHoliday = useCallback(() => {
    setDeleteTarget(null)
    setActionError(null)
  }, [])

  const confirmDeleteHoliday =
    useCallback(async () => {
      if (!deleteTarget) {
        return { ok: false }
      }

      setDeletingId(deleteTarget.id)
      setActionError(null)

      try {
        await deleteHoliday(deleteTarget.id)

        await refreshHolidays()

        setDeleteTarget(null)

        return { ok: true }
      } catch (err) {
        setActionError(
          err.message ||
            'Failed to delete holiday.'
        )

        return {
          ok: false,
          error: err,
        }
      } finally {
        setDeletingId(null)
      }
    }, [
      deleteTarget,
      refreshHolidays,
    ])

  return {
    holidays,
    loading,
    error:
      actionError || catalogError,

    canManage,

    isFormOpen,
    formMode,
    formState,

    saving,

    deleteTarget,
    deletingId,

    openAddHoliday,
    openEditHoliday,
    closeForm,

    handleFormChange,
    handleFormSubmit,

    openDeleteHoliday,
    closeDeleteHoliday,
    confirmDeleteHoliday,
  }
}

export default useHolidayManagement