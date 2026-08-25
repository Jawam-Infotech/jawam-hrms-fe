function formatNumber(value) {
  const number = Number.parseFloat(value ?? 0)

  if (!Number.isFinite(number)) {
    return 0
  }

  return Number.isInteger(number)
    ? number
    : number.toFixed(1)
}


function formatDate(date) {
  if (!date) {
    return null
  }

  return new Date(`${date}T00:00:00`).toLocaleDateString(
    'en-IN',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    },
  )
}


function LeaveSummary({
  summary = {},
  leaveBalances = [],
  loading = false,
  balanceLoading = false,
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
    <div className="space-y-6">

      {/* =========================
          SUMMARY CARDS
      ========================== */}

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


      {/* =========================
          LEAVE BALANCE DETAILS
      ========================== */}

      <section
        aria-label="Leave balance details"
        className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm"
      >
        <div className="mb-6">
          <h2 className="text-[18px] font-black text-[#111827]">
            Leave Balance Details
          </h2>

          <p className="mt-1 text-[14px] text-[#6b7280]">
            View your allocated, used, pending and remaining
            balance for each leave type.
          </p>
        </div>


        {balanceLoading ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-48 animate-pulse rounded-[18px] bg-[#f3f4f6]"
              />
            ))}
          </div>
        ) : leaveBalances.length === 0 ? (
          <div className="rounded-[16px] border border-dashed border-[#d1d5db] p-8 text-center">
            <p className="text-[14px] font-semibold text-[#6b7280]">
              No leave balance information available.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {leaveBalances.map((balance) => {
              const cycleStart =
                formatDate(balance.cycle_start)

              const cycleEnd =
                formatDate(balance.cycle_end)

              return (
                <article
                  key={balance.leave_type_code}
                  className="rounded-[18px] border border-[#e5e7eb] bg-[#fafafa] p-5"
                >

                  {/* LEAVE TYPE */}

                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-[16px] font-black text-[#111827]">
                        {balance.leave_type_name}
                      </h3>

                      <p className="mt-1 text-[12px] font-bold uppercase tracking-wide text-[#9ca3af]">
                        {balance.leave_type_code}
                      </p>
                    </div>

                    <div className="rounded-full bg-[#eff6ff] px-3 py-1 text-[12px] font-bold text-[#3b82f6]">
                      {formatNumber(balance.remaining)} left
                    </div>
                  </div>


                  {/* BALANCE DETAILS */}

                  <div className="mt-5 grid grid-cols-2 gap-3">

                    <div className="rounded-xl bg-white p-3">
                      <p className="text-[12px] font-semibold text-[#6b7280]">
                        Allocated
                      </p>

                      <p className="mt-1 text-[18px] font-black text-[#111827]">
                        {formatNumber(
                          balance.allocated,
                        )}
                      </p>
                    </div>


                    <div className="rounded-xl bg-white p-3">
                      <p className="text-[12px] font-semibold text-[#6b7280]">
                        Used
                      </p>

                      <p className="mt-1 text-[18px] font-black text-[#10b981]">
                        {formatNumber(
                          balance.used,
                        )}
                      </p>
                    </div>


                    <div className="rounded-xl bg-white p-3">
                      <p className="text-[12px] font-semibold text-[#6b7280]">
                        Pending
                      </p>

                      <p className="mt-1 text-[18px] font-black text-[#f59e0b]">
                        {formatNumber(
                          balance.pending,
                        )}
                      </p>
                    </div>


                    <div className="rounded-xl bg-white p-3">
                      <p className="text-[12px] font-semibold text-[#6b7280]">
                        Remaining
                      </p>

                      <p className="mt-1 text-[18px] font-black text-[#3b82f6]">
                        {formatNumber(
                          balance.remaining,
                        )}
                      </p>
                    </div>

                  </div>


                  {/* CYCLE */}

                  <div className="mt-4 border-t border-[#e5e7eb] pt-4">
                    <p className="text-[12px] font-semibold text-[#6b7280]">
                      Leave Cycle
                    </p>

                    <p className="mt-1 text-[13px] font-bold text-[#374151]">
                      {cycleStart && cycleEnd
                        ? `${cycleStart} – ${cycleEnd}`
                        : 'No allocation cycle'}
                    </p>
                  </div>

                </article>
              )
            })}
          </div>
        )}
      </section>

    </div>
  )
}


export default LeaveSummary