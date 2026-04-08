'use client'
import Calendar from '../components/Calendar'
import SheepClock from '../components/SheepClock'

export default function Page() {
  return (
    <main
      style={{
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 60,
        padding: 24,
        flexWrap: 'wrap',
      }}
    >
      <SheepClock />
      <Calendar />
    </main>
  )
}