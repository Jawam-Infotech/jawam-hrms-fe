import { useCallback, useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import Button from '../../components/ui/Button.jsx'
import PayrollSettingsForm from '../../components/payroll/PayrollSettingsForm.jsx'
import PayrollSettingsModal from '../../components/payroll/PayrollSettingsModal.jsx'
import usePayrollSettings from '../../hooks/payroll/usePayrollSettings.js'
import { getApiErrorMessage } from '../../utils/apiErrorMessage.js'

const EMPTY = {
  expected_pay_day: '',
  expected_pay_month_offset: '',
  weekend_policy: '',
  holiday_policy: '',
  payroll_cutoff_day: '',
  effective_from: '',
}

const formatCreatedAt = (value) => {
  if (!value) return '-'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return '-'

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date)
}

function EmbeddedShell({ children }) {
  return <>{children}</>
}

function PayrollSettings({ embedded = false }) {
  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState('')
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState('create')

  const {
    settings,
    pagination,
    loading,
    saving,
    error,
    saveError,
    fetchSettings,
    createSetting,
    clearSaveError,
  } = usePayrollSettings()

  const reload = useCallback(
    () => fetchSettings().catch(() => {}),
    [fetchSettings]
  )

  useEffect(() => {
    reload()
  }, [reload])

  const change = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }))

    setErrors((current) => ({
      ...current,
      [field]: '',
    }))

    setSuccess('')
  }

  const openCreate = () => {
    setMode('create')
    setForm(EMPTY)
    setErrors({})
    setSuccess('')
    clearSaveError()
    setOpen(true)
  }

  const openView = (item) => {
    setMode('view')

    setForm({
      expected_pay_day: String(item.expected_pay_day ?? ''),
      expected_pay_month_offset: String(item.expected_pay_month_offset ?? ''),
      weekend_policy: item.weekend_policy || '',
      holiday_policy: item.holiday_policy || '',
      payroll_cutoff_day: String(item.payroll_cutoff_day ?? ''),
      effective_from: item.effective_from || '',
    })

    setErrors({})
    setSuccess('')
    clearSaveError()
    setOpen(true)
  }

  const close = () => {
    if (saving) return

    setOpen(false)
    setMode('create')
    setForm(EMPTY)
    setErrors({})
    clearSaveError()
  }

  const submit = async (event) => {
    event.preventDefault()

    const next = {}

    Object.keys(EMPTY).forEach((field) => {
      if (!String(form[field]).trim()) {
        next[field] = 'This field is required.'
      }
    })

    if (
      form.effective_from &&
      form.effective_from < new Date().toISOString().slice(0, 10)
    ) {
      next.effective_from = 'Effective From must be today or a future date.'
    }

    if (Object.keys(next).length) {
      setErrors(next)
      return
    }

    try {
      await createSetting({
        expected_pay_day: Number(form.expected_pay_day),
        expected_pay_month_offset: Number(form.expected_pay_month_offset),
        weekend_policy: form.weekend_policy,
        holiday_policy: form.holiday_policy,
        payroll_cutoff_day: Number(form.payroll_cutoff_day),
        effective_from: form.effective_from,
      })

      setOpen(false)
      setForm(EMPTY)
      setErrors({})
      setMode('create')
      setSuccess('Payroll setting created successfully.')

      await reload()
    } catch {
      // Modal remains open
    }
  }

  const PageShell = embedded ? EmbeddedShell : DashboardLayout

  return (
    <PageShell>
      <div className="space-y-6">
        {success && (
          <p className="rounded-[16px] border border-[#bbf7d0] bg-[#f0fdf4] p-4 text-[14px] font-semibold text-[#15803d]">
            {success}
          </p>
        )}

        {loading && (
          <div className="rounded-[24px] bg-white p-10 text-center text-[#6b7280]">
            Loading payroll settings...
          </div>
        )}

        {!loading && error && (
          <div className="rounded-[16px] border border-[#fecaca] bg-[#fef2f2] p-6 text-[14px] font-semibold text-[#b91c1c]">
            {getApiErrorMessage(error, 'Unable to load payroll settings.')}
          </div>
        )}

        {!loading && !error && (
          <SettingsHistory
            settings={settings}
            count={pagination.count}
            onSelect={openView}
            onCreate={openCreate}
          />
        )}

        <PayrollSettingsModal
          isOpen={open}
          saving={saving}
          onClose={close}
        >
          <PayrollSettingsForm
            form={form}
            errors={errors}
            saveError={saveError}
            saving={saving}
            success={success}
            mode={mode}
            onClose={close}
            onChange={change}
            onSubmit={submit}
          />
        </PayrollSettingsModal>
      </div>
    </PageShell>
  )
}

function SettingsHistory({ settings = [], count = 0, onSelect, onCreate }) {
  return (
    <section className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-[20px] font-black text-[#111827]">
          Settings History
        </h2>
        <Button
          type="button"
          onClick={onCreate}
          className="inline-flex items-center justify-center rounded-full bg-[#3b82f6] px-6 py-3 text-[14px] font-extrabold text-white transition-all hover:bg-[#2563eb]"
        >
          Create Settings
        </Button>
      </div>

      {settings.length === 0 ? (
        <div className="py-10 text-center">
          <h3 className="text-[16px] font-bold text-[#111827]">
            No payroll settings found
          </h3>

          <p className="mt-2 text-[14px] text-[#6b7280]">
            Create a payroll setting to see its history here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left text-[14px] text-[#374151]">
            <thead className="border-b border-[#e5e7eb] text-[#6b7280]">
              <tr>
                {[
                  'ID',
                  'Effective From',
                  'Expected Pay Day',
                  'Expected Pay Month',
                  'Payroll Cutoff Day',
                  'Created By',
                  'Created At',
                ].map((heading) => (
                  <th
                    key={heading}
                    className="whitespace-nowrap py-4 pr-6 font-semibold"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {settings.map((item) => (
                <tr
                  key={item.id}
                  tabIndex="0"
                  role="button"
                  onClick={() => onSelect(item)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      onSelect(item)
                    }
                  }}
                  className="cursor-pointer border-b border-[#f3f4f6] transition hover:bg-[#f8fafc] focus:bg-[#f8fafc] focus:outline-none"
                >
                  <td className="py-4 pr-6 font-semibold text-[#111827]">
                    {item.id}
                  </td>

                  <td className="whitespace-nowrap py-4 pr-6">
                    {item.effective_from || '-'}
                  </td>

                  <td className="py-4 pr-6">
                    {item.expected_pay_day ?? '-'}
                  </td>

                  <td className="py-4 pr-6">
                    {Number(item.expected_pay_month_offset) === 1
                      ? 'Next Month'
                      : 'Current Month'}
                  </td>

                  <td className="py-4 pr-6">
                    {item.payroll_cutoff_day ?? '-'}
                  </td>

                  <td className="py-4 pr-6">
                    {item.created_by_name || item.created_by || '-'}
                  </td>

                  <td className="whitespace-nowrap py-4 text-[#6b7280]">
                    {formatCreatedAt(item.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {count > settings.length && (
        <p className="mt-4 text-[13px] text-[#6b7280]">
          Showing {settings.length} of {count} settings.
        </p>
      )}
    </section>
  )
}

export default PayrollSettings
