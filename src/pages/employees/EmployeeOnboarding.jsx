import { useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import { UserContext } from '../../context/UserContext.jsx'
import getPermissions from '../../utils/getPermissions.js'
import AccessRestricted from '../../components/employees/AccessRestricted.jsx'
import useEmployeeOnboarding from '../../hooks/useEmployeeOnboarding.js'
import EmployeeFormHeader from '../../components/employees/onboarding/EmployeeFormHeader.jsx'
import PersonalInformationSection from '../../components/employees/onboarding/PersonalInformationSection.jsx'
import EmploymentInformationSection from '../../components/employees/onboarding/EmploymentInformationSection.jsx'
import DocumentUploadSection from '../../components/employees/onboarding/DocumentUploadSection.jsx'
import PayrollInformationSection from '../../components/employees/onboarding/PayrollInformationSection.jsx'
import SystemAccessSection from '../../components/employees/onboarding/SystemAccessSection.jsx'
import AssetAssignmentSection from '../../components/employees/onboarding/AssetAssignmentSection.jsx'
import EmployeeFormActions from '../../components/employees/onboarding/EmployeeFormActions.jsx'
import EmployeeFormSkeleton from '../../components/employees/EmployeeFormSkeleton.jsx'

function EmployeeOnboarding() {
  const { user } = useContext(UserContext)
  const navigate = useNavigate()
  const { id } = useParams()
  const isEditMode = Boolean(id)

  const permissions = getPermissions(user.role)

  const {
    formData,
    fieldError,
    managerOptions, 
    roleOptions,
    submissionError,
    isLoadingEmployee,
    handleFieldChange,
    handleFieldBlur,
    handleCheckboxChange,
    handleAssetToggle,
    handlePhotoChange,
    handleDocumentChange,
    handleDocumentPreview,
    saveDraft,
    submitEmployee,
    isSubmitting,
    isDraftSaving,
  } = useEmployeeOnboarding({
  creatorRole: user.role,
  isEditMode,
  employeeId: id,
})

  if (!permissions.employee.canCreateEmployee) {
    return (
      <DashboardLayout>
        <div className="space-y-6">
          <button onClick={() => navigate(-1)} className="text-[#6b7280] hover:underline">
            ← Back
          </button>
          <AccessRestricted
            title="Access Restricted"
            message="You cannot access employee onboarding."
            buttonText="Go to Dashboard"
            onBack={() => navigate('/dashboard')}
          />
        </div>
      </DashboardLayout>
    )
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const result = await submitEmployee()

    if (result.ok) {
      navigate('/employees', {
        state: { successMessage:
  result.message ||
  (isEditMode
    ? 'Employee updated successfully.'
    : 'Employee created successfully.') },
      })
      return
    }

    if (result.status === 401) {
      navigate('/login')
    }
  }
if (isEditMode && isLoadingEmployee) {
  return (
    <DashboardLayout>
      <EmployeeFormSkeleton />
    </DashboardLayout>
  )
}

  return (
    <DashboardLayout>
      <form className="space-y-6" onSubmit={handleSubmit}>
        {submissionError && (
          <div className="rounded-[12px] border border-[#f8d7da] bg-[#fdf2f2] px-4 py-3 text-[#842029]">
            {submissionError}
          </div>
        )}
        <EmployeeFormHeader
          isEditMode={isEditMode}
          formData={formData}
          onBack={() => navigate(-1)}
          onSaveDraft={saveDraft}
          onCancel={() => navigate(-1)}
          onPhotoChange={handlePhotoChange}
          isDraftSaving={isDraftSaving}
        />

        <PersonalInformationSection
          formData={formData}
          fieldError={fieldError}
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
        />

        <EmploymentInformationSection
          formData={formData}
          fieldError={fieldError}
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
          managerOptions={managerOptions}
        />

        <DocumentUploadSection
          documents={formData.documents}
          onDocumentChange={handleDocumentChange}
          onDocumentPreview={handleDocumentPreview}
        />

        <PayrollInformationSection
          formData={formData}
          fieldError={fieldError}
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
        />

        <SystemAccessSection
          isEditMode={isEditMode}
          formData={formData}
          fieldError={fieldError}
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
          onCheckboxChange={handleCheckboxChange}
          roleOptions={roleOptions}
        />

        <AssetAssignmentSection assets={formData.assets} onAssetToggle={handleAssetToggle} />

        <EmployeeFormActions
          isEditMode={isEditMode}
          onCancel={() => navigate(-1)}
          isSubmitting={isSubmitting}
        />
      </form>
    </DashboardLayout>
  )
}

export default EmployeeOnboarding
