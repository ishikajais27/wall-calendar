'use client'
import { useState, useRef, useEffect } from 'react'
import { useCalendarNavigation } from '../hooks/useCalendarNavigation'
import { useLocalStorageSync } from '../hooks/useLocalStorageSync'
import HeroImage from './HeroImage'
import CalendarGrid from './CalendarGrid'

export const HOLIDAYS = {
  '2025-0-1': "New Year's Day 🎉",
  '2025-0-26': 'Republic Day 🇮🇳',
  '2025-7-15': 'Independence Day 🇮🇳',
  '2025-9-2': 'Gandhi Jayanti 🕊️',
  '2025-11-25': 'Christmas 🎄',
  '2026-0-1': "New Year's Day 🎉",
  '2026-1-26': 'Republic Day 🇮🇳',
  '2026-2-13': 'Holi 🎨',
  '2026-7-15': 'Independence Day 🇮🇳',
  '2026-9-2': 'Gandhi Jayanti 🕊️',
  '2026-11-25': 'Christmas 🎄',
}
export const MONTHS = [
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

const MONTH_EMOJIS = [
  '🎄',
  '❄️',
  '💝',
  '🌸',
  '🌻',
  '☀️',
  '🏖️',
  '🍂',
  '🎃',
  '🦃',
  '🍁',
  '❅',
]

export default function Calendar() {
  const { year, month, days, goToMonth } = useCalendarNavigation(new Date())
  const [dateNotes, setDateNotes] = useLocalStorageSync('wcal-date-notes', {})
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [hoverDate, setHoverDate] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [noteText, setNoteText] = useState('')
  const [anim, setAnim] = useState('')
  const [previewDate, setPreviewDate] = useState(null)
  const pending = useRef(null)
  const touchX = useRef(null)

  const isWeekend =
    startDate &&
    endDate &&
    [0, 6].includes(startDate.getDay()) &&
    [0, 6].includes(endDate.getDay()) &&
    Math.abs(endDate - startDate) / 86400000 <= 2

  useEffect(() => {
    const fn = (e) => {
      if (e.key === 'Escape') {
        setStartDate(null)
        setEndDate(null)
        setSelectedDate(null)
      }
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [])

  const clickDay = (date) => {
    if (!startDate || endDate) {
      setStartDate(date)
      setEndDate(null)
      setPreviewDate(null)
    } else {
      if (date.toDateString() === startDate.toDateString()) {
        setStartDate(null)
        return
      }
      const [s, e] = date < startDate ? [date, startDate] : [startDate, date]
      setStartDate(s)
      setEndDate(e)
    }
    const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
    setSelectedDate(date)
    setNoteText(dateNotes[key] || '')
  }

  const onHoverDay = (date) => {
    if (startDate && !endDate) setPreviewDate(date)
  }

  const flip = (dir) => {
    if (anim) return
    setAnim('peel-up')
    pending.current = dir
    setTimeout(() => {
      goToMonth(pending.current)
      setStartDate(null)
      setEndDate(null)
      setSelectedDate(null)
      setAnim('peel-down')
      setTimeout(() => setAnim(''), 400)
    }, 300)
  }

  const saveNote = () => {
    if (!selectedDate) return
    const key = `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`
    noteText.trim()
      ? setDateNotes((p) => ({ ...p, [key]: noteText }))
      : setDateNotes((p) => {
          delete p[key]
          return { ...p }
        })
  }

  const onTS = (e) => {
    touchX.current = e.touches[0].clientX
  }
  const onTE = (e) => {
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 50) flip(dx < 0 ? 1 : -1)
    touchX.current = null
  }

  const btnStyle = {
    padding: '6px 12px',
    background: '#4CAF50',
    color: '#fff',
    border: 'none',
    borderRadius: 3,
    fontSize: 10,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.25s ease',
  }
  const noteKey = selectedDate
    ? `${selectedDate.getFullYear()}-${selectedDate.getMonth()}-${selectedDate.getDate()}`
    : null

  return (
    <div
      className="calendar-container"
      style={{ width: '100%', maxWidth: 520, margin: '0 auto' }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: -6,
          zIndex: 10,
        }}
      >
        <div
          style={{
            width: 50,
            height: 10,
            background: 'linear-gradient(90deg, #999, #aaa, #999)',
            borderRadius: '50% 50% 0 0',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          }}
        />
      </div>

      <div className="spiral" style={{ borderRadius: '6px 6px 0 0' }}>
        {Array.from({ length: 10 }, (_, i) => (
          <i key={i} />
        ))}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          background: '#f8f8f8',
          padding: '6px 16px',
          borderBottom: '1px solid #e0e0e0',
          fontSize: '9px',
          fontWeight: 600,
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, color: '#4CAF50', fontWeight: 700 }}>
            {Object.keys(dateNotes).length}
          </div>
          Saved Notes
        </div>
      </div>

      <div
        className="calendar-card-hover"
        style={{
          background: 'linear-gradient(180deg, #fafafa 0%, #f5f2ed 100%)',
          boxShadow: '0 12px 40px rgba(0,0,0,.12)',
          overflow: 'hidden',
          borderRadius: '0 0 6px 6px',
          border: '1px solid rgba(213, 180, 150, 0.2)',
        }}
      >
        <div className={anim}>
          <HeroImage month={month} year={year} />
        </div>

        <div
          style={{
            padding: '14px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid rgba(200, 160, 120, 0.15)',
          }}
        >
          <button
            className="arrow"
            onClick={() => flip(-1)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 24,
              cursor: 'pointer',
              transition: 'all 0.3s',
              color: '#8b6f47',
            }}
            onMouseOver={(e) =>
              (e.target.style.transform = 'scale(1.25) rotate(-15deg)')
            }
            onMouseOut={(e) =>
              (e.target.style.transform = 'scale(1) rotate(0deg)')
            }
          >
            ‹
          </button>
          <h1
            style={{
              fontFamily: 'var(--font-caveat)',
              fontSize: 34,
              fontWeight: 700,
              margin: 0,
              color: '#5d4e37',
              letterSpacing: '-0.5px',
            }}
          >
            {MONTH_EMOJIS[month]} {MONTHS[month]}
          </h1>
          <button
            className="arrow"
            onClick={() => flip(1)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 24,
              cursor: 'pointer',
              transition: 'all 0.3s',
              color: '#8b6f47',
            }}
            onMouseOver={(e) =>
              (e.target.style.transform = 'scale(1.25) rotate(15deg)')
            }
            onMouseOut={(e) =>
              (e.target.style.transform = 'scale(1) rotate(0deg)')
            }
          >
            ›
          </button>
        </div>

        <div style={{ padding: '10px 14px' }}>
          <div
            style={{
              display: 'flex',
              gap: 8,
              marginBottom: 8,
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={() => {
                const sun = new Date()
                sun.setDate(sun.getDate() - sun.getDay())
                const sat = new Date()
                sat.setDate(sat.getDate() + (6 - sat.getDay()))
                setStartDate(sun)
                setEndDate(sat)
              }}
              style={{
                fontSize: 9,
                padding: '6px 12px',
                background: 'linear-gradient(135deg, #f5e6d3 0%, #ede0cf 100%)',
                border: '1px solid rgba(213, 180, 150, 0.4)',
                borderRadius: 6,
                cursor: 'pointer',
                fontWeight: 600,
                color: '#8b6f47',
                transition: 'all 0.25s',
                boxShadow: '0 2px 6px rgba(200, 160, 120, 0.1)',
              }}
              onMouseOver={(e) => {
                e.target.style.boxShadow =
                  '0 6px 16px rgba(200, 160, 120, 0.25)'
                e.target.style.transform = 'translateY(-2px)'
              }}
              onMouseOut={(e) => {
                e.target.style.boxShadow = '0 2px 6px rgba(200, 160, 120, 0.1)'
                e.target.style.transform = 'translateY(0)'
              }}
            >
              📅 Week
            </button>
            <button
              onClick={() => {
                const e = new Date()
                e.setDate(e.getDate() + 6)
                setStartDate(new Date())
                setEndDate(e)
              }}
              style={{
                fontSize: 9,
                padding: '6px 12px',
                background: 'linear-gradient(135deg, #f0e0d8 0%, #e8d5ca 100%)',
                border: '1px solid rgba(200, 160, 120, 0.4)',
                borderRadius: 6,
                cursor: 'pointer',
                fontWeight: 600,
                color: '#8b6f47',
                transition: 'all 0.25s',
                boxShadow: '0 2px 6px rgba(200, 160, 120, 0.1)',
              }}
              onMouseOver={(e) => {
                e.target.style.boxShadow =
                  '0 6px 16px rgba(200, 160, 120, 0.25)'
                e.target.style.transform = 'translateY(-2px)'
              }}
              onMouseOut={(e) => {
                e.target.style.boxShadow = '0 2px 6px rgba(200, 160, 120, 0.1)'
                e.target.style.transform = 'translateY(0)'
              }}
            >
              📆 Next 7
            </button>
            {isWeekend && (
              <span
                style={{
                  fontSize: 8,
                  padding: '6px 10px',
                  background:
                    'linear-gradient(135deg, #f5e0b8 0%, #ede0cf 100%)',
                  border: '1px solid rgba(213, 180, 150, 0.5)',
                  borderRadius: 6,
                  fontWeight: 700,
                  color: '#8b6f47',
                }}
              >
                🌴 Weekend
              </span>
            )}
          </div>
        </div>

        <div
          style={{ padding: '0 14px' }}
          onTouchStart={onTS}
          onTouchEnd={onTE}
        >
          <CalendarGrid
            days={days}
            month={month}
            year={year}
            startDate={startDate}
            endDate={endDate}
            hoverDate={previewDate || hoverDate}
            setHoverDate={onHoverDay}
            onDayClick={clickDay}
            dateNotes={dateNotes}
          />
        </div>

        {selectedDate && (
          <div
            style={{
              padding: '12px 14px',
              borderTop: '1px solid rgba(200, 160, 120, 0.2)',
              background:
                'linear-gradient(135deg, rgba(213, 180, 150, 0.04), rgba(200, 160, 120, 0.04))',
              animation: 'slideIn 0.35s ease-out',
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                marginBottom: 8,
                color: '#8b6f47',
                fontFamily: 'var(--font-poppins)',
              }}
            >
              📝{' '}
              {selectedDate.toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                weekday: 'short',
              })}
            </div>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Your note..."
              style={{
                width: '100%',
                height: 50,
                padding: '10px',
                border: '1.5px solid rgba(213, 180, 150, 0.3)',
                borderRadius: 6,
                fontSize: 11,
                fontFamily: 'var(--font-caveat)',
                resize: 'none',
                transition: 'all 0.25s',
                background:
                  'linear-gradient(135deg, rgba(255,255,255,0.8), rgba(250,248,243,0.8))',
                color: '#5d4e37',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'rgba(213, 180, 150, 0.6)'
                e.target.style.boxShadow = '0 0 0 3px rgba(213, 180, 150, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(213, 180, 150, 0.3)'
                e.target.style.boxShadow = 'none'
              }}
            />
            <div
              style={{
                marginTop: 10,
                display: 'flex',
                gap: 8,
                alignItems: 'center',
              }}
            >
              <button
                onClick={saveNote}
                style={{
                  padding: '6px 14px',
                  background:
                    'linear-gradient(135deg, #d5b496 0%, #c8a080 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 6,
                  fontSize: 10,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.25s',
                  boxShadow: '0 4px 12px rgba(200, 160, 120, 0.3)',
                  fontFamily: 'var(--font-poppins)',
                }}
                onMouseOver={(e) => {
                  e.target.style.boxShadow =
                    '0 8px 24px rgba(200, 160, 120, 0.45)'
                  e.target.style.transform = 'translateY(-3px)'
                }}
                onMouseOut={(e) => {
                  e.target.style.boxShadow =
                    '0 4px 12px rgba(200, 160, 120, 0.3)'
                  e.target.style.transform = 'translateY(0)'
                }}
              >
                Save
              </button>
              {dateNotes[noteKey] && (
                <span
                  style={{
                    fontSize: 9,
                    color: '#8b6f47',
                    fontWeight: 700,
                    animation: 'pulse-soft 1.5s infinite',
                    fontFamily: 'var(--font-poppins)',
                  }}
                >
                  ✓ Saved
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
