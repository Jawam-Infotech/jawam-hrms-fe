import { Plus, Trash2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  createCorrectionRequest,
  getAttendanceById,
  getMyAttendance,
} from '../../services/attendanceService.js'

const createInitialForm = (date = '') => ({
  date,
  checkIn: '',
  checkOut: '',
  breaks: [],
  reason: '',
})

const formatTimeForInput = (value) => {
  if (!value) return ''

  const indiaTimeMatch = String(value).match(
    /T(\d{2}):(\d{2})(?::\d{2}(?:\.\d+)?)?\+05:30$/,
  )

  if (indiaTimeMatch) return `${indiaTimeMatch[1]}:${indiaTimeMatch[2]}`

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date)

  const hour = parts.find((part) => part.type === 'hour')?.value
  const minute = parts.find((part) => part.type === 'minute')?.value
  return hour && minute ? `${hour}:${minute}` : ''
}

const formatTime = (value) => {
  const time = formatTimeForInput(value)
  if (!time) return '--'

  const [hour, minute] = time.split(':').map(Number)
  const suffix = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  return `${displayHour}:${String(minute).padStart(2, '0')} ${suffix}`
}

const formatDateTimeForApi = (date, time) =>
  date && time ? `${date}T${time}:00+05:30` : null

const getDateValue = (value) => String(value || '').slice(0, 10)

function getAttendanceValues(attendance, fallbackDate) {
  const breakSessions = attendance?.break_sessions || attendance?.breakSessions || []
  const date = getDateValue(attendance?.rawDate || attendance?.date) || fallbackDate

  return {
    date,
    checkIn: attendance?.check_in || attendance?.rawCheckIn || attendance?.checkIn || '',
    checkOut: attendance?.check_out || attendance?.rawCheckOut || attendance?.checkOut || '',
    breaks: Array.isArray(breakSessions)
      ? breakSessions.map((breakSession, index) => ({
          id: breakSession.id || breakSession.break_id || `existing-break-${index}`,
          start: breakSession.break_start || breakSession.breakStart || '',
          end: breakSession.break_end || breakSession.breakEnd || '',
        }))
      : [],
  }
}

function CorrectionRequestModal({
  isOpen,
  onClose,
  attendanceId,
  initialDate = '',
  onSubmitSuccess,
}) {
  const [formState, setFormState] = useState(() => createInitialForm(initialDate))
  const [originalAttendance, setOriginalAttendance] = useState(null)
  const [loadingAttendance, setLoadingAttendance] = useState(false)
  const [attendanceMessage, setAttendanceMessage] = useState('')
  const [reasonError, setReasonError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    let cancelled = false

    const populateAttendance = (attendance, selectedDate) => {
      const values = getAttendanceValues(attendance, selectedDate)
      const requestedBreaks = values.breaks.map((breakSession) => ({
        ...breakSession,
        start: formatTimeForInput(breakSession.start),
        end: formatTimeForInput(breakSession.end),
      }))

      if (!cancelled) {
        setOriginalAttendance(values)
        setFormState({
          date: values.date,
          checkIn: formatTimeForInput(values.checkIn),
          checkOut: formatTimeForInput(values.checkOut),
          breaks: requestedBreaks,
          reason: '',
        })
        setAttendanceMessage('')
        setReasonError('')
      }
    }

    const loadAttendance = async () => {
      const selectedDate = attendanceId ? '' : formState.date
      if (!attendanceId && !selectedDate) return

      setLoadingAttendance(true)
      setAttendanceMessage('')

      try {
        if (attendanceId) {
          const data = await getAttendanceById(attendanceId)
          populateAttendance(data?.attendance ?? data, '')
          return
        }

        const result = await getMyAttendance({
          startDate: selectedDate,
          endDate: selectedDate,
        })
        const attendance = result?.records?.find(
          (record) => getDateValue(record.rawDate) === selectedDate,
        )

        if (!attendance) {
          if (!cancelled) {
            setOriginalAttendance(null)
            setFormState((current) => createInitialForm(current.date))
            setAttendanceMessage('No attendance record exists for this date. A correction request cannot be submitted.')
          }
          return
        }

        populateAttendance(attendance, selectedDate)
      } catch (error) {
        if (!cancelled) {
          setOriginalAttendance(null)
          setAttendanceMessage(
            error.response?.data?.detail ||
              'Unable to load attendance for this date. Please try again.',
          )
        }
      } finally {
        if (!cancelled) setLoadingAttendance(false)
      }
    }

    void loadAttendance()
    return () => { cancelled = true }
  }, [attendanceId, formState.date, isOpen])

  if (!isOpen) return null

  const updateFormField = (field, value) => {
    setFormState((current) => ({ ...current, [field]: value }))
  }

  const updateBreak = (id, field, value) => {
    setFormState((current) => ({
      ...current,
      breaks: current.breaks.map((item) => item.id === id ? { ...item, [field]: value } : item),
    }))
  }

  const addBreak = () => {
    setFormState((current) => ({
      ...current,
      breaks: [...current.breaks, { id: `temp-${Date.now()}`, start: '', end: '' }],
    }))
  }

  const removeBreak = (id) => {
    setFormState((current) => ({
      ...current,
      breaks: current.breaks.map((item) => {
        if (item.id !== id) return item
        return String(id).startsWith('temp-') ? null : { ...item, deleted: true }
      }).filter(Boolean),
    }))
  }

  const handleDateChange = (date) => {
    setOriginalAttendance(null)
    setAttendanceMessage('')
    setFormState(createInitialForm(date))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!originalAttendance) {
      setAttendanceMessage('An attendance record is required before submitting a correction request.')
      return
    }

    if (!formState.reason.trim()) {
      setReasonError('Please provide a reason for this correction.')
      return
    }

    try {
      setSubmitting(true)
      setReasonError('')
      await createCorrectionRequest({
        date: formState.date,
        proposed_check_in: formatDateTimeForApi(formState.date, formState.checkIn),
        proposed_check_out: formatDateTimeForApi(formState.date, formState.checkOut),
        breaks: formState.breaks.map((item) => item.deleted
          ? { id: item.id, delete: true }
          : {
              ...(String(item.id).startsWith('temp-') ? {} : { id: item.id }),
              break_start: formatDateTimeForApi(formState.date, item.start),
              break_end: formatDateTimeForApi(formState.date, item.end),
            }),
        reason: formState.reason.trim(),
      })
      onSubmitSuccess?.(formState.date)
    } catch (error) {
      setReasonError(
        error.response?.data?.detail ||
          error.response?.data?.message ||
          'Failed to submit correction request.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  const originalBreaks = originalAttendance?.breaks || []
  const visibleRequestedBreaks = formState.breaks.filter((item) => !item.deleted)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-labelledby="attendance-correction-title">
      <form onSubmit={handleSubmit} className="max-h-[calc(100vh-2rem)] w-full max-w-3xl overflow-y-auto rounded-[24px] bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#e5e7eb] px-6 py-5">
          <div><h2 id="attendance-correction-title" className="text-[22px] font-black text-[#111827]">Attendance Correction</h2><p className="mt-1 text-[14px] text-[#6b7280]">Update requested values for HR review.</p></div>
          <button type="button" onClick={onClose} disabled={submitting} aria-label="Close correction form" className="rounded-full p-1 text-[#6b7280] transition hover:bg-[#f3f4f6]"><X size={24} /></button>
        </div>

        <div className="space-y-6 p-6">
          <div>
            <label className="mb-2 block text-[13px] font-bold uppercase tracking-wider text-[#6b7280]">Date</label>
            {attendanceId ? <div className="rounded-xl border border-[#d1d5db] bg-[#f9fafb] px-4 py-3 text-[15px] font-bold text-[#111827]">{formState.date || 'Loading date...'}</div> : <input type="date" value={formState.date} onChange={(event) => handleDateChange(event.target.value)} disabled={submitting} className="min-h-11 w-full rounded-xl border border-[#d1d5db] bg-white px-3 py-2 text-[15px] font-semibold text-[#111827] outline-none focus:border-[#2563eb]" />}
          </div>

          {loadingAttendance && <p className="text-[14px] font-semibold text-[#6b7280]">Loading attendance record...</p>}
          {attendanceMessage && <p className="rounded-xl border border-[#fde68a] bg-[#fffbeb] px-4 py-3 text-[14px] font-semibold text-[#92400e]">{attendanceMessage}</p>}

          {originalAttendance && <>
            <section className="overflow-hidden rounded-[20px] border border-[#e5e7eb]">
              <div className="grid grid-cols-[1fr_1fr] border-b border-[#e5e7eb] bg-[#f9fafb]"><div className="px-4 py-3 text-[12px] font-extrabold uppercase tracking-wider text-[#6b7280]">Original</div><div className="border-l border-[#e5e7eb] px-4 py-3 text-[12px] font-extrabold uppercase tracking-wider text-[#2563eb]">Requested</div></div>
              <ComparisonTimeRow label="Check In" original={formatTime(originalAttendance.checkIn)} value={formState.checkIn} onChange={(value) => updateFormField('checkIn', value)} />
              <ComparisonTimeRow label="Check Out" original={formatTime(originalAttendance.checkOut)} value={formState.checkOut} onChange={(value) => updateFormField('checkOut', value)} />
            </section>

            <section className="rounded-[20px] border border-[#e5e7eb] bg-white p-5">
              <div className="mb-4 flex items-center justify-between gap-3"><h3 className="text-[16px] font-black text-[#111827]">Breaks</h3><button type="button" onClick={addBreak} disabled={submitting} className="inline-flex items-center gap-1.5 rounded-full border border-[#bfdbfe] bg-[#eff6ff] px-3 py-2 text-[13px] font-bold text-[#2563eb]"><Plus size={16} /> Add missing break</button></div>
              {Math.max(originalBreaks.length, visibleRequestedBreaks.length) === 0 ? <p className="text-[14px] text-[#6b7280]">No original breaks recorded.</p> : <div className="space-y-3">{Array.from({ length: Math.max(originalBreaks.length, visibleRequestedBreaks.length) }, (_, index) => { const original = originalBreaks[index]; const requested = visibleRequestedBreaks[index]; return <div key={requested?.id || `original-${index}`} className="grid grid-cols-2 gap-4 rounded-xl border border-[#e5e7eb] p-4 max-[560px]:grid-cols-1"><div><p className="mb-2 text-[12px] font-extrabold uppercase tracking-wide text-[#6b7280]">Original break {index + 1}</p><p className="text-[14px] font-semibold text-[#374151]">{original ? `${formatTime(original.start)} → ${formatTime(original.end)}` : '--'}</p></div><div>{requested ? <><p className="mb-2 text-[12px] font-extrabold uppercase tracking-wide text-[#2563eb]">Requested break {index + 1}</p><div className="flex items-end gap-2"><TimeInput value={requested.start} onChange={(value) => updateBreak(requested.id, 'start', value)} /><TimeInput value={requested.end} onChange={(value) => updateBreak(requested.id, 'end', value)} /><button type="button" onClick={() => removeBreak(requested.id)} className="mb-0.5 rounded-lg p-2 text-[#dc2626] hover:bg-[#fef2f2]" aria-label="Remove break"><Trash2 size={16} /></button></div></> : <p className="text-[14px] text-[#6b7280]">--</p>}</div></div> })}</div>}
            </section>
          </>}

          <div><label htmlFor="correction-reason" className="mb-2 block text-[13px] font-semibold text-[#4b5563]">Reason <span className="text-red-500">*</span></label><textarea id="correction-reason" rows={4} value={formState.reason} onChange={(event) => { updateFormField('reason', event.target.value); setReasonError('') }} disabled={submitting || !originalAttendance} placeholder="Explain why you're requesting this correction..." className="w-full resize-none rounded-xl border border-[#d1d5db] px-4 py-3 text-[15px] outline-none focus:border-[#2563eb]" />{reasonError && <p className="mt-2 text-[13px] font-medium text-[#dc2626]">{reasonError}</p>}</div>
        </div>

        <div className="flex flex-wrap justify-end gap-3 border-t border-[#e5e7eb] px-6 py-5"><button type="button" onClick={onClose} disabled={submitting} className="rounded-full px-5 py-2.5 text-[14px] font-bold text-[#4b5563] hover:bg-[#f3f4f6]">Cancel</button><button type="submit" disabled={submitting || loadingAttendance || !originalAttendance} className="rounded-full bg-[#2563eb] px-5 py-2.5 text-[14px] font-bold text-white disabled:cursor-not-allowed disabled:opacity-50">{submitting ? 'Submitting...' : 'Submit Request'}</button></div>
      </form>
    </div>
  )
}

function ComparisonTimeRow({ label, original, value, onChange }) {
  return <div className="grid grid-cols-[1fr_1fr] border-b border-[#e5e7eb] last:border-b-0"><div className="px-4 py-4"><p className="text-[13px] font-bold text-[#111827]">{label}</p><p className="mt-1 text-[14px] font-semibold text-[#4b5563]">{original}</p></div><div className="border-l border-[#e5e7eb] bg-[#eff6ff] px-4 py-4"><p className="mb-2 text-[13px] font-bold text-[#2563eb]">{label}</p><TimeInput value={value} onChange={onChange} /></div></div>
}

function TimeInput({ value, onChange }) {
  return <input type="time" value={value || ''} onChange={(event) => onChange(event.target.value)} className="min-h-10 rounded-lg border border-[#bfdbfe] bg-white px-2.5 text-[14px] font-semibold text-[#111827] outline-none focus:border-[#2563eb]" />
}

export default CorrectionRequestModal
