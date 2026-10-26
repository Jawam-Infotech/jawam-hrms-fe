export function getSettlementFilename(settlement) {
  const employeeId = settlement?.employee_code || settlement?.employee_id || settlement?.employee?.employee_code || settlement?.id || 'employee'
  return `Final_Settlement_${employeeId}.pdf`.replace(/[^a-zA-Z0-9_.-]+/g, '_')
}

export async function downloadSettlementPreview(element, settlement) {
  const { default: html2pdf } = await import('html2pdf.js')

  return html2pdf().set({
    margin: [8, 8, 8, 8],
    filename: getSettlementFilename(settlement),
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['css', 'legacy'] },
  }).from(element).save()
}
