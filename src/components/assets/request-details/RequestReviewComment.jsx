function RequestReviewComment({
  value,
  onChange,
  required = false,
  error = '',
}) {
  return (
    <div className="mt-6 space-y-2 border-t border-[#e5e7eb] pt-5">
      <div>
        <label className="text-[12px] font-extrabold uppercase tracking-wide text-[#6b7280]">
          Review Comment
          {required && (
            <span className="ml-1 text-[#dc2626]">*</span>
          )}
        </label>

        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={4}
          placeholder="Enter your review comment..."
          className="mt-2 w-full rounded-xl border border-[#d1d5db] px-4 py-3 text-[13px] font-medium text-[#111827] outline-none transition placeholder:text-[#9ca3af] focus:border-[#2563eb] focus:ring-2 focus:ring-[#dbeafe]"
        />

        {error && (
          <p
            role="alert"
            className="mt-1 text-[13px] font-medium text-[#dc2626]"
          >
            {error}
          </p>
        )}
      </div>
    </div>
  )
}

export default RequestReviewComment