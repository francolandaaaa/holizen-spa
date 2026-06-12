'use client'

import { motion } from 'framer-motion'
import CalendarBooking from './CalendarBooking'

const GOLD = '#C9A84C'

const glass = {
  background: 'rgba(255,255,255,0.025)',
  backdropFilter: 'blur(28px)',
  WebkitBackdropFilter: 'blur(28px)',
  border: '1px solid rgba(201,168,76,0.12)',
}

export default function BookingSection() {
  return (
    <section
      id="agendar"
      className="px-6 md:px-12 lg:px-24"
      style={{ background: 'rgba(10, 24, 22, 0.88)', paddingTop: '5.6rem', paddingBottom: '5.6rem' }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.88 }}
          className="mb-16 text-center"
        >
          <p
            className="text-sm uppercase mb-4"
            style={{ color: GOLD, letterSpacing: '0.38em', fontFamily: 'var(--font-cormorant)' }}
          >
            Tu Momento de Bienestar
          </p>
          <h2
            className="font-light"
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: 'clamp(38px, 5.5vw, 64px)',
              background: `linear-gradient(135deg, ${GOLD} 0%, #F0D890 45%, ${GOLD} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Reservar Experiencia
          </h2>
          <div className="w-14 h-px mx-auto mt-6 mb-6" style={{ background: GOLD }} />
          <p
            className="text-base max-w-sm mx-auto leading-relaxed"
            style={{
              fontFamily: 'var(--font-cormorant)',
              fontSize: 'clamp(14px, 1.5vw, 17px)',
              fontStyle: 'italic',
              color: 'rgba(245,238,224,0.38)',
            }}
          >
            Selecciona tu fecha y servicio. Nos pondremos en contacto para confirmar tu cita.
          </p>
        </motion.div>

        {/* Form card — id="booking-form" lets the hero CTA scroll here directly */}
        <motion.div
          id="booking-form"
          initial={{ opacity: 0, y: 44 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.90, delay: 0.15 }}
          className="p-8 md:p-12"
          style={glass}
        >
          <CalendarBooking />
        </motion.div>
      </div>
    </section>
  )
}
