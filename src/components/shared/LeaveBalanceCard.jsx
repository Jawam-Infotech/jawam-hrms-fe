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
    <div className="rounded-[16px] border border-[#e5e5e5] bg-white p-6 shadow-sm">

      <div className="mb-4 flex items-center gap-4">

        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ccfbf1] text-[24px]">
          📅
        </div>

        <div>
          <h3 className="text-[16px] font-extrabold text-[#111827]">
            Leave Balance
          </h3>

          <p className="text-[14px] font-extrabold text-[#3b82f6]">
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

      <button
        type="button"
        onClick={() => navigate('/leave')}
        className="text-[14px] font-extrabold text-[#3b82f6] hover:underline"
      >
        Check Leave History
      </button>

    </div>
  )
}