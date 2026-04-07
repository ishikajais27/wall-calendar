import DateCell from './DateCell'
import { HOLIDAYS } from './Calendar'

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

export default function CalendarGrid({
  currentDate,
  startDate,
  endDate,
  onDayClick,
}) {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const total = new Date(year, month + 1, 0).getDate()

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= total; d++) cells.push(new Date(year, month, d))
  while (cells.length % 7 !== 0) cells.push(null)

  const diffDays =
    startDate && endDate
      ? Math.round(Math.abs(endDate - startDate) / 86400000) + 1
      : null

  return (
    <div>
      {/* Day headers */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7,1fr)',
          borderBottom: '2px solid #1a1a1a',
        }}
      >
        {DAYS.map((d, i) => (
          <div
            key={d}
            style={{
              textAlign: 'center',
              padding: '10px 4px',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.15em',
              color: i === 0 || i === 6 ? '#c0392b' : '#1a1a1a',
              borderRight: i < 6 ? '1px solid #d0ccc4' : 'none',
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Range badge */}
      {diffDays && (
        <div style={{ textAlign: 'center', padding: '8px 0 0' }}>
          <span
            style={{
              background: '#1a1a1a',
              color: '#f0ece3',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.1em',
              padding: '3px 12px',
              borderRadius: 20,
              display: 'inline-block',
            }}
          >
            {diffDays} DAY{diffDays > 1 ? 'S' : ''} SELECTED
          </span>
        </div>
      )}

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)' }}>
        {cells.map((date, i) => {
          const col = i % 7
          const isLastRow = i >= cells.length - 7
          return date ? (
            <DateCell
              key={i}
              date={date}
              startDate={startDate}
              endDate={endDate}
              holiday={
                HOLIDAYS[
                  `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
                ]
              }
              onClick={() => onDayClick(date)}
              borderRight={col < 6}
              borderBottom={!isLastRow}
            />
          ) : (
            <div
              key={i}
              style={{
                height: 72,
                borderRight: col < 6 ? '1px solid #d0ccc4' : 'none',
                borderBottom: !isLastRow ? '1px solid #d0ccc4' : 'none',
              }}
            />
          )
        })}
      </div>

      {/* Legend */}
      <div
        style={{
          padding: '8px 12px',
          display: 'flex',
          gap: 16,
          flexWrap: 'wrap',
          fontSize: 10,
          color: '#888',
          fontWeight: 600,
          letterSpacing: '0.08em',
          borderTop: '1px dashed #c0bbb0',
        }}
      >
        <span>● START/END</span>
        <span style={{ color: '#aaa' }}>▒ IN RANGE</span>
        <span style={{ color: '#c0392b' }}>● HOLIDAY</span>
        <span>□ TODAY</span>
      </div>
    </div>
  )
}
