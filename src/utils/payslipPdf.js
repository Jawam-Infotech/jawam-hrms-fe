import html2pdf from 'html2pdf.js'

export function getPayslipFilename(payroll) {
  const employeeId = payroll?.employee_code || payroll?.employee_id || payroll?.employee?.employee_code || payroll?.id || 'employee'
  const salaryMonth = payroll?.salary_month || payroll?.current_version?.calculation_inputs?.salary_month || 'payroll'
  return `Payslip_${employeeId}_${salaryMonth}.pdf`.replace(/[^a-zA-Z0-9_.-]+/g, '_')
}

export function downloadPayslipPreview(element, payroll) {
  return html2pdf().set({
    margin: [8, 8, 8, 8],
    filename: getPayslipFilename(payroll),
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['css', 'legacy'] },
  }).from(element).save()
}
