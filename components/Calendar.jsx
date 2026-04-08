
'use client'
import { useState, useEffect, useMemo } from 'react'
import { useLocalStorageSync } from '../hooks/useLocalStorageSync'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const HOLIDAYS = {
  '2026-0-1': "New Year's 🎉",
  '2026-1-26': 'Republic Day 🇮🇳',
  '2026-2-13': 'Holi 🎨',
  '2026-7-15': 'Independence 🇮🇳',
  '2026-9-2': 'Gandhi Jayanti',
  '2026-11-25': 'Christmas 🎄',
}

const today = new Date()
const dk = (d) => `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
const same = (a, b) => a && b && a.toDateString() === b.toDateString()

const THEMES = [
  { accent: '#7a9a8a', heroGrad: 'linear-gradient(155deg,#c8d4c0 0%,#a8b89a 100%)', cardBg: 'rgba(242,248,240,0.80)', border: 'rgba(122,154,138,0.22)', sub: '#5a6a56' },
  { accent: '#7a9ab8', heroGrad: 'linear-gradient(155deg,#b8ccd8 0%,#90aac0 100%)', cardBg: 'rgba(238,244,252,0.80)', border: 'rgba(120,150,180,0.22)', sub: '#4a6070' },
  { accent: '#9a8878', heroGrad: 'linear-gradient(155deg,#d8c8b8 0%,#b8a898 100%)', cardBg: 'rgba(252,248,244,0.80)', border: 'rgba(154,136,120,0.22)', sub: '#6a5848' },
  { accent: '#7a9a6a', heroGrad: 'linear-gradient(155deg,#b8d0a8 0%,#90ba80 100%)', cardBg: 'rgba(240,250,235,0.80)', border: 'rgba(122,154,106,0.22)', sub: '#4a6038' },
  { accent: '#7a98a8', heroGrad: 'linear-gradient(155deg,#b0c8d8 0%,#8aaac0 100%)', cardBg: 'rgba(236,244,250,0.80)', border: 'rgba(118,148,168,0.22)', sub: '#486070' },
  { accent: '#9a7ab0', heroGrad: 'linear-gradient(155deg,#c8b0d8 0%,#a888c8 100%)', cardBg: 'rgba(248,242,255,0.80)', border: 'rgba(154,120,176,0.22)', sub: '#624870' },
  { accent: '#7a9a6a', heroGrad: 'linear-gradient(155deg,#c0ceb8 0%,#9aae8a 100%)', cardBg: 'rgba(240,248,238,0.80)', border: 'rgba(122,154,106,0.22)', sub: '#4a6040' },
  { accent: '#8aaa7a', heroGrad: 'linear-gradient(155deg,#c0d8b0 0%,#98c088 100%)', cardBg: 'rgba(238,250,234,0.80)', border: 'rgba(138,170,122,0.22)', sub: '#486038' },
]

const DEFAULT_BG = 0
const TOTAL_BGS = 8
const CUR_YEAR = today.getFullYear()
const YEAR_OPTIONS = Array.from({ length: 11 }, (_, i) => CUR_YEAR - 5 + i)

export { HOLIDAYS }

export default function Calendar() {
  const [selectedYear, setSelectedYear] = useState(CUR_YEAR)
  const [month, setMonth] = useState(today.getMonth())
  const year = selectedYear

  const days = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay()
    const total = new Date(year, month + 1, 0).getDate()
    const cells = []
    for (let i = 0; i < firstDay; i++) cells.push(null)
    for (let d = 1; d <= total; d++) cells.push(new Date(year, month, d))
    while (cells.length % 7 !== 0) cells.push(null)
    return cells
  }, [year, month])

  const goToMonth = (dir) => {
    setMonth(prev => {
      const next = prev + dir
      if (next < 0) { setSelectedYear(y => y - 1); return 11 }
      if (next > 11) { setSelectedYear(y => y + 1); return 0 }
      return next
    })
  }

  const [notes, setNotes] = useLocalStorageSync('wcal-v5', {})
  const [moods, setMoods] = useLocalStorageSync('wcal-moods', {})
  const [start, setStart] = useState(null)
  const [end, setEnd] = useState(null)
  const [hover, setHover] = useState(null)
  const [sel, setSel] = useState(null)
  const [note, setNote] = useState('')
  const [flipping, setFlipping] = useState(false)
  const [tab, setTab] = useState('cal')
  const [moodPick, setMoodPick] = useState(null)
  const [bgIdx, setBgIdx] = useLocalStorageSync('wcal-bg', DEFAULT_BG)

  useEffect(() => {
    const old = document.getElementById('app-bg')
    if (old) old.remove()
    const src = `/bg/bg${bgIdx + 1}.png`
    const BG_COLORS = ['#edeef0', '#dce6ef', '#ede8e2', '#d6e8c8', '#d8d0c2', '#c4a8d4', '#7a9060', '#b8d4a0']
    const BG_POSITIONS = ['center top', 'center top', 'center top', 'right bottom', 'center bottom', 'center bottom', 'left bottom', 'right bottom']
    const BG_SIZES = ['cover', 'cover', '100%', '100%', '80%', '80%', '100%', '80%']
    const bgDiv = document.createElement('div')
    bgDiv.id = 'app-bg'
    bgDiv.style.cssText = `position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:-9999;pointer-events:none;overflow:hidden;background:${BG_COLORS[bgIdx]};`
    const imgEl = document.createElement('div')
    imgEl.style.cssText = `position:absolute;inset:0;background-image:url(${src});background-size:${BG_SIZES[bgIdx]};background-position:${BG_POSITIONS[bgIdx]};background-repeat:no-repeat;width:100%;height:100%;`
    bgDiv.appendChild(imgEl)
    document.documentElement.appendChild(bgDiv)
    return () => { const el = document.getElementById('app-bg'); if (el) el.remove() }
  }, [bgIdx])

  const { accent, heroGrad, cardBg, border, sub } = THEMES[bgIdx] ?? THEMES[DEFAULT_BG]
  const textMain = '#0d0d0d'

  useEffect(() => {
    const fn = (e) => { if (e.key === 'Escape') { setStart(null); setEnd(null); setSel(null) } }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [])

  const flip = (dir) => {
    if (flipping) return
    setFlipping(true)
    setTimeout(() => {
      goToMonth(dir)
      setStart(null); setEnd(null); setSel(null)
      setFlipping(false)
    }, 420)
  }

  const clickDay = (date) => {
    if (!start || end) { setStart(date); setEnd(null) }
    else {
      if (same(date, start)) { setStart(null); setSel(null); return }
      const [s, e] = date < start ? [date, start] : [start, date]
      setStart(s); setEnd(e)
    }
    setSel(date)
    setNote(notes[dk(date)] || '')
  }

  const save = () => {
    if (!sel) return
    const k = dk(sel)
    note.trim()
      ? setNotes((p) => ({ ...p, [k]: note }))
      : setNotes((p) => { const n = { ...p }; delete n[k]; return n })
    if (moodPick) setMoods((p) => ({ ...p, [k]: moodPick }))
  }

  const diff = start && end ? Math.round(Math.abs(end - start) / 86400000) + 1 : null
  const MOODS = ['😊', '😐', '😔', '🔥', '🌿', '✨']

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,500;1,300&family=DM+Sans:wght@300;400;500;600&family=Caveat:wght@500;600&display=swap');
        .ring::after{content:'';position:absolute;bottom:-3px;left:50%;transform:translateX(-50%);width:1.5px;height:4px;background:#a0a098}
        .cell:hover:not(.empty){background:${accent}22!important;transform:scale(1.06)}
        .chip:hover{background:${accent}28!important;transform:translateY(-1px)}
        .arrow:hover{background:rgba(255,255,255,0.5)!important}
        .tab:hover{opacity:0.8}
        .mood-btn:hover{transform:scale(1.2)}
        .save-btn:hover{transform:translateY(-1px);box-shadow:0 6px 20px ${accent}55!important}
        .note-row:hover{background:${accent}10!important;border-radius:8px}
        .bg-swatch:hover{transform:scale(1.15)}
        .year-select:focus{outline:none}
        .today-glow{box-shadow:0 0 0 2.5px ${accent}80}
      `}</style>

      <div style={{ width: 520, fontFamily: "'DM Sans',sans-serif" }}>

        {/* BG Picker */}
        <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {Array.from({ length: TOTAL_BGS }, (_, i) => (
            <div key={i} className="bg-swatch" title={`bg${i + 1}`} onClick={() => setBgIdx(i)}
              style={{
                width: 26, height: 26, borderRadius: '50%', cursor: 'pointer', background: THEMES[i].heroGrad,
                outline: bgIdx === i ? `2.5px solid ${THEMES[i].accent}` : '2px solid rgba(255,255,255,0.4)',
                transition: 'transform 0.15s,outline 0.15s', boxShadow: '0 1px 4px rgba(0,0,0,0.15)'
              }} />
          ))}
          <div onClick={() => setBgIdx(DEFAULT_BG)}
            style={{
              padding: '3px 10px', borderRadius: 12, background: 'rgba(255,255,255,0.35)',
              border: `1px solid ${accent}50`, cursor: 'pointer', fontSize: 11, color: accent, fontWeight: 700, backdropFilter: 'blur(4px)'
            }}>
            Default
          </div>
        </div>

        {/* Year Picker */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
          <select
            className="year-select"
            value={selectedYear}
            onChange={e => { setSelectedYear(Number(e.target.value)); setStart(null); setEnd(null); setSel(null) }}
            style={{
              padding: '5px 20px', borderRadius: 20, border: `1px solid ${accent}60`,
              background: 'rgba(255,255,255,0.55)', color: accent, fontSize: 15, fontWeight: 700,
              cursor: 'pointer', backdropFilter: 'blur(4px)', letterSpacing: '0.5px'
            }}
          >
            {YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>

        {/* Spiral rings */}
        <div style={{ display: 'flex', gap: 4, padding: '0 18px', justifyContent: 'center' }}>
          {Array.from({ length: 22 }, (_, i) => (
            <div key={i} className="ring"
              style={{
                width: 10, height: 14, border: `2px solid ${accent}60`,
                borderRadius: '50% 50% 0 0/55% 55% 0 0', position: 'relative', flexShrink: 0
              }} />
          ))}
        </div>

        {/* Card */}
        <div style={{
          background: cardBg, backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          borderRadius: '0 0 16px 16px', boxShadow: '0 20px 60px rgba(0,0,0,0.13),0 4px 16px rgba(0,0,0,0.07)',
          border: `1px solid ${border}`, overflow: 'hidden'
        }}>

          {/* Hero */}
          <div className={flipping ? 'flip' : ''}
            style={{ background: heroGrad, padding: '24px 20px 18px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: -10, top: -10, width: 90, height: 90, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.2)' }} />
            <div style={{ position: 'absolute', right: 20, top: -30, width: 120, height: 120, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.12)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button className="arrow" onClick={() => flip(-1)}
                style={{
                  background: 'rgba(255,255,255,0.28)', border: 'none', color: '#fff', width: 38, height: 38,
                  borderRadius: '50%', cursor: 'pointer', fontSize: 22, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', backdropFilter: 'blur(4px)', transition: 'background 0.2s', fontWeight: 400
                }}>
                ‹
              </button>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontFamily: "'Cormorant Garamond',serif", fontSize: 48, fontWeight: 300,
                  color: '#fff', lineHeight: 1, fontStyle: 'italic', textShadow: '0 2px 16px rgba(0,0,0,0.18)'
                }}>
                  {MONTHS[month]}
                </div>
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', letterSpacing: '5px', marginTop: 5, fontWeight: 500 }}>
                  {year}
                </div>
              </div>
              <button className="arrow" onClick={() => flip(1)}
                style={{
                  background: 'rgba(255,255,255,0.28)', border: 'none', color: '#fff', width: 38, height: 38,
                  borderRadius: '50%', cursor: 'pointer', fontSize: 22, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', backdropFilter: 'blur(4px)', transition: 'background 0.2s', fontWeight: 400
                }}>
                ›
              </button>
            </div>
            <div style={{ textAlign: 'center', marginTop: 12 }}>
              <span style={{
                background: 'rgba(255,255,255,0.32)', borderRadius: 20, padding: '5px 16px',
                fontSize: 12, color: '#fff', letterSpacing: '0.5px', backdropFilter: 'blur(4px)', fontWeight: 500
              }}>
                Today — {today.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' })}
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: `1px solid ${border}` }}>
            {[['cal', 'Calendar'], ['notes', 'Notes']].map(([id, label]) => (
              <div key={id} className="tab" onClick={() => setTab(id)}
                style={{
                  flex: 1, textAlign: 'center', padding: '12px 0', fontSize: 13, fontWeight: 600,
                  letterSpacing: '0.5px', color: tab === id ? accent : sub,
                  borderBottom: tab === id ? `2.5px solid ${accent}` : '2.5px solid transparent',
                  cursor: 'pointer', transition: 'all 0.2s'
                }}>
                {label}
              </div>
            ))}
          </div>

          {tab === 'cal' && (
            <div style={{ padding: '12px 14px 10px' }}>
              {/* Stats */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                {[
                  [Object.keys(notes).length, 'notes saved'],
                  [diff ? `${diff}d` : '—', 'selected'],
                  [Object.keys(moods).length, 'moods logged'],
                ].map(([n, l]) => (
                  <div key={l} style={{
                    flex: 1, background: `${accent}14`, borderRadius: 10, padding: '8px 4px',
                    textAlign: 'center', border: `1px solid ${border}`
                  }}>
                    <div style={{ fontSize: 20, fontWeight: 600, color: accent, lineHeight: 1, fontFamily: "'Cormorant Garamond',serif" }}>{n}</div>
                    <div style={{ fontSize: 9.5, color: sub, marginTop: 3, letterSpacing: '0.3px', fontWeight: 500 }}>{l}</div>
                  </div>
                ))}
              </div>

              {/* Chips */}
              <div style={{ display: 'flex', gap: 5, marginBottom: 10, flexWrap: 'wrap' }}>
                {[
                  ['This Week', () => {
                    const s = new Date(today); s.setDate(s.getDate() - s.getDay())
                    const e = new Date(today); e.setDate(e.getDate() + (6 - e.getDay()))
                    setStart(s); setEnd(e)
                  }],
                  ['Next 7', () => {
                    const e = new Date(today); e.setDate(e.getDate() + 6)
                    setStart(new Date(today)); setEnd(e)
                  }],
                  ['Month', () => {
                    setStart(new Date(year, month, 1))
                    setEnd(new Date(year, month + 1, 0))
                  }],
                ].map(([l, fn]) => (
                  <div key={l} className="chip" onClick={fn}
                    style={{
                      fontSize: 12, padding: '5px 14px', background: `${accent}18`, border: `1px solid ${border}`,
                      borderRadius: 20, cursor: 'pointer', color: accent, fontWeight: 600, transition: 'all 0.18s'
                    }}>
                    {l}
                  </div>
                ))}
              </div>

              {/* Day headers */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', marginBottom: 4 }}>
                {DAYS.map((d, i) => (
                  <div key={i} style={{
                    textAlign: 'center', fontSize: 11, fontWeight: 700,
                    letterSpacing: '0.5px', color: i === 0 || i === 6 ? accent : sub,
                    paddingBottom: 4
                  }}>
                    {d}
                  </div>
                ))}
              </div>

              {/* Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3 }}>
                {days.map((date, i) => {
                  if (!date) return <div key={i} />
                  const isS = same(date, start), isE = same(date, end)
                  const inR = start && end && date > start && date < end
                  const inP = start && !end && hover && date > start && date <= hover
                  const isW = date.getDay() === 0 || date.getDay() === 6
                  const isTod = same(date, today)
                  const hol = HOLIDAYS[dk(date)], hasN = notes[dk(date)], hasMood = moods[dk(date)]
                  return (
                    <div key={i}
                      className={`cell${isTod && !isS && !isE ? ' today-glow' : ''}`}
                      onClick={() => clickDay(date)}
                      onMouseEnter={() => { if (!end) setHover(date) }}
                      onMouseLeave={() => { if (!end) setHover(null) }}
                      title={hol || ''}
                      style={{
                        minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexDirection: 'column', borderRadius: 10, fontSize: 18,
                        fontWeight: isS || isE ? 700 : isTod ? 700 : 500,
                        cursor: 'pointer', transition: 'transform 0.15s,background 0.1s', position: 'relative',
                        color: isS || isE ? '#fff' : isW ? accent : textMain,
                        background: isS || isE ? accent : inR ? `${accent}28` : inP ? `${accent}14` : hasN ? `${accent}14` : 'transparent',
                      }}>
                      <span style={{ lineHeight: 1.2 }}>{date.getDate()}</span>
                      <div style={{ display: 'flex', gap: 2, marginTop: 2, alignItems: 'center' }}>
                        {hasN && <div style={{ width: 5, height: 5, background: isS || isE ? '#fff' : accent, borderRadius: '50%' }} />}
                        {hol && <div style={{ width: 5, height: 5, background: '#e07050', borderRadius: '50%' }} />}
                        {hasMood && <div style={{ fontSize: 11, lineHeight: 1 }}>{moods[dk(date)]}</div>}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {tab === 'notes' && (
            <div style={{ padding: '12px 16px', maxHeight: 300, overflowY: 'auto' }}>
              {Object.keys(notes).length === 0 ? (
                <div style={{
                  textAlign: 'center', padding: '36px 0', color: sub, fontSize: 18,
                  fontFamily: "'Cormorant Garamond',serif", fontStyle: 'italic'
                }}>
                  No notes yet
                </div>
              ) : (
                Object.entries(notes).sort(([a], [b]) => b.localeCompare(a)).map(([k, v]) => {
                  const [yr, mo, d] = k.split('-').map(Number)
                  const date = new Date(yr, mo, d)
                  return (
                    <div key={k} className="note-row"
                      onClick={() => { setSel(date); setNote(v); setTab('cal') }}
                      style={{ padding: '10px 8px', borderBottom: `1px solid ${border}`, cursor: 'pointer', transition: 'background 0.15s' }}>
                      <div style={{ fontSize: 12, color: sub, marginBottom: 3, letterSpacing: '0.3px', fontWeight: 600 }}>
                        {date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                        {moods[k] && <span style={{ marginLeft: 6, fontSize: 14 }}>{moods[k]}</span>}
                      </div>
                      <div style={{ fontSize: 15, color: textMain, fontFamily: "'Caveat',cursive", fontWeight: 600 }}>
                        {v.slice(0, 60)}{v.length > 60 ? '…' : ''}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )}

          {/* Note editor */}
          {sel && tab === 'cal' && (
            <div style={{ padding: '12px 16px 16px', borderTop: `1px solid ${border}`, background: `${accent}08` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontFamily: "'Caveat',cursive", fontSize: 20, color: accent, fontWeight: 600 }}>
                  {sel.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                </div>
                <button onClick={() => setSel(null)}
                  style={{ background: 'none', border: 'none', color: sub, cursor: 'pointer', fontSize: 20, lineHeight: 1, fontWeight: 600 }}>
                  ×
                </button>
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10, alignItems: 'center' }}>
                {MOODS.map((m) => (
                  <span key={m} className="mood-btn" onClick={() => setMoodPick(m)}
                    style={{
                      fontSize: 22, cursor: 'pointer', transition: 'transform 0.15s',
                      opacity: moodPick === m ? 1 : 0.45, filter: moodPick === m ? 'none' : 'grayscale(0.4)'
                    }}>
                    {m}
                  </span>
                ))}
                <span style={{ fontSize: 12, color: sub, alignSelf: 'center', marginLeft: 2, fontWeight: 600 }}>mood</span>
              </div>
              <textarea value={note} onChange={(e) => setNote(e.target.value)}
                placeholder="write something..."
                style={{
                  width: '100%', height: 56, border: `1px solid ${border}`, borderRadius: 10,
                  padding: '10px 12px', fontFamily: "'Caveat',cursive", fontSize: 17, color: textMain,
                  resize: 'none', background: 'rgba(255,255,255,0.65)', outline: 'none', transition: 'border 0.2s',
                  fontWeight: 600
                }}
                onFocus={(e) => (e.target.style.borderColor = `${accent}80`)}
                onBlur={(e) => (e.target.style.borderColor = border)} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 9 }}>
                <button className="save-btn" onClick={save}
                  style={{
                    padding: '7px 22px', background: accent, color: '#fff', border: 'none',
                    borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    transition: 'all 0.15s', letterSpacing: '0.3px', boxShadow: `0 4px 14px ${accent}45`
                  }}>
                  Save
                </button>
                {notes[dk(sel)] && <span style={{ fontSize: 13, color: accent, fontWeight: 600 }}>✓ saved</span>}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}