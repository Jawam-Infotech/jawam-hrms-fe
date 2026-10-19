import Card from '../../ui/Card.jsx'
import SelectField from '../../ui/SelectField.jsx'
import FieldError from '../../ui/FieldError.jsx'
import DatePicker from '../../ui/DatePicker.jsx'
import {
  EMPLOYEE_EMPLOYMENT_STATUS_OPTIONS,
  EMPLOYEE_EMPLOYMENT_TYPE_OPTIONS,
  EMPLOYEE_SHIFT_OPTIONS,
  EMPLOYEE_WORK_LOCATION_OPTIONS,
} from '../../../constants/employeeFormFields.js'

const inputClass =
  'h-[48px] w-full rounded-[9px] border-2 border-[#dedede] bg-white px-[16px] text-[#111827] outline-none transition-[border-color,box-shadow] duration-[250ms] focus:border-[#3a7be0] focus:shadow-[0_0_0_4px_rgba(58,123,224,0.16)] max-[380px]:h-14'

function EmploymentInformationSection({
  formData,
  managerOptions,
  departmentOptions,
  designationOptions,
  fieldError,
  onChange,
  onBlur,
}) {
  const showLastWorkingDate = formData.employmentStatus === 'ON_NOTICE'
  const showExitDate = formData.employmentStatus === 'EXITED'

  return (
    <Card className="rounded-[24px] border border-[#e5e5e5] bg-white p-6 shadow-sm">
      <h3 className="mb-4 text-[18px] font-extrabold text-[#111827]">
        Employment Information
      </h3>

      <div className="grid gap-5 md:grid-cols-2">
        <SelectField
          label="Department"
          id="department"
          value={formData.department}
          onChange={onChange}
          placeholder="Select department"
          options={departmentOptions}
          className={inputClass}
        />

        <SelectField
          label="Designation"
          id="designation"
          value={formData.designation}
          onChange={onChange}
          placeholder="Select designation"
          options={designationOptions}
          className={inputClass}
        />

        <SelectField
          label="Reporting Manager"
          id="reportingManager"
          value={formData.reportingManager}
          onChange={onChange}
          placeholder="Select manager"
          options={managerOptions}
          className={inputClass}
        />

        <SelectField
          label="Employment Type"
          id="employmentType"
          value={formData.employmentType}
          onChange={onChange}
          placeholder="Select employment type"
          options={EMPLOYEE_EMPLOYMENT_TYPE_OPTIONS}
          className={inputClass}
        />

        <SelectField
          label="Employment Status"
          id="employmentStatus"
          value={formData.employmentStatus}
          onChange={onChange}
          placeholder="Select status"
          options={EMPLOYEE_EMPLOYMENT_STATUS_OPTIONS}
          className={inputClass}
        />

        <div>
          <label className="mb-[4px] block text-[18px] font-extrabold" htmlFor="joiningDate">Joining Date</label>
          <DatePicker value={formData.joiningDate} onChange={(value) => onChange({ target: { name: 'joiningDate', value } })} onBlur={() => onBlur({ target: { name: 'joiningDate' } })} ariaLabel="Joining Date" className={inputClass} />
        </div>

        {showLastWorkingDate && (
          <div>
            <label className="mb-[4px] block text-[18px] font-extrabold" htmlFor="lastWorkingDate">Last Working Date</label>
            <DatePicker value={formData.lastWorkingDate} onChange={(value) => onChange({ target: { name: 'lastWorkingDate', value } })} onBlur={() => onBlur({ target: { name: 'lastWorkingDate' } })} ariaLabel="Last Working Date" className={inputClass} />
          </div>
        )}

        {showExitDate && (
          <div>
            <label className="mb-[4px] block text-[18px] font-extrabold" htmlFor="exitDate">Exit Date</label>
            <DatePicker value={formData.exitDate} onChange={(value) => onChange({ target: { name: 'exitDate', value } })} onBlur={() => onBlur({ target: { name: 'exitDate' } })} ariaLabel="Exit Date" className={inputClass} />
          </div>
        )}

        <SelectField
          label="Work Location"
          id="workLocation"
          value={formData.workLocation}
          onChange={onChange}
          placeholder="Select work location"
          options={EMPLOYEE_WORK_LOCATION_OPTIONS}
          className={inputClass}
        />

        <SelectField
          label="Shift"
          id="shift"
          value={formData.shift}
          onChange={onChange}
          placeholder="Select shift"
          options={EMPLOYEE_SHIFT_OPTIONS}
          className={inputClass}
        />
      </div>

      <div className="mt-2 grid gap-4 md:grid-cols-2">
        <FieldError>{fieldError('department')}</FieldError>
        <FieldError>{fieldError('designation')}</FieldError>
        <FieldError>{fieldError('reportingManager')}</FieldError>
        <FieldError>{fieldError('employmentType')}</FieldError>
        <FieldError>{fieldError('employmentStatus')}</FieldError>
        <FieldError>{fieldError('joiningDate')}</FieldError>

        {showLastWorkingDate && (
          <FieldError>{fieldError('lastWorkingDate')}</FieldError>
        )}

        {showExitDate && (
          <FieldError>{fieldError('exitDate')}</FieldError>
        )}

        <FieldError>{fieldError('workLocation')}</FieldError>
        <FieldError>{fieldError('shift')}</FieldError>
      </div>
    </Card>
  )
}

export default EmploymentInformationSection
