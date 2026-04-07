import { MONTH_EMOJIS, MONTHS } from './Calendar'

const MONTH_PLACEHOLDERS = [
  "What's your January goal? Write it down before midnight...",
  "Valentine's plans? Secret garden? Spontaneous trip? Note it here.",
  'Spring plans, March goals, bloom dates — all go here.',
  'April showers bring... your notes. Write freely.',
  'May your month be note-worthy. Start here.',
  'Sunscreen, plans, summer bucket list — your canvas.',
  "Halfway through the year. What's still on the list?",
  'August hustle notes. Stay golden.',
  'Autumn reflections. What are you letting go?',
  'Spooky plans, costume ideas, October wins...',
  'Gratitude list, November memories, holiday prep...',
  'Wrap the year beautifully. Final notes, final wins.',
]

export default function NotesPanel({
  notes,
  onChange,
  startDate,
  endDate,
  rangeKey,
}) {
  const fmt = (d) =>
    d ? d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : null
  const diff =
    startDate && endDate
      ? Math.round(Math.abs(endDate - startDate) / 86400000) + 1
      : null

  const today = new Date()
  const month = startDate ? startDate.getMonth() : today.getMonth()

  const label =
    startDate && endDate
      ? `${fmt(startDate)} – ${fmt(endDate)}`
      : startDate
        ? `From ${fmt(startDate)}`
        : MONTHS[month]

  const placeholder =
    startDate && endDate
      ? `Pack for ${fmt(startDate)}–${fmt(endDate)}... don't forget your energy.`
      : startDate
        ? 'Click another date to set the end of your range...'
        : MONTH_PLACEHOLDERS[month]

  const isPinned = rangeKey != null

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        minHeight: 300,
        padding: 20,
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 10 }}>
        <div
          style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#999',
            marginBottom: 4,
          }}
        >
          📝 Notes
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 20 }}>{MONTH_EMOJIS[month]}</span>
          <span
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: 'var(--ink)',
              flex: 1,
            }}
          >
            {label}
          </span>
          {isPinned && (
            <span
              title="Note pinned to this date range"
              style={{ fontSize: 14, cursor: 'default' }}
            >
              📌
            </span>
          )}
        </div>

        {diff && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              marginTop: 8,
              background: 'var(--yellow)',
              color: 'var(--ink)',
              fontSize: 10,
              fontWeight: 700,
              padding: '3px 10px',
              borderRadius: 20,
            }}
          >
            {diff} DAY{diff > 1 ? 'S' : ''} {diff >= 7 ? '🗓️' : '⚡'}
          </div>
        )}

        {startDate && !endDate && (
          <p
            style={{
              fontSize: 10,
              color: '#aaa',
              marginTop: 6,
              fontStyle: 'italic',
            }}
          >
            Click another date to complete your range
          </p>
        )}
      </div>

      {/* Lined textarea */}
      <div style={{ flex: 1, position: 'relative' }}>
        <textarea
          value={notes}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          style={{
            width: '100%',
            minHeight: 180,
            height: '100%',
            resize: 'none',
            border: 'none',
            outline: 'none',
            background:
              'repeating-linear-gradient(transparent, transparent 27px, #d4d0c8 28px)',
            lineHeight: '28px',
            padding: '2px 8px 2px 28px',
            fontSize: 12,
            color: 'var(--ink)',
            fontFamily: 'Georgia, serif',
            borderRadius: 0,
          }}
        />
        {/* Red margin line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 22,
            width: 1,
            background: 'rgba(214,48,49,0.35)',
            pointerEvents: 'none',
          }}
        />
      </div>

      <div
        style={{
          fontSize: 9,
          color: '#bbb',
          textAlign: 'right',
          marginTop: 6,
          fontWeight: 700,
        }}
      >
        {notes.length} chars {isPinned ? '· pinned to range' : '· monthly note'}
      </div>

      {/* Smiley deco */}
      <div style={{ textAlign: 'center', marginTop: 10 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'var(--ink)',
            color: 'var(--cream)',
            fontSize: 18,
          }}
        >
          🙂
        </div>
      </div>
    </div>
  )
}
