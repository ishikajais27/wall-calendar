'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import { useCalendarNavigation } from '../hooks/useCalendarNavigation'
import { useLocalStorageSync } from '../hooks/useLocalStorageSync'
import CalendarGrid from './CalendarGrid'
import NotesPanel from './NotesPanel'

export const HOLIDAYS = {
  '2025-0-1': "New Year's Day 🎉",
  '2025-0-14': 'Makar Sankranti 🪁',
  '2025-1-26': 'Republic Day 🇮🇳',
  '2025-2-17': 'Holi 🎨',
  '2025-3-14': 'Baisakhi 🌾',
  '2025-3-18': 'Good Friday ✝️',
  '2025-7-15': 'Independence Day 🇮🇳',
  '2025-9-2': 'Gandhi Jayanti 🕊️',
  '2025-10-1': 'Diwali 🪔',
  '2025-11-25': 'Christmas 🎄',
  '2026-0-1': "New Year's Day 🎉",
  '2026-1-26': 'Republic Day 🇮🇳',
  '2026-2-13': 'Holi 🎨',
  '2026-7-15': 'Independence Day 🇮🇳',
  '2026-9-2': 'Gandhi Jayanti 🕊️',
  '2026-11-25': 'Christmas 🎄',
}

export const MONTH_QUOTES = [
  'New year, same you — but upgraded. Set your goals, romanticise your coffee runs and post that main-character energy. The plot twist is coming.',
  'Love is in the small moments. Romanticise your February. Make it count, even the ordinary days.',
  'Spring is coming. So is your main character era. Bloom where you are planted.',
  'April showers bring bold powers. Make every rainy day a reason to stay cozy and dream bigger.',
  'May your days be filled with sunshine and the courage to chase every wild idea that crosses your mind.',
  'Summer is a mindset. Adopt it. Go outside, say yes to things, and let the golden hour be your mood.',
  "Half the year done. The other half is entirely yours. Don't waste a single golden minute.",
  "August energy: golden, relentless, unstoppable. Harvest what you planted. You've earned it.",
  'Autumn is proof that change can be breathtaking. Let go of what no longer serves you.',
  "Spooky season, brave decisions. Don't be afraid of the dark — be afraid of playing small.",
  "Gratitude is the best attitude. Count your wins, big and small. You've come so far.",
  'End the year exactly how you want the next to begin. Make it legendary.',
]

export const MONTH_EMOJIS = [
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

const STICKERS = {
  '2026-0-1': {
    text: 'HAPPY NEW YEAR',
    bg: '#f7e55b',
    color: '#1a1a1a',
    rotate: -3,
    style: 'bold',
  },
  '2026-0-3': {
    text: "DON'T WORRY BE HAPPY",
    bg: '#fd79a8',
    color: '#fff',
    rotate: 4,
    style: 'badge',
  },
  '2026-0-5': {
    text: '☯',
    bg: '#1a1a1a',
    color: '#fff',
    rotate: -2,
    style: 'icon',
  },
  '2026-0-6': {
    text: 'Book festival tickets',
    bg: 'transparent',
    color: '#0984e3',
    rotate: -1,
    style: 'handwritten',
  },
  '2026-0-7': {
    text: 'Vacation mode',
    bg: '#74b9ff',
    color: '#fff',
    rotate: 2,
    style: 'badge',
  },
  '2026-0-13': {
    text: 'AWESOME',
    bg: '#f7e55b',
    color: '#1a1a1a',
    rotate: -3,
    style: 'badge',
  },
  '2026-0-16': {
    text: 'MAKE IT A GOOD DAY',
    bg: '#55efc4',
    color: '#1a1a1a',
    rotate: 3,
    style: 'badge',
  },
  '2026-0-22': {
    text: 'Enjoy Today',
    bg: '#fd79a8',
    color: '#fff',
    rotate: -2,
    style: 'script',
  },
  '2026-0-25': {
    text: '🎫',
    bg: '#f7e55b',
    color: '#1a1a1a',
    rotate: -4,
    style: 'icon',
  },
  '2026-0-28': {
    text: 'Dinner with Emily',
    bg: 'transparent',
    color: '#6c5ce7',
    rotate: 0,
    style: 'handwritten',
  },
  '2026-0-30': {
    text: 'GOOD VIBES',
    bg: '#74b9ff',
    color: '#fff',
    rotate: 2,
    style: 'badge',
  },
}

function getWeekBounds(date) {
  const d = new Date(date)
  const day = d.getDay()
  const sun = new Date(d)
  sun.setDate(d.getDate() - day)
  const sat = new Date(d)
  sat.setDate(d.getDate() + (6 - day))
  return { sun, sat }
}

export default function Calendar() {
  const today = new Date()
  const { cur, year, month, days, goToMonth } = useCalendarNavigation(today)
  const [notes, setNotes] = useLocalStorageSync('wcal-notes-v2', {})

  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [hoverDate, setHoverDate] = useState(null)
  const [lastRange, setLastRange] = useState(null)
  const [pinnedNotes, setPinnedNotes] = useLocalStorageSync(
    'wcal-pinned-v2',
    {},
  )
  const [notesOpen, setNotesOpen] = useState(false) // mobile bottom sheet
  const [anim, setAnim] = useState('')
  const pending = useRef(null)
  const touchStartX = useRef(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // Keyboard accessibility
  useEffect(() => {
    function onKey(e) {
      if (!startDate || endDate) return
      if (e.key === 'Escape') {
        setStartDate(null)
        setEndDate(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [startDate, endDate])

  const monthKey = `${year}-${month}`
  const rangeKey =
    startDate && endDate
      ? `${startDate.toISOString().slice(0, 10)}:${endDate.toISOString().slice(0, 10)}`
      : null

  const activeNote =
    rangeKey && pinnedNotes[rangeKey] != null
      ? pinnedNotes[rangeKey]
      : notes[monthKey] || ''

  function setActiveNote(val) {
    if (rangeKey) setPinnedNotes((p) => ({ ...p, [rangeKey]: val }))
    else setNotes((p) => ({ ...p, [monthKey]: val }))
  }

  // Weekend detection
  const isWeekendGetaway =
    startDate &&
    endDate &&
    (startDate.getDay() === 6 || startDate.getDay() === 0) &&
    (endDate.getDay() === 6 || endDate.getDay() === 0) &&
    Math.round(Math.abs(endDate - startDate) / 86400000) <= 2

  function handleDayClick(date) {
    if (!startDate || (startDate && endDate)) {
      setStartDate(date)
      setEndDate(null)
    } else {
      if (date.toDateString() === startDate.toDateString()) {
        setStartDate(null)
        return
      }
      const [s, e] = date < startDate ? [date, startDate] : [startDate, date]
      setStartDate(s)
      setEndDate(e)
      setLastRange({ start: s, end: e })
    }
  }

  function applyPreset(preset) {
    const t = new Date()
    if (preset === 'week') {
      const { sun, sat } = getWeekBounds(t)
      setStartDate(sun)
      setEndDate(sat)
    } else if (preset === 'next7') {
      const end = new Date(t)
      end.setDate(t.getDate() + 6)
      setStartDate(new Date(t))
      setEndDate(end)
    } else if (preset === 'last' && lastRange) {
      setStartDate(lastRange.start)
      setEndDate(lastRange.end)
    }
  }

  function changeMonth(dir) {
    if (anim) return
    setAnim('flip-out')
    pending.current = dir
    setTimeout(() => {
      goToMonth(pending.current)
      setStartDate(null)
      setEndDate(null)
      setHoverDate(null)
      setAnim('flip-in')
      setTimeout(() => setAnim(''), 360)
    }, 280)
  }

  // Touch swipe
  function onTouchStart(e) {
    touchStartX.current = e.touches[0].clientX
  }
  function onTouchEnd(e) {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(dx) > 50) changeMonth(dx < 0 ? 1 : -1)
    touchStartX.current = null
  }

  return (
    <div style={{ width: '100%', maxWidth: 980, position: 'relative' }}>
      <div
        style={{
          background: 'var(--cream)',
          borderRadius: 4,
          boxShadow: '0 12px 48px rgba(0,0,0,0.22), 0 2px 8px rgba(0,0,0,0.1)',
          border: '1.5px solid #c0bcb4',
          overflow: 'hidden',
        }}
      >
        {/* ── HEADER ── */}
        <div
          style={{
            padding: isMobile ? '20px 16px 0' : '28px 36px 0',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap',
            position: 'relative',
          }}
        >
          {/* Left: Month title + nav */}
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
            <h1
              style={{
                fontFamily: '"Permanent Marker", cursive',
                fontSize: isMobile ? 52 : 80,
                color: 'var(--ink)',
                lineHeight: 0.9,
                letterSpacing: '-2px',
              }}
            >
              {MONTHS[month]}
            </h1>
            <div
              style={{
                paddingBottom: 8,
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
              }}
            >
              <button
                onClick={() => changeMonth(-1)}
                aria-label="Previous month"
                style={navBtn}
              >
                ‹
              </button>
              <button
                onClick={() => changeMonth(1)}
                aria-label="Next month"
                style={navBtn}
              >
                ›
              </button>
            </div>
          </div>

          {/* Right: Quote + year + deco */}
          <div style={{ maxWidth: 300, paddingTop: 8, position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                top: -4,
                right: -8,
                fontSize: 32,
                color: 'var(--ink)',
                lineHeight: 1,
              }}
            >
              ✳
            </div>
            <div
              style={{
                position: 'absolute',
                top: 14,
                right: 12,
                fontSize: 14,
                color: 'var(--ink)',
                lineHeight: 1,
                transform: 'rotate(15deg)',
              }}
            >
              ✳
            </div>
            <p
              style={{
                fontSize: 10,
                fontWeight: 500,
                lineHeight: 1.7,
                color: '#444',
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
              }}
            >
              {MONTH_QUOTES[month]}
            </p>
            <p
              style={{
                fontSize: 28,
                fontWeight: 900,
                color: 'var(--ink)',
                marginTop: 8,
                letterSpacing: '0.1em',
              }}
            >
              {year}
            </p>
          </div>
        </div>

        {/* Presets */}
        <div
          style={{
            padding: isMobile ? '8px 16px' : '10px 36px',
            display: 'flex',
            gap: 6,
            flexWrap: 'wrap',
          }}
        >
          {[
            ['week', 'This Week'],
            ['next7', 'Next 7 Days'],
            ['last', 'Last Selection'],
          ].map(([k, label]) => (
            <button
              key={k}
              onClick={() => applyPreset(k)}
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.1em',
                padding: '4px 10px',
                borderRadius: 20,
                border: '1.5px solid var(--ink)',
                background: 'transparent',
                cursor: 'pointer',
                color: 'var(--ink)',
                textTransform: 'uppercase',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--ink)'
                e.currentTarget.style.color = 'var(--cream)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = 'var(--ink)'
              }}
            >
              {label}
            </button>
          ))}
          {isWeekendGetaway && (
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: 20,
                background: 'var(--yellow)',
                color: 'var(--ink)',
              }}
            >
              Weekend Getaway Detected 🌴
            </span>
          )}
        </div>

        {/* Divider */}
        <div style={{ height: 2, background: 'var(--ink)', margin: '0' }} />

        {/* ── BODY ── */}
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {/* Calendar side */}
          <div
            className={`${anim} ripped-edge`}
            style={{
              flex: '1 1 580px',
              position: 'relative',
              borderRight: isMobile ? 'none' : '2px solid var(--ink)',
            }}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <CalendarGrid
              days={days}
              year={year}
              month={month}
              startDate={startDate}
              endDate={endDate}
              hoverDate={hoverDate}
              setHoverDate={setHoverDate}
              onDayClick={handleDayClick}
              stickers={STICKERS}
            />
          </div>

          {/* Notes — desktop */}
          {!isMobile && (
            <div style={{ flex: '1 1 200px', minWidth: 180 }}>
              <NotesPanel
                notes={activeNote}
                onChange={setActiveNote}
                startDate={startDate}
                endDate={endDate}
                rangeKey={rangeKey}
              />
            </div>
          )}
        </div>

        {/* Bottom strip */}
        <div style={{ height: 10, background: 'var(--ink)' }} />
      </div>

      {/* ── Mobile Bottom Sheet ── */}
      {isMobile && (
        <div className={`bottom-sheet ${notesOpen ? 'open' : ''}`}>
          <div
            onClick={() => setNotesOpen((o) => !o)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px 0',
              cursor: 'pointer',
              gap: 8,
            }}
          >
            <div
              style={{
                width: 40,
                height: 4,
                borderRadius: 2,
                background: '#c0bcb4',
              }}
            />
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--ink)',
              }}
            >
              📝 Notes {notesOpen ? '▼' : '▲'}
            </span>
          </div>
          <NotesPanel
            notes={activeNote}
            onChange={setActiveNote}
            startDate={startDate}
            endDate={endDate}
            rangeKey={rangeKey}
          />
        </div>
      )}
    </div>
  )
}

const navBtn = {
  width: 28,
  height: 28,
  borderRadius: '50%',
  border: '1.5px solid var(--ink)',
  background: 'transparent',
  cursor: 'pointer',
  fontSize: 16,
  fontWeight: 700,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'var(--ink)',
  lineHeight: 1,
}
