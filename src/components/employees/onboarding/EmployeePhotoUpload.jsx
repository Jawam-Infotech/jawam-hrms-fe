function EmployeePhotoUpload({ previewUrl, name, onChange }) {
  const initials = name
    ? name
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U'

  return (
    <div className="flex items-center gap-4">
      <div className="flex size-[120px] items-center justify-center overflow-hidden rounded-full bg-[#dbe7ef] text-[36px] font-black text-[#3a7be0]">
        {previewUrl ? (
          <img src={previewUrl} alt={name || 'Employee preview'} className="size-full object-cover" />
        ) : (
          initials
        )}
      </div>
      <label className="cursor-pointer rounded-full border border-[#e5e7eb] bg-white px-4 py-2 text-[14px] font-extrabold text-[#111827] transition-all duration-200 hover:bg-[#f8fafc]" htmlFor="employee-photo">
        Upload Photo
        <input
          id="employee-photo"
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => onChange(event.target.files?.[0] || null)}
        />
      </label>
    </div>
  )
}

export default EmployeePhotoUpload
