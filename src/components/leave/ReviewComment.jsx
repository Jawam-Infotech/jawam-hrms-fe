function ReviewComment({
  value = '',
  onChange,
  required = false,
  error = '',
  disabled = false,
}) {
  const errorId = 'leave-review-comment-error'

  const handleChange = (event) => {
    onChange?.(event.target.value)
  }

  return (
    <div>
      <label
        htmlFor="leave-review-comment"
        className="mb-2 block text-[13px] font-semibold text-[#374151]"
      >
        Review Comment{' '}

        {required ? (
          <span
            className="text-[#dc2626]"
            aria-hidden="true"
          >
            *
          </span>
        ) : (
          <span className="font-normal text-[#6b7280]">
            (optional)
          </span>
        )}
      </label>

      <textarea
        id="leave-review-comment"
        rows={3}
        value={value}
        disabled={disabled}
        required={required}
        aria-required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? errorId : undefined
        }
        onChange={handleChange}
        placeholder="Add a comment for this leave request..."
        className="w-full resize-none rounded-xl border border-[#d1d5db] px-3 py-2.5 text-[14px] text-[#111827] outline-none transition focus:border-[#2563eb] focus:ring-2 focus:ring-[#dbeafe] disabled:cursor-not-allowed disabled:bg-[#f9fafb]"
      />

      {error && (
        <p
          id={errorId}
          role="alert"
          className="mt-2 text-[13px] font-medium text-[#dc2626]"
        >
          {error}
        </p>
      )}
    </div>
  )
}

export default ReviewComment