'use client'
import { useState, useEffect } from 'react'

export default function SheepClock() {
    const [time, setTime] = useState(new Date())
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const id = setInterval(() => setTime(new Date()), 1000)
        return () => clearInterval(id)
    }, [])

    const s = time.getSeconds()
    const m = time.getMinutes()
    const h = time.getHours() % 12
    const secDeg = s * 6
    const minDeg = m * 6 + s * 0.1
    const hrDeg = h * 30 + m * 0.5

    const size = 260
    const cx = size / 2
    const cy = size / 2 + 30
    const r = size * 0.38
    const numbers = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

    return (
        <>
            <button
                onClick={() => setVisible(v => !v)}
                style={{
                    position: 'fixed', top: 20, right: 24, zIndex: 1000,
                    padding: '20px 28px', borderRadius: 28, border: 'none',
                    cursor: 'pointer', fontSize: 18, fontWeight: 700, letterSpacing: 1,
                    background: 'linear-gradient(135deg, #b8d4e8, #8aafc8)',
                    color: '#fff',
                    boxShadow: '0 4px 16px rgba(138,175,200,0.5)',
                }}
            >
                🕐 Clock
            </button>

            {visible && (
                <div style={{
                    position: 'fixed', top: 64, right: 24, zIndex: 999,
                    userSelect: 'none', width: size + 60, height: size + 80,
                    filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.2))',
                }}>
                    <svg width={size + 60} height={size + 80} viewBox={`0 0 ${size + 60} ${size + 80}`}>
                        <defs>
                            <radialGradient id="wood" cx="40%" cy="40%">
                                <stop offset="0%" stopColor="#daeaf5" />
                                <stop offset="50%" stopColor="#c0d8ec" />
                                <stop offset="100%" stopColor="#a8c8e0" />
                            </radialGradient>
                        </defs>

                        {/* Outer ring */}
                        <ellipse cx={cx + 30} cy={cy} rx={r + 18} ry={(r + 18) * 0.97} fill="#8aafc8" />

                        {/* Clock face */}
                        <ellipse cx={cx + 30} cy={cy} rx={r} ry={r * 0.97} fill="url(#wood)" />

                        {/* Grain rings */}
                        {[0.2, 0.4, 0.6, 0.8].map((f, i) => (
                            <ellipse key={i} cx={cx + 30} cy={cy} rx={r * f} ry={r * f * 0.97}
                                fill="none" stroke="#a8c8e040" strokeWidth={1} />
                        ))}

                        {/* Numbers */}
                        {numbers.map((n, i) => {
                            const angle = (i * 30 - 90) * Math.PI / 180
                            const nr = r * 0.78
                            return (
                                <text key={n}
                                    x={cx + 30 + nr * Math.cos(angle)} y={cy + nr * Math.sin(angle)}
                                    textAnchor="middle" dominantBaseline="central"
                                    fontSize={size * 0.07} fontWeight="600"
                                    fontFamily="sans-serif" fill="#3a6a8a">
                                    {n}
                                </text>
                            )
                        })}

                        {/* Hour hand */}
                        <line x1={cx + 30} y1={cy}
                            x2={cx + 30 + r * 0.5 * Math.cos((hrDeg - 90) * Math.PI / 180)}
                            y2={cy + r * 0.5 * Math.sin((hrDeg - 90) * Math.PI / 180)}
                            stroke="#1a1a1a" strokeWidth={3.5} strokeLinecap="round" />

                        {/* Minute hand */}
                        <line x1={cx + 30} y1={cy}
                            x2={cx + 30 + r * 0.7 * Math.cos((minDeg - 90) * Math.PI / 180)}
                            y2={cy + r * 0.7 * Math.sin((minDeg - 90) * Math.PI / 180)}
                            stroke="#1a1a1a" strokeWidth={2.5} strokeLinecap="round" />

                        {/* Second hand */}
                        <line x1={cx + 30} y1={cy}
                            x2={cx + 30 + r * 0.8 * Math.cos((secDeg - 90) * Math.PI / 180)}
                            y2={cy + r * 0.8 * Math.sin((secDeg - 90) * Math.PI / 180)}
                            stroke="#cc2200" strokeWidth={1.5} strokeLinecap="round" />

                        {/* Center dot */}
                        <circle cx={cx + 30} cy={cy} r={5} fill="#8aafc8" />

                        {/* Cat torso */}
                        <ellipse cx={cx + 30} cy={cy - r * 0.6} rx={r * 0.55} ry={r * 0.38} fill="#1a1a1a" />

                        {/* Cat ears */}
                        <polygon points={`${cx + 30 - r * 0.35},${cy - r * 0.85} ${cx + 30 - r * 0.5},${cy - r * 1.1} ${cx + 30 - r * 0.18},${cy - r * 0.9}`} fill="#1a1a1a" />
                        <polygon points={`${cx + 30 + r * 0.35},${cy - r * 0.85} ${cx + 30 + r * 0.5},${cy - r * 1.1} ${cx + 30 + r * 0.18},${cy - r * 0.9}`} fill="#1a1a1a" />

                        {/* Cat face */}
                        <ellipse cx={cx + 30} cy={cy - r * 0.62} rx={r * 0.38} ry={r * 0.3} fill="#1a1a1a" />

                        {/* Eyes */}
                        <circle cx={cx + 30 - r * 0.14} cy={cy - r * 0.68} r={r * 0.07} fill="white" />
                        <circle cx={cx + 30 + r * 0.14} cy={cy - r * 0.68} r={r * 0.07} fill="white" />
                        <circle cx={cx + 30 - r * 0.12} cy={cy - r * 0.67} r={r * 0.035} fill="#1a1a1a" />
                        <circle cx={cx + 30 + r * 0.16} cy={cy - r * 0.67} r={r * 0.035} fill="#1a1a1a" />
                        <circle cx={cx + 30 - r * 0.1} cy={cy - r * 0.71} r={r * 0.018} fill="white" />
                        <circle cx={cx + 30 + r * 0.18} cy={cy - r * 0.71} r={r * 0.018} fill="white" />

                        {/* Nose */}
                        <circle cx={cx + 30} cy={cy - r * 0.57} r={r * 0.02} fill="#555" />

                        {/* Paws */}
                        <ellipse cx={cx + 30 - r * 0.88} cy={cy - r * 0.1} rx={r * 0.16} ry={r * 0.12} fill="#1a1a1a" />
                        <ellipse cx={cx + 30 + r * 0.88} cy={cy - r * 0.1} rx={r * 0.16} ry={r * 0.12} fill="#1a1a1a" />

                        {/* Tail */}
                        <path d={`M${cx + 30 + r * 0.3},${cy + r * 0.9} Q${cx + 30 + r * 0.7},${cy + r * 1.1} ${cx + 30 + r * 0.5},${cy + r * 1.3}`}
                            fill="none" stroke="#1a1a1a" strokeWidth={r * 0.08} strokeLinecap="round" />
                    </svg>
                </div>
            )}
        </>
    )
}