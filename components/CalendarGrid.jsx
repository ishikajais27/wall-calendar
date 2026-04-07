import { memo, useRef, useCallback } from 'react'
import DateCell from './DateCell'
import { HOLIDAYS } from './Calendar'

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

function CalendarGrid({
  days = [],
  month,
  year,
  startDate,
  endDate,
  hoverDate,
  setHoverDate,
  onDayClick,
  dateNotes,
}) {
  const ref = useRef(null)
  const preview = !endDate ? hoverDate : null
  const diff =
    startDate && endDate
      ? Math.round(Math.abs(endDate - startDate) / 86400000) + 1
      : null

  const onKey = useCallback((e) => {
    const cells = Array.from(ref.current?.querySelectorAll('.day-cell') || [])
    const idx = cells.indexOf(document.activeElement)
    if (idx < 0) return
    const moves = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: 7, ArrowUp: -7 }
    const n = idx + (moves[e.key] || 0)
    if (n >= 0 && n < cells.length) {
      e.preventDefault()
      cells[n]?.focus()
    }
  }, [])

  return (
    <div ref={ref} onKeyDown={onKey} role="grid" aria-label="Calendar">
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7,1fr)',
          borderBottom: '2px solid #d5b496',
          paddingBottom: 10,
          marginBottom: 8,
          gap: 4,
        }}
      >
        {DAYS.map((d, i) => (
          <div
            key={i}
            style={{
              textAlign: 'center',
              fontSize: 9,
              fontWeight: 900,
              color: i === 0 || i === 6 ? '#c8a080' : '#8b6f47',
              letterSpacing: '1px',
              fontFamily: 'var(--font-poppins)',
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {diff && (
        <div
          style={{
            textAlign: 'center',
            padding: '10px 0',
            fontSize: 10,
            fontWeight: 700,
            background:
              'linear-gradient(90deg, transparent, rgba(213, 180, 150, 0.12), transparent)',
            borderRadius: 8,
            marginBottom: 8,
            color: '#8b6f47',
            fontFamily: 'var(--font-poppins)',
          }}
        >
          📅 {diff} {diff === 1 ? 'Day' : 'Days'} Selected
        </div>
      )}

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7,1fr)',
          gap: 3,
        }}
      >
        {days.map((date, i) =>
          !date ? (
            <div key={i} />
          ) : (
            <DateCell
              key={i}
              date={date}
              startDate={startDate}
              endDate={endDate}
              preview={preview}
              holiday={
                HOLIDAYS[
                  `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
                ]
              }
              onClick={onDayClick}
              onHover={setHoverDate}
              dateNotes={dateNotes}
            />
          ),
        )}
      </div>
    </div>
  )
}

export default memo(CalendarGrid)
