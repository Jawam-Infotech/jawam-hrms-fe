import { useState, useContext } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout'
import { UserContext } from '../../context/UserContext'

const payrollHistory = [
  { period: 'June 2026', status: 'Paid', date: '30 Jun 2026', amount: '₹45,000' },
  { period: 'May 2026', status: 'Paid', date: '31 May 2026', amount: '₹45,000' },
  { period: 'April 2026', status: 'Paid', date: '30 Apr 2026', amount: '₹45,000' },
  { period: 'March 2026', status: 'Paid', date: '31 Mar 2026', amount: '₹45,000' },
]

const dummyPayslipData = {
  period: 'June 2026',
  employeeName: 'Gaurav P.',
  employeeId: 'EMP-001',
  department: 'UI/UX Design',
  designation: 'UI/UX Designer',
  paymentDate: '30 Jun 2026',
  salary: 45000,
  earnings: {
    basic: 35000,
    hra: 5000,
    da: 3000,
    allowances: 2000,
  },
  deductions: {
    providentFund: 3500,
    tax: 4200,
    insurance: 1200,
  },
  netSalary: 36100,
}

function PayslipModal({ isOpen, onClose, data }) {
  if (!isOpen) return null

  const totalEarnings = Object.values(data.earnings).reduce((a, b) => a + b, 0)
  const totalDeductions = Object.values(data.deductions).reduce((a, b) => a + b, 0)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[24px] bg-white p-8 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-[24px] font-black text-[#111827]">Payslip</h2>
          <button
            onClick={onClose}
            className="text-[24px] text-[#6b7280] hover:text-[#111827]"
          >
            ✕
          </button>
        </div>

        <div className="border-b border-[#e5e7eb] pb-6">
          <div className="mb-4 text-center">
            <h3 className="text-[20px] font-black text-[#111827]">JAWAM HR</h3>
            <p className="text-[12px] text-[#6b7280]">Human Resources Management Platform</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-6">
          <div>
            <p className="text-[12px] font-semibold text-[#6b7280]">Employee Name</p>
            <p className="mt-1 text-[14px] font-bold text-[#111827]">{data.employeeName}</p>
          </div>
          <div>
            <p className="text-[12px] font-semibold text-[#6b7280]">Employee ID</p>
            <p className="mt-1 text-[14px] font-bold text-[#111827]">{data.employeeId}</p>
          </div>
          <div>
            <p className="text-[12px] font-semibold text-[#6b7280]">Department</p>
            <p className="mt-1 text-[14px] font-bold text-[#111827]">{data.department}</p>
          </div>
          <div>
            <p className="text-[12px] font-semibold text-[#6b7280]">Designation</p>
            <p className="mt-1 text-[14px] font-bold text-[#111827]">{data.designation}</p>
          </div>
          <div>
            <p className="text-[12px] font-semibold text-[#6b7280]">Pay Period</p>
            <p className="mt-1 text-[14px] font-bold text-[#111827]">{data.period}</p>
          </div>
          <div>
            <p className="text-[12px] font-semibold text-[#6b7280]">Payment Date</p>
            <p className="mt-1 text-[14px] font-bold text-[#111827]">{data.paymentDate}</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-8">
          <div>
            <h4 className="mb-4 text-[14px] font-bold text-[#111827]">Earnings</h4>
            <div className="space-y-2 text-[13px]">
              {Object.entries(data.earnings).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-[#6b7280] capitalize">{key}</span>
                  <span className="font-semibold text-[#111827]">₹{value.toLocaleString()}</span>
                </div>
              ))}
              <div className="border-t border-[#e5e7eb] pt-2">
                <div className="flex justify-between font-bold text-[#111827]">
                  <span>Total Earnings</span>
                  <span>₹{totalEarnings.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-[14px] font-bold text-[#111827]">Deductions</h4>
            <div className="space-y-2 text-[13px]">
              {Object.entries(data.deductions).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="text-[#6b7280] capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <span className="font-semibold text-[#111827]">₹{value.toLocaleString()}</span>
                </div>
              ))}
              <div className="border-t border-[#e5e7eb] pt-2">
                <div className="flex justify-between font-bold text-[#111827]">
                  <span>Total Deductions</span>
                  <span>₹{totalDeductions.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-[16px] border border-[#e5e7eb] bg-[#f8fafc] p-4">
          <div className="flex justify-between">
            <span className="text-[14px] font-bold text-[#111827]">Net Salary (After Deductions)</span>
            <span className="text-[18px] font-black text-[#10b981]">₹{data.netSalary.toLocaleString()}</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-8 w-full rounded-full bg-[#3b82f6] px-6 py-3 text-[14px] font-bold text-white transition-all hover:bg-[#2563eb]"
        >
          Close
        </button>
      </div>
    </div>
  )
}

function Payroll() {
  const { user } = useContext(UserContext)
  const [selectedPayslip, setSelectedPayslip] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleView = (period) => {
    setSelectedPayslip({ ...dummyPayslipData, period })
    setIsModalOpen(true)
  }

  const handleDownloadPDF = (period) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const width = 800
    const height = 1100

    canvas.width = width
    canvas.height = height

    // White background
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)

    // Border
    ctx.strokeStyle = '#e5e7eb'
    ctx.lineWidth = 2
    ctx.strokeRect(20, 20, width - 40, height - 40)

    // Header
    ctx.fillStyle = '#111827'
    ctx.font = 'bold 24px Arial'
    ctx.textAlign = 'center'
    ctx.fillText('JAWAM HR', width / 2, 60)
    ctx.font = '12px Arial'
    ctx.fillStyle = '#6b7280'
    ctx.fillText('Human Resources Management Platform', width / 2, 85)

    // Title
    ctx.font = 'bold 18px Arial'
    ctx.fillStyle = '#111827'
    ctx.textAlign = 'left'
    ctx.fillText('Payslip', 50, 130)

    // Employee Details
    let y = 170
    const leftCol = 50
    const rightCol = 420
    const fontSize = 12
    const lineHeight = 25

    ctx.font = 'bold 11px Arial'
    ctx.fillStyle = '#6b7280'
    ctx.fontSize = fontSize

    const details = [
      { label: 'Employee Name', value: dummyPayslipData.employeeName },
      { label: 'Employee ID', value: dummyPayslipData.employeeId },
      { label: 'Department', value: dummyPayslipData.department },
      { label: 'Designation', value: dummyPayslipData.designation },
      { label: 'Pay Period', value: period },
      { label: 'Payment Date', value: dummyPayslipData.paymentDate },
    ]

    details.forEach((detail, idx) => {
      if (idx % 2 === 0) {
        ctx.fillStyle = '#6b7280'
        ctx.fillText(detail.label, leftCol, y)
        ctx.fillStyle = '#111827'
        ctx.font = 'bold 11px Arial'
        ctx.fillText(detail.value, leftCol, y + 15)
        y += lineHeight
      } else {
        ctx.fillStyle = '#6b7280'
        ctx.fillText(detail.label, rightCol, y - lineHeight)
        ctx.fillStyle = '#111827'
        ctx.font = 'bold 11px Arial'
        ctx.fillText(detail.value, rightCol, y - lineHeight + 15)
      }
    })

    // Earnings and Deductions
    y = 400
    ctx.font = 'bold 12px Arial'
    ctx.fillStyle = '#111827'
    ctx.fillText('Earnings', leftCol, y)
    ctx.fillText('Deductions', rightCol, y)

    y += 25
    ctx.font = '11px Arial'
    ctx.fillStyle = '#6b7280'

    let earningsY = y
    let deductionsY = y
    let totalEarnings = 0
    let totalDeductions = 0

    Object.entries(dummyPayslipData.earnings).forEach(([key, value]) => {
      totalEarnings += value
      ctx.fillText(`${key}: ₹${value.toLocaleString()}`, leftCol, earningsY)
      earningsY += 20
    })

    Object.entries(dummyPayslipData.deductions).forEach(([key, value]) => {
      totalDeductions += value
      ctx.fillText(`${key}: ₹${value.toLocaleString()}`, rightCol, deductionsY)
      deductionsY += 20
    })

    // Totals
    y = Math.max(earningsY, deductionsY) + 20
    ctx.fillStyle = '#111827'
    ctx.font = 'bold 11px Arial'
    ctx.fillText(`Total Earnings: ₹${totalEarnings.toLocaleString()}`, leftCol, y)
    ctx.fillText(`Total Deductions: ₹${totalDeductions.toLocaleString()}`, rightCol, y)

    // Net Salary
    y += 50
    ctx.font = 'bold 14px Arial'
    ctx.fillStyle = '#10b981'
    ctx.fillText(`Net Salary: ₹${dummyPayslipData.netSalary.toLocaleString()}`, leftCol, y)

    // Convert canvas to blob and download
    canvas.toBlob((blob) => {
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `Payslip_${period.replace(' ', '_')}.png`
      link.click()
      URL.revokeObjectURL(url)
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-[32px] font-black text-[#111827]">Payroll</h1>
          <p className="text-[16px] text-[#5f6679] mt-2">
            View and download your Payslips.
          </p>
        </div>

        <div className="rounded-[24px] border border-[#e5e7eb] bg-white p-6 shadow-sm">
          <h2 className="text-[20px] font-black text-[#111827] mb-6">Payroll History</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-[14px] text-[#374151]">
              <thead className="border-b border-[#e5e7eb] text-[#6b7280]">
                <tr>
                  <th className="py-4 font-semibold">Payroll Period</th>
                  <th className="py-4 font-semibold">Status</th>
                  <th className="py-4 font-semibold">Amount</th>
                  <th className="py-4 font-semibold">Payment Date</th>
                  <th className="py-4 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {payrollHistory.map((row) => (
                  <tr key={row.period} className="border-b border-[#f3f4f6] hover:bg-[#f8fafc] transition-all">
                    <td className="py-4 font-semibold text-[#111827]">{row.period}</td>
                    <td className="py-4">
                      <span className="inline-flex items-center rounded-full bg-[#ecfdf5] px-3 py-1 text-[12px] font-semibold text-[#059669]">
                        {row.status}
                      </span>
                    </td>
                    <td className="py-4 font-semibold text-[#111827]">{row.amount}</td>
                    <td className="py-4 text-[#6b7280]">{row.date}</td>
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleView(row.period)}
                          className="rounded-full bg-[#fee2e2] px-4 py-2 text-[12px] font-semibold text-[#dc2626] transition-all hover:bg-[#fecaca]"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDownloadPDF(row.period)}
                          className="rounded-full bg-[#ccfbf1] px-4 py-2 text-[12px] font-semibold text-[#0d9488] transition-all hover:bg-[#99f6e4]"
                        >
                          Download
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <PayslipModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={selectedPayslip || dummyPayslipData}
      />
    </DashboardLayout>
  )
}

export default Payroll
