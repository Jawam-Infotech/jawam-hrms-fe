const SkeletonField = () => (
  <div>
    <div className="mb-2 h-4 w-24 animate-pulse rounded bg-gray-200"></div>
    <div className="h-11 animate-pulse rounded-lg bg-gray-100"></div>
  </div>
)

const SkeletonSection = () => (
  <div className="rounded-xl border border-gray-200 bg-white p-6">
    <div className="mb-6 h-6 w-56 animate-pulse rounded bg-gray-200"></div>

    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {Array.from({ length: 6 }).map((_, index) => (
        <SkeletonField key={index} />
      ))}
    </div>
  </div>
)

function EmployeeFormSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-4 h-8 w-60 animate-pulse rounded bg-gray-200"></div>
        <div className="h-4 w-96 animate-pulse rounded bg-gray-100"></div>
      </div>

      <SkeletonSection />
      <SkeletonSection />
      <SkeletonSection />
      <SkeletonSection />
      <SkeletonSection />

      {/* Footer Buttons */}
      <div className="flex justify-end gap-4">
        <div className="h-11 w-32 animate-pulse rounded-lg bg-gray-200"></div>
        <div className="h-11 w-40 animate-pulse rounded-lg bg-gray-300"></div>
      </div>
    </div>
  )
}

export default EmployeeFormSkeleton
