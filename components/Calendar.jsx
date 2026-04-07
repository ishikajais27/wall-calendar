'use client'
import { useState, useEffect, useRef } from 'react'
import HeroImage from './HeroImage'
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
    setAnim('page-flip-out')
    pending.current = dir
    setTimeout(() => {
      setCur(
        (p) => new Date(p.getFullYear(), p.getMonth() + pending.current, 1),
      )
      setStartDate(null)
      setEndDate(null)
      setAnim('page-flip-in')
      setTimeout(() => setAnim(''), 400)
    }, 350)
  }

  return (
    <div
      className="w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl"
      style={{
        background: 'linear-gradient(135deg,#fdf8f0,#f5ede0)',
        border: '1px solid #d4c4a8',
        boxShadow: '0 20px 60px rgba(0,0,0,.28),0 4px 12px rgba(0,0,0,.15)',
      }}
    >
      {/* Spiral binding */}
      <div
        className="flex justify-around px-8 py-2 items-center"
        style={{ background: 'linear-gradient(to bottom,#b8a888,#c8b89a)' }}
      >
        {Array.from({ length: 18 }).map((_, i) => (
          <div
            key={i}
            className="w-5 h-5 rounded-full border-2 shadow-inner"
            style={{
              borderColor: '#7a6448',
              background: 'radial-gradient(circle at 35% 35%,#c8a87a,#8b6e4a)',
            }}
          />
        ))}
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Left: Hero + Notes */}
        <div
          className="flex flex-col lg:w-72 flex-shrink-0"
          style={{ borderRight: '1px solid #d4c4a8' }}
        >
          <HeroImage month={cur.getMonth()} year={cur.getFullYear()} />
          <NotesPanel
            notes={notes[monthKey] || ''}
            onChange={(val) => setNotes((p) => ({ ...p, [monthKey]: val }))}
            startDate={startDate}
            endDate={endDate}
          />
        </div>

        {/* Right: Calendar */}
        <div
          className={`flex-1 p-6 ${anim}`}
          style={{ transformOrigin: 'top center', perspective: '1200px' }}
        >
          <CalendarGrid
            currentDate={cur}
            startDate={startDate}
            endDate={endDate}
            onDayClick={handleDayClick}
            onChangeMonth={changeMonth}
          />
        </div>
      </div>

      <div
        className="h-3"
        style={{ background: 'linear-gradient(to bottom,#d4c4a8,#b8a888)' }}
      />
    </div>
  )
}
