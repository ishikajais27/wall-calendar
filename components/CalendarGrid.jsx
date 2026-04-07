import { memo } from 'react'
import DateCell from './DateCell'
import { HOLIDAYS } from './Calendar'

const DAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

function CalendarGrid({
  days,
  year,
  month,
  startDate,
  endDate,
  hoverDate,
  setHoverDate,
  onDayClick,
  stickers,
}) {
  const previewEnd = !endDate ? hoverDate : null
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
          borderBottom: '1.5px solid var(--ink)',
        }}
      >
        {DAYS.map((d, i) => (
          <div
            key={d}
            style={{
              textAlign: 'center',
              padding: '10px 4px',
              fontSize: 11,
              fontWeight: 900,
              letterSpacing: '0.15em',
              color: 'var(--ink)',
              borderRight: i < 6 ? '1px solid var(--grid)' : 'none',
            }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Range badge */}
      {diffDays && (
        <div style={{ textAlign: 'center', padding: '6px 0 0' }}>
          <span
            style={{
              background: 'var(--ink)',
              color: 'var(--cream)',
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.12em',
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
        {days.map((date, i) => {
          const col = i % 7
          const isLastRow = i >= days.length - 7
          const sticker = date
            ? stickers[
                `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
              ]
            : null
          return date ? (
            <DateCell
              key={i}
              date={date}
              startDate={startDate}
              endDate={endDate}
              previewEnd={previewEnd}
              holiday={
                HOLIDAYS[
                  `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
                ]
              }
              sticker={sticker}
              onDayClick={onDayClick}
              onHover={setHoverDate}
              borderRight={col < 6}
              borderBottom={!isLastRow}
            />
          ) : (
            <div
              key={i}
              style={{
                height: 80,
                borderRight: col < 6 ? '1px solid var(--grid)' : 'none',
                borderBottom: !isLastRow ? '1px solid var(--grid)' : 'none',
              }}
            />
          )
        })}
      </div>

      {/* Legend */}
      <div
        style={{
          padding: '8px 16px',
          display: 'flex',
          gap: 16,
          flexWrap: 'wrap',
          fontSize: 9,
          color: '#999',
          fontWeight: 700,
          letterSpacing: '0.1em',
          borderTop: '1px dashed var(--grid)',
        }}
      >
        <span style={{ color: 'var(--ink)' }}>● START/END</span>
        <span>▒ IN RANGE</span>
        <span style={{ color: 'var(--red)' }}>● HOLIDAY</span>
        <span>□ TODAY</span>
        <span style={{ color: '#74b9ff' }}>◈ PREVIEW</span>
      </div>
    </div>
  )
}

export default memo(CalendarGrid)
