
export default function PendingPreviousSalaryInput({ value, onChange, error }) {
  const errorMessage = error?.message || error || ''

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-4">
      <label
        htmlFor="pending-previous-salary"
        className="mb-2 block text-sm font-semibold text-gray-700"
      >
        Pending Previous Salary (₹)
      </label>

      <input
        id="pending-previous-salary"
        type="number"
        min="0"
        step="0.01"
        value={value}
        onChange={onChange}
        placeholder="Enter pending previous salary"
        className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500"
        aria-invalid={Boolean(errorMessage)}
        aria-describedby={
          errorMessage ? 'pending-salary-error' : undefined
        }
      />

      {errorMessage && (
        <p
          id="pending-salary-error"
          role="alert"
          className="mt-2 text-sm font-medium text-red-600"
        >
          {errorMessage}
        </p>
      )}
    </section>
  )
}
