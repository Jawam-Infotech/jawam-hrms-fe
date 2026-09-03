const SkeletonRow = () => (
  <tr className="border-b border-gray-100">
    <td className="px-6 py-5">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200" />

        <div className="space-y-2">
          <div className="h-4 w-32 animate-pulse rounded bg-gray-200" />
          <div className="h-3 w-24 animate-pulse rounded bg-gray-100" />
        </div>
      </div>
    </td>

    <td>
      <div className="mx-auto h-4 w-24 animate-pulse rounded bg-gray-100" />
    </td>

    <td>
      <div className="mx-auto h-4 w-20 animate-pulse rounded bg-gray-100" />
    </td>

    <td>
      <div className="mx-auto h-4 w-24 animate-pulse rounded bg-gray-100" />
    </td>

    <td>
      <div className="mx-auto h-8 w-20 animate-pulse rounded-full bg-gray-200" />
    </td>
  </tr>
)

function EmployeeTableSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <table className="w-full">
        <tbody>
          {Array.from({ length: 8 }).map((_, index) => (
            <SkeletonRow key={index} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default EmployeeTableSkeleton