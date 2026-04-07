'use client'
import { useState, memo, useCallback } from 'react'

function DateCell({
  date,
  startDate,
  endDate,
  previewEnd,
  holiday,
  sticker,
  onDayClick,
  onHover,
  borderRight,
  borderBottom,
}) {
  const [hovered, setHovered] = useState(false)
  const today = new Date()
  const isToday = date.toDateString() === today.toDateString()
  const isStart = startDate && date.toDateString() === startDate.toDateString()
  const isEnd = endDate && date.toDateString() === endDate.toDateString()
  const isInRange = startDate && endDate && date > startDate && date < endDate
  const isWeekend = date.getDay() === 0 || date.getDay() === 6

  // Preview range (shadow range on hover)
  const isPreview =
    startDate &&
    !endDate &&
    previewEnd &&
    date > startDate &&
    date <= previewEnd

  let bg = 'transparent'
  if (isStart || isEnd) bg = 'var(--ink)'
  else if (isInRange) bg = 'var(--range-bg)'
  else if (isPreview) bg = 'rgba(116,185,255,0.15)'
  else if (hovered) bg = 'var(--range-hover)'

  // Snap-to-week: on hover near weekend, highlight full week
  const handleMouseEnter = useCallback(() => {
    setHovered(true)
    onHover(date)
  }, [date, onHover])

  const handleMouseLeave = useCallback(() => {
    setHovered(false)
    onHover(null)
  }, [onHover])

  return (
    <div
      className="day-cell"
      tabIndex={0}
      role="button"
      aria-label={`${date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}${holiday ? ', ' + holiday : ''}`}
      onClick={() => onDayClick(date)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onDayClick(date)
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        minHeight: 80,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
        padding: '6px 8px 4px',
        cursor: 'pointer',
        userSelect: 'none',
        background: bg,
        borderRight: borderRight ? '1px solid var(--grid)' : 'none',
        borderBottom: borderBottom ? '1px solid var(--grid)' : 'none',
        outline:
          isToday && !isStart && !isEnd ? '2px solid var(--ink)' : 'none',
        outlineOffset: '-2px',
        transition: 'background 0.12s',
      }}
    >
      {/* Date number */}
      <span
        style={{
          fontSize: 13,
          fontWeight: isStart || isEnd ? 700 : 500,
          color:
            isStart || isEnd
              ? 'var(--cream)'
              : isWeekend
                ? 'var(--red)'
                : 'var(--ink)',
          ...(isStart || isEnd
            ? {
                background: 'var(--ink)',
                color: 'var(--cream)',
                borderRadius: '50%',
                width: 26,
                height: 26,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 11,
              }
            : {}),
        }}
      >
        {date.getDate()}
      </span>

      {/* Holiday dot */}
      {holiday && (
        <span
          style={{
            position: 'absolute',
            top: 5,
            left: 6,
            width: 5,
            height: 5,
            borderRadius: '50%',
            background: 'var(--red)',
          }}
          title={holiday}
        />
      )}

      {/* Sticker */}
      {sticker && (
        <div
          style={{
            position: 'absolute',
            bottom: 4,
            left: '50%',
            transform: `translateX(-50%) rotate(${sticker.rotate}deg)`,
            background: sticker.bg,
            color: sticker.color,
            padding: sticker.style === 'icon' ? '4px' : '3px 6px',
            borderRadius:
              sticker.style === 'badge'
                ? 20
                : sticker.style === 'icon'
                  ? '50%'
                  : 4,
            fontSize:
              sticker.style === 'bold'
                ? 9
                : sticker.style === 'icon'
                  ? 16
                  : sticker.style === 'handwritten'
                    ? 9
                    : 8,
            fontWeight: sticker.style === 'handwritten' ? 400 : 800,
            fontFamily:
              sticker.style === 'handwritten'
                ? '"Permanent Marker", cursive'
                : 'inherit',
            textAlign: 'center',
            lineHeight: 1.2,
            border:
              sticker.style === 'badge'
                ? '1.5px solid rgba(0,0,0,0.12)'
                : 'none',
            maxWidth: '90%',
            zIndex: 2,
            whiteSpace: 'nowrap',
            boxShadow:
              sticker.bg !== 'transparent'
                ? '0 2px 6px rgba(0,0,0,0.12)'
                : 'none',
            letterSpacing: sticker.style === 'badge' ? '0.05em' : 0,
          }}
        >
          {sticker.text}
        </div>
      )}

      {/* Today dot */}
      {isToday && !isStart && !isEnd && (
        <span
          style={{
            position: 'absolute',
            bottom: 5,
            left: '50%',
            transform: 'translateX(-50%)',
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: 'var(--ink)',
          }}
        />
      )}

      {/* Holiday tooltip */}
      {holiday && hovered && (
        <div
          style={{
            position: 'absolute',
            zIndex: 30,
            bottom: '108%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--ink)',
            color: 'var(--cream)',
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.06em',
            padding: '4px 8px',
            borderRadius: 4,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
          }}
        >
          {holiday}
        </div>
      )}

      {/* Preview blue overlay */}
      {isPreview && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(116,185,255,0.08)',
            pointerEvents: 'none',
          }}
        />
      )}
    </div>
  )
}

export default memo(DateCell)
