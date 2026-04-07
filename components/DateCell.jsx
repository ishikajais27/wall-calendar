'use client'
import { useState } from 'react'

export default function DateCell({
  date,
  startDate,
  endDate,
  holiday,
  onClick,
}) {
  const [hovered, setHovered] = useState(false)
  const today = new Date()
  const isToday = date.toDateString() === today.toDateString()
  const isStart = startDate && date.toDateString() === startDate.toDateString()
  const isEnd = endDate && date.toDateString() === endDate.toDateString()
  const isInRange = startDate && endDate && date > startDate && date < endDate
  const isWeekend = date.getDay() === 0 || date.getDay() === 6

  let bg = 'transparent',
    color = isWeekend ? '#c0392b' : '#5a4535',
    radius = '8px',
    border = 'none'

  if (isStart || isEnd) {
    bg = '#3d2b1f'
    color = '#fff'
    radius = '8px'
  } else if (isInRange) {
    bg = 'rgba(139,115,85,.16)'
    radius = '0'
  } else if (isToday) {
    border = '2px solid #8b7355'
  } else if (hovered) {
    bg = 'rgba(139,115,85,.12)'
  }

  if (isStart && endDate) radius = '8px 0 0 8px'
  if (isEnd && startDate) radius = '0 8px 8px 0'

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex items-center justify-center h-11 text-sm cursor-pointer select-none transition-all"
      style={{
        background: bg,
        color,
        borderRadius: radius,
        border,
        fontWeight: isStart || isEnd || isToday ? 'bold' : 'normal',
      }}
    >
      {date.getDate()}

      {/* Holiday dot */}
      {holiday && (
        <span
          className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full"
          style={{ background: '#c0392b' }}
          title={holiday}
        />
      )}

      {/* Today dot */}
      {isToday && !isStart && !isEnd && (
        <span
          className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
          style={{ background: '#8b7355' }}
        />
      )}

      {/* Holiday tooltip */}
      {holiday && hovered && (
        <div
          className="absolute z-10 px-2 py-1 rounded text-xs font-bold whitespace-nowrap pointer-events-none"
          style={{
            background: '#3d2b1f',
            color: '#fdf8f0',
            bottom: '110%',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          {holiday}
        </div>
      )}
    </div>
  )
}
