import { useContext } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import ChangePasswordAccordion from '../../components/profile/ChangePasswordAccordion.jsx'
import EmployeeAssets from '../../components/employees/EmployeeAssets.jsx'
import EmployeeDocuments from '../../components/employees/EmployeeDocuments.jsx'
import EmployeeOtherInformation from '../../components/employees/EmployeeOtherInformation.jsx'
import EmployeeProfileHeader from '../../components/employees/EmployeeProfileHeader.jsx'
import EmployeeProfileSkeleton from '../../components/employees/EmployeeProfileSkeleton.jsx'
import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import { UserContext } from '../../context/UserContext.jsx'
import useProfile from '../../hooks/useProfile.js'

function MyProfile() {
  const { user } = useContext(UserContext)
  const navigate = useNavigate()
  const location = useLocation()
  const {
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
  } = useProfile(user.id)

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
          <button
            type="button"
            onClick={refreshProfile}
            className="mt-4 rounded-full bg-[#b91c1c] px-5 py-2 text-sm font-extrabold text-white"
          >
            Try Again
          </button>
        </div>
      </DashboardLayout>
    )
  }

  if (!employee) {
    return (
      <DashboardLayout>
        <div className="rounded-[18px] border border-[#e5e7eb] bg-white p-6 text-[#6b7280]">
          Profile not found.
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-[32px] font-black text-[#111827]">My Profile</h1>
              <p className="mt-2 text-[16px] text-[#5f6679]">
                View your employment details, documents, assigned assets, and account security.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/profile/edit')}
              className="rounded-full bg-[#3b82f6] px-6 py-3 text-[14px] font-extrabold text-white transition-all hover:bg-[#2563eb]"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {location.state?.successMessage && (
          <div className="rounded-[12px] border border-[#d1fae5] bg-[#ecfdf5] px-4 py-3 text-[14px] font-semibold text-[#166534]">
            {location.state.successMessage}
          </div>
        )}

        <EmployeeProfileHeader employee={employee} />
        <EmployeeOtherInformation employee={employee} title="Personal Information" />
        <EmployeeDocuments documents={employee.documents || []} />
        <EmployeeAssets assets={employee.assets || []} />

        <ChangePasswordAccordion
          isOpen={isPasswordAccordionOpen}
          onToggle={() => setIsPasswordAccordionOpen((currentValue) => !currentValue)}
          form={passwordForm}
          errors={passwordErrors}
          successMessage={passwordMessage}
          passwordRequirements={passwordRequirements}
          canSubmit={canSubmitPasswordChange}
          isSubmitting={isChangingPassword}
          onFieldChange={updatePasswordField}
          onSubmit={submitPasswordChange}
        />
      </div>
    </DashboardLayout>
  )
}

export default MyProfile
