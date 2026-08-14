import { useContext } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import { UserContext } from '../../context/UserContext.jsx'
import Button from '../../components/ui/Button.jsx'
import ConfirmationModal from '../../components/shared/ConfirmationModal.jsx'
import HolidayFormModal from '../../components/attendance/holidays/HolidayFormModal.jsx'
import HolidayTable from '../../components/attendance/holidays/HolidayTable.jsx'
import useHolidayManagement from '../../hooks/useHolidayManagement.js'

function HolidayManagement() {
  const { user } = useContext(UserContext)
  const {
    holidays,
    loading,
    error,
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
  } = useHolidayManagement(user)

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[32px] font-black text-[#111827]">Holiday Management</h1>
            <p className="mt-2 text-[16px] text-[#5f6679]">
              Manage company holidays directly from the Attendance module.
            </p>
          </div>

          {canManage && (
            <Button
              type="button"
              onClick={openAddHoliday}
              className="inline-flex items-center justify-center rounded-full bg-[#3b82f6] px-6 py-3 text-[14px] font-extrabold text-white transition-all hover:bg-[#2563eb]"
            >
              Add Holiday
            </Button>
          )}
        </div>

        {error && (
          <div className="rounded-[12px] border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-[14px] font-semibold text-[#b91c1c]">
            Failed to load holidays. Please try again.
          </div>
        )}

        <HolidayTable
          holidays={holidays}
          loading={loading}
          canManage={canManage}
          onEdit={openEditHoliday}
          onDelete={openDeleteHoliday}
        />
      </div>

      <HolidayFormModal
        isOpen={isFormOpen}
        mode={formMode}
        values={formState}
        saving={saving}
        onChange={handleFormChange}
        onSubmit={handleFormSubmit}
        onClose={closeForm}
      />

      <ConfirmationModal
        isOpen={Boolean(deleteTarget)}
        title="Delete Holiday"
        message={
          deleteTarget
            ? `Are you sure you want to delete ${deleteTarget.holidayName}? This action cannot be undone.`
            : ''
        }
        confirmText="Delete"
        cancelText="Cancel"
        loading={Boolean(deletingId)}
        loadingText="Deleting..."
        onConfirm={confirmDeleteHoliday}
        onCancel={closeDeleteHoliday}
      />
    </DashboardLayout>
  )
}

export default HolidayManagement
