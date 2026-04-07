export default function NotesPanel({ notes, onChange, startDate, endDate }) {
  const fmt = (d) =>
    d ? d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : null
  const diff =
    startDate && endDate
      ? Math.round(Math.abs(endDate - startDate) / 86400000) + 1
      : null

  const label =
    startDate && endDate
      ? `Notes: ${fmt(startDate)} – ${fmt(endDate)}`
      : startDate
        ? `Notes from ${fmt(startDate)}`
        : 'Monthly Notes'

  return (
    <div
      className="flex flex-col flex-1 p-4"
      style={{ borderTop: '1px solid #d4c4a8' }}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-base">📝</span>
        <label
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: '#8b7355' }}
        >
          {label}
        </label>
      </div>

      {diff && (
        <p className="text-xs mb-2 font-semibold" style={{ color: '#7c5c3a' }}>
          {diff} day{diff > 1 ? 's' : ''} selected
        </p>
      )}
      {startDate && !endDate && (
        <p className="text-xs mb-2 italic" style={{ color: '#b0a090' }}>
          Click another date to complete range
        </p>
      )}

      <div className="relative flex-1">
        <textarea
          className="w-full resize-none text-sm focus:outline-none"
          style={{
            minHeight: '150px',
            fontFamily: 'Georgia,serif',
            color: '#4a3728',
            background:
              'repeating-linear-gradient(transparent,transparent 23px,#d4c4a8 24px)',
            lineHeight: '24px',
            padding: '2px 8px 2px 30px',
            border: 'none',
            borderRadius: 4,
          }}
          placeholder="Write your notes here…"
          value={notes}
          onChange={(e) => onChange(e.target.value)}
        />
        <div
          className="absolute top-0 bottom-0"
          style={{ left: 24, width: 1, background: '#e8a0a0', opacity: 0.6 }}
        />
      </div>

      <div className="text-right mt-1 text-xs" style={{ color: '#b0a090' }}>
        {notes.length} chars
      </div>
    </div>
  )
}
