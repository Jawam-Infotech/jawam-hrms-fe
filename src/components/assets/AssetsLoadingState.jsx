function AssetsLoadingState() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-24 bg-gray-100 border border-gray-200 rounded-xl"
          />
        ))}
      </div>

      <div className="overflow-hidden bg-white border border-gray-200 rounded-xl">
        <div className="h-16 bg-gray-100 border-b border-gray-200" />

        <div className="p-5 space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-12 bg-gray-100 rounded-lg"
            />
          ))}
        </div>
      </div>

      <div className="overflow-hidden bg-white border border-gray-200 rounded-xl">
        <div className="h-16 bg-gray-100 border-b border-gray-200" />

        <div className="p-5 space-y-4">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-12 bg-gray-100 rounded-lg"
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default AssetsLoadingState
