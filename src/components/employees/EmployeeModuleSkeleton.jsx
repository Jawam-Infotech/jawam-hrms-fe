const SkeletonCard = () => (
  <div className="h-10 animate-pulse rounded-xl bg-gray-100" />
)

const SkeletonRow = () => (
  <tr className="border-b border-gray-100">
    <td className="px-6 py-5">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200"></div>

        <div className="space-y-2">
          <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
          <div className="h-3 w-24 animate-pulse rounded bg-gray-100"></div>
        </div>
      </div>
    </td>

    <td>
      <div className="mx-auto h-4 w-24 animate-pulse rounded bg-gray-100"></div>
    </td>

    <td>
      <div className="mx-auto h-4 w-20 animate-pulse rounded bg-gray-100"></div>
    </td>

    <td>
      <div className="mx-auto h-4 w-24 animate-pulse rounded bg-gray-100"></div>
    </td>

    <td>
      <div className="mx-auto h-8 w-20 animate-pulse rounded-full bg-gray-200"></div>
    </td>
  </tr>
)

function EmployeeModuleSkeleton() {
  return (
    <div className="space-y-8">

      {/* Header */}

      <div className="space-y-3">
        <div className="h-8 w-56 animate-pulse rounded bg-gray-200"></div>
        <div className="h-4 w-80 animate-pulse rounded bg-gray-100"></div>
      </div>

      {/* Search + Toolbar */}

      <div className="grid gap-4 md:grid-cols-[1fr_auto]">
        <SkeletonCard />

        <div className="flex gap-3">
          <div className="h-10 w-32 animate-pulse rounded-xl bg-gray-100"></div>
          <div className="h-10 w-40 animate-pulse rounded-xl bg-gray-200"></div>
        </div>
      </div>

      {/* Table */}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <table className="w-full">
          <tbody>
            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonRow key={index} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}

      <div className="flex justify-between">
        <div className="h-10 w-28 animate-pulse rounded-lg bg-gray-100"></div>

        <div className="flex gap-2">
          <div className="h-10 w-10 animate-pulse rounded bg-gray-100"></div>
          <div className="h-10 w-10 animate-pulse rounded bg-gray-100"></div>
          <div className="h-10 w-10 animate-pulse rounded bg-gray-100"></div>
        </div>
      </div>
    </div>
  )
}

export default EmployeeModuleSkeleton