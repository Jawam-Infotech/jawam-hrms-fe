function EmployeeProfileSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Back Button */}
      <div className="h-5 w-32 rounded bg-gray-200" />

      {/* Header */}
      <div className="flex items-start justify-between rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-full bg-gray-200" />
          <div className="space-y-3">
            <div className="h-6 w-48 rounded bg-gray-200" />
            <div className="h-4 w-32 rounded bg-gray-200" />
            <div className="h-4 w-40 rounded bg-gray-200" />
          </div>
        </div>

        <div className="flex gap-3">
          <div className="h-10 w-32 rounded-lg bg-gray-200" />
          <div className="h-10 w-32 rounded-lg bg-gray-200" />
        </div>
      </div>

      {/* Other Information */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <div className="mb-6 h-5 w-48 rounded bg-gray-200" />

        <div className="grid grid-cols-2 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="space-y-2">
              <div className="h-3 w-24 rounded bg-gray-200" />
              <div className="h-5 w-40 rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="h-36 rounded-2xl border border-gray-200 bg-white"
          />
        ))}
      </div>
    </div>
  )
}

export default EmployeeProfileSkeleton