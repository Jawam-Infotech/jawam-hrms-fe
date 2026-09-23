import { useContext } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import { UserContext } from '../../context/UserContext.jsx'
import getPermissions from '../../utils/getPermissions.js'
import MasterData from '../../components/settings/MasterDataModal.jsx'
import ChangePasswordAccordion from '../../components/profile/ChangePasswordAccordion.jsx'
import useProfile from '../../hooks/useProfile.js'

function Settings() {
  const { user } = useContext(UserContext)
  const permissions = getPermissions(user?.role)

  const {
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

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-[32px] font-black text-[#111827]">
            Settings
          </h1>

          <p className="mt-2 text-[16px] text-[#5f6679]">
            Manage your account settings and company configuration.
          </p>
        </div>

        {/* Change Password */}
        <ChangePasswordAccordion
          isOpen={isPasswordAccordionOpen}
          onToggle={() =>
            setIsPasswordAccordionOpen(
              (currentValue) => !currentValue,
            )
          }
          form={passwordForm}
          errors={passwordErrors}
          successMessage={passwordMessage}
          passwordRequirements={passwordRequirements}
          canSubmit={canSubmitPasswordChange}
          isSubmitting={isChangingPassword}
          onFieldChange={updatePasswordField}
          onSubmit={submitPasswordChange}
        />

        {/* Department & Designation Management */}
        {permissions.employee.canManageMasterData && (
  <div className="space-y-4">
    <div>
      <h2 className="text-[24px] font-black text-[#111827]">
        Department & Designation Management
      </h2>

      <p className="mt-1 text-[14px] text-[#5f6679]">
        Manage departments and designations used across the organization.
      </p>
    </div>

    <MasterData />
  </div>
)}
      </div>
    </DashboardLayout>
  )
}

export default Settings