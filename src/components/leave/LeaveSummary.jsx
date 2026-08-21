function LeaveSummary({
  summary = {},
  loading = false,
}) {
  const cards = [
    {
      label: 'Available Leaves',
      value: summary.available ?? 0,
      valueClass: 'text-[#111827]',
    },
    {
      label: 'Approved Leaves',
      value: summary.approved ?? 0,
      valueClass: 'text-[#10b981]',
    },
    {
      label: 'In Process Leave',
      value: summary.inProcess ?? 0,
      valueClass: 'text-[#f59e0b]',
    },
    {
      label: 'Rejected Leaves',
      value: summary.rejected ?? 0,
      valueClass: 'text-[#ef4444]',
    },
  ]

  return (
    <section
      aria-label="Leave summary"
      className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
    >
      {cards.map((card) => (
        <article
          key={card.label}
          className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm"
        >
          <p className="text-[14px] font-semibold text-[#6b7280]">
            {card.label}
          </p>

          <p
            className={`mt-4 text-[28px] font-black ${card.valueClass}`}
            aria-label={`${card.label}: ${
              loading ? 'Loading' : card.value
            }`}
          >
            {loading ? '—' : card.value}
          </p>
        </article>
      ))}
    </section>
  )
}

export default LeaveSummary