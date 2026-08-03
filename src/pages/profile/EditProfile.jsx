import { useContext } from 'react'
import EditProfilePersonalForm from '../../components/profile/EditProfilePersonalForm.jsx'
import Button from '../../components/ui/Button.jsx'
import EmployeeProfileSkeleton from '../../components/employees/EmployeeProfileSkeleton.jsx'
import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import { UserContext } from '../../context/UserContext.jsx'
import useEditProfile from '../../hooks/useEditProfile.js'

function EditProfile() {
  const { user } = useContext(UserContext)
  const {
    formData,
    loading,
    error,
    submissionError,
    isSaving,
    hasChanges,
    canSave,
    fieldError,
    refreshProfile,
    handleFieldChange,
    handleFieldBlur,
    handlePhotoChange,
    cancelEdit,
    submitProfile,
  } = useEditProfile(user.id)

  if (loading) {
    return (
      <DashboardLayout>
        <EmployeeProfileSkeleton />
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="rounded-[18px] border border-[#fecaca] bg-[#fef2f2] p-6 text-[#b91c1c]">
          <p className="font-extrabold">Unable to load profile</p>
          <p className="mt-1 text-sm">{error}</p>
          <Button
            type="button"
            onClick={refreshProfile}
            className="mt-4 rounded-full bg-[#b91c1c] px-5 py-2 text-sm font-extrabold text-white"
          >
            Try Again
          </Button>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <form className="space-y-6" onSubmit={submitProfile}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-[32px] font-black text-[#111827]">Edit Profile</h1>
            <p className="mt-2 text-[16px] text-[#5f6679]">
              Update only your editable personal details.
            </p>
          </div>
          {!hasChanges && (
            <span className="rounded-full bg-[#f3f4f6] px-4 py-2 text-[13px] font-semibold text-[#6b7280]">
              No changes yet
            </span>
          )}
        </div>

        {submissionError && (
          <div className="rounded-[12px] border border-[#f8d7da] bg-[#fdf2f2] px-4 py-3 text-[#842029]">
            {submissionError}
          </div>
        )}

        <EditProfilePersonalForm
          formData={formData}
          fieldError={fieldError}
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
          onPhotoChange={handlePhotoChange}
        />

        <div className="flex flex-col gap-3 rounded-[24px] border border-[#e5e5e5] bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-end">
          <Button
            type="button"
            onClick={cancelEdit}
            className="rounded-full bg-white px-6 py-2 text-[14px] font-extrabold text-[#111827] transition-all duration-200 hover:bg-[#f9fafb]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={!canSave}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3b82f6] px-6 py-2 text-[14px] font-extrabold text-white transition-all duration-200 hover:bg-[#2563eb] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving && (
              <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden="true" />
            )}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </DashboardLayout>
  )
}

export default EditProfile
