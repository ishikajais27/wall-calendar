'use client'
import { useState, useEffect, useRef } from 'react'
import CalendarGrid from './CalendarGrid'
import NotesPanel from './NotesPanel'

export const HOLIDAYS = {
  '2025-0-1': "New Year's Day",
  '2025-0-14': 'Makar Sankranti',
  '2025-1-26': 'Republic Day',
  '2025-2-17': 'Holi',
  '2025-3-14': 'Baisakhi',
  '2025-3-18': 'Good Friday',
  '2025-7-15': 'Independence Day',
  '2025-9-2': 'Gandhi Jayanti',
  '2025-10-1': 'Diwali',
  '2025-11-25': 'Christmas',
  '2026-0-1': "New Year's Day",
  '2026-1-26': 'Republic Day',
  '2026-2-13': 'Holi',
  '2026-7-15': 'Independence Day',
  '2026-9-2': 'Gandhi Jayanti',
  '2026-11-25': 'Christmas',
}

const MONTH_QUOTES = [
  'New year, same you — but upgraded. Start messy if you have to. Just start.',
  'Love is in the details. Romanticise the small stuff.',
  'Spring is coming. So is your main character era.',
  'April showers, bold powers. Make it count.',
  'Bloom where you are planted. No excuses.',
  'Summer is a mindset. Adopt it.',
  'Half the year done. The other half is yours.',
  'August energy: golden, relentless, unstoppable.',
  'Autumn is proof that change can be beautiful.',
  'Spooky season, brave decisions. Go for it.',
  'Gratitude is the best attitude. Count your wins.',
  'End the year how you want the next to begin.',
]

const MONTH_EMOJIS = [
  '❄️',
  '🌸',
  '🌿',
  '🌧️',
  '🌺',
  '☀️',
  '🏖️',
  '🌻',
  '🍂',
  '🎃',
  '🍁',
  '🎄',
]

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

export default function Calendar() {
  const today = new Date()
  const [cur, setCur] = useState(today)
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [notes, setNotes] = useState({})
  const [anim, setAnim] = useState('')
  const pending = useRef(null)

  useEffect(() => {
    try {
      const s = localStorage.getItem('wcal-notes')
      if (s) setNotes(JSON.parse(s))
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('wcal-notes', JSON.stringify(notes))
    } catch {}
  }, [notes])

  const monthKey = `${cur.getFullYear()}-${cur.getMonth()}`

  function handleDayClick(date) {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date)
      setEndDate(null)
    } else {
      if (date.toDateString() === startDate.toDateString()) {
        setStartDate(null)
        return
      }
      if (date < startDate) {
        setEndDate(startDate)
        setStartDate(date)
      } else setEndDate(date)
    }
  }

  function changeMonth(dir) {
    if (anim) return
    setAnim('flip-out')
    pending.current = dir
    setTimeout(() => {
      setCur(
        (p) => new Date(p.getFullYear(), p.getMonth() + pending.current, 1),
      )
      setStartDate(null)
      setEndDate(null)
      setAnim('flip-in')
      setTimeout(() => setAnim(''), 400)
    }, 300)
  }

  const month = cur.getMonth()
  const year = cur.getFullYear()

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '960px',
        background: '#f0ece3',
        borderRadius: '4px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.12)',
        overflow: 'hidden',
        border: '1px solid #d0ccc4',
        position: 'relative',
      }}
    >
      {/* Top header area */}
      <div
        style={{
          background: '#f0ece3',
          padding: '28px 32px 0',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        {/* Month title + nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={() => changeMonth(-1)}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: '2px solid #1a1a1a',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: '#1a1a1a',
              transition: 'all 0.2s',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1a1a1a'
              e.currentTarget.style.color = '#f0ece3'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#1a1a1a'
            }}
          >
            ‹
          </button>

          <div>
            <h1
              style={{
                fontFamily: '"Permanent Marker", cursive',
                fontSize: 'clamp(42px, 7vw, 72px)',
                color: '#1a1a1a',
                margin: 0,
                lineHeight: 1,
                letterSpacing: '-1px',
              }}
            >
              {MONTHS[month]}
            </h1>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginTop: 4,
              }}
            >
              <span style={{ fontSize: 20 }}>{MONTH_EMOJIS[month]}</span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: '0.2em',
                  color: '#555',
                  textTransform: 'uppercase',
                }}
              >
                {year}
              </span>
            </div>
          </div>

          <button
            onClick={() => changeMonth(1)}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: '2px solid #1a1a1a',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: 18,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              color: '#1a1a1a',
              transition: 'all 0.2s',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1a1a1a'
              e.currentTarget.style.color = '#f0ece3'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent'
              e.currentTarget.style.color = '#1a1a1a'
            }}
          >
            ›
          </button>
        </div>

        {/* Quote + deco */}
        <div style={{ maxWidth: 280, paddingTop: 8, position: 'relative' }}>
          {/* Asterisk deco */}
          <div
            style={{
              position: 'absolute',
              top: -8,
              right: -16,
              fontSize: 28,
              color: '#1a1a1a',
              fontWeight: 900,
              lineHeight: 1,
            }}
          >
            ✳
          </div>
          <p
            style={{
              fontSize: 11,
              fontWeight: 500,
              lineHeight: 1.6,
              color: '#444',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              margin: 0,
            }}
          >
            {MONTH_QUOTES[month]}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 2, background: '#1a1a1a', margin: '16px 0 0' }} />

      {/* Main body */}
      <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
        {/* Calendar grid */}
        <div
          className={`calendar-page ${anim}`}
          style={{
            flex: '1 1 580px',
            position: 'relative',
            borderRight: '2px solid #1a1a1a',
          }}
        >
          <CalendarGrid
            currentDate={cur}
            startDate={startDate}
            endDate={endDate}
            onDayClick={handleDayClick}
          />
          {/* Page fold corner */}
          <div className="page-fold" />
        </div>

        {/* Notes panel */}
        <div style={{ flex: '1 1 200px', minWidth: 180 }}>
          <NotesPanel
            notes={notes[monthKey] || ''}
            onChange={(val) => setNotes((p) => ({ ...p, [monthKey]: val }))}
            startDate={startDate}
            endDate={endDate}
          />
        </div>
      </div>

      {/* Bottom strip */}
      <div style={{ height: 8, background: '#1a1a1a' }} />
    </div>
  )
}
