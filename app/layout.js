import './globals.css'

export const metadata = {
  title: 'Wall Calendar',
  description: 'Interactive wall calendar with date range & notes',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
