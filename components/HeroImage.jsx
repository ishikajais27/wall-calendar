const MONTHS = [
  'JANUARY',
  'FEBRUARY',
  'MARCH',
  'APRIL',
  'MAY',
  'JUNE',
  'JULY',
  'AUGUST',
  'SEPTEMBER',
  'OCTOBER',
  'NOVEMBER',
  'DECEMBER',
]
const EMOJI = [
  '🏔️',
  '🌸',
  '🌿',
  '🌧️',
  '🌺',
  '🌊',
  '🌅',
  '🌻',
  '🍂',
  '🎃',
  '🍁',
  '❄️',
]
const GRADIENTS = [
  'linear-gradient(135deg, #d5b8a8 0%, #b8956a 100%)',
  'linear-gradient(135deg, #d4a5a5 0%, #c8956f 100%)',
  'linear-gradient(135deg, #b8d5a5 0%, #8fc080 100%)',
  'linear-gradient(135deg, #a5c8d5 0%, #7fafbe 100%)',
  'linear-gradient(135deg, #d5a5b8 0%, #b88a70 100%)',
  'linear-gradient(135deg, #d5c8a5 0%, #b8a580 100%)',
  'linear-gradient(135deg, #b8c8d5 0%, #8fa5b8 100%)',
  'linear-gradient(135deg, #d5b898 0%, #b8956a 100%)',
  'linear-gradient(135deg, #c8a896 0%, #8b7355 100%)',
  'linear-gradient(135deg, #d5a58a 0%, #c8795f 100%)',
  'linear-gradient(135deg, #8ba57a 0%, #6b8a60 100%)',
  'linear-gradient(135deg, #b8a599 0%, #8b7a65 100%)',
]

export default function HeroImage({ month, year }) {
  return (
    <div
      style={{
        background: GRADIENTS[month],
        minHeight: '220px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at 35% 45%, rgba(255,255,255,0.15), transparent 55%)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 5,
          bottom: -15,
          fontSize: '50px',
          opacity: 0.1,
          transform: 'rotate(-15deg)',
          animation: 'float 6s ease-in-out infinite',
        }}
      >
        🌿
      </div>
      <div
        style={{
          position: 'absolute',
          right: 10,
          bottom: -20,
          fontSize: '60px',
          opacity: 0.09,
          transform: 'rotate(20deg)',
          animation: 'float 6s ease-in-out infinite 0.3s',
        }}
      >
        🪴
      </div>

      <span
        style={{
          fontSize: '90px',
          filter: 'drop-shadow(0 6px 20px rgba(0,0,0,0.25))',
          position: 'relative',
          zIndex: 2,
          animation: 'float 4s ease-in-out infinite',
        }}
      >
        {EMOJI[month]}
      </span>

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background:
            'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.35) 100%)',
          padding: '50px 20px 18px',
          textAlign: 'right',
        }}
      >
        <div
          style={{
            fontSize: '36px',
            fontWeight: 900,
            color: '#fff',
            textShadow: '0 3px 10px rgba(0,0,0,0.5)',
            letterSpacing: '-1px',
            fontFamily: 'var(--font-poppins)',
          }}
        >
          {year}
        </div>
        <div
          style={{
            fontSize: '12px',
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '4px',
            textShadow: '0 2px 5px rgba(0,0,0,0.4)',
            fontFamily: 'var(--font-poppins)',
          }}
        >
          {MONTHS[month]}
        </div>
      </div>
    </div>
  )
}
