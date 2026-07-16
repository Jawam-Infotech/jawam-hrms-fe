export function getMonthWeeks(year, month) {
  const firstOfMonth = new Date(year, month, 1)
  const lastOfMonth = new Date(year, month + 1, 0)
  const weeks = []
  const start = new Date(firstOfMonth)
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7))

  let current = new Date(start)
  while (current <= lastOfMonth || current.getDay() !== 1) {
    const week = []
    for (let i = 0; i < 7; i += 1) {
      week.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    weeks.push(week)
  }
  return weeks
}