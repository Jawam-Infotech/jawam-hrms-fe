import Button from '../ui/Button.jsx'
import DatePicker from '../ui/DatePicker.jsx'
import SelectField from '../ui/SelectField.jsx'
import { getApiErrorMessage } from '../../utils/apiErrorMessage.js'

const inputClass = 'h-[48px] w-full rounded-[9px] border-2 border-[#dedede] bg-white px-[16px] text-[14px] font-semibold text-[#111827] outline-none transition-[border-color,box-shadow] duration-[250ms] focus:border-[#3a7be0] focus:shadow-[0_0_0_4px_rgba(58,123,224,0.16)] disabled:bg-[#f9fafb]'
const today = () => new Date().toISOString().slice(0, 10)

function PayrollSettingsForm({ form, errors, saveError, saving, success, onChange, onSubmit, mode = 'create', onClose }) {
  const isViewMode = mode === 'view'
  const numberInputClass = isViewMode ? `${inputClass} [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none` : inputClass
  const selectClass = isViewMode ? `${inputClass} appearance-none` : inputClass
  const fieldError = (field) => { const value = saveError?.response?.data?.[field] ?? saveError?.response?.data?.detail?.[field]; return Array.isArray(value) ? value[0] : errors[field] || value || '' }
  const field = (label, content, error) => <label className="text-[12px] font-bold uppercase tracking-wide text-[#6b7280]">{label}<div className="mt-2">{content}</div>{error && <span className="mt-1 block text-[13px] font-medium normal-case text-[#dc2626]">{error}</span>}</label>
  const select = (fieldName, label, value, options, placeholder, error) => <div><SelectField label={label} id={fieldName} value={value} onChange={(event) => onChange(fieldName, event.target.value)} options={options} placeholder={placeholder} className={selectClass} labelClass="mb-2 block text-[12px] font-bold uppercase tracking-wide text-[#6b7280]" disabled={saving || isViewMode} />{error && !isViewMode && <span className="mt-1 block text-[13px] font-medium text-[#dc2626]">{error}</span>}</div>
  return <form onSubmit={onSubmit}><div className="grid gap-6 md:grid-cols-2">
    {field('Expected Pay Day', <input type="number" min="1" value={form.expected_pay_day} onChange={(event) => onChange('expected_pay_day', event.target.value)} disabled={saving || isViewMode} className={numberInputClass} />, fieldError('expected_pay_day'))}
    {select('expected_pay_month_offset', 'Expected Pay Month', form.expected_pay_month_offset, [{ value: '0', label: 'Current Month' }, { value: '1', label: 'Next Month' }], 'Select month', fieldError('expected_pay_month_offset'))}
    {select('weekend_policy', 'Weekend Policy', form.weekend_policy, [{ value: 'MON_FRI', label: 'MON_FRI' }], 'Select policy', fieldError('weekend_policy'))}
    {select('holiday_policy', 'Holiday Policy', form.holiday_policy, [{ value: 'COMPANY_CALENDAR', label: 'COMPANY_CALENDAR' }], 'Select policy', fieldError('holiday_policy'))}
    {field('Payroll Cutoff Day', <input type="number" min="1" value={form.payroll_cutoff_day} onChange={(event) => onChange('payroll_cutoff_day', event.target.value)} disabled={saving || isViewMode} className={numberInputClass} />, fieldError('payroll_cutoff_day'))}
    {field('Effective From', <DatePicker value={form.effective_from} minDate={today()} onChange={(value) => onChange('effective_from', value)} disabled={saving || isViewMode} ariaLabel="Effective From" showCalendarIcon={!isViewMode} className={inputClass} />, fieldError('effective_from'))}
  </div>{!isViewMode && saveError && <p className="mt-5 text-[14px] font-semibold text-[#b91c1c]">{getApiErrorMessage(saveError, 'Unable to create payroll setting.')}</p>}{!isViewMode && success && <p className="mt-5 text-[14px] font-semibold text-[#15803d]">{success}</p>}<div className="mt-6 flex justify-end">{isViewMode ? <Button type="button" onClick={onClose} className="rounded-full border border-[#d1d5db] px-5 py-2.5 text-[14px] font-bold text-[#374151] hover:bg-[#f9fafb]">Close</Button> : <Button type="submit" disabled={saving} className="rounded-full bg-[#2563eb] px-5 py-2.5 text-[14px] font-bold text-white hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-50">{saving ? 'Saving...' : 'Save Changes'}</Button>}</div></form>
}
export default PayrollSettingsForm
