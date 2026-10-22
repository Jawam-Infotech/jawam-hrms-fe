function PageLoader() {
  return (
    <div className="flex min-h-[50vh] w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#e2e8f0] border-t-[#3b82f6]" />
        <span className="text-sm font-medium text-[#64748b]">Loading page...</span>
      </div>
    </div>
  )
}

export default PageLoader
