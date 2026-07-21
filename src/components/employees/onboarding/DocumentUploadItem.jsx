import Button from '../../ui/Button.jsx'

function DocumentUploadItem({ label, status, hasFile, onUpload, onPreview }) {
  return (
    <div className="flex flex-col gap-3 border-b border-[#e5e5e5] pb-3 last:border-0 last:pb-0 md:flex-row md:items-center md:justify-between">
      <p className="text-[14px] font-semibold text-[#111827]">{label}</p>
      <div className="flex items-center gap-3">
        <label className="cursor-pointer rounded-full bg-white px-4 py-2 text-[14px] font-extrabold text-[#111827] shadow-sm transition-all duration-200 hover:bg-[#f8fafc]">
          {status}
          <input
            type="file"
            className="sr-only"
            onChange={(event) => onUpload(event.target.files?.[0] || null)}
          />
        </label>
        <Button
          type="button"
          onClick={onPreview}
          disabled={!hasFile}
          className="rounded-full bg-white px-4 py-2 text-[14px] font-extrabold text-[#111827] shadow-sm transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60"
        >
          Preview
        </Button>
      </div>
    </div>
  )
}

export default DocumentUploadItem
