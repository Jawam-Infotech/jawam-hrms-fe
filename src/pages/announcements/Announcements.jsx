import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import AnnouncementFormModal from '../../components/announcements/AnnouncementFormModal.jsx'
import ConfirmationModal from '../../components/shared/ConfirmationModal.jsx'
import Button from '../../components/ui/Button.jsx'
import Pagination from '../../components/ui/Pagination.jsx'
import useAnnouncements from '../../hooks/useAnnouncements.js'
import useAnnouncementManagement from '../../hooks/useAnnouncementManagement.js'

function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false })
}

function Announcements() {
  const navigate = useNavigate()
  const announcementState = useAnnouncements()
  const management = useAnnouncementManagement({ announcementState })
  const [form, setForm] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [success, setSuccess] = useState('')

  const openCreate = () => { setSuccess(''); setForm({ mode: 'create', announcement: null }) }
  const openEdit = (announcement) => { setSuccess(''); setForm({ mode: 'edit', announcement }) }
  const openDelete = (announcement) => { setSuccess(''); setDeleteTarget(announcement) }

  const save = async (payload) => {
    try {
      setSuccess('')
      if (form.mode === 'edit') await management.updateAnnouncement(form.announcement, payload)
      else await management.createAnnouncement(payload)
      setForm(null)
      setSuccess(form.mode === 'edit' ? 'Announcement updated.' : 'Announcement created.')
    } catch {
      // The form displays management.mutationError.
    }
  }

  const remove = async () => {
    try {
      setSuccess('')
      await management.deleteAnnouncement(deleteTarget)
      setDeleteTarget(null)
      setSuccess('Announcement deleted.')
    } catch {
      // Keep the confirmation open and display the management error.
    }
  }

  const generalAnnouncements = announcementState.announcements.filter((item) => item.type === 'GENERAL')
  const pageSize = announcementState.pageSize || 20
  const totalPages = Math.max(1, Math.ceil((announcementState.count || 0) / pageSize))

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-[32px] font-black text-[#111827]">General Announcement</h1>
            <p className="mt-2 text-[16px] text-[#5f6679]">Manage General announcements for your organization.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" onClick={openCreate} className="rounded-full bg-[#3b82f6] px-6 py-3 text-[14px] font-extrabold text-white hover:bg-[#2563eb]">Create Announcement</Button>
            <Button type="button" onClick={() => navigate(-1)} className="rounded-full border px-6 py-3 text-[14px] font-extrabold">Back</Button>
          </div>
        </div>

        {success && <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800">{success}</p>}
        {management.syncError && <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">The announcement changed, but the feed could not be refreshed.</p>}
        {management.mutationError && !form && <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-800">Unable to complete the announcement action.</p>}

        <section className="rounded-[20px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
          {announcementState.isLoading && <p className="text-[13px] text-[#6b7280]">Loading announcements...</p>}
          {!announcementState.isLoading && announcementState.error && <div className="space-y-2"><p className="text-[13px] font-semibold text-[#b91c1c]">Unable to load announcements.</p><button type="button" onClick={announcementState.refreshAnnouncements} className="text-[13px] font-bold text-[#0369a1] hover:underline">Retry</button></div>}
          {!announcementState.isLoading && !announcementState.error && !generalAnnouncements.length && <p className="text-[13px] text-[#6b7280]">No General announcements available.</p>}
          {!announcementState.isLoading && !announcementState.error && generalAnnouncements.length > 0 && <div className="divide-y divide-[#f1f5f9]">{generalAnnouncements.map((item) => <article key={item.id} className="py-5 first:pt-0 last:pb-0"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div className="min-w-0"><h2 className="break-words text-[18px] font-extrabold text-[#111827]">{item.title || 'Announcement'}</h2>{item.body && <p className="mt-2 whitespace-pre-wrap break-words text-[14px] leading-6 text-[#5f6679]">{item.body}</p>}<div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12px] font-semibold text-[#64748b]"><span>Visible from: {formatDate(item.visible_from) || '—'}</span><span>Visible until: {formatDate(item.visible_until) || '—'}</span></div></div><div className="flex shrink-0 gap-2"><Button type="button" disabled={management.updatingAnnouncementIds.includes(item.id)} onClick={() => openEdit(item)} className="rounded-full border px-3 py-1 text-xs">Edit</Button><Button type="button" disabled={management.deletingAnnouncementIds.includes(item.id)} onClick={() => openDelete(item)} className="rounded-full bg-red-50 px-3 py-1 text-xs font-bold text-red-700">Delete</Button></div></div></article>)}</div>}
          {!announcementState.isLoading && !announcementState.error && <Pagination currentPage={announcementState.currentPage} totalPages={totalPages} totalCount={announcementState.count || 0} pageSize={pageSize} hasPrevious={Boolean(announcementState.previous)} hasNext={Boolean(announcementState.next)} onPrevious={announcementState.previousPage} onNext={announcementState.nextPage} onPageChange={announcementState.goToPage} itemLabel="announcements" />}
        </section>
      </div>
      <AnnouncementFormModal isOpen={Boolean(form)} mode={form?.mode} announcement={form?.announcement} saving={management.isCreating || Boolean(form?.announcement && management.updatingAnnouncementIds.includes(form.announcement.id))} error={management.mutationError} onSubmit={save} onClose={() => setForm(null)} />
      <ConfirmationModal isOpen={Boolean(deleteTarget)} title="Delete announcement" message={`Delete “${deleteTarget?.title || 'this announcement'}”? This action cannot be undone.`} confirmText="Delete" loading={Boolean(deleteTarget && management.deletingAnnouncementIds.includes(deleteTarget.id))} loadingText="Deleting..." onCancel={() => setDeleteTarget(null)} onConfirm={remove} />
    </DashboardLayout>
  )
}

export default Announcements
