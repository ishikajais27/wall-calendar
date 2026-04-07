import { useState, useMemo } from 'react'

export function useCalendarNavigation(initial = new Date()) {
  const [cur, setCur] = useState(
    new Date(initial.getFullYear(), initial.getMonth(), 1),
  )

  const year = cur.getFullYear()
  const month = cur.getMonth()

  const days = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay()
    const total = new Date(year, month + 1, 0).getDate()
    const cells = []
    for (let i = 0; i < firstDay; i++) cells.push(null)
    for (let d = 1; d <= total; d++) cells.push(new Date(year, month, d))
    while (cells.length % 7 !== 0) cells.push(null)
    return cells
  }, [year, month])

  function goToMonth(dir) {
    setCur((p) => new Date(p.getFullYear(), p.getMonth() + dir, 1))
  }

  return { cur, year, month, days, goToMonth }
}
