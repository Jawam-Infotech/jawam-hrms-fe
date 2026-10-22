function getPreviousCalendarMonth() {
  const currentDate = new Date()
  const previousMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    1,
  )

  return `${previousMonth.getFullYear()}-${String(
    previousMonth.getMonth() + 1,
  ).padStart(2, '0')}`
}

export { getPreviousCalendarMonth }
