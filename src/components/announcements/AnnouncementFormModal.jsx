import { useEffect, useRef, useState } from 'react'
import Button from '../ui/Button.jsx'
import FieldError from '../ui/FieldError.jsx'
import DatePicker from '../ui/DatePicker.jsx'
import { getApiErrorMessage } from '../../utils/apiErrorMessage.js'
import { serializeISTDateTime, serializeISTInputDateTime, validateVisibilityWindow } from '../../utils/announcementUtils.js'

function istInput(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(date)
  const values = Object.fromEntries(parts.map(({ type, value: part }) => [type, part]))
  return `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}`
}

function currentISTDate() {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date())
  const values = Object.fromEntries(parts.map(({ type, value }) => [type, value]))
  return `${values.year}-${values.month}-${values.day}`
}

function createDefaults() {
  const date = currentISTDate()
  return { visible_from: `${date}T00:00`, visible_until: `${date}T23:59` }
}

function backendFieldMessages(error) {
  const data = error?.response?.data
  const fields = ['title', 'body', 'visible_from', 'visible_until']
  return Object.fromEntries(fields.map((field) => {
    const value = data?.[field]
    return [field, Array.isArray(value) ? value.join(' ') : typeof value === 'string' ? value : '']
  }))
}

function AnnouncementFormModal({ isOpen, mode = 'create', announcement, saving = false, error, onSubmit, onClose }) {
  const [values, setValues] = useState({ title: '', body: '', ...createDefaults() })
  const [errors, setErrors] = useState({})
  const [clearedBackendFields, setClearedBackendFields] = useState({})
  const initialPayloadRef = useRef(null)
  const firstFieldRef = useRef(null)
  const openerRef = useRef(null)

  useEffect(() => {
    if (!isOpen) return
    const initialValues = announcement
      ? { title: announcement.title || '', body: announcement.body || '', visible_from: istInput(announcement.visible_from), visible_until: istInput(announcement.visible_until) }
      : { title: '', body: '', ...createDefaults() }
    // The modal is reopened for a different record and must reset its draft from props.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValues(initialValues)
    initialPayloadRef.current = announcement ? { title: initialValues.title, body: initialValues.body, visible_from: serializeISTDateTime(announcement.visible_from), visible_until: serializeISTDateTime(announcement.visible_until) } : null
    setErrors({})
    setClearedBackendFields({})
    if (isOpen) {
      openerRef.current = document.activeElement
      window.setTimeout(() => firstFieldRef.current?.focus(), 0)
    }
  }, [announcement, isOpen])

  useEffect(() => () => openerRef.current?.focus?.(), [])

  useEffect(() => {
    if (!isOpen) return undefined
    return () => openerRef.current?.focus?.()
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return undefined
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !saving) onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, saving])

  if (!isOpen) return null

  const update = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined, form: undefined }))
    setClearedBackendFields((current) => ({ ...current, [field]: true }))
  }

  const updateDate = (field, date) => update(field, `${date}${values[field].slice(10) || (field === 'visible_from' ? 'T00:00' : 'T23:59')}`)
  const updateTime = (field, time) => update(field, `${values[field].slice(0, 10) || currentISTDate()}T${time}`)

  const submit = (event) => {
    event.preventDefault()
    const nextErrors = {}
    if (!values.title.trim()) nextErrors.title = 'Title is required.'
    if (!values.visible_from) nextErrors.visible_from = 'Visible from is required.'
    if (!values.visible_until) nextErrors.visible_until = 'Visible until is required.'
    if (values.visible_from && values.visible_until && !validateVisibilityWindow(values.visible_from, values.visible_until)) nextErrors.visible_until = 'Visible until must be later than visible from.'
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      return
    }
    const fullPayload = { title: values.title.trim(), body: values.body.trim(), visible_from: serializeISTInputDateTime(values.visible_from), visible_until: serializeISTInputDateTime(values.visible_until) }
    const payload = mode === 'edit'
      ? Object.fromEntries(Object.entries(fullPayload).filter(([field, value]) => value !== initialPayloadRef.current?.[field]))
      : { title: fullPayload.title, ...(fullPayload.body ? { body: fullPayload.body } : {}), visible_from: fullPayload.visible_from, visible_until: fullPayload.visible_until }
    if (mode === 'edit' && !Object.keys(payload).length) return
    onSubmit(payload)
  }

  const backendErrors = backendFieldMessages(error)
  const generalError = error && !Object.values(backendErrors).some(Boolean) ? getApiErrorMessage(error, 'Unable to save announcement.') : ''
  const fieldError = (field) => errors[field] || (clearedBackendFields[field] ? '' : backendErrors[field])

  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"><form role="dialog" aria-modal="true" aria-labelledby="announcement-form-title" onSubmit={submit} className="w-full max-w-xl rounded-[24px] bg-white p-8 shadow-xl">
    <h2 id="announcement-form-title" className="text-[24px] font-black text-[#091D3E]">{mode === 'edit' ? 'Edit General Announcement' : 'Create General Announcement'}</h2>
    {generalError && <p role="alert" className="mt-3 rounded-xl border border-[#fecaca] bg-[#fef2f2] px-4 py-3 text-sm font-semibold text-[#b91c1c]">{generalError}</p>}
    <div className="mt-6 space-y-4">
      <label className="block text-sm font-bold">Title<input ref={firstFieldRef} aria-label="Title" aria-describedby="title-error" disabled={saving} value={values.title} onChange={(event) => update('title', event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" /></label><FieldError><span id="title-error">{fieldError('title')}</span></FieldError>
      <label className="block text-sm font-bold">Body<textarea aria-label="Body" disabled={saving} value={values.body} onChange={(event) => update('body', event.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" rows="4" /></label>
      <div className="grid gap-4 sm:grid-cols-2"><div><span className="block text-sm font-bold">Visible From</span><div className="mt-2 grid gap-2"><DatePicker value={values.visible_from.slice(0, 10)} onChange={(value) => updateDate('visible_from', value)} disabled={saving} ariaLabel="Visible From date" className="w-full" /><input aria-label="Visible From time" aria-describedby="visible-from-error" type="time" disabled={saving} value={values.visible_from.slice(11, 16)} onChange={(event) => updateTime('visible_from', event.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3" /></div><FieldError><span id="visible-from-error">{fieldError('visible_from')}</span></FieldError></div><div><span className="block text-sm font-bold">Visible Until</span><div className="mt-2 grid gap-2"><DatePicker value={values.visible_until.slice(0, 10)} onChange={(value) => updateDate('visible_until', value)} disabled={saving} ariaLabel="Visible Until date" className="w-full" /><input aria-label="Visible Until time" aria-describedby="visible-until-error" type="time" disabled={saving} value={values.visible_until.slice(11, 16)} onChange={(event) => updateTime('visible_until', event.target.value)} className="w-full rounded-xl border border-slate-300 px-4 py-3" /></div><FieldError><span id="visible-until-error">{fieldError('visible_until')}</span></FieldError></div></div>
    </div>
    <div className="mt-7 flex justify-end gap-3"><Button type="button" onClick={onClose} disabled={saving} className="rounded-full border px-5 py-2">Cancel</Button><Button type="submit" disabled={saving} className="rounded-full bg-[#04A3DA] px-5 py-2 font-bold text-white">{saving ? 'Saving...' : mode === 'edit' ? 'Update' : 'Create'}</Button></div>
  </form></div>
}

export default AnnouncementFormModal
