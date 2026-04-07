import { Caveat, Poppins, Playfair_Display } from 'next/font/google'
import './globals.css'

const caveat = Caveat({ subsets: ['latin'], weight: ['400', '700'] })
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
})
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata = {
  title: 'Wall Calendar',
  description: 'Beautiful wall-mounted calendar with date notes',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: poppins.style.fontFamily,
          '--font-caveat': caveat.style.fontFamily,
          '--font-playfair': playfair.style.fontFamily,
        }}
      >
        <style>{`
          :root {
            --font-caveat: ${caveat.style.fontFamily};
            --font-playfair: ${playfair.style.fontFamily};
            --font-poppins: ${poppins.style.fontFamily};
          }
        `}</style>
        {children}
      </body>
    </html>
  )
}
