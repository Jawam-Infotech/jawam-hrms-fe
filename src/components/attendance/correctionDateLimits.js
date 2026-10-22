import { CORRECTION_REQUEST_WINDOW_DAYS } from '../../constants/attendance.js'

const formatDateForInput = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function getCorrectionDateLimits() {
  const today = new Date()
  const earliestDate = new Date(today)
  earliestDate.setDate(today.getDate() - CORRECTION_REQUEST_WINDOW_DAYS)

  return {
    min: formatDateForInput(earliestDate),
    max: formatDateForInput(today),
  }
}

export default getCorrectionDateLimits
