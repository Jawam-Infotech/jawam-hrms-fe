import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
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

function EmployeeOnboarding() {
  const { user } = useContext(UserContext)
  const navigate = useNavigate()
  const permissions = getPermissions(user.role)

  const {
    formData,
    fieldError,
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
  } = useEmployeeOnboarding()

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
      navigate('/employees')
    }
  }

  return (
    <DashboardLayout>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <EmployeeFormHeader
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
          formData={formData}
          fieldError={fieldError}
          onChange={handleFieldChange}
          onBlur={handleFieldBlur}
          onCheckboxChange={handleCheckboxChange}
        />

        <AssetAssignmentSection assets={formData.assets} onAssetToggle={handleAssetToggle} />

        <EmployeeFormActions
          onCancel={() => navigate(-1)}
          isSubmitting={isSubmitting}
        />
      </form>
    </DashboardLayout>
  )
}

export default EmployeeOnboarding
