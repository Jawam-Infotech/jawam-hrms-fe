import { useCallback, useEffect, useRef, useState } from 'react'
import { getPayrolls } from '../../services/payrollService.js'

const isPaid = (payroll) => String(payroll?.payment_status || '').toUpperCase() === 'PAID'

const belongsToEmployee = (payroll, employeeId) => {
  const payrollEmployee = payroll?.employee
  const identifiers = [
    payroll?.employee_id,
    payroll?.employee,
    payrollEmployee?.id,
    payrollEmployee?.employee_id,
    payrollEmployee?.user_id,
  ].filter((value) => value !== null && value !== undefined)

  return identifiers.some((value) => String(value) === String(employeeId))
}

const latestBySalaryMonth = (records) => records
  .filter(isPaid)
  .slice()
  .sort((a, b) => String(b.salary_month || '').localeCompare(String(a.salary_month || '')))[0] || null

export const selectLatestPaidPayroll = (records, employeeId) =>
  latestBySalaryMonth(records.filter((record) => belongsToEmployee(record, employeeId)))

export default function useLatestPaidPayroll(employeeId) {
  const [payroll, setPayroll] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const requestRef = useRef(0)

  const load = useCallback(async () => {
    const requestId = ++requestRef.current
    setLoading(true)
    setError(null)
    try {
      const records = []
      let page = 1
      let hasNext = true
      while (hasNext) {
        const response = await getPayrolls({
          page,
          employee: employeeId,
          payment_status: 'PAID',
        })
        if (!Array.isArray(response?.payrolls)) {
          throw new Error('Invalid payroll response.')
        }
        records.push(...response.payrolls)
        hasNext = Boolean(response.next)
        page += 1
      }
      if (requestId === requestRef.current) {
        setPayroll(selectLatestPaidPayroll(records, employeeId))
      }
    } catch (requestError) {
      if (requestId === requestRef.current) {
        setPayroll(null)
        setError(requestError)
      }
    } finally {
      if (requestId === requestRef.current) setLoading(false)
    }
  }, [employeeId])

  useEffect(() => {
    // The initial fetch synchronizes this hook with the authenticated payroll API.
    if (employeeId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void load()
    } else {
      setPayroll(null)
      setError(null)
      setLoading(false)
    }
  }, [employeeId, load])

  return { payroll, loading, error, retry: load }
}
