function AssetsEmptyState({
  title = 'No assets found',
  message = 'There are no asset records to display.',
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center bg-white border border-gray-200 rounded-xl">
      <div className="flex items-center justify-center w-12 h-12 mb-4 text-gray-400 bg-gray-100 rounded-full">
        <span className="text-lg">📦</span>
      </div>

      <h3 className="text-sm font-semibold text-gray-900">
        {title}
      </h3>

      <p className="max-w-md mt-1 text-sm text-gray-500">
        {message}
      </p>
    </div>
  )
}

export default AssetsEmptyState