import AssetFilters from '../assets/AssetFilters.jsx'
import DatePicker from '../ui/DatePicker.jsx'
import EmployeeSelector from './EmployeeSelector.jsx'

const STATUS_OPTIONS = [
  ['DRAFT', 'Draft'], ['GENERATED', 'Generated'], ['HR_APPROVED', 'HR Approved'],
  ['CORRECTION_REQUIRED', 'Correction Required'], ['CANCELLATION_REQUESTED', 'Cancellation Requested'],
  ['CANCELLED', 'Cancelled'], ['ERROR', 'Error'], ['SKIPPED', 'Skipped'],
  ['PAYMENT_INFO_PENDING', 'Payment Info Pending'], ['PAID', 'Paid'],
]

function PayrollFilters({
  filters,
  onApply,
  onClear,
  showEmployee = false,
  onEmployeeChange,
  employeeResetKey = 0,
}) {
  const fields = [
    {
      key: 'salary_month', label: 'Salary Month',
      render: ({ value, onChange }) => (
        <DatePicker value={value ? `${value}-01` : ''} onChange={(date) => onChange(date.slice(0, 7))} monthOnly ariaLabel="Salary month" className="w-full rounded-xl border border-[#e5e7eb] px-3 py-2.5 text-[12px] font-medium text-[#374151] outline-none focus:border-[#2563eb]" />
      ),
    },
    { key: 'status', label: 'Status', type: 'select', placeholder: 'All Statuses', options: STATUS_OPTIONS.map(([value, label]) => ({ value, label })) },
    { key: 'payment_status', label: 'Payment Status', type: 'select', placeholder: 'All Payment Statuses', options: [{ value: 'PENDING', label: 'Pending' }, { value: 'PAID', label: 'Paid' }] },
  ]

  const dropdownFilters = { ...filters }
  delete dropdownFilters.employee

  return (
    <div className="flex flex-wrap items-center justify-end gap-3">
      {showEmployee && (
        <div className="w-[min(280px,calc(100vw-3rem))]">
          <EmployeeSelector
            key={employeeResetKey}
            onChange={onEmployeeChange}
          />
        </div>
      )}

      <AssetFilters
        filters={dropdownFilters}
        fields={fields}
        onApply={onApply}
        onClear={onClear}
      />
    </div>
  )
}

export default PayrollFilters
