export default function ListSectionCard({ title, footerText, onFooterClick, children }) {
  return (
    <div className="rounded-[30px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
      <h2 className="text-[20px] font-black text-[#111827] mb-6">{title}</h2>
      {children}
      {footerText && (
        <button
          type="button"
          onClick={onFooterClick}
          className="text-[#3b82f6] text-[14px] font-extrabold hover:underline mt-6"
        >
          {footerText}
        </button>
      )}
    </div>
  )
}