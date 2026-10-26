// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import Payroll from './Payroll.jsx'
import { UserContext } from '../../context/UserContext.jsx'

const { usePayroll, usePayslipDownload, generatePayroll } = vi.hoisted(() => ({
  usePayroll: vi.fn(),
  usePayslipDownload: vi.fn(),
  generatePayroll: vi.fn(),
}))

vi.mock('../../hooks/usePayroll.js', () => ({ default: usePayroll }))
vi.mock('../../hooks/payroll/usePayslipDownload.js', () => ({ default: usePayslipDownload }))
vi.mock('../../services/payrollService.js', () => ({ generatePayroll }))
vi.mock('react-router-dom', () => ({
  useLocation: () => ({ pathname: '/payroll' }),
  useNavigate: () => vi.fn(),
}))
vi.mock('../../layouts/DashboardLayout', () => ({ default: ({ children }) => <main>{children}</main> }))
vi.mock('../../components/payroll/PayrollFilters.jsx', () => ({ default: () => null }))
vi.mock('../../components/payroll/PayrollPagination.jsx', () => ({ default: () => null }))
vi.mock('../../components/employees/AccessRestricted.jsx', () => ({ default: () => null }))
vi.mock('../../components/payroll/GeneratePayrollModal.jsx', () => ({ default: ({ isOpen, onGenerate, onClose }) => isOpen ? <div role="dialog"><button type="button" onClick={() => onGenerate('2026-10')}>Generate</button><button type="button" onClick={onClose}>Close</button></div> : null }))
vi.mock('../../components/payroll/LateGenerationApprovalModal.jsx', () => ({ default: () => null }))
vi.mock('./SalaryRevisions.jsx', () => ({ default: () => null }))
vi.mock('./FinalSettlement.jsx', () => ({ default: () => null }))
vi.mock('./PayrollSettings.jsx', () => ({ default: () => null }))
vi.mock('./PayrollReports.jsx', () => ({ default: () => null }))
vi.mock('../../components/payroll/PayslipPreview.jsx', () => ({ default: () => null }))

const refreshPayroll = vi.fn()
const handleGeneratePayroll = vi.fn()
const clearGenerateError = vi.fn()
const handleApproveLateGeneration = vi.fn()
const clearLateGenerationError = vi.fn()
const fetchPayrollById = vi.fn()
const updateFilters = vi.fn()
const changePayrollPage = vi.fn()

function setupHook() {
  const fetchPayrolls = vi.fn().mockResolvedValue(undefined)
  usePayroll.mockReturnValue({
    payrolls: [],
    payrollLoading: false,
    payrollError: null,
    payrollPagination: { count: 0, next: null, previous: null },
    filters: { page: 1 },
    fetchPayrolls,
    fetchPayrollById,
    updateFilters,
    changePayrollPage,
    handleGeneratePayroll,
    clearGenerateError,
    generateLoading: false,
    generateError: null,
    refreshPayroll,
    handleApproveLateGeneration,
    lateGenerationLoading: false,
    lateGenerationError: null,
    clearLateGenerationError,
  })
  usePayslipDownload.mockReturnValue({
    payslipLoadingId: null,
    payslipError: null,
    previewPayroll: null,
    payslipPreviewRef: { current: null },
    handleDownloadPayslip: vi.fn(),
    clearPreview: vi.fn(),
  })
}

beforeEach(() => {
  vi.clearAllMocks()
  setupHook()
})

afterEach(() => {
  cleanup()
})

function renderPayroll() {
  return render(<UserContext.Provider value={{ user: { role: 'HR', id: 1 } }}><Payroll /></UserContext.Provider>)
}

describe('Payroll generation refresh', () => {
  it('refreshes the payroll list exactly once after successful generation', async () => {
    const events = []
    handleGeneratePayroll.mockImplementation(async (month) => { events.push(['generate', month]) })
    refreshPayroll.mockImplementation(async () => { events.push(['refresh']) })

    renderPayroll()
    fireEvent.click(screen.getByRole('button', { name: 'Generated Payroll' }))
    fireEvent.click(screen.getByRole('button', { name: 'Generate Payroll' }))
    fireEvent.click(screen.getByRole('button', { name: 'Generate' }))

    await waitFor(() => expect(refreshPayroll).toHaveBeenCalledTimes(1))
    expect(handleGeneratePayroll).toHaveBeenCalledWith('2026-10')
    expect(events).toEqual([['generate', '2026-10'], ['refresh']])
    expect(screen.queryByRole('dialog')).toBeNull()
  })

  it('does not refresh the payroll list when generation fails', async () => {
    handleGeneratePayroll.mockRejectedValue(new Error('Generation failed'))

    renderPayroll()
    fireEvent.click(screen.getByRole('button', { name: 'Generated Payroll' }))
    fireEvent.click(screen.getByRole('button', { name: 'Generate Payroll' }))
    fireEvent.click(screen.getByRole('button', { name: 'Generate' }))

    await waitFor(() => expect(handleGeneratePayroll).toHaveBeenCalledWith('2026-10'))
    expect(refreshPayroll).not.toHaveBeenCalled()
    expect(screen.getByRole('dialog')).toBeTruthy()
  })
})
