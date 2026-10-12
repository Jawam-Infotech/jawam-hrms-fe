import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getLeaveBalance } from '../../services/leaveService.js'

export default function LeaveBalanceCard() {
  const navigate = useNavigate()

  const [remainingLeaves, setRemainingLeaves] =
    useState(0)

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {
    let cancelled = false

    const loadLeaveBalance = async () => {
      try {
        setLoading(true)

        const balances =
          await getLeaveBalance()

        if (cancelled) {
          return
        }

        if (!Array.isArray(balances)) {
          setRemainingLeaves(0)
          return
        }

        /*
         * =========================
         * PAID LEAVE BALANCE
         * =========================
         *
         * The current leave policy uses
         * Paid Leave (PL) as the employee's
         * pooled paid-leave balance.
         *
         * The backend calculates the
         * remaining balance, so the
         * frontend does not calculate:
         *
         * allocated - used
         *
         * UPL and WFH do not contribute
         * to this Leave Balance card.
         */

        const paidLeaveBalance =
          balances.find(
            (balance) =>
              balance?.leave_type_code === 'PL',
          )

        const remaining =
          Number.parseFloat(
            paidLeaveBalance?.remaining ?? 0,
          )

        setRemainingLeaves(
          Number.isFinite(remaining)
            ? remaining
            : 0,
        )
      } catch (error) {
        console.error(
          'Failed to load leave balance:',
          error,
        )

        if (!cancelled) {
          setRemainingLeaves(0)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void loadLeaveBalance()

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="rounded-[20px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e0f2fe] text-[#0284c7]">
          <svg className="h-6 w-6 stroke-current stroke-2 fill-none" viewBox="0 0 24 24">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>

        <div>
          <h3 className="text-[16px] font-extrabold text-[#111827]">
            Leave Balance
          </h3>

          <p className="mt-1 text-[16px] font-extrabold text-[#0284c7]">
            {loading
              ? 'Loading...'
              : `${remainingLeaves} ${
                  remainingLeaves === 1
                    ? 'Day'
                    : 'Days'
                }`}
          </p>
        </div>
      </div>

      <div className="pt-1">
        <button
          type="button"
          onClick={() => navigate('/leave')}
          className="inline-flex items-center justify-center rounded-full bg-[#e0f2fe] px-4 py-1.5 text-[13px] font-bold text-[#0284c7] transition-all hover:bg-[#bae6fd]"
        >
          Check Leave History
        </button>
      </div>
    </div>
  )
}