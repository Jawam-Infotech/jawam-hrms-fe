import Button from '../../ui/Button.jsx'
import EmployeePhotoUpload from './EmployeePhotoUpload.jsx'

function EmployeeFormHeader({
  formData,
  onBack,
  onSaveDraft,
  onCancel,
  onPhotoChange,
  isDraftSaving,
}) {
  return (
    <div className="space-y-6">
      <button onClick={onBack} className="text-[#6b7280] hover:underline">
        ← Back to Employee details
      </button>

      <div className="flex flex-col gap-6 rounded-[24px] border border-[#e5e5e5] bg-white p-6 shadow-sm md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-5">
          <EmployeePhotoUpload
            previewUrl={formData.photoPreviewUrl}
            name={formData.fullName}
            onChange={onPhotoChange}
          />

          <div>
            <h2 className="text-[28px] font-black text-[#111827]">
              {formData.fullName || 'Employee Onboarding'}
            </h2>
            <p className="text-[14px] text-[#5f6679]">Employee ID: {formData.employeeId}</p>
            <p className="text-[14px] text-[#5f6679]">Designation: {formData.designation || '-'}</p>
            <p className="text-[14px] text-[#5f6679]">Department: {formData.department || '-'}</p>
            <p className="text-[14px] text-[#5f6679]">Contact No: {formData.phoneNumber || '-'}</p>
            <p className="text-[14px] text-[#5f6679]">Email: {formData.email || '-'}</p>
            <p className="text-[14px] text-[#5f6679]">Date of Joining: {formData.joiningDate || '-'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            onClick={onSaveDraft}
            disabled={isDraftSaving}
            className="rounded-full bg-[#e5e7eb] px-6 py-2 text-[14px] font-extrabold text-[#9ca3af] transition-all duration-200"
          >
            {isDraftSaving ? 'Saving...' : 'Save Draft'}
          </Button>
          <Button
            type="button"
            onClick={onCancel}
            className="rounded-full bg-white px-6 py-2 text-[14px] font-extrabold text-[#111827] transition-all duration-200 hover:bg-[#f9fafb]"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}

export default EmployeeFormHeader
