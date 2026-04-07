'use client'
import { memo, useState } from 'react'

function DateCell({
  date,
  startDate,
  endDate,
  preview,
  holiday,
  onClick,
  onHover,
  dateNotes,
}) {
  const [hov, setHov] = useState(false)
  const isToday = date.toDateString() === new Date().toDateString()
  const isStart = startDate?.toDateString() === date.toDateString()
  const isEnd = endDate?.toDateString() === date.toDateString()
  const inRange = startDate && endDate && date > startDate && date < endDate
  const inPreview =
    startDate && !endDate && preview && date > startDate && date <= preview
  const dateKey = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
  const hasNote = dateNotes?.[dateKey]
  const isSunday = date.getDay() === 0
  const isSaturday = date.getDay() === 6

  let bg = 'transparent'
  if (isStart || isEnd) bg = 'linear-gradient(135deg, #d5b496 0%, #c8a080 100%)'
  else if (inRange) bg = 'rgba(213, 180, 150, 0.15)'
  else if (inPreview) bg = 'rgba(213, 180, 150, 0.08)'
  else if (hasNote) bg = 'rgba(213, 180, 150, 0.1)'
  else if (isSunday || isSaturday) bg = 'rgba(200, 160, 120, 0.03)'

  return (
    <div
      className="day-cell"
      onClick={() => onClick(date)}
      onMouseEnter={() => {
        setHov(true)
        onHover(date)
      }}
      onMouseLeave={() => {
        setHov(false)
        onHover(null)
      }}
      style={{
        background: bg,
        padding: '10px 4px',
        borderRadius: '8px',
        textAlign: 'center',
        fontSize: '13px',
        fontWeight: isStart || isEnd ? 600 : 500,
        color:
          isStart || isEnd
            ? '#fff'
            : isSunday || isSaturday
              ? '#a89080'
              : '#5d4e37',
        position: 'relative',
        cursor: 'pointer',
        minHeight: '44px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        border: isToday && !isStart && !isEnd ? '2px solid #d5b496' : 'none',
        fontFamily: 'var(--font-poppins)',
      }}
    >
      <span style={{ display: 'block' }}>{date.getDate()}</span>
      {hasNote && (
        <div
          style={{
            width: '3px',
            height: '3px',
            background: '#d5b496',
            borderRadius: '50%',
            margin: '2px auto 0',
          }}
        />
      )}
      {hov && hasNote && (
        <div
          style={{
            position: 'absolute',
            bottom: '120%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#8b6f47',
            color: '#fff',
            padding: '4px 8px',
            borderRadius: '4px',
            fontSize: '8px',
            whiteSpace: 'nowrap',
            zIndex: 10,
            boxShadow: '0 2px 8px rgba(200, 160, 120, 0.3)',
          }}
        >
          📝 Note
        </div>
      )}
    </div>
  )
}

export default memo(DateCell)
