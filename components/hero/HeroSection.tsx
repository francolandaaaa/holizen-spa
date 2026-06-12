'use client'

import { motion } from 'framer-motion'

// ThreeCanvas is rendered in app/page.tsx outside the IntroReveal wrapper.
// HeroSection only contains the text + nav layer.

const ease: [number, number, number, number] = [0.16, 1, 0.3, 1]

const NAV_LINKS = [
  { label: 'SERVICIOS', href: '#servicios' },
  { label: 'RESERVAR',  href: '#agendar'  },
  { label: 'UBICACIÓN', href: '#ubicacion' },
]

export default function HeroSection() {
  return (
    <section id="inicio" className="relative h-screen overflow-hidden" style={{ background: 'transparent' }}>
      {/* Radial vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 38%, transparent 18%, rgba(13,10,6,0.55) 100%)',
        }}
      />

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-56 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, #0A1818)' }}
      />

      {/* Nav
          Delays start at 1.5s so animations play as IntroReveal fades the page in */}
      <nav className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-8 md:px-14 py-7">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.5 }}
          style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
        >
          <img
            src="/logo-holizen.png"
            alt="Holizen Spa"
            style={{ width: '38px', height: '38px', objectFit: 'contain', filter: 'invert(1) sepia(1) saturate(2) hue-rotate(10deg) brightness(0.85)' }}
          />
          <span style={{
            fontFamily: 'var(--font-cinzel)',
            fontSize: '15px',
            letterSpacing: '0.35em',
            color: '#C9A84C',
            fontWeight: 400,
          }}>
            HOLIZEN SPA
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.8 }}
          className="hidden md:flex gap-10"
        >
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="transition-colors duration-300 uppercase"
              style={{ color: 'rgba(245,238,224,0.40)', fontFamily: 'var(--font-cormorant)', fontSize: '13px', letterSpacing: '0.28em' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#C9A84C' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(245,238,224,0.40)' }}
            >
              {link.label}
            </a>
          ))}
        </motion.div>
      </nav>

      {/* Hero Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none px-6 text-center">

        {/* Eyebrow — same letter-spacing animation as before, timed to reveal */}
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.7em' }}
          animate={{ opacity: 0.80, letterSpacing: '0.38em' }}
          transition={{ duration: 2.4, delay: 1.5 }}
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'clamp(11px, 1.2vw, 14px)',
            color: '#C9A84C',
            textTransform: 'uppercase',
            marginBottom: '1.4rem',
          }}
        >
          Bienestar · Armonía · Serenidad
        </motion.p>

        {/* Main title */}
        <motion.h1
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.4, ease, delay: 1.7 }}
          style={{
            fontFamily: 'var(--font-cinzel)',
            fontSize: 'clamp(48px, 9.5vw, 120px)',
            fontWeight: 400,
            letterSpacing: '0.18em',
            lineHeight: 1,
            marginBottom: '0.5rem',
            background: 'linear-gradient(160deg, #F5EEE0 20%, #E8C870 55%, #F5EEE0 82%)',
            backgroundSize: '220% auto',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            animation: 'lotus-shimmer 7s linear infinite',
          }}
        >
          HOLIZEN
        </motion.h1>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.1, ease, delay: 2.0 }}
          style={{
            fontFamily: 'var(--font-cinzel)',
            fontSize: 'clamp(16px, 2.8vw, 36px)',
            fontWeight: 400,
            color: '#C9A84C',
            letterSpacing: '0.55em',
            marginBottom: '1.8rem',
          }}
        >
          SPA
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.0, delay: 2.3 }}
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: 'clamp(14px, 1.5vw, 18px)',
            fontStyle: 'italic',
            color: 'rgba(245,238,224,0.58)',
            letterSpacing: '0.06em',
            marginBottom: '2.8rem',
            maxWidth: '440px',
            lineHeight: 1.7,
          }}
        >
          Un santuario de bienestar para cuerpo, mente y espíritu
        </motion.p>

        <motion.a
          href="#booking-form"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease, delay: 2.6 }}
          className="pointer-events-auto tracking-[0.35em] uppercase px-12 py-4 transition-all duration-500"
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: '13px',
            border: '1px solid rgba(201,168,76,0.65)',
            color: '#C9A84C',
            background: 'linear-gradient(135deg, rgba(201,168,76,0.10), rgba(201,168,76,0.03))',
            animation: 'pulse-rose 4s ease-in-out infinite',
            letterSpacing: '0.35em',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = '#C9A84C'
            e.currentTarget.style.color = '#0A1818'
            e.currentTarget.style.boxShadow = '0 0 50px rgba(201,168,76,0.55)'
            e.currentTarget.style.animation = 'none'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'linear-gradient(135deg, rgba(201,168,76,0.10), rgba(201,168,76,0.03))'
            e.currentTarget.style.color = '#C9A84C'
            e.currentTarget.style.boxShadow = ''
            e.currentTarget.style.animation = 'pulse-rose 4s ease-in-out infinite'
          }}
        >
          Reservar Experiencia
        </motion.a>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3.2, duration: 1.2 }}
        className="absolute bottom-9 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
      >
        <span
          style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: '11px',
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: 'rgba(245,238,224,0.22)',
          }}
        >
          Descubrir
        </span>
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          style={{
            width: '1px',
            height: '55px',
            background: 'linear-gradient(to bottom, #C9A84C, transparent)',
          }}
        />
      </motion.div>
    </section>
  )
}
