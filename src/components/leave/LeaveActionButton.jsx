import { Eye } from 'lucide-react'


function LeaveActionButton({
  request,
  onView,
}) {
  const employeeName =
    request?.employeeName || 'employee'


  const handleView = () => {
    if (!request || !onView) {
      return
    }

    onView(request)
  }


  return (
    <button
      type="button"
      onClick={handleView}
      aria-label={`View leave request for ${employeeName}`}
      title="View leave request"
      className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[#2563eb] transition hover:bg-[#eff6ff] focus:outline-none focus:ring-2 focus:ring-[#bfdbfe] focus:ring-offset-1"
    >
      <Eye
        size={18}
        aria-hidden="true"
      />
    </button>
  )
}


export default LeaveActionButton