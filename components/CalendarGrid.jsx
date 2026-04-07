import DateCell from './DateCell'
import { HOLIDAYS } from './Calendar'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export default function CalendarGrid({
  currentDate,
  startDate,
  endDate,
  onDayClick,
  onChangeMonth,
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
      {/* Nav */}
      <div className="flex items-center justify-between mb-5">
        <button
          onClick={() => onChangeMonth(-1)}
          className="w-9 h-9 flex items-center justify-center rounded-full text-xl font-bold transition-all"
          style={{ color: '#8b7355', background: 'rgba(139,115,85,.1)' }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = 'rgba(139,115,85,.22)')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = 'rgba(139,115,85,.1)')
          }
        >
          ‹
        </button>

        <div className="text-center">
          <h2
            className="text-2xl font-bold"
            style={{ color: '#4a3728', fontFamily: 'Georgia,serif' }}
          >
            {MONTHS[month]}
          </h2>
          <p
            className="text-xs"
            style={{ color: '#8b7355', letterSpacing: '.15em' }}
          >
            {year}
          </p>
        </div>

        <button
          onClick={() => onChangeMonth(1)}
          className="w-9 h-9 flex items-center justify-center rounded-full text-xl font-bold transition-all"
          style={{ color: '#8b7355', background: 'rgba(139,115,85,.1)' }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = 'rgba(139,115,85,.22)')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = 'rgba(139,115,85,.1)')
          }
        >
          ›
        </button>
      </div>

      {/* Range pill */}
      {diffDays && (
        <div className="text-center mb-3">
          <span
            className="text-xs font-bold px-3 py-1 rounded-full"
            style={{
              background: '#4a3728',
              color: '#fdf8f0',
              letterSpacing: '.05em',
            }}
          >
            {diffDays} day{diffDays > 1 ? 's' : ''} selected
          </span>
        </div>
      )}

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d, i) => (
          <div
            key={d}
            className="text-center text-xs font-bold py-2 uppercase tracking-widest"
            style={{ color: i === 0 || i === 6 ? '#c0392b' : '#8b7355' }}
          >
            {d}
          </div>
        ))}
      </div>

      <div
        className="mb-3 h-px"
        style={{
          background:
            'linear-gradient(to right,transparent,#d4c4a8,transparent)',
        }}
      />

      {/* Grid */}
      <div className="grid grid-cols-7">
        {cells.map((date, i) =>
          date ? (
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
            />
          ) : (
            <div key={i} className="h-11" />
          ),
        )}
      </div>

      {/* Legend */}
      <div
        className="mt-5 pt-4 flex flex-wrap gap-4 text-xs"
        style={{ borderTop: '1px dashed #d4c4a8', color: '#8b7355' }}
      >
        <span className="flex items-center gap-1">
          <span
            className="w-3 h-3 rounded-full inline-block"
            style={{ background: '#4a3728' }}
          />{' '}
          Start / End
        </span>
        <span className="flex items-center gap-1">
          <span
            className="w-3 h-3 rounded inline-block"
            style={{ background: 'rgba(139,115,85,.18)' }}
          />{' '}
          In Range
        </span>
        <span className="flex items-center gap-1">
          <span
            className="w-2 h-2 rounded-full inline-block"
            style={{ background: '#c0392b' }}
          />{' '}
          Holiday
        </span>
        <span className="flex items-center gap-1">
          <span
            className="w-3 h-3 rounded inline-block border-2"
            style={{ borderColor: '#4a3728' }}
          />{' '}
          Today
        </span>
      </div>
    </div>
  )
}
