import { beforeEach, describe, expect, it, vi } from 'vitest'
import api from './axios.js'
import { exportPayrollExcel } from './payroll.api.js'

vi.mock('./axios.js', () => ({ default: { get: vi.fn() } }))

describe('exportPayrollExcel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    api.get.mockResolvedValue({ data: new Blob() })
  })

  it('sends the supported custom month-range parameter names', async () => {
    await exportPayrollExcel({
      period: 'custom_range',
      start_month: '2026-09',
      end_month: '2026-10',
    })

    expect(api.get).toHaveBeenCalledWith('payroll/export/excel/', {
      params: {
        period: 'custom_range',
        start_month: '2026-09',
        end_month: '2026-10',
      },
      responseType: 'blob',
    })
    const params = api.get.mock.calls[0][1].params
    expect(params).not.toHaveProperty('from_month')
    expect(params).not.toHaveProperty('to_month')
  })

  it('keeps single-month and financial-year parameters unchanged', async () => {
    await exportPayrollExcel({ period: 'single_month', salary_month: '2026-09' })
    expect(api.get.mock.calls[0][1].params).toEqual({
      period: 'single_month',
      salary_month: '2026-09',
    })

    await exportPayrollExcel({ period: 'financial_year', financial_year: '2026-2027' })
    expect(api.get.mock.calls[1][1].params).toEqual({
      period: 'financial_year',
      financial_year: '2026-2027',
    })
  })
})
