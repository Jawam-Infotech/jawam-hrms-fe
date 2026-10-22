import { useContext, useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import AccessRestricted from '../../components/employees/AccessRestricted.jsx'
import Button from '../../components/ui/Button.jsx'
import DatePicker from '../../components/ui/DatePicker.jsx'
import { UserContext } from '../../context/UserContext.jsx'
import { getDepartments } from '../../services/employeeService.js'
import { exportPayrollExcel } from '../../services/payrollService.js'
import { getApiErrorMessage } from '../../utils/apiErrorMessage.js'

function filenameFromHeaders(headers, month) {
  const disposition = headers?.['content-disposition'] || ''
  const match = disposition.match(/filename\*?=(?:UTF-8''|")?([^;"]+)/i)
  return match?.[1] ? decodeURIComponent(match[1].trim()) : `payroll-report-${month || 'export'}.xlsx`
}

function isValidMonth(value) {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(value)
}

function getFinancialYears() {
  const currentYear = new Date().getFullYear()
  return Array.from({ length: 6 }, (_, index) => {
    const start = currentYear - index
    return `${start}-${start + 1}`
  })
}

function EmbeddedShell({ children }) {
  return <>{children}</>
}

function PayrollReports({ embedded = false }) {
  const { user } = useContext(UserContext)
  const role = String(user?.role || '').toUpperCase()
  const [period, setPeriod] = useState('single_month')
  const [month, setMonth] = useState('')
  const [financialYear, setFinancialYear] = useState('')
  const [fromMonth, setFromMonth] = useState('')
  const [toMonth, setToMonth] = useState('')
  const [monthTouched, setMonthTouched] = useState(false)
  const [department, setDepartment] = useState('')
  const [departments, setDepartments] = useState([])
  const [loadingDepartments, setLoadingDepartments] = useState(true)
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    getDepartments()
      .then((items) => setDepartments(Array.isArray(items) ? items : []))
      .catch(() => {})
      .finally(() => setLoadingDepartments(false))
  }, [])

  const monthValidation = period === 'single_month' && !isValidMonth(month)
    ? 'Select a valid salary month.'
    : period === 'custom_range' && (!isValidMonth(fromMonth) || !isValidMonth(toMonth))
      ? 'Select a valid start and end month.'
      : period === 'custom_range' && fromMonth > toMonth
        ? 'The start month must be before or equal to the end month.'
        : period === 'financial_year' && !financialYear
          ? 'Select a financial year.'
          : ''
  const canExport = !exporting

  const handleExport = async () => {
    if (exporting) return
    setMonthTouched(true)
    if (monthValidation) {
      setError(monthValidation)
      return
    }

    setExporting(true)
    setError(null)
    try {
      const response = await exportPayrollExcel({
        period,
        ...(period === 'single_month' ? { salary_month: month } : {}),
        ...(period === 'financial_year' ? { financial_year: financialYear } : {}),
        ...(period === 'custom_range' ? { from_month: fromMonth, to_month: toMonth } : {}),
        department,
      })
      const url = URL.createObjectURL(response.data)
      const link = document.createElement('a')
      link.href = url
      link.download = filenameFromHeaders(response.headers, month)
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(url)
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, 'Unable to export payroll report.'))
    } finally {
      setExporting(false)
    }
  }

  if (!['HR', 'CEO'].includes(role)) {
    return <DashboardLayout><AccessRestricted title="Payroll reports access denied" message="You do not have permission to export payroll reports." buttonText="Return to Payroll" onBack={() => window.history.back()} /></DashboardLayout>
  }

  const PageShell = embedded ? EmbeddedShell : DashboardLayout

  return (
    <PageShell>
      <div className="space-y-6">
        <section className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="text-sm font-bold text-[#374151]">Report period<select value={period} onChange={(event) => { setPeriod(event.target.value); setMonthTouched(false); setError(null) }} className="mt-2 w-full rounded-xl border border-[#d1d5db] bg-white p-3 font-normal text-[#374151]"><option value="single_month">Single Month</option><option value="custom_range">Custom Month Range</option><option value="financial_year">Financial Year</option></select></label>
            <label className="text-sm font-bold text-[#374151]">
              {period === 'single_month' ? 'Salary month' : period === 'custom_range' ? 'From month' : 'Financial year'}
              {period === 'financial_year' ? <select value={financialYear} onChange={(event) => { setFinancialYear(event.target.value); setMonthTouched(true); setError(null) }} className="mt-2 w-full rounded-xl border border-[#d1d5db] bg-white p-3 font-normal"><option value="">Select financial year</option>{getFinancialYears().map((year) => <option key={year} value={year}>{year}</option>)}</select> : <DatePicker value={(period === 'single_month' ? month : fromMonth) ? `${period === 'single_month' ? month : fromMonth}-01` : ''} onChange={(value) => { const selected = value ? value.slice(0, 7) : ''; period === 'single_month' ? setMonth(selected) : setFromMonth(selected); setMonthTouched(true); setError(null) }} monthOnly portal placeholder="Select month" ariaLabel={period === 'single_month' ? 'Salary month' : 'From month'} className="mt-2" />}
              {monthTouched && monthValidation && <span className="mt-2 block text-sm font-semibold text-red-600">{monthValidation}</span>}
            </label>
            {period === 'custom_range' && <label className="text-sm font-bold text-[#374151]">To month<DatePicker value={toMonth ? `${toMonth}-01` : ''} onChange={(value) => { setToMonth(value ? value.slice(0, 7) : ''); setMonthTouched(true); setError(null) }} monthOnly portal placeholder="Select month" ariaLabel="To month" className="mt-2" /></label>}
            <label className="text-sm font-bold text-[#374151]">
              Department
              <select value={department} onChange={(event) => setDepartment(event.target.value)} disabled={loadingDepartments} className="mt-2 w-full rounded-xl border border-[#d1d5db] bg-white p-3 font-normal">
                <option value="">All departments</option>
                {departments.map((item) => <option key={item.id || item.name} value={item.name}>{item.name}</option>)}
              </select>
            </label>
          </div>
          {error && <p className="mt-4 rounded-xl border border-[#fecaca] bg-[#fef2f2] p-4 text-sm font-semibold text-[#b91c1c]">{error}</p>}
          <div className="mt-6 flex justify-end">
            <Button type="button" onClick={handleExport} disabled={!canExport} className="rounded-full bg-[#2563eb] px-5 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{exporting ? 'Exporting...' : 'Export to Excel'}</Button>
          </div>
        </section>
      </div>
    </PageShell>
  )
}

export default PayrollReports
