const THEMES = [
  {
    label: 'January',
    emoji: '❄️',
    bg: 'linear-gradient(135deg,#dbeafe,#bfdbfe)',
    accent: '#1e40af',
    sub: '#3b82f6',
  },
  {
    label: 'February',
    emoji: '🌸',
    bg: 'linear-gradient(135deg,#fce7f3,#fbcfe8)',
    accent: '#9d174d',
    sub: '#ec4899',
  },
  {
    label: 'March',
    emoji: '🌿',
    bg: 'linear-gradient(135deg,#d1fae5,#a7f3d0)',
    accent: '#065f46',
    sub: '#10b981',
  },
  {
    label: 'April',
    emoji: '🌧️',
    bg: 'linear-gradient(135deg,#e0f2fe,#bae6fd)',
    accent: '#0c4a6e',
    sub: '#0ea5e9',
  },
  {
    label: 'May',
    emoji: '🌺',
    bg: 'linear-gradient(135deg,#fef9c3,#fde68a)',
    accent: '#854d0e',
    sub: '#f59e0b',
  },
  {
    label: 'June',
    emoji: '☀️',
    bg: 'linear-gradient(135deg,#ffedd5,#fed7aa)',
    accent: '#9a3412',
    sub: '#f97316',
  },
  {
    label: 'July',
    emoji: '🏖️',
    bg: 'linear-gradient(135deg,#fef3c7,#fde68a)',
    accent: '#92400e',
    sub: '#f59e0b',
  },
  {
    label: 'August',
    emoji: '🌻',
    bg: 'linear-gradient(135deg,#dcfce7,#bbf7d0)',
    accent: '#14532d',
    sub: '#22c55e',
  },
  {
    label: 'September',
    emoji: '🍂',
    bg: 'linear-gradient(135deg,#ffedd5,#fed7aa)',
    accent: '#7c2d12',
    sub: '#ea580c',
  },
  {
    label: 'October',
    emoji: '🎃',
    bg: 'linear-gradient(135deg,#fee2e2,#fecaca)',
    accent: '#991b1b',
    sub: '#ef4444',
  },
  {
    label: 'November',
    emoji: '🍁',
    bg: 'linear-gradient(135deg,#fef3c7,#fde68a)',
    accent: '#78350f',
    sub: '#d97706',
  },
  {
    label: 'December',
    emoji: '🎄',
    bg: 'linear-gradient(135deg,#dcfce7,#bbf7d0)',
    accent: '#14532d',
    sub: '#16a34a',
  },
]

export default function HeroImage({ month, year }) {
  const t = THEMES[month]
  return (
    <div
      className="relative overflow-hidden flex flex-col items-center justify-center text-center"
      style={{ background: t.bg, minHeight: '220px', padding: '2rem' }}
    >
      {/* Decorative blobs */}
      <div
        className="absolute rounded-full opacity-20"
        style={{
          width: 130,
          height: 130,
          top: 0,
          right: 0,
          background: t.sub,
          transform: 'translate(35%,-35%)',
        }}
      />
      <div
        className="absolute rounded-full opacity-20"
        style={{
          width: 90,
          height: 90,
          bottom: 0,
          left: 0,
          background: t.sub,
          transform: 'translate(-35%,35%)',
        }}
      />

      {/* Texture lines */}
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="absolute opacity-10"
          style={{
            height: 1,
            background: t.accent,
            width: '80%',
            top: `${25 + i * 18}%`,
            left: '10%',
          }}
        />
      ))}

      <div
        className="text-7xl mb-3 relative z-10"
        style={{
          lineHeight: 1,
          filter: 'drop-shadow(0 4px 8px rgba(0,0,0,.12))',
        }}
      >
        {t.emoji}
      </div>
      <div
        className="text-2xl font-bold uppercase tracking-widest relative z-10"
        style={{
          color: t.accent,
          fontFamily: 'Georgia,serif',
          letterSpacing: '.15em',
        }}
      >
        {t.label}
      </div>
      <div
        className="text-sm mt-1 font-semibold tracking-widest relative z-10"
        style={{ color: t.sub, opacity: 0.8 }}
      >
        {year}
      </div>
      <div
        className="mt-4 w-12 rounded-full relative z-10"
        style={{ height: 2, background: t.accent, opacity: 0.4 }}
      />
    </div>
  )
}
