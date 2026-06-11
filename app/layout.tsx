import type { Metadata } from 'next'
import { Cinzel } from 'next/font/google'
import { Cormorant_Garamond } from 'next/font/google'
import './globals.css'

const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-cinzel',
})

const cormorant = Cormorant_Garamond({
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
  variable: '--font-cormorant',
})

export const metadata: Metadata = {
  title: 'Holizen Spa — Santuario de Bienestar en Puebla',
  description: 'Holizen Spa: un santuario de bienestar para cuerpo, mente y espíritu en Puebla. Masajes, faciales, rituales holísticos y experiencias de relajación exclusivas. Agenda tu cita.',
  keywords: 'spa puebla, masajes puebla, relajación, bienestar, holizen spa, ritual holístico, facial, tratamiento corporal',
  openGraph: {
    title: 'Holizen Spa — Santuario de Bienestar',
    description: 'Un santuario de bienestar para cuerpo, mente y espíritu. Masajes, faciales y rituales holísticos en Puebla.',
    type: 'website',
    locale: 'es_MX',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${cinzel.variable} ${cormorant.variable}`}>
      <body className="antialiased" style={{ background: '#0D0A06', color: '#F5EEE0' }}>
        {children}
      </body>
    </html>
  )
}
