import { ChevronDown } from 'lucide-react'

const durationOptions = [
  'Full Day',
  'First Half',
  'Second Half',
]

function getTodayDate() {
  const today = new Date()

  const year = today.getFullYear()

  const month = String(
    today.getMonth() + 1,
  ).padStart(2, '0')

  const day = String(
    today.getDate(),
  ).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function LeaveApplicationForm({
  leaveTypes,
  leaveTypesLoading,
  leaveTypesError,
  formState,
  onFieldChange,
  onSubmit,
  onCancel,

  /*
   * Validation and calculated
   * leave information from
   * useLeaveApplication.
   */
  validationErrors = {},
  requestedDays = 0,

  loading = false,
  error = '',
}) {
  const getFieldError = (field) =>
    validationErrors?.[field] || ''

  const hasFieldError = (field) =>
    Boolean(getFieldError(field))

  const inputErrorClass = (field) =>
    hasFieldError(field)
      ? 'border-[#ef4444] focus:border-[#ef4444] focus:ring-[#fecaca]/50'
      : 'border-[#d1d5db] focus:border-[#3b82f6] focus:ring-[#bfdbfe]/50'

      const today = getTodayDate()
  return (
    <div className="rounded-[30px] border border-[#e5e7eb] bg-white p-8 shadow-sm">

      {/* =========================
          HEADER
      ========================== */}

      <div>
        <h2 className="text-[22px] font-black text-[#111827]">
          Apply Leave
        </h2>

        <p className="mt-1 text-[14px] text-[#6b7280]">
          Submit a leave request for approval.
        </p>
      </div>


      {/* =========================
          FORM
      ========================== */}

      <div className="mt-6 grid gap-6 xl:grid-cols-2">

        {/* =========================
            LEAVE TYPE
        ========================== */}

        <div className="space-y-2">

          <label
            htmlFor="leave-type"
            className="block text-[14px] font-semibold text-[#111827]"
          >
            Leave Type
          </label>

          <div className="relative">

            <select
              id="leave-type"
              value={formState.leaveType}
              onChange={(event) =>
                onFieldChange(
                  'leaveType',
                  event.target.value,
                )
              }
              disabled={
                leaveTypesLoading ||
                loading
              }
              aria-invalid={
                hasFieldError('leaveType')
              }
              aria-describedby={
                hasFieldError('leaveType')
                  ? 'leave-type-error'
                  : undefined
              }
              className={`h-12 w-full appearance-none rounded-[18px] bg-[#f8fafc] px-4 pr-12 text-[14px] text-[#111827] outline-none transition-all duration-200 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${inputErrorClass(
                'leaveType',
              )}`}
            >

              <option value="">
                {leaveTypesLoading
                  ? 'Loading leave types...'
                  : leaveTypes.length === 0
                    ? 'No leave types available'
                    : 'Select leave type'}
              </option>

              {!leaveTypesLoading &&
                leaveTypes.map((type) => (
                  <option
                    key={type.id}
                    value={type.code}
                  >
                    {type.name} ({type.code})
                  </option>
                ))}

            </select>

            <ChevronDown
              size={18}
              strokeWidth={2}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#111827]"
            />

          </div>

          {hasFieldError('leaveType') && (
            <p
              id="leave-type-error"
              className="text-[13px] font-medium text-[#dc2626]"
            >
              {getFieldError('leaveType')}
            </p>
          )}

          {leaveTypesError && (
            <p className="text-[13px] font-medium text-[#dc2626]">
              {leaveTypesError}
            </p>
          )}

        </div>


        {/* =========================
            START DATE
        ========================== */}

        <div className="space-y-2">

          <label
            htmlFor="leave-start-date"
            className="block text-[14px] font-semibold text-[#111827]"
          >
            Start Date
          </label>

          <input
  id="leave-start-date"
  type="date"
  value={formState.startDate}
  min={today}
  onChange={(event) =>
    onFieldChange(
      'startDate',
      event.target.value,
    )
  }
  disabled={loading}
            aria-invalid={
              hasFieldError('startDate')
            }
            aria-describedby={
              hasFieldError('startDate')
                ? 'leave-start-date-error'
                : undefined
            }
            className={`h-12 w-full rounded-[18px] bg-white px-4 pr-12 text-[14px] text-[#111827] outline-none transition-all duration-200 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${inputErrorClass(
              'startDate',
            )}`}
          />

          {hasFieldError('startDate') && (
            <p
              id="leave-start-date-error"
              className="text-[13px] font-medium text-[#dc2626]"
            >
              {getFieldError('startDate')}
            </p>
          )}

        </div>


        {/* =========================
            END DATE
        ========================== */}

        <div className="space-y-2">

          <label
            htmlFor="leave-end-date"
            className="block text-[14px] font-semibold text-[#111827]"
          >
            End Date
          </label>

          <input
  id="leave-end-date"
  type="date"
  value={formState.endDate}
  min={
    formState.startDate ||
    undefined
  }
  onChange={(event) =>
    onFieldChange(
      'endDate',
      event.target.value,
    )
  }
  disabled={
    loading ||
    !formState.startDate
  }
  aria-invalid={
    hasFieldError('endDate')
  }
  aria-describedby={
    hasFieldError('endDate')
      ? 'leave-end-date-error'
      : undefined
  }
  className={`h-12 w-full rounded-[18px] bg-white px-4 pr-12 text-[14px] text-[#111827] outline-none transition-all duration-200 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${inputErrorClass(
    'endDate',
  )}`}
/>

{!formState.startDate && (
  <p className="text-[13px] font-medium text-[#6b7280]">
    Please select a start date first.
  </p>
)}

          {hasFieldError('endDate') && (
            <p
              id="leave-end-date-error"
              className="text-[13px] font-medium text-[#dc2626]"
            >
              {getFieldError('endDate')}
            </p>
          )}

        </div>


        {/* =========================
            DURATION
        ========================== */}

        <div className="space-y-2">

          <label
            htmlFor="leave-duration"
            className="block text-[14px] font-semibold text-[#111827]"
          >
            Duration
          </label>

          <div className="relative">

            <select
              id="leave-duration"
              value={formState.duration}
              onChange={(event) =>
                onFieldChange(
                  'duration',
                  event.target.value,
                )
              }
              disabled={loading}
              aria-invalid={
                hasFieldError('duration')
              }
              className={`h-12 w-full appearance-none rounded-[18px] bg-[#f8fafc] px-4 pr-12 text-[14px] text-[#111827] outline-none transition-all duration-200 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${inputErrorClass(
                'duration',
              )}`}
            >

              {durationOptions.map(
                (duration) => (
                  <option
                    key={duration}
                    value={duration}
                  >
                    {duration}
                  </option>
                ),
              )}

            </select>

            <ChevronDown
              size={18}
              strokeWidth={2}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#111827]"
            />

          </div>

          {hasFieldError('duration') && (
            <p className="text-[13px] font-medium text-[#dc2626]">
              {getFieldError('duration')}
            </p>
          )}

        </div>


        {/* =========================
            REQUESTED DAYS
        ========================== */}

        {requestedDays > 0 && (
          <div className="flex items-end">

            <div className="w-full rounded-[18px] border border-[#dbeafe] bg-[#eff6ff] px-5 py-3">

              <p className="text-[12px] font-semibold text-[#64748b]">
                Requested Duration
              </p>

              <p className="mt-1 text-[18px] font-black text-[#2563eb]">
                {requestedDays}{' '}
                {requestedDays === 1
                  ? 'day'
                  : 'days'}
              </p>

            </div>

          </div>
        )}


        {/* =========================
            REASON
        ========================== */}

        <div className="space-y-2 xl:col-span-2">

          <label
            htmlFor="leave-reason"
            className="block text-[14px] font-semibold text-[#111827]"
          >
            Reason
          </label>

          <textarea
            id="leave-reason"
            value={formState.reason}
            onChange={(event) =>
              onFieldChange(
                'reason',
                event.target.value,
              )
            }
            rows={3}
            placeholder="Type your reason here..."
            disabled={loading}
            aria-invalid={
              hasFieldError('reason')
            }
            aria-describedby={
              hasFieldError('reason')
                ? 'leave-reason-error'
                : undefined
            }
            className={`w-full rounded-[18px] bg-[#f8fafc] px-4 py-3 text-[14px] text-[#111827] outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60 ${inputErrorClass(
              'reason',
            )}`}
          />

          {hasFieldError('reason') && (
            <p
              id="leave-reason-error"
              className="text-[13px] font-medium text-[#dc2626]"
            >
              {getFieldError('reason')}
            </p>
          )}

        </div>


    

      </div>


      {/* =========================
          GLOBAL APPLY ERROR
      ========================== */}

      {error && (
        <div
          role="alert"
          className="mt-5 rounded-[14px] border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-[14px] font-semibold text-[#b91c1c]"
        >
          {error}
        </div>
      )}


      {/* =========================
          ACTIONS
      ========================== */}

      <div className="mt-6 flex flex-wrap gap-3">

        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="rounded-full border border-[#fca5a5] bg-white px-7 py-3 text-[14px] font-bold text-[#ef4444] transition-all hover:bg-[#fef2f2] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={
            loading ||
            leaveTypesLoading ||
            leaveTypes.length === 0
          }
          className="rounded-full bg-[#10b981] px-7 py-3 text-[14px] font-bold text-white transition-all hover:bg-[#059669] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? 'Applying...'
            : 'Apply leave'}
        </button>

      </div>

    </div>
  )
}

export default LeaveApplicationForm